import { useCallback, useRef } from 'react'
import { Trash2 } from 'lucide-react'
import { ChatWindow } from './ChatWindow'
import { InputBar } from './InputBar'
import { useChatStore } from '../store/chat.store'
import { runOrchestrator } from '../engine/orchestrator'
import type { ChatMessage } from '../types/tools'

interface Props {
  compact?: boolean  // true = inside drawer, false = full screen
}

export function AssistantShell({ compact }: Props) {
  const { messages, loading, addMessage, setLoading, clearChat } = useChatStore()
  const abortRef = useRef<AbortController | null>(null)

  const send = useCallback(async (text: string) => {
    if (loading) return

    // Cancel any in-flight request
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    // Add user message
    const userMsg: Omit<ChatMessage, 'id' | 'ts'> = { role: 'user', content: text }
    addMessage(userMsg)
    setLoading(true)

    try {
      const { reply, toolMessages } = await runOrchestrator(messages, text, ctrl.signal)

      // Add tool call trace messages
      for (const tm of toolMessages) {
        addMessage({ role: tm.role, content: tm.content, toolCalls: tm.toolCalls, toolResults: tm.toolResults })
      }

      // Add final assistant reply
      if (reply) {
        addMessage({ role: 'assistant', content: reply })
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      addMessage({ role: 'assistant', content: `⚠️ Hata: ${(e as Error).message}` })
    } finally {
      setLoading(false)
    }
  }, [loading, messages, addMessage, setLoading])

  return (
    <div className={`flex flex-col bg-gray-50 ${compact ? 'h-full' : 'h-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧺</span>
          <span className="font-semibold text-gray-800 text-sm">Asistan</span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Sohbeti temizle"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Messages */}
      <ChatWindow messages={messages} loading={loading} />

      {/* Input */}
      <InputBar onSend={send} loading={loading} />
    </div>
  )
}
