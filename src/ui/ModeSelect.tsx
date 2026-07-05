import { levels } from '../content/levels'
import { topicById } from '../content/topics'
import { useStore } from '../state/store'

export function ModeSelect() {
  const startLevel = useStore((s) => s.startLevel)
  const startFreePractice = useStore((s) => s.startFreePractice)

  return (
    <div className="mx-auto h-full max-w-4xl overflow-y-auto px-6 py-8">
      <h2 className="text-2xl font-bold">Válassz pályát</h2>
      <p className="mt-1 text-foam/70">
        Küldetés módban egy témakör szituációit gyakorlod végig. A „Szabad gyakorlás" ugyanazon téma
        helyzeteit ismétli.
      </p>

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
                  className="rounded-lg bg-sea-500 px-4 py-2 text-sm font-semibold transition hover:bg-sea-500/90"
                >
                  Küldetés indítása
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
