import type { Level } from './types'

// JM-01 küldetés mód: témánként egy pálya, egymásra épülő szituációkkal.
export const levels: Level[] = [
  {
    id: 'l-jelzesek',
    topicId: 'jelzesek',
    title: 'Folyami jelzések',
    subtitle: 'Táblák és kikötési szabályok felismerése',
    situationIds: ['s-kikotes-ar-ellen', 's-athaladni-tilos', 's-korlatozott-melyseg'],
  },
  {
    id: 'l-fenyek',
    topicId: 'fenyek',
    title: 'Éjszakai fények',
    subtitle: 'Hajótípus és állapot felismerése fények alapján',
    situationIds: ['s-gephajo-fenyei', 's-horgonyfeny', 's-kek-fenyek'],
  },
  {
    id: 'l-radiozas',
    topicId: 'radiozas',
    title: 'Rádiós vészhelyzet',
    subtitle: 'Mayday, Pan-pan és Sécurité helyes megválasztása',
    situationIds: ['s-mayday', 's-panpan', 's-securite'],
  },
  {
    id: 'l-horgonyzas',
    topicId: 'horgonyzas',
    title: 'Horgonyzás és kikötés',
    subtitle: 'Lánchossz, tilalom és kötélvezetés',
    situationIds: ['s-lanchossz', 's-horgonyzas-tilos', 's-kikotes-kotel'],
  },
]

export const levelById = new Map(levels.map((l) => [l.id, l]))
