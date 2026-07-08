import { useEffect, useRef, useState } from 'react'
import { ruleById } from '../content/rules'
import { topicById } from '../content/topics'
import { createDebriefEngine, type DebriefResult } from '../engine/debrief'
import { hasApiKey } from '../llm/settings'
import { NavScene, type NavRefs } from '../nav/NavScene'
import { anchorScopeSufficient } from '../nav/engine'
import type { BoatInput, BoatState, NavMission, Vessel, Violation } from '../nav/types'
import { useStore } from '../state/store'
import { DebriefModal } from './DebriefModal'

type Phase = 'playing' | 'violation' | 'anchor' | 'complete'

function initBoat(m: NavMission): BoatState {
  return { ...m.start }
}
function initVessels(m: NavMission): Vessel[] {
  return m.vessels.map((v) => ({ ...v }))
}

export function NavPlay({ mission }: { mission: NavMission }) {
  const navigate = useStore((s) => s.navigate)
  const llmSettings = useStore((s) => s.llmSettings)
  const recordNavOutcome = useStore((s) => s.recordNavOutcome)

  const boat = useRef<BoatState>(initBoat(mission))
  const input = useRef<BoatInput>({ turn: 0, throttle: 0 })
  const vessels = useRef<Vessel[]>(initVessels(mission))
  const fogTimer = useRef(0)
  const refs: NavRefs = { boat, input, vessels, fogTimer }

  const [phase, setPhase] = useState<Phase>('playing')
  const [violation, setViolation] = useState<Violation | null>(null)
  const [debrief, setDebrief] = useState<DebriefResult | undefined>()
  const [loading, setLoading] = useState(false)
  const [runKey, setRunKey] = useState(0)
  const [hudSpeed, setHudSpeed] = useState(0)
  const outcomeRecorded = useRef(false)

  const topic = topicById.get(mission.topicId)
  const useLlm = hasApiKey(llmSettings)
  const vinfo = violation ? mission.violations[violation.kind] : undefined
  const rule = vinfo ? ruleById.get(vinfo.ruleId) : undefined

  // Tap-alapú vezérlés: a gáz tartósan beáll (cirkáló sebesség), a kormány koppintásra fordít.
  const nudge = (d: number) => {
    boat.current.heading += d
  }
  const changeThrottle = (d: number) => {
    input.current.throttle = Math.max(0, Math.min(1, input.current.throttle + d))
  }

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') changeThrottle(0.34)
      else if (e.key === 'ArrowDown' || e.key === 's') changeThrottle(-0.34)
      else if (e.key === 'ArrowLeft' || e.key === 'a') nudge(-0.22)
      else if (e.key === 'ArrowRight' || e.key === 'd') nudge(0.22)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', kd)
    return () => window.removeEventListener('keydown', kd)
  }, [])

  // HUD sebesség frissítése.
  useEffect(() => {
    const t = setInterval(() => setHudSpeed(boat.current.speed), 120)
    return () => clearInterval(t)
  }, [])

  const reset = () => {
    boat.current = initBoat(mission)
    vessels.current = initVessels(mission)
    fogTimer.current = 0
    input.current = { turn: 0, throttle: 0 }
    outcomeRecorded.current = false
    setViolation(null)
    setDebrief(undefined)
    setPhase('playing')
    setRunKey((k) => k + 1)
  }

  const handleViolation = (v: Violation) => {
    if (phase !== 'playing') return
    setViolation(v)
    setPhase('violation')
    const info = mission.violations[v.kind]
    const r = info ? ruleById.get(info.ruleId) : undefined
    if (!outcomeRecorded.current && r) {
      outcomeRecorded.current = true
      recordNavOutcome({
        topicId: mission.topicId,
        correct: false,
        card: {
          situationId: mission.id,
          topicId: mission.topicId,
          ruleTitle: r.title,
          whatHappened: r.typicalErrors[0]?.label ?? 'Szabálysértés a küldetés során.',
          correctRule: r.correctSummary,
        },
      })
    }
  }

  const handleGoal = () => {
    if (phase !== 'playing') return
    if (mission.anchoring) {
      setPhase('anchor')
    } else {
      if (!outcomeRecorded.current) {
        outcomeRecorded.current = true
        recordNavOutcome({ topicId: mission.topicId, correct: true })
      }
      setPhase('complete')
    }
  }

  const submitDiagnosis = async (args: { diagnosisOptionId?: string; freeText?: string }) => {
    if (!rule) return
    setLoading(true)
    const engine = createDebriefEngine(llmSettings)
    const result = await engine.classify({
      context: mission.brief,
      diagnosisOptions: vinfo?.diagnosisOptions ?? [],
      rule,
      errorType: rule.typicalErrors[0],
      diagnosisOptionId: args.diagnosisOptionId,
      freeText: args.freeText,
    })
    setDebrief(result)
    setLoading(false)
  }

  const chooseScope = (length: number, factorLabel: string) => {
    if (anchorScopeSufficient(mission, length)) {
      if (!outcomeRecorded.current) {
        outcomeRecorded.current = true
        recordNavOutcome({ topicId: mission.topicId, correct: true })
      }
      setPhase('complete')
    } else {
      handleViolation({ kind: 'anchor-scope', detail: factorLabel })
    }
  }

  return (
    <div className="relative flex h-full flex-col lg:flex-row">
      <div className="relative h-1/2 min-h-[260px] bg-sea-900 lg:h-full lg:flex-1">
        <NavScene key={runKey} mission={mission} refs={refs} running={phase === 'playing'} onViolation={handleViolation} onGoal={handleGoal} />
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2 text-xs">
          <Badge>{mission.environment === 'folyo' ? '🌊 Folyó' : '⚓ Tenger'}</Badge>
          <Badge>{mission.timeOfDay === 'nappal' ? '☀️ Nappal' : '🌙 Éjszaka'}</Badge>
          {mission.visibility === 'kod' && <Badge>🌫️ Köd</Badge>}
          {mission.speedLimit != null && <Badge>Max: {mission.speedLimit.toFixed(1)}</Badge>}
        </div>
        <div className="pointer-events-none absolute right-3 top-3 rounded bg-black/50 px-2 py-1 text-xs">
          Sebesség: {hudSpeed.toFixed(1)}
        </div>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 select-none">
          <Ctrl onClick={() => nudge(-0.22)}>◀ balra</Ctrl>
          <Ctrl onClick={() => changeThrottle(0.34)}>▲ gyorsít</Ctrl>
          <Ctrl onClick={() => changeThrottle(-0.34)}>▼ lassít</Ctrl>
          <Ctrl onClick={() => nudge(0.22)}>jobbra ▶</Ctrl>
        </div>
      </div>

      <div className="flex h-1/2 flex-col overflow-y-auto border-t border-white/10 bg-sea-800/60 p-5 lg:h-full lg:w-[400px] lg:border-l lg:border-t-0">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-sea-700 px-3 py-1 text-xs">{topic?.title}</span>
          <span className="text-xs text-foam/60">Küldetés</span>
        </div>
        <h2 className="mt-3 text-lg font-bold">{mission.title}</h2>
        <p className="mt-2 text-sm text-foam/80">{mission.brief}</p>

        <div className="mt-4 rounded-lg bg-sea-900/60 p-3 text-xs text-foam/70">
          <b>Irányítás:</b> a <b>gyorsít/lassít</b> gombokkal állítod a sebességet (tartósan cirkál), a{' '}
          <b>balra/jobbra</b> gombokkal (vagy a nyilakkal) kormányozol. Cél: a zöld gyűrű.
        </div>

        {phase === 'anchor' && (
          <div className="mt-4 rounded-xl border border-sea-500/40 bg-sea-500/10 p-4">
            <div className="font-semibold">Elérted a horgonyzóhelyet. Mennyi láncot engedsz ki?</div>
            <div className="mt-1 text-xs text-foam/60">Vízmélység: {mission.anchoring?.depth} m</div>
            <div className="mt-3 space-y-2">
              <ScopeButton onClick={() => chooseScope(6, '1,5×')}>6 m (1,5× mélység)</ScopeButton>
              <ScopeButton onClick={() => chooseScope(12, '3×')}>12 m (3× mélység)</ScopeButton>
              <ScopeButton onClick={() => chooseScope(20, '5×')}>20 m (5× mélység)</ScopeButton>
            </div>
          </div>
        )}

        {phase === 'complete' && (
          <div className="mt-4 rounded-xl border border-buoy-green/40 bg-buoy-green/10 p-4">
            <div className="flex items-center gap-2 font-bold text-buoy-green">✅ Küldetés teljesítve!</div>
            <p className="mt-2 text-sm text-foam/80">Szabálysértés nélkül teljesítetted a feladatot.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={reset} className="rounded-lg bg-sea-500 px-4 py-2 text-sm font-semibold hover:bg-sea-500/90">
                Újra
              </button>
              <button onClick={() => navigate('modes')} className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
                Másik küldetés
              </button>
              <button onClick={() => navigate('progress')} className="rounded-lg px-4 py-2 text-sm text-foam/70 hover:bg-white/10">
                Tudásprofil
              </button>
            </div>
          </div>
        )}

        <div className="mt-auto pt-4">
          <button onClick={() => navigate('modes')} className="text-xs text-foam/50 underline-offset-2 hover:underline">
            ← Vissza a választóhoz
          </button>
        </div>
      </div>

      {phase === 'violation' && rule && vinfo && (
        <DebriefModal
          title="Szabálysértés – a szimuláció megállt"
          rule={rule}
          diagnosisOptions={vinfo.diagnosisOptions}
          useLlm={useLlm}
          debrief={debrief}
          loading={loading}
          onSubmit={submitDiagnosis}
          onRetry={reset}
          onSkip={() => navigate('modes')}
        />
      )}
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-black/40 px-2 py-1 text-foam/80">{children}</span>
}

function ScopeButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="block w-full rounded-lg border border-white/15 bg-sea-900/60 px-4 py-2 text-left text-sm transition hover:border-sea-500 hover:bg-sea-900"
    >
      {children}
    </button>
  )
}

function Ctrl({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-black/55 px-4 py-3 text-sm font-bold text-white transition hover:bg-sea-500 active:bg-sea-500"
    >
      {children}
    </button>
  )
}
