import type { DiagnosisOption } from '../content/types'
import type { Point } from './geometry'

export interface Landmark {
  id: string
  label: string
  x: number
  y: number
  kind: 'lighthouse' | 'tower' | 'buoy'
}

export type ChartTaskKind = 'bearing' | 'course' | 'fix'

export interface ChartTask {
  id: string
  title: string
  prompt: string
  kind: ChartTaskKind
  landmarks: Landmark[]
  /** Ismert hajópozíció (bearing/course feladatnál). */
  boat?: Point
  /** A célpont (bearing feladatnál a landmark id, course feladatnál a waypoint). */
  targetId?: string
  waypoint?: Point
  waypointLabel?: string
  /** Pozíciófix feladatnál: a mért iránylatok a landmarkokra + a valódi hajóhely. */
  observerBearings?: { landmarkId: string; bearing: number }[]
  trueBoat?: Point
  toleranceDeg?: number
  toleranceDist?: number
  ruleId: string
  diagnosisOptions: DiagnosisOption[]
}
