import type { Rule } from './types'

// Kiterjesztett szabálykészlet a teljes tananyag lefedéséhez (spec 6. fejezet).
// Témánként csoportosítva; a rules.ts a coreRules mellé fűzi.

// ---------------------------------------------------------------------------
// FÉNYEK — éjszakai jelzések (a hajó típusának/állapotának felismerése)
// ---------------------------------------------------------------------------
const fenyekRules: Rule[] = [
  {
    id: 'r-feny-csonak-kicsi',
    topicId: 'fenyek',
    title: '7 m-nél rövidebb csónak fénye',
    correctSummary: 'A 7 m-nél rövidebb csónak éjjel körkörös fehér fényt (vagy elemlámpát) mutat.',
    explanations: {
      rovid: 'Kis csónak (<7 m): egyetlen körkörös fehér fény elég.',
      kozepes:
        'A 7 méternél rövidebb csónak éjszaka legalább egy minden irányból látható fehér fényt köteles mutatni; ennek hiányában elemlámpát kell használni a közeledő hajónak megmutatni.',
      reszletes:
        'A fényeket napnyugtától napkeltéig kell viselni, megtévesztő fény tilos. A 7 m-nél rövidebb csónaknak elég egyetlen körkörös (minden irányból látható) fehér fény. Ez nem téveszthető össze a menetben lévő géphajó oldalfényes-árbócfényes képével. Ha nincs beépített lámpa, kéznél tartott elemlámpával kell jelezni a jelenlétet, hogy elkerüljük az ütközést.',
    },
    typicalErrors: [{ id: 'e-csonak-felre', label: 'Rosszul azonosítottad a magányos fehér fényt.' }],
  },
  {
    id: 'r-feny-vitorlas',
    topicId: 'fenyek',
    title: 'Menetben lévő vitorlás fényei',
    correctSummary: 'A vitorlás oldalfényeket (piros/zöld) és farfényt visel, de árbóc-menetfényt NEM.',
    explanations: {
      rovid: 'Oldalfények + farfény, árbócfény nélkül = vitorlás (nem géphajó).',
      kozepes:
        'A menetben lévő vitorlás piros (bal) és zöld (jobb) oldalfényt, valamint fehér farfényt visel, de nincs fehér árbóc-menetfénye. Ez különbözteti meg a géphajótól, amelynek van árbócfénye.',
      reszletes:
        'A kulcskülönbség a géphajóhoz képest az árbóc-menetfény hiánya. A vitorlás csak oldalfényeket (piros bal, zöld jobb) és farfényt mutat. Ha egy hajón látod az oldalfényeket, de nincs felül fehér árbócfény, akkor vitorlásról van szó – ennek megfelelően alakítsd a kitérést (a géphajó általában kitér a vitorlás elől).',
    },
    typicalErrors: [{ id: 'e-vitorlas-gephajo', label: 'Géphajónak nézted a vitorlást (árbócfény hiánya).' }],
  },
  {
    id: 'r-feny-vontato',
    topicId: 'fenyek',
    title: 'Vontató hajó fényei',
    correctSummary: 'A vontató elöl két fehér árbócfényt egymás felett, hátul sárga farfényt visel.',
    explanations: {
      rovid: 'Két fehér árbócfény egymás felett + sárga farfény = vontató.',
      kozepes:
        'A vontató hajó a hajó elején két fehér árbóclámpát visel egymás felett, a farlámpája pedig sárga. Ha a vonta hossza meghaladja a 200 m-t, három árbócfényt kell viselnie.',
      reszletes:
        'A vontatót a két egymás feletti fehér árbócfény és a sárga farfény azonosítja. Hosszú vonta (>200 m) esetén három árbócfény jelzi a fokozott veszélyt. Vontató közelében nagy távolságot kell tartani, mert a vonta (kötél/uszály) messze elnyúlhat a hajó mögött, és a közte lévő kötél veszélyes.',
    },
    typicalErrors: [{ id: 'e-vontato-felre', label: 'Nem ismerted fel a vontatót a két árbócfény + sárga farfény alapján.' }],
  },
  {
    id: 'r-feny-tolohajo',
    topicId: 'fenyek',
    title: 'Toló hajó fényei',
    correctSummary: 'Uszályt toló hajó elöl három fehér fényt háromszögben, hátul három vízszintes fehér fényt visel.',
    explanations: {
      rovid: 'Elöl három fehér fény háromszögben (csúccsal felfelé) = toló hajó.',
      kozepes:
        'A tolóhajók, amennyiben uszályt tolnak maguk előtt, elöl három fehér fényt viselnek egyenlő szárú háromszög alakban, csúccsal felfelé, a hajó farában pedig három vízszintes fehér fényt.',
      reszletes:
        'A toló kötelék hosszú és nehezen manőverezik. Az elöl háromszögben elhelyezett három fehér fény jelzi a toló hajót; a fara három vízszintes fehér fényt visel. Mivel a tolt uszály(ok) a hajó előtt vannak és a kötelék tehetetlensége nagy, jóval korábban és nagyobb távolságban kell kitérni előlük.',
    },
    typicalErrors: [{ id: 'e-tolo-felre', label: 'Nem azonosítottad a toló hajót a háromszög alakú fehér fények alapján.' }],
  },
  {
    id: 'r-feny-halasz-vonohalos',
    topicId: 'fenyek',
    title: 'Vonóhálós halászhajó fényei',
    correctSummary: 'Vonóhálót vontató halászhajó: felül zöld, alul fehér körbevilágító fény.',
    explanations: {
      rovid: 'Felül zöld, alul fehér körfény = vonóhálós halászhajó.',
      kozepes:
        'A vonóhálót vagy fenékkaparó hálót vontató halászhajó az árbócfény közelében, egymás felett felül zöld, alul fehér körbevilágító lámpát visel. Nappali jele a csúcsával összefordított fekete kettős kúp.',
      reszletes:
        'A halászhajók korlátozottan manővereznek, ezért ki kell térni előlük. A vonóhálós halászhajót a „zöld felül – fehér alul" körfények azonosítják; ha a hossza meghaladja az 50 m-t, e mögött és magasabban egy fehér árbócfényt is visel. Nappal a csúcsával összefordított fekete kettős kúp jelzi (kis hajón kosárral helyettesíthető).',
    },
    typicalErrors: [{ id: 'e-halasz-vono-felre', label: 'Nem ismerted fel a vonóhálós halászhajót (zöld-fehér körfény).' }],
  },
  {
    id: 'r-feny-halasz-nem-vono',
    topicId: 'fenyek',
    title: 'Nem vonóhálós halászhajó fényei',
    correctSummary: 'Nem vonóhálós (a háló a felszínen úszik) halászhajó: felül vörös, alul fehér körfény.',
    explanations: {
      rovid: 'Felül vörös, alul fehér körfény = nem vonóhálós halászhajó.',
      kozepes:
        'A nem vonóhálós, halászattal foglalkozó hajó (a háló a felszínen úszik) az árbóclámpa helyén, egymás felett felül vörös, alul fehér körbevilágító fényt visel. Nappal csúcsaival összefordított fekete kettős kúpot.',
      reszletes:
        'A „vörös felül – fehér alul" körfény a nem vonóhálós halászhajót jelzi. Ha a háló a hajótól 150 m-nél messzebb nyúlik, a háló irányában egy fehér lámpát vagy csúcsával lefelé mutató fekete kúpot is visel, mert a kifeszített háló veszélyes a közlekedő hajókra. Ki kell térni előle.',
    },
    typicalErrors: [{ id: 'e-halasz-nemvono-felre', label: 'Összekeverted a vonóhálós és nem vonóhálós halászhajó fényeit.' }],
  },
  {
    id: 'r-feny-nem-kormanyozhato',
    topicId: 'fenyek',
    title: 'Nem kormányozható hajó fényei',
    correctSummary: 'A nem kormányozható hajó két vörös fényt visel függőlegesen egymás felett.',
    explanations: {
      rovid: 'Két vörös fény egymás felett = nem kormányozható hajó.',
      kozepes:
        'A nem kormányozható hajó éjjel függőleges vonalban két vörös fényt visel; nappal két fekete gömböt. Ha a vízhez viszonyítva halad, oldalfényeket és farfényt is mutat.',
      reszletes:
        'A „nem kormányozható" azt jelenti, hogy a hajó valamilyen rendkívüli körülmény miatt nem tud a kitérési szabályok szerint manőverezni. Jelzése: két vörös körfény egymás felett (nappal két fekete gömb). Az ilyen hajónak nagy elsőbbsége van a kitérési sorrendben – neki mindenki más köteles kitérni.',
    },
    typicalErrors: [{ id: 'e-nemkorm-felre', label: 'Nem ismerted fel a két vörös fényt nem kormányozható hajóként.' }],
  },
  {
    id: 'r-feny-manoverkorlatolt',
    topicId: 'fenyek',
    title: 'Manőverképességében korlátozott hajó fényei',
    correctSummary: 'Vörös-fehér-vörös fény függőlegesen = manőverképességében korlátozott hajó.',
    explanations: {
      rovid: 'Vörös-fehér-vörös (fentről lefelé) fény = manőverben korlátozott hajó.',
      kozepes:
        'A manőverképességében korlátozott hajó éjjel függőleges vonalban vörös-fehér-vörös fényeket visel; nappal gömb-rombusz-gömb jelzést. Munkavégzés (pl. kábelfektetés, kotrás) miatt korlátozott.',
      reszletes:
        'Ezt a hajót a jellege (pl. víz alatti munka, kábel/csővezeték fektetés) akadályozza a szabad manőverezésben. Jelzése a jellegzetes vörös-fehér-vörös függőleges fénysor (nappal gömb-rombusz-gömb). Kotrás/víz alatti munka esetén az akadály oldalán két vörös, a szabad, elhaladható oldalon két zöld fényt is mutat – arra az oldalra kell kitérni, ahol a zöld van.',
    },
    typicalErrors: [{ id: 'e-mankorl-felre', label: 'Nem ismerted fel a vörös-fehér-vörös jelzést.' }],
  },
  {
    id: 'r-feny-merules-korlatolt',
    topicId: 'fenyek',
    title: 'Merülése miatt korlátozott hajó fényei',
    correctSummary: 'Három vörös fény függőlegesen egymás felett = merülése miatt korlátozott hajó.',
    explanations: {
      rovid: 'Három vörös fény egymás felett = merülése (mélymerülése) miatt korlátozott hajó.',
      kozepes:
        'A merülése miatt manőverképességében korlátozott hajó éjjel függőleges vonalban három vörös fényt visel; nappal egy fekete hengert. A nagy merülés miatt nem tud kitérni a sekélyből.',
      reszletes:
        'A nagy merülésű (mélyen járó) hajó a víz mélysége miatt nem tud szabadon manőverezni vagy kitérni, mert kevés a víz alatta. Jelzése három vörös körfény egymás felett (nappal fekete henger). Az ilyen hajónak elsőbbséget kell adni, mert gyakorlatilag a hajóút közepéhez van kötve.',
    },
    typicalErrors: [{ id: 'e-merules-felre', label: 'Nem ismerted fel a három vörös fényt merülés miatt korlátozott hajóként.' }],
  },
  {
    id: 'r-feny-aknaszedo',
    topicId: 'fenyek',
    title: 'Aknaszedő hajó fényei',
    correctSummary: 'Három zöld körfény háromszögben = aknaszedő hajó (kerüld nagy távolságban).',
    explanations: {
      rovid: 'Három zöld körfény háromszögben = aknaszedő.',
      kozepes:
        'Az aknaszedő hajó a géphajóra előírt fényeken kívül három zöld fényű, háromszög alakban elrendezett körbevilágító lámpát visel (nappal hasonlóan elhelyezett három fekete gömböt).',
      reszletes:
        'Az aknaszedő veszélyes tevékenységet végez, a közelében aknaveszély lehet. A három zöld körfény (háromszögben) jelzi. Ilyen hajót nagy távolságban kell kikerülni, és tilos a közelébe, illetve mögé hajózni, ahol az aknamentesítő eszközök vannak.',
    },
    typicalErrors: [{ id: 'e-aknaszedo-felre', label: 'Nem ismerted fel a három zöld fényt aknaszedőként.' }],
  },
  {
    id: 'r-feny-revkalauz',
    topicId: 'fenyek',
    title: 'Révkalauz hajó fényei',
    correctSummary: 'Felül fehér, alul vörös körfény = révkalauz (pilóta) hajó.',
    explanations: {
      rovid: 'Felül fehér, alul vörös körfény = révkalauz hajó.',
      kozepes:
        'A révkalauz (pilóta) hajó a géphajóra előírt lámpákon kívül függőleges vonalban felül fehér, alul vörös körbevilágító fényt visel. Nappal a H (Hotel) lobogót viseli.',
      reszletes:
        'A révkalauz szolgálatot teljesítő hajó jelzése a „fehér felül – vörös alul" körfény (a halászhajó fordítottja!), nappal a H betűjelzésű lobogó. Ez tájékoztat arról, hogy a hajó pilótaszolgálatot lát el a kikötő közelében; ennek megfelelően kell számítani a mozgására.',
    },
    typicalErrors: [{ id: 'e-revkalauz-felre', label: 'Összekeverted a révkalauzt (fehér-vörös) a halászhajóval.' }],
  },
  {
    id: 'r-feny-veszelyes-aru-2',
    topicId: 'fenyek',
    title: 'Egészségre ártalmas árut szállító hajó (két kék fény)',
    correctSummary: 'Két kék fény egymás felett = egészségre ártalmas árut szállít (tarts távolságot).',
    explanations: {
      rovid: 'Két kék fény egymás felett = egészségre ártalmas rakomány.',
      kozepes:
        'Az egészségre ártalmas árut szállító hajó éjjel két kék fényt visel egymás felett (kb. 1 m távolságra), nappal két, csúcsával lefelé fordított kék kúpot. Minden oldalról látható.',
      reszletes:
        'A kék fények száma a veszély fokát jelzi: két kék fény egészségre ártalmas, három kék fény robbanásveszélyes árut jelez. Az ilyen hajó közelében fokozott óvatosság, nagyobb követési távolság és a nyílt láng/dohányzás kerülése szükséges. A helyes döntés a biztonságos távolságtartás.',
    },
    typicalErrors: [{ id: 'e-2kek-felre', label: 'Nem ismerted fel a két kék fényt veszélyes áru jelzéseként.' }],
  },
]

// ---------------------------------------------------------------------------
// JELZÉSEK / TÁBLÁK — parti és vízi jelek (5 osztály, laterális, kardinális)
// ---------------------------------------------------------------------------
const jelzesekRules: Rule[] = [
  {
    id: 'r-jel-tilto-motoros',
    topicId: 'jelzesek',
    title: 'Tiltó tábla: hajózás tilos géphajóknak',
    correctSummary: 'Piros keretes, áthúzott hajócsavar tábla: hajtómotoros hajóknak tilos a hajózás.',
    explanations: {
      rovid: 'Áthúzott hajócsavar = géphajóknak tilos itt hajózni.',
      kozepes: 'A tiltó jelzések közé tartozik: piros keretben áthúzott hajócsavar → a hajtómotoros (géphajó) közlekedés tilos az adott szakaszon.',
      reszletes: 'A táblák tiltó osztálya piros kerettel jelöli a tilalmakat. Az áthúzott hajócsavar azt jelenti, hogy motoros hajtású hajók nem közlekedhetnek ott (pl. védett övezet, strand). A helyes döntés: nem behajózni motorral; ha kell, más útvonalat választani.',
    },
    typicalErrors: [{ id: 'e-jel-motoros', label: 'Motorral behajóztál a géphajóknak tiltott szakaszra.' }],
  },
  {
    id: 'r-jel-tilto-vizisi',
    topicId: 'jelzesek',
    title: 'Tiltó tábla: vízisízni tilos',
    correctSummary: 'Áthúzott vízisíző alak: az adott területen tilos vízisízni.',
    explanations: {
      rovid: 'Áthúzott vízisíző = tilos a vízisí.',
      kozepes: 'Piros keretben áthúzott vízisíző → az adott vízterületen tilos a vízisízés (és jellemzően a nagy sebességű vontatás).',
      reszletes: 'A vízisí veszélyes a fürdőzőkre és más hajókra, ezért bizonyos szakaszokon tábla tiltja. Az áthúzott vízisíző alak jelzi. A helyes döntés a tilalom betartása; a vízisízés csak az arra kijelölt, engedélyezett helyeken végezhető.',
    },
    typicalErrors: [{ id: 'e-jel-vizisi', label: 'Vízisíztél a tiltott szakaszon.' }],
  },
  {
    id: 'r-jel-tilto-elozes',
    topicId: 'jelzesek',
    title: 'Tiltó tábla: előzni tilos',
    correctSummary: 'A megfelelő tiltó tábla jelzi, hogy az adott szakaszon tilos mindenfajta előzés.',
    explanations: {
      rovid: 'Előzés tilos tábla = tartsd a sorodat, ne előzz.',
      kozepes: 'A tiltó jelzés jelzi, hogy az adott (jellemzően szűk vagy veszélyes) szakaszon tilos az előzés. Ilyenkor a hajók egymás mögött, biztonságos távolsággal haladnak.',
      reszletes: 'Szűk hajóútban, kanyarban vagy zsilip előtt az előzés balesetveszélyes, ezért tábla tiltja. A helyes döntés: nem előzni, tartani a követési távolságot, és megvárni a tilalom végét jelző szakaszt.',
    },
    typicalErrors: [{ id: 'e-jel-elozes', label: 'Előztél a tiltott szakaszon.' }],
  },
  {
    id: 'r-jel-tilto-hullam',
    topicId: 'jelzesek',
    title: 'Tiltó tábla: hullámkeltés tilos',
    correctSummary: 'Hullámkeltés tilos jelzésnél lassítani kell, hogy ne kelts káros hullámot.',
    explanations: {
      rovid: 'Hullámkeltés tilos = lassíts, ne kelts hullámot.',
      kozepes: 'A hullámkeltés tilalma azt jelenti, hogy olyan lassan kell haladni, hogy a hajó ne keltsen káros hullámot (pl. kikötők, kikötött hajók, partszakaszok védelmében).',
      reszletes: 'A nagy hullám károsíthatja a kikötött hajókat, a partot és veszélyes a fürdőzőkre. A tábla helyén a sebességet annyira kell csökkenteni, hogy a hajó szinte ne keltsen hullámot (siklás helyett úszóhelyzet). A helyes döntés a jelentős lassítás.',
    },
    typicalErrors: [{ id: 'e-jel-hullam', label: 'Nem lassítottál, káros hullámot keltettél.' }],
  },
  {
    id: 'r-jel-korlat-magassag',
    topicId: 'jelzesek',
    title: 'Korlátozott szabad magasság',
    correctSummary: 'Piros keretes, felfelé mutató háromszög + szám: a szabad magasság korlátozott (méterben).',
    explanations: {
      rovid: 'Felfelé mutató háromszög + szám = korlátozott szabad magasság.',
      kozepes: 'A korlátozó (C) jelzések egyike: piros keret, felfelé mutató fekete háromszög és szám (pl. 7,50) → a víz feletti szabad magasság korlátozott (pl. híd alatt).',
      reszletes: 'A korlátozott szabad magasság táblát jellemzően híd vagy vezeték előtt látni: a szám a víz feletti átjárható magasságot adja méterben. Ha a hajó (árboc, felépítmény) magasabb, nem szabad áthaladni. A lefelé mutató háromszög ezzel szemben a vízmélységet korlátozza – a kettőt nem szabad összekeverni.',
    },
    typicalErrors: [{ id: 'e-jel-magassag', label: 'Összekeverted a szabad magasságot a vízmélységgel.' }],
  },
  {
    id: 'r-jel-ajanlott-atjaro',
    topicId: 'jelzesek',
    title: 'Ajánló jelzés: ajánlott átjáró',
    correctSummary: 'Sárga rombusz az ajánlott átjárót jelzi (mindkét vagy csak a megadott irányban).',
    explanations: {
      rovid: 'Sárga rombusz = ajánlott átjáró.',
      kozepes: 'Az ajánló (D) jelzések a biztonságos, ajánlott útvonalat mutatják: sárga rombusz az ajánlott átjáró. Bizonyos elrendezés csak a megadott irányban engedélyezi az áthaladást (ellentétes irányban tilos).',
      reszletes: 'Az ajánló jelzések nem tiltanak, hanem a biztonságos áthaladást segítik. A sárga rombusz az ajánlott átjárót jelzi; ha az elrendezés egyirányú, akkor csak a megadott irányban szabad áthaladni. Ezeket követve elkerülöd a sekélyeket és akadályokat.',
    },
    typicalErrors: [{ id: 'e-jel-ajanlott', label: 'Nem az ajánlott (jelzett) átjárón haladtál át.' }],
  },
  {
    id: 'r-jel-kardinalis',
    topicId: 'jelzesek',
    title: 'Kardinális jelek',
    correctSummary: 'A kardinális jel (északi/keleti/déli/nyugati) megmutatja, melyik oldalán biztonságos elhaladni egy veszély mellett.',
    explanations: {
      rovid: 'Kardinális jel = a veszélyt a jel égtája felőli oldalon kell kikerülni.',
      kozepes: 'A kardinális jelek egy veszély (pl. zátony) körül jelzik a biztonságos vizet: az északi jel mellett északról, a keleti mellett keletről stb. kell elhaladni. A tetőjel két fekete kúp iránya és a fény ritmusa különbözteti meg őket.',
      reszletes: 'A kardinális rendszer a veszély égtáj szerinti oldalát jelöli. Az északi jel azt mondja: a biztonságos víz a jeltől északra van; a déli jel: délre; és így tovább. A jeleket a fekete-sárga színsorrend, a két fekete kúp (tetőjel) állása és a fehér villanófény ritmusa alapján azonosítjuk. A helyes döntés a veszélyt a jel égtája felőli oldalon kerülni.',
    },
    typicalErrors: [{ id: 'e-jel-kardinalis', label: 'Rossz oldalon kerülted meg a veszélyt a kardinális jelhez képest.' }],
  },
  {
    id: 'r-jel-elszigetelt',
    topicId: 'jelzesek',
    title: 'Elszigetelt veszélyt jelző bója',
    correctSummary: 'Két fekete gömb tetőjel, Fl(2) fehér fény: kis kiterjedésű elszigetelt veszély (minden oldalról elkerülhető).',
    explanations: {
      rovid: 'Két fekete gömb egymás felett = elszigetelt veszély, kerüld ki.',
      kozepes: 'Az elszigetelt veszélyt jelző bóját kis kiterjedésű, víz alatti akadályoknál (zátony, hajóroncs) alkalmazzák. Tetőjele két fekete gömb egymás felett, fénye két csoportosan felvillanó fehér fény (Fl(2)). Minden oldalról elkerülhető.',
      reszletes: 'Ez a bója közvetlenül egy elszigetelt, kis kiterjedésű veszély fölött vagy mellett áll (pl. hajóroncs, zátonycsúcs). A két fekete gömb tetőjel és a fehér Fl(2) fény azonosítja. Mivel minden oldalról elkerülhető, a helyes döntés biztonságos távolságban megkerülni – nem áthajózni fölötte.',
    },
    typicalErrors: [{ id: 'e-jel-elszigetelt', label: 'Nem kerülted ki az elszigetelt veszélyt jelző bóját.' }],
  },
  {
    id: 'r-jel-buvar',
    topicId: 'jelzesek',
    title: 'Búvárjelzés (narancssárga bója)',
    correctSummary: 'Narancssárga bója búvárokat jelez: lassíts és tarts nagy távolságot.',
    explanations: {
      rovid: 'Narancssárga bója = búvárok a vízben, lassíts és kerüld ki.',
      kozepes: 'A búvárokat narancssárga bójával jelölik. A közelében lassítani kell és nagy távolságot tartani, mert a búvárok a felszín alatt bárhol lehetnek.',
      reszletes: 'A horgonyokat és halászhajókat nappal sárga, a búvárokat narancssárga bójával jelölik. Búvárbója közelében a hajócsavar életveszélyes a felmerülő búvárra, ezért erősen csökkenteni kell a sebességet, és a bójától nagy távolságban, óvatosan kell elhaladni.',
    },
    typicalErrors: [{ id: 'e-jel-buvar', label: 'Nem lassítottál/kerülted ki a búvárbóját.' }],
  },
]

// ---------------------------------------------------------------------------
// NAVIGÁCIÓ — kitérés (COLREG), térkép/irány, világítótorony, hangjelzés
// ---------------------------------------------------------------------------
const navigacioRules: Rule[] = [
  {
    id: 'r-nav-kiteresi-sorrend',
    topicId: 'navigacio',
    title: 'Kitérési sorrend',
    correctSummary: 'A sorrendben előbb álló tér ki: motorcsónak → motoros hajó → vitorlás → halászhajó → manőverkorlátolt → nem kormányozható.',
    explanations: {
      rovid: 'A „mozgékonyabb" tér ki a „kevésbé mozgékony" elől (motorcsónak tér ki mindenkinek).',
      kozepes: 'A kitérési sorrend: motorcsónak, motoros hajó, vitorlás, halászhajó, manőverképességében korlátozott, nem kormányozható. A felsorolásban előbb szereplő köteles kitérni a később szereplő elől.',
      reszletes: 'A szabály azon alapul, hogy melyik jármű tud könnyebben manőverezni. A motorcsónak a legmozgékonyabb, ezért mindenki elől kitér; a nem kormányozható hajó a legkevésbé mozgékony, neki mindenki más kitér. Így egy vitorlás kitér a halászhajó, a manőverkorlátolt és a nem kormányozható hajó elől, de a motoros hajó kitér a vitorlás elől.',
    },
    typicalErrors: [{ id: 'e-nav-sorrend', label: 'Nem a kitérési sorrend szerint adtál elsőbbséget.' }],
  },
  {
    id: 'r-nav-keresztezes',
    topicId: 'navigacio',
    title: 'Keresztezés (jobbról érkező)',
    correctSummary: 'Keresztezéskor a jobbról érkezőt elengeded: csökkentesz és jobbra térsz ki.',
    explanations: {
      rovid: 'Jobbról jövőnek elsőbbség – lassíts és térj ki jobbra.',
      kozepes: 'Keresztező irányoknál a jobb oldalról érkező hajónak van elsőbbsége. Az ütközés elkerülése: csökkentsd a sebességet és térj ki jobbra, a másik hajó fara mögött haladva el.',
      reszletes: 'Ha egy hajó a jobb oldalad felől keresztezi az utadat, neked kell kitérned. A helyes manőver: időben csökkenteni a sebességet és jobbra kitérni, hogy a jobbról jövő hajó fara mögött haladj el. A balra fordulás vagy az irány tartása veszélyes és szabálytalan.',
    },
    typicalErrors: [{ id: 'e-nav-keresztezes', label: 'Nem engedted el a jobbról érkező hajót.' }],
  },
  {
    id: 'r-nav-vitorlas-elony',
    topicId: 'navigacio',
    title: 'Géphajó elsőbbsége vitorlásnak',
    correctSummary: 'A hajtómotoros csónak (kishajó) minden esetben előnyt ad a vitorlásnak és kitér.',
    explanations: {
      rovid: 'Motoros csónak mindig kitér a vitorlás elől.',
      kozepes: 'A hajtómotorral rendelkező csónakok minden esetben előnyt adnak a vitorlával közlekedő hajóknak, és kitérnek a hajók útvonalából.',
      reszletes: 'Mivel a vitorlás a széltől függ és kevésbé szabadon manőverezik, a hajtómotoros csónak köteles kitérni előle. Ez alól kivétel, ha a vitorlás előz egy másik hajót, vagy ha a másik jármű a sorrendben még kevésbé mozgékony (pl. halászhajó, nem kormányozható) – de alapesetben a motoros ad elsőbbséget a vitorlásnak.',
    },
    typicalErrors: [{ id: 'e-nav-vitorlas', label: 'Motorral nem adtál elsőbbséget a vitorlásnak.' }],
  },
  {
    id: 'r-nav-folyasirany',
    topicId: 'navigacio',
    title: 'Folyásirány szerinti elsőbbség',
    correctSummary: 'A folyásiránnyal szemben (fölfelé) haladó elsőbbséget ad a folyásirányban (lefelé) haladónak.',
    explanations: {
      rovid: 'Fölfelé (ár ellen) haladó elenged, mert jobban tud manőverezni.',
      kozepes: 'Folyón a folyásiránnyal szemben haladó hajók kötelesek elsőbbséget adni a folyásirányban haladóknak, mert az ár ellen haladó jobban tud lassítani és manőverezni.',
      reszletes: 'A lefelé (árral) haladó hajót a sodrás viszi, nehezebben áll meg és manőverezik. Ezért a fölfelé (ár ellen) haladó – aki a sodrás miatt könnyebben lassít – köteles elsőbbséget adni és kitérni. Ez a folyami forgalom alapszabálya a találkozásoknál.',
    },
    typicalErrors: [{ id: 'e-nav-folyas', label: 'Ár ellen haladva nem adtál elsőbbséget a lefelé jövőnek.' }],
  },
  {
    id: 'r-nav-tavolsagok',
    topicId: 'navigacio',
    title: 'Parttól tartandó távolságok',
    correctSummary: 'Glisszer/jetski csak a parttól 300 m-nél távolabb; a motort a parttól 50 m-re szabad indítani.',
    explanations: {
      rovid: 'Jetski/glisszer: parttól 300 m; motorindítás: parttól 50 m.',
      kozepes: 'A glisszerek és jetskik csak a parttól 300 m-nél nagyobb távolságra hajózhatnak teljes gázzal; a hajó motorját a parttól 50 m-re lehet elindítani (kijelölt helyek és nem evezős hajók kivételével).',
      reszletes: 'A part menti sáv a fürdőzők és a lassú forgalom miatt védett. Ezért a nagy sebességű glisszer/jetski csak 300 m-en túl közlekedhet teljes gázzal, a motort pedig legalább 50 m-re a parttól szabad beindítani. A rendezett strand kerítésétől 50 m, a természetes strand partjától 150 m távolságot kell tartani.',
    },
    typicalErrors: [{ id: 'e-nav-tavolsag', label: 'Nem tartottad a parttól előírt távolságot (jetski/motorindítás).' }],
  },
  {
    id: 'r-nav-orrszog',
    topicId: 'navigacio',
    title: 'Relatív iránylat (orrszög)',
    correctSummary: 'Az orrszög az orrvonaltól mért irány: jobbra zöld (0–180°), balra vörös; a pozíciós lámpák színe szerint.',
    explanations: {
      rovid: 'Orrszög: jobbra zöld, balra vörös (0–180°), az orrvonaltól mérve.',
      kozepes: 'A relatív iránylat (orrszög) egy céltárgy iránya a hajó orrvonalához képest. Jobbra (zöld) és balra (vörös) 0-tól 180 fokig mérjük, a pozíciós lámpák színe szerint különböztetve meg az oldalt.',
      reszletes: 'Az orrszög (relatív iránylat) azt adja meg, hogy egy tárgy hány fokra van a hajó orrvonalától jobbra vagy balra. A jobb oldal zöld (0–180°), a bal oldal vörös (0–180°), a hajó oldalfényeinek színéhez igazodva. Ez segít a kitérési döntésekben és az iránymérésben; az azimut ezzel szemben a meridiánhoz (északhoz) viszonyított szög.',
    },
    typicalErrors: [{ id: 'e-nav-orrszog', label: 'Rosszul értelmezted az orrszöget (oldal/szín).' }],
  },
  {
    id: 'r-nav-helymeghatarozas',
    topicId: 'navigacio',
    title: 'Helymeghatározás irányméréssel',
    correctSummary: 'Két vagy több céltárgy iránylatának térképre vitele; a helyzetvonalak metszéspontja adja a hajó helyét.',
    explanations: {
      rovid: 'Két céltárgy iránylatának metszéspontja = a hajó helye.',
      kozepes: 'Helymeghatározást irányméréssel úgy végzünk, hogy két vagy több céltárgy irányszögét felvisszük a térképre; a helyzetvonalak metszéspontja adja a hajó helyét.',
      reszletes: 'Ismert parti pontok (pl. világítótorony, torony) iránylatát megmérjük, és a térképen berajzoljuk a hozzájuk tartozó helyzetvonalakat. Két vonal metszéspontja adja a pozíciót; három vonalnál a kis háromszög súlypontja a legvalószínűbb hely. Minél nagyobb szögben metszik egymást a vonalak, annál pontosabb a fix.',
    },
    typicalErrors: [{ id: 'e-nav-fix', label: 'Rosszul határoztad meg a pozíciót az iránymérésből.' }],
  },
  {
    id: 'r-nav-vilagitotorony',
    topicId: 'navigacio',
    title: 'Világítótorony karakterisztika',
    correctSummary: 'A fény jellegét jelölés írja le: pl. Fl(2) 10s 13m 5M = csoportosan (2) villanó, 10 mp periódus, 13 m magas, 5 tengeri mérföldről látható.',
    explanations: {
      rovid: 'Fl = villanó, Oc = elsötétedő, Iso = izofázisú; a szám a felvillanások, majd periódus/magasság/távolság.',
      kozepes: 'A karakterisztika alapján egy fényjelzés megkülönböztethető a másiktól. Jelölés pl. „W Fl(2) 10s 13m 5M": fehér, csoportosan két felvillanás, 10 mp periódus, 13 m magasság, 5 tengeri mérföld látótávolság.',
      reszletes: 'A fény jellege szerint: állandó (F/S), villanó (Fl), csoportosan villanó (Fl(x)), elsötétedő (Oc), izofázisú (Iso – világos és sötét ideje azonos), szektorfény (irányonként más szín). A jelölésben az első csoport a jelleg és szín, a zárójelben a felvillanások száma, majd a periódusidő, a fény tengerszint feletti magassága és végül a látótávolság szerepel. Ez alapján a térképről egyértelműen azonosítható a torony.',
    },
    typicalErrors: [{ id: 'e-nav-vt', label: 'Rosszul olvastad le a világítótorony karakterisztikáját.' }],
  },
  {
    id: 'r-nav-hangjelzes',
    topicId: 'navigacio',
    title: 'Hangjelzések időtartama',
    correctSummary: 'A hosszú hangjelzés 4–5 mp, a rövid 1–2 mp, a jelzések közti szünet 1 mp.',
    explanations: {
      rovid: 'Hosszú = 4–5 mp, rövid = 1–2 mp, szünet = 1 mp.',
      kozepes: 'A hangjelzéseknél a hosszú hang 4–5 másodpercig, a rövid 1–2 másodpercig tart, a jelzések közötti szünet 1 másodperc. Ezekből épülnek fel a manőver- és figyelmeztető jelzések.',
      reszletes: 'A hangjelzések a látás korlátozottsága esetén (köd) és manővereknél fontosak. A hosszú hang 4–5 mp, a rövid 1–2 mp, a köztük lévő szünet 1 mp. A különböző kombinációk jelentése szabályozott (pl. figyelmeztetés, irányváltás), ezért az időtartamok ismerete a helyes jelzésadás alapja.',
    },
    typicalErrors: [{ id: 'e-nav-hang', label: 'Rosszul adtad meg a hangjelzés időtartamát.' }],
  },
]

export const extraRules: Rule[] = [...fenyekRules, ...jelzesekRules, ...navigacioRules]
