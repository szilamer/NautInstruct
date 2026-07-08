import type { Situation } from './types'
import { extraSituations } from './situationsExtra'

const coreSituations: Situation[] = [
  // ---------- Jelzések ----------
  {
    id: 's-kikotes-ar-ellen',
    ruleId: 'r-kikotes-ar-ellen',
    topicId: 'jelzesek',
    prompt:
      'Folyón közlekedsz, a sodrás felfelé mutat a képen (a víz feléd folyik). Ki szeretnél kötni a parthoz. Melyik irányba fordulj a kikötéshez?',
    scene: {
      environment: 'folyo',
      timeOfDay: 'nappal',
      visibility: 'tiszta',
      objects: [
        { kind: 'boat', x: 0, z: 0.35 },
        { kind: 'sign', x: -0.8, z: 0.6, label: 'PART' },
        { kind: 'buoy-red', x: 0.55, z: 0.75 },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Folyásiránnyal szemben (ár ellen) fordulok kikötéshez.', isCorrect: true },
      {
        id: 'd2',
        label: 'A sodrással megegyező irányban kötök ki, az gyorsabb.',
        isCorrect: false,
        errorTypeId: 'e-kikotes-arral',
      },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A sodrással megegyező irányba fordultam, pedig ár ellen kell kikötni.', quality: 'pontos' },
      { id: 'g2', label: 'Rossz volt a kikötési irányom.', quality: 'reszben' },
      { id: 'g3', label: 'Túl lassan közelítettem a parthoz.', quality: 'teves' },
    ],
  },
  {
    id: 's-athaladni-tilos',
    ruleId: 'r-athaladni-tilos',
    topicId: 'jelzesek',
    prompt:
      'Egy zsilip előtt két egymás feletti piros táblát látsz a parton. Mit teszel?',
    scene: {
      environment: 'folyo',
      timeOfDay: 'nappal',
      visibility: 'tiszta',
      objects: [
        { kind: 'boat', x: 0, z: 0.3 },
        { kind: 'sign', x: 0.1, z: 0.8, label: '⛔' },
        { kind: 'sign', x: 0.1, z: 0.72, label: '⛔' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Megállok és várok, tilos áthaladni.', isCorrect: true },
      {
        id: 'd2',
        label: 'Áthaladok, biztos csak figyelmeztetés.',
        isCorrect: false,
        errorTypeId: 'e-athaladt',
      },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Áthaladtam, pedig a két piros jelzés tartós áthaladási tilalom.', quality: 'pontos' },
      { id: 'g2', label: 'Nem vettem komolyan a piros jelzést.', quality: 'reszben' },
      { id: 'g3', label: 'Túl közel mentem a parthoz.', quality: 'teves' },
    ],
  },
  {
    id: 's-korlatozott-melyseg',
    ruleId: 'r-korlatozott-melyseg',
    topicId: 'jelzesek',
    prompt:
      'Piros keretes táblát látsz lefelé mutató háromszöggel és a „2,20" számmal. A hajód merülése 1,2 m. Mit jelent a tábla, és mehetsz-e?',
    scene: {
      environment: 'folyo',
      timeOfDay: 'nappal',
      visibility: 'tiszta',
      objects: [
        { kind: 'boat', x: 0, z: 0.3 },
        { kind: 'sign', x: -0.2, z: 0.75, label: '▽2,20' },
      ],
    },
    decisions: [
      {
        id: 'd1',
        label: 'Korlátozott vízmélység 2,20 m; a merülésem kisebb, óvatosan mehetek.',
        isCorrect: true,
      },
      {
        id: 'd2',
        label: 'Ez a szabad magasság 2,20 m, a mélységgel nem kell foglalkoznom.',
        isCorrect: false,
        errorTypeId: 'e-melyseg-felre',
      },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Szabad magasságnak néztem, pedig ez korlátozott vízmélység.', quality: 'pontos' },
      { id: 'g2', label: 'Rosszul olvastam le a táblát.', quality: 'reszben' },
      { id: 'g3', label: 'A szám a megengedett sebesség.', quality: 'teves' },
    ],
  },
  // ---------- Fények ----------
  {
    id: 's-gephajo-fenyei',
    ruleId: 'r-gephajo-fenyei',
    topicId: 'fenyek',
    prompt:
      'Éjszaka szemből egy hajót látsz: fent fehér fény, alatta bal oldalon piros, jobb oldalon zöld fény. Milyen hajó ez?',
    scene: {
      environment: 'tenger',
      timeOfDay: 'ejszaka',
      visibility: 'tiszta',
      objects: [
        { kind: 'light', x: 0, z: 0.7, lightColor: 'feher' },
        { kind: 'light', x: -0.12, z: 0.7, lightColor: 'piros' },
        { kind: 'light', x: 0.12, z: 0.7, lightColor: 'zold' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Szemből közeledő, menetben lévő géphajó.', isCorrect: true },
      {
        id: 'd2',
        label: 'Horgonyon álló hajó.',
        isCorrect: false,
        errorTypeId: 'e-gephajo-felre',
      },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Az árbóc- és oldalfények menetben lévő géphajót jeleznek, nem álló hajót.', quality: 'pontos' },
      { id: 'g2', label: 'Rosszul azonosítottam a hajó típusát.', quality: 'reszben' },
      { id: 'g3', label: 'A fények színe nem számít.', quality: 'teves' },
    ],
  },
  {
    id: 's-horgonyfeny',
    ruleId: 'r-horgonyfeny',
    topicId: 'fenyek',
    prompt:
      'Éjszaka egyetlen, minden irányból látható fehér fényt látsz, oldalfények (piros/zöld) nélkül. Mit jelent?',
    scene: {
      environment: 'tenger',
      timeOfDay: 'ejszaka',
      visibility: 'tiszta',
      objects: [{ kind: 'light', x: 0, z: 0.65, lightColor: 'feher' }],
    },
    decisions: [
      { id: 'd1', label: 'Horgonyon álló hajó; mérséklem a sebességet és kikerülöm.', isCorrect: true },
      {
        id: 'd2',
        label: 'Menetben lévő géphajó, tartom a sebességet.',
        isCorrect: false,
        errorTypeId: 'e-horgony-menetben',
      },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Oldalfények nélküli körkörös fehér fény = horgonyon álló hajó, nem menetben lévő.', quality: 'pontos' },
      { id: 'g2', label: 'Rosszul ítéltem meg, hogy áll-e a hajó.', quality: 'reszben' },
      { id: 'g3', label: 'A fehér fény mindig menetet jelent.', quality: 'teves' },
    ],
  },
  {
    id: 's-kek-fenyek',
    ruleId: 'r-kek-fenyek-veszelyes-aru',
    topicId: 'fenyek',
    prompt:
      'Éjszaka egy hajón három kék fényt látsz egymás felett. Hogyan reagálsz?',
    scene: {
      environment: 'folyo',
      timeOfDay: 'ejszaka',
      visibility: 'tiszta',
      objects: [
        { kind: 'light', x: 0, z: 0.7, lightColor: 'sarga' },
        { kind: 'light', x: 0, z: 0.64, lightColor: 'sarga' },
        { kind: 'light', x: 0, z: 0.58, lightColor: 'sarga' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Robbanásveszélyes árut szállít; nagy távolságot tartok, nincs nyílt láng.', isCorrect: true },
      {
        id: 'd2',
        label: 'Szokásos teherhajó, közel is elhaladhatok mellette.',
        isCorrect: false,
        errorTypeId: 'e-kek-figyelmen',
      },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A három kék fény robbanásveszélyes rakományt jelez, távolságot kell tartani.', quality: 'pontos' },
      { id: 'g2', label: 'Nem figyeltem a kék fényekre.', quality: 'reszben' },
      { id: 'g3', label: 'A kék fény díszkivilágítás.', quality: 'teves' },
    ],
  },
  // ---------- Rádiózás ----------
  {
    id: 's-mayday',
    ruleId: 'r-mayday',
    topicId: 'radiozas',
    prompt:
      'A hajód léket kapott és süllyed, a legénység veszélyben van. Milyen rádióhívást adsz le és melyik csatornán?',
    scene: {
      environment: 'tenger',
      timeOfDay: 'nappal',
      visibility: 'tiszta',
      objects: [
        { kind: 'boat', x: 0, z: 0.35 },
        { kind: 'hazard', x: 0.1, z: 0.4, label: 'SOS' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'MAYDAY a 16-os csatornán, háromszor.', isCorrect: true },
      {
        id: 'd2',
        label: 'PAN-PAN, mert nem vészes még a helyzet.',
        isCorrect: false,
        errorTypeId: 'e-nem-mayday',
      },
      {
        id: 'd3',
        label: 'SÉCURITÉ, figyelmeztetem a többieket.',
        isCorrect: false,
        errorTypeId: 'e-nem-mayday',
      },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Közvetlen életveszély van, ezért MAYDAY kell, nem alacsonyabb szint.', quality: 'pontos' },
      { id: 'g2', label: 'Rossz vészszintet választottam.', quality: 'reszben' },
      { id: 'g3', label: 'Mindegy, melyik csatornán szólok.', quality: 'teves' },
    ],
  },
  {
    id: 's-panpan',
    ruleId: 'r-panpan',
    topicId: 'radiozas',
    prompt:
      'Leállt a motorod és lassan sodródsz, de senki nincs közvetlen életveszélyben. Milyen hívás a helyes?',
    scene: {
      environment: 'tenger',
      timeOfDay: 'nappal',
      visibility: 'tiszta',
      objects: [{ kind: 'boat', x: 0, z: 0.35 }],
    },
    decisions: [
      { id: 'd1', label: 'PAN-PAN a 16-os csatornán – sürgős, de nincs életveszély.', isCorrect: true },
      {
        id: 'd2',
        label: 'MAYDAY, hadd jöjjön mindenki azonnal.',
        isCorrect: false,
        errorTypeId: 'e-tul-mayday',
      },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Nincs közvetlen életveszély, ezért PAN-PAN kell, nem MAYDAY.', quality: 'pontos' },
      { id: 'g2', label: 'Túl magas vészszintet választottam.', quality: 'reszben' },
      { id: 'g3', label: 'Nem is kellett volna rádióznom.', quality: 'teves' },
    ],
  },
  {
    id: 's-securite',
    ruleId: 'r-securite',
    topicId: 'radiozas',
    prompt:
      'Nagy úszó fatörzset látsz a hajóútban, ami másokra is veszélyes lehet. Hogyan tájékoztatod a többi hajóst?',
    scene: {
      environment: 'folyo',
      timeOfDay: 'nappal',
      visibility: 'tiszta',
      objects: [
        { kind: 'boat', x: -0.3, z: 0.3 },
        { kind: 'hazard', x: 0.3, z: 0.6, label: '🪵' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'SÉCURITÉ biztonsági közlemény – navigációs figyelmeztetés.', isCorrect: true },
      {
        id: 'd2',
        label: 'MAYDAY, mert veszély van a vízen.',
        isCorrect: false,
        errorTypeId: 'e-securite-felre',
      },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Ez navigációs figyelmeztetés másoknak, tehát SÉCURITÉ, nem vészhívás.', quality: 'pontos' },
      { id: 'g2', label: 'Rossz hívástípust adtam le.', quality: 'reszben' },
      { id: 'g3', label: 'Ilyenkor nem kell szólni senkinek.', quality: 'teves' },
    ],
  },
  // ---------- Horgonyzás ----------
  {
    id: 's-lanchossz',
    ruleId: 'r-lanchossz',
    topicId: 'horgonyzas',
    prompt:
      'Folyón horgonyoznál, a vízmélység 4 méter. Mennyi láncot engedj ki, hogy a horgony biztosan tartson?',
    scene: {
      environment: 'folyo',
      timeOfDay: 'nappal',
      visibility: 'tiszta',
      objects: [{ kind: 'boat', x: 0, z: 0.35 }],
    },
    decisions: [
      { id: 'd1', label: 'Kb. 12–20 m láncot (a mélység 3–5-szörösét).', isCorrect: true },
      {
        id: 'd2',
        label: 'Kb. 4–5 m láncot, annyi elég.',
        isCorrect: false,
        errorTypeId: 'e-keves-lanc',
      },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Túl kevés láncot adtam ki; folyón a mélység 3–5-szöröse kell.', quality: 'pontos' },
      { id: 'g2', label: 'Rosszul számoltam a lánchosszt.', quality: 'reszben' },
      { id: 'g3', label: 'A lánc hossza nem befolyásolja a tartást.', quality: 'teves' },
    ],
  },
  {
    id: 's-horgonyzas-tilos',
    ruleId: 'r-horgonyzas-tilos',
    topicId: 'horgonyzas',
    prompt:
      'A parton áthúzott horgonyt ábrázoló táblát látsz. Le akarsz horgonyozni. Mit teszel?',
    scene: {
      environment: 'folyo',
      timeOfDay: 'nappal',
      visibility: 'tiszta',
      objects: [
        { kind: 'boat', x: 0, z: 0.3 },
        { kind: 'sign', x: -0.2, z: 0.75, label: '⚓✕' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Továbbmegyek, itt tilos horgonyozni; engedélyezett helyet keresek.', isCorrect: true },
      {
        id: 'd2',
        label: 'Lehorgonyzok, csak egy tábla.',
        isCorrect: false,
        errorTypeId: 'e-tilos-helyen',
      },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Tiltó tábla ellenére horgonyoztam volna, pedig ott tilos.', quality: 'pontos' },
      { id: 'g2', label: 'Nem vettem figyelembe a táblát.', quality: 'reszben' },
      { id: 'g3', label: 'A tábla csak ajánlás.', quality: 'teves' },
    ],
  },
  {
    id: 's-kikotes-kotel',
    ruleId: 'r-kikotes-kotel-kereszt',
    topicId: 'horgonyzas',
    prompt:
      'Szűk kikötőben állsz be két hajó közé. Hogyan vezeted a kötelet?',
    scene: {
      environment: 'folyo',
      timeOfDay: 'nappal',
      visibility: 'tiszta',
      objects: [
        { kind: 'boat', x: -0.4, z: 0.5 },
        { kind: 'boat', x: 0, z: 0.35 },
        { kind: 'boat', x: 0.4, z: 0.5 },
      ],
    },
    decisions: [
      { id: 'd1', label: 'A köteleimet a szomszéd hajókétól elkülönítve, párhuzamosan vezetem.', isCorrect: true },
      {
        id: 'd2',
        label: 'Átvezetem a kötelet a szomszéd hajó kötelén, ahogy fér.',
        isCorrect: false,
        errorTypeId: 'e-kotel-kereszt',
      },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A köteleim keresztezték a szomszédét, ami összegabalyodáshoz vezet.', quality: 'pontos' },
      { id: 'g2', label: 'Nem figyeltem a kötélvezetésre.', quality: 'reszben' },
      { id: 'g3', label: 'A kötelek keresztezése nem probléma.', quality: 'teves' },
    ],
  },
]

export const situations: Situation[] = [...coreSituations, ...extraSituations]
export const situationById = new Map(situations.map((s) => [s.id, s]))
