import type { DiagnosisOption } from '../content/types'
import type { NavMission } from './types'

// Öndiagnózis-opciók újrafelhasználható halmazai (pontos / részben / téves).
const diag = {
  buoy: [
    { id: 'g1', label: 'Rossz oldalon hagytam el a bóját, kimentem a hajóútból.', quality: 'pontos' },
    { id: 'g2', label: 'Nem figyeltem a bóják színére/oldalára.', quality: 'reszben' },
    { id: 'g3', label: 'Túl lassan haladtam.', quality: 'teves' },
  ] as DiagnosisOption[],
  hazard: [
    { id: 'g1', label: 'Kihajóztam a hajóútból és nekimentem az akadálynak/zátonynak.', quality: 'pontos' },
    { id: 'g2', label: 'Nem tartottam biztonságos távolságot.', quality: 'reszben' },
    { id: 'g3', label: 'A hajó túl nehezen kanyarodott.', quality: 'teves' },
  ] as DiagnosisOption[],
  fog: [
    { id: 'g1', label: 'Ködben túl gyorsan mentem, nem tudtam időben megállni.', quality: 'pontos' },
    { id: 'g2', label: 'Nem lassítottam eléggé.', quality: 'reszben' },
    { id: 'g3', label: 'Rossz irányba fordultam.', quality: 'teves' },
  ] as DiagnosisOption[],
  colreg: [
    { id: 'g1', label: 'Nem tértem ki jobbra a szemből jövő hajó elől.', quality: 'pontos' },
    { id: 'g2', label: 'Későn reagáltam a másik hajóra.', quality: 'reszben' },
    { id: 'g3', label: 'A sebességem volt túl alacsony.', quality: 'teves' },
  ] as DiagnosisOption[],
  anchorZone: [
    { id: 'g1', label: 'Tiltott (horgonyzás tilos) zónába hajóztam.', quality: 'pontos' },
    { id: 'g2', label: 'Nem vettem észre a tiltó jelzést.', quality: 'reszben' },
    { id: 'g3', label: 'Túl gyorsan közelítettem.', quality: 'teves' },
  ] as DiagnosisOption[],
  anchorScope: [
    { id: 'g1', label: 'Túl kevés láncot engedtem ki a vízmélységhez képest.', quality: 'pontos' },
    { id: 'g2', label: 'Rosszul becsültem a lánchosszt.', quality: 'reszben' },
    { id: 'g3', label: 'Rossz helyen álltam meg.', quality: 'teves' },
  ] as DiagnosisOption[],
}

export const missions: NavMission[] = [
  {
    id: 'nav-folyo',
    topicId: 'jelzesek',
    title: 'Folyami hajóút',
    brief: 'Haladj végig a hajóúton a bóják között (piros balra, zöld jobbra), és állj be a kikötőhöz. Kerüld a zátonyt!',
    environment: 'folyo',
    timeOfDay: 'nappal',
    visibility: 'tiszta',
    start: { x: 0, z: 0, heading: 0, speed: 0 },
    channel: { centerline: [{ x: 0, z: 0 }, { x: 0, z: 40 }], halfWidth: 5 },
    buoys: [
      { id: 'r1', x: -3.5, z: 9, keepOn: 'port', color: 'red' },
      { id: 'g1', x: 3.5, z: 9, keepOn: 'starboard', color: 'green' },
      { id: 'r2', x: -3.5, z: 20, keepOn: 'port', color: 'red' },
      { id: 'g2', x: 3.5, z: 20, keepOn: 'starboard', color: 'green' },
      { id: 'r3', x: -3.5, z: 31, keepOn: 'port', color: 'red' },
      { id: 'g3', x: 3.5, z: 31, keepOn: 'starboard', color: 'green' },
    ],
    zones: [{ id: 'goal', x: 0, z: 40, radius: 3, kind: 'goal', label: 'Kikötő' }],
    vessels: [],
    hazards: [{ id: 'zatony', x: 6.5, z: 25, radius: 2.2, label: 'zátony' }],
    goalZoneId: 'goal',
    violations: {
      'buoy-side': { ruleId: 'r-lateralis-jelek', diagnosisOptions: diag.buoy },
      'no-go': { ruleId: 'r-akadaly-kerules', diagnosisOptions: diag.hazard },
    },
  },
  {
    id: 'nav-ejszaka',
    topicId: 'fenyek',
    title: 'Éjszakai kitérés',
    brief: 'Szemből géphajó közeledik (fehér + piros + zöld fény). Térj ki jobbra időben, és haladj el mellette biztonságosan a célig!',
    environment: 'tenger',
    timeOfDay: 'ejszaka',
    visibility: 'tiszta',
    start: { x: 0, z: 0, heading: 0, speed: 0 },
    buoys: [],
    zones: [{ id: 'goal', x: 0, z: 40, radius: 3.5, kind: 'goal', label: 'Cél' }],
    vessels: [
      {
        id: 'oncoming',
        x: 0,
        z: 38,
        heading: Math.PI,
        speed: 2.2,
        kind: 'gephajo',
        lights: [
          { color: 'feher', dx: 0 },
          { color: 'piros', dx: -0.5 },
          { color: 'zold', dx: 0.5 },
        ],
      },
    ],
    hazards: [],
    goalZoneId: 'goal',
    violations: {
      collision: { ruleId: 'r-colreg-kiteres', diagnosisOptions: diag.colreg },
    },
  },
  {
    id: 'nav-kod',
    topicId: 'navigacio',
    title: 'Hajózás ködben',
    brief: 'Sűrű köd! Haladj biztonságos (alacsony) sebességgel a célig, és kerüld a hirtelen felbukkanó akadályt.',
    environment: 'tenger',
    timeOfDay: 'nappal',
    visibility: 'kod',
    start: { x: 0, z: 0, heading: 0, speed: 0 },
    channel: { centerline: [{ x: 0, z: 0 }, { x: 0, z: 36 }], halfWidth: 6 },
    buoys: [],
    zones: [{ id: 'goal', x: 0, z: 36, radius: 3.5, kind: 'goal', label: 'Cél' }],
    vessels: [],
    hazards: [{ id: 'szikla', x: 1.5, z: 22, radius: 2.2, label: 'szikla' }],
    speedLimit: 2.6,
    goalZoneId: 'goal',
    violations: {
      'fog-speed': { ruleId: 'r-kod-sebesseg', diagnosisOptions: diag.fog },
      'no-go': { ruleId: 'r-akadaly-kerules', diagnosisOptions: diag.hazard },
    },
  },
  {
    id: 'nav-horgonyzas',
    topicId: 'horgonyzas',
    title: 'Horgonyzás',
    brief: 'Állj be a horgonyzóhelyre a tiltott (horgonyzás tilos) zóna kikerülésével, majd ereszd le a horgonyt a megfelelő lánchosszal. Vízmélység: 4 m.',
    environment: 'tenger',
    timeOfDay: 'nappal',
    visibility: 'tiszta',
    start: { x: 0, z: 0, heading: 0, speed: 0 },
    buoys: [],
    zones: [
      { id: 'tilos', x: 2.5, z: 16, radius: 4, kind: 'no-anchor', label: 'Horgonyzás tilos' },
      { id: 'goal', x: -3, z: 30, radius: 3.5, kind: 'anchor', label: 'Horgonyzóhely' },
    ],
    vessels: [],
    hazards: [],
    goalZoneId: 'goal',
    anchoring: { depth: 4, minScopeFactor: 3 },
    violations: {
      'anchor-zone': { ruleId: 'r-horgonyzas-tilos', diagnosisOptions: diag.anchorZone },
      'anchor-scope': { ruleId: 'r-lanchossz', diagnosisOptions: diag.anchorScope },
    },
  },
]

export const missionById = new Map(missions.map((m) => [m.id, m]))
export const missionByTopic = new Map(missions.map((m) => [m.topicId, m]))
