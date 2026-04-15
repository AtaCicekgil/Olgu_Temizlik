// ─── Order Status Types ───────────────────────────────────────────────────────

export type OrderStatus =
  | 'alinan'      // Sipariş Alındı
  | 'yikamada'    // Yıkamada
  | 'kurutmada'   // Kurutmada
  | 'paketlendi'  // Paketlendi
  | 'hazir'       // Teslimata Hazır
  | 'teslim';     // Teslim Edildi

export type SearchState = 'idle' | 'loading' | 'found' | 'not_found';

// ─── Data Interfaces ──────────────────────────────────────────────────────────

export interface StatusUpdate {
  status: OrderStatus;
  timestamp: string; // ISO 8601
  note?: string;
}

export interface TrackingOrder {
  trackingCode: string;
  customerName: string;       // First name + last initial only (e.g. "Ahmet Y.")
  receivedAt: string;         // ISO 8601
  estimatedDelivery: string;  // ISO 8601 date
  currentStatus: OrderStatus;
  itemCount: number;
  itemDescriptions: string[];
  history: StatusUpdate[];
  latestNote?: string;
}

// ─── Step Metadata ────────────────────────────────────────────────────────────

export interface StepMeta {
  status: OrderStatus;
  label: string;
  shortLabel: string;
  description: string;
}

export const ORDER_STEPS: StepMeta[] = [
  {
    status: 'alinan',
    label: 'Sipariş Alındı',
    shortLabel: 'Alındı',
    description: 'Halınız teslim alındı ve sisteme kaydedildi.',
  },
  {
    status: 'yikamada',
    label: 'Yıkamada',
    shortLabel: 'Yıkama',
    description: 'Uzman ekibimiz halınızı özenle yıkıyor.',
  },
  {
    status: 'kurutmada',
    label: 'Kurutmada',
    shortLabel: 'Kurutma',
    description: 'Endüstriyel kurutucularda tam kurutma yapılıyor.',
  },
  {
    status: 'paketlendi',
    label: 'Paketlendi',
    shortLabel: 'Paketlendi',
    description: 'Halınız özenle paketlendi ve korumaya alındı.',
  },
  {
    status: 'hazir',
    label: 'Teslimata Hazır',
    shortLabel: 'Hazır',
    description: 'Halınız teslim için hazır, kurye çıkışı bekleniyor.',
  },
  {
    status: 'teslim',
    label: 'Teslim Edildi',
    shortLabel: 'Teslim',
    description: 'Halınız adresinize teslim edildi.',
  },
];

export function getStepIndex(status: OrderStatus): number {
  return ORDER_STEPS.findIndex((s) => s.status === status);
}
