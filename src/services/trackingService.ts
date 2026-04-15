import { TrackingOrder } from '../types/tracking';

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Replace lookupOrder() with a real API call when backend is ready.
// All IDs follow format: OHY-YYYY-NNNNN

const MOCK_ORDERS: TrackingOrder[] = [
  {
    trackingCode: 'OHY-2025-00142',
    customerName: 'Ahmet Y.',
    receivedAt: '2025-04-10T09:30:00',
    estimatedDelivery: '2025-04-17',
    currentStatus: 'kurutmada',
    itemCount: 2,
    itemDescriptions: ['Salon halısı (3×4 m)', 'Koridor halısı (1×3 m)'],
    history: [
      {
        status: 'alinan',
        timestamp: '2025-04-10T09:30:00',
        note: 'Halılarınız teslim alındı, işlem başlatıldı.',
      },
      {
        status: 'yikamada',
        timestamp: '2025-04-11T14:00:00',
        note: 'Ön yıkama ve leke çıkarma işlemi başlatıldı.',
      },
      {
        status: 'kurutmada',
        timestamp: '2025-04-13T10:15:00',
        note: 'Yıkama tamamlandı, endüstriyel kurutmaya alındı.',
      },
    ],
    latestNote: 'Halılarınız kurutma aşamasında. Tahmini teslim: 17 Nisan.',
  },
  {
    trackingCode: 'OHY-2025-00089',
    customerName: 'Fatma K.',
    receivedAt: '2025-04-08T11:00:00',
    estimatedDelivery: '2025-04-14',
    currentStatus: 'teslim',
    itemCount: 3,
    itemDescriptions: [
      'Oturma odası halısı (4×5 m)',
      'Yatak odası halısı (2×3 m)',
      'Küçük dekoratif kilim',
    ],
    history: [
      {
        status: 'alinan',
        timestamp: '2025-04-08T11:00:00',
        note: 'Halılarınız teslim alındı.',
      },
      {
        status: 'yikamada',
        timestamp: '2025-04-09T09:00:00',
      },
      {
        status: 'kurutmada',
        timestamp: '2025-04-11T15:00:00',
      },
      {
        status: 'paketlendi',
        timestamp: '2025-04-13T11:30:00',
      },
      {
        status: 'hazir',
        timestamp: '2025-04-14T08:00:00',
        note: 'Teslimat için hazırlandı.',
      },
      {
        status: 'teslim',
        timestamp: '2025-04-14T16:30:00',
        note: 'Adresinize teslim edildi. Hizmetimizi seçtiğiniz için teşekkür ederiz.',
      },
    ],
    latestNote: 'Halılarınız başarıyla teslim edilmiştir. İyi günler dileriz.',
  },
  {
    trackingCode: 'OHY-2025-00211',
    customerName: 'Mehmet A.',
    receivedAt: '2025-04-14T14:00:00',
    estimatedDelivery: '2025-04-21',
    currentStatus: 'alinan',
    itemCount: 1,
    itemDescriptions: ['Salon halısı (2×3 m)'],
    history: [
      {
        status: 'alinan',
        timestamp: '2025-04-14T14:00:00',
        note: 'Halınız teslim alındı. Yıkama sırasına alındı.',
      },
    ],
    latestNote: 'Halınız teslim alındı, en kısa sürede yıkama sürecine başlanacaktır.',
  },
  {
    trackingCode: 'OHY-2025-00178',
    customerName: 'Zeynep T.',
    receivedAt: '2025-04-12T10:00:00',
    estimatedDelivery: '2025-04-19',
    currentStatus: 'hazir',
    itemCount: 4,
    itemDescriptions: [
      'Oturma odası halısı (3×4 m)',
      'Yatak odası 1 halısı (2×3 m)',
      'Yatak odası 2 halısı (2×3 m)',
      'Antre kilimi',
    ],
    history: [
      { status: 'alinan', timestamp: '2025-04-12T10:00:00', note: 'Tüm halılar teslim alındı.' },
      { status: 'yikamada', timestamp: '2025-04-13T09:00:00' },
      { status: 'kurutmada', timestamp: '2025-04-15T14:00:00' },
      { status: 'paketlendi', timestamp: '2025-04-16T11:00:00' },
      {
        status: 'hazir',
        timestamp: '2025-04-17T08:30:00',
        note: 'Halılarınız paketlendi ve teslimata hazır.',
      },
    ],
    latestNote: 'Halılarınız hazır! Teslimat için sizinle iletişime geçilecektir.',
  },
];

// ─── Service Function ─────────────────────────────────────────────────────────
// TODO: Replace with real API call:
// const res = await fetch(`/api/tracking/${code}`);
// return res.ok ? res.json() : null;

export async function lookupOrder(code: string): Promise<TrackingOrder | null> {
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500));

  const normalized = code
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');

  return (
    MOCK_ORDERS.find(
      (o) => o.trackingCode.toUpperCase().replace(/\s+/g, '') === normalized
    ) ?? null
  );
}
