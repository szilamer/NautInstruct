import { useRef, useState } from 'react'
import { ruleById } from '../content/rules'
import { chartTasks } from '../chart/charts'
import { bearing, bearingUnitVector, distance, type Point } from '../chart/geometry'
import type { ChartTask } from '../chart/types'
import { createDebriefEngine, type DebriefResult } from '../engine/debrief'
import { hasApiKey } from '../llm/settings'
import { useStore } from '../state/store'
import { DebriefModal } from './DebriefModal'

type Phase = 'answer' | 'violation' | 'complete'

function trueBearing(task: ChartTask): number {
  if (task.kind === 'bearing') {
    const lm = task.landmarks.find((l) => l.id === task.targetId)!
    return bearing(task.boat!, lm)
  }
  if (task.kind === 'course') return bearing(task.boat!, task.waypoint!)
  return 0
}

function ray(from: Point, deg: number, len: number): Point {
  const v = bearingUnitVector(deg)
  return { x: from.x + v.x * len, y: from.y + v.y * len }
}

export function ChartPlay() {
  const navigate = useStore((s) => s.navigate)
  const llmSettings = useStore((s) => s.llmSettings)
  const recordNavOutcome = useStore((s) => s.recordNavOutcome)
  const svgRef = useRef<SVGSVGElement>(null)

  const [index, setIndex] = useState(0)
  const [dial, setDial] = useState(0)
  const [click, setClick] = useState<Point | null>(null)
  const [phase, setPhase] = useState<Phase>('answer')
  const [debrief, setDebrief] = useState<DebriefResult | undefined>()
  const [loading, setLoading] = useState(false)
  const scored = useRef<Set<string>>(new Set())

  const task = chartTasks[index]
  const rule = ruleById.get(task.ruleId)
  const useLlm = hasApiKey(llmSettings)

  const reset = (i: number) => {
    setIndex(i)
    setDial(0)
    setClick(null)
    setPhase('answer')
    setDebrief(undefined)
  }

  const record = (correct: boolean) => {
    if (scored.current.has(task.id)) return
    scored.current.add(task.id)
    recordNavOutcome({
      topicId: 'navigacio',
      correct,
      card: correct
        ? undefined
        : {
            situationId: task.id,
            topicId: 'navigacio',
            ruleTitle: rule?.title ?? task.title,
            whatHappened: rule?.typicalErrors[0]?.label ?? 'Hibás térképi mérés.',
            correctRule: rule?.correctSummary ?? '',
          },
    })
  }

  const evaluate = () => {
    let ok = false
    if (task.kind === 'fix') {
      ok = !!click && distance(click, task.trueBoat!) <= (task.toleranceDist ?? 8)
    } else {
      const diff = Math.abs(((dial - trueBearing(task) + 540) % 360) - 180)
      ok = diff <= (task.toleranceDeg ?? 6)
    }
    record(ok)
    if (ok) {
      setPhase('complete')
    } else {
      setPhase('violation')
      setDebrief(undefined)
    }
  }

  const submitDiagnosis = async (args: { diagnosisOptionId?: string; freeText?: string }) => {
    if (!rule) return
    setLoading(true)
    const engine = createDebriefEngine(llmSettings)
    const res = await engine.classify({
      context: task.prompt,
      diagnosisOptions: task.diagnosisOptions,
      rule,
      errorType: rule.typicalErrors[0],
      diagnosisOptionId: args.diagnosisOptionId,
      freeText: args.freeText,
    })
    setDebrief(res)
    setLoading(false)
  }

  const next = () => {
    if (index + 1 >= chartTasks.length) {
      setPhase('complete')
      navigate('progress')
    } else {
      reset(index + 1)
    }
  }

  const onSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (task.kind !== 'fix' || phase !== 'answer') return
    const rect = svgRef.current!.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setClick({ x, y })
  }

  return (
    <div className="relative flex h-full flex-col lg:flex-row">
      <div className="relative flex h-1/2 min-h-[280px] items-center justify-center bg-sea-900 p-3 lg:h-full lg:flex-1">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="aspect-square h-full max-h-full w-auto max-w-full rounded-lg bg-[#0e3a5f] shadow-inner"
          onClick={onSvgClick}
          style={{ cursor: task.kind === 'fix' ? 'crosshair' : 'default' }}
        >
          {/* rács */}
          {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((g) => (
            <g key={g} stroke="#ffffff22" strokeWidth={0.3}>
              <line x1={g} y1={0} x2={g} y2={100} />
              <line x1={0} y1={g} x2={100} y2={g} />
            </g>
          ))}
          {/* észak nyíl */}
          <g transform="translate(8,10)">
            <line x1={0} y1={6} x2={0} y2={-4} stroke="#eaf4fb" strokeWidth={0.8} />
            <polygon points="0,-7 -2,-3 2,-3" fill="#eaf4fb" />
            <text x={0} y={12} fill="#eaf4fb" fontSize={4} textAnchor="middle">É</text>
          </g>

          {/* fix: iránylat-egyenesek a landmarkoktól */}
          {task.kind === 'fix' &&
            task.observerBearings?.map((ob) => {
              const lm = task.landmarks.find((l) => l.id === ob.landmarkId)!
              const p = ray(lm, ob.bearing + 180, 140)
              const p2 = ray(lm, ob.bearing, -20)
              return (
                <line key={ob.landmarkId} x1={p2.x} y1={p2.y} x2={p.x} y2={p.y} stroke="#f4a52a" strokeWidth={0.6} strokeDasharray="2 1.5" />
              )
            })}

          {/* landmarkok */}
          {task.landmarks.map((lm) => (
            <g key={lm.id}>
              <circle cx={lm.x} cy={lm.y} r={2} fill="#f4c430" stroke="#7a5b00" strokeWidth={0.4} />
              <text x={lm.x + 3} y={lm.y + 1} fill="#eaf4fb" fontSize={3.4}>{lm.label}</text>
            </g>
          ))}

          {/* waypoint (course) */}
          {task.kind === 'course' && task.waypoint && (
            <g>
              <circle cx={task.waypoint.x} cy={task.waypoint.y} r={2.4} fill="none" stroke="#4ade80" strokeWidth={0.8} />
              <text x={task.waypoint.x + 3} y={task.waypoint.y + 1} fill="#4ade80" fontSize={3.4}>{task.waypointLabel}</text>
            </g>
          )}

          {/* hajó + irány-tű (bearing/course) */}
          {task.boat && (
            <g>
              {(() => {
                const end = ray(task.boat, dial, 30)
                return <line x1={task.boat.x} y1={task.boat.y} x2={end.x} y2={end.y} stroke="#2f80c2" strokeWidth={1} />
              })()}
              <circle cx={task.boat.x} cy={task.boat.y} r={2} fill="#eaf4fb" />
              <text x={task.boat.x + 3} y={task.boat.y + 4} fill="#9ec6e6" fontSize={3.2}>hajó</text>
            </g>
          )}

          {/* fix: kattintott pozíció */}
          {task.kind === 'fix' && click && (
            <g>
              <circle cx={click.x} cy={click.y} r={2.2} fill="#2f80c2" stroke="#eaf4fb" strokeWidth={0.5} />
              <text x={click.x + 3} y={click.y + 1} fill="#eaf4fb" fontSize={3.2}>itt vagyok</text>
            </g>
          )}
        </svg>
      </div>

      <div className="flex h-1/2 flex-col overflow-y-auto border-t border-white/10 bg-sea-800/60 p-5 lg:h-full lg:w-[400px] lg:border-l lg:border-t-0">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-sea-700 px-3 py-1 text-xs">Térképnavigáció</span>
          <span className="text-xs text-foam/60">{index + 1}/{chartTasks.length}</span>
        </div>
        <h2 className="mt-3 text-lg font-bold">{task.title}</h2>
        <p className="mt-2 text-sm text-foam/80">{task.prompt}</p>

        {phase === 'answer' && task.kind !== 'fix' && (
          <div className="mt-5">
            <div className="text-center text-3xl font-black tabular-nums">{Math.round(dial)}°</div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              <DialBtn onClick={() => setDial((d) => (d - 10 + 360) % 360)}>−10°</DialBtn>
              <DialBtn onClick={() => setDial((d) => (d - 1 + 360) % 360)}>−1°</DialBtn>
              <DialBtn onClick={() => setDial((d) => (d + 1) % 360)}>+1°</DialBtn>
              <DialBtn onClick={() => setDial((d) => (d + 10) % 360)}>+10°</DialBtn>
            </div>
            <button onClick={evaluate} className="mt-4 w-full rounded-lg bg-sea-500 px-4 py-2 font-semibold transition hover:bg-sea-500/90">
              Beállított irány elküldése
            </button>
          </div>
        )}

        {phase === 'answer' && task.kind === 'fix' && (
          <div className="mt-5">
            <p className="text-xs text-foam/60">
              Kattints a térképen a két narancs iránylat-egyenes metszéspontjára.
            </p>
            <button
              disabled={!click}
              onClick={evaluate}
              className="mt-3 w-full rounded-lg bg-sea-500 px-4 py-2 font-semibold transition enabled:hover:bg-sea-500/90 disabled:opacity-40"
            >
              Helyzet megerősítése
            </button>
          </div>
        )}

        {phase === 'complete' && (
          <div className="mt-5 rounded-xl border border-buoy-green/40 bg-buoy-green/10 p-4">
            <div className="flex items-center gap-2 font-bold text-buoy-green">✅ Helyes!</div>
            <p className="mt-2 text-sm text-foam/80">{rule?.explanations.rovid}</p>
            <button onClick={next} className="mt-4 w-full rounded-lg bg-sea-500 px-4 py-2 font-semibold transition hover:bg-sea-500/90">
              {index + 1 >= chartTasks.length ? 'Befejezés' : 'Következő →'}
            </button>
          </div>
        )}

        <div className="mt-auto pt-4">
          <button onClick={() => navigate('modes')} className="text-xs text-foam/50 underline-offset-2 hover:underline">
            ← Vissza a választóhoz
          </button>
        </div>
      </div>

      {phase === 'violation' && rule && (
        <DebriefModal
          title="Nem pontos – nézzük át"
          rule={rule}
          diagnosisOptions={task.diagnosisOptions}
          useLlm={useLlm}
          debrief={debrief}
          loading={loading}
          onSubmit={submitDiagnosis}
          onRetry={() => reset(index)}
          onSkip={() => navigate('modes')}
        />
      )}
    </div>
  )
}

function DialBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="rounded-lg bg-sea-900/70 px-2 py-2 text-sm font-semibold transition hover:bg-sea-900">
      {children}
    </button>
  )
}
