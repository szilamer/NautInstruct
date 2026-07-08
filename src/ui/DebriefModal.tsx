import { useState } from 'react'
import type { DiagnosisOption, DiagnosisQuality, Rule } from '../content/types'
import type { DebriefResult } from '../engine/debrief'

const qualityStyle: Record<DiagnosisQuality, { label: string; cls: string }> = {
  pontos: { label: 'Pontos diagnózis', cls: 'bg-buoy-green/20 text-buoy-green border-buoy-green/40' },
  reszben: { label: 'Részben pontos', cls: 'bg-amber/20 text-amber border-amber/40' },
  teves: { label: 'Téves diagnózis', cls: 'bg-buoy-red/20 text-buoy-red border-buoy-red/40' },
}

export function DebriefModal({
  title,
  rule,
  diagnosisOptions,
  useLlm,
  debrief,
  loading,
  onSubmit,
  onRetry,
  onSkip,
}: {
  title: string
  rule: Rule
  diagnosisOptions: DiagnosisOption[]
  useLlm: boolean
  debrief?: DebriefResult
  loading: boolean
  onSubmit: (args: { diagnosisOptionId?: string; freeText?: string }) => void
  onRetry: () => void
  onSkip: () => void
}) {
  const [freeText, setFreeText] = useState('')
  const [selected, setSelected] = useState<string | undefined>()

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-full w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-sea-900 p-6 shadow-2xl">
        <div className="flex items-center gap-2 text-buoy-red">
          <span className="text-xl">⚠️</span>
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-foam/70">
          Szabály: <b>{rule.title}</b>. Mielőtt elárulnám a megoldást: mit gondolsz, mit rontottál el?
        </p>

        {!debrief && (
          <div className="mt-4">
            <div className="space-y-2">
              {diagnosisOptions.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelected(o.id)}
                  className={`block w-full rounded-lg border px-4 py-2 text-left text-sm transition ${
                    selected === o.id ? 'border-sea-500 bg-sea-500/20' : 'border-white/15 hover:bg-white/5'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {useLlm && (
              <div className="mt-4">
                <label className="text-xs text-foam/60">Vagy fogalmazd meg saját szavaiddal (AI értékeli):</label>
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-sea-800 px-3 py-2 text-sm outline-none focus:border-sea-500"
                />
              </div>
            )}
            <button
              disabled={loading || (!selected && !freeText.trim())}
              onClick={() => onSubmit({ diagnosisOptionId: selected, freeText: freeText.trim() || undefined })}
              className="mt-4 w-full rounded-lg bg-sea-500 px-4 py-2 font-semibold transition enabled:hover:bg-sea-500/90 disabled:opacity-40"
            >
              {loading ? 'Értékelés…' : 'Diagnózis elküldése'}
            </button>
          </div>
        )}

        {debrief && (
          <div className="mt-4">
            <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${qualityStyle[debrief.quality].cls}`}>
              {qualityStyle[debrief.quality].label}
              <span className="ml-2 opacity-60">{debrief.source === 'llm' ? 'AI-magyarázat' : 'sablon'}</span>
            </span>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foam/90">{debrief.explanation}</p>
            <div className="mt-3 rounded-lg bg-sea-800/70 p-3 text-xs text-foam/70">
              Vizsganyelven: <b>{rule.correctSummary}</b>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={onRetry}
                className="flex-1 rounded-lg bg-sea-500 px-4 py-2 font-semibold transition hover:bg-sea-500/90"
              >
                🔁 Újra
              </button>
              <button onClick={onSkip} className="rounded-lg border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10">
                Kihagyom
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
