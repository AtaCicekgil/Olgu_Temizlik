import type { GTool } from '../engine/groq'
import { sb } from '../lib/supabase'

export const musteriTools: GTool[] = [
  { type:'function', function:{ name:'musteri_sorgula', description:'Müşteri listeler. Ad, tel, tip filtresi.', parameters:{ type:'object', properties:{ ad:{type:'string'}, tel:{type:'string'}, tip:{type:'string',enum:['bireysel','kurumsal']} } } } },
  { type:'function', function:{ name:'musteri_detay', description:'Müşteri bilgileri ve sipariş geçmişi.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'} }, required:['musteri_id'] } } },
  { type:'function', function:{ name:'musteri_ara', description:'Serbest metin ile müşteri ara (ad veya tel).', parameters:{ type:'object', properties:{ sorgu:{type:'string'} }, required:['sorgu'] } } },
  { type:'function', function:{ name:'musteri_olustur', description:'Yeni müşteri oluşturur.', parameters:{ type:'object', properties:{ ad:{type:'string'}, tel:{type:'string'}, tipi:{type:'string',enum:['bireysel','kurumsal']}, adres_mahalle:{type:'string'}, adres_sokak:{type:'string'}, adres_bina:{type:'string'}, adres_daire:{type:'string'}, notlar:{type:'string'} }, required:['ad'] } } },
  { type:'function', function:{ name:'musteri_ad_guncelle', description:'Müşteri adını değiştirir.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'}, ad:{type:'string'} }, required:['musteri_id','ad'] } } },
  { type:'function', function:{ name:'musteri_tel_guncelle', description:'Müşteri telefonunu değiştirir.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'}, tel:{type:'string'} }, required:['musteri_id','tel'] } } },
  { type:'function', function:{ name:'musteri_adres_guncelle', description:'Müşteri adresini günceller (4 alan).', parameters:{ type:'object', properties:{ musteri_id:{type:'number'}, adres_mahalle:{type:'string'}, adres_sokak:{type:'string'}, adres_bina:{type:'string'}, adres_daire:{type:'string'} }, required:['musteri_id'] } } },
  { type:'function', function:{ name:'musteri_tip_guncelle', description:'Müşteriyi bireysel/kurumsal olarak değiştirir.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'}, tipi:{type:'string',enum:['bireysel','kurumsal']} }, required:['musteri_id','tipi'] } } },
  { type:'function', function:{ name:'musteri_not_guncelle', description:'Müşteri notunu günceller.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'}, notlar:{type:'string'} }, required:['musteri_id'] } } },
  { type:'function', function:{ name:'musteri_sil', description:'Müşteriyi siler.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'} }, required:['musteri_id'] } } },
  { type:'function', function:{ name:'musteri_birles', description:'İki müşteriyi birleştirir. Tüm siparişler birinci müşteriye taşınır, ikinci silinir.', parameters:{ type:'object', properties:{ musteri_id_1:{type:'number'}, musteri_id_2:{type:'number'} }, required:['musteri_id_1','musteri_id_2'] } } },
  { type:'function', function:{ name:'musteri_istatistik', description:'Müşterinin toplam sipariş sayısı, harcama, ortalama tutar, ilk/son sipariş tarihi.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'} }, required:['musteri_id'] } } },
  { type:'function', function:{ name:'musteri_sadakat_seviyesi', description:'Müşteriyi sipariş sayısına göre sınıflandırır (VIP/Düzenli/Yeni).', parameters:{ type:'object', properties:{ musteri_id:{type:'number'} }, required:['musteri_id'] } } },
  { type:'function', function:{ name:'musteri_gecmis_siparisler', description:'Müşterinin geçmiş tüm siparişleri, özet bilgiyle.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'}, limit:{type:'number'} }, required:['musteri_id'] } } },
  { type:'function', function:{ name:'musteri_gecikme_gecmisi', description:'Müşteri daha önce ödeme geciktirdi mi? Gecikme sayısı ve ortalama gün.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'} }, required:['musteri_id'] } } },
]

// ── executors ─────────────────────────────────────────────────────────────────

async function musteri_sorgula(args: Record<string, unknown>) {
  let q = sb.from('np_musteriler').select('*').order('ad')
  if (args.tip) q = q.eq('tipi', args.tip)
  const { data, error } = await q
  if (error) return { success: false, error: error.message }
  let result = data || []
  if (args.ad)  result = result.filter((m: any) => m.ad.toLowerCase().includes(String(args.ad).toLowerCase()))
  if (args.tel) result = result.filter((m: any) => m.tel?.includes(args.tel))
  return { success: true, data: result, count: result.length }
}

async function musteri_detay(args: Record<string, unknown>) {
  const [{ data: musteri, error: mErr }, { data: siparisler }] = await Promise.all([
    sb.from('np_musteriler').select('*').eq('id', args.musteri_id).single(),
    sb.from('np_siparisler').select('id,durum,tarih,odendi,olusturma,np_siparis_kalemleri(toplam)').eq('musteri_id', args.musteri_id).order('olusturma', { ascending: false }),
  ])
  if (mErr) return { success: false, error: mErr.message }
  return { success: true, data: { ...musteri, siparisler: siparisler || [] } }
}

async function musteri_ara(args: Record<string, unknown>) {
  const sorgu = String(args.sorgu || '').toLowerCase()
  const { data, error } = await sb.from('np_musteriler').select('*').order('ad')
  if (error) return { success: false, error: error.message }
  const result = (data || []).filter((m: any) =>
    m.ad.toLowerCase().includes(sorgu) || m.tel?.includes(sorgu)
  )
  return { success: true, data: result, count: result.length }
}

async function musteri_olustur(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_musteriler').insert({
    ad: args.ad, tel: args.tel || null, tipi: args.tipi || 'bireysel',
    adres_mahalle: args.adres_mahalle || null, adres_sokak: args.adres_sokak || null,
    adres_bina: args.adres_bina || null, adres_daire: args.adres_daire || null,
    notlar: args.notlar || null,
  }).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data, mesaj: `✅ Müşteri oluşturuldu — ${data.ad} (ID: ${data.id})` }
}

async function musteri_alan_guncelle(id: unknown, fields: Record<string, unknown>) {
  const { error } = await sb.from('np_musteriler').update(fields).eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Müşteri #${id} güncellendi` }
}

async function musteri_ad_guncelle(args: Record<string, unknown>) { return musteri_alan_guncelle(args.musteri_id, { ad: args.ad }) }
async function musteri_tel_guncelle(args: Record<string, unknown>) { return musteri_alan_guncelle(args.musteri_id, { tel: args.tel }) }
async function musteri_tip_guncelle(args: Record<string, unknown>) { return musteri_alan_guncelle(args.musteri_id, { tipi: args.tipi }) }
async function musteri_not_guncelle(args: Record<string, unknown>) { return musteri_alan_guncelle(args.musteri_id, { notlar: args.notlar }) }

async function musteri_adres_guncelle(args: Record<string, unknown>) {
  const { musteri_id, ...fields } = args
  return musteri_alan_guncelle(musteri_id, fields)
}

async function musteri_sil(args: Record<string, unknown>) {
  const { error } = await sb.from('np_musteriler').delete().eq('id', args.musteri_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Müşteri #${args.musteri_id} silindi` }
}

async function musteri_birles(args: Record<string, unknown>) {
  const [m1, m2] = [args.musteri_id_1, args.musteri_id_2]
  const { error: sErr } = await sb.from('np_siparisler').update({ musteri_id: m1 }).eq('musteri_id', m2)
  if (sErr) return { success: false, error: sErr.message }
  const { error: dErr } = await sb.from('np_musteriler').delete().eq('id', m2)
  if (dErr) return { success: false, error: dErr.message }
  return { success: true, mesaj: `✅ Müşteri #${m2} → #${m1} ile birleştirildi` }
}

async function musteri_istatistik(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_siparisler')
    .select('id,tarih,olusturma,odendi,np_siparis_kalemleri(toplam)')
    .eq('musteri_id', args.musteri_id).order('olusturma', { ascending: true })
  if (error) return { success: false, error: error.message }

  const list = data || []
  const toplamTutar = list.reduce((s: number, s2: any) =>
    s + (s2.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0), 0)
  const odenen = list.filter((s: any) => s.odendi).length

  return {
    success: true,
    data: {
      toplam_siparis: list.length,
      odenen_siparis: odenen,
      toplam_tutar:   toplamTutar,
      ortalama_tutar: list.length ? Math.round(toplamTutar / list.length) : 0,
      ilk_siparis:    list[0]?.olusturma || null,
      son_siparis:    list[list.length - 1]?.olusturma || null,
    },
  }
}

async function musteri_sadakat_seviyesi(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_siparisler').select('id').eq('musteri_id', args.musteri_id)
  if (error) return { success: false, error: error.message }
  const sayi = data?.length || 0
  const seviye = sayi >= 10 ? 'VIP ⭐' : sayi >= 3 ? 'Düzenli 👍' : 'Yeni 🆕'
  return { success: true, data: { siparis_sayisi: sayi, seviye } }
}

async function musteri_gecmis_siparisler(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_siparisler')
    .select('id,durum,tarih,teslim_tarihi,odendi,odeme_yontemi,np_siparis_kalemleri(toplam)')
    .eq('musteri_id', args.musteri_id)
    .order('olusturma', { ascending: false })
    .limit((args.limit as number) || 20)
  if (error) return { success: false, error: error.message }
  return { success: true, data, count: data?.length }
}

async function musteri_gecikme_gecmisi(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_siparisler')
    .select('id,teslim_tarihi,odeme_tarih,odendi')
    .eq('musteri_id', args.musteri_id)
    .eq('durum', 'teslim')
  if (error) return { success: false, error: error.message }

  const list = data || []
  const gecikmeliOdeme = list.filter((s: any) => {
    if (!s.odeme_tarih || !s.teslim_tarihi) return false
    return new Date(s.odeme_tarih) > new Date(s.teslim_tarihi)
  })
  const ortGecikme = gecikmeliOdeme.length
    ? Math.round(gecikmeliOdeme.reduce((s: number, item: any) => {
        return s + (new Date(item.odeme_tarih).getTime() - new Date(item.teslim_tarihi).getTime()) / 86400000
      }, 0) / gecikmeliOdeme.length)
    : 0

  return {
    success: true,
    data: { toplam_teslim: list.length, gecikme_sayisi: gecikmeliOdeme.length, ortalama_gecikme_gun: ortGecikme },
    mesaj: gecikmeliOdeme.length ? `⚠️ ${gecikmeliOdeme.length} ödeme gecikmesi, ort. ${ortGecikme} gün` : '✅ Gecikme yok',
  }
}

export const musteriExecutors: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  musteri_sorgula, musteri_detay, musteri_ara, musteri_olustur,
  musteri_ad_guncelle, musteri_tel_guncelle, musteri_adres_guncelle,
  musteri_tip_guncelle, musteri_not_guncelle, musteri_sil, musteri_birles,
  musteri_istatistik, musteri_sadakat_seviyesi, musteri_gecmis_siparisler, musteri_gecikme_gecmisi,
}
