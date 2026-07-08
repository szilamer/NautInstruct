import type { TopicId } from '../content/types'
import { topics } from '../content/topics'

export interface TopicStat {
  attempts: number
  correct: number
}

export interface ErrorCard {
  id: string
  situationId: string
  topicId: TopicId
  ruleTitle: string
  whatHappened: string
  correctRule: string
  at: number
}

export type TopicStatus = 'kezdo' | 'gyakorlo' | 'stabil' | 'vizsgakesz'

export type CaptainRank =
  | 'matroz'
  | 'segedkapitany'
  | 'folyami-kapitany'
  | 'tengeri-kapitany'
  | 'vizsgakesz-kapitany'

export interface ProgressState {
  topics: Record<TopicId, TopicStat>
  errorCards: ErrorCard[]
}

const STORAGE_KEY = 'naut.progress'

export function emptyProgress(): ProgressState {
  const topicStats = {} as Record<TopicId, TopicStat>
  for (const t of topics) topicStats[t.id] = { attempts: 0, correct: 0 }
  return { topics: topicStats, errorCards: [] }
}

export function loadProgress(): ProgressState {
  const base = emptyProgress()
  if (typeof localStorage === 'undefined') return base
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    for (const t of topics) {
      const s = parsed.topics?.[t.id]
      if (s) base.topics[t.id] = { attempts: s.attempts ?? 0, correct: s.correct ?? 0 }
    }
    base.errorCards = Array.isArray(parsed.errorCards) ? parsed.errorCards : []
    return base
  } catch {
    return base
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

/** V-01: témaköri teljesítmény százalékban. */
export function topicPercent(stat: TopicStat): number {
  if (stat.attempts === 0) return 0
  return Math.round((stat.correct / stat.attempts) * 100)
}

/** V-03: vizsgakészségi státusz egy témakörben. */
export function topicStatus(stat: TopicStat): TopicStatus {
  if (stat.attempts < 2) return 'kezdo'
  const p = topicPercent(stat)
  if (p >= 90 && stat.attempts >= 3) return 'vizsgakesz'
  if (p >= 70) return 'stabil'
  if (p >= 40) return 'gyakorlo'
  return 'kezdo'
}

/** V-04: kapitányi rang a tényleges témaköri teljesítményből. */
export function captainRank(state: ProgressState): CaptainRank {
  const statuses = topics.map((t) => topicStatus(state.topics[t.id]))
  const examReady = statuses.filter((s) => s === 'vizsgakesz').length
  const stableOrBetter = statuses.filter((s) => s === 'stabil' || s === 'vizsgakesz').length
  const totalAttempts = topics.reduce((sum, t) => sum + state.topics[t.id].attempts, 0)

  if (examReady === topics.length) return 'vizsgakesz-kapitany'
  if (stableOrBetter >= 3) return 'tengeri-kapitany'
  if (stableOrBetter >= 1) return 'folyami-kapitany'
  if (totalAttempts >= 1) return 'segedkapitany'
  return 'matroz'
}

export function rankLabel(rank: CaptainRank): string {
  switch (rank) {
    case 'matroz':
      return 'Matróz'
    case 'segedkapitany':
      return 'Segédkapitány'
    case 'folyami-kapitany':
      return 'Folyami kapitány'
    case 'tengeri-kapitany':
      return 'Tengeri kapitány'
    case 'vizsgakesz-kapitany':
      return 'Vizsgakész kapitány'
  }
}

export function statusLabel(status: TopicStatus): string {
  switch (status) {
    case 'kezdo':
      return 'Kezdő'
    case 'gyakorlo':
      return 'Gyakorló'
    case 'stabil':
      return 'Stabil'
    case 'vizsgakesz':
      return 'Vizsgakész'
  }
}

export function recordAttempt(state: ProgressState, topicId: TopicId, correct: boolean): ProgressState {
  const stat = state.topics[topicId]
  const nextStat: TopicStat = {
    attempts: stat.attempts + 1,
    correct: stat.correct + (correct ? 1 : 0),
  }
  return { ...state, topics: { ...state.topics, [topicId]: nextStat } }
}

export function addErrorCard(state: ProgressState, card: ErrorCard): ProgressState {
  return { ...state, errorCards: [card, ...state.errorCards].slice(0, 50) }
}
