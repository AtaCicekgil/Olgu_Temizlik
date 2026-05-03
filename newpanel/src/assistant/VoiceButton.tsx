import { useState, useRef, useCallback } from 'react'
import { Mic, MicOff } from 'lucide-react'

interface Props {
  onResult: (text: string) => void
  disabled?: boolean
}

// Extend window type for webkit prefixed speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}

export function VoiceButton({ onResult, disabled }: Props) {
  const [listening, setListening] = useState(false)
  const recRef = useRef<SpeechRecognition | null>(null)

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition

  const toggle = useCallback(() => {
    if (!SpeechRec) return

    if (listening) {
      recRef.current?.stop()
      setListening(false)
      return
    }

    const rec = new SpeechRec()
    rec.lang = 'tr-TR'
    rec.interimResults = false
    rec.maxAlternatives = 1

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript.trim()
      if (text) onResult(text)
    }
    rec.onerror  = () => setListening(false)
    rec.onend    = () => setListening(false)

    rec.start()
    recRef.current = rec
    setListening(true)
  }, [SpeechRec, listening, onResult])

  if (!SpeechRec) return null

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors shrink-0
        ${listening
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40'
        }`}
      title={listening ? 'Dinlemeyi durdur' : 'Sesli komut'}
    >
      {listening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  )
}
