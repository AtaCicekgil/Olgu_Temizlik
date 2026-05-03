import { create } from 'zustand'
import type { ChatMessage } from '../types/tools'
import { uid } from '../lib/utils'

interface ChatStore {
  messages:    ChatMessage[]
  loading:     boolean
  addMessage:  (msg: Omit<ChatMessage, 'id' | 'ts'>) => ChatMessage
  setLoading:  (v: boolean) => void
  clearChat:   () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  loading:  false,

  addMessage: (msg) => {
    const full: ChatMessage = { ...msg, id: uid(), ts: Date.now() }
    set((s) => ({ messages: [...s.messages, full] }))
    return full
  },

  setLoading: (loading) => set({ loading }),

  clearChat: () => set({ messages: [] }),
}))
