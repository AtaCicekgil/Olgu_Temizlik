import type { GTool } from '../engine/groq'
import { sb } from '../lib/supabase'

export const takvimTools: GTool[] = [
  { type:'function', function:{ name:'takvim_goster', description:'Belirli bir tarihe veya haftaya ait siparişleri listeler.', parameters:{ type:'object', properties:{ tarih:{type:'string',description:'YYYY-MM-DD, belirtilmezse bugün'}, hafta:{type:'boolean',description:'true ise o haftanın tamamını gösterir'} } } } },
  { type:'function', function:{ name:'yaklasan_teslimler', description:'Önümüzdeki X günde teslim edilmesi gereken siparişler.', parameters:{ type:'object', properties:{ gun:{type:'number',description:'Kaç gün ilerisi (varsayılan 3)'} } } } },
  { type:'function', function:{ name:'gecikme_uyari', description:'Teslim tarihi bugün veya geçmiş olan aktif siparişler.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'bos_gun_bul', description:'Gelecek 14 günde sipariş az olan (uygun kapasiteli) günleri bulur.', parameters:{ type:'object', properties:{ gun_sayisi:{type:'number',description:'Kaç gün ileriye bak (varsayılan 14)'} } } } },
  { type:'function', function:{ name:'hatirlatici_kur', description:'Bir siparişe hatırlatıcı tarih ve not ekler.', parameters:{ type:'object', properties:{ siparis_id:{type:'number'}, tarih:{type:'string',description:'YYYY-MM-DD'}, hatirlatici_notu:{type:'string'} }, required:['siparis_id','tarih'] } } },
  { type:'function', function:{ name:'hatirlatici_listele', description:'Aktif (tamamlanmamış) hatırlatıcıları listeler.', parameters:{ type:'object', properties:{ tamamlandi:{type:'boolean'} } } } },
]

// ── executors ─────────────────────────────────────────────────────────────────

async function takvim_goster(args: Record<string, unknown>) {
  const tarih   = (args.tarih as string) || new Date().toISOString().slice(0, 10)
  const hafta   = args.hafta as boolean

  let bas = tarih, bit = tarih
  if (hafta) {
    const d = new Date(tarih)
    const pzt = new Date(d); pzt.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    const paz = new Date(pzt); paz.setDate(pzt.getDate() + 6)
    bas = pzt.toISOString().slice(0, 10)
    bit = paz.toISOString().slice(0, 10)
  }

  const { data, error } = await sb.from('np_siparisler')
    .select('id,durum,tarih,teslim_tarihi,np_musteriler(ad,tel),np_siparis_kalemleri(toplam)')
    .or(`tarih.gte.${bas},teslim_tarihi.gte.${bas}`)
    .or(`tarih.lte.${bit},teslim_tarihi.lte.${bit}`)
    .order('teslim_tarihi', { ascending: true })

  if (error) return { success: false, error: error.message }
  return { success: true, data, count: data?.length, aralik: { bas, bit } }
}

async function yaklasan_teslimler(args: Record<string, unknown>) {
  const gun    = (args.gun as number) || 3
  const bugun  = new Date().toISOString().slice(0, 10)
  const bitis  = new Date(Date.now() + gun * 86400000).toISOString().slice(0, 10)

  const { data, error } = await sb.from('np_siparisler')
    .select('id,durum,teslim_tarihi,np_musteriler(ad,tel),np_siparis_kalemleri(toplam)')
    .not('durum', 'eq', 'teslim')
    .gte('teslim_tarihi', bugun)
    .lte('teslim_tarihi', bitis)
    .order('teslim_tarihi', { ascending: true })

  if (error) return { success: false, error: error.message }
  return { success: true, data, count: data?.length }
}

async function gecikme_uyari() {
  const bugun = new Date().toISOString().slice(0, 10)
  const { data, error } = await sb.from('np_siparisler')
    .select('id,durum,teslim_tarihi,np_musteriler(ad,tel)')
    .not('durum', 'eq', 'teslim')
    .not('teslim_tarihi', 'is', null)
    .lte('teslim_tarihi', bugun)
    .order('teslim_tarihi', { ascending: true })

  if (error) return { success: false, error: error.message }
  const liste = (data || []).map((s: any) => ({
    ...s,
    gecikme_gun: Math.floor((new Date(bugun).getTime() - new Date(s.teslim_tarihi).getTime()) / 86400000),
  }))
  return { success: true, data: liste, count: liste.length }
}

async function bos_gun_bul(args: Record<string, unknown>) {
  const gunSayisi = (args.gun_sayisi as number) || 14
  const { data, error } = await sb.from('np_siparisler')
    .select('teslim_tarihi').not('teslim_tarihi', 'is', null)
    .not('durum', 'eq', 'teslim')

  if (error) return { success: false, error: error.message }

  const sayac: Record<string, number> = {}
  ;(data || []).forEach((s: any) => { sayac[s.teslim_tarihi] = (sayac[s.teslim_tarihi] || 0) + 1 })

  const gunler = []
  for (let i = 0; i < gunSayisi; i++) {
    const d = new Date(Date.now() + i * 86400000)
    const tarih = d.toISOString().slice(0, 10)
    const gun   = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'][d.getDay()]
    gunler.push({ tarih, gun, siparis_sayisi: sayac[tarih] || 0 })
  }

  const bosGunler = gunler.filter(g => g.siparis_sayisi < 3).slice(0, 5)
  return { success: true, data: gunler, bos_gunler: bosGunler }
}

async function hatirlatici_kur(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_hatirlatici').insert({
    siparis_id: args.siparis_id, tarih: args.tarih, hatirlatici_notu: args.not || null, tamamlandi: false,
  }).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data, mesaj: `✅ Hatırlatıcı kuruldu — ${args.tarih}` }
}

async function hatirlatici_listele(args: Record<string, unknown>) {
  let q = sb.from('np_hatirlatici').select('*, np_siparisler(id,durum,np_musteriler(ad))').order('tarih')
  if (args.tamamlandi !== undefined) q = q.eq('tamamlandi', args.tamamlandi)
  else q = q.eq('tamamlandi', false)
  const { data, error } = await q
  if (error) return { success: false, error: error.message }
  return { success: true, data, count: data?.length }
}

export const takvimExecutors: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  takvim_goster, yaklasan_teslimler, gecikme_uyari, bos_gun_bul, hatirlatici_kur, hatirlatici_listele,
}
