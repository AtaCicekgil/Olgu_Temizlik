// SMS gönderme: sms: URI ile native uygulama açılır (ücretsiz, mobilde)
// Masaüstünde metni panoya kopyalar + toast gösterir

import { toast } from '../components/ui/Toast'

export interface SmsParams {
  tel:  string
  metin: string
}

export function smsSend({ tel, metin }: SmsParams): void {
  const temizTel = tel.replace(/\s/g, '')
  const uri = `sms:${temizTel}?body=${encodeURIComponent(metin)}`

  // Mobil: sms: URI native uygulamayı açar
  const a = document.createElement('a')
  a.href = uri
  a.click()

  // Masaüstü fallback: panoya kopyala
  if (navigator.clipboard) {
    navigator.clipboard.writeText(metin).then(() => {
      toast.show(`📋 SMS metni kopyalandı — ${temizTel}`, 'info')
    })
  }
}

// ── Hazır SMS şablonları ──────────────────────────────────────────────────────

const ISLETME_AD  = () => import.meta.env.VITE_ISLETME_AD  || 'Olgu Temizlik'
const ISLETME_TEL = () => import.meta.env.VITE_ISLETME_TEL || ''

export const SMS_SABLONLAR = {
  alindi: (musteriAd: string) =>
    `Merhaba ${musteriAd}, halılarınız teslim alındı ve yıkamaya verildi. Bilgi için: ${ISLETME_TEL()} — ${ISLETME_AD()}`,

  hazir: (musteriAd: string) =>
    `Merhaba ${musteriAd}, halılarınız yıkandı ve teslimata hazır. En kısa sürede ulaştırılacaktır. — ${ISLETME_AD()}`,

  dagitimda: (musteriAd: string) =>
    `Merhaba ${musteriAd}, halılarınız yola çıktı, kısa süre içinde kapınızda olacak. — ${ISLETME_AD()}`,

  teslim: (musteriAd: string) =>
    `Merhaba ${musteriAd}, halılarınız teslim edilmiştir. Bizi tercih ettiğiniz için teşekkürler. — ${ISLETME_AD()}`,

  odeme_hatirlatma: (musteriAd: string, tutar: number) =>
    `Merhaba ${musteriAd}, ${tutar.toLocaleString('tr-TR')}₺ tutarındaki halı yıkama bedeli henüz ödenmemiştir. Bilgi için: ${ISLETME_TEL()} — ${ISLETME_AD()}`,

  ozel: (metin: string) => metin,
}

export type SmsKonu = keyof typeof SMS_SABLONLAR
