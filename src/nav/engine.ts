import type { BoatInput, BoatState, LateralBuoy, NavMission, Vec2, Vessel, Violation, Zone } from './types'

export const MAX_SPEED = 6
export const ACCEL = 3.5
export const TURN_RATE = 1.5
export const COLLISION_RADIUS = 2.2

export function forwardVector(heading: number): Vec2 {
  return { x: Math.sin(heading), z: Math.cos(heading) }
}

export function distance(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.z - b.z)
}

/** Kinematikus hajómozgás egy időlépésben (dt másodperc). */
export function stepBoat(state: BoatState, input: BoatInput, dt: number): BoatState {
  const targetSpeed = Math.max(0, Math.min(1, input.throttle)) * MAX_SPEED
  let speed = state.speed
  if (speed < targetSpeed) speed = Math.min(targetSpeed, speed + ACCEL * dt)
  else speed = Math.max(targetSpeed, speed - ACCEL * dt)

  // A kormány hatékonysága kis sebességnél csökken (mint a valóságban).
  const steerFactor = Math.min(1, 0.25 + speed / MAX_SPEED)
  const heading = state.heading + input.turn * TURN_RATE * steerFactor * dt

  const fwd = forwardVector(heading)
  return {
    x: state.x + fwd.x * speed * dt,
    z: state.z + fwd.z * speed * dt,
    heading,
    speed,
  }
}

/** A bóját a helyes oldalon hagyta-e el a hajó, amikor épp elhaladt mellette. */
export function buoySideViolated(prev: BoatState, next: BoatState, buoy: LateralBuoy): boolean {
  const crossed = prev.z < buoy.z && next.z >= buoy.z
  if (!crossed) return false
  // A bója a hajó jobb oldalán (starboard) van, ha a bója x-e nagyobb (előre haladva).
  const buoyOnStarboard = buoy.x > next.x
  const correct = buoy.keepOn === 'starboard' ? buoyOnStarboard : !buoyOnStarboard
  return !correct
}

export function insideZone(state: BoatState, zone: Zone): boolean {
  return distance(state, zone) <= zone.radius
}

export function collidesWith(state: BoatState, vessel: Vessel): boolean {
  return distance(state, vessel) <= COLLISION_RADIUS
}

/**
 * Egyetlen időlépés utáni szabálysértés-detektálás. A prioritás:
 * ütközés → tiltott zóna/akadály → rossz bójaoldal → ködsebesség.
 * A ködsebesség debounce-olását a hívó (hook) végzi.
 */
export function detectViolation(
  prev: BoatState,
  next: BoatState,
  mission: NavMission,
  fogOverLimit: boolean,
): Violation | null {
  for (const v of mission.vessels) {
    if (collidesWith(next, v)) return { kind: 'collision', detail: v.id }
  }
  for (const h of mission.hazards) {
    if (distance(next, h) <= h.radius) return { kind: 'no-go', detail: h.id }
  }
  for (const z of mission.zones) {
    if ((z.kind === 'no-go' || z.kind === 'no-anchor') && insideZone(next, z)) {
      return { kind: z.kind === 'no-anchor' ? 'anchor-zone' : 'no-go', detail: z.id }
    }
  }
  for (const b of mission.buoys) {
    if (buoySideViolated(prev, next, b)) return { kind: 'buoy-side', detail: b.id }
  }
  if (fogOverLimit) return { kind: 'fog-speed' }
  return null
}

export function goalZone(mission: NavMission): Zone | undefined {
  return mission.zones.find((z) => z.id === mission.goalZoneId)
}

export function isGoalReached(state: BoatState, mission: NavMission): boolean {
  const goal = goalZone(mission)
  return !!goal && insideZone(state, goal)
}

/** Horgonyzási lánchossz ellenőrzése: elég-e a választott hossz a vízmélységhez. */
export function anchorScopeSufficient(mission: NavMission, chosenLength: number): boolean {
  if (!mission.anchoring) return true
  return chosenLength >= mission.anchoring.depth * mission.anchoring.minScopeFactor
}
