import { topics } from '../content/topics'
import {
  captainRank,
  rankLabel,
  statusLabel,
  topicPercent,
  topicStatus,
} from '../engine/progress'
import { useStore } from '../state/store'

export function Progress() {
  const progress = useStore((s) => s.progress)
  const resetProgress = useStore((s) => s.resetProgress)
  const navigate = useStore((s) => s.navigate)
  const rank = captainRank(progress)

  return (
    <div className="mx-auto h-full max-w-3xl overflow-y-auto px-6 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tudásprofil</h2>
        <span className="rounded-full bg-sea-500 px-4 py-1.5 text-sm font-semibold">
          🎖️ {rankLabel(rank)}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {topics.map((t) => {
          const stat = progress.topics[t.id]
          const pct = topicPercent(stat)
          const status = topicStatus(stat)
          return (
            <div key={t.id} className="rounded-xl border border-white/10 bg-sea-800/60 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-foam/70">
                  {statusLabel(status)} · {stat.correct}/{stat.attempts}
                </div>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-sea-900">
                <div
                  className="h-full rounded-full bg-sea-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <h3 className="mt-8 text-lg font-bold">Hibakártyák</h3>
      {progress.errorCards.length === 0 ? (
        <p className="mt-2 text-sm text-foam/60">
          Még nincs hibakártyád. Ahogy gyakorolsz, itt visszanézheted a korábbi hibáidat.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {progress.errorCards.map((c) => (
            <div key={c.id} className="rounded-lg border border-buoy-red/30 bg-buoy-red/10 p-3 text-sm">
              <div className="font-semibold">{c.ruleTitle}</div>
              <div className="text-foam/70">Mi történt: {c.whatHappened}</div>
              <div className="text-foam/60">Helyes szabály: {c.correctRule}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => navigate('modes')}
          className="rounded-lg bg-sea-500 px-5 py-2 font-semibold transition hover:bg-sea-500/90"
        >
          Gyakorlás folytatása
        </button>
        <button
          onClick={resetProgress}
          className="rounded-lg border border-white/20 px-5 py-2 text-sm transition hover:bg-white/10"
        >
          Profil visszaállítása
        </button>
      </div>
    </div>
  )
}
