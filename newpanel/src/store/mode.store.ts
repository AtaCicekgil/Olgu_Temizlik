import { create } from 'zustand'

type Mode = 'assistant' | 'panel'
type DrawerState = 'closed' | 'open'

interface ModeStore {
  mode:          Mode
  drawer:        DrawerState
  activeSection: string
  setMode:       (m: Mode) => void
  toggleMode:    () => void
  setDrawer:     (s: DrawerState) => void
  toggleDrawer:  () => void
  setSection:    (s: string) => void
}

export const useModeStore = create<ModeStore>((set, get) => ({
  mode:          'assistant',
  drawer:        'closed',
  activeSection: 'dashboard',

  setMode:    (mode) => set({ mode, drawer: 'closed' }),
  toggleMode: () => set((s) => ({ mode: s.mode === 'assistant' ? 'panel' : 'assistant', drawer: 'closed' })),
  setDrawer:  (drawer) => set({ drawer }),
  toggleDrawer: () => set((s) => ({ drawer: s.drawer === 'closed' ? 'open' : 'closed' })),
  setSection: (activeSection) => set({ activeSection }),
}))
