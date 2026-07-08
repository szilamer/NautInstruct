# NautInstruct — Fejlesztési kontextus és menetrend (context.md)

> **Mi ez?** A NautInstruct fejlesztésének „operatív kézikönyve": hogyan haladjunk, milyen
> lépésekben, hogyan építsünk be unit teszteket, mikor tekintünk egy lépést késznek. A **mit**
> (a végső termék) a `docs/spec/NautInstruct-teljes-specifikacio.md` írja le; ez a dokumentum a
> **hogyan**.

---

## 1. Jelenlegi állapot (2026-07, snapshot)

**Kész és működő (commitolva, deployolva):**
- Fejlesztői környezet: React 19 + TS + Vite, Tailwind v4, r3f/drei/three, Zustand, Vitest, oxlint.
- Motorok, tesztekkel: `RuleEvaluator`, `DebriefEngine` (Scripted + LLM, mockolt fetch), `ProgressTracker`, `nav/engine` (kinematika + geometriai szabálydetektálás).
- **T1 (navigációs küldetés)** alap: irányítható hajó, valós idejű szabálydetektálás, hiba-debrief, 4 küldetés.
- Kvíz-hurok (Situation → döntés → debrief), 4 téma, 12 szituáció.
- Közzététel: GitHub Pages (`gh-pages` ág, workflow), élő URL.

**Félbehagyott / instabil (NEM commitolt, a munkafa jelenleg NEM fordul):**
- `content/rules.ts` már importálja a `./rulesExtra` modult, ami **még nem létezik** → `tsc` hiba.
- `content/topics.ts`, `content/types.ts`: új témák (`csomok`, `egyeb`) hozzáadva.
- `ui/NavPlay.tsx`: tap-alapú vezérlésre átírva (nem commitolva).

**Első teendő (Fázis 0): stabilizálás** — lásd lentebb.

## 2. Alapelvek (ezek nem alku tárgyai)

1. **Mindig lefordítható fa.** Soha ne kösd be egy még nem létező modult. A sorrend: előbb az új fájl, utána a hivatkozás, aztán commit. Minden lépés után `typecheck` + `lint` + `test` zöld.
2. **Kis, önálló lépések, gyakori commit.** Egy logikai változás = egy commit. Ne halmozódjon több félkész dolog.
3. **A tiszta logikát teszt-vezérelten (TDD).** A motorok és a geometriai/besorolási függvények pure-ok → előbb a teszt, aztán az implementáció.
4. **Adatvezérelt tartalom.** A gyakorlatok adatként (típusos objektumok) élnek. Új gyakorlat = adat hozzáadása, nem új kód. A UI/motor generikus.
5. **Egy gyakorlattípus egyszerre.** Ne keverd a T-típusok (spec 5. fejezet) fejlesztését; egyet vigyél késznek, teszteld, majd a következő.
6. **A tartalom a szűk keresztmetszet, nem a kód.** Ezért a lefedést **leltár + backlog** hajtja (6. fejezet a specben), és **data-integrity tesztek** őrzik.
7. **Ne bővítsd a scope-ot menet közben.** Új igény → előbb a spec/context frissül, utána a kód.

## 3. Architektúra-térkép (felelősségek)

```
src/
  content/     Típusok + TELJES tartalom (témák, szabályok, szituációk). Adatvezérelt.
  nav/         Navigációs motor (kinematika, szabálydetektálás), küldetések, NavScene.
  chart/       (T4) Interaktív térkép modul (irány/távolság, pozíciófix).  [építendő]
  engine/      RuleEvaluator, DebriefEngine (Scripted+Llm), ProgressTracker.  [tesztelt]
  llm/         OpenAI-kompatibilis kliens + beállítások (kulcs localStorage-ban).
  state/       Zustand store (route, session, progress, settings).
  ui/          Képernyők, HUD, DebriefModal, gyakorlattípus-nézetek.
  test/        Teszt setup.
```

**Szabály:** a motorok és a tartalom **nem** függenek a UI-tól; a UI hívja a motorokat. Minden
gyakorlattípus a **közös DebriefEngine**-be fut (ne duplikáld a debrief-logikát).

## 4. Fejlesztési fázisok és lépések

Minden lépésnél add meg: **cél → érintett fájlok → unit/adat tesztek → Definition of Done (DoD)**.

### Fázis 0 — Stabilizálás (kötelező elsőként)
- **Cél:** a munkafa újra forduljon és legyen zöld.
- **Teendő:** vagy (a) létrehozni a `content/rulesExtra.ts`-t (üres/valós `extraRules: Rule[]`-tel) és commitolni, **vagy** (b) visszaállni a legutóbbi működő commitra (`bb3a771`) és onnan tiszta lapról indulni. Az `ui/NavPlay.tsx` tap-vezérlés refaktort külön, önálló commitban rögzíteni.
- **Tesztek:** meglévők futnak; `tsc`+`lint`+`build` zöld.
- **DoD:** `npm run typecheck && npm run lint && npm test && npm run build` mind zöld; nincs félkész, commitolatlan törött állapot.

### Fázis 1 — Tartalmi leltár és adatvezérelt bővítés
- **Cél:** a spec 6. fejezet minden tétele bekerül adatként (szabály + gyakorlat), témánként több, variált példánnyal.
- **Teendő (témánként, külön commitokban):**
  1. `content/rules.ts` (+ moduláris `content/rules/<tema>.ts`): a téma összes szabálya 3 szintű magyarázattal, tipikus hibákkal.
  2. `content/situations/<tema>.ts`: a szabályokhoz szituációk (öndiagnózis-opciókkal).
  3. Aggregátor (`content/index.ts`) frissítése.
- **Tesztek (data-integrity, kötelező):**
  - minden `Situation.ruleId` **létező** szabályra mutat;
  - minden szabályra **legalább egy** szituáció hivatkozik;
  - minden szituációnak **pontosan egy** `pontos` minőségű öndiagnózis-opciója van, és van hibás döntése;
  - **lefedettségi teszt:** a spec 6. fejezet tételeit egy `coverage`-listával összevetve minden tételhez tartozik ≥1 gyakorlat (a lista karbantartott a repóban).
- **DoD:** a téma minden leltár-tétele lefedett; a data-integrity tesztek zöldek.

### Fázis 2 — Gyakorlattípusok kiépítése (T2, T3, T5, T6, T7)
- **Cél:** a nem-navigációs típusok generikus nézetei, mind a közös debriefbe.
- **Teendő:** típusonként egy nézet-komponens (`ui/<Tipus>Play.tsx`), amely a Situation adatból renderel (kép/opciók), és a `DebriefModal`-t használja. A tartalom már Fázis 1-ből adott.
- **Tesztek:** komponens-szintű smoke tesztek (Testing Library): a helyes válasz sikert, a hibás debriefet indít; a debrief besorolás a `DebriefEngine` unit tesztjeivel fedve.
- **DoD:** minden T2/T3/T5/T6/T7 típus végigjátszható, a debrief hurok működik.

### Fázis 3 — T4 Térképnavigáció (interaktív)
- **Cél:** irány/azimut/iránylat/orrszög, távolságmérés, pozíciófix interaktív térképen.
- **Teendő:** `chart/` modul pure geometriával (szög, távolság, metszéspont), `ui/ChartPlay.tsx`.
- **Tesztek (TDD):** a geometriai függvények (bearing, distance, fix-metszés, orrszög szín/oldal) unit tesztekkel; tűréshatárral.
- **DoD:** a T4 feladatok megoldhatók, a mérések helyesek, a hiba-debrief működik.

### Fázis 4 — Módok és adaptivitás
- **Cél:** JM-02 vizsgaszimuláció (kevert), JM-03 hibavadász, F-09/F-10 adaptív feladatválasztás.
- **Teendő:** a store-ban session-logika a kevert/adaptív sorrendhez; végső értékelő képernyő.
- **Tesztek:** a kiválasztó/adaptív logika pure függvényként, unit tesztekkel (súlyozás a gyenge témákra, kevert sorrend determinisztikus seeddel).
- **DoD:** a négy mód működik; az adaptivitás mérhetően a gyenge területeket preferálja.

### Fázis 5 — Csiszolás, teljes lefedés, közzététel
- **Cél:** teljes leltár-lefedés ellenőrzése, UX-polish, élő deploy.
- **Teendő:** lefedettségi teszt zöld a teljes 6. fejezetre; reszponzív ellenőrzés; gh-pages frissítés.
- **DoD:** a spec 14. fejezet minden elfogadási kritériuma teljesül.

## 5. Tartalomírási munkafolyamat (minden gyakorlathoz)

1. **Leltár-tétel kiválasztása** (spec 6. fejezet) — pl. „halászhajó vonóhálóval fényei".
2. **Szabály** megírása: `title`, `correctSummary`, `explanations {rovid, kozepes, reszletes}`, `typicalErrors`.
3. **Gyakorlat** (Situation/Mission) a megfelelő T-típussal: jelenet/kép/opciók, helyes döntés, hibás döntés(ek) hibatípussal.
4. **Öndiagnózis-opciók:** pontosan 1 `pontos`, 1 `reszben`, 1 `teves`.
5. **Data-integrity teszt** automatikusan ellenőrzi a fentieket.
6. **Commit** egy tételről vagy egy témáról (kis lépés).

## 6. Tesztelési stratégia („ahogy ezt kell")

- **Unit (Vitest) — a logika gerince, TDD-vel:**
  - `engine/ruleEvaluator`, `engine/debrief` (Scripted besorolás + mélység; Llm prompt/parse mockolt `fetch`-csel + fallback), `engine/progress` (százalék, státusz, rang), `nav/engine` (kinematika, bójaoldal, zóna, ütközés, cél, lánchossz), `chart/*` (geometria).
- **Adat-integritás tesztek — a tartalom helyessége:**
  - hivatkozási épség (ruleId ↔ rule), lefedettség (rule ↔ szituáció), öndiagnózis-opció minőségek, a spec 6. fejezet lefedettsége egy karbantartott lista ellen.
- **Komponens/smoke (Testing Library):** a gyakorlattípus-nézetek helyes/hibás ága, a debrief modal folyamata. Használj `data-testid`-t a stabil szelektorokhoz.
- **Manuális / böngészős:** a valós szimuláció (T1) és a térkép (T4) kézi ellenőrzése; élő URL smoke.
- **Futtatás:** `npm test` (CI-ben is), `npm run typecheck`, `npm run lint`, `npm run build`.

**Elv:** minden új pure függvényhez teszt **az implementáció előtt**. Minden új tartalmi kötegre
fusson a data-integrity teszt. UI-változásnál legalább egy smoke teszt.

## 7. Definition of Done

**Lépés/PR akkor kész, ha:**
- `typecheck`, `lint`, `unit tesztek`, `build` **mind zöld**;
- az érintett logikára van unit teszt, a tartalomra data-integrity teszt;
- a munkafa **nem tartalmaz** félkész, nem fordítható részt;
- a változás egy **logikai egység**, értelmes commit-üzenettel;
- ha UI-t érint: rövid böngészős ellenőrzés vagy smoke teszt;
- a spec/leltár frissült, ha a scope bővült.

## 8. Verziókövetés és commit-fegyelem

- Kis, atomi commitok; egy logikai változás / commit.
- Soha ne commitolj nem forduló állapotot.
- Feature-ág (`cursor/...`), PR a `main`-be; a `gh-pages` deployt a workflow kezeli.
- Ne amend-elj/force-push-olj megosztott ágon, hacsak nem kifejezett kérés.

## 9. CI és közzététel

- CI: `npm ci && npm run lint && npm run typecheck && npm test && npm run build` minden push/PR-en.
- Deploy: push a feature-ágra/`main`-re → workflow buildel és a `gh-pages` ágra publikál → GitHub Pages.
- Egyszeri: Settings → Pages → Deploy from a branch → `gh-pages` (a repó tulajdonosa kapcsolja be).

## 10. Kockázatok és megjegyzések

- **Tartalom-mennyiség:** a teljes lefedés sok kézi authoring; a leltár + backlog + adagolt commitok tartják kordában. Ne „mindent egyszerre".
- **LLM-kulcs:** futásidőben, `localStorage`-ban; kulcs nélkül sablonos fallback — a fejlesztéshez/demóhoz nem kell kulcs.
- **Deploy-környezet:** a zárt agent-környezetből nincs SSH külső szerverre; a GitHub Pages a környezetfüggetlen, ajánlott út. Saját szerverre csak külön hozzáféréssel, izoláltan.
- **Két rendszer (kvíz + küldetés):** közös adatmodell és közös DebriefEngine — ne duplikálódjon a logika.
- **Bundle méret:** a three.js miatt nagy; szükség esetén kód-darabolás (dynamic import) a T4/3D részekre.
