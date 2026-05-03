import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export type ToastLevel = 'info' | 'success' | 'warn' | 'error'

export interface ToastMsg {
  id:    string
  text:  string
  level: ToastLevel
}

const bg: Record<ToastLevel, string> = {
  info:    'bg-blue-600',
  success: 'bg-green-600',
  warn:    'bg-amber-500',
  error:   'bg-red-600',
}

export function ToastItem({ msg, onClose }: { msg: ToastMsg; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm shadow-lg ${bg[msg.level]}`}>
      <span className="flex-1">{msg.text}</span>
      <button onClick={onClose} className="opacity-75 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  )
}

// ── Simple global toast store (no extra dep) ─────────────────────────────────
type Listener = (msgs: ToastMsg[]) => void
let _msgs: ToastMsg[] = []
const _listeners = new Set<Listener>()
const _notify = () => _listeners.forEach(l => l([..._msgs]))

export const toast = {
  show(text: string, level: ToastLevel = 'info') {
    const id = `t${Date.now()}`
    _msgs = [..._msgs, { id, text, level }]
    _notify()
    setTimeout(() => { _msgs = _msgs.filter(m => m.id !== id); _notify() }, 4500)
  },
  success: (t: string) => toast.show(t, 'success'),
  error:   (t: string) => toast.show(t, 'error'),
  warn:    (t: string) => toast.show(t, 'warn'),
}

export function ToastContainer() {
  const [msgs, setMsgs] = useState<ToastMsg[]>([])
  useEffect(() => {
    _listeners.add(setMsgs)
    return () => { _listeners.delete(setMsgs) }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {msgs.map(m => (
        <div key={m.id} className="pointer-events-auto">
          <ToastItem msg={m} onClose={() => {
            _msgs = _msgs.filter(x => x.id !== m.id); _notify()
          }} />
        </div>
      ))}
    </div>
  )
}
