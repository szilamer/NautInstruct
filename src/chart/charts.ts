import type { DiagnosisOption } from '../content/types'
import { bearing } from './geometry'
import type { ChartTask } from './types'

const diagBearing: DiagnosisOption[] = [
  { id: 'g1', label: 'Rosszul olvastam le / állítottam be az irányt (bearing).', quality: 'pontos' },
  { id: 'g2', label: 'Kicsit elnéztem a szöget.', quality: 'reszben' },
  { id: 'g3', label: 'A távolságot mértem az irány helyett.', quality: 'teves' },
]
const diagFix: DiagnosisOption[] = [
  { id: 'g1', label: 'Nem a két iránylat metszéspontjára tettem a helyzetem.', quality: 'pontos' },
  { id: 'g2', label: 'Közel voltam, de nem pontosan a metszéspontra kattintottam.', quality: 'reszben' },
  { id: 'g3', label: 'A helymeghatározáshoz elég egy iránylat.', quality: 'teves' },
]

// A hajó a (50,72)-ben, a világítótorony a (78,28)-ban.
const t1Boat = { x: 50, y: 72 }
const lightA = { id: 'vt-a', label: 'Világítótorony', x: 78, y: 28, kind: 'lighthouse' as const }

// Course feladat.
const t2Boat = { x: 22, y: 80 }
const harbour = { x: 72, y: 24 }

// Fix feladat: a valódi hely (46,54), két landmark.
const trueBoat = { x: 46, y: 54 }
const fixA = { id: 'lm-a', label: 'Torony A', x: 18, y: 20, kind: 'tower' as const }
const fixB = { id: 'lm-b', label: 'Torony B', x: 82, y: 26, kind: 'tower' as const }

export const chartTasks: ChartTask[] = [
  {
    id: 'chart-bearing',
    title: 'Iránymérés (bearing)',
    prompt:
      'Mérd meg a világítótorony irányát (bearing) a hajódról! Forgasd a tűt a toronyra, és állítsd be a fokot (±6° tűrés).',
    kind: 'bearing',
    landmarks: [lightA],
    boat: t1Boat,
    targetId: 'vt-a',
    toleranceDeg: 6,
    ruleId: 'r-nav-orrszog',
    diagnosisOptions: diagBearing,
  },
  {
    id: 'chart-course',
    title: 'Iránytartás a kikötőig',
    prompt:
      'Milyen irányt (course) kell tartanod, hogy egyenesen a kikötőhöz juss? Állítsd be a fokot (±6° tűrés).',
    kind: 'course',
    landmarks: [],
    boat: t2Boat,
    waypoint: harbour,
    waypointLabel: 'Kikötő',
    toleranceDeg: 6,
    ruleId: 'r-nav-orrszog',
    diagnosisOptions: diagBearing,
  },
  {
    id: 'chart-fix',
    title: 'Helymeghatározás (pozíciófix)',
    prompt:
      'A Torony A és a Torony B mért iránylatai alapján határozd meg a helyzeted: kattints a térképen a két iránylat-egyenes metszéspontjára!',
    kind: 'fix',
    landmarks: [fixA, fixB],
    trueBoat,
    observerBearings: [
      { landmarkId: 'lm-a', bearing: bearing(trueBoat, fixA) },
      { landmarkId: 'lm-b', bearing: bearing(trueBoat, fixB) },
    ],
    toleranceDist: 8,
    ruleId: 'r-nav-helymeghatarozas',
    diagnosisOptions: diagFix,
  },
]
