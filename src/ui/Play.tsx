import { useStore } from '../state/store'
import { SituationScene } from '../scene/SituationScene'
import { DebriefPanel } from './DebriefPanel'
import { topicById } from '../content/topics'

export function Play() {
  const session = useStore((s) => s.session)
  const situation = useStore((s) => s.currentSituation())
  const chooseDecision = useStore((s) => s.chooseDecision)
  const next = useStore((s) => s.next)
  const navigate = useStore((s) => s.navigate)

  if (!session) return null

  if (session.phase === 'complete') {
    return <LevelComplete />
  }

  if (!situation) return null
  const topic = topicById.get(situation.topicId)

  return (
    <div className="relative flex h-full flex-col lg:flex-row">
      {/* Jelenet */}
      <div className="relative h-1/2 min-h-[240px] bg-sea-900 lg:h-full lg:flex-1">
        <SituationScene config={situation.scene} />
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2 text-xs">
          <Badge>{situation.scene.environment === 'folyo' ? '🌊 Folyó' : '⚓ Tenger'}</Badge>
          <Badge>{situation.scene.timeOfDay === 'nappal' ? '☀️ Nappal' : '🌙 Éjszaka'}</Badge>
          {situation.scene.visibility === 'kod' && <Badge>🌫️ Köd</Badge>}
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-black/40 px-2 py-1 text-xs text-foam/70">
          ← → nyilakkal kormányozhatod a hajót
        </div>
      </div>

      {/* HUD / döntés */}
      <div className="flex h-1/2 flex-col overflow-y-auto border-t border-white/10 bg-sea-800/60 p-5 lg:h-full lg:w-[420px] lg:border-l lg:border-t-0">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-sea-700 px-3 py-1 text-xs">{topic?.title}</span>
          <span className="text-xs text-foam/60">
            {session.index + 1}/{session.queue.length}
          </span>
        </div>

        <h2 className="mt-4 text-lg font-semibold leading-snug">{situation.prompt}</h2>

        {session.phase === 'deciding' && (
          <div className="mt-5 space-y-3">
            {situation.decisions.map((d) => (
              <button
                key={d.id}
                onClick={() => chooseDecision(d.id)}
                className="block w-full rounded-xl border border-white/15 bg-sea-900/60 px-4 py-3 text-left transition hover:border-sea-500 hover:bg-sea-900"
              >
                {d.label}
              </button>
            ))}
          </div>
        )}

        {session.phase === 'success' && (
          <div className="mt-5 rounded-xl border border-buoy-green/40 bg-buoy-green/10 p-4">
            <div className="flex items-center gap-2 font-bold text-buoy-green">
              <span>✅</span> Helyes döntés!
            </div>
            <p className="mt-2 text-sm text-foam/80">{session.lastEval?.rule.explanations.rovid}</p>
            <button
              onClick={next}
              className="mt-4 w-full rounded-lg bg-sea-500 px-4 py-2 font-semibold transition hover:bg-sea-500/90"
            >
              Tovább →
            </button>
          </div>
        )}

        <div className="mt-auto pt-4">
          <button
            onClick={() => navigate('modes')}
            className="text-xs text-foam/50 underline-offset-2 hover:underline"
          >
            ← Vissza a pályaválasztóhoz
          </button>
        </div>
      </div>

      {session.phase === 'debrief' && <DebriefPanel />}
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-black/40 px-2 py-1 text-foam/80">{children}</span>
}

function LevelComplete() {
  const session = useStore((s) => s.session)
  const navigate = useStore((s) => s.navigate)
  const exitToHome = useStore((s) => s.exitToHome)
  if (!session) return null
  const total = session.queue.length
  const pct = Math.round((session.correctCount / total) * 100)

  return (
    <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-5xl">🎉</div>
      <h2 className="text-2xl font-bold">{session.title} teljesítve</h2>
      <p className="text-foam/70">
        Első próbálkozásra helyes: <b>{session.correctCount}</b> / {total} ({pct}%)
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={() => navigate('progress')}
          className="rounded-lg bg-sea-500 px-5 py-2 font-semibold transition hover:bg-sea-500/90"
        >
          Tudásprofil megtekintése
        </button>
        <button
          onClick={() => navigate('modes')}
          className="rounded-lg border border-white/20 px-5 py-2 transition hover:bg-white/10"
        >
          Másik pálya
        </button>
        <button onClick={exitToHome} className="rounded-lg px-5 py-2 text-foam/60 hover:bg-white/10">
          Főoldal
        </button>
      </div>
    </div>
  )
}
