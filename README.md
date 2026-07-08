# NautInstruct

**AI hajóskapitány vizsgaszimulátor** – magyar nyelvű, böngészőben futó tanulójáték az ICC
(nemzetközi belvízi és tengeri) hajóvezetői vizsgához.

A tanuló nem leckéket olvas, hanem hajózási **szituációkat old meg** (jelzések, éjszakai fények,
rádiózás, horgonyzás). Ha hibázik, a szimulátor megáll, előbb rákérdez, mit gondol a hibáról,
majd a válasz minőségéhez igazított magyarázatot ad – opcionálisan valódi LLM-mel.

## Fő funkciók

- 2.5D vízi jelenet (Three.js / react-three-fiber) irányítható hajóval.
- Küldetés és szabad gyakorlás mód témakörönként.
- AI-debrief: öndiagnózis-kérdés → pontos/részben/téves besorolás → háromszintű magyarázat.
- Témaköri tudásprofil, hibakártyák és kapitányi rangok.
- Opcionális LLM (OpenAI-kompatibilis) – az API-kulcsot a felhasználó a Beállításokban adja meg;
  kulcs nélkül beépített, sablonos magyarázatokkal működik.

## Fejlesztés

Előfeltétel: Node.js 22+.

```bash
npm install      # függőségek telepítése
npm run dev      # fejlesztői szerver (Vite), alapból http://localhost:5173
npm run build    # produkciós build
npm run lint     # oxlint
npm run typecheck# TypeScript típusellenőrzés
npm test         # Vitest unit tesztek
```

## Struktúra

```
src/
  content/   Tartalommodell + tananyag (témakörök, szabályok, szituációk, pályák)
  engine/    RuleEvaluator, DebriefEngine (Scripted + LLM), ProgressTracker
  llm/       OpenAI-kompatibilis kliens és beállítások (kulcs a localStorage-ban)
  scene/     2.5D react-three-fiber jelenet
  state/     Zustand store (session, haladás, beállítások)
  ui/        Képernyők és komponensek
docs/        Funkcióspecifikáció, forrás-tananyag és tervdokumentum
```

## Dokumentáció

- Funkcióspecifikáció: `docs/spec/`
- Forrás-tananyag (Sidro Nautika ICC): `docs/forras-tananyag/`
- MVP tervdokumentum: `docs/superpowers/specs/`
