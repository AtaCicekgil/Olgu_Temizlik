import type { GTool } from '../engine/groq'
import { sb } from '../lib/supabase'

export const stokTools: GTool[] = [
  { type:'function', function:{ name:'stok_listele', description:'Deterjan, kimyasal ve malzeme stoğunu listeler.', parameters:{ type:'object', properties:{ kategori:{type:'string'} } } } },
  { type:'function', function:{ name:'stok_ekle', description:'Yeni stok kalemi veya alım kaydı ekler.', parameters:{ type:'object', properties:{ ad:{type:'string'}, kategori:{type:'string'}, miktar:{type:'number'}, birim:{type:'string',description:'litre, kg, adet vb.'}, min_miktar:{type:'number'}, fiyat:{type:'number'} }, required:['ad','miktar','birim'] } } },
  { type:'function', function:{ name:'stok_guncelle', description:'Stok miktarını veya bilgilerini günceller.', parameters:{ type:'object', properties:{ stok_id:{type:'number'}, miktar:{type:'number'}, fiyat:{type:'number'}, min_miktar:{type:'number'} }, required:['stok_id'] } } },
  { type:'function', function:{ name:'stok_sil', description:'Stok kalemini siler.', parameters:{ type:'object', properties:{ stok_id:{type:'number'} }, required:['stok_id'] } } },
  { type:'function', function:{ name:'stok_azaldi_uyar', description:'Minimum miktarın altındaki stok kalemlerini listeler.', parameters:{ type:'object', properties:{} } } },
]

// ── executors ─────────────────────────────────────────────────────────────────

async function stok_listele(args: Record<string, unknown>) {
  let q = sb.from('np_stok').select('*').order('ad')
  if (args.kategori) q = q.eq('kategori', args.kategori)
  const { data, error } = await q
  if (error) return { success: false, error: error.message }
  return { success: true, data, count: data?.length }
}

async function stok_ekle(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_stok').insert({
    ad: args.ad, kategori: args.kategori || null, miktar: args.miktar,
    birim: args.birim || 'adet', min_miktar: args.min_miktar || 0, fiyat: args.fiyat || null,
  }).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data, mesaj: `✅ Stok eklendi — ${data.ad} ${data.miktar} ${data.birim}` }
}

async function stok_guncelle(args: Record<string, unknown>) {
  const { stok_id, ...fields } = args
  const { error } = await sb.from('np_stok').update(fields).eq('id', stok_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Stok #${stok_id} güncellendi` }
}

async function stok_sil(args: Record<string, unknown>) {
  const { error } = await sb.from('np_stok').delete().eq('id', args.stok_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Stok #${args.stok_id} silindi` }
}

async function stok_azaldi_uyar() {
  const { data, error } = await sb.from('np_stok').select('*').lt('miktar', sb.rpc as any)
  // miktar < min_miktar filtresi
  const { data: tumStok, error: err2 } = await sb.from('np_stok').select('*')
  if (err2 || error) return { success: false, error: err2?.message || error?.message }
  const azalanlar = (tumStok || []).filter((s: any) => s.miktar < s.min_miktar)
  void data
  return { success: true, data: azalanlar, count: azalanlar.length, mesaj: azalanlar.length ? `⚠️ ${azalanlar.length} kalem stok azaldı` : '✅ Tüm stoklar yeterli' }
}

export const stokExecutors: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  stok_listele, stok_ekle, stok_guncelle, stok_sil, stok_azaldi_uyar,
}
