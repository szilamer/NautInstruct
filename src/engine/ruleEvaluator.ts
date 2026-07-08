import type { DecisionOption, ErrorType, Rule, Situation } from '../content/types'
import { ruleById } from '../content/rules'

export interface EvaluationResult {
  correct: boolean
  chosen: DecisionOption
  rule: Rule
  /** Hibás döntésnél a hozzá tartozó tipikus hibatípus. */
  errorType?: ErrorType
}

/**
 * Egy szituációban meghozott döntés kiértékelése a szabályhoz képest (F-04).
 */
export function evaluateDecision(situation: Situation, decisionId: string): EvaluationResult {
  const chosen = situation.decisions.find((d) => d.id === decisionId)
  if (!chosen) {
    throw new Error(`Ismeretlen döntés: ${decisionId}`)
  }
  const rule = ruleById.get(situation.ruleId)
  if (!rule) {
    throw new Error(`Ismeretlen szabály: ${situation.ruleId}`)
  }

  const errorType = chosen.isCorrect
    ? undefined
    : rule.typicalErrors.find((e) => e.id === chosen.errorTypeId)

  return { correct: chosen.isCorrect, chosen, rule, errorType }
}
