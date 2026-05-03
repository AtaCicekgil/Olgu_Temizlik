export interface Adres {
  mahalle: string
  sokak:   string
  bina:    string
  daire:   string
}

export interface Musteri {
  id:       number
  ad:       string
  tel:      string | null
  tipi:     'bireysel' | 'kurumsal'
  adres_mahalle: string | null
  adres_sokak:   string | null
  adres_bina:    string | null
  adres_daire:   string | null
  notlar:   string | null
  created_at: string
}

export interface Cins {
  id:        string
  ad:        string
  kategori:  string  // Halı | Koltuk | Perde
  fiyat:     number
  fiyat_tip: 'm2' | 'sabit'
  aktif:     boolean
}

export type SiparisDurum =
  | 'alinacak'
  | 'alindi'
  | 'yikanıyor'
  | 'hazir'
  | 'dagitimda'
  | 'teslim'

export interface SiparisKalem {
  id:          number
  siparis_id:  number
  cins_id:     string | null
  cins_ad?:    string
  adet:        number
  m2:          number | null
  m2_sonra:    boolean
  birim_fiyat: number | null
  ozel_fiyat:  number | null
  toplam:      number | null
}

export interface Siparis {
  id:             number
  musteri_id:     number
  musteri_ad?:    string
  musteri_tel?:   string | null
  durum:          SiparisDurum
  servis_tip:     'hali' | 'koltuk' | 'perde'
  tarih:          string | null
  teslim_tarihi:  string | null
  odeme_tarih:    string | null
  odeme_yontemi:  'nakit' | 'havale' | null
  odendi:         boolean
  siparis_notu:   string | null
  olusturma:      string
  kalemler?:      SiparisKalem[]
}

export interface Gider {
  id:        number
  kategori:  string
  aciklama:  string | null
  tutar:     number
  tarih:     string
  created_at: string
}

export const DURUM_LABEL: Record<SiparisDurum, string> = {
  alinacak:  'Alınacak',
  alindi:    'Alındı',
  'yikanıyor': 'Yıkanıyor',
  hazir:     'Hazır',
  dagitimda: 'Dağıtımda',
  teslim:    'Teslim Edildi',
}

export const DURUM_RENK: Record<SiparisDurum, string> = {
  alinacak:  'bg-blue-100 text-blue-700',
  alindi:    'bg-emerald-100 text-emerald-700',
  'yikanıyor': 'bg-purple-100 text-purple-700',
  hazir:     'bg-green-100 text-green-700',
  dagitimda: 'bg-amber-100 text-amber-700',
  teslim:    'bg-slate-100 text-slate-600',
}
