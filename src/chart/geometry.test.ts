import { describe, expect, it } from 'vitest'
import { angleDiff, bearing, bearingUnitVector, distance, intersectionOfBearings, relativeBearing } from './geometry'

describe('bearing', () => {
  it('északra 0°', () => {
    expect(bearing({ x: 0, y: 0 }, { x: 0, y: -10 })).toBeCloseTo(0)
  })
  it('keletre 90°', () => {
    expect(bearing({ x: 0, y: 0 }, { x: 10, y: 0 })).toBeCloseTo(90)
  })
  it('délre 180°', () => {
    expect(bearing({ x: 0, y: 0 }, { x: 0, y: 10 })).toBeCloseTo(180)
  })
  it('nyugatra 270°', () => {
    expect(bearing({ x: 0, y: 0 }, { x: -10, y: 0 })).toBeCloseTo(270)
  })
})

describe('distance', () => {
  it('pitagorasz', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBeCloseTo(5)
  })
})

describe('angleDiff', () => {
  it('körkörös különbség', () => {
    expect(angleDiff(10, 350)).toBeCloseTo(20)
    expect(angleDiff(90, 270)).toBeCloseTo(180)
  })
})

describe('relativeBearing (orrszög)', () => {
  it('jobbra = zöld, pozitív', () => {
    const r = relativeBearing(0, 45)
    expect(r.angle).toBeCloseTo(45)
    expect(r.side).toBe('zold')
  })
  it('balra = vörös, negatív', () => {
    const r = relativeBearing(0, 315)
    expect(r.angle).toBeCloseTo(-45)
    expect(r.side).toBe('voros')
  })
})

describe('bearingUnitVector', () => {
  it('90° kelet felé mutat', () => {
    const v = bearingUnitVector(90)
    expect(v.x).toBeCloseTo(1)
    expect(v.y).toBeCloseTo(0)
  })
})

describe('intersectionOfBearings', () => {
  it('két iránylat metszéspontja megadja a pozíciót', () => {
    // A cél a (0,0)-ban; két megfigyelőpontból mért iránylat metszéspontja legyen (0,0).
    const p1 = { x: -10, y: 0 } // tőle a (0,0) keletre → 90°
    const p2 = { x: 0, y: 10 } // tőle a (0,0) északra → 0°
    const fix = intersectionOfBearings(p1, bearing(p1, { x: 0, y: 0 }), p2, bearing(p2, { x: 0, y: 0 }))
    expect(fix).not.toBeNull()
    expect(fix!.x).toBeCloseTo(0, 5)
    expect(fix!.y).toBeCloseTo(0, 5)
  })
  it('párhuzamos iránylatoknál null', () => {
    expect(intersectionOfBearings({ x: 0, y: 0 }, 90, { x: 0, y: 10 }, 90)).toBeNull()
  })
})
