# AGENTS.md

## Cursor Cloud specific instructions

### Mi ez a projekt
`NautInstruct` – **AI hajóskapitány vizsgaszimulátor**: magyar nyelvű, böngészőben futó
tanulójáték az ICC hajóvezetői vizsgához. A tanuló hajózási szituációkban dönt; hiba esetén a
játék megáll, öndiagnózist kér, majd (LLM-mel vagy sablonból) magyaráz.

- **Stack:** React 19 + TypeScript + Vite, 2.5D jelenet `three` / `@react-three/fiber` / `@react-three/drei`, állapot `zustand`, stílus Tailwind CSS v4, teszt Vitest.
- **Forrásanyag és terv:** `docs/spec/` (funkcióspecifikáció) és `docs/forras-tananyag/` (Sidro Nautika ICC tananyag). Részletes terv: `docs/superpowers/specs/`.

### Parancsok
A standard scriptek a `package.json`-ban vannak; ne duplikáld őket. Dióhéjban: `npm run dev`
(fejlesztői szerver, Vite, alap port **5173**), `npm run build`, `npm run lint` (oxlint),
`npm run typecheck`, `npm test` (Vitest).

### Nem magától értetődő tudnivalók
- **LLM API-kulcs futásidőben, NEM env-változóból:** a kulcsot a felhasználó a **Beállítások**
  képernyőn adja meg, és csak a böngésző `localStorage`-ában tárolódik (`naut.llm.settings`).
  Ne várj `OPENAI_API_KEY` env-változót.
- **Kulcs nélkül is fut és demózható:** ha nincs kulcs, a `DebriefEngine` a beépített, sablonos
  magyarázatokra esik vissza (`ScriptedDebrief`), az öndiagnózis ilyenkor opciós. Kulccsal a
  szabad szöveges választ is az LLM értékeli (`LlmDebrief`, OpenAI-kompatibilis végpont).
- **WebGL a felhő Chrome-ban működik** – a konzolon csak ártalmatlan three.js deprecation
  figyelmeztetések jelennek meg (PCFSoftShadowMap, ReadPixels), ezek nem hibák.
- **A haladás perzisztens:** témaköri profil és hibakártyák a `localStorage`-ban (`naut.progress`).
  A Tudásprofil oldalon a „Profil visszaállítása" gomb törli.
- **Új vizsgaszituáció hozzáadása** tisztán adatvezérelt: bővítsd a `src/content/` fájlokat
  (`topics`, `rules`, `situations`, `levels`) – kód módosítása nélkül megjelennek a játékban.
- **Az alkalmazás nyelve magyar** (UI és tartalom is).
