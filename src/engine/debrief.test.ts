import { afterEach, describe, expect, it, vi } from 'vitest'
import { ruleById } from '../content/rules'
import { situationById } from '../content/situations'
import { LlmDebrief, ScriptedDebrief, depthForQuality } from './debrief'
import type { SelfDiagnosisInput } from './debrief'
import type { LlmSettings } from '../llm/settings'

const situation = situationById.get('s-kikotes-ar-ellen')!
const rule = ruleById.get('r-kikotes-ar-ellen')!

function inputWith(diagnosisOptionId?: string, freeText?: string): SelfDiagnosisInput {
  return {
    situation,
    rule,
    errorType: rule.typicalErrors[0],
    diagnosisOptionId,
    freeText,
  }
}

describe('depthForQuality', () => {
  it('a minőséghez rendeli a magyarázat mélységét', () => {
    expect(depthForQuality('pontos')).toBe('rovid')
    expect(depthForQuality('reszben')).toBe('kozepes')
    expect(depthForQuality('teves')).toBe('reszletes')
  })
})

describe('ScriptedDebrief', () => {
  it('pontos öndiagnózisnál rövid megerősítést ad', async () => {
    const res = await new ScriptedDebrief().classify(inputWith('g1'))
    expect(res.quality).toBe('pontos')
    expect(res.depth).toBe('rovid')
    expect(res.source).toBe('scripted')
    expect(res.explanation).toContain(rule.explanations.rovid)
  })

  it('téves öndiagnózisnál részletes újratanítást ad', async () => {
    const res = await new ScriptedDebrief().classify(inputWith('g3'))
    expect(res.quality).toBe('teves')
    expect(res.depth).toBe('reszletes')
    expect(res.explanation).toContain(rule.explanations.reszletes)
  })

  it('opció nélkül óvatosan a legmélyebb magyarázatot adja', async () => {
    const res = await new ScriptedDebrief().classify(inputWith(undefined, 'valami szabad szöveg'))
    expect(res.quality).toBe('teves')
  })
})

describe('LlmDebrief', () => {
  const settings: LlmSettings = { apiKey: 'sk-test', model: 'gpt-4o-mini', baseUrl: 'https://api.example/v1' }

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('kulcs nélkül a sablonos tartalékra esik vissza', async () => {
    const engine = new LlmDebrief({ ...settings, apiKey: '' })
    const res = await engine.classify(inputWith('g1'))
    expect(res.source).toBe('scripted')
  })

  it('érvényes LLM-választ dolgoz fel', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            choices: [
              { message: { content: JSON.stringify({ quality: 'reszben', explanation: 'AI magyarázat.' }) } },
            ],
          }),
          { status: 200 },
        ),
      ),
    )
    const engine = new LlmDebrief(settings)
    const res = await engine.classify(inputWith(undefined, 'ár irányba fordultam'))
    expect(res.source).toBe('llm')
    expect(res.quality).toBe('reszben')
    expect(res.explanation).toBe('AI magyarázat.')
  })

  it('hibás LLM-hívásnál sablonos tartalékot használ', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('szerverhiba', { status: 500 })),
    )
    const engine = new LlmDebrief(settings)
    const res = await engine.classify(inputWith('g1'))
    expect(res.source).toBe('scripted')
    expect(res.quality).toBe('pontos')
  })

  it('a promptba beépíti a szabályt és a hibát', () => {
    const engine = new LlmDebrief(settings)
    const messages = engine.buildMessages(inputWith('g1'))
    const user = messages.find((m) => m.role === 'user')!.content
    expect(user).toContain(rule.title)
    expect(user).toContain(rule.typicalErrors[0].label)
  })
})
