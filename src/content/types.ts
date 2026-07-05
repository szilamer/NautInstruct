// Tartalommodell (spec 9. pont): témakör → szabály → szituáció → hibatípus → magyarázatok.

export type TopicId = 'jelzesek' | 'fenyek' | 'radiozas' | 'horgonyzas'

export type Environment = 'folyo' | 'tenger'
export type TimeOfDay = 'nappal' | 'ejszaka'
export type Visibility = 'tiszta' | 'kod'

/** T-01: Témakör. */
export interface Topic {
  id: TopicId
  title: string
  description: string
}

/** T-04: Tipikus hibatípus. */
export interface ErrorType {
  id: string
  /** Rövid megnevezés, ami a hibakártyán és a magyarázatban is megjelenik. */
  label: string
}

/** T-05: Háromszintű magyarázati sablon ugyanahhoz a szabályhoz. */
export interface ExplanationTemplate {
  rovid: string
  kozepes: string
  reszletes: string
}

/** T-02: Egy konkrét hajózási szabály / vizsgatétel. */
export interface Rule {
  id: string
  topicId: TopicId
  title: string
  /** A helyes döntés lényege egy mondatban. */
  correctSummary: string
  explanations: ExplanationTemplate
  typicalErrors: ErrorType[]
}

/** Egy választható döntés egy szituációban. */
export interface DecisionOption {
  id: string
  label: string
  isCorrect: boolean
  /** Ha hibás: melyik hibatípushoz tartozik. */
  errorTypeId?: string
}

/** Öndiagnózis-válaszopció (HD-02) és minősége az adott hibához képest (HD-03). */
export type DiagnosisQuality = 'pontos' | 'reszben' | 'teves'

export interface DiagnosisOption {
  id: string
  label: string
  quality: DiagnosisQuality
}

/** Egy jelenetbeli objektum a 2.5D vászonhoz. */
export interface SceneObject {
  kind: 'buoy-red' | 'buoy-green' | 'buoy-yellow' | 'sign' | 'boat' | 'light' | 'hazard'
  /** Vízszintes pozíció a pálya szélességén (-1..1). */
  x: number
  /** Mélységi pozíció (0 = közel, 1 = távol). */
  z: number
  /** Rövid felirat / szimbólum a táblához vagy fényhez. */
  label?: string
  /** Fény színe éjszakai jeleneteknél. */
  lightColor?: 'feher' | 'piros' | 'zold' | 'sarga'
}

export interface SceneConfig {
  environment: Environment
  timeOfDay: TimeOfDay
  visibility: Visibility
  objects: SceneObject[]
}

/** T-03: A szabály gyakorlati megjelenése egy pályán. */
export interface Situation {
  id: string
  ruleId: string
  topicId: TopicId
  /** A helyzet szöveges leírása a HUD-on. */
  prompt: string
  scene: SceneConfig
  /** A döntési opciók (2-4 db). */
  decisions: DecisionOption[]
  /** Öndiagnózis-opciók a debrief során. */
  diagnosisOptions: DiagnosisOption[]
}

/** Pálya (JM-01 küldetés): egymásra épülő szituációk egy témában. */
export interface Level {
  id: string
  topicId: TopicId
  title: string
  subtitle: string
  situationIds: string[]
}
