# AI hajóskapitány vizsgaszimulátor — Tervdokumentum (MVP)

**Dátum:** 2026-07-04
**Verzió:** 1.0 (MVP terv)
**Forrás:** `docs/spec/hajoszimulator-funkciospecifikacio.pdf`, `docs/forras-tananyag/*`

## 1. Áttekintés

Adaptív, AI által facilitált **hajóskapitány vizsgaszimulátor** webalkalmazás. A tanuló nem
leckéket olvas, hanem **hajózási szituációkat old meg**: dönt, hibázik, majd az AI előbb
rákérdez („Szerinted mit rontottál el?"), és a válasz minőségéhez igazított magyarázatot ad.
A cél nem fotorealizmus, hanem **egyértelmű, vizsgaszerű döntési helyzetek** gyakorlása.

## 2. Tech stack

| Réteg | Választás |
|------|-----------|
| Nyelv / build | TypeScript, Vite |
| UI | React 18 |
| 2.5D jelenet | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Állapot | Zustand |
| Stílus | Tailwind CSS |
| LLM | OpenAI-kompatibilis REST (`fetch`), kulcs a felhasználótól (localStorage) |
| Teszt | Vitest + Testing Library |
| Minőség | ESLint + `tsc --noEmit` |

## 3. Architektúra és modulok

```
src/
  content/     # Tartalommodell (T-01..T-05) + MVP seed adat a PDF-ekből
  engine/      # RuleEvaluator, DebriefEngine (Scripted + Llm), ProgressTracker
  llm/         # OpenAI-kompatibilis kliens; kulcs localStorage-ból
  scene/       # react-three-fiber 2.5D jelenet + hajó
  state/       # Zustand store (session, game, settings)
  ui/          # Képernyők és komponensek
```

### 3.1 Tartalommodell (`content/`)

A spec 9. pontja alapján a tananyag **nem lineáris lecke**, hanem hálózat:

- **Topic** (T-01): témakör (`jelzesek`, `fenyek`, `radiozas`, `horgonyzas`).
- **Rule** (T-02): egy konkrét szabály; tartozik hozzá `correctDecision`, `typicalErrors`, `explanations`.
- **Situation** (T-03): a szabály gyakorlati megjelenése egy pályán; tartalmazza a jelenet
  leírását (folyó/tenger, nappal/éjjel, látás), a döntési opciókat és a helyes választ.
- **ErrorType** (T-04): tipikus félreértés/rossz döntés.
- **ExplanationTemplate** (T-05): `rovid` / `kozepes` / `reszletes` magyarázat ugyanahhoz a szabályhoz.

Az adat tisztán TypeScript objektumként, típusdefiníciókkal (`content/types.ts`), MVP-részhalmazzal
(`content/seed/*`).

### 3.2 Engine (`engine/`)

- **`RuleEvaluator`**: `(situation, decisionId) => EvaluationResult` — helyes / szabálysértő /
  veszélyes; visszaadja a megsértett `Rule`-t és a valószínű `ErrorType`-ot.
- **`DebriefEngine`** interfész:
  ```ts
  interface DebriefEngine {
    classify(input: SelfDiagnosisInput): Promise<DebriefResult>; // pontos|reszben|teves + magyarázat
  }
  ```
  - **`ScriptedDebrief`**: opciós öndiagnózisból determinisztikusan sorol be és a
    megfelelő mélységű sablon-magyarázatot adja. **Nem igényel kulcsot** → offline fut.
  - **`LlmDebrief`**: szabad szöveges öndiagnózist is értékel; a `Rule`/`Situation`/`ErrorType`
    kontextusból promptot épít, a modelltől strukturált JSON-t kér (kategória + magyarázat a
    választott oktatói stílusban). Hiba/hiányzó kulcs esetén `ScriptedDebrief`-re esik vissza.
- **`ProgressTracker`**: témaköri százalék (V-01), hibakártyák (V-02), vizsgakészségi státusz
  (V-03), kapitányi rang (V-04). `localStorage`-ban.

### 3.3 LLM (`llm/`)

- OpenAI-kompatibilis `POST /v1/chat/completions`, JSON válasz kényszerítve.
- Konfigurálható `apiKey`, `model` (alap: `gpt-4o-mini`), `baseUrl`.
- A kulcsot a felhasználó a **Beállítások** képernyőn adja meg; kizárólag `localStorage`-ban tárolt,
  soha nem kerül a repóba, csak az LLM-hívás megy vele.

### 3.4 Scene (`scene/`)

- `@react-three/fiber` vászon: animált vízfelület, low-poly motoros kishajó, bóják/táblák/fények
  mint tiszta, felismerhető 3D objektumok, rézsútos (2.5D) követő kamera.
- Folyami pályán egyszerű kormányzás (bal/jobb) a helyes oldal megválasztásához; a többi pályán
  a jelenet a szituációt mutatja, a döntés a HUD-on opciókból történik.

### 3.5 UI (`ui/`)

Képernyők: **Főmenü → Módválasztó (JM-01/JM-04) → Pálya (jelenet + HUD + döntés) →
Debrief modal (öndiagnózis → értékelés → magyarázat → újrapróbálás) → Tudásprofil**, továbbá
**Beállítások (API-kulcs)**.

## 4. Központi tanulási ciklus (spec 3. pont)

1. Szituáció betöltése → jelenet + kontextus (folyó/tenger, nappal/éjjel, látás).
2. A játékos dönt (kormányoz / opciót választ).
3. `RuleEvaluator` ellenőrzi a szabályt.
4. Hiba: a játék **megáll**, megnevezi a helyzetet, de nem fedi fel a hibát (HD-01).
5. AI kérdez: „Szerinted mit rontottál el?" (HD-02) — opciós vagy szabad szöveges válasz.
6. `DebriefEngine` besorol (HD-03): **pontos → rövid** (HD-04) / **részben → célzott** (HD-05) /
   **téves → lépésről lépésre újratanítás** (HD-06).
7. **Újrapróbálás** ugyanarra/hasonló helyzetre (F-08).

## 5. MVP terjedelem (spec 12. pont)

- Egy irányítható motoros kishajó, 2.5D vízi pálya.
- **Pályatípusok:** P-01 folyami jelzések, P-03 éjszakai fények, P-05 rádiós vészhelyzet,
  P-06 horgonyzás/kikötés.
- **≥ 10 tipikus szabályszegés** hibadetektálása a fenti témákban.
- Játékmódok: **JM-01 Küldetés** + **JM-04 Szabad gyakorlás** (JM-02 vizsgaszimuláció opcionális).
- AI-debrief öndiagnózissal + háromszintű magyarázattal (LLM, opciós **és** szabad szöveges — F-12).
- Témaköri teljesítményprofil + hibakártyák + kapitányi rang (V-01…V-04).

## 6. Elfogadási kritériumok (spec 14. pont)

- A felhasználó 5 percen belül megérti, hogyan indítson és teljesítsen egy pályát.
- Legalább 10 vizsgaszituáció egyértelmű bemutatása.
- Hiba esetén a játék mindig megáll, kérdez, majd magyaráz — a magyarázat a konkrét helyzethez kötött.
- A játékos legalább témakör szinten látja erős/gyenge pontjait.
- A kritikus hibák újrapróbáltathatók.

## 7. Tesztelési terv

- **Unit (Vitest):** `RuleEvaluator` (helyes/hibás döntések), `ScriptedDebrief` besorolás és
  magyarázat-mélység, `LlmDebrief` prompt-építés és JSON-parse (mockolt `fetch`), `ProgressTracker`
  (százalék, rang számítás).
- **Statikus:** `tsc --noEmit`, ESLint.
- **Build:** `vite build`.
- **Manuális (demó):** dev szerver + böngésző: pálya végigjátszása, hiba kiváltása, teljes
  debrief-ciklus, tudásprofil, API-kulcs beállító képernyő. Videó + képek.

## 8. Későbbi bővítés (spec 13. pont)

Valódi térképszelvények, hangvezérelt rádiózás, mobil gyorsgyakorló, oktatói adminfelület,
saját tananyag feltöltése, többnyelvűség, kooperatív mód.
