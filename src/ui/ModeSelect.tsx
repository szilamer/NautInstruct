import { levels } from '../content/levels'
import { topicById } from '../content/topics'
import { missions } from '../nav/missions'
import { useStore } from '../state/store'

export function ModeSelect() {
  const startLevel = useStore((s) => s.startLevel)
  const startFreePractice = useStore((s) => s.startFreePractice)
  const startMission = useStore((s) => s.startMission)

  return (
    <div className="mx-auto h-full max-w-4xl overflow-y-auto px-6 py-8">
      <h2 className="text-2xl font-bold">Küldetések (szimuláció)</h2>
      <p className="mt-1 text-foam/70">
        Irányítsd a hajót, és teljesítsd a feladatot a szabályok betartásával. Ha hibázol, a szimuláció megáll,
        rákérdez a hibára, majd elmagyarázza a szabályt.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {missions.map((m) => {
          const topic = topicById.get(m.topicId)
          return (
            <div key={m.id} className="rounded-2xl border border-sea-500/30 bg-sea-800/60 p-5">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-sea-700 px-2.5 py-0.5 text-xs">{topic?.title}</span>
              </div>
              <div className="mt-2 text-lg font-bold">{m.title}</div>
              <div className="mt-1 text-sm text-foam/70">{m.brief}</div>
              <button
                onClick={() => startMission(m.id)}
                className="mt-4 rounded-lg bg-sea-500 px-4 py-2 text-sm font-semibold transition hover:bg-sea-500/90"
              >
                ▶ Küldetés indítása
              </button>
            </div>
          )
        })}
      </div>

      <h2 className="mt-10 text-2xl font-bold">Kvíz gyakorlás</h2>
      <p className="mt-1 text-foam/70">Gyors, döntésalapú gyakorlás témakörönként (pl. rádiózás).</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {levels.map((level) => {
          const topic = topicById.get(level.topicId)
          return (
            <div key={level.id} className="rounded-2xl border border-white/10 bg-sea-800/60 p-5">
              <div className="text-lg font-bold">{level.title}</div>
              <div className="text-sm text-foam/70">{level.subtitle}</div>
              <div className="mt-2 text-xs text-foam/50">{topic?.description}</div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => startLevel(level.id)}
                  className="rounded-lg bg-sea-700 px-4 py-2 text-sm font-semibold transition hover:bg-sea-700/80"
                >
                  Kvíz indítása
                </button>
                <button
                  onClick={() => startFreePractice(level.topicId)}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10"
                >
                  Szabad gyakorlás
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
