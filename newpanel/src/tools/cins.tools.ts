import type { GTool } from '../engine/groq'
import { sb } from '../lib/supabase'

export const cinsTools: GTool[] = [
  { type:'function', function:{ name:'cins_listele', description:'Tüm halı cinslerini ve birim fiyatlarını listeler.', parameters:{ type:'object', properties:{ sadece_aktif:{type:'boolean'} } } } },
  { type:'function', function:{ name:'cins_ekle', description:'Yeni halı/koltuk/perde cinsi tanımlar.', parameters:{ type:'object', properties:{ ad:{type:'string'}, fiyat:{type:'number'}, fiyat_tip:{type:'string',enum:['m2','sabit']} }, required:['ad','fiyat','fiyat_tip'] } } },
  { type:'function', function:{ name:'cins_ad_guncelle', description:'Cins adını değiştirir.', parameters:{ type:'object', properties:{ cins_id:{type:'number'}, ad:{type:'string'} }, required:['cins_id','ad'] } } },
  { type:'function', function:{ name:'cins_fiyat_guncelle', description:'Cinsin birim fiyatını günceller.', parameters:{ type:'object', properties:{ cins_id:{type:'number'}, fiyat:{type:'number'} }, required:['cins_id','fiyat'] } } },
  { type:'function', function:{ name:'cins_tip_guncelle', description:'Fiyat tipini değiştirir (m2/sabit).', parameters:{ type:'object', properties:{ cins_id:{type:'number'}, fiyat_tip:{type:'string',enum:['m2','sabit']} }, required:['cins_id','fiyat_tip'] } } },
  { type:'function', function:{ name:'cins_pasif_yap', description:'Cinsi pasife alır (listede görünmez).', parameters:{ type:'object', properties:{ cins_id:{type:'number'} }, required:['cins_id'] } } },
  { type:'function', function:{ name:'cins_aktif_yap', description:'Pasif cinsi tekrar aktifleştirir.', parameters:{ type:'object', properties:{ cins_id:{type:'number'} }, required:['cins_id'] } } },
  { type:'function', function:{ name:'cins_sil', description:'Cinsi tamamen siler. Siparişlerde kullanılıyorsa hata verir.', parameters:{ type:'object', properties:{ cins_id:{type:'number'} }, required:['cins_id'] } } },
  { type:'function', function:{ name:'cins_detay', description:'Cinsin kullanım istatistiği: kaç siparişte kullanıldı, toplam m2 ve gelir.', parameters:{ type:'object', properties:{ cins_id:{type:'number'} }, required:['cins_id'] } } },
  { type:'function', function:{ name:'cins_populerlik', description:'En çok kullanılan halı cinslerini sıralar.', parameters:{ type:'object', properties:{ limit:{type:'number'} } } } },
]

// ── executors ─────────────────────────────────────────────────────────────────

async function cins_listele(args: Record<string, unknown>) {
  let q = sb.from('np_cinsler').select('*').order('ad')
  if (args.sadece_aktif !== false) q = q.eq('aktif', true)
  const { data, error } = await q
  if (error) return { success: false, error: error.message }
  return { success: true, data, count: data?.length }
}

async function cins_ekle(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_cinsler').insert({
    ad: args.ad, fiyat: args.fiyat, fiyat_tip: args.fiyat_tip || 'm2', aktif: true,
  }).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data, mesaj: `✅ Cins eklendi — ${data.ad} ₺${data.fiyat}/${data.fiyat_tip}` }
}

async function cins_alan_guncelle(id: unknown, fields: Record<string, unknown>) {
  const { error } = await sb.from('np_cinsler').update(fields).eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Cins #${id} güncellendi` }
}

async function cins_ad_guncelle(args: Record<string, unknown>) { return cins_alan_guncelle(args.cins_id, { ad: args.ad }) }
async function cins_fiyat_guncelle(args: Record<string, unknown>) { return cins_alan_guncelle(args.cins_id, { fiyat: args.fiyat }) }
async function cins_tip_guncelle(args: Record<string, unknown>) { return cins_alan_guncelle(args.cins_id, { fiyat_tip: args.fiyat_tip }) }
async function cins_pasif_yap(args: Record<string, unknown>) { return cins_alan_guncelle(args.cins_id, { aktif: false }) }
async function cins_aktif_yap(args: Record<string, unknown>) { return cins_alan_guncelle(args.cins_id, { aktif: true }) }

async function cins_sil(args: Record<string, unknown>) {
  const { data: kullanan } = await sb.from('np_siparis_kalemleri').select('id').eq('cins_id', args.cins_id).limit(1)
  if (kullanan && kullanan.length > 0) return { success: false, error: 'Bu cins siparişlerde kullanılıyor, silinemez. Pasife alabilirsiniz.' }
  const { error } = await sb.from('np_cinsler').delete().eq('id', args.cins_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Cins #${args.cins_id} silindi` }
}

async function cins_detay(args: Record<string, unknown>) {
  const [{ data: cins }, { data: kalemler }] = await Promise.all([
    sb.from('np_cinsler').select('*').eq('id', args.cins_id).single(),
    sb.from('np_siparis_kalemleri').select('adet,m2,toplam').eq('cins_id', args.cins_id),
  ])
  const list = kalemler || []
  const toplamM2     = list.reduce((s: number, k: any) => s + (k.m2 || 0), 0)
  const toplamGelir  = list.reduce((s: number, k: any) => s + (k.toplam || 0), 0)
  return { success: true, data: { ...cins, kullanim_sayisi: list.length, toplam_m2: toplamM2.toFixed(1), toplam_gelir: toplamGelir } }
}

async function cins_populerlik(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_siparis_kalemleri').select('cins_id, np_cinsler(ad), toplam')
  if (error) return { success: false, error: error.message }

  const sayac: Record<number, { ad: string; sayi: number; gelir: number }> = {}
  ;(data || []).forEach((k: any) => {
    const id = k.cins_id
    if (!id) return
    if (!sayac[id]) sayac[id] = { ad: k.np_cinsler?.ad || '?', sayi: 0, gelir: 0 }
    sayac[id].sayi++
    sayac[id].gelir += k.toplam || 0
  })

  const sorted = Object.entries(sayac)
    .map(([id, v]) => ({ cins_id: Number(id), ...v }))
    .sort((a, b) => b.sayi - a.sayi)
    .slice(0, (args.limit as number) || 10)

  return { success: true, data: sorted }
}

export const cinsExecutors: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  cins_listele, cins_ekle, cins_ad_guncelle, cins_fiyat_guncelle, cins_tip_guncelle,
  cins_pasif_yap, cins_aktif_yap, cins_sil, cins_detay, cins_populerlik,
}
