import type { GTool } from '../engine/groq'
import { sb } from '../lib/supabase'

export const ayarlarTools: GTool[] = [
  { type:'function', function:{ name:'ayar_getir', description:'İşletme ayarlarını ve bilgilerini getirir.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'isletme_bilgi_guncelle', description:'İşletme adı, telefon, şehir bilgilerini günceller.', parameters:{ type:'object', properties:{ isletme_ad:{type:'string'}, isletme_tel:{type:'string'}, isletme_sehir:{type:'string'} } } } },
  { type:'function', function:{ name:'calisma_saatleri_guncelle', description:'Çalışma saatlerini günceller.', parameters:{ type:'object', properties:{ baslangic:{type:'string',description:'HH:MM'}, bitis:{type:'string',description:'HH:MM'} } } } },
  { type:'function', function:{ name:'varsayilan_teslim_suresi_guncelle', description:'Varsayılan teslim süresini (gün) günceller.', parameters:{ type:'object', properties:{ gun:{type:'number'} }, required:['gun'] } } },
  { type:'function', function:{ name:'fiyat_listesi_goster', description:'Müşteriye gösterilecek güncel fiyat listesini hazırlar.', parameters:{ type:'object', properties:{} } } },
]

// ── executors ─────────────────────────────────────────────────────────────────

async function ayar_getir() {
  const { data, error } = await sb.from('np_ayarlar').select('*')
  if (error) return { success: false, error: error.message }
  const obj: Record<string, string> = {}
  ;(data || []).forEach((a: any) => { obj[a.anahtar] = a.deger })
  return { success: true, data: obj }
}

async function ayar_set(anahtar: string, deger: string) {
  const { error } = await sb.from('np_ayarlar').upsert({ anahtar, deger, guncellendi: new Date().toISOString() }, { onConflict: 'anahtar' })
  return error ? { success: false, error: error.message } : { success: true }
}

async function isletme_bilgi_guncelle(args: Record<string, unknown>) {
  const updates: Promise<unknown>[] = []
  if (args.isletme_ad)    updates.push(ayar_set('isletme_ad',    String(args.isletme_ad)))
  if (args.isletme_tel)   updates.push(ayar_set('isletme_tel',   String(args.isletme_tel)))
  if (args.isletme_sehir) updates.push(ayar_set('isletme_sehir', String(args.isletme_sehir)))
  await Promise.all(updates)
  return { success: true, mesaj: '✅ İşletme bilgileri güncellendi' }
}

async function calisma_saatleri_guncelle(args: Record<string, unknown>) {
  const updates: Promise<unknown>[] = []
  if (args.baslangic) updates.push(ayar_set('calisma_baslangic', String(args.baslangic)))
  if (args.bitis)     updates.push(ayar_set('calisma_bitis',     String(args.bitis)))
  await Promise.all(updates)
  return { success: true, mesaj: `✅ Çalışma saatleri: ${args.baslangic || '?'} - ${args.bitis || '?'}` }
}

async function varsayilan_teslim_suresi_guncelle(args: Record<string, unknown>) {
  await ayar_set('teslim_suresi_gun', String(args.gun))
  return { success: true, mesaj: `✅ Varsayılan teslim süresi: ${args.gun} gün` }
}

async function fiyat_listesi_goster() {
  const { data, error } = await sb.from('np_cinsler').select('ad,fiyat,fiyat_tip').eq('aktif', true).order('ad')
  if (error) return { success: false, error: error.message }
  const liste = (data || []).map((c: any) => ({
    cins: c.ad,
    fiyat: `₺${c.fiyat}${c.fiyat_tip === 'm2' ? '/m²' : ' (sabit)'}`,
  }))
  return { success: true, data: liste }
}

export const ayarlarExecutors: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  ayar_getir, isletme_bilgi_guncelle, calisma_saatleri_guncelle, varsayilan_teslim_suresi_guncelle, fiyat_listesi_goster,
}
