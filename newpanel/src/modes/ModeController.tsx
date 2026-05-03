import { AnimatePresence, motion } from 'framer-motion'
import { useModeStore } from '../store/mode.store'
import { AssistantMode } from './AssistantMode'
import { PanelMode } from './PanelMode'

export function ModeController() {
  const mode = useModeStore(s => s.mode)

  return (
    <AnimatePresence mode="wait">
      {mode === 'assistant' ? (
        <motion.div
          key="assistant"
          className="h-full w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <AssistantMode />
        </motion.div>
      ) : (
        <motion.div
          key="panel"
          className="h-full w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <PanelMode />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
