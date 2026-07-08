import type { Situation } from './types'

// Kiterjesztett szituációk (kvíz-feladatbank) a teljes tananyag lefedéséhez (spec 6. fejezet).

const night = { environment: 'tenger', timeOfDay: 'ejszaka', visibility: 'tiszta' } as const

// ---------------------------------------------------------------------------
// FÉNYEK — a hajó típusának/állapotának felismerése éjszakai fények alapján
// ---------------------------------------------------------------------------
const fenyekSituations: Situation[] = [
  {
    id: 's-feny-csonak-kicsi',
    ruleId: 'r-feny-csonak-kicsi',
    topicId: 'fenyek',
    prompt: 'Éjszaka egyetlen, minden irányból látható fehér fényt látsz, alacsonyan a víz felett, oldalfények nélkül. Mi lehet ez?',
    scene: { ...night, objects: [{ kind: 'light', x: 0, z: 0.65, lightColor: 'feher' }] },
    decisions: [
      { id: 'd1', label: '7 m-nél rövidebb kis csónak (körkörös fehér fény).', isCorrect: true },
      { id: 'd2', label: 'Nagy géphajó menetben.', isCorrect: false, errorTypeId: 'e-csonak-felre' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A magányos fehér fény kis (<7 m) csónakot jelez, nem géphajót.', quality: 'pontos' },
      { id: 'g2', label: 'Nem figyeltem, hogy hiányoznak az oldalfények.', quality: 'reszben' },
      { id: 'g3', label: 'A fehér fény mindig veszélyt jelent.', quality: 'teves' },
    ],
  },
  {
    id: 's-feny-vitorlas',
    ruleId: 'r-feny-vitorlas',
    topicId: 'fenyek',
    prompt: 'Éjjel egy hajón piros (bal) és zöld (jobb) oldalfényt és fehér farfényt látsz, de NINCS felül fehér árbócfény. Milyen hajó ez?',
    scene: {
      ...night,
      objects: [
        { kind: 'light', x: -0.12, z: 0.68, lightColor: 'piros' },
        { kind: 'light', x: 0.12, z: 0.68, lightColor: 'zold' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Menetben lévő vitorlás (nincs árbóc-menetfény).', isCorrect: true },
      { id: 'd2', label: 'Menetben lévő géphajó.', isCorrect: false, errorTypeId: 'e-vitorlas-gephajo' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Hiányzik az árbócfény, tehát vitorlás, nem géphajó.', quality: 'pontos' },
      { id: 'g2', label: 'Rosszul figyeltem az árbócfényt.', quality: 'reszben' },
      { id: 'g3', label: 'Az oldalfények színe itt nem számít.', quality: 'teves' },
    ],
  },
  {
    id: 's-feny-vontato',
    ruleId: 'r-feny-vontato',
    topicId: 'fenyek',
    prompt: 'Éjjel egy hajó elején két fehér fényt látsz egymás felett, a farán sárga fényt. Mi ez, és hogyan viselkedsz?',
    scene: {
      ...night,
      objects: [
        { kind: 'light', x: 0, z: 0.72, lightColor: 'feher' },
        { kind: 'light', x: 0, z: 0.66, lightColor: 'feher' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Vontató hajó – nagy távolságot tartok a vonta miatt.', isCorrect: true },
      { id: 'd2', label: 'Sima géphajó, közel is elhaladhatok mögötte.', isCorrect: false, errorTypeId: 'e-vontato-felre' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Két árbócfény + sárga farfény = vontató; a vonta miatt távolságot kell tartani.', quality: 'pontos' },
      { id: 'g2', label: 'Nem gondoltam a vontatókötélre.', quality: 'reszben' },
      { id: 'g3', label: 'A sárga farfény díszítés.', quality: 'teves' },
    ],
  },
  {
    id: 's-feny-tolohajo',
    ruleId: 'r-feny-tolohajo',
    topicId: 'fenyek',
    prompt: 'Éjjel egy hajó elején három fehér fényt látsz háromszög alakban (csúccsal felfelé). Milyen hajó ez?',
    scene: {
      ...night,
      objects: [
        { kind: 'light', x: 0, z: 0.74, lightColor: 'feher' },
        { kind: 'light', x: -0.12, z: 0.66, lightColor: 'feher' },
        { kind: 'light', x: 0.12, z: 0.66, lightColor: 'feher' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Uszályt toló hajó – jóval korábban kitérek előle.', isCorrect: true },
      { id: 'd2', label: 'Horgonyon álló hajó.', isCorrect: false, errorTypeId: 'e-tolo-felre' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Három fehér fény háromszögben = toló hajó, nagy tehetetlenségű kötelék.', quality: 'pontos' },
      { id: 'g2', label: 'Nem ismertem fel a háromszög alakot.', quality: 'reszben' },
      { id: 'g3', label: 'A három fény horgonyzást jelent.', quality: 'teves' },
    ],
  },
  {
    id: 's-feny-halasz-vono',
    ruleId: 'r-feny-halasz-vonohalos',
    topicId: 'fenyek',
    prompt: 'Éjjel egy hajón egymás felett felül zöld, alul fehér körfényt látsz. Milyen hajó ez?',
    scene: {
      ...night,
      objects: [
        { kind: 'light', x: 0, z: 0.72, lightColor: 'zold' },
        { kind: 'light', x: 0, z: 0.66, lightColor: 'feher' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Vonóhálós halászhajó – kitérek előle.', isCorrect: true },
      { id: 'd2', label: 'Nem vonóhálós halászhajó.', isCorrect: false, errorTypeId: 'e-halasz-vono-felre' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Zöld felül – fehér alul = vonóhálós halászhajó.', quality: 'pontos' },
      { id: 'g2', label: 'Felcseréltem a zöld és vörös jelentését.', quality: 'reszben' },
      { id: 'g3', label: 'A halászhajónak mindig ki kell térnie előlem.', quality: 'teves' },
    ],
  },
  {
    id: 's-feny-halasz-nemvono',
    ruleId: 'r-feny-halasz-nem-vono',
    topicId: 'fenyek',
    prompt: 'Éjjel egy hajón egymás felett felül vörös, alul fehér körfényt látsz. Milyen hajó ez?',
    scene: {
      ...night,
      objects: [
        { kind: 'light', x: 0, z: 0.72, lightColor: 'piros' },
        { kind: 'light', x: 0, z: 0.66, lightColor: 'feher' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Nem vonóhálós halászhajó (a háló a felszínen úszhat).', isCorrect: true },
      { id: 'd2', label: 'Vonóhálós halászhajó.', isCorrect: false, errorTypeId: 'e-halasz-nemvono-felre' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Vörös felül – fehér alul = nem vonóhálós halászhajó.', quality: 'pontos' },
      { id: 'g2', label: 'Összekevertem a két halászhajó-jelzést.', quality: 'reszben' },
      { id: 'g3', label: 'A vörös fény tilalmat jelent.', quality: 'teves' },
    ],
  },
  {
    id: 's-feny-nemkorm',
    ruleId: 'r-feny-nem-kormanyozhato',
    topicId: 'fenyek',
    prompt: 'Éjjel egy hajón két vörös fényt látsz függőlegesen egymás felett. Mit jelent?',
    scene: {
      ...night,
      objects: [
        { kind: 'light', x: 0, z: 0.72, lightColor: 'piros' },
        { kind: 'light', x: 0, z: 0.66, lightColor: 'piros' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Nem kormányozható hajó – neki kell kitérnem.', isCorrect: true },
      { id: 'd2', label: 'Manőverképességében korlátozott hajó.', isCorrect: false, errorTypeId: 'e-nemkorm-felre' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Két vörös fény = nem kormányozható hajó, elsőbbsége van.', quality: 'pontos' },
      { id: 'g2', label: 'Nem tudtam pontosan, melyik korlátozott állapot.', quality: 'reszben' },
      { id: 'g3', label: 'A két vörös fény horgonyzást jelez.', quality: 'teves' },
    ],
  },
  {
    id: 's-feny-mankorl',
    ruleId: 'r-feny-manoverkorlatolt',
    topicId: 'fenyek',
    prompt: 'Éjjel egy hajón függőlegesen vörös-fehér-vörös fényt látsz. Mit jelent?',
    scene: {
      ...night,
      objects: [
        { kind: 'light', x: 0, z: 0.74, lightColor: 'piros' },
        { kind: 'light', x: 0, z: 0.68, lightColor: 'feher' },
        { kind: 'light', x: 0, z: 0.62, lightColor: 'piros' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Manőverképességében korlátozott hajó (pl. munkavégzés).', isCorrect: true },
      { id: 'd2', label: 'Nem kormányozható hajó.', isCorrect: false, errorTypeId: 'e-mankorl-felre' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Vörös-fehér-vörös = manőverben korlátozott hajó.', quality: 'pontos' },
      { id: 'g2', label: 'Összekevertem a korlátozott állapotokat.', quality: 'reszben' },
      { id: 'g3', label: 'A fehér fény középen horgonyt jelez.', quality: 'teves' },
    ],
  },
  {
    id: 's-feny-merules',
    ruleId: 'r-feny-merules-korlatolt',
    topicId: 'fenyek',
    prompt: 'Éjjel egy hajón három vörös fényt látsz függőlegesen egymás felett. Mit jelent?',
    scene: {
      ...night,
      objects: [
        { kind: 'light', x: 0, z: 0.74, lightColor: 'piros' },
        { kind: 'light', x: 0, z: 0.68, lightColor: 'piros' },
        { kind: 'light', x: 0, z: 0.62, lightColor: 'piros' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Merülése miatt korlátozott hajó – elsőbbséget adok neki.', isCorrect: true },
      { id: 'd2', label: 'Nem kormányozható hajó.', isCorrect: false, errorTypeId: 'e-merules-felre' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Három vörös fény = merülés miatt korlátozott, a hajóúthoz kötött.', quality: 'pontos' },
      { id: 'g2', label: 'Nem tudtam, hány vörös fény melyik állapot.', quality: 'reszben' },
      { id: 'g3', label: 'A három vörös fény tüzet jelez.', quality: 'teves' },
    ],
  },
  {
    id: 's-feny-aknaszedo',
    ruleId: 'r-feny-aknaszedo',
    topicId: 'fenyek',
    prompt: 'Éjjel egy hajón három zöld fényt látsz háromszög alakban. Hogyan viselkedsz?',
    scene: {
      ...night,
      objects: [
        { kind: 'light', x: 0, z: 0.74, lightColor: 'zold' },
        { kind: 'light', x: -0.12, z: 0.66, lightColor: 'zold' },
        { kind: 'light', x: 0.12, z: 0.66, lightColor: 'zold' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Aknaszedő – nagy távolságban kikerülöm, mögé nem hajózom.', isCorrect: true },
      { id: 'd2', label: 'Vonóhálós halászhajó, közel is elhaladhatok.', isCorrect: false, errorTypeId: 'e-aknaszedo-felre' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Három zöld fény háromszögben = aknaszedő, aknaveszély, nagy távolság kell.', quality: 'pontos' },
      { id: 'g2', label: 'Nem ismertem fel a három zöld fényt.', quality: 'reszben' },
      { id: 'g3', label: 'A zöld fény szabad utat jelent.', quality: 'teves' },
    ],
  },
  {
    id: 's-feny-revkalauz',
    ruleId: 'r-feny-revkalauz',
    topicId: 'fenyek',
    prompt: 'Éjjel egy hajón egymás felett felül fehér, alul vörös körfényt látsz. Milyen hajó ez?',
    scene: {
      ...night,
      objects: [
        { kind: 'light', x: 0, z: 0.72, lightColor: 'feher' },
        { kind: 'light', x: 0, z: 0.66, lightColor: 'piros' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Révkalauz (pilóta) hajó.', isCorrect: true },
      { id: 'd2', label: 'Nem vonóhálós halászhajó.', isCorrect: false, errorTypeId: 'e-revkalauz-felre' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Fehér felül – vörös alul = révkalauz (a halászhajó fordítottja).', quality: 'pontos' },
      { id: 'g2', label: 'Összekevertem a révkalauzt a halászhajóval.', quality: 'reszben' },
      { id: 'g3', label: 'A fehér-vörös páros mindig tilalom.', quality: 'teves' },
    ],
  },
  {
    id: 's-feny-2kek',
    ruleId: 'r-feny-veszelyes-aru-2',
    topicId: 'fenyek',
    prompt: 'Éjjel egy hajón két kék fényt látsz egymás felett. Hogyan reagálsz?',
    scene: {
      environment: 'folyo',
      timeOfDay: 'ejszaka',
      visibility: 'tiszta',
      objects: [
        { kind: 'light', x: 0, z: 0.72, lightColor: 'sarga' },
        { kind: 'light', x: 0, z: 0.66, lightColor: 'sarga' },
      ],
    },
    decisions: [
      { id: 'd1', label: 'Egészségre ártalmas árut szállít – biztonságos távolságot tartok.', isCorrect: true },
      { id: 'd2', label: 'Sima teherhajó, nincs teendő.', isCorrect: false, errorTypeId: 'e-2kek-felre' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Két kék fény = egészségre ártalmas rakomány, távolságot kell tartani.', quality: 'pontos' },
      { id: 'g2', label: 'Nem figyeltem a kék fények számára.', quality: 'reszben' },
      { id: 'g3', label: 'A kék fény díszkivilágítás.', quality: 'teves' },
    ],
  },
]

const day = { environment: 'folyo', timeOfDay: 'nappal', visibility: 'tiszta' } as const
const sea = { environment: 'tenger', timeOfDay: 'nappal', visibility: 'tiszta' } as const

// ---------------------------------------------------------------------------
// JELZÉSEK / TÁBLÁK
// ---------------------------------------------------------------------------
const jelzesekSituations: Situation[] = [
  {
    id: 's-jel-lateralis-belvizi',
    ruleId: 'r-lateralis-jelek',
    topicId: 'jelzesek',
    prompt: 'Belvízi (folyami) hajóúton haladsz. Melyik oldalt jelzi a piros bója?',
    scene: { ...day, objects: [{ kind: 'boat', x: 0, z: 0.3 }, { kind: 'buoy-red', x: 0.5, z: 0.7 }, { kind: 'buoy-green', x: -0.5, z: 0.7 }] },
    decisions: [
      { id: 'd1', label: 'A piros a hajóút jobb oldalát, a zöld a bal oldalát (a folyásirány az irányadó).', isCorrect: true },
      { id: 'd2', label: 'A piros a bal, a zöld a jobb oldalt jelzi.', isCorrect: false, errorTypeId: 'e-buoy-rossz-oldal' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Belvízen jobb = piros, bal = zöld; felcseréltem.', quality: 'pontos' },
      { id: 'g2', label: 'Nem voltam biztos a bóják oldalában.', quality: 'reszben' },
      { id: 'g3', label: 'A bóják színe nem számít.', quality: 'teves' },
    ],
  },
  {
    id: 's-jel-tilto-motoros',
    ruleId: 'r-jel-tilto-motoros',
    topicId: 'jelzesek',
    prompt: 'Piros keretes táblát látsz, rajta áthúzott hajócsavarral. Mit jelent?',
    scene: { ...day, objects: [{ kind: 'boat', x: 0, z: 0.3 }, { kind: 'sign', x: -0.2, z: 0.75, label: '⌀🚫' }] },
    decisions: [
      { id: 'd1', label: 'Géphajóknak (hajtómotorosnak) tilos itt hajózni.', isCorrect: true },
      { id: 'd2', label: 'Csak lassítani kell.', isCorrect: false, errorTypeId: 'e-jel-motoros' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Az áthúzott hajócsavar géphajó-tilalom, nem sebességkorlát.', quality: 'pontos' },
      { id: 'g2', label: 'Nem ismertem fel pontosan a tiltást.', quality: 'reszben' },
      { id: 'g3', label: 'A tábla csak ajánlás.', quality: 'teves' },
    ],
  },
  {
    id: 's-jel-tilto-vizisi',
    ruleId: 'r-jel-tilto-vizisi',
    topicId: 'jelzesek',
    prompt: 'Piros keretes táblán áthúzott vízisíző alakot látsz. Mit jelent?',
    scene: { ...day, objects: [{ kind: 'boat', x: 0, z: 0.3 }, { kind: 'sign', x: -0.2, z: 0.75, label: '🎿🚫' }] },
    decisions: [
      { id: 'd1', label: 'Az adott területen tilos vízisízni.', isCorrect: true },
      { id: 'd2', label: 'Itt kötelező a vízisí.', isCorrect: false, errorTypeId: 'e-jel-vizisi' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Az áthúzott alak tilalmat jelent, nem kötelezettséget.', quality: 'pontos' },
      { id: 'g2', label: 'Nem figyeltem, hogy át van húzva.', quality: 'reszben' },
      { id: 'g3', label: 'A tábla a horgonyzást tiltja.', quality: 'teves' },
    ],
  },
  {
    id: 's-jel-tilto-hullam',
    ruleId: 'r-jel-tilto-hullam',
    topicId: 'jelzesek',
    prompt: 'Kikötő közelében „hullámkeltés tilos" jelzést látsz. Mit teszel?',
    scene: { ...day, objects: [{ kind: 'boat', x: 0, z: 0.3 }, { kind: 'sign', x: -0.2, z: 0.75, label: '〜🚫' }] },
    decisions: [
      { id: 'd1', label: 'Erősen lassítok, hogy ne keltsek káros hullámot.', isCorrect: true },
      { id: 'd2', label: 'Tartom a siklósebességet.', isCorrect: false, errorTypeId: 'e-jel-hullam' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A hullámkeltés tilalma miatt le kell lassítanom.', quality: 'pontos' },
      { id: 'g2', label: 'Nem lassítottam eléggé.', quality: 'reszben' },
      { id: 'g3', label: 'A hullám nem okoz kárt.', quality: 'teves' },
    ],
  },
  {
    id: 's-jel-korlat-magassag',
    ruleId: 'r-jel-korlat-magassag',
    topicId: 'jelzesek',
    prompt: 'Híd előtt piros keretes táblát látsz felfelé mutató háromszöggel és „7,50" számmal. Mit jelent?',
    scene: { ...day, objects: [{ kind: 'boat', x: 0, z: 0.3 }, { kind: 'sign', x: -0.2, z: 0.75, label: '△7,50' }] },
    decisions: [
      { id: 'd1', label: 'Korlátozott szabad magasság 7,50 m (a felépítmény/árboc ennél alacsonyabb legyen).', isCorrect: true },
      { id: 'd2', label: 'Korlátozott vízmélység 7,50 m.', isCorrect: false, errorTypeId: 'e-jel-magassag' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A felfelé mutató háromszög magasságot jelez, nem vízmélységet.', quality: 'pontos' },
      { id: 'g2', label: 'Összekevertem a háromszög irányát.', quality: 'reszben' },
      { id: 'g3', label: 'A szám a sebességhatár.', quality: 'teves' },
    ],
  },
  {
    id: 's-jel-ajanlott-atjaro',
    ruleId: 'r-jel-ajanlott-atjaro',
    topicId: 'jelzesek',
    prompt: 'Sárga rombusz jelzést látsz a víz felett. Mit jelez?',
    scene: { ...day, objects: [{ kind: 'boat', x: 0, z: 0.3 }, { kind: 'sign', x: 0, z: 0.75, label: '◆' }] },
    decisions: [
      { id: 'd1', label: 'Ajánlott átjáró – erre biztonságos áthaladni.', isCorrect: true },
      { id: 'd2', label: 'Áthaladási tilalom.', isCorrect: false, errorTypeId: 'e-jel-ajanlott' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A sárga rombusz ajánlott átjáró, nem tiltás.', quality: 'pontos' },
      { id: 'g2', label: 'Nem tudtam, ajánló vagy tiltó jel-e.', quality: 'reszben' },
      { id: 'g3', label: 'A sárga szín mindig veszélyt jelent.', quality: 'teves' },
    ],
  },
  {
    id: 's-jel-kardinalis',
    ruleId: 'r-jel-kardinalis',
    topicId: 'jelzesek',
    prompt: 'Egy zátony mellett ÉSZAKI kardinális jelet látsz. Melyik oldalon haladj el biztonságosan?',
    scene: { ...sea, objects: [{ kind: 'boat', x: 0, z: 0.25 }, { kind: 'buoy-yellow', x: 0.2, z: 0.7, label: 'É' }, { kind: 'hazard', x: 0.2, z: 0.55, label: 'zátony' }] },
    decisions: [
      { id: 'd1', label: 'A jeltől északra – ott van a biztonságos víz.', isCorrect: true },
      { id: 'd2', label: 'A jeltől délre.', isCorrect: false, errorTypeId: 'e-jel-kardinalis' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Az északi kardinális jelnél északon van a biztonságos víz.', quality: 'pontos' },
      { id: 'g2', label: 'Nem tudtam pontosan, melyik égtáj felől kerüljek.', quality: 'reszben' },
      { id: 'g3', label: 'A kardinális jel mellett bármelyik oldalon el lehet haladni.', quality: 'teves' },
    ],
  },
  {
    id: 's-jel-elszigetelt',
    ruleId: 'r-jel-elszigetelt',
    topicId: 'jelzesek',
    prompt: 'Egy bóján két fekete gömböt látsz egymás felett (éjjel Fl(2) fehér fény). Mit jelez?',
    scene: { ...sea, objects: [{ kind: 'boat', x: 0, z: 0.25 }, { kind: 'buoy-yellow', x: 0.1, z: 0.7, label: '●●' }] },
    decisions: [
      { id: 'd1', label: 'Elszigetelt veszély (pl. roncs) – biztonságos távolságban kikerülöm.', isCorrect: true },
      { id: 'd2', label: 'Ajánlott átjáró, áthaladok rajta.', isCorrect: false, errorTypeId: 'e-jel-elszigetelt' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A két fekete gömb elszigetelt veszélyt jelez, ki kell kerülni.', quality: 'pontos' },
      { id: 'g2', label: 'Nem ismertem fel a tetőjelet.', quality: 'reszben' },
      { id: 'g3', label: 'A bója fölött át lehet hajózni.', quality: 'teves' },
    ],
  },
  {
    id: 's-jel-buvar',
    ruleId: 'r-jel-buvar',
    topicId: 'jelzesek',
    prompt: 'Narancssárga bóját látsz a vízen. Hogyan haladsz el mellette?',
    scene: { ...day, objects: [{ kind: 'boat', x: -0.2, z: 0.3 }, { kind: 'buoy-yellow', x: 0.3, z: 0.65, label: 'búvár' }] },
    decisions: [
      { id: 'd1', label: 'Búvárok – erősen lassítok és nagy távolságban kerülöm ki.', isCorrect: true },
      { id: 'd2', label: 'Sima horgonyjelző, közel is elhaladhatok gyorsan.', isCorrect: false, errorTypeId: 'e-jel-buvar' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A narancssárga bója búvárt jelez, lassítani és távolodni kell.', quality: 'pontos' },
      { id: 'g2', label: 'Nem tartottam elég távolságot.', quality: 'reszben' },
      { id: 'g3', label: 'A búvárok nem lehetnek a felszín közelében.', quality: 'teves' },
    ],
  },
]

// ---------------------------------------------------------------------------
// NAVIGÁCIÓ — kitérés (COLREG), térkép/irány, világítótorony, hangjelzés
// ---------------------------------------------------------------------------
const navigacioSituations: Situation[] = [
  {
    id: 's-nav-keresztezes',
    ruleId: 'r-nav-keresztezes',
    topicId: 'navigacio',
    prompt: 'Egy hajó a JOBB oldalad felől keresztezi az utadat. Mit teszel?',
    scene: { ...sea, objects: [{ kind: 'boat', x: -0.2, z: 0.3 }, { kind: 'boat', x: 0.5, z: 0.55 }] },
    decisions: [
      { id: 'd1', label: 'Elengedem: csökkentek és jobbra térek ki, a fara mögött haladok el.', isCorrect: true },
      { id: 'd2', label: 'Tartom az irányt és a sebességet, nekem van elsőbbségem.', isCorrect: false, errorTypeId: 'e-nav-keresztezes' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A jobbról érkezőnek van elsőbbsége; nekem kell kitérnem.', quality: 'pontos' },
      { id: 'g2', label: 'Nem tudtam biztosan, kié az elsőbbség.', quality: 'reszben' },
      { id: 'g3', label: 'Keresztezéskor mindig a nagyobb hajónak van elsőbbsége.', quality: 'teves' },
    ],
  },
  {
    id: 's-nav-vitorlas-elony',
    ruleId: 'r-nav-vitorlas-elony',
    topicId: 'navigacio',
    prompt: 'Motoros csónakkal haladsz, előtted egy vitorlás keresztezi az utad. Ki tér ki?',
    scene: { ...sea, objects: [{ kind: 'boat', x: -0.2, z: 0.3 }, { kind: 'boat', x: 0.3, z: 0.55 }] },
    decisions: [
      { id: 'd1', label: 'Én (a motoros) térek ki a vitorlás elől.', isCorrect: true },
      { id: 'd2', label: 'A vitorlásnak kell kitérnie előlem.', isCorrect: false, errorTypeId: 'e-nav-vitorlas' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A hajtómotoros csónak elsőbbséget ad a vitorlásnak.', quality: 'pontos' },
      { id: 'g2', label: 'Nem voltam biztos a motoros/vitorlás sorrendben.', quality: 'reszben' },
      { id: 'g3', label: 'Mindig a gyorsabb hajónak van elsőbbsége.', quality: 'teves' },
    ],
  },
  {
    id: 's-nav-kiteresi-sorrend',
    ruleId: 'r-nav-kiteresi-sorrend',
    topicId: 'navigacio',
    prompt: 'Vitorlással haladsz, és egy halászhajóval találkozol. Ki tér ki?',
    scene: { ...sea, objects: [{ kind: 'boat', x: -0.2, z: 0.3 }, { kind: 'boat', x: 0.3, z: 0.55 }] },
    decisions: [
      { id: 'd1', label: 'Én (a vitorlás) térek ki a halászhajó elől.', isCorrect: true },
      { id: 'd2', label: 'A halászhajónak kell kitérnie előlem.', isCorrect: false, errorTypeId: 'e-nav-sorrend' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A sorrendben a vitorlás kitér a halászhajó elől.', quality: 'pontos' },
      { id: 'g2', label: 'Nem emlékeztem a kitérési sorrendre.', quality: 'reszben' },
      { id: 'g3', label: 'A vitorlásnak mindenki kitér.', quality: 'teves' },
    ],
  },
  {
    id: 's-nav-folyasirany',
    ruleId: 'r-nav-folyasirany',
    topicId: 'navigacio',
    prompt: 'Folyón fölfelé (ár ellen) haladsz, szemből egy hajó jön lefelé (árral). Ki ad elsőbbséget?',
    scene: { ...day, objects: [{ kind: 'boat', x: -0.2, z: 0.3 }, { kind: 'boat', x: 0.1, z: 0.6 }] },
    decisions: [
      { id: 'd1', label: 'Én (ár ellen haladó) adok elsőbbséget a lefelé jövőnek.', isCorrect: true },
      { id: 'd2', label: 'A lefelé jövőnek kell elengednie engem.', isCorrect: false, errorTypeId: 'e-nav-folyas' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Ár ellen haladva könnyebben manőverezek, ezért én adok elsőbbséget.', quality: 'pontos' },
      { id: 'g2', label: 'Nem tudtam, ki ad elsőbbséget folyón.', quality: 'reszben' },
      { id: 'g3', label: 'Folyón nincs elsőbbségi szabály.', quality: 'teves' },
    ],
  },
  {
    id: 's-nav-tavolsagok',
    ruleId: 'r-nav-tavolsagok',
    topicId: 'navigacio',
    prompt: 'Jetskivel teljes gázzal szeretnél menni. Milyen messze kell lenned a parttól?',
    scene: { ...sea, objects: [{ kind: 'boat', x: 0, z: 0.35 }] },
    decisions: [
      { id: 'd1', label: 'Legalább 300 m-re a parttól.', isCorrect: true },
      { id: 'd2', label: 'Elég 50 m is.', isCorrect: false, errorTypeId: 'e-nav-tavolsag' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Jetski/glisszer csak 300 m-en túl mehet teljes gázzal; az 50 m a motorindításra vonatkozik.', quality: 'pontos' },
      { id: 'g2', label: 'Összekevertem a 300 m-t az 50 m-rel.', quality: 'reszben' },
      { id: 'g3', label: 'Nincs távolsági szabály a jetskire.', quality: 'teves' },
    ],
  },
  {
    id: 's-nav-orrszog',
    ruleId: 'r-nav-orrszog',
    topicId: 'navigacio',
    prompt: 'Egy céltárgy a hajód orrvonalától jobbra van. Milyen színnel/oldallal jellemzed az orrszöget?',
    scene: { ...sea, objects: [{ kind: 'boat', x: 0, z: 0.3 }, { kind: 'buoy-green', x: 0.5, z: 0.6 }] },
    decisions: [
      { id: 'd1', label: 'Jobb oldal → zöld, 0–180° az orrvonaltól mérve.', isCorrect: true },
      { id: 'd2', label: 'Jobb oldal → vörös.', isCorrect: false, errorTypeId: 'e-nav-orrszog' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Az orrszögnél a jobb oldal zöld (a pozíciós lámpák színe szerint).', quality: 'pontos' },
      { id: 'g2', label: 'Felcseréltem a zöld és vörös oldalt.', quality: 'reszben' },
      { id: 'g3', label: 'Az orrszög az északhoz mért szög.', quality: 'teves' },
    ],
  },
  {
    id: 's-nav-vilagitotorony',
    ruleId: 'r-nav-vilagitotorony',
    topicId: 'navigacio',
    prompt: 'A térképen egy fény jelölése: „W Fl(2) 10s 13m 5M". Mit jelent a „Fl(2) 10s"?',
    scene: { ...sea, objects: [{ kind: 'boat', x: 0, z: 0.3 }, { kind: 'light', x: 0.3, z: 0.7, lightColor: 'feher' }] },
    decisions: [
      { id: 'd1', label: 'Csoportosan két felvillanás, 10 mp periódusidővel.', isCorrect: true },
      { id: 'd2', label: '10 felvillanás 2 másodpercenként.', isCorrect: false, errorTypeId: 'e-nav-vt' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'Fl(2) = 2 felvillanás egy csoportban, 10s = a periódus; W = fehér.', quality: 'pontos' },
      { id: 'g2', label: 'Nem tudtam pontosan a jelölés részeit.', quality: 'reszben' },
      { id: 'g3', label: 'A számok a torony korát jelzik.', quality: 'teves' },
    ],
  },
  {
    id: 's-nav-hangjelzes',
    ruleId: 'r-nav-hangjelzes',
    topicId: 'navigacio',
    prompt: 'Mennyi ideig tart egy „hosszú" hangjelzés?',
    scene: { ...sea, objects: [{ kind: 'boat', x: 0, z: 0.35 }] },
    decisions: [
      { id: 'd1', label: '4–5 másodpercig (a rövid 1–2 mp).', isCorrect: true },
      { id: 'd2', label: '1–2 másodpercig.', isCorrect: false, errorTypeId: 'e-nav-hang' },
    ],
    diagnosisOptions: [
      { id: 'g1', label: 'A hosszú hang 4–5 mp, a rövid 1–2 mp; felcseréltem.', quality: 'pontos' },
      { id: 'g2', label: 'Nem emlékeztem pontosan az időtartamokra.', quality: 'reszben' },
      { id: 'g3', label: 'A hangjelzés hossza szabadon választható.', quality: 'teves' },
    ],
  },
]

export const extraSituations: Situation[] = [
  ...fenyekSituations,
  ...jelzesekSituations,
  ...navigacioSituations,
]
