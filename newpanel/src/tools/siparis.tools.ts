import type { GTool } from '../engine/groq'
import { sb } from '../lib/supabase'
import { bugun } from '../lib/utils'

// AI bazen Türkçe karakterli veya beklenmedik değer gönderebilir — normalize et
function normServisTip(raw: unknown): 'hali' | 'koltuk' | 'perde' {
  const s = String(raw || '')
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ü/g, 'u').replace(/ö/g, 'o')
    .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
  if (s.includes('koltuk')) return 'koltuk'
  if (s.includes('perde'))  return 'perde'
  return 'hali'  // varsayılan
}

export const siparisTools: GTool[] = [
  { type:'function', function:{ name:'siparis_sorgula', description:'Siparişleri filtreler.', parameters:{ type:'object', properties:{ musteri_ad:{type:'string'}, tel:{type:'string'}, durum:{type:'string',enum:['alinacak','alindi','yikanıyor','hazir','dagitimda','teslim']}, tarih_bas:{type:'string'}, tarih_bit:{type:'string'}, odendi:{type:'boolean'}, limit:{type:'number'} } } } },
  { type:'function', function:{ name:'siparis_detay', description:'Siparişin tüm detayları: müşteri, kalemler, m2, fiyat, notlar.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'} }, required:['siparis_id'] } } },
  { type:'function', function:{ name:'siparis_ara', description:'Serbest metin ile sipariş ara (müşteri adı, tel veya id).', parameters:{ type:'object', properties:{ sorgu:{type:'string'} }, required:['sorgu'] } } },
  { type:'function', function:{ name:'siparis_gecmis', description:'Müşterinin tüm geçmiş siparişleri.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'} }, required:['musteri_id'] } } },
  { type:'function', function:{ name:'siparis_olustur', description:'Yeni sipariş oluşturur. ZORUNLU: musteri_id daha önce musteri_sorgula ile bulunmuş gerçek bir ID olmalı. Asla tahmin etme veya uydurma.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'}, adres_mahalle:{type:'string'}, adres_sokak:{type:'string'}, adres_bina:{type:'string'}, adres_daire:{type:'string'}, servis_tip:{type:'string',enum:['hali','koltuk','perde']}, teslim_tarihi:{type:'string'}, siparis_notu:{type:'string'} }, required:['musteri_id'] } } },
  { type:'function', function:{ name:'siparis_alindi_gec', description:'alinacak→alindi geçişi ve ürün girişi.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, kalemler:{type:'array',items:{type:'object',properties:{ cins_ad:{type:'string'}, adet:{type:'number'}, m2:{type:'number'}, m2_sonra:{type:'boolean'} },required:['cins_ad','adet']}} }, required:['siparis_id','kalemler'] } } },
  { type:'function', function:{ name:'siparis_durum_guncelle', description:'Sipariş durumunu günceller.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, yeni_durum:{type:'string',enum:['alindi','yikanıyor','hazir','dagitimda','teslim']} }, required:['siparis_id','yeni_durum'] } } },
  { type:'function', function:{ name:'siparis_toplu_durum', description:'Birden fazla siparişin durumunu aynı anda günceller.', parameters:{ type:'object', properties:{ siparis_idler:{type:'array',items:{type:'number'}}, yeni_durum:{type:'string',enum:['alindi','yikanıyor','hazir','dagitimda','teslim']} }, required:['siparis_idler','yeni_durum'] } } },
  { type:'function', function:{ name:'siparis_sil', description:'Siparişi siler.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'} }, required:['siparis_id'] } } },
  { type:'function', function:{ name:'siparis_kopyala', description:'Mevcut siparişi kopyalayarak aynı müşteri için yeni sipariş oluşturur.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, teslim_tarihi:{type:'string'} }, required:['siparis_id'] } } },
  { type:'function', function:{ name:'siparis_adres_guncelle', description:'Siparişin teslimat adresini günceller.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, adres_mahalle:{type:'string'}, adres_sokak:{type:'string'}, adres_bina:{type:'string'}, adres_daire:{type:'string'} }, required:['siparis_id'] } } },
  { type:'function', function:{ name:'siparis_teslim_tarihi_guncelle', description:'Teslim tarihini değiştirir.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, teslim_tarihi:{type:'string'} }, required:['siparis_id','teslim_tarihi'] } } },
  { type:'function', function:{ name:'siparis_servis_tip_guncelle', description:'Servis tipini değiştirir.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, servis_tip:{type:'string',enum:['hali','koltuk','perde']} }, required:['siparis_id','servis_tip'] } } },
  { type:'function', function:{ name:'siparis_not_ekle', description:'Siparişe not ekler/günceller.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, siparis_notu:{type:'string'} }, required:['siparis_id','siparis_notu'] } } },
  { type:'function', function:{ name:'siparis_kalem_ekle', description:'Mevcut siparişe yeni ürün/halı kalemi ekler.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, cins_ad:{type:'string'}, adet:{type:'number'}, m2:{type:'number'}, m2_sonra:{type:'boolean'} }, required:['siparis_id','cins_ad','adet'] } } },
  { type:'function', function:{ name:'siparis_kalem_sil', description:'Siparişten kalem çıkarır.', parameters:{ type:'object', properties:{ kalem_id:{type:'number'} }, required:['kalem_id'] } } },
  { type:'function', function:{ name:'siparis_kalem_adet_guncelle', description:'Kalem adetini değiştirir ve toplamı yeniden hesaplar.', parameters:{ type:'object', properties:{ kalem_id:{type:'number'}, adet:{type:'number'} }, required:['kalem_id','adet'] } } },
  { type:'function', function:{ name:'siparis_kalem_cins_guncelle', description:'Kalemin cinsini değiştirir ve fiyatı yeniden hesaplar.', parameters:{ type:'object', properties:{ kalem_id:{type:'number'}, cins_ad:{type:'string'} }, required:['kalem_id','cins_ad'] } } },
  { type:'function', function:{ name:'siparis_kalem_m2_guncelle', description:'Kalem m2 değerini günceller ve toplamı yeniden hesaplar.', parameters:{ type:'object', properties:{ kalem_id:{type:'number'}, m2:{type:'number'} }, required:['kalem_id','m2'] } } },
  { type:'function', function:{ name:'siparis_kalem_fiyat_guncelle', description:'Kaleme özel fiyat yazar (indirim veya zam).', parameters:{ type:'object', properties:{ kalem_id:{type:'number'}, ozel_fiyat:{type:'number'} }, required:['kalem_id','ozel_fiyat'] } } },
  { type:'function', function:{ name:'siparis_indirim_ekle', description:'Siparişe indirim uygular (tutar veya yüzde).', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, indirim_tutar:{type:'number'}, indirim_yuzde:{type:'number'} }, required:['siparis_id'] } } },
  { type:'function', function:{ name:'siparis_ek_ucret_ekle', description:'Siparişe ek ücret ekler (nakliye, leke, acele vb.).', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, ek_ucret:{type:'number'}, ek_ucret_aciklama:{type:'string'} }, required:['siparis_id','ek_ucret','ek_ucret_aciklama'] } } },
  { type:'function', function:{ name:'siparis_toplam_hesapla', description:'Siparişin güncel toplam tutarını hesaplar (indirim ve ek ücret dahil).', parameters:{ type:'object', properties:{ siparis_id:{type:'number'} }, required:['siparis_id'] } } },
  { type:'function', function:{ name:'siparis_odeme_al', description:'Siparişi ödenmiş olarak işaretler.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, odeme_yontemi:{type:'string',enum:['nakit','havale']} }, required:['siparis_id','odeme_yontemi'] } } },
  { type:'function', function:{ name:'siparis_odeme_iptal', description:'Ödemeyi geri alır (yanlış işaretleme düzeltme).', parameters:{ type:'object', properties:{ siparis_id:{type:'number'} }, required:['siparis_id'] } } },
]

// ── helpers ───────────────────────────────────────────────────────────────────

async function getCins() {
  const { data } = await sb.from('np_cinsler').select('*').eq('aktif', true)
  return data || []
}

function calcKalemToplam(cins: any, m2: number | null, adet: number, ozelFiyat?: number | null) {
  const fiyat = ozelFiyat ?? cins?.fiyat ?? 0
  if (!fiyat) return null
  if (cins?.fiyat_tip === 'sabit') return fiyat * adet
  return m2 ? fiyat * m2 * adet : null
}

// ── executors ─────────────────────────────────────────────────────────────────

async function siparis_sorgula(args: Record<string, unknown>) {
  let q = sb.from('np_siparisler')
    .select('*, np_musteriler(id,ad,tel), np_siparis_kalemleri(*)')
    .order('olusturma', { ascending: false })
    .limit((args.limit as number) || 20)

  if (args.durum)     q = q.eq('durum', args.durum)
  if (args.tarih_bas) q = q.gte('tarih', args.tarih_bas)
  if (args.tarih_bit) q = q.lte('tarih', args.tarih_bit)
  if (typeof args.odendi === 'boolean') q = q.eq('odendi', args.odendi)

  const { data, error } = await q
  if (error) return { success: false, error: error.message }

  let result = data || []
  if (args.musteri_ad) {
    const ara = (args.musteri_ad as string).toLowerCase()
    result = result.filter((s: any) => s.np_musteriler?.ad?.toLowerCase().includes(ara))
  }
  if (args.tel) {
    result = result.filter((s: any) => s.np_musteriler?.tel?.includes(args.tel))
  }
  return { success: true, data: result, count: result.length }
}

async function siparis_detay(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_siparisler')
    .select('*, np_musteriler(*), np_siparis_kalemleri(*, np_cinsler(*))')
    .eq('id', args.siparis_id).single()
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

async function siparis_ara(args: Record<string, unknown>) {
  const sorgu = String(args.sorgu || '').toLowerCase()
  const isId  = /^\d+$/.test(sorgu.trim())

  let q = sb.from('np_siparisler')
    .select('*, np_musteriler(id,ad,tel), np_siparis_kalemleri(toplam)')
    .order('olusturma', { ascending: false }).limit(20)

  if (isId) q = q.eq('id', parseInt(sorgu))

  const { data, error } = await q
  if (error) return { success: false, error: error.message }

  let result = data || []
  if (!isId) {
    result = result.filter((s: any) =>
      s.np_musteriler?.ad?.toLowerCase().includes(sorgu) ||
      s.np_musteriler?.tel?.includes(sorgu)
    )
  }
  return { success: true, data: result, count: result.length }
}

async function siparis_gecmis(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_siparisler')
    .select('*, np_siparis_kalemleri(toplam)')
    .eq('musteri_id', args.musteri_id)
    .order('olusturma', { ascending: false })
  if (error) return { success: false, error: error.message }
  return { success: true, data, count: data?.length }
}

async function siparis_olustur(args: Record<string, unknown>) {
  const mid = Number(args.musteri_id)
  if (!mid || mid <= 0) {
    return {
      success: false,
      error: 'musteri_id geçersiz. ÖNCE: 1) müşteri adını kullanıcıdan al 2) telefon numarasını al 3) musteri_sorgula ile ID\'yi bul. Sonra siparis_olustur çağır.',
    }
  }
  if (args.adres_mahalle || args.adres_sokak) {
    await sb.from('np_musteriler').update({
      adres_mahalle: args.adres_mahalle || null,
      adres_sokak:   args.adres_sokak   || null,
      adres_bina:    args.adres_bina    || null,
      adres_daire:   args.adres_daire   || null,
    }).eq('id', args.musteri_id)
  }
  const { data, error } = await sb.from('np_siparisler').insert({
    musteri_id:    args.musteri_id,
    durum:         'alinacak',
    servis_tip:    normServisTip(args.servis_tip),
    tarih:         bugun(),
    teslim_tarihi: args.teslim_tarihi || null,
    siparis_notu:  args.siparis_notu  || null,
  }).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data, mesaj: `✅ Sipariş #${data.id} oluşturuldu` }
}

async function siparis_alindi_gec(args: Record<string, unknown>) {
  const id = args.siparis_id as number
  const kalemler = args.kalemler as Array<{ cins_ad: string; adet: number; m2?: number; m2_sonra?: boolean }>

  // Zaten kalem varsa tekrar ekleme (çift çağrım koruması)
  const { data: mevcutKalemler } = await sb.from('np_siparis_kalemleri').select('id').eq('siparis_id', id)
  if (mevcutKalemler && mevcutKalemler.length > 0) {
    return { success: false, error: `Sipariş #${id} zaten ${mevcutKalemler.length} kaleme sahip. Kalem eklemek için siparis_kalem_ekle kullan.` }
  }

  const cinsler = await getCins()

  const kalemRows = kalemler.map(k => {
    const cins = cinsler.find((c: any) => c.ad.toLowerCase().includes(k.cins_ad.toLowerCase()))
    const m2   = k.m2 || null
    const toplam = calcKalemToplam(cins, m2, k.adet || 1)
    return { siparis_id: id, cins_id: cins?.id || null, adet: k.adet || 1, m2, m2_sonra: k.m2_sonra || !k.m2, birim_fiyat: cins?.fiyat || null, toplam }
  })

  const [{ error: dErr }, { error: kErr }] = await Promise.all([
    sb.from('np_siparisler').update({ durum: 'alindi', tarih: bugun() }).eq('id', id),
    sb.from('np_siparis_kalemleri').insert(kalemRows),
  ])
  if (dErr || kErr) return { success: false, error: dErr?.message || kErr?.message }

  const eksik = kalemRows.filter(k => k.m2_sonra).length
  return { success: true, mesaj: `✅ Sipariş #${id} alındı — ${kalemRows.length} kalem` + (eksik ? ` · ⚠️ ${eksik} m2 eksik` : '') }
}

async function siparis_durum_guncelle(args: Record<string, unknown>) {
  const { error } = await sb.from('np_siparisler').update({ durum: args.yeni_durum }).eq('id', args.siparis_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Sipariş #${args.siparis_id} → ${args.yeni_durum}` }
}

async function siparis_toplu_durum(args: Record<string, unknown>) {
  const ids = args.siparis_idler as number[]
  const { error } = await sb.from('np_siparisler').update({ durum: args.yeni_durum }).in('id', ids)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ ${ids.length} sipariş → ${args.yeni_durum}` }
}

async function siparis_sil(args: Record<string, unknown>) {
  const { error } = await sb.from('np_siparisler').delete().eq('id', args.siparis_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Sipariş #${args.siparis_id} silindi` }
}

async function siparis_kopyala(args: Record<string, unknown>) {
  const { data: eski, error: sErr } = await sb.from('np_siparisler')
    .select('*, np_siparis_kalemleri(*)').eq('id', args.siparis_id).single()
  if (sErr) return { success: false, error: sErr.message }

  const { data: yeni, error: nErr } = await sb.from('np_siparisler').insert({
    musteri_id:    eski.musteri_id,
    durum:         'alinacak',
    servis_tip:    eski.servis_tip,
    tarih:         bugun(),
    teslim_tarihi: args.teslim_tarihi || null,
    olusturma:     new Date().toISOString(),
  }).select().single()
  if (nErr) return { success: false, error: nErr.message }
  return { success: true, data: yeni, mesaj: `✅ Sipariş kopyalandı → #${yeni.id}` }
}

async function siparis_adres_guncelle(args: Record<string, unknown>) {
  const { siparis_id, ...fields } = args
  const { error } = await sb.from('np_siparisler').update(fields).eq('id', siparis_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Sipariş #${siparis_id} adresi güncellendi` }
}

async function siparis_teslim_tarihi_guncelle(args: Record<string, unknown>) {
  const { error } = await sb.from('np_siparisler').update({ teslim_tarihi: args.teslim_tarihi }).eq('id', args.siparis_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Teslim tarihi güncellendi — ${args.teslim_tarihi}` }
}

async function siparis_servis_tip_guncelle(args: Record<string, unknown>) {
  const { error } = await sb.from('np_siparisler').update({ servis_tip: args.servis_tip }).eq('id', args.siparis_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Servis tipi → ${args.servis_tip}` }
}

async function siparis_not_ekle(args: Record<string, unknown>) {
  const { error } = await sb.from('np_siparisler').update({ siparis_notu: args.siparis_notu }).eq('id', args.siparis_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: '✅ Not güncellendi' }
}

async function siparis_kalem_ekle(args: Record<string, unknown>) {
  const cinsler = await getCins()
  const cins = cinsler.find((c: any) => c.ad.toLowerCase().includes(String(args.cins_ad).toLowerCase()))
  const m2   = (args.m2 as number) || null
  const adet = (args.adet as number) || 1
  const toplam = calcKalemToplam(cins, m2, adet)

  const { data, error } = await sb.from('np_siparis_kalemleri').insert({
    siparis_id:  args.siparis_id,
    cins_id:     cins?.id || null,
    adet, m2,
    m2_sonra:    args.m2_sonra || !m2,
    birim_fiyat: cins?.fiyat || null,
    toplam,
  }).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data, mesaj: `✅ Kalem eklendi — ${args.cins_ad}` }
}

async function siparis_kalem_sil(args: Record<string, unknown>) {
  const { error } = await sb.from('np_siparis_kalemleri').delete().eq('id', args.kalem_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Kalem #${args.kalem_id} silindi` }
}

async function siparis_kalem_adet_guncelle(args: Record<string, unknown>) {
  const { data: kalem, error: kErr } = await sb.from('np_siparis_kalemleri')
    .select('*, np_cinsler(*)').eq('id', args.kalem_id).single()
  if (kErr) return { success: false, error: kErr.message }

  const adet   = args.adet as number
  const fiyat  = kalem.ozel_fiyat || kalem.birim_fiyat || kalem.np_cinsler?.fiyat || 0
  const toplam = calcKalemToplam(kalem.np_cinsler, kalem.m2, adet, kalem.ozel_fiyat || kalem.birim_fiyat)

  const { error } = await sb.from('np_siparis_kalemleri').update({ adet, toplam }).eq('id', args.kalem_id)
  if (error) return { success: false, error: error.message }
  void fiyat
  return { success: true, mesaj: `✅ Adet → ${adet} · Toplam: ₺${toplam?.toLocaleString('tr-TR') || '?'}` }
}

async function siparis_kalem_cins_guncelle(args: Record<string, unknown>) {
  const cinsler = await getCins()
  const cins = cinsler.find((c: any) => c.ad.toLowerCase().includes(String(args.cins_ad).toLowerCase()))
  if (!cins) return { success: false, error: `Cins bulunamadı: ${args.cins_ad}` }

  const { data: kalem, error: kErr } = await sb.from('np_siparis_kalemleri').select('*').eq('id', args.kalem_id).single()
  if (kErr) return { success: false, error: kErr.message }

  const toplam = calcKalemToplam(cins, kalem.m2, kalem.adet)
  const { error } = await sb.from('np_siparis_kalemleri').update({ cins_id: cins.id, birim_fiyat: cins.fiyat, ozel_fiyat: null, toplam }).eq('id', args.kalem_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Cins → ${cins.ad}` }
}

async function siparis_kalem_m2_guncelle(args: Record<string, unknown>) {
  const { data: kalem, error: kErr } = await sb.from('np_siparis_kalemleri')
    .select('*, np_cinsler(*)').eq('id', args.kalem_id).single()
  if (kErr) return { success: false, error: kErr.message }

  const m2     = args.m2 as number
  const toplam = calcKalemToplam(kalem.np_cinsler, m2, kalem.adet, kalem.ozel_fiyat || kalem.birim_fiyat)

  const { error } = await sb.from('np_siparis_kalemleri').update({ m2, m2_sonra: false, toplam }).eq('id', args.kalem_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ M2 → ${m2} · Toplam: ₺${toplam?.toLocaleString('tr-TR') || '?'}` }
}

async function siparis_kalem_fiyat_guncelle(args: Record<string, unknown>) {
  const { data: kalem, error: kErr } = await sb.from('np_siparis_kalemleri')
    .select('*, np_cinsler(*)').eq('id', args.kalem_id).single()
  if (kErr) return { success: false, error: kErr.message }

  const ozelFiyat = args.ozel_fiyat as number
  const toplam    = calcKalemToplam(kalem.np_cinsler, kalem.m2, kalem.adet, ozelFiyat)

  const { error } = await sb.from('np_siparis_kalemleri').update({ ozel_fiyat: ozelFiyat, toplam }).eq('id', args.kalem_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Özel fiyat → ₺${ozelFiyat}` }
}

async function siparis_indirim_ekle(args: Record<string, unknown>) {
  const updates: Record<string, unknown> = {}

  if (args.indirim_tutar) {
    updates.indirim_tutar = args.indirim_tutar
  } else if (args.indirim_yuzde) {
    // Toplam hesapla, yüzde uygula
    const { data: kalemler } = await sb.from('np_siparis_kalemleri').select('toplam').eq('siparis_id', args.siparis_id)
    const toplam = (kalemler || []).reduce((s: number, k: any) => s + (k.toplam || 0), 0)
    updates.indirim_tutar = Math.round(toplam * (args.indirim_yuzde as number) / 100)
  }

  const { error } = await sb.from('np_siparisler').update(updates).eq('id', args.siparis_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ İndirim uygulandı — ₺${updates.indirim_tutar}` }
}

async function siparis_ek_ucret_ekle(args: Record<string, unknown>) {
  const { error } = await sb.from('np_siparisler').update({
    ek_ucret: args.ek_ucret,
    ek_ucret_aciklama: args.ek_ucret_aciklama,
  }).eq('id', args.siparis_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Ek ücret: ₺${args.ek_ucret} (${args.ek_ucret_aciklama})` }
}

async function siparis_toplam_hesapla(args: Record<string, unknown>) {
  const [{ data: siparis }, { data: kalemler }] = await Promise.all([
    sb.from('np_siparisler').select('indirim_tutar, ek_ucret, ek_ucret_aciklama').eq('id', args.siparis_id).single(),
    sb.from('np_siparis_kalemleri').select('toplam, m2_sonra').eq('siparis_id', args.siparis_id),
  ])

  const kalemToplam = (kalemler || []).reduce((s: number, k: any) => s + (k.toplam || 0), 0)
  const indirim     = siparis?.indirim_tutar || 0
  const ekUcret     = siparis?.ek_ucret || 0
  const genelToplam = kalemToplam - indirim + ekUcret
  const eksikM2     = (kalemler || []).filter((k: any) => k.m2_sonra).length

  return {
    success: true,
    data: { kalemToplam, indirim, ekUcret, ekUcretAciklama: siparis?.ek_ucret_aciklama, genelToplam, eksikM2 },
    mesaj: `Kalemler: ₺${kalemToplam.toLocaleString('tr-TR')} · İndirim: -₺${indirim} · Ek: +₺${ekUcret} · **Toplam: ₺${genelToplam.toLocaleString('tr-TR')}**` + (eksikM2 ? ` · ⚠️ ${eksikM2} m2 eksik` : ''),
  }
}

async function siparis_odeme_al(args: Record<string, unknown>) {
  const { error } = await sb.from('np_siparisler').update({
    odendi: true, odeme_yontemi: args.odeme_yontemi, odeme_tarih: bugun(),
  }).eq('id', args.siparis_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Sipariş #${args.siparis_id} ödendi (${args.odeme_yontemi})` }
}

async function siparis_odeme_iptal(args: Record<string, unknown>) {
  const { error } = await sb.from('np_siparisler').update({
    odendi: false, odeme_yontemi: null, odeme_tarih: null,
  }).eq('id', args.siparis_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Sipariş #${args.siparis_id} ödeme geri alındı` }
}

export const siparisExecutors: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  siparis_sorgula, siparis_detay, siparis_ara, siparis_gecmis,
  siparis_olustur, siparis_alindi_gec, siparis_durum_guncelle, siparis_toplu_durum,
  siparis_sil, siparis_kopyala, siparis_adres_guncelle, siparis_teslim_tarihi_guncelle,
  siparis_servis_tip_guncelle, siparis_not_ekle,
  siparis_kalem_ekle, siparis_kalem_sil, siparis_kalem_adet_guncelle,
  siparis_kalem_cins_guncelle, siparis_kalem_m2_guncelle, siparis_kalem_fiyat_guncelle,
  siparis_indirim_ekle, siparis_ek_ucret_ekle, siparis_toplam_hesapla,
  siparis_odeme_al, siparis_odeme_iptal,
}
