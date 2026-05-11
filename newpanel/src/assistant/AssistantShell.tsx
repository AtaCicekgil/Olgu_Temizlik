import { useCallback, useEffect, useRef } from 'react'
import { Trash2 } from 'lucide-react'
import { ChatWindow } from './ChatWindow'
import { InputBar } from './InputBar'
import { useChatStore } from '../store/chat.store'
import { runOrchestrator } from '../engine/orchestrator'
import { tryCommand } from '../engine/command-router'
import { toast } from '../components/ui/Toast'
import type { ChatMessage } from '../types/tools'

interface Props {
  compact?: boolean  // true = inside drawer, false = full screen
}

export function AssistantShell({ compact }: Props) {
  const { messages, loading, addMessage, setLoading, clearChat } = useChatStore()
  const abortRef = useRef<AbortController | null>(null)

  // "/" key → focus input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && e.target === document.body) {
        e.preventDefault()
        document.getElementById('assistant-input')?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const send = useCallback(async (text: string) => {
    if (loading) return

    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    const userMsg: Omit<ChatMessage, 'id' | 'ts'> = { role: 'user', content: text }
    addMessage(userMsg)
    setLoading(true)

    try {
      // Önce kural tabanlı router'ı dene (LLM gerektirmez)
      const cmdResult = await tryCommand(text)
      if (cmdResult) {
        addMessage({ role: 'assistant', content: cmdResult.reply, card: cmdResult.card })
        return
      }

      // Eşleşme yok → LLM orchestrator
      const { reply, toolMessages, card } = await runOrchestrator(messages, text, ctrl.signal)

      for (const tm of toolMessages) {
        addMessage({ role: tm.role, content: tm.content, toolCalls: tm.toolCalls, toolResults: tm.toolResults })
        if (tm.toolResults) {
          for (const r of tm.toolResults) {
            if (!(r as { success: boolean }).success) {
              const msg = (r as { error?: string }).error
              toast.error(msg ? `Hata: ${msg}` : 'Bir araç başarısız oldu')
            }
          }
        }
      }

      if (reply) {
        addMessage({ role: 'assistant', content: reply, card })
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      const errMsg = (e as Error).message
      addMessage({ role: 'assistant', content: `⚠️ Hata: ${errMsg}` })
      toast.error(errMsg)
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
      <ChatWindow messages={messages} loading={loading} onSuggest={send} />

      {/* Input */}
      <InputBar onSend={send} loading={loading} />
    </div>
  )
}
