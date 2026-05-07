import { groqChat, type GMessage } from './groq'
import { buildSystemPrompt } from './context-builder'
import { executeTool } from '../tools/index'
import { selectTools } from './tool-router'
import type { ChatMessage } from '../types/tools'

const MAX_ITER  = 5
const TIMEOUT_MS = 15_000

export interface RunResult {
  reply:        string
  toolMessages: ChatMessage[]
  card?:        import('../types/tools').ResultCard
}

export async function runOrchestrator(
  history: ChatMessage[],
  userText: string,
  signal?: AbortSignal
): Promise<RunResult> {
  // Build Groq message history — son 6 mesajı gönder (token tasarrufu)
  const msgs: GMessage[] = [
    { role: 'system', content: buildSystemPrompt() },
    ...historyToGroq(history.slice(-6)),
    { role: 'user', content: userText },
  ]

  // Mesaja göre ilgili tool'ları seç (111 yerine ~20-30)
  const activeTools = selectTools(userText, history)

  const toolMessages: ChatMessage[] = []
  let iter = 0

  while (iter < MAX_ITER) {
    iter++

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    const combinedSignal = signal
      ? anyAbort(signal, controller.signal)
      : controller.signal

    let res
    try {
      res = await groqChat(msgs, activeTools, combinedSignal)
    } finally {
      clearTimeout(timer)
    }

    const choice  = res.choices[0]
    const message = choice.message

    // Bazı modeller tool call'ı JSON metin olarak yazar — yakala ve dönüştür
    if ((!message.tool_calls || message.tool_calls.length === 0) && message.content) {
      const textTc = parseTextToolCall(message.content)
      if (textTc) {
        message.tool_calls = [textTc]
        message.content = null
      }
    }

    // No tool calls → final answer
    if (!message.tool_calls || message.tool_calls.length === 0) {
      return { reply: message.content || '', toolMessages, card: extractSiparisCard(toolMessages) }
    }

    // Add assistant message with tool calls to Groq context
    msgs.push({
      role: 'assistant',
      content: message.content ?? null,
      tool_calls: message.tool_calls,
    })

    // Execute all tool calls (parallel)
    const execResults = await Promise.all(
      message.tool_calls.map(async (tc) => {
        let args: Record<string, unknown> = {}
        try { args = JSON.parse(tc.function.arguments) } catch { /* */ }

        let result: unknown
        try {
          result = await executeTool(tc.function.name, args)
        } catch (e) {
          result = { success: false, error: String(e) }
        }
        return { tc, result }
      })
    )

    // Build a single combined tool-call ChatMessage for display
    const displayMsg: ChatMessage = {
      id: `tool-${Date.now()}-${iter}`,
      role: 'tool',
      content: '',
      toolCalls: message.tool_calls.map(tc => ({
        id:   tc.id,
        name: tc.function.name,
        args: (() => {
          try { return JSON.parse(tc.function.arguments) } catch { return {} }
        })(),
      })),
      toolResults: execResults.map(({ result }) => result as { success: boolean; data?: unknown; error?: string }),
      ts: Date.now(),
    }
    toolMessages.push(displayMsg)

    // Feed tool results back to Groq
    for (const { tc, result } of execResults) {
      msgs.push({
        role: 'tool',
        tool_call_id: tc.id,
        name: tc.function.name,
        content: JSON.stringify(result),
      })
    }
  }

  // Exceeded max iterations — ask for final answer without tools
  msgs.push({ role: 'user', content: 'Lütfen şimdiye kadar toplanan bilgilere göre kısa bir özet ver.' })
  const final = await groqChat(msgs, [], signal)
  return { reply: final.choices[0].message.content || '', toolMessages, card: extractSiparisCard(toolMessages) }
}

// ── helpers ──────────────────────────────────────────────────────────────────

// siparis_olustur başarılıysa kart çıkar
function extractSiparisCard(toolMsgs: ChatMessage[]) {
  for (const tm of toolMsgs) {
    const idx = tm.toolCalls?.findIndex(tc => tc.name === 'siparis_olustur') ?? -1
    if (idx === -1) continue
    const result = tm.toolResults?.[idx] as { success?: boolean; data?: unknown } | undefined
    if (result?.success && result.data) {
      return { type: 'yeni_siparis' as const, data: result.data }
    }
  }
  return undefined
}

// Model bazen tool_call'ı metin olarak döner (çeşitli formatlar)
// {"type":"function","name":"...","arguments":{}}
// {"name":"...","arguments":{}}
function parseTextToolCall(content: string): GToolCall | null {
  try {
    const cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
    const start = cleaned.indexOf('{')
    if (start === -1) return null
    const jsonStr = cleaned.slice(start)
    const p = JSON.parse(jsonStr)
    const name = p.name || p.function?.name
    if (name) {
      const args = p.arguments ?? p.function?.arguments ?? {}
      return {
        id: `tc_${Date.now()}`,
        type: 'function',
        function: {
          name,
          arguments: typeof args === 'string' ? args : JSON.stringify(args),
        },
      }
    }
  } catch { /* */ }
  return null
}

function historyToGroq(history: ChatMessage[]): GMessage[] {
  const out: GMessage[] = []
  for (const m of history) {
    if (m.role === 'user') {
      out.push({ role: 'user', content: m.content })
    } else if (m.role === 'assistant' && m.content) {
      out.push({ role: 'assistant', content: m.content })
    }
    // tool messages are already fed during their run — skip here
  }
  return out
}

function anyAbort(...signals: AbortSignal[]): AbortSignal {
  const ctrl = new AbortController()
  for (const s of signals) {
    if (s.aborted) { ctrl.abort(); break }
    s.addEventListener('abort', () => ctrl.abort(), { once: true })
  }
  return ctrl.signal
}
