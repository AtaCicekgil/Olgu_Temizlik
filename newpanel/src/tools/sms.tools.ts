import type { GTool } from '../engine/groq'
import { sb } from '../lib/supabase'
import { smsSend, SMS_SABLONLAR } from '../lib/sms'

export const smsTools: GTool[] = [
  { type:'function', function:{ name:'sms_gonder', description:'Müşteriye şablonlu SMS gönderir.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'}, konu:{type:'string',enum:['alindi','hazir','dagitimda','teslim','odeme_hatirlatma','ozel']}, tutar:{type:'number'}, ozel_metin:{type:'string'} }, required:['musteri_id','konu'] } } },
  { type:'function', function:{ name:'sms_ozel_gonder', description:'Müşteriye serbest metin SMS gönderir.', parameters:{ type:'object', properties:{ musteri_id:{type:'number'}, metin:{type:'string'} }, required:['musteri_id','metin'] } } },
  { type:'function', function:{ name:'odenmemis_sms_toplu', description:'Ödenmemiş siparişi olan tüm müşterilere ödeme hatırlatması gönderir.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'hazir_sms_toplu', description:'Halısı hazır olan tüm müşterilere bildirim gönderir.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'dagitimda_sms_toplu', description:'Dağıtımdaki tüm müşterilere SMS gönderir.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'gecikme_sms_toplu', description:'Teslim tarihi geciken siparişlerin müşterilerine özür/bilgi SMS gönderir.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'sms_sablon_listele', description:'Kayıtlı SMS şablonlarını listeler.', parameters:{ type:'object', properties:{} } } },
  { type:'function', function:{ name:'sms_sablon_olustur', description:'Yeni SMS şablonu kaydeder.', parameters:{ type:'object', properties:{ kod:{type:'string'}, baslik:{type:'string'}, metin:{type:'string'} }, required:['kod','baslik','metin'] } } },
  { type:'function', function:{ name:'sms_sablon_guncelle', description:'Mevcut SMS şablonunu günceller.', parameters:{ type:'object', properties:{ sablon_id:{type:'number'}, baslik:{type:'string'}, metin:{type:'string'} }, required:['sablon_id'] } } },
  { type:'function', function:{ name:'sms_sablon_sil', description:'SMS şablonunu siler.', parameters:{ type:'object', properties:{ sablon_id:{type:'number'} }, required:['sablon_id'] } } },
]

// ── helpers ───────────────────────────────────────────────────────────────────

async function getMusteriTel(musteri_id: number): Promise<{ ad: string; tel: string | null } | null> {
  const { data } = await sb.from('np_musteriler').select('ad,tel').eq('id', musteri_id).single()
  return data
}

function smsKonuMetin(konu: string, ad: string, tutar?: number): string {
  const ilkAd = ad.split(' ')[0]
  switch (konu) {
    case 'alindi':           return SMS_SABLONLAR.alindi(ilkAd)
    case 'hazir':            return SMS_SABLONLAR.hazir(ilkAd)
    case 'dagitimda':        return SMS_SABLONLAR.dagitimda(ilkAd)
    case 'teslim':           return SMS_SABLONLAR.teslim(ilkAd)
    case 'odeme_hatirlatma': return SMS_SABLONLAR.odeme_hatirlatma(ilkAd, tutar || 0)
    default:                 return ''
  }
}

// ── executors ─────────────────────────────────────────────────────────────────

async function sms_gonder(args: Record<string, unknown>) {
  const musteri = await getMusteriTel(args.musteri_id as number)
  if (!musteri)       return { success: false, error: 'Müşteri bulunamadı' }
  if (!musteri.tel)   return { success: false, error: `${musteri.ad} için tel kayıtlı değil` }

  const metin = args.konu === 'ozel'
    ? String(args.ozel_metin || '')
    : smsKonuMetin(String(args.konu), musteri.ad, args.tutar as number)

  smsSend({ tel: musteri.tel, metin })
  return { success: true, mesaj: `📱 SMS açıldı — ${musteri.ad} (${musteri.tel})`, metin }
}

async function sms_ozel_gonder(args: Record<string, unknown>) {
  const musteri = await getMusteriTel(args.musteri_id as number)
  if (!musteri)     return { success: false, error: 'Müşteri bulunamadı' }
  if (!musteri.tel) return { success: false, error: `${musteri.ad} için tel kayıtlı değil` }
  smsSend({ tel: musteri.tel, metin: String(args.metin) })
  return { success: true, mesaj: `📱 SMS açıldı — ${musteri.ad}` }
}

async function toplu_sms_gonder(durum: string, konu: string, tutarHesapla?: boolean) {
  const q = durum === 'odenmemis'
    ? sb.from('np_siparisler').select('musteri_id,np_musteriler(ad,tel),np_siparis_kalemleri(toplam)').eq('durum','teslim').eq('odendi',false)
    : sb.from('np_siparisler').select('musteri_id,np_musteriler(ad,tel),np_siparis_kalemleri(toplam)').eq('durum', durum)

  const { data, error } = await q
  if (error) return { success: false, error: error.message }

  const list = data || []
  let gonderilen = 0, telefonsuz = 0

  for (const s of list) {
    const musteri = (s as any).np_musteriler
    if (!musteri?.tel) { telefonsuz++; continue }
    const tutar = tutarHesapla ? (s as any).np_siparis_kalemleri.reduce((a: number, k: any) => a + (k.toplam || 0), 0) : 0
    const metin = smsKonuMetin(konu, musteri.ad, tutar)
    smsSend({ tel: musteri.tel, metin })
    gonderilen++
  }

  return { success: true, mesaj: `📱 ${gonderilen} SMS gönderildi` + (telefonsuz ? ` · ${telefonsuz} müşteride tel yok` : '') }
}

async function odenmemis_sms_toplu()  { return toplu_sms_gonder('odenmemis', 'odeme_hatirlatma', true) }
async function hazir_sms_toplu()      { return toplu_sms_gonder('hazir', 'hazir') }
async function dagitimda_sms_toplu()  { return toplu_sms_gonder('dagitimda', 'dagitimda') }

async function gecikme_sms_toplu() {
  const bugun = new Date().toISOString().slice(0, 10)
  const { data, error } = await sb.from('np_siparisler')
    .select('musteri_id,np_musteriler(ad,tel)').not('durum','eq','teslim').lt('teslim_tarihi', bugun).not('teslim_tarihi','is',null)
  if (error) return { success: false, error: error.message }

  let gonderilen = 0
  for (const s of (data || [])) {
    const musteri = (s as any).np_musteriler
    if (!musteri?.tel) continue
    const metin = `Merhaba ${musteri.ad.split(' ')[0]}, halınızın tesliminde yaşanan gecikme için özür dileriz. En kısa sürede bilgilendireceğiz. — ${import.meta.env.VITE_ISLETME_AD || 'Olgu Temizlik'}`
    smsSend({ tel: musteri.tel, metin })
    gonderilen++
  }
  return { success: true, mesaj: `📱 ${gonderilen} gecikme SMS'i gönderildi` }
}

async function sms_sablon_listele() {
  const { data, error } = await sb.from('np_sms_sablon').select('*').order('baslik')
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

async function sms_sablon_olustur(args: Record<string, unknown>) {
  const { data, error } = await sb.from('np_sms_sablon').insert({ kod: args.kod, baslik: args.baslik, metin: args.metin, aktif: true }).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data, mesaj: `✅ Şablon oluşturuldu — ${args.baslik}` }
}

async function sms_sablon_guncelle(args: Record<string, unknown>) {
  const { sablon_id, ...fields } = args
  const { error } = await sb.from('np_sms_sablon').update(fields).eq('id', sablon_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Şablon #${sablon_id} güncellendi` }
}

async function sms_sablon_sil(args: Record<string, unknown>) {
  const { error } = await sb.from('np_sms_sablon').delete().eq('id', args.sablon_id)
  if (error) return { success: false, error: error.message }
  return { success: true, mesaj: `✅ Şablon #${args.sablon_id} silindi` }
}

export const smsExecutors: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  sms_gonder, sms_ozel_gonder, odenmemis_sms_toplu, hazir_sms_toplu,
  dagitimda_sms_toplu, gecikme_sms_toplu, sms_sablon_listele,
  sms_sablon_olustur, sms_sablon_guncelle, sms_sablon_sil,
}
