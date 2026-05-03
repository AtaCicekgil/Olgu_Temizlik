import { LayoutDashboard } from 'lucide-react'
import { AssistantShell } from '../assistant/AssistantShell'
import { useModeStore } from '../store/mode.store'

export function AssistantMode() {
  const setMode = useModeStore(s => s.setMode)

  return (
    <div className="flex flex-col h-full">
      {/* Switch to Panel button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setMode('panel')}
          className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-600
            px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          <LayoutDashboard size={13} />
          Panel
        </button>
      </div>

      <AssistantShell />
    </div>
  )
}
