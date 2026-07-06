import type { DiagnosisOption, Environment, TimeOfDay, TopicId, Visibility } from '../content/types'

export interface Vec2 {
  x: number
  z: number
}

export interface BoatState {
  x: number
  z: number
  /** Irányszög radiánban; 0 = előre (+z), pozitív = jobbra (starboard) fordul. */
  heading: number
  /** Aktuális sebesség (egység/mp). */
  speed: number
}

export interface BoatInput {
  /** -1 (balra) … +1 (jobbra) */
  turn: number
  /** 0 … 1 gáz */
  throttle: number
}

export type NavViolationKind =
  | 'buoy-side'
  | 'no-go'
  | 'fog-speed'
  | 'collision'
  | 'anchor-zone'
  | 'anchor-scope'

/** Oldalsó (laterális) bója, amelyet a megadott oldalon kell elhagyni. */
export interface LateralBuoy {
  id: string
  x: number
  z: number
  /** Melyik oldalán kell elhaladni a hajónak: a bója a hajó ezen oldalán maradjon. */
  keepOn: 'port' | 'starboard'
  color: 'red' | 'green'
}

export interface Zone {
  id: string
  x: number
  z: number
  radius: number
  kind: 'goal' | 'no-go' | 'no-anchor' | 'anchor'
  label?: string
}

export interface Vessel {
  id: string
  x: number
  z: number
  heading: number
  speed: number
  kind: 'gephajo' | 'vitorlas' | 'horgonyzo'
  lights?: { color: 'feher' | 'piros' | 'zold'; dx: number }[]
}

export interface Hazard {
  id: string
  x: number
  z: number
  radius: number
  label?: string
}

export interface NavMission {
  id: string
  topicId: TopicId
  title: string
  brief: string
  environment: Environment
  timeOfDay: TimeOfDay
  visibility: Visibility
  start: BoatState
  channel?: { centerline: Vec2[]; halfWidth: number }
  buoys: LateralBuoy[]
  zones: Zone[]
  vessels: Vessel[]
  hazards: Hazard[]
  /** Ködben megengedett maximális sebesség. */
  speedLimit?: number
  goalZoneId: string
  /** Horgonyzós küldetésnél: vízmélység és a szükséges lánchossz-szorzó. */
  anchoring?: { depth: number; minScopeFactor: number }
  /** Egy szabálysértés-típushoz tartozó szabály és öndiagnózis-opciók. */
  violations: Partial<Record<NavViolationKind, { ruleId: string; diagnosisOptions: DiagnosisOption[] }>>
}

export interface Violation {
  kind: NavViolationKind
  detail?: string
}
