export interface ToolResult {
  success: boolean
  data?:   unknown
  error?:  string
}

export interface ChatMessage {
  id:      string
  role:    'user' | 'assistant' | 'tool'
  content: string
  toolCalls?: ToolCall[]
  toolResults?: ToolResult[]
  card?:   ResultCard
  ts:      number
}

export interface ToolCall {
  id:       string
  name:     string
  args:     Record<string, unknown>
}

export type CardType =
  | 'siparis_liste'
  | 'siparis_detay'
  | 'musteri_liste'
  | 'musteri_detay'
  | 'gider_liste'
  | 'rapor'
  | 'basit'
  | 'onay'
  | 'yeni_siparis'

export interface ResultCard {
  type:  CardType
  data:  unknown
  meta?: Record<string, unknown>
}
