import { situations } from '../content/situations'
import { topics, topicById } from '../content/topics'
import { missions } from '../nav/missions'
import { useStore } from '../state/store'

export function ModeSelect() {
  const startFreePractice = useStore((s) => s.startFreePractice)
  const startMission = useStore((s) => s.startMission)
  const startChart = useStore((s) => s.startChart)

  // Csak azok a témák jelennek meg kvízként, amelyekhez van szituáció.
  const quizTopics = topics
    .map((t) => ({ topic: t, count: situations.filter((s) => s.topicId === t.id).length }))
    .filter((x) => x.count > 0)

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

      <h2 className="mt-10 text-2xl font-bold">Térképnavigáció</h2>
      <p className="mt-1 text-foam/70">
        Interaktív térkép: iránymérés (bearing), iránytartás a kikötőig és helymeghatározás
        (pozíciófix) a mért iránylatok metszéspontjából.
      </p>
      <div className="mt-6">
        <div className="rounded-2xl border border-sea-500/30 bg-sea-800/60 p-5 sm:max-w-md">
          <div className="text-lg font-bold">Térképnavigációs feladatok</div>
          <div className="mt-1 text-sm text-foam/70">Bearing, course és pozíciófix gyakorlatok.</div>
          <button
            onClick={startChart}
            className="mt-4 rounded-lg bg-sea-500 px-4 py-2 text-sm font-semibold transition hover:bg-sea-500/90"
          >
            🧭 Térkép indítása
          </button>
        </div>
      </div>

      <h2 className="mt-10 text-2xl font-bold">Kvíz gyakorlás témakörönként</h2>
      <p className="mt-1 text-foam/70">
        Döntésalapú gyakorlás: fények, táblák, rádiózás, csomók és további vizsgatételek felismerése.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quizTopics.map(({ topic, count }) => (
          <div key={topic.id} className="rounded-2xl border border-white/10 bg-sea-800/60 p-5">
            <div className="text-lg font-bold">{topicById.get(topic.id)?.title}</div>
            <div className="mt-1 text-xs text-foam/60">{topic.description}</div>
            <div className="mt-2 text-xs text-foam/50">{count} gyakorlat</div>
            <button
              onClick={() => startFreePractice(topic.id)}
              className="mt-4 rounded-lg bg-sea-700 px-4 py-2 text-sm font-semibold transition hover:bg-sea-700/80"
            >
              Kvíz indítása
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
