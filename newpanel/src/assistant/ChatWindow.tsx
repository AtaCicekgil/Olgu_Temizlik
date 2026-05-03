import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { Spinner } from '../components/ui/Spinner'
import type { ChatMessage } from '../types/tools'

interface Props {
  messages: ChatMessage[]
  loading:  boolean
}

export function ChatWindow({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none px-4 py-4 flex flex-col gap-3">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center select-none">
          <div className="text-4xl">🧺</div>
          <p className="text-gray-400 text-sm max-w-xs">
            Merhaba! Sipariş, müşteri, gider veya rapor için ne yapmamı istersiniz?
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {SUGGESTIONS.map(s => (
              <span key={s} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {messages.map(msg => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2.5">
            <Spinner size={14} className="text-primary" />
            <span className="text-xs text-gray-400">düşünüyor…</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

const SUGGESTIONS = [
  'Bugünkü rapor',
  'Fabrika durumu',
  'Ödenmemiş siparişler',
  'Mazot gideri ekle',
  'Yeni sipariş al',
]
