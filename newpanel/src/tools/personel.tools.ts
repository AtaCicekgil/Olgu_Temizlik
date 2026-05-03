import type { GTool } from '../engine/groq'
import { sb } from '../lib/supabase'

export const personelTools: GTool[] = [
  { type:'function', function:{ name:'personel_listele', description:'Çalışan listesini getirir.', parameters:{ type:'object', properties:{ sadece_aktif:{type:'boolean'} } } } },
  { type:'function', function:{ name:'personel_ekle', description:'Yeni çalışan ekler.', parameters:{ type:'object', properties:{ ad:{type:'string'}, tel:{type:'string'}, rol:{type:'string',description:'teknisyen, sürücü, yönetici vb.'} }, required:['ad'] } } },
  { type:'function', function:{ name:'personel_guncelle', description:'Çalışan bilgilerini günceller.', parameters:{ type:'object', properties:{ personel_id:{type:'number'}, ad:{type:'string'}, tel:{type:'string'}, rol:{type:'string'}, aktif:{type:'boolean'} }, required:['personel_id'] } } },
  { type:'function', function:{ name:'personel_sil', description:'Çalışanı siler.', parameters:{ type:'object', properties:{ personel_id:{type:'number'} }, required:['personel_id'] } } },
  { type:'function', function:{ name:'personel_siparis_ata', description:'Siparişi belirli bir çalışana atar.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, personel_id:{type:'number'} }, required:['siparis_id','personel_id'] } } },
  { type:'function', function:{ name:'personel_performans', description:'Çalışan bazlı atanan sipariş sayısı ve istatistiği.', parameters:{ type:'object', properties:{ personel_id:{type:'number'}, donem:{type:'string',enum:['bu_ay','bu_yil','tum']} } } } },
]

// ── executors ─────────────────────────────────────────────────────────────────

async function personel_listele(args: Record<string, unknown>) {
  let q = sb.from('np_personel').select('*').order('ad')
  if (args.sadece_aktif !== false) q = q.eq('aktif', true)
  const { data, error } = await q
  if (error) return { success: false, error: error.message }
  return { success: true, data, count: data?.length }
}

async function personel_ekle(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_personel').insert({
    ad: args.ad, tel: args.tel || null, rol: args.rol || 'teknisyen', aktif: true,
  }).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data, mesaj: `✅ Personel eklendi — ${data.ad}` }
}

async function personel_guncelle(args: Record<string, unknown>) {
  const { personel_id, ...fields } = args
  const { error } = await sb.from('np_personel').update(fields).eq('id', personel_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Personel #${personel_id} güncellendi` }
}

async function personel_sil(args: Record<string, unknown>) {
  const { error } = await sb.from('np_personel').delete().eq('id', args.personel_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Personel #${args.personel_id} silindi` }
}

async function personel_siparis_ata(args: Record<string, unknown>) {
  const { error } = await sb.from('np_siparisler').update({ personel_id: args.personel_id }).eq('id', args.siparis_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Sipariş #${args.siparis_id} → Personel #${args.personel_id}` }
}

async function personel_performans(args: Record<string, unknown>) {
  const now  = new Date()
  const pad  = (n: number) => String(n).padStart(2, '0')
  let bas = '2020-01-01'
  if (args.donem === 'bu_ay')  bas = `${now.getFullYear()}-${pad(now.getMonth()+1)}-01`
  if (args.donem === 'bu_yil') bas = `${now.getFullYear()}-01-01`

  let q = sb.from('np_siparisler').select('personel_id,np_personel(ad),durum,np_siparis_kalemleri(toplam)').gte('olusturma', bas)
  if (args.personel_id) q = q.eq('personel_id', args.personel_id)

  const { data, error } = await q
  if (error) return { success: false, error: error.message }

  const sayac: Record<number, { ad: string; sayi: number; teslim: number; gelir: number }> = {}
  ;(data || []).forEach((s: any) => {
    const id = s.personel_id
    if (!id) return
    if (!sayac[id]) sayac[id] = { ad: (s as any).np_personel?.ad || '?', sayi: 0, teslim: 0, gelir: 0 }
    sayac[id].sayi++
    if (s.durum === 'teslim') sayac[id].teslim++
    sayac[id].gelir += (s.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0)
  })

  const sorted = Object.entries(sayac).map(([id, v]) => ({ personel_id: Number(id), ...v })).sort((a, b) => b.sayi - a.sayi)
  return { success: true, data: sorted }
}

export const personelExecutors: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  personel_listele, personel_ekle, personel_guncelle, personel_sil, personel_siparis_ata, personel_performans,
}
