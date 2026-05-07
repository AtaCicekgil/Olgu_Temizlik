const API_URL = 'https://api.cerebras.ai/v1/chat/completions'
const MODELS  = ['qwen-3-235b-a22b-instruct-2507', 'llama3.1-8b']
const API_KEY = () => import.meta.env.VITE_CEREBRAS_API_KEY as string

export interface GMessage {
  role:          'system' | 'user' | 'assistant' | 'tool'
  content:       string | null
  tool_calls?:   GToolCall[]
  tool_call_id?: string
  name?:         string
}

export interface GToolCall {
  id:       string
  type:     'function'
  function: { name: string; arguments: string }
}

export interface GTool {
  type: 'function'
  function: {
    name:        string
    description: string
    parameters:  Record<string, unknown>
  }
}

export interface GResponse {
  choices: Array<{
    message: {
      role:        string
      content:     string | null
      tool_calls?: GToolCall[]
    }
    finish_reason: string
  }>
}

export async function groqChat(
  messages: GMessage[],
  tools: GTool[],
  signal?: AbortSignal
): Promise<GResponse> {
  const key = API_KEY()
  if (!key) throw new Error('VITE_CEREBRAS_API_KEY tanımlı değil')

  let lastErr = ''
  for (const model of MODELS) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${key}`,
      },
      signal,
      body: JSON.stringify({
        model,
        messages,
        tools:       tools.length ? tools : undefined,
        tool_choice: tools.length ? 'auto' : undefined,
        temperature: 0.2,
        max_tokens:  800,
      }),
    })

    if (res.ok) return res.json()

    const errText = await res.text()

    // 429 veya 404 → sıradaki modeli dene
    if (res.status === 429 || res.status === 404) {
      lastErr = errText
      await new Promise(r => setTimeout(r, 1000))
      continue
    }

    throw new Error(`Cerebras hatası ${res.status}: ${errText}`)
  }

  throw new Error(`Cerebras hatası 429: ${lastErr}`)
}
