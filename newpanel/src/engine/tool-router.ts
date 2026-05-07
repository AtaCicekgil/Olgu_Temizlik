/**
 * Skor tabanlı, bağlam duyarlı tool seçici.
 *
 * Her mesajda tüm 111 tool yerine ilgili ~20-30 tool gönderilir.
 * - Kullanıcı mesajı   → 2x ağırlık
 * - Konuşma geçmişi    → 0.5x ağırlık (bağlam sürekliliği)
 * - En yüksek skorlu 3 kategori seçilir
 * - Temel tool'lar her zaman eklenir
 */

import type { GTool } from './groq'
import type { ChatMessage } from '../types/tools'
import { siparisTools  } from '../tools/siparis.tools'
import { musteriTools  } from '../tools/musteri.tools'
import { cinsTools     } from '../tools/cins.tools'
import { giderTools    } from '../tools/gider.tools'
import { analizTools   } from '../tools/analiz.tools'
import { smsTools      } from '../tools/sms.tools'
import { havaTools     } from '../tools/hava.tools'
import { takvimTools   } from '../tools/takvim.tools'
import { personelTools } from '../tools/personel.tools'
import { stokTools     } from '../tools/stok.tools'
import { ayarlarTools  } from '../tools/ayarlar.tools'

// ── Kategori tanımları ────────────────────────────────────────────────────────

interface CategoryDef {
  tools:    GTool[]
  keywords: string[]   // eşleşme için anahtar kelimeler
}

const CATEGORIES: Record<string, CategoryDef> = {
  siparis: {
    tools: siparisTools,
    keywords: [
      'sipariş', 'siparişler', 'siparış', 'siparış',
      'alındı', 'alindi', 'alinacak', 'teslim', 'durum',
      'ödeme', 'odeme', 'öde', 'ödendi', 'ödenmemiş',
      'kalem', 'indirim', 'ek ücret', 'ekücret',
      'yıkama', 'yıkanıyor', 'hazır', 'dağıtım',
      'kopyala', 'iptal', 'toplu',
    ],
  },
  musteri: {
    tools: musteriTools,
    keywords: [
      'müşteri', 'müşteriler', 'musteri', 'musteriler',
      'kişi', 'kisi', 'ad', 'isim', 'telefon', 'tel',
      'numara', 'adres', 'mahalle', 'sokak',
      'bireysel', 'kurumsal', 'sadakat', 'vip',
      'birleştir', 'gecikme', 'istatistik',
    ],
  },
  cins: {
    tools: cinsTools,
    keywords: [
      'cins', 'cinsler', 'ürün', 'ürünler',
      'halı', 'hali', 'koltuk', 'perde', 'yatak',
      'battaniye', 'yorgan', 'minder',
      'fiyat', 'birim fiyat', 'tip', 'popüler',
    ],
  },
  gider: {
    tools: giderTools,
    keywords: [
      'gider', 'giderler', 'masraf', 'harcama',
      'maaş', 'maas', 'yakıt', 'mazot', 'benzin',
      'kira', 'fatura', 'elektrik', 'su', 'doğalgaz',
      'ekle gider', 'gider sil', 'gider listele',
    ],
  },
  analiz: {
    tools: analizTools,
    keywords: [
      'rapor', 'analiz', 'özet', 'ozet',
      'gelir', 'kâr', 'kar', 'kazanç',
      'ayl', 'günlük', 'yıllık', 'haftalık',
      'istatistik', 'karşılaştır', 'hedef',
      'kapasite', 'verimli', 'en çok', 'toplam',
    ],
  },
  sms: {
    tools: smsTools,
    keywords: [
      'sms', 'mesaj', 'bildir', 'haber ver',
      'gönder', 'toplu sms', 'şablon',
      'hazır bildirimi', 'teslim bildirimi',
    ],
  },
  hava: {
    tools: havaTools,
    keywords: [
      'hava', 'hava durumu', 'yağmur', 'yağış',
      'kuruma', 'kurutur', 'tahmin', 'sıcaklık',
      'dağıtım planı', 'haftalık plan', 'nem',
    ],
  },
  takvim: {
    tools: takvimTools,
    keywords: [
      'takvim', 'hatırlatıcı', 'hatirlatici',
      'yaklaşan', 'yaklasan', 'randevu', 'plan',
      'boş gün', 'tarih', 'gecikme uyarı',
    ],
  },
  personel: {
    tools: personelTools,
    keywords: [
      'personel', 'çalışan', 'teknisyen',
      'ata', 'atama', 'performans',
      'işçi', 'ekip', 'sorumlu',
    ],
  },
  stok: {
    tools: stokTools,
    keywords: [
      'stok', 'malzeme', 'deterjan',
      'kimyasal', 'azaldı', 'bitti',
      'sipariş et', 'tedarik',
    ],
  },
  ayarlar: {
    tools: ayarlarTools,
    keywords: [
      'ayar', 'ayarlar', 'işletme',
      'çalışma saati', 'varsayılan teslim',
      'fiyat listesi', 'isletme bilgi',
    ],
  },
}

// Hiç eşleşme yoksa bu kategoriler fallback olarak kullanılır
const FALLBACK_CATS = ['siparis', 'musteri', 'analiz']

// Her zaman gönderilecek temel tool'lar (siparis_sorgula, musteri_sorgula)
const ALWAYS_ON_NAMES = new Set(['siparis_sorgula', 'musteri_sorgula', 'gunluk_ozet'])

// ── Skor hesaplama ────────────────────────────────────────────────────────────

function scoreText(text: string, keywords: string[]): number {
  const lower = text.toLowerCase()
  return keywords.reduce((score, kw) => {
    // Tam kelime eşleşmesi 2 puan, kısmi 1 puan
    const fullWord = new RegExp(`\\b${kw}\\b`, 'i')
    if (fullWord.test(lower))  return score + 2
    if (lower.includes(kw))    return score + 1
    return score
  }, 0)
}

// ── Ana router fonksiyonu ─────────────────────────────────────────────────────

export function selectTools(
  userMessage: string,
  history: ChatMessage[],
  maxTools = 32,
): GTool[] {
  // Geçmişten bağlam metni (son 4 mesaj, düşük ağırlık)
  const contextText = history
    .slice(-4)
    .map(m => m.content || '')
    .join(' ')

  // Her kategoriyi skorla
  const scores: [string, number][] = Object.entries(CATEGORIES).map(([cat, def]) => {
    const msgScore  = scoreText(userMessage, def.keywords) * 2    // mesaj öncelikli
    const ctxScore  = scoreText(contextText, def.keywords) * 0.5  // geçmiş yardımcı
    return [cat, msgScore + ctxScore]
  })

  // En yüksek skorlu kategorileri seç (en fazla 3, sıfır skor olanlar hariç)
  const topCats = scores
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat]) => cat)

  const selectedCats = topCats.length > 0 ? topCats : FALLBACK_CATS

  // Tool seti oluştur — önce always-on, sonra kategoriler
  const toolMap = new Map<string, GTool>()

  // Always-on tool'ları tüm kategorilerden topla
  for (const def of Object.values(CATEGORIES)) {
    for (const tool of def.tools) {
      if (ALWAYS_ON_NAMES.has(tool.function.name)) {
        toolMap.set(tool.function.name, tool)
      }
    }
  }

  // Seçili kategorilerin tool'larını ekle
  for (const cat of selectedCats) {
    for (const tool of CATEGORIES[cat].tools) {
      if (toolMap.size >= maxTools) break
      toolMap.set(tool.function.name, tool)
    }
  }

  return Array.from(toolMap.values())
}
