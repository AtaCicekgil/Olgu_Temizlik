import { motion } from 'framer-motion'
import { Wrench } from 'lucide-react'
import type { ChatMessage } from '../types/tools'
import { ResultCard } from './ResultCard'

interface Props { msg: ChatMessage }

const bubble = {
  initial: { opacity: 0, y: 8, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.18, ease: 'easeOut' },
}

export function MessageBubble({ msg }: Props) {
  if (msg.role === 'user') {
    return (
      <motion.div className="flex justify-end" {...bubble}>
        <div className="max-w-[80%] bg-primary text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed">
          {msg.content}
        </div>
      </motion.div>
    )
  }

  if (msg.role === 'tool') {
    return (
      <motion.div className="flex justify-start" {...bubble}>
        <div className="flex flex-col gap-1">
          {(msg.toolCalls || []).map((tc, i) => (
            <div key={tc.id} className="flex items-center gap-1.5 text-xs text-gray-400">
              <Wrench size={11} className="shrink-0 animate-pulse" />
              <span className="font-mono">{tc.name}</span>
              {msg.toolResults?.[i] && !(msg.toolResults[i] as { success: boolean }).success && (
                <span className="text-red-400 ml-1">hata</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  // assistant
  const displayContent = (() => {
    let c = msg.content || ''
    c = c.replace(/<think>[\s\S]*?<\/think>/g, '')  // Qwen3 think bloğu
    // Tool call JSON içeriyorsa tamamen gizle
    if (/["']name["']\s*:\s*["'][a-z_]+["']/.test(c) && /["']arguments["']/.test(c)) return ''
    if (/^\s*\{[\s\S]*"musteri_id"/.test(c)) return ''
    return c.trim()
  })()

  return (
    <motion.div className="flex justify-start" {...bubble}>
      <div className="max-w-[92%] flex flex-col gap-2">
        {displayContent && (
          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
            {displayContent}
          </div>
        )}
        {msg.card && <ResultCard card={msg.card} />}
      </div>
    </motion.div>
  )
}
