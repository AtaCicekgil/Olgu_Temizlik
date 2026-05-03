const API_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
const MODEL   = 'gemini-2.0-flash'
const API_KEY = () => import.meta.env.VITE_GEMINI_API_KEY as string

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
  if (!key) throw new Error('VITE_GEMINI_API_KEY tanımlı değil')

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${key}`,
    },
    signal,
    body: JSON.stringify({
      model:       MODEL,
      messages,
      tools:       tools.length ? tools : undefined,
      tool_choice: tools.length ? 'auto' : undefined,
      temperature: 0.2,
      max_tokens:  800,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini hatası ${res.status}: ${err}`)
  }

  return res.json()
}
