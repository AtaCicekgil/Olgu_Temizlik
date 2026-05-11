import { sb } from '../lib/supabase'
import { fmtTL, fmtTarihKisa } from '../lib/utils'
import type { ResultCard } from '../types/tools'

export interface CommandResult {
  reply: string
  card?: ResultCard
}

// Türkçe normalize (eşleşme kolaylığı için)
function norm(s: string) {
  return s.toLowerCase()
    .replace(/ı/g, 'i').replace(/ü/g, 'u').replace(/ö/g, 'o')
    .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    .replace(/İ/g, 'i').replace(/Ü/g, 'u').replace(/Ö/g, 'o')
    .replace(/Ş/g, 's').replace(/Ç/g, 'c').replace(/Ğ/g, 'g')
}

// Sipariş ID çıkar: #42, S42, s42, sipariş 42, no 42
function extractId(text: string): number | null {
  const m = text.match(/(?:#|[Ss])(\d+)\b/) || text.match(/\b(\d{1,5})\b/)
  return m ? parseInt(m[1]) : null
}

// Durum keyword → DB değeri
const DURUM_MAP: Record<string, string> = {
  'alindi': 'alindi', 'alindi geç': 'alindi', 'alindi gec': 'alindi',
  'yikamaya': 'yikanıyor', 'yikanıyor': 'yikanıyor', 'yikaniyor': 'yikanıyor',
  'hazir': 'hazir', 'hazır': 'hazir',
  'dagitima': 'dagitimda', 'dagitimda': 'dagitimda', 'dağıtıma': 'dagitimda',
  'teslim': 'teslim', 'teslim et': 'teslim', 'teslim edildi': 'teslim',
}

const DURUM_LABEL: Record<string, string> = {
  alindi: 'Alındı', 'yikanıyor': 'Yıkamada', hazir: 'Hazır',
  dagitimda: 'Dağıtımda', teslim: 'Teslim',
}

// ── Ana router ────────────────────────────────────────────────────────────────

export async function tryCommand(text: string): Promise<CommandResult | null> {
  const n = norm(text.trim())

  // ── 1. Durum güncelleme: "#42 teslim", "S42 yıkamaya" ──────────────────────
  const durumEntry = Object.entries(DURUM_MAP).find(([kw]) => n.includes(kw))
  if (durumEntry) {
    const id = extractId(text)
    if (id) {
      const [, yeniDurum] = durumEntry
      const { error } = await sb.from('np_siparisler').update({ durum: yeniDurum }).eq('id', id)
      if (error) return { reply: `⚠️ Sipariş #${id} güncellenemedi: ${error.message}` }
      return { reply: `✅ Sipariş #${id} → **${DURUM_LABEL[yeniDurum] || yeniDurum}** olarak işaretlendi.` }
    }
  }

  // ── 2. Ödeme: "ödeme al #42", "#42 ödendi", "42 ödeme" ────────────────────
  if (n.includes('odeme') || n.includes('odendi') || n.includes('odensin')) {
    const id = extractId(text)
    if (id) {
      const yontem = n.includes('havale') ? 'havale' : 'nakit'
      const { error } = await sb.from('np_siparisler')
        .update({ odendi: true, odeme_yontemi: yontem })
        .eq('id', id)
      if (error) return { reply: `⚠️ Sipariş #${id} ödeme işlemi başarısız: ${error.message}` }
      return { reply: `✅ Sipariş #${id} ödenmiş olarak işaretlendi (${yontem}).` }
    }
  }

  // ── 3. Sipariş detay: "#42", "S42", "sipariş 42" ──────────────────────────
  if (/^[#Ss]?\d{1,5}$/.test(text.trim()) || n.match(/^siparis\s+\d+$/)) {
    const id = extractId(text)
    if (id) return siparisDetay(id)
  }

  // ── 4. Aktif siparişler ─────────────────────────────────────────────────────
  if (n.match(/aktif|devam|surecte|sure[cç]te/)) {
    return siparisList(['alinacak', 'alindi', 'yikanıyor', 'hazir', 'dagitimda'], 'Aktif Siparişler')
  }

  // ── 5. Bugün / alınacaklar ──────────────────────────────────────────────────
  if (n.match(/\bbugun\b|bugunki|alinacak/)) {
    const bugun = new Date().toISOString().slice(0, 10)
    return siparisList(['alinacak', 'alindi', 'yikanıyor', 'hazir', 'dagitimda'], 'Bugün', bugun)
  }

  // ── 6. Teslim edilenler ─────────────────────────────────────────────────────
  if (n.match(/teslim\s*(edilen|ler|edilmis)|teslimler/)) {
    return siparisList(['teslim'], 'Teslim Edilenler')
  }

  // ── 7. Ödenmemiş ───────────────────────────────────────────────────────────
  if (n.match(/odenmemis|odeme\s*bekleyen|tahsil/)) {
    return odenmemisListesi()
  }

  // ── 8. Hazırlar ─────────────────────────────────────────────────────────────
  if (n.match(/\bhazir(lar)?\b|\bhazirlar\b/)) {
    return siparisList(['hazir'], 'Hazır Siparişler')
  }

  // ── 9. Dağıtımdakiler ──────────────────────────────────────────────────────
  if (n.match(/dagitim|dagitimdaki/)) {
    return siparisList(['dagitimda'], 'Dağıtımdaki Siparişler')
  }

  // ── 10. Yıkamadakiler ──────────────────────────────────────────────────────
  if (n.match(/yikama(da)?|yikaniyor/)) {
    return siparisList(['yikanıyor'], 'Yıkamadaki Siparişler')
  }

  // ── 11. Müşteri ara ─────────────────────────────────────────────────────────
  const musteriAraMatch = n.match(/^(.+?)\s+(?:ara|bul|sorgula|musteri)$/) ||
                          n.match(/^(?:musteri|ara|bul)\s+(.+)$/)
  if (musteriAraMatch) {
    const sorgu = musteriAraMatch[1].trim()
    if (sorgu.length >= 2) return musteriAra(sorgu)
  }

  // ── 12. Telefon ile ara ─────────────────────────────────────────────────────
  if (/0[5][0-9]{9}/.test(text) || /\b5[0-9]{9}\b/.test(text)) {
    const tel = text.match(/0?([5][0-9]{9})/)?.[0] || ''
    if (tel) return musteriAra(tel)
  }

  // ── 13. Bugünkü / haftalık özet ─────────────────────────────────────────────
  if (n.match(/bugunki\s*ozet|gunluk\s*ozet|ozet\s*bugun|bugun\s*ozet/)) {
    return gunlukOzet()
  }
  if (n.match(/haftalik\s*ozet|bu\s*hafta/)) {
    return haftalikOzet()
  }

  // Eşleşme yok → LLM'e gönder
  return null
}

// ── Yardımcı sorgular ─────────────────────────────────────────────────────────

async function siparisList(
  durumlar: string[],
  baslik: string,
  tarihFiltre?: string
): Promise<CommandResult> {
  let q = sb.from('np_siparisler')
    .select('id, durum, tarih, teslim_tarihi, odendi, np_musteriler(ad, tel), np_siparis_kalemleri(toplam)')
    .in('durum', durumlar)
    .order('olusturma', { ascending: false })
    .limit(30)

  if (tarihFiltre) q = q.eq('tarih', tarihFiltre)

  const { data, error } = await q
  if (error) return { reply: `⚠️ Sorgu hatası: ${error.message}` }

  const liste = data || []
  if (liste.length === 0) return { reply: `📭 ${baslik}: kayıt yok.` }

  return {
    reply: `**${baslik}** — ${liste.length} sipariş`,
    card: { type: 'siparis_liste', data: liste, meta: { baslik } },
  }
}

async function odenmemisListesi(): Promise<CommandResult> {
  const { data, error } = await sb.from('np_siparisler')
    .select('id, durum, tarih, teslim_tarihi, np_musteriler(ad, tel), np_siparis_kalemleri(toplam)')
    .eq('durum', 'teslim')
    .eq('odendi', false)
    .order('teslim_tarihi', { ascending: true })
    .limit(30)

  if (error) return { reply: `⚠️ Sorgu hatası: ${error.message}` }
  const liste = data || []
  if (liste.length === 0) return { reply: '✅ Ödenmemiş sipariş yok.' }

  const toplam = liste.reduce((s: number, row: any) =>
    s + (row.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0), 0)

  return {
    reply: `**Ödenmemiş** — ${liste.length} sipariş · Toplam: ${fmtTL(toplam)}`,
    card: { type: 'siparis_liste', data: liste, meta: { baslik: 'Ödenmemiş Siparişler' } },
  }
}

async function siparisDetay(id: number): Promise<CommandResult> {
  const { data, error } = await sb.from('np_siparisler')
    .select('*, np_musteriler(*), np_siparis_kalemleri(*, np_cinsler(*))')
    .eq('id', id).single()
  if (error) return { reply: `⚠️ Sipariş #${id} bulunamadı.` }
  return {
    reply: `Sipariş #${id}`,
    card: { type: 'siparis_detay', data },
  }
}

async function musteriAra(sorgu: string): Promise<CommandResult> {
  const { data, error } = await sb.from('np_musteriler').select('*').order('ad')
  if (error) return { reply: `⚠️ Sorgu hatası: ${error.message}` }

  const q = norm(sorgu)
  const sonuc = (data || []).filter((m: any) =>
    norm(m.ad).includes(q) || m.tel?.replace(/\s/g, '').includes(sorgu.replace(/\s/g, ''))
  )

  if (sonuc.length === 0) return { reply: `📭 "${sorgu}" ile eşleşen müşteri bulunamadı.` }
  if (sonuc.length === 1) {
    return {
      reply: `Müşteri bulundu: **${sonuc[0].ad}**`,
      card: { type: 'musteri_detay', data: sonuc[0] },
    }
  }
  return {
    reply: `"${sorgu}" için ${sonuc.length} müşteri bulundu`,
    card: { type: 'musteri_liste', data: sonuc },
  }
}

async function gunlukOzet(): Promise<CommandResult> {
  const bugun = new Date().toISOString().slice(0, 10)
  const { data, error } = await sb.from('np_siparisler')
    .select('id, durum, odendi, np_siparis_kalemleri(toplam)')
    .eq('tarih', bugun)

  if (error) return { reply: `⚠️ Sorgu hatası: ${error.message}` }
  const liste = data || []

  const toplamTutar = liste.reduce((s: number, row: any) =>
    s + (row.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0), 0)
  const odenen = liste.filter((r: any) => r.odendi).length

  const durumSayac: Record<string, number> = {}
  liste.forEach((r: any) => { durumSayac[r.durum] = (durumSayac[r.durum] || 0) + 1 })

  const durumStr = Object.entries(durumSayac)
    .map(([d, n]) => `${DURUM_LABEL[d] || d}: ${n}`)
    .join(' · ')

  const ozet = [
    `📅 **Bugünkü Özet** — ${fmtTarihKisa(bugun)}`,
    `📦 ${liste.length} sipariş${durumStr ? ` (${durumStr})` : ''}`,
    toplamTutar ? `💰 ${fmtTL(toplamTutar)} · ${odenen} ödendi` : '',
  ].filter(Boolean).join('\n')

  return { reply: ozet }
}

async function haftalikOzet(): Promise<CommandResult> {
  const now = new Date()
  const pzt = new Date(now)
  pzt.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  const bas = pzt.toISOString().slice(0, 10)
  const bit = now.toISOString().slice(0, 10)

  const { data, error } = await sb.from('np_siparisler')
    .select('id, durum, tarih, odendi, np_siparis_kalemleri(toplam)')
    .gte('tarih', bas).lte('tarih', bit)

  if (error) return { reply: `⚠️ Sorgu hatası: ${error.message}` }
  const liste = data || []

  const toplamTutar = liste.reduce((s: number, row: any) =>
    s + (row.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0), 0)
  const teslim = liste.filter((r: any) => r.durum === 'teslim').length

  return {
    reply: [
      `📅 **Bu Hafta** (${fmtTarihKisa(bas)} – ${fmtTarihKisa(bit)})`,
      `📦 ${liste.length} sipariş · ${teslim} teslim`,
      toplamTutar ? `💰 ${fmtTL(toplamTutar)}` : '',
    ].filter(Boolean).join('\n'),
  }
}
