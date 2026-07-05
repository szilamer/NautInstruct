import type { DiagnosisQuality, ErrorType, Rule, Situation } from '../content/types'
import { chatCompletionJson, type ChatMessage } from '../llm/client'
import { hasApiKey, type LlmSettings } from '../llm/settings'

export type ExplanationDepth = 'rovid' | 'kozepes' | 'reszletes'

export interface SelfDiagnosisInput {
  situation: Situation
  rule: Rule
  errorType?: ErrorType
  /** Opciós öndiagnózis (HD-02) – a hívó feloldja a minőséget a szituáció opcióiból. */
  diagnosisOptionId?: string
  /** Szabad szöveges öndiagnózis (LLM módban). */
  freeText?: string
}

export interface DebriefResult {
  quality: DiagnosisQuality
  depth: ExplanationDepth
  explanation: string
  source: 'scripted' | 'llm'
}

export interface DebriefEngine {
  classify(input: SelfDiagnosisInput, signal?: AbortSignal): Promise<DebriefResult>
}

// A válasz minősége meghatározza a magyarázat mélységét (HD-03..HD-06).
export function depthForQuality(quality: DiagnosisQuality): ExplanationDepth {
  switch (quality) {
    case 'pontos':
      return 'rovid'
    case 'reszben':
      return 'kozepes'
    case 'teves':
      return 'reszletes'
  }
}

function leadIn(quality: DiagnosisQuality): string {
  switch (quality) {
    case 'pontos':
      return 'Pontosan látod a hibát. '
    case 'reszben':
      return 'Részben jó a diagnózisod, pontosítsuk. '
    case 'teves':
      return 'Ez még nem stimmel, nézzük át lépésről lépésre. '
  }
}

export function buildExplanation(rule: Rule, quality: DiagnosisQuality): string {
  const depth = depthForQuality(quality)
  return leadIn(quality) + rule.explanations[depth]
}

/** Sablonos debrief – nem igényel API-kulcsot, offline is működik. */
export class ScriptedDebrief implements DebriefEngine {
  async classify(input: SelfDiagnosisInput): Promise<DebriefResult> {
    const option = input.situation.diagnosisOptions.find((o) => o.id === input.diagnosisOptionId)
    // Opció nélkül (pl. csak szabad szöveg, LLM nélkül) óvatosan a legmélyebb magyarázatot adjuk.
    const quality: DiagnosisQuality = option?.quality ?? 'teves'
    return {
      quality,
      depth: depthForQuality(quality),
      explanation: buildExplanation(input.rule, quality),
      source: 'scripted',
    }
  }
}

interface LlmDebriefJson {
  quality: DiagnosisQuality
  explanation: string
}

function isValidQuality(v: unknown): v is DiagnosisQuality {
  return v === 'pontos' || v === 'reszben' || v === 'teves'
}

/**
 * Valódi LLM debrief. Természetes nyelvű öndiagnózist is értékel.
 * Bármilyen hiba (nincs kulcs, hálózat, parse) esetén a megadott tartalékra esik vissza.
 */
export class LlmDebrief implements DebriefEngine {
  private settings: LlmSettings
  private fallback: DebriefEngine

  constructor(settings: LlmSettings, fallback: DebriefEngine = new ScriptedDebrief()) {
    this.settings = settings
    this.fallback = fallback
  }

  buildMessages(input: SelfDiagnosisInput): ChatMessage[] {
    const { rule, errorType, situation } = input
    const playerDiagnosis =
      input.freeText?.trim() ||
      situation.diagnosisOptions.find((o) => o.id === input.diagnosisOptionId)?.label ||
      '(nem adott meg magyarázatot)'

    const system =
      'Te egy magyar nyelvű hajóskapitány-vizsgabiztos és mentor vagy. ' +
      'A tanuló egy hajózási szituációban hibázott. A feladatod: értékeld, mennyire ismerte fel helyesen a saját hibáját, ' +
      'majd adj a szint(nek) megfelelő magyarázatot. Mindig magyarul válaszolj, tömören és a konkrét helyzethez kötve. ' +
      'Csak JSON-t adj vissza ilyen formában: {"quality": "pontos|reszben|teves", "explanation": "..."}. ' +
      'A "pontos" rövid megerősítés, a "reszben" célzott pontosítás, a "teves" lépésről lépésre újratanítás legyen.'

    const user = [
      `Szituáció: ${situation.prompt}`,
      `A vizsgázandó szabály: ${rule.title} — ${rule.correctSummary}`,
      errorType ? `A tanuló tényleges hibája: ${errorType.label}` : '',
      `A tanuló öndiagnózisa: "${playerDiagnosis}"`,
      'Döntsd el a minőséget (pontos/reszben/teves), és írd meg a magyarázatot.',
    ]
      .filter(Boolean)
      .join('\n')

    return [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ]
  }

  async classify(input: SelfDiagnosisInput, signal?: AbortSignal): Promise<DebriefResult> {
    if (!hasApiKey(this.settings)) {
      return this.fallback.classify(input, signal)
    }
    try {
      const json = (await chatCompletionJson(this.settings, this.buildMessages(input), signal)) as LlmDebriefJson
      if (!isValidQuality(json.quality) || typeof json.explanation !== 'string' || !json.explanation.trim()) {
        return this.fallback.classify(input, signal)
      }
      return {
        quality: json.quality,
        depth: depthForQuality(json.quality),
        explanation: json.explanation.trim(),
        source: 'llm',
      }
    } catch {
      return this.fallback.classify(input, signal)
    }
  }
}

/** LLM debrief, ha van kulcs; egyébként sablonos. */
export function createDebriefEngine(settings: LlmSettings): DebriefEngine {
  return hasApiKey(settings) ? new LlmDebrief(settings) : new ScriptedDebrief()
}
