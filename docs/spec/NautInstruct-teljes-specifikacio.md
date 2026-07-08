# NautInstruct — Teljes termékspecifikáció (végső változat)

> **Cél:** ez a dokumentum a NautInstruct **végső** (nem MVP) állapotának teljes követelmény- és
> tartalmi specifikációja. Tartalmazza a termékvíziót, a gyakorlattípusokat, a **teljes tartalmi
> leltárt** a forrás-tananyagból, az AI-debrief működését, az adatmodellt, a pontozást, az
> architektúrát és az elfogadási kritériumokat.
>
> **Forrás:** `docs/spec/hajoszimulator-funkciospecifikacio.pdf`, `docs/forras-tananyag/Hajozasi-Alapismeretek-ICC-SidroNautika.pdf`, `docs/forras-tananyag/Kiegeszito-tananyag-ICC.pdf`.
> **Kapcsolódó:** a fejlesztés menete és a lépések a `context.md`-ben.

---

## 1. Termékvízió és cél

Adaptív, AI által facilitált **hajóskapitány vizsgaszimulátor** (ICC nemzetközi belvízi és tengeri
hajóvezetői vizsga). A tanuló **nem leckéket olvas**, hanem **hajózási helyzeteket old meg**: vezet,
értelmez, dönt, hibázik. Hiba esetén a rendszer megáll, **előbb rákérdez** a hibára, majd a válasz
minőségéhez igazított magyarázatot ad, és addig variálja a helyzeteket, amíg a vizsgatudás
**helyzetfelismerési rutinná** válik.

- **Elsődleges cél:** gyorsabb, játékosabb, mélyebb vizsgafelkészülés.
- **Másodlagos cél:** helyzetfelismerési rutin jelzések, fények, rádiózás, horgonyzás, kitérés és
  térképhasználat területén.
- **Termékpozíció:** nem klasszikus oktatóanyag, nem nyílt világú hajós játék, hanem
  **vizsgaszituáció-szimulátor AI oktatóval**.

## 2. Célfelhasználók

- ICC / belvízi / tengeri hajóvezetői vizsgára készülők.
- Akik nehezen tanulnak jegyzetből, de jól reagálnak játékos, vizuális, döntésalapú helyzetekre.
- Oktatók / hajósiskolák kiegészítő gyakorlóeszközként.
- Újrakezdők, akik szituációkban frissítenék a tudásukat.

## 3. Központi tanulási ciklus (kötelező minden gyakorlattípusra)

1. A játékos kap egy konkrét helyzetet (küldetés vagy kérdés).
2. Cselekszik: vezet / dönt / választ.
3. A rendszer ellenőrzi, hogy a döntés megfelel-e a szabálynak.
4. **Hiba esetén megáll**, megnevezi a helyzetet, de a hibát nem fedi fel azonnal (HD-01).
5. Az AI megkérdezi: **„Szerinted mit rontottál el?"** (HD-02) — opciós vagy szabad szöveges válasz.
6. Az AI a választ **pontos / részben pontos / téves** kategóriába sorolja (HD-03).
7. A magyarázat mélysége a kategóriához igazodik:
   - **pontos → rövid megerősítés** (HD-04),
   - **részben → célzott pontosítás + példa** (HD-05),
   - **téves → lépésről lépésre újratanítás** (HD-06).
8. **Újrapróbálás** ugyanarra vagy hasonló helyzetre.

## 4. Játékmódok

| ID | Mód | Leírás |
|----|-----|--------|
| JM-01 | **Küldetés** | Egymásra épülő, 3–8 perces pályák; minden pálya egy vagy több vizsgatémát gyakoroltat. |
| JM-02 | **Vizsgaszimuláció** | Kevert, előre nem jelzett helyzetek; a végén összesített értékelés. |
| JM-03 | **Hibavadász** | A rendszer direkt problémás helyzeteket generál; a játékosnak döntés előtt meg kell neveznie a kockázatot. |
| JM-04 | **Szabad gyakorlás** | A játékos témakört választ, és abban kap ismétlődő, variált helyzeteket. |

## 5. Gyakorlattípusok (interakciós formák)

A teljes tananyag lefedéséhez **több gyakorlattípus** kell, mert nem minden tétel „hajókormányzás".

| Típus | Mit gyakoroltat | Interakció |
|-------|-----------------|-----------|
| **T1 Navigációs küldetés** | Hajóút-tartás, laterális/kardinális jelek, kitérés (COLREG), köd, horgonyzás/kikötés | Irányítható hajó (kormány + sebesség), valós idejű szabálydetektálás |
| **T2 Fényfelismerés** | Éjszakai hajófények → hajótípus/állapot azonosítása + helyes reakció | Vizuális jelenet + döntés (opció/rövid manőver) |
| **T3 Táblafelismerés** | Parti/vízi táblák 5 osztálya, laterális/kardinális/különleges jelek | Kép + jelentés/reakció választás |
| **T4 Térképnavigáció** | Irány (cours), azimut, iránylat, orrszög, helymeghatározás, világítótorony-karakterisztika | Interaktív térkép: irány/távolság mérés, pozíciófix |
| **T5 Csomók** | A leggyakoribb csomók felismerése és helyes használata | Kép→név / helyzet→csomó párosítás |
| **T6 Rádió és vészjelzés** | Mayday/Pan-pan/Sécurité, hívásfelépítés, DSC, 15 vészjelzés | Döntés + (opcionálisan) strukturált üzenet-összeállítás |
| **T7 Tudáskvíz** | Tűzosztályok, szelek, apály-dagály, hajótípusok/anyagok, felszerelés, legénység, fkm, hangjelzések | Kérdés–felelet (opció/szabad szöveg) |

Minden típus a **közös AI-debrief hurokba** fut (3. fejezet), és a **közös tartalommodellt** (10.
fejezet) használja.

---

## 6. TELJES TARTALMI LELTÁR (a végső változat kötelező lefedése)

> Ez a szakasz a „minden szükséges elem" listája. A végső változatban **minden alábbi tételhez**
> tartozzon legalább egy gyakorlat (a jelzett típus szerint), lehetőleg több, variált példány.

### 6.1 Fények — éjszakai jelzések (T1/T2)
- Csónak < 7 m: körkörös **fehér** fény (vagy elemlámpa).
- Menetben lévő **géphajó**: fehér árbócfény (225°), **piros** bal oldalfény (112,5°), **zöld** jobb (112,5°), fehér farfény (135°).
- **> 50 m** géphajó: **két** árbócfény (a második legalább 9 m-rel, 3 m-rel magasabban).
- **Vitorlás** menetben: oldalfények + farfény (nincs árbóc-menetfény).
- **Vontató(k):** két fehér árbócfény egymás felett elöl, **sárga** farfény; > 200 m vonta esetén **három** árbócfény.
- **Tolóhajó** (uszályt tol): elöl **három** fehér fény háromszögben, farában **három** vízszintes fehér.
- **Munkálatokat végző** hajó: szabad oldal felől fehér, lezárt oldal felől **fehér + piros**.
- **Légpárnás** hajó: az előírt fényeken felül **körbevilágító villanó sárga**.
- **Aknaszedő:** **három zöld** körfény háromszögben (nappal három fekete gömb).
- **Halászhajó vonóhálóval:** felül **zöld**, alul **fehér** körfény (nappal csúcsával összefordított fekete kettős kúp).
- **Halászhajó nem vonóhálós:** felül **vörös**, alul **fehér**.
- **Merülése miatt korlátozott** manőverű: **három vörös** függőlegesen (nappal fekete henger).
- **Manőverképességében korlátozott:** **vörös-fehér-vörös** (nappal gömb-rombusz-gömb).
- **Nem kormányozható:** **két vörös** (nappal két fekete gömb).
- **Megfeneklett:** horgonyfény + **két vörös** körfény (nappal három fekete gömb).
- **Horgonyon álló:** egy körkörös **fehér** (nagy hajó orr+far; nappal fekete gömb).
- **Révkalauz:** felül **fehér**, alul **vörös** (nappal H lobogó).
- **Kotrás / víz alatti munka:** vörös-fehér-vörös + akadály oldal **két vörös**, szabad oldal **két zöld**.
- **Veszélyes áru:** **két kék** = egészségre ártalmas; **három kék** = robbanásveszélyes (nappal kék kúp(ok)).

### 6.2 Táblák és vízi jelek (T3)
- **Tiltó jelzések:** áthaladási tilalom (két piros egymás felett), horgonyzás tilos, hullámkeltés tilos, tilos a hajózás (hajtómotoros / vitorlás / sportdeszka), tilos vízisízni, tilos az előzés, tilos vízre tétel/kiemelés, gyorshajózási zóna vége, hajózási tilalom motor/vitorla nélkülieknek.
- **Korlátozó (C) jelzések:** korlátozott vízmélység (▽ + szám), korlátozott szabad magasság (△ + szám), korlátozott átjáró-/hajóútszélesség.
- **Ajánló (D) jelzések:** ajánlott átjáró (sárga rombusz), csak megadott irányban (ellentétes irányban tilos).
- **Utasító és tájékoztató** osztály (az öt osztály teljessége).
- **Belvízi bóják:** hajóút **jobb oldala piros**, **bal oldala zöld** bójával (a folyásirány az irányadó); horgony/halászhajó nappal **sárga** bója; **búvár narancssárga** bója.
- **Kardinális jelek:** északi / keleti / déli / nyugati.
- **Elszigetelt veszélyt jelző** bója: két fekete gömb, fénye Fl(2).
- **Különleges jelzés:** sárga kereszt tetőjel, bármilyen ritmusú sárga fény.

### 6.3 Kitérés és forgalmi szabályok — COLREG (T1)
- **Kitérési sorrend:** motorcsónak → motoros hajó → vitorlás → halászhajó → manőverképességében korlátolt → nem kormányozható.
- **Szemből (fejtől):** mindkét géphajó **jobbra** tér ki (port-to-port).
- **Keresztezés:** a **jobbról** érkezőt elengedni, sebességet csökkenteni, **jobbra** kitérni.
- Hajtómotoros csónak **minden esetben** előnyt ad a vitorlásnak és kitér.
- **Folyásiránnyal szemben** haladó **elsőbbséget ad** a folyásirányban haladónak.
- Evezős csónakkal csak a **part mentén** (ha nincs másképp szabályozva).
- Glisszer / **jetski**: parttól **300 m**-nél távolabb.
- Motor indítása a parttól **50 m**-re.

### 6.4 Navigáció, térkép, világítótornyok (T4)
- **Irány (cours):** a meridián és a hajó hossztengelye közti szög.
- **Azimut:** a meridián és a hajó–fixpont egyenese közti szög.
- **Iránylat (bearing):** felszíni pont északhoz mért iránya a hajóhelyről.
- **Relatív iránylat (orrszög):** orrvonaltól jobbra **zöld** 0–180°, balra **vörös**.
- **Helymeghatározás:** iránymérés metszéssel (két/több céltárgy iránya).
- **Mágnesességtan:** deklináció / deviáció alapfogalmak.
- **Világítótorony-karakterisztika:** fény jellege — állandó (F/S), villanó (Fl), csoportosan villanó (Fl(x)), elsötétedő (Oc), izofázisú (Iso), szektorfény —, **szín**, **magasság**, **távolság**; jelölés pl. `W Fl(2) 10s 13m 5M`.
- **Tengerfelszín / hullámzás** kódok (0–9: sima … dühöngő) és hullámmagasság.

### 6.5 Vészjelzések (T6) — a 15 jelzés
Ágyúlövés percenként; folyamatos kódjelző; vörös csillagszóró rakéták; SOS morze; „Mayday" rádión;
GMDSS/VHF automatikus segélykérés; „NC" nemzetközi kódjelzés; négyszögletű lobogó + alatta/fölötte
gömb; lángjelek a hajón; vörös fáklya/röppentyű; narancssárga füstjel; karok lassú fel-le mozgatása;
rádió-távíró (12-es vonássorozat/perc); rádiótelefon (220/1300 Hz váltakozó); EPIRB.

### 6.6 VHF rádiózás (T6)
- **Mayday** (közvetlen életveszély): 16-os csatorna, 3×; felépítés: jel, hajó neve, pozíció, veszély jellege, kért segítség, „Over"; csak a parancsnok engedélyezi.
- **Pan-pan** (sürgősség, életveszély nélkül).
- **Sécurité** (navigációs / meteorológiai figyelmeztetés).
- **DSC szelektív hívás** (digitális automatikus segélyhívás).

### 6.7 Horgonyzás és kikötés (T1/T7)
- **Lánchossz:** folyón a vízmélység **3–5-szöröse**, tengeren **4–6-szorosa**.
- **Kikötés árral szemben** (folyón mindig folyásiránnyal szemben).
- **Horgonyzási tilalom** (áthúzott horgony tábla).
- **Kikötési kötelek** ne keresztezzék egymást.
- **Apály-dagály:** ~12 óránként váltakozik; a Hold helyzetétől/vonzásától függ.
- Kikötési óvintézkedések, római számok a folyami kikötőkben (hány hajó köthet ki), folyamkilométer (fkm).

### 6.8 Csomók (T5)
Takácscsomó, Palstek, Egyszerű szárcsomó, Dupla gyorscsomó, Szorító nyolcas, Szimpla gyorscsomó,
Félcsomó, Dupla szárcsomó — felismerés és tipikus felhasználás.

### 6.9 Szelek (T7)
Bura, Yugo (Sirokkó), Maestral (Misztrál), Nevere, Garbin (Lebicada) — irány, jellemzők, légnyomás,
hatások (a tananyagban szereplő összes szél).

### 6.10 Tűzvédelem (T7)
Tűz keletkezésének feltételei (éghető anyag, oxigén, hőmérséklet/szikra). **Tűzosztályok:**
A (szilárd), B (folyékony), C (gáz), D (fém), E (elektromos), F (konyhai/étolaj) és a megfelelő oltás.

### 6.11 Hajóismeret és üzemeltetés (T7)
- **Hajópapírok:** forgalmi (hajózási) engedély, vezetői engedély, nyilvántartás; csónak/lebegő test fogalma; regisztrációs szabályok.
- **Hajótípusok:** vitorlás, katamarán, trimarán, motoros jacht, motorcsónak, halászhajó, teherszállító, utasszállító, parasailing, banánhajó.
- **Hajók anyagai:** üvegszálas műanyag, fa, alumínium, acél, ötvözetek, kompozit, gumi.
- **Legénység létszáma:** rekreációs 1 fő, közcélú 2 fő, gazdasági 1 fő.
- **Hajó felszerelése:** evező, 5 db kötél, 2 db horgony, csáklya, javítófelszerelés, szerszámok, hajófenék-pumpa, merőedény, bika.
- **Manőverek**, **ember a vízben (MOB)** eljárás.
- **Hangjelzések:** hosszú 4–5 s, rövid 1–2 s, szünet 1 s.

## 7. AI oktatói karakter és magyarázati stílusok

Az AI szerepeket vált a helyzet, a hiba súlya és a tudásszint szerint:
- **Vizsgabiztos:** rövid, pontos, számonkérő.
- **Kapitánymentor:** nyugodt, gyakorlati, helyzetből magyarázó.
- **Játékos memória:** képszerű hasonlatok, egyszerű nyelv.
- **Hibavadász:** provokatív kérdések, becsapós helyzetek.
- **Vizsganyelv:** a magyarázat végén rövid, vizsgán is használható megfogalmazás.

## 8. Felhasználói élmény követelményei

- A játékos mindig értse a helyzetet: folyó/tenger, nappal/éjszaka, látás, forgalmi helyzet.
- A döntési helyzetek rövidek, élesek, tanulságosak; ne vesszen el hosszú, üres hajózásban.
- A hiba **kapitányi debriefnek** érződjön, ne büntetésnek.
- Azonnali visszajelzés, de ne legyen túl sok pop-up, amikor jól teljesít.
- Gyors újrapróbálás (a reflexszerű felismerés ismétléssel épül).
- Reszponzív: asztali (billentyűzet) és mobil (érintőgombok) vezérlés.

## 9. Pontozás, visszajelzés, adaptivitás

- **Témaköri százalék** (V-01): külön a jelzések, fények, rádiózás, horgonyzás, navigáció, csomók, egyéb szerint.
- **Hibakártyák** (V-02): minden fontos hiba után rövid kártya — mi történt, miért rossz, mi a helyes szabály; visszanézhető.
- **Vizsgakészségi státusz** (V-03): kezdő / gyakorló / stabil / vizsgakész témakörönként.
- **Kapitányi rangok** (V-04): matróz → segédkapitány → folyami kapitány → tengeri kapitány → vizsgakész kapitány (a tényleges teljesítményből).
- **Adaptivitás** (F-09/F-10): gyakoribbá válnak a gyenge területek helyzetei; tudásprofil témakör szinten.

## 10. Tartalommodell

A tananyag **nem lineáris lecke**, hanem hálózat (spec 9. pont):

- **Témakör (Topic):** nagyobb egység (jelzések, fények, rádiózás, horgonyzás, navigáció, csomók, egyéb).
- **Szabály (Rule):** egy konkrét vizsgatétel; tartozik hozzá **helyes döntés**, **tipikus hibák**, és **rövid/közepes/részletes** magyarázat.
- **Szituáció / Küldetés (Situation / Mission):** a szabály gyakorlati megjelenése egy gyakorlatban (T1–T7 típus szerint).
- **Hibatípus (ErrorType):** tipikus félreértés / rossz döntés.
- **Magyarázati sablon (ExplanationTemplate):** három mélység ugyanahhoz a szabályhoz.
- **Öndiagnózis-opciók:** helyzetenként pontos/részben/téves minőséggel.

Minden gyakorlattípus ugyanezt a modellt használja, és a **közös DebriefEngine**-be fut.

## 11. Architektúra és tech stack

- **Nyelv/build:** TypeScript + Vite. **UI:** React 19. **2.5D:** Three.js + react-three-fiber + drei.
- **Állapot:** Zustand. **Stílus:** Tailwind CSS. **Teszt:** Vitest + Testing Library. **Minőség:** oxlint + `tsc`.
- **Modulok:**
  - `content/` — típusok + a 6. fejezet szerinti teljes tartalom (témák, szabályok, szituációk).
  - `nav/` — navigációs motor (kinematika, geometriai szabálydetektálás), küldetések, jelenet.
  - `engine/` — RuleEvaluator, DebriefEngine (Scripted + Llm), ProgressTracker.
  - `llm/` — OpenAI-kompatibilis kliens; a kulcs futásidőben, a Beállításokban, `localStorage`-ban.
  - `chart/` — (T4) interaktív térkép modul (irány/távolság mérés, pozíciófix).
  - `state/` — Zustand store. `ui/` — képernyők, HUD, debrief modal.

## 12. LLM-integráció

- **OpenAI-kompatibilis** `chat/completions`, JSON-válaszra kényszerítve.
- Az **API-kulcsot a felhasználó adja meg** a Beállításokban (kizárólag `localStorage`, sehova máshova nem kerül, csak az LLM-hívásba).
- **Kulcs nélkül** a rendszer a **sablonos (ScriptedDebrief)** magyarázatra esik vissza, így offline is működik és demózható.
- Az LLM feladata: a szabad szöveges öndiagnózis **besorolása** (pontos/részben/téves) és a stílushoz igazított magyarázat.

## 13. Közzététel (deploy)

- **Elsődleges:** **GitHub Pages** — a build a `gh-pages` ágra publikál (a beépített `GITHUB_TOKEN`-nel), nem kell szerver/SSH/secret. Egyszeri teendő: Settings → Pages → Deploy from a branch → `gh-pages`. Élő URL: `https://<user>.github.io/NautInstruct/`.
- **Opcionális:** Docker + nginx konténer saját szerveren (izolált port), a meglévő szolgáltatások érintése nélkül.
- A `base` útvonal build-időben állítható (`BASE_PATH`), az SPA-hoz 404→index fallback.

## 14. Elfogadási kritériumok (végső változat)

- A felhasználó **5 percen belül** megérti, hogyan indítson és teljesítsen egy gyakorlatot.
- **Minden témakörben több, variált gyakorlat** van (nem egyetlen példány), és a 6. fejezet **összes tétele** lefedett legalább egy gyakorlattal.
- Mind a **hét gyakorlattípus** (T1–T7) működik és a közös debrief-hurokba fut.
- Hiba esetén a rendszer mindig **megáll, kérdez, majd magyaráz**; a magyarázat a **konkrét helyzethez** kötött.
- A játékos legalább **témakör szinten** látja erős/gyenge pontjait; a kritikus hibák újrapróbáltathatók.
- A vizuális elemek egyértelműek; a szimuláció valós (irányítható hajó), nem puszta illusztráció.
- Zöld: `typecheck`, `lint`, `unit tesztek`, `build`; élő, elérhető közzététel.

## 15. Nem cél / későbbi bővítés

- Fotorealisztikus grafika vagy teljes hidrodinamikai szimuláció (nem cél).
- Későbbi: hangvezérelt rádiózás (valódi Mayday bemondás), oktatói adminfelület a tanulói
  előrehaladás követésére, saját tananyag feltöltése, többnyelvű vizsgamód (magyar/angol/horvát),
  kooperatív kapitány–matróz mód, valódi térképszelvények integrálása.
