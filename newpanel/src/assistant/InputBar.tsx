import { useState, useRef, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { VoiceButton } from './VoiceButton'
import { Spinner } from '../components/ui/Spinner'

interface Props {
  onSend:   (text: string) => void
  loading?: boolean
  placeholder?: string
}

export function InputBar({ onSend, loading, placeholder = 'Komut ver veya sor…' }: Props) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    const t = text.trim()
    if (!t || loading) return
    onSend(t)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const onInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  return (
    <div className="flex items-end gap-2 p-3 bg-white border-t border-gray-200">
      <VoiceButton
        onResult={(t) => { setText(t); setTimeout(submit, 80) }}
        disabled={loading}
      />
      <div className="flex-1 flex items-end bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
        <textarea
          id="assistant-input"
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={onKey}
          onInput={onInput}
          placeholder={placeholder}
          disabled={loading}
          className="flex-1 resize-none bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none disabled:opacity-60 max-h-28"
        />
      </div>
      <button
        onClick={submit}
        disabled={!text.trim() || loading}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shrink-0
          disabled:opacity-40 hover:bg-blue-700 active:scale-95 transition-all"
      >
        {loading ? <Spinner size={16} className="text-white" /> : <Send size={16} />}
      </button>
    </div>
  )
}
