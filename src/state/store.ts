import { create } from 'zustand'
import { levelById } from '../content/levels'
import { situationById, situations } from '../content/situations'
import type { Situation, TopicId } from '../content/types'
import { evaluateDecision, type EvaluationResult } from '../engine/ruleEvaluator'
import { createDebriefEngine, type DebriefResult } from '../engine/debrief'
import {
  addErrorCard,
  emptyProgress,
  loadProgress,
  recordAttempt,
  saveProgress,
  type ErrorCard,
  type ProgressState,
} from '../engine/progress'
import { loadLlmSettings, saveLlmSettings, type LlmSettings } from '../llm/settings'

export type Route = 'home' | 'modes' | 'play' | 'navplay' | 'chart' | 'progress' | 'settings'
export type SessionMode = 'kuldetes' | 'szabad'
export type PlayPhase = 'deciding' | 'success' | 'debrief' | 'complete'

interface Session {
  mode: SessionMode
  title: string
  topicId?: TopicId
  queue: string[]
  index: number
  phase: PlayPhase
  scored: Set<string>
  correctCount: number
  lastEval?: EvaluationResult
  debrief?: DebriefResult
  debriefLoading: boolean
}

interface StoreState {
  route: Route
  llmSettings: LlmSettings
  progress: ProgressState
  session?: Session
  activeMissionId?: string

  navigate: (route: Route) => void
  updateLlmSettings: (settings: LlmSettings) => void
  resetProgress: () => void
  recordNavOutcome: (args: {
    topicId: TopicId
    correct: boolean
    card?: Omit<ErrorCard, 'id' | 'at'>
  }) => void

  startLevel: (levelId: string) => void
  startFreePractice: (topicId: TopicId) => void
  startMission: (missionId: string) => void
  startChart: () => void
  currentSituation: () => Situation | undefined

  chooseDecision: (decisionId: string) => void
  submitDiagnosis: (args: { diagnosisOptionId?: string; freeText?: string }) => Promise<void>
  retry: () => void
  next: () => void
  exitToHome: () => void
}

function situationsForTopic(topicId: TopicId): string[] {
  return situations.filter((s) => s.topicId === topicId).map((s) => s.id)
}

export const useStore = create<StoreState>((set, get) => ({
  route: 'home',
  llmSettings: loadLlmSettings(),
  progress: loadProgress(),
  session: undefined,

  navigate: (route) => set({ route }),

  updateLlmSettings: (settings) => {
    saveLlmSettings(settings)
    set({ llmSettings: settings })
  },

  resetProgress: () => {
    const cleared = emptyProgress()
    saveProgress(cleared)
    set({ progress: cleared })
  },

  recordNavOutcome: ({ topicId, correct, card }) => {
    let progress = recordAttempt(get().progress, topicId, correct)
    if (card) {
      progress = addErrorCard(progress, { ...card, id: `${card.situationId}-${Date.now()}`, at: Date.now() })
    }
    saveProgress(progress)
    set({ progress })
  },

  startMission: (missionId) => set({ route: 'navplay', activeMissionId: missionId }),

  startChart: () => set({ route: 'chart' }),

  startLevel: (levelId) => {
    const level = levelById.get(levelId)
    if (!level) return
    set({
      route: 'play',
      session: {
        mode: 'kuldetes',
        title: level.title,
        topicId: level.topicId,
        queue: [...level.situationIds],
        index: 0,
        phase: 'deciding',
        scored: new Set(),
        correctCount: 0,
        debriefLoading: false,
      },
    })
  },

  startFreePractice: (topicId) => {
    const queue = situationsForTopic(topicId)
    set({
      route: 'play',
      session: {
        mode: 'szabad',
        title: 'Szabad gyakorlás',
        topicId,
        queue,
        index: 0,
        phase: 'deciding',
        scored: new Set(),
        correctCount: 0,
        debriefLoading: false,
      },
    })
  },

  currentSituation: () => {
    const s = get().session
    if (!s) return undefined
    return situationById.get(s.queue[s.index])
  },

  chooseDecision: (decisionId) => {
    const state = get()
    const session = state.session
    const situation = state.currentSituation()
    if (!session || !situation) return

    const result = evaluateDecision(situation, decisionId)

    // Témaköri profil: csak az első próbálkozást pontozzuk szituációnként (vizsgaszerű).
    let progress = state.progress
    const scored = new Set(session.scored)
    if (!scored.has(situation.id)) {
      progress = recordAttempt(progress, situation.topicId, result.correct)
      scored.add(situation.id)
    }

    if (result.correct) {
      saveProgress(progress)
      set({
        progress,
        session: {
          ...session,
          scored,
          phase: 'success',
          lastEval: result,
          debrief: undefined,
          correctCount: session.correctCount + 1,
        },
      })
    } else {
      // V-02: hibakártya létrehozása.
      progress = addErrorCard(progress, {
        id: `${situation.id}-${Date.now()}`,
        situationId: situation.id,
        topicId: situation.topicId,
        ruleTitle: result.rule.title,
        whatHappened: result.errorType?.label ?? result.chosen.label,
        correctRule: result.rule.correctSummary,
        at: Date.now(),
      })
      saveProgress(progress)
      set({
        progress,
        session: {
          ...session,
          scored,
          phase: 'debrief',
          lastEval: result,
          debrief: undefined,
          debriefLoading: false,
        },
      })
    }
  },

  submitDiagnosis: async ({ diagnosisOptionId, freeText }) => {
    const state = get()
    const session = state.session
    const situation = state.currentSituation()
    if (!session || !situation || !session.lastEval) return

    set({ session: { ...session, debriefLoading: true } })
    const engine = createDebriefEngine(state.llmSettings)
    const result = await engine.classify({
      context: situation.prompt,
      diagnosisOptions: situation.diagnosisOptions,
      rule: session.lastEval.rule,
      errorType: session.lastEval.errorType,
      diagnosisOptionId,
      freeText,
    })

    const latest = get().session
    if (!latest) return
    set({ session: { ...latest, debrief: result, debriefLoading: false } })
  },

  retry: () => {
    const session = get().session
    if (!session) return
    set({
      session: { ...session, phase: 'deciding', lastEval: undefined, debrief: undefined, debriefLoading: false },
    })
  },

  next: () => {
    const session = get().session
    if (!session) return
    const nextIndex = session.index + 1
    if (nextIndex >= session.queue.length) {
      set({ session: { ...session, phase: 'complete' } })
    } else {
      set({
        session: {
          ...session,
          index: nextIndex,
          phase: 'deciding',
          lastEval: undefined,
          debrief: undefined,
          debriefLoading: false,
        },
      })
    }
  },

  exitToHome: () => set({ route: 'home', session: undefined }),
}))
