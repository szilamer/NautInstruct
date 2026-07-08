import { describe, expect, it } from 'vitest'
import { situationById } from '../content/situations'
import { evaluateDecision } from './ruleEvaluator'

describe('evaluateDecision', () => {
  const situation = situationById.get('s-kikotes-ar-ellen')!

  it('a helyes döntést helyesnek jelöli', () => {
    const res = evaluateDecision(situation, 'd1')
    expect(res.correct).toBe(true)
    expect(res.errorType).toBeUndefined()
    expect(res.rule.id).toBe('r-kikotes-ar-ellen')
  })

  it('a hibás döntéshez a megfelelő hibatípust rendeli', () => {
    const res = evaluateDecision(situation, 'd2')
    expect(res.correct).toBe(false)
    expect(res.errorType?.id).toBe('e-kikotes-arral')
  })

  it('ismeretlen döntésre hibát dob', () => {
    expect(() => evaluateDecision(situation, 'nincs-ilyen')).toThrow()
  })
})
