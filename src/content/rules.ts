import type { Rule } from './types'
import { extraRules } from './rulesExtra'

// A szabályok a Sidro Nautika ICC tananyagból (docs/forras-tananyag) származnak.
const coreRules: Rule[] = [
  // --- Jelzések ---
  {
    id: 'r-kikotes-ar-ellen',
    topicId: 'jelzesek',
    title: 'Kikötés folyón árral szemben',
    correctSummary: 'Folyón mindig folyásiránnyal szemben (ár ellen) kell kikötni.',
    explanations: {
      rovid: 'Folyón ár ellen köss ki – így a sodrás a part felé nyom, és a hajó irányítható marad.',
      kozepes:
        'Folyóvízen a kikötést mindig folyásiránnyal szemben végezd. Ha a sodrással megegyező irányban próbálsz kikötni, a víz tovább löki a hajót, nehezen fékezhető és nehezen tartható a part mellett.',
      reszletes:
        'A folyó sodrása állandó erőt fejt ki a hajóra. Ha ár ellen fordulsz kikötéskor, a sodrás lassít és stabilan a part felé tart, így kis sebességgel, pontosan tudsz manőverezni. Sodrással megegyező irányban a víz gyorsít, a kormányzás bizonytalanná válik, és könnyen nekicsapódhatsz a partnak vagy más hajónak. Ezért a szabály: folyón mindig folyásiránnyal szemben köss ki.',
    },
    typicalErrors: [
      { id: 'e-kikotes-arral', label: 'Sodrással megegyező irányban próbáltál kikötni.' },
    ],
  },
  {
    id: 'r-athaladni-tilos',
    topicId: 'jelzesek',
    title: 'Áthaladni tilos jelzés',
    correctSummary: 'Két egymás feletti piros tábla/fény tartós tilalmat jelez: nem szabad áthaladni.',
    explanations: {
      rovid: 'Két egymás feletti piros jelzés = áthaladni tilos. Állj meg, ne haladj tovább.',
      kozepes:
        'A tiltó jelzések osztályába tartozik az áthaladási tilalom: két egymás felett elhelyezett piros tábla, fény vagy lobogó tartós tilalmat jelez. Ilyenkor tilos a szakaszon áthaladni.',
      reszletes:
        'A táblák 5 osztálya közül a tiltó jelzések a legszigorúbbak. Két egymás feletti piros elem (tábla, fény vagy lobogó) tartós áthaladási tilalmat jelent – jellemzően zsilip, híd vagy veszélyes szakasz előtt. A helyes döntés: megállni és megvárni a tilalom feloldását (pl. a jelzés megváltozását). Az áthaladás szabálysértés és balesetveszélyes.',
    },
    typicalErrors: [
      { id: 'e-athaladt', label: 'Áthaladtál a tartós tilalmat jelző piros jelzés ellenére.' },
    ],
  },
  {
    id: 'r-korlatozott-melyseg',
    topicId: 'jelzesek',
    title: 'Korlátozott vízmélység tábla',
    correctSummary:
      'Piros keretes tábla lefelé mutató háromszöggel és számmal a korlátozott vízmélységet jelzi (méterben).',
    explanations: {
      rovid: 'A lefelé mutató háromszög + szám korlátozott vízmélységet jelent – ne menj sekélyre.',
      kozepes:
        'A korlátozó jelzések közé tartozik a korlátozott vízmélység tábla: piros keret, lefelé mutató fekete háromszög és egy szám (pl. 2,20). A szám a rendelkezésre álló vízmélységet adja meg méterben.',
      reszletes:
        'A korlátozó (C osztályú) táblák a hajózható tér méreteit jelzik. A korlátozott vízmélység táblán a szám (pl. 2,20 m) azt mutatja, mekkora vízmélységre számíthatsz. Ha a hajód merülése ehhez közeli vagy nagyobb, más útvonalat kell választani, különben megfeneklés fenyeget. A hasonló táblák a szabad magasságot vagy az átjáró szélességét is jelezhetik.',
    },
    typicalErrors: [
      { id: 'e-melyseg-felre', label: 'Rosszul értelmezted a táblát (nem vízmélység-korlátozásként).' },
    ],
  },
  // --- Fények ---
  {
    id: 'r-gephajo-fenyei',
    topicId: 'fenyek',
    title: 'Menetben lévő géphajó fényei',
    correctSummary:
      'Fehér árbócfény elöl, piros oldalfény balra, zöld jobbra, hátul fehér farfény.',
    explanations: {
      rovid: 'Fehér árbócfény + piros (bal) és zöld (jobb) oldalfény = menetben lévő géphajó.',
      kozepes:
        'A menetben lévő géphajó fehér árbócfényt visel elöl, oldalt piros (bal) és zöld (jobb) oldalfényt, hátul pedig fehér farfényt. Ha mindkét oldalfényt és az árbócfényt látod, szemből közeledő géphajóval van dolgod.',
      reszletes:
        'A hajófények a hajó típusát és irányát árulják el sötétben. A géphajó jellemzője a fehér árbóc-menetfény. A piros oldalfény a bal, a zöld a jobb oldalt jelzi. Ha egyszerre látod a pirosat és a zöldet is, a hajó szemből tart feléd; ha csak a zöldet, a jobb oldalát mutatja (te vagy az ő jobbján). Ezek alapján lehet kitérési döntést hozni.',
    },
    typicalErrors: [
      { id: 'e-gephajo-felre', label: 'Rosszul azonosítottad a fények alapján a hajótípust/irányt.' },
    ],
  },
  {
    id: 'r-horgonyfeny',
    topicId: 'fenyek',
    title: 'Horgonyon álló hajó fénye',
    correctSummary: 'A horgonyon álló hajó körkörös fehér fényt mutat (nincs oldalfény, nincs menetfény).',
    explanations: {
      rovid: 'Körkörös fehér fény, oldalfények nélkül = horgonyon álló hajó.',
      kozepes:
        'A horgonyon álló (nem menetben lévő) hajó minden irányból látható fehér fényt mutat, és nincsenek oldalfényei. Ez jelzi, hogy a hajó áll, nem halad.',
      reszletes:
        'Fontos különbség: a menetben lévő hajónak oldalfényei (piros/zöld) és menetfénye van, a horgonyon állónak viszont csak körkörös fehér fénye. Ha csak egy magányos fehér fényt látsz oldalfények nélkül, valószínűleg álló, horgonyzó hajó – ennek megfelelően kell mellette elhaladni és sebességet mérsékelni.',
    },
    typicalErrors: [
      { id: 'e-horgony-menetben', label: 'Menetben lévő hajónak nézted a horgonyon állót.' },
    ],
  },
  {
    id: 'r-kek-fenyek-veszelyes-aru',
    topicId: 'fenyek',
    title: 'Kék fények: veszélyes árut szállító hajó',
    correctSummary: 'Két kék fény egymás felett = egészségre ártalmas áru; három kék fény = robbanásveszélyes áru.',
    explanations: {
      rovid: 'Több kék fény egymás felett veszélyes rakományt jelez – tarts biztonságos távolságot.',
      kozepes:
        'Éjszaka a veszélyes árut szállító hajókat kék fények jelzik: két kék fény egymás felett egészségre ártalmas árut, három kék fény robbanásveszélyes árut jelent. Nappal ugyanezt kék kúp(ok) jelzik.',
      reszletes:
        'A veszélyes rakományt szállító hajók külön jelzést viselnek. Két kék fény (kb. 1 m távolságra egymás felett) egészségre ártalmas árut, három kék fény robbanásveszélyes árut jelez, minden oldalról láthatóan. Ilyen hajó közelében fokozott óvatosság, nagyobb követési távolság és tilos a dohányzás/nyílt láng a közelben – a helyes döntés a biztonságos távolságtartás.',
    },
    typicalErrors: [
      { id: 'e-kek-figyelmen', label: 'Nem ismerted fel a kék fényeket veszélyes áru jelzéseként.' },
    ],
  },
  // --- Rádiózás ---
  {
    id: 'r-mayday',
    topicId: 'radiozas',
    title: 'Vészhelyzet: MAYDAY',
    correctSummary: 'Közvetlen, súlyos életveszélynél MAYDAY hívás a 16-os csatornán, háromszor.',
    explanations: {
      rovid: 'Életveszély (süllyedés, tűz, ember a vízben) → MAYDAY, 16-os csatorna, 3×.',
      kozepes:
        'A MAYDAY a legmagasabb szintű vészhívás: akkor használd, ha a hajót vagy embert közvetlen, súlyos veszély fenyegeti (süllyedés, tűz, ember a vízben). Háromszor kell bemondani a 16-os csatornán, és csak a hajóparancsnok engedélyezheti.',
      reszletes:
        'A rádiós vészjelzések három szintűek. MAYDAY: közvetlen életveszély (süllyedés, tűz, ember a vízben) – „Mayday, Mayday, Mayday", majd a hajó neve, pozíció, a veszély jellege, a szükséges segítség, végül „Over". A 16-os a nemzetközi vész- és hívócsatorna. A Pan-pan sürgősség életveszély nélkül, a Sécurité biztonsági/navigációs figyelmeztetés – ezeket nem szabad összekeverni a valós életveszéllyel.',
    },
    typicalErrors: [
      { id: 'e-nem-mayday', label: 'Életveszélyben alacsonyabb szintű hívást (Pan-pan/Sécurité) választottál.' },
    ],
  },
  {
    id: 'r-panpan',
    topicId: 'radiozas',
    title: 'Sürgősség: PAN-PAN',
    correctSummary: 'Sürgős, de közvetlen életveszéllyel nem járó helyzetnél PAN-PAN hívás.',
    explanations: {
      rovid: 'Sürgős probléma életveszély nélkül (pl. motorhiba) → PAN-PAN.',
      kozepes:
        'A PAN-PAN sürgősségi hívás: sürgős segítségre van szükség, de nincs közvetlen életveszély – például motorhiba, kormányhiba, sodródás. A 16-os csatornán adják le, „Pan-pan" háromszor ismételve.',
      reszletes:
        'A PAN-PAN a középső szint a MAYDAY és a Sécurité között. Akkor használatos, ha a helyzet sürgős (technikai probléma, sodródás), de nincs közvetlen, súlyos életveszély. Ha életveszélyre fokozódik (pl. a hajó süllyedni kezd), MAYDAY-re kell váltani. Túlzott MAYDAY-riasztás viszont indokolatlanul mozgósítja a mentőerőket – ezért fontos a helyes szint megválasztása.',
    },
    typicalErrors: [
      { id: 'e-tul-mayday', label: 'Életveszély nélküli helyzetben MAYDAY-t adtál le.' },
    ],
  },
  {
    id: 'r-securite',
    topicId: 'radiozas',
    title: 'Biztonsági közlemény: SÉCURITÉ',
    correctSummary: 'Navigációs vagy meteorológiai figyelmeztetést SÉCURITÉ hívással közölnek.',
    explanations: {
      rovid: 'Navigációs/időjárási figyelmeztetés → SÉCURITÉ.',
      kozepes:
        'A SÉCURITÉ biztonsági közlemény: navigációs veszélyről (pl. úszó akadály, sodródó tárgy) vagy időjárási figyelmeztetésről tájékoztat. Nem személyes vészhelyzet, hanem figyelemfelhívás a többi hajósnak.',
      reszletes:
        'A SÉCURITÉ a legalacsonyabb prioritású a három közül, mégis fontos: ezzel adnak közre navigációs vagy meteorológiai figyelmeztetéseket (zátony, úszó fatörzs, közelgő vihar). Nem a saját hajó bajáról szól. A „Sécurité" szót háromszor mondják, majd a közlemény következik. Vészhelyzetben (MAYDAY) vagy sürgősségben (PAN-PAN) nem ezt kell használni.',
    },
    typicalErrors: [
      { id: 'e-securite-felre', label: 'Figyelmeztető közleményt rossz hívástípussal adtál le.' },
    ],
  },
  // --- Horgonyzás ---
  {
    id: 'r-lanchossz',
    topicId: 'horgonyzas',
    title: 'Lánchossz és vízmélység',
    correctSummary:
      'Folyón a vízmélység 3–5-szörös, tengeren 4–6-szoros lánc/kötél hossz szükséges.',
    explanations: {
      rovid: 'Ereszd le a láncot a vízmélység legalább 3–5-szörösére (tengeren 4–6-szorosára).',
      kozepes:
        'A biztonságos horgonyzáshoz a lánc/kötél hosszának a vízmélységhez kell igazodnia: folyón a vízmélység 3–5-szöröse, tengeren 4–6-szorosa. Túl rövid láncnál a horgony nem tart, és a hajó elsodródhat.',
      reszletes:
        'A horgony akkor tart, ha a lánc közel vízszintesen húzza a fenéken – ehhez elég hosszú láncra van szükség. Folyón a vízmélység 3–5-szörösét, tengeren (nagyobb hullám és apály-dagály miatt) 4–6-szorosát ereszd le. Ha túl kevés láncot adsz ki, a horgony kiszakad és a hajó sodródni kezd; ha van rá mód, apály-dagály esetén a maximális vízmélységgel számolj.',
    },
    typicalErrors: [
      { id: 'e-keves-lanc', label: 'Túl kevés láncot engedtél ki a vízmélységhez képest.' },
    ],
  },
  {
    id: 'r-horgonyzas-tilos',
    topicId: 'horgonyzas',
    title: 'Horgonyzási tilalom',
    correctSummary: 'A horgonyt áthúzó tiltó tábla helyén tilos horgonyozni és láncot vonszolni.',
    explanations: {
      rovid: 'Áthúzott horgony tábla = tilos horgonyozni – keress másik helyet.',
      kozepes:
        'A tiltó jelzések közé tartozik a horgonyzási tilalom: áthúzott horgonyt ábrázoló tábla jelzi, hogy tilos horgonyozni, illetve horgonyt vagy láncot vonszolni – jellemzően kábelek, csővezetékek védelme miatt.',
      reszletes:
        'A horgonyzási tilalmat jelző táblák aljzati kábeleket, csöveket vagy más víz alatti létesítményeket védenek. A horgony leengedése vagy a lánc/kötél vonszolása itt komoly kárt okozhat és szabálysértés. A helyes döntés: továbbhaladni és a tilalmi szakaszon kívül, engedélyezett helyen horgonyozni.',
    },
    typicalErrors: [
      { id: 'e-tilos-helyen', label: 'Tiltó tábla ellenére horgonyoztál.' },
    ],
  },
  {
    id: 'r-kikotes-kotel-kereszt',
    topicId: 'horgonyzas',
    title: 'Kikötési óvintézkedés',
    correctSummary: 'Ügyelj, hogy a kikötött hajók kötelei ne keresztezzék egymást.',
    explanations: {
      rovid: 'Ne keresztezd más hajók kötelét kikötéskor – összegabalyodást okoz.',
      kozepes:
        'Kikötéskor fontos, hogy a kötelek ne keresztezzék egymást. A keresztező kötelek összegabalyodnak, ami nehezíti a ki- és beállást, és balesetveszélyes.',
      reszletes:
        'Szűk kikötőben a kötélvezetés rendezettsége biztonsági kérdés. Ha a kötelek keresztezik egymást, egy hajó indulásakor a másik kötele megfeszülhet vagy elszabadulhat, összegabalyodás és sérülés keletkezhet. Ezért úgy tervezd a kikötést, hogy a saját köteleid a szomszédos hajókétól elkülönülve, párhuzamosan fussanak.',
    },
    typicalErrors: [
      { id: 'e-kotel-kereszt', label: 'Úgy kötöttél ki, hogy a kötelek keresztezték a szomszéd hajóét.' },
    ],
  },
  // --- Navigáció (küldetésekhez) ---
  {
    id: 'r-lateralis-jelek',
    topicId: 'jelzesek',
    title: 'Laterális (oldalsó) jelek — belvíz',
    correctSummary: 'Belvízen a hajóút jobb oldalát piros, bal oldalát zöld bója jelzi (a folyásirány az irányadó); a bóják között a biztonságos víz.',
    explanations: {
      rovid: 'Belvízen a hajóút jobb oldala piros, bal oldala zöld bója – köztük haladj.',
      kozepes:
        'A belvízi laterális jelek a hajóút szélét jelzik: a jobb oldalt piros, a bal oldalt zöld bója (a kitűzésnél mindig a folyó folyásiránya az irányadó). A bóják közötti sáv a biztonságos víz; a rossz oldalon elhaladva kimész a hajóútból.',
      reszletes:
        'Belvízen (folyón) a hajóút jobb oldalát piros, bal oldalát zöld bójával jelölik, és a bal/jobb meghatározásánál mindig a folyásirány az irányadó. A biztonságos víz a piros és zöld bóják között van. Ha egy bóját a rossz oldalon hagysz el, sekély vagy veszélyes vízre kerülhetsz. (Tengeren a laterális rendszer eltérő lehet – ott a térkép és a IALA-régió az irányadó.)',
    },
    typicalErrors: [{ id: 'e-buoy-rossz-oldal', label: 'A bóját a rossz oldalon hagytad el, kimentél a hajóútból.' }],
  },
  {
    id: 'r-akadaly-kerules',
    topicId: 'jelzesek',
    title: 'Akadály és sekély víz kerülése',
    correctSummary: 'A jelzett akadályt/zátonyt biztonságos távolságban kell kikerülni.',
    explanations: {
      rovid: 'Tartsd a hajóutat, kerüld el a zátonyt/akadályt.',
      kozepes:
        'A parti sáv, a zátony és a jelzett akadály veszélyes. Maradj a hajóútban, és tarts biztonságos távolságot az akadálytól, hogy ne feneklj meg és ne ütközz.',
      reszletes:
        'A hajózható tér korlátozott: a part menti sekélyek, zátonyok és jelzett akadályok megfeneklést vagy ütközést okozhatnak. A helyes döntés a hajóút tartása és az akadály biztonságos, kellő távolságú kikerülése – nem közvetlenül mellette elhaladva, mert a víz alatti kiterjedés nagyobb lehet a látszatnál.',
    },
    typicalErrors: [{ id: 'e-akadalynak', label: 'Nekimentél az akadálynak / kihajóztál a sekélyre.' }],
  },
  {
    id: 'r-kod-sebesseg',
    topicId: 'navigacio',
    title: 'Sebesség ködben',
    correctSummary: 'Ködben, korlátozott látásnál mérsékelt (biztonságos) sebességgel kell haladni.',
    explanations: {
      rovid: 'Ködben lassíts – csak akkora sebesség, amivel időben meg tudsz állni.',
      kozepes:
        'Korlátozott látásnál (köd) a biztonságos sebesség az, amellyel a látótávolságon belül meg tudsz állni. Túl gyorsan haladva nem tudsz időben reagálni egy hirtelen felbukkanó akadályra vagy hajóra.',
      reszletes:
        'Ködben és korlátozott látási viszonyok között a szabály a „biztonságos sebesség": olyan lassan haladj, hogy a rendelkezésre álló látótávolságon belül biztonságosan meg tudj állni. Emellett fokozott figyelem, hangjelzések használata és szükség esetén a radar segít. A túl nagy sebesség a leggyakoribb hiba – ütközéshez vagy megfeneklődéshez vezethet, mert nincs idő reagálni.',
    },
    typicalErrors: [{ id: 'e-kod-gyors', label: 'Ködben túl gyorsan haladtál, nem tudtál időben megállni.' }],
  },
  {
    id: 'r-colreg-kiteres',
    topicId: 'fenyek',
    title: 'Kitérés szemből közeledő hajónál (COLREG)',
    correctSummary: 'Szemből közeledő géphajók jobbra (starboard) térnek ki, és bal oldalukkal (port-to-port) haladnak el.',
    explanations: {
      rovid: 'Szemből jövő hajónál fordulj jobbra – bal oldalatokkal haladjatok el egymás mellett.',
      kozepes:
        'Ha két géphajó szemből közeledik (fejtől), mindkettőnek jobbra (starboard) kell kitérnie, hogy a bal oldalukkal (port-to-port) haladjanak el. Ha nem térsz ki, vagy rossz irányba fordulsz, ütközésveszély alakul ki.',
      reszletes:
        'A COLREG kitérési szabály szerint szemből közeledő (fejtől találkozó) géphajóknál mindkét hajó jobbra (starboard) tér ki, és a bal oldalukkal (port-to-port) haladnak el egymás mellett. Éjszaka ezt a fények is jelzik: ha szemből mindkét oldalfényt (piros és zöld) és az árbócfényt látod, fejtől közeledtek. Ilyenkor időben, határozottan fordulj jobbra. A balra fordulás vagy az irány tartása a leggyakoribb, veszélyes hiba.',
    },
    typicalErrors: [{ id: 'e-nem-teres', label: 'Nem tértél ki jobbra időben a szemből jövő hajó elől.' }],
  },
]

export const rules: Rule[] = [...coreRules, ...extraRules]
export const ruleById = new Map(rules.map((r) => [r.id, r]))
