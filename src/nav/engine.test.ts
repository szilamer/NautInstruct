import { describe, expect, it } from 'vitest'
import {
  anchorScopeSufficient,
  buoySideViolated,
  detectViolation,
  forwardVector,
  isGoalReached,
  stepBoat,
} from './engine'
import type { BoatState, LateralBuoy, NavMission } from './types'

const baseMission: NavMission = {
  id: 'm-test',
  topicId: 'jelzesek',
  title: 'teszt',
  brief: '',
  environment: 'folyo',
  timeOfDay: 'nappal',
  visibility: 'tiszta',
  start: { x: 0, z: 0, heading: 0, speed: 0 },
  buoys: [],
  zones: [{ id: 'goal', x: 0, z: 20, radius: 2, kind: 'goal' }],
  vessels: [],
  hazards: [],
  goalZoneId: 'goal',
  violations: {},
}

describe('forwardVector', () => {
  it('0 irányszögnél előre (+z) mutat', () => {
    const f = forwardVector(0)
    expect(f.x).toBeCloseTo(0)
    expect(f.z).toBeCloseTo(1)
  })
})

describe('stepBoat', () => {
  it('gázra gyorsul és előre halad', () => {
    let s: BoatState = { x: 0, z: 0, heading: 0, speed: 0 }
    for (let i = 0; i < 60; i++) s = stepBoat(s, { turn: 0, throttle: 1 }, 1 / 60)
    expect(s.speed).toBeGreaterThan(0)
    expect(s.z).toBeGreaterThan(0)
    expect(s.x).toBeCloseTo(0, 1)
  })

  it('jobbra kormányozva a heading nő', () => {
    let s: BoatState = { x: 0, z: 0, heading: 0, speed: 6 }
    s = stepBoat(s, { turn: 1, throttle: 1 }, 0.5)
    expect(s.heading).toBeGreaterThan(0)
  })
})

describe('buoySideViolated', () => {
  const buoy: LateralBuoy = { id: 'b', x: 2, z: 10, keepOn: 'starboard', color: 'red' }

  it('nincs sértés, ha a bója a helyes (jobb) oldalon marad', () => {
    // A hajó x=0-nál halad el, a bója x=2 (jobbra) → starboardon van, helyes.
    const prev = { x: 0, z: 9, heading: 0, speed: 5 }
    const next = { x: 0, z: 11, heading: 0, speed: 5 }
    expect(buoySideViolated(prev, next, buoy)).toBe(false)
  })

  it('sértés, ha rossz oldalon hagyja el a bóját', () => {
    // A hajó x=4-nél halad el, a bója x=2 (balra) → nem starboardon, hibás.
    const prev = { x: 4, z: 9, heading: 0, speed: 5 }
    const next = { x: 4, z: 11, heading: 0, speed: 5 }
    expect(buoySideViolated(prev, next, buoy)).toBe(true)
  })

  it('nincs sértés, ha még nem érte el a bója vonalát', () => {
    const prev = { x: 4, z: 5, heading: 0, speed: 5 }
    const next = { x: 4, z: 6, heading: 0, speed: 5 }
    expect(buoySideViolated(prev, next, buoy)).toBe(false)
  })
})

describe('detectViolation', () => {
  it('tiltott zónában no-go sértést ad', () => {
    const m: NavMission = {
      ...baseMission,
      zones: [...baseMission.zones, { id: 'ng', x: 0, z: 5, radius: 3, kind: 'no-go' }],
    }
    const prev = { x: 0, z: 3, heading: 0, speed: 4 }
    const next = { x: 0, z: 4, heading: 0, speed: 4 }
    expect(detectViolation(prev, next, m, false)?.kind).toBe('no-go')
  })

  it('ütközésnél collision sértést ad, prioritással', () => {
    const m: NavMission = {
      ...baseMission,
      vessels: [{ id: 'v', x: 0, z: 5, heading: Math.PI, speed: 0, kind: 'gephajo' }],
    }
    const next = { x: 0, z: 4.5, heading: 0, speed: 4 }
    expect(detectViolation(next, next, m, false)?.kind).toBe('collision')
  })

  it('ködsebesség-túllépésnél fog-speed sértést ad', () => {
    const prev = { x: 0, z: 0, heading: 0, speed: 5 }
    const next = { x: 0, z: 1, heading: 0, speed: 5 }
    expect(detectViolation(prev, next, baseMission, true)?.kind).toBe('fog-speed')
  })

  it('nincs sértés tiszta úton', () => {
    const prev = { x: 0, z: 0, heading: 0, speed: 3 }
    const next = { x: 0, z: 1, heading: 0, speed: 3 }
    expect(detectViolation(prev, next, baseMission, false)).toBeNull()
  })
})

describe('isGoalReached', () => {
  it('true a cél zónában', () => {
    expect(isGoalReached({ x: 0, z: 20, heading: 0, speed: 0 }, baseMission)).toBe(true)
  })
  it('false a célon kívül', () => {
    expect(isGoalReached({ x: 0, z: 0, heading: 0, speed: 0 }, baseMission)).toBe(false)
  })
})

describe('anchorScopeSufficient', () => {
  const m: NavMission = { ...baseMission, anchoring: { depth: 4, minScopeFactor: 3 } }
  it('elég a 3x mélység', () => {
    expect(anchorScopeSufficient(m, 12)).toBe(true)
  })
  it('kevés a 2x mélység', () => {
    expect(anchorScopeSufficient(m, 8)).toBe(false)
  })
})
