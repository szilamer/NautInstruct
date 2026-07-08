// Az LLM beállítások a felhasználótól származnak, és csak a böngésző localStorage-ában élnek.
// A kulcs SOHA nem kerül a repóba, és kizárólag az LLM API-hívásokhoz használjuk.

export interface LlmSettings {
  apiKey: string
  model: string
  baseUrl: string
}

export const DEFAULT_MODEL = 'gpt-4o-mini'
export const DEFAULT_BASE_URL = 'https://api.openai.com/v1'

const STORAGE_KEY = 'naut.llm.settings'

export function loadLlmSettings(): LlmSettings {
  if (typeof localStorage === 'undefined') {
    return { apiKey: '', model: DEFAULT_MODEL, baseUrl: DEFAULT_BASE_URL }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { apiKey: '', model: DEFAULT_MODEL, baseUrl: DEFAULT_BASE_URL }
    const parsed = JSON.parse(raw) as Partial<LlmSettings>
    return {
      apiKey: parsed.apiKey ?? '',
      model: parsed.model || DEFAULT_MODEL,
      baseUrl: parsed.baseUrl || DEFAULT_BASE_URL,
    }
  } catch {
    return { apiKey: '', model: DEFAULT_MODEL, baseUrl: DEFAULT_BASE_URL }
  }
}

export function saveLlmSettings(settings: LlmSettings): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function hasApiKey(settings: LlmSettings): boolean {
  return settings.apiKey.trim().length > 0
}
