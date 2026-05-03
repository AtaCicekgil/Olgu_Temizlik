import type { GTool } from '../engine/groq'
import { sb } from '../lib/supabase'

export const analizTools: GTool[] = [
  { type:'function', function:{ name:'rapor_getir', description:'Gelir, gider, kâr, sipariş sayısı özeti.', parameters:{ type:'object', properties:{ donem:{type:'string',enum:['bugun','bu_hafta','bu_ay','gecen_ay','bu_yil','tum']} }, required:['donem'] } } },
  { type:'function', function:{ name:'fabrika_durumu', description:'Şu an fabrikadaki siparişler ve toplam m2.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'odenmemis_listele', description:'Teslim edilmiş ama ödenmemiş siparişler.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'gunluk_ozet', description:'Bugün alınan, teslim edilen, ödenen ve fabrikadaki sipariş sayıları.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'gecikme_analizi', description:'Teslim tarihi geçmiş siparişler ve kaç gün geciktikleri.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'aylik_karsilastirma', description:'Bu ay ile geçen ayı gelir/gider/kâr olarak karşılaştırır.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'yillik_ozet', description:'Bu yılın 12 aylık gelir ve gider dökümü.', parameters:{ type:'object', properties:{ yil:{type:'number'} } } } },
  { type:'function', function:{ name:'kar_marji_analizi', description:'Hizmet tipine göre gelir ve kâr marjı analizi.', parameters:{ type:'object', properties:{ donem:{type:'string',enum:['bu_ay','gecen_ay','bu_yil','tum']} } } } },
  { type:'function', function:{ name:'hizmet_dagilimi', description:'Halı/koltuk/perde hizmet tiplerinin sipariş sayısı ve gelir dağılımı.', parameters:{ type:'object', properties:{ donem:{type:'string',enum:['bu_ay','bu_yil','tum']} } } } },
  { type:'function', function:{ name:'odeme_yontemi_analizi', description:'Nakit ve havale ödeme dağılımı ve tutarları.', parameters:{ type:'object', properties:{ donem:{type:'string',enum:['bu_ay','bu_yil','tum']} } } } },
  { type:'function', function:{ name:'ortalama_teslim_suresi', description:'Alındı ile teslim arasındaki ortalama gün sayısı.', parameters:{ type:'object', properties:{ donem:{type:'string',enum:['bu_ay','bu_yil','tum']} } } } },
  { type:'function', function:{ name:'en_verimli_gun', description:'En çok sipariş alınan ve en çok gelir elde edilen günler.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'musteri_sadakat_raporu', description:'En çok sipariş veren müşteriler sıralaması.', parameters:{ type:'object', properties:{ limit:{type:'number'} } } } },
  { type:'function', function:{ name:'bos_kapasite_analizi', description:'En az sipariş gelen aylar ve dönemler.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'aylik_hedef_takip', description:'Aylık gelir hedefine ne kadar ulaşıldı.', parameters:{ type:'object', properties:{ hedef:{type:'number',description:'Aylık hedef gelir (₺)'} }, required:['hedef'] } } },
]

// ── helpers ───────────────────────────────────────────────────────────────────

function donemAralik(donem: string): { bas: string; bit: string } {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`

  if (donem === 'bugun')     { const t = fmt(now); return { bas: t, bit: t } }
  if (donem === 'bu_hafta')  { const d = new Date(now); d.setDate(now.getDate()-((now.getDay()+6)%7)); return { bas: fmt(d), bit: fmt(now) } }
  if (donem === 'bu_ay')     { return { bas: `${now.getFullYear()}-${pad(now.getMonth()+1)}-01`, bit: fmt(now) } }
  if (donem === 'gecen_ay')  { const d = new Date(now.getFullYear(), now.getMonth()-1, 1); const son = new Date(now.getFullYear(), now.getMonth(), 0); return { bas: fmt(d), bit: fmt(son) } }
  if (donem === 'bu_yil')    { return { bas: `${now.getFullYear()}-01-01`, bit: fmt(now) } }
  return { bas: '2020-01-01', bit: fmt(now) }
}

// ── executors ─────────────────────────────────────────────────────────────────

async function rapor_getir(args: Record<string, unknown>) {
  const { bas, bit } = donemAralik(args.donem as string)
  const [{ data: siparisler }, { data: giderler }] = await Promise.all([
    sb.from('np_siparisler').select('id,odendi,odeme_tarih,odeme_yontemi,np_siparis_kalemleri(toplam)').gte('odeme_tarih', bas).lte('odeme_tarih', bit),
    sb.from('np_giderler').select('tutar,kategori').gte('tarih', bas).lte('tarih', bit),
  ])
  const odenenler = (siparisler || []).filter((s: any) => s.odendi)
  const gelir = odenenler.reduce((sum: number, s: any) => sum + (s.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0), 0)
  const giderToplam = (giderler || []).reduce((s: number, g: any) => s + (g.tutar || 0), 0)
  const giderKategori: Record<string, number> = {}
  ;(giderler || []).forEach((g: any) => { giderKategori[g.kategori] = (giderKategori[g.kategori] || 0) + g.tutar })
  return { success: true, data: { donem: args.donem, aralik: { bas, bit }, gelir, gider: giderToplam, kar: gelir - giderToplam, siparis_sayisi: odenenler.length, gider_dagilim: giderKategori } }
}

async function fabrika_durumu() {
  const { data, error } = await sb.from('np_siparisler')
    .select('durum, np_musteriler(ad), np_siparis_kalemleri(adet,m2,m2_sonra)')
    .in('durum', ['alindi','yikanıyor','hazir','dagitimda'])
  if (error) return { success: false, error: error.message }
  const ozet: Record<string, number> = { alindi: 0, 'yikanıyor': 0, hazir: 0, dagitimda: 0 }
  let toplamM2 = 0, eksikM2Siparis = 0
  ;(data || []).forEach((s: any) => {
    ozet[s.durum] = (ozet[s.durum] || 0) + 1
    const hasEksik = s.np_siparis_kalemleri.some((k: any) => k.m2_sonra || !k.m2)
    if (hasEksik) eksikM2Siparis++
    s.np_siparis_kalemleri.forEach((k: any) => { toplamM2 += (k.m2 || 0) })
  })
  return { success: true, data: { toplam: data?.length || 0, ozet, toplamM2: toplamM2.toFixed(1), eksikM2Siparis, siparisler: data } }
}

async function odenmemis_listele() {
  const { data, error } = await sb.from('np_siparisler')
    .select('id,tarih,teslim_tarihi,np_musteriler(ad,tel),np_siparis_kalemleri(toplam)')
    .eq('durum', 'teslim').eq('odendi', false)
  if (error) return { success: false, error: error.message }
  const liste = (data || []).map((s: any) => ({ ...s, toplam: (s.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0) }))
  const genelToplam = liste.reduce((s: number, x: any) => s + x.toplam, 0)
  return { success: true, data: liste, count: liste.length, genelToplam }
}

async function gunluk_ozet() {
  const bugun = new Date().toISOString().slice(0, 10)
  const { data, error } = await sb.from('np_siparisler').select('durum,tarih,odendi,odeme_tarih,np_siparis_kalemleri(toplam)')
  if (error) return { success: false, error: error.message }
  const list = data || []
  const bugunAlindi  = list.filter((s: any) => s.tarih === bugun && s.durum !== 'alinacak').length
  const bugunTeslim  = list.filter((s: any) => s.teslim_tarihi === bugun && s.durum === 'teslim').length
  const bugunOdenen  = list.filter((s: any) => s.odeme_tarih === bugun && s.odendi).length
  const fabrika      = list.filter((s: any) => ['alindi','yikanıyor','hazir','dagitimda'].includes(s.durum)).length
  const bugunGelir   = list.filter((s: any) => s.odeme_tarih === bugun && s.odendi)
    .reduce((s: number, sp: any) => s + (sp.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0), 0)
  return { success: true, data: { bugun, alindi: bugunAlindi, teslim: bugunTeslim, odenen: bugunOdenen, bugun_gelir: bugunGelir, fabrikadaki: fabrika } }
}

async function gecikme_analizi() {
  const bugun = new Date().toISOString().slice(0, 10)
  const { data, error } = await sb.from('np_siparisler')
    .select('id,durum,teslim_tarihi,np_musteriler(ad,tel),np_siparis_kalemleri(toplam)')
    .not('durum', 'eq', 'teslim').not('teslim_tarihi', 'is', null).lt('teslim_tarihi', bugun)
  if (error) return { success: false, error: error.message }
  const liste = (data || []).map((s: any) => {
    const gun = Math.floor((new Date(bugun).getTime() - new Date(s.teslim_tarihi).getTime()) / 86400000)
    return { ...s, gecikme_gun: gun }
  }).sort((a: any, b: any) => b.gecikme_gun - a.gecikme_gun)
  return { success: true, data: liste, count: liste.length }
}

async function aylik_karsilastirma() {
  const [buAy, gecenAy] = [donemAralik('bu_ay'), donemAralik('gecen_ay')]

  async function hesapla(bas: string, bit: string) {
    const [{ data: s }, { data: g }] = await Promise.all([
      sb.from('np_siparisler').select('odendi,np_siparis_kalemleri(toplam)').gte('odeme_tarih', bas).lte('odeme_tarih', bit),
      sb.from('np_giderler').select('tutar').gte('tarih', bas).lte('tarih', bit),
    ])
    const gelir = (s || []).filter((x: any) => x.odendi).reduce((sum: number, x: any) =>
      sum + (x.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0), 0)
    const gider = (g || []).reduce((sum: number, x: any) => sum + (x.tutar || 0), 0)
    return { gelir, gider, kar: gelir - gider }
  }

  const [bu, gecen] = await Promise.all([hesapla(buAy.bas, buAy.bit), hesapla(gecenAy.bas, gecenAy.bit)])
  const fark = { gelir: bu.gelir - gecen.gelir, gider: bu.gider - gecen.gider, kar: bu.kar - gecen.kar }
  return { success: true, data: { bu_ay: bu, gecen_ay: gecen, fark } }
}

async function yillik_ozet(args: Record<string, unknown>) {
  const yil = (args.yil as number) || new Date().getFullYear()
  const aylar = []
  for (let ay = 1; ay <= 12; ay++) {
    const pad = (n: number) => String(n).padStart(2, '0')
    const bas = `${yil}-${pad(ay)}-01`
    const bit = `${yil}-${pad(ay)}-${new Date(yil, ay, 0).getDate()}`
    const [{ data: s }, { data: g }] = await Promise.all([
      sb.from('np_siparisler').select('odendi,np_siparis_kalemleri(toplam)').gte('odeme_tarih', bas).lte('odeme_tarih', bit),
      sb.from('np_giderler').select('tutar').gte('tarih', bas).lte('tarih', bit),
    ])
    const gelir = (s || []).filter((x: any) => x.odendi).reduce((sum: number, x: any) =>
      sum + (x.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0), 0)
    const gider = (g || []).reduce((sum: number, x: any) => sum + (x.tutar || 0), 0)
    aylar.push({ ay, bas, bit, gelir, gider, kar: gelir - gider })
  }
  return { success: true, data: aylar, yil }
}

async function kar_marji_analizi(args: Record<string, unknown>) {
  const { bas, bit } = donemAralik((args.donem as string) || 'bu_ay')
  const { data, error } = await sb.from('np_siparisler')
    .select('servis_tip,odendi,np_siparis_kalemleri(toplam)').gte('odeme_tarih', bas).lte('odeme_tarih', bit)
  if (error) return { success: false, error: error.message }

  const ozet: Record<string, { sayi: number; gelir: number }> = {}
  ;(data || []).filter((s: any) => s.odendi).forEach((s: any) => {
    const tip = s.servis_tip || 'hali'
    if (!ozet[tip]) ozet[tip] = { sayi: 0, gelir: 0 }
    ozet[tip].sayi++
    ozet[tip].gelir += (s.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0)
  })
  return { success: true, data: ozet }
}

async function hizmet_dagilimi(args: Record<string, unknown>) {
  const { bas, bit } = donemAralik((args.donem as string) || 'bu_ay')
  const { data, error } = await sb.from('np_siparisler')
    .select('servis_tip,np_siparis_kalemleri(toplam)').gte('tarih', bas).lte('tarih', bit)
  if (error) return { success: false, error: error.message }

  const ozet: Record<string, { sayi: number; gelir: number }> = {}
  ;(data || []).forEach((s: any) => {
    const tip = s.servis_tip || 'hali'
    if (!ozet[tip]) ozet[tip] = { sayi: 0, gelir: 0 }
    ozet[tip].sayi++
    ozet[tip].gelir += (s.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0)
  })
  return { success: true, data: ozet }
}

async function odeme_yontemi_analizi(args: Record<string, unknown>) {
  const { bas, bit } = donemAralik((args.donem as string) || 'bu_ay')
  const { data, error } = await sb.from('np_siparisler')
    .select('odeme_yontemi,np_siparis_kalemleri(toplam)').eq('odendi', true).gte('odeme_tarih', bas).lte('odeme_tarih', bit)
  if (error) return { success: false, error: error.message }

  const ozet: Record<string, { sayi: number; tutar: number }> = {}
  ;(data || []).forEach((s: any) => {
    const yon = s.odeme_yontemi || 'bilinmiyor'
    if (!ozet[yon]) ozet[yon] = { sayi: 0, tutar: 0 }
    ozet[yon].sayi++
    ozet[yon].tutar += (s.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0)
  })
  return { success: true, data: ozet }
}

async function ortalama_teslim_suresi(args: Record<string, unknown>) {
  const { bas, bit } = donemAralik((args.donem as string) || 'bu_ay')
  const { data, error } = await sb.from('np_siparisler')
    .select('tarih,teslim_tarihi').eq('durum', 'teslim').not('tarih', 'is', null).not('teslim_tarihi', 'is', null).gte('tarih', bas).lte('tarih', bit)
  if (error) return { success: false, error: error.message }

  const sureler = (data || []).map((s: any) =>
    (new Date(s.teslim_tarihi).getTime() - new Date(s.tarih).getTime()) / 86400000
  ).filter((g: number) => g >= 0)

  const ort = sureler.length ? (sureler.reduce((a: number, b: number) => a + b, 0) / sureler.length).toFixed(1) : null
  return { success: true, data: { ortalama_gun: ort, olcum_sayisi: sureler.length } }
}

async function en_verimli_gun() {
  const { data, error } = await sb.from('np_siparisler')
    .select('tarih,odendi,np_siparis_kalemleri(toplam)').not('tarih', 'is', null)
  if (error) return { success: false, error: error.message }

  const gunler = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi']
  const sayac: Record<number, { sayi: number; gelir: number }> = {}
  ;(data || []).forEach((s: any) => {
    const gun = new Date(s.tarih).getDay()
    if (!sayac[gun]) sayac[gun] = { sayi: 0, gelir: 0 }
    sayac[gun].sayi++
    if (s.odendi) sayac[gun].gelir += (s.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0)
  })

  const result = Object.entries(sayac).map(([g, v]) => ({ gun: gunler[Number(g)], ...v })).sort((a, b) => b.sayi - a.sayi)
  return { success: true, data: result }
}

async function musteri_sadakat_raporu(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_siparisler').select('musteri_id,np_musteriler(ad),np_siparis_kalemleri(toplam)')
  if (error) return { success: false, error: error.message }

  const sayac: Record<number, { ad: string; sayi: number; toplam: number }> = {}
  ;(data || []).forEach((s: any) => {
    const id = s.musteri_id
    if (!sayac[id]) sayac[id] = { ad: s.np_musteriler?.ad || '?', sayi: 0, toplam: 0 }
    sayac[id].sayi++
    sayac[id].toplam += (s.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0)
  })

  const sorted = Object.entries(sayac)
    .map(([id, v]) => ({ musteri_id: Number(id), ...v }))
    .sort((a, b) => b.sayi - a.sayi)
    .slice(0, (args.limit as number) || 10)

  return { success: true, data: sorted }
}

async function bos_kapasite_analizi() {
  const { data, error } = await sb.from('np_siparisler').select('tarih').not('tarih', 'is', null)
  if (error) return { success: false, error: error.message }

  const aylar: Record<string, number> = {}
  ;(data || []).forEach((s: any) => {
    const ay = String(s.tarih).slice(0, 7)
    aylar[ay] = (aylar[ay] || 0) + 1
  })
  const sorted = Object.entries(aylar).map(([ay, sayi]) => ({ ay, siparis_sayisi: sayi })).sort((a, b) => a.siparis_sayisi - b.siparis_sayisi)
  return { success: true, data: sorted, en_bos: sorted.slice(0, 3) }
}

async function aylik_hedef_takip(args: Record<string, unknown>) {
  const hedef = args.hedef as number
  const { bas, bit } = donemAralik('bu_ay')
  const { data, error } = await sb.from('np_siparisler')
    .select('odendi,np_siparis_kalemleri(toplam)').gte('odeme_tarih', bas).lte('odeme_tarih', bit)
  if (error) return { success: false, error: error.message }

  const gerceklesen = (data || []).filter((s: any) => s.odendi).reduce((sum: number, s: any) =>
    sum + (s.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0), 0)
  const yuzde = Math.min(100, Math.round((gerceklesen / hedef) * 100))
  const kalan = Math.max(0, hedef - gerceklesen)
  return { success: true, data: { hedef, gerceklesen, kalan, yuzde, tamamlandi: gerceklesen >= hedef } }
}

export const analizExecutors: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  rapor_getir, fabrika_durumu, odenmemis_listele, gunluk_ozet, gecikme_analizi,
  aylik_karsilastirma, yillik_ozet, kar_marji_analizi, hizmet_dagilimi,
  odeme_yontemi_analizi, ortalama_teslim_suresi, en_verimli_gun,
  musteri_sadakat_raporu, bos_kapasite_analizi, aylik_hedef_takip,
}
