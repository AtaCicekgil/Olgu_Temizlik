import type { GTool } from '../engine/groq'
import { sb } from '../lib/supabase'
import { bugun } from '../lib/utils'

export const giderTools: GTool[] = [
  { type:'function', function:{ name:'gider_ekle', description:'Gider kaydeder (kira, mazot, elektrik, personel vb.).', parameters:{ type:'object', properties:{ kategori:{type:'string'}, tutar:{type:'number'}, tarih:{type:'string',description:'YYYY-MM-DD, boşsa bugün'}, aciklama:{type:'string'} }, required:['kategori','tutar'] } } },
  { type:'function', function:{ name:'gider_listele', description:'Giderleri listeler. Tarih aralığı veya kategoriye göre filtreler.', parameters:{ type:'object', properties:{ tarih_bas:{type:'string'}, tarih_bit:{type:'string'}, kategori:{type:'string'}, limit:{type:'number'} } } } },
  { type:'function', function:{ name:'gider_detay', description:'Tek giderin tüm bilgileri.', parameters:{ type:'object', properties:{ gider_id:{type:'number'} }, required:['gider_id'] } } },
  { type:'function', function:{ name:'gider_guncelle', description:'Giderin tutar, kategori veya açıklamasını düzeltir.', parameters:{ type:'object', properties:{ gider_id:{type:'number'}, kategori:{type:'string'}, tutar:{type:'number'}, tarih:{type:'string'}, aciklama:{type:'string'} }, required:['gider_id'] } } },
  { type:'function', function:{ name:'gider_sil', description:'Gideri siler.', parameters:{ type:'object', properties:{ gider_id:{type:'number'} }, required:['gider_id'] } } },
  { type:'function', function:{ name:'gider_kategori_ozet', description:'Kategorilere göre toplam gider özeti.', parameters:{ type:'object', properties:{ tarih_bas:{type:'string'}, tarih_bit:{type:'string'} } } } },
  { type:'function', function:{ name:'gider_en_buyuk', description:'En büyük giderler sıralaması.', parameters:{ type:'object', properties:{ limit:{type:'number'}, tarih_bas:{type:'string'}, tarih_bit:{type:'string'} } } } },
  { type:'function', function:{ name:'gider_tekrarlayan_ekle', description:'Aylık sabit gider ekler (kira, maaş gibi). Birden fazla ay için tekrarlar.', parameters:{ type:'object', properties:{ kategori:{type:'string'}, tutar:{type:'number'}, aciklama:{type:'string'}, ay_sayisi:{type:'number',description:'Kaç ay geriye/ileriye eklensin (varsayılan 1)'}, baslangic_ay:{type:'string',description:'YYYY-MM formatında, boşsa bu ay'} }, required:['kategori','tutar'] } } },
]

// ── executors ─────────────────────────────────────────────────────────────────

async function gider_ekle(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_giderler').insert({
    kategori: args.kategori, tutar: args.tutar,
    tarih: args.tarih || bugun(), aciklama: args.aciklama || null,
  }).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data, mesaj: `✅ Gider eklendi — ${args.kategori} ₺${args.tutar}` }
}

async function gider_listele(args: Record<string, unknown>) {
  let q = sb.from('np_giderler').select('*').order('tarih', { ascending: false }).limit((args.limit as number) || 50)
  if (args.kategori)  q = q.eq('kategori', args.kategori)
  if (args.tarih_bas) q = q.gte('tarih', args.tarih_bas)
  if (args.tarih_bit) q = q.lte('tarih', args.tarih_bit)
  const { data, error } = await q
  if (error) return { success: false, error: error.message }
  const toplam = (data || []).reduce((s: number, g: any) => s + (g.tutar || 0), 0)
  return { success: true, data, count: data?.length, toplam }
}

async function gider_detay(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_giderler').select('*').eq('id', args.gider_id).single()
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

async function gider_guncelle(args: Record<string, unknown>) {
  const { gider_id, ...fields } = args
  const { error } = await sb.from('np_giderler').update(fields).eq('id', gider_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Gider #${gider_id} güncellendi` }
}

async function gider_sil(args: Record<string, unknown>) {
  const { error } = await sb.from('np_giderler').delete().eq('id', args.gider_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Gider #${args.gider_id} silindi` }
}

async function gider_kategori_ozet(args: Record<string, unknown>) {
  let q = sb.from('np_giderler').select('kategori, tutar')
  if (args.tarih_bas) q = q.gte('tarih', args.tarih_bas)
  if (args.tarih_bit) q = q.lte('tarih', args.tarih_bit)
  const { data, error } = await q
  if (error) return { success: false, error: error.message }

  const ozet: Record<string, number> = {}
  ;(data || []).forEach((g: any) => { ozet[g.kategori] = (ozet[g.kategori] || 0) + g.tutar })
  const sorted = Object.entries(ozet).map(([k, v]) => ({ kategori: k, toplam: v })).sort((a, b) => b.toplam - a.toplam)
  const genelToplam = sorted.reduce((s, x) => s + x.toplam, 0)
  return { success: true, data: sorted, genelToplam }
}

async function gider_en_buyuk(args: Record<string, unknown>) {
  let q = sb.from('np_giderler').select('*').order('tutar', { ascending: false }).limit((args.limit as number) || 10)
  if (args.tarih_bas) q = q.gte('tarih', args.tarih_bas)
  if (args.tarih_bit) q = q.lte('tarih', args.tarih_bit)
  const { data, error } = await q
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

async function gider_tekrarlayan_ekle(args: Record<string, unknown>) {
  const aySayisi = (args.ay_sayisi as number) || 1
  const baslangic = args.baslangic_ay ? String(args.baslangic_ay) : bugun().slice(0, 7)
  const rows = []

  for (let i = 0; i < aySayisi; i++) {
    const [yil, ay] = baslangic.split('-').map(Number)
    const tarihDate = new Date(yil, ay - 1 + i, 1)
    const tarih = `${tarihDate.getFullYear()}-${String(tarihDate.getMonth() + 1).padStart(2, '0')}-01`
    rows.push({ kategori: args.kategori, tutar: args.tutar, tarih, aciklama: args.aciklama || null })
  }

  const { data, error } = await sb.from('np_giderler').insert(rows).select()
  if (error) return { success: false, error: error.message }
  return { success: true, data, mesaj: `✅ ${aySayisi} aylık tekrarlayan gider eklendi — ${args.kategori}` }
}

export const giderExecutors: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  gider_ekle, gider_listele, gider_detay, gider_guncelle, gider_sil,
  gider_kategori_ozet, gider_en_buyuk, gider_tekrarlayan_ekle,
}
