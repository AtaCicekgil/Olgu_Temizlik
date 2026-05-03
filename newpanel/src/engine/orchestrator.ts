import { groqChat, type GMessage } from './groq'
import { buildSystemPrompt } from './context-builder'
import { ALL_TOOLS, executeTool } from '../tools/index'
import type { ChatMessage } from '../types/tools'

const MAX_ITER  = 5
const TIMEOUT_MS = 15_000

export interface RunResult {
  reply:    string
  messages: ChatMessage[]  // tool call messages to display
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
      res = await groqChat(msgs, ALL_TOOLS, combinedSignal)
    } finally {
      clearTimeout(timer)
    }

    const choice  = res.choices[0]
    const message = choice.message

    // No tool calls → final answer
    if (!message.tool_calls || message.tool_calls.length === 0) {
      return { reply: message.content || '', toolMessages }
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
  return { reply: final.choices[0].message.content || '', toolMessages }
}

// ── helpers ──────────────────────────────────────────────────────────────────

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
