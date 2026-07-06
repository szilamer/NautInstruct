import type { Topic } from './types'

export const topics: Topic[] = [
  {
    id: 'jelzesek',
    title: 'Jelzések és táblák',
    description: 'Folyami és parti jelzések, tiltó és korlátozó táblák felismerése és értelmezése.',
  },
  {
    id: 'fenyek',
    title: 'Éjszakai fények',
    description: 'Hajófények alapján a hajó típusának, irányának és állapotának felismerése.',
  },
  {
    id: 'radiozas',
    title: 'Rádiózás',
    description: 'VHF vészjelzések: Mayday, Pan-pan, Sécurité és a helyes üzenetfelépítés.',
  },
  {
    id: 'horgonyzas',
    title: 'Horgonyzás és kikötés',
    description: 'Lánchossz, vízmélység, sodrás és kikötési irány szerinti biztonságos döntések.',
  },
  {
    id: 'navigacio',
    title: 'Navigáció',
    description: 'Hajóút-tartás, kitérés (COLREG), köd és korlátozott látás melletti hajózás.',
  },
]

export const topicById = new Map(topics.map((t) => [t.id, t]))
