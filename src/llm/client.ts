import type { LlmSettings } from './settings'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export class LlmError extends Error {}

/**
 * OpenAI-kompatibilis chat completion, JSON-válaszra kényszerítve.
 * A hívó felelős a hibakezelésért (pl. sablonos tartalékra váltás).
 */
export async function chatCompletionJson(
  settings: LlmSettings,
  messages: ChatMessage[],
  signal?: AbortSignal,
): Promise<unknown> {
  if (!settings.apiKey.trim()) {
    throw new LlmError('Nincs API-kulcs beállítva.')
  }

  const res = await fetch(`${settings.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      messages,
      temperature: 0.4,
      response_format: { type: 'json_object' },
    }),
    signal,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new LlmError(`LLM hiba (${res.status}): ${text.slice(0, 200)}`)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new LlmError('Üres LLM-válasz.')

  try {
    return JSON.parse(content)
  } catch {
    throw new LlmError('Az LLM válasza nem érvényes JSON.')
  }
}
