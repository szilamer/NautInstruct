# NautInstruct – Deploy (Hetzner VPS)

A NautInstruct egy statikus frontend (Vite build), amit egy nginx konténer szolgál ki.
A szerveren **külön projektként** fut (`/root/nautinstruct`, konténer: `nautinstruct`,
port: **8090**), így nem ütközik a meglévő szolgáltatásokkal (MissionControll: 3000/5433/8080).

## A) Automatikus deploy — GitHub Actions (ajánlott)

A `.github/workflows/deploy.yml` a `main`-re push-oláskor lefuttatja a build-et, majd
rsync-eli a forrást a VPS-re és ott `docker compose up -d --build`-del elindítja.

Egyszeri teendő: a **GitHub repo** (`szilamer/NautInstruct`) beállításaiban add hozzá a
secreteket (Settings → Secrets and variables → Actions):

| Secret | Érték |
|--------|-------|
| `VPS_HOST` | `23.88.58.202` |
| `VPS_SSH_KEY` | a root SSH **privát kulcs** (ugyanaz, amit a MissionControll deploy használ) |

Ezután minden `main` push automatikusan telepít. Kézi indítás: Actions → *NautInstruct CI/CD* → *Run workflow*.

## B) Kézi deploy a saját gépedről

Előfeltétel: működő `ssh root@23.88.58.202` és Docker a szerveren.

```bash
./deploy/deploy-to-vps.sh
```

## Elérés

- Közvetlenül: `http://23.88.58.202:8090/`
- (Opcionális) HTTPS aldomain, pl. `naut.logframe.cc`: a hoston futó reverse proxyba
  (Caddy/nginx, ami az `sp.logframe.cc`-t is kiszolgálja) fel kell venni egy bejegyzést a
  `127.0.0.1:8090` upstreamhez, és DNS rekordot kell létrehozni. Ez a szerver reverse proxy
  konfigját igényli (nem része ennek a repónak).

## Megjegyzés

Az alkalmazás tisztán kliensoldali: az LLM API-kulcsot a felhasználó a böngészőben (Beállítások)
adja meg, ezért a szerveren **nincs szükség** környezeti változóra vagy titokra a futtatáshoz.
