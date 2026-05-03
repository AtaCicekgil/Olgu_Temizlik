import type { GTool } from '../engine/groq'
import { havaDurumuGetir } from '../lib/openmeteo'
import { sb } from '../lib/supabase'

const SEHIR = () => import.meta.env.VITE_ISLETME_SEHIR || 'Ankara'

export const havaTools: GTool[] = [
  { type:'function', function:{ name:'hava_durumu', description:'Şehrin hava durumu ve 4 günlük tahmin. Halı dağıtımı için yağış uyarısı içerir.', parameters:{ type:'object', properties:{ sehir:{type:'string'} } } } },
  { type:'function', function:{ name:'kuruma_tahmini', description:'Hava durumu ve halı cinsine göre tahmini kuruma süresi.', parameters:{ type:'object', properties:{ cins:{type:'string',description:'Halı cinsi (makine, yün, shaggy vb.)'}, sehir:{type:'string'} } } } },
  { type:'function', function:{ name:'dagitim_plani', description:'Hazır siparişler ve hava durumunu birleştirerek bugünkü dağıtım planı önerisi üretir.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'haftalik_planlama', description:'Bu haftanın sipariş durumu ve hava tahminine göre planlama önerisi üretir.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'yogun_gun_tahmini', description:'Geçmiş verilere bakarak bu haftanın yoğun günlerini tahmin eder.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'teslimat_rota_oneri', description:'Hazır siparişleri mahalle bazında gruplandırarak dağıtım sırası önerir.', parameters:{ type:'object', properties:{} } } },
]

// ── executors ─────────────────────────────────────────────────────────────────

async function hava_durumu(args: Record<string, unknown>) {
  const sehir = (args.sehir as string) || SEHIR()
  try {
    const data = await havaDurumuGetir(sehir)
    return { success: true, data }
  } catch (e) { return { success: false, error: String(e) } }
}

async function kuruma_tahmini(args: Record<string, unknown>) {
  const sehir = (args.sehir as string) || SEHIR()
  const cins  = String(args.cins || 'makine').toLowerCase()

  let hava
  try { hava = await havaDurumuGetir(sehir) } catch (e) { return { success: false, error: String(e) } }

  // Temel kuruma süresi (saat) cins bazlı
  const bazSure: Record<string, number> = { makine: 4, 'yün': 8, yun: 8, shaggy: 12, ipek: 10, koltuk: 6, perde: 3 }
  const baz = Object.entries(bazSure).find(([k]) => cins.includes(k))?.[1] || 5

  // Hava çarpanları
  let carpan = 1.0
  if (hava.nem > 70)          carpan += 0.5
  if (hava.nem > 85)          carpan += 0.5
  if (hava.sicaklik < 10)     carpan += 0.5
  if (hava.sicaklik > 25)     carpan -= 0.3
  if (hava.ruzgar > 20)       carpan -= 0.2
  if (hava.hali_uyari)        carpan += 1.0

  const tahmin = Math.round(baz * carpan)
  const gun    = tahmin > 24 ? `${Math.ceil(tahmin / 24)} gün` : `${tahmin} saat`

  return {
    success: true,
    data: { cins, sehir, tahmin_saat: tahmin, tahmin_metin: gun, hava_durumu: hava.durum, nem: hava.nem, sicaklik: hava.sicaklik },
    mesaj: `🧺 ${cins} halı için tahmini kuruma: **${gun}** (${hava.durum}, ${hava.sicaklik}°C, nem %${hava.nem})`,
  }
}

async function dagitim_plani() {
  const [hava, { data: hazirlar }] = await Promise.all([
    havaDurumuGetir(SEHIR()).catch(() => null),
    sb.from('np_siparisler').select('id,np_musteriler(ad,tel,adres_mahalle,adres_sokak)').eq('durum', 'hazir'),
  ])

  const yagisVar = hava?.hali_uyari || false
  const liste = (hazirlar || []).map((s: any) => ({
    siparis_id: s.id,
    musteri:    s.np_musteriler?.ad,
    mahalle:    s.np_musteriler?.adres_mahalle || '?',
    tel:        s.np_musteriler?.tel,
  }))

  // Mahallelere göre grupla
  const mahalleler: Record<string, typeof liste> = {}
  liste.forEach(s => { mahalleler[s.mahalle] = [...(mahalleler[s.mahalle] || []), s] })

  return {
    success: true,
    data: { hazir_sayi: liste.length, yagis_uyari: yagisVar, hava: hava ? `${hava.sicaklik}°C ${hava.durum}` : '?', mahalle_gruplari: mahalleler },
    mesaj: yagisVar ? '⚠️ Yağış uyarısı var — dağıtım öncesi kontrol edin!' : `✅ Dağıtıma uygun — ${liste.length} sipariş hazır`,
  }
}

async function haftalik_planlama() {
  const bugun = new Date()
  const pazartesi = new Date(bugun); pazartesi.setDate(bugun.getDate() - ((bugun.getDay() + 6) % 7))
  const pazar = new Date(pazartesi); pazar.setDate(pazartesi.getDate() + 6)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  const [hava, { data: siparisler }] = await Promise.all([
    havaDurumuGetir(SEHIR()).catch(() => null),
    sb.from('np_siparisler').select('durum,teslim_tarihi').gte('teslim_tarihi', fmt(pazartesi)).lte('teslim_tarihi', fmt(pazar)),
  ])

  const durumlar: Record<string, number> = {}
  ;(siparisler || []).forEach((s: any) => { durumlar[s.durum] = (durumlar[s.durum] || 0) + 1 })

  return {
    success: true,
    data: { hafta: { bas: fmt(pazartesi), bit: fmt(pazar) }, siparis_durumlar: durumlar, hava_tahmin: hava?.tahmin || [] },
  }
}

async function yogun_gun_tahmini() {
  const { data, error } = await sb.from('np_siparisler').select('tarih').not('tarih', 'is', null)
  if (error) return { success: false, error: error.message }

  const gunler = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi']
  const sayac: number[] = [0,0,0,0,0,0,0]
  ;(data || []).forEach((s: any) => { sayac[new Date(s.tarih).getDay()]++ })
  const result = sayac.map((s, i) => ({ gun: gunler[i], ortalama: s })).sort((a, b) => b.ortalama - a.ortalama)
  return { success: true, data: result, en_yogun: result[0]?.gun }
}

async function teslimat_rota_oneri() {
  const { data, error } = await sb.from('np_siparisler')
    .select('id,np_musteriler(ad,tel,adres_mahalle,adres_sokak,adres_bina,adres_daire)')
    .eq('durum', 'dagitimda')
  if (error) return { success: false, error: error.message }

  const mahalleler: Record<string, any[]> = {}
  ;(data || []).forEach((s: any) => {
    const m = s.np_musteriler?.adres_mahalle || 'Belirtilmemiş'
    mahalleler[m] = [...(mahalleler[m] || []), { siparis_id: s.id, musteri: s.np_musteriler?.ad, tel: s.np_musteriler?.tel, adres: [s.np_musteriler?.adres_sokak, s.np_musteriler?.adres_bina, s.np_musteriler?.adres_daire].filter(Boolean).join(' ') }]
  })

  return { success: true, data: mahalleler, toplam: data?.length || 0 }
}

export const havaExecutors: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  hava_durumu, kuruma_tahmini, dagitim_plani, haftalik_planlama, yogun_gun_tahmini, teslimat_rota_oneri,
}
