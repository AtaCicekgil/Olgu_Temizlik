import { useState, useEffect, useCallback } from 'react'
import {
  Package, Users, TrendingDown, BarChart2,
  MessageSquare, X, ChevronRight, RefreshCw,
} from 'lucide-react'
import { AssistantShell } from '../assistant/AssistantShell'
import { useModeStore } from '../store/mode.store'
import { sb } from '../lib/supabase'
import { fmtTL, fmtTarihKisa } from '../lib/utils'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { DURUM_LABEL, DURUM_RENK, type Siparis, type Musteri } from '../types/domain'

type Section = 'siparisler' | 'musteriler' | 'giderler' | 'analiz'

const NAV: { id: Section; label: string; Icon: React.ElementType }[] = [
  { id: 'siparisler', label: 'Siparişler', Icon: Package },
  { id: 'musteriler', label: 'Müşteriler', Icon: Users },
  { id: 'giderler',   label: 'Giderler',   Icon: TrendingDown },
  { id: 'analiz',     label: 'Analiz',      Icon: BarChart2 },
]

const DURUM_VARIANT: Record<string, 'default' | 'success' | 'warn' | 'danger' | 'info'> = {
  alinacak:   'warn',
  alindi:     'info',
  'yikanıyor':'info',
  hazir:      'success',
  dagitimda:  'warn',
  teslim:     'default',
}

export function PanelMode() {
  const { drawer, toggleDrawer } = useModeStore()
  const setMode = useModeStore(s => s.setMode)
  const [section, setSection] = useState<Section>('siparisler')

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧺</span>
          <span className="font-bold text-gray-800">Olgu Temizlik</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('assistant')}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
          >
            Asistan
          </button>
          <button
            onClick={toggleDrawer}
            className="flex items-center gap-1.5 text-xs bg-primary text-white px-3 py-1.5 rounded-full
              active:scale-95 transition-all"
          >
            <MessageSquare size={12} />
            Komut ver
          </button>
        </div>
      </header>

      {/* Nav tabs */}
      <nav className="flex bg-white border-b border-gray-200 shrink-0">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors
              ${section === id
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        {section === 'siparisler' && <SiparislerSection />}
        {section === 'musteriler' && <MusterilerSection />}
        {section === 'giderler'   && <GiderlerSection />}
        {section === 'analiz'     && <AnalizSection />}
      </div>

      {/* Assistant drawer */}
      {drawer === 'open' && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={toggleDrawer}
          />
          <div className="relative z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col"
            style={{ height: '75dvh' }}
          >
            <div className="flex justify-between items-center px-4 pt-3 pb-2 border-b border-gray-100">
              <span className="font-semibold text-sm text-gray-800">Asistan</span>
              <button onClick={toggleDrawer} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AssistantShell compact />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Siparişler ────────────────────────────────────────────────────────────────
function SiparislerSection() {
  const [data, setData] = useState<Siparis[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('aktif')

  const load = useCallback(async () => {
    setLoading(true)
    let q = sb
      .from('np_siparisler')
      .select('*, np_musteriler(ad, tel), np_siparis_kalemleri(toplam)')
      .order('olusturma', { ascending: false })
      .limit(50)

    if (filter === 'aktif') {
      q = q.in('durum', ['alinacak','alindi','yikanıyor','hazir','dagitimda'])
    } else if (filter === 'teslim') {
      q = q.eq('durum', 'teslim')
    } else if (filter === 'odenmemis') {
      q = q.eq('durum', 'teslim').eq('odendi', false)
    }

    const { data: rows } = await q
    setData((rows || []) as unknown as Siparis[])
    setLoading(false)
  }, [filter])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-3 flex flex-col gap-3">
      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {(['aktif','teslim','odenmemis'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors
              ${filter === f
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-200'
              }`}
          >
            {f === 'aktif' ? 'Aktif' : f === 'teslim' ? 'Teslim' : 'Ödenmemiş'}
          </button>
        ))}
        <button onClick={load} className="ml-auto text-gray-400 hover:text-gray-600 p-1">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && <div className="flex justify-center py-8"><Spinner size={24} className="text-primary" /></div>}

      {!loading && data.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-8">Sipariş bulunamadı</p>
      )}

      {!loading && data.map((s: any) => {
        const toplam = (s.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0)
        return (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-200 p-3 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-semibold text-sm text-gray-800">
                  {(s.np_musteriler as any)?.ad || '—'}
                </span>
                <span className="ml-2 text-xs text-gray-400">#{s.id}</span>
              </div>
              <Badge variant={DURUM_VARIANT[s.durum] || 'default'}>
                {DURUM_LABEL[s.durum as keyof typeof DURUM_LABEL] || s.durum}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{fmtTarihKisa(s.tarih)}</span>
              <span className="font-semibold text-gray-700">{toplam ? fmtTL(toplam) : '—'}</span>
            </div>
            {!s.odendi && s.durum === 'teslim' && (
              <div className="text-xs text-red-500 font-medium">⚠️ Ödeme bekleniyor</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Müşteriler ────────────────────────────────────────────────────────────────
function MusterilerSection() {
  const [data, setData] = useState<Musteri[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data: rows } = await sb
      .from('np_musteriler')
      .select('*')
      .order('ad')
      .limit(100)
    setData((rows || []) as Musteri[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{data.length} müşteri</span>
        <button onClick={load} className="text-gray-400 hover:text-gray-600 p-1">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && <div className="flex justify-center py-8"><Spinner size={24} className="text-primary" /></div>}

      {!loading && data.map(m => (
        <div key={m.id} className="bg-white rounded-2xl border border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
            {m.ad.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-800 truncate">{m.ad}</div>
            {m.tel && <div className="text-xs text-gray-400">{m.tel}</div>}
          </div>
          <Badge variant={m.tipi === 'kurumsal' ? 'info' : 'default'}>
            {m.tipi === 'kurumsal' ? 'Kurumsal' : 'Bireysel'}
          </Badge>
          <ChevronRight size={14} className="text-gray-300 shrink-0" />
        </div>
      ))}
    </div>
  )
}

// ── Giderler ──────────────────────────────────────────────────────────────────
function GiderlerSection() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toplam, setToplam] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    const { data: rows } = await sb
      .from('np_giderler')
      .select('*')
      .order('tarih', { ascending: false })
      .limit(50)
    const list = rows || []
    setData(list)
    setToplam(list.reduce((s: number, g: any) => s + (g.tutar || 0), 0))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700">Toplam: {fmtTL(toplam)}</span>
        <button onClick={load} className="text-gray-400 hover:text-gray-600 p-1">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && <div className="flex justify-center py-8"><Spinner size={24} className="text-primary" /></div>}

      {!loading && data.map(g => (
        <div key={g.id} className="bg-white rounded-2xl border border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-800">{g.kategori}</div>
            {g.aciklama && <div className="text-xs text-gray-400 truncate">{g.aciklama}</div>}
            <div className="text-xs text-gray-400 mt-0.5">{fmtTarihKisa(g.tarih)}</div>
          </div>
          <span className="font-bold text-sm text-red-600 shrink-0">{fmtTL(g.tutar)}</span>
        </div>
      ))}
    </div>
  )
}

// ── Analiz ────────────────────────────────────────────────────────────────────
function AnalizSection() {
  const { toggleDrawer } = useModeStore()

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
      <BarChart2 size={40} className="text-gray-300" />
      <p className="text-gray-500 text-sm">
        Rapor ve analiz için asistana sorun
      </p>
      <button
        onClick={toggleDrawer}
        className="flex items-center gap-2 bg-primary text-white text-sm px-4 py-2.5 rounded-xl"
      >
        <MessageSquare size={14} />
        Asistanı aç
      </button>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {['Bugünkü rapor', 'Bu ayki rapor', 'Fabrika durumu', 'Ödenmemiş siparişler'].map(q => (
          <div key={q} className="text-xs text-gray-400 bg-gray-100 px-3 py-2 rounded-xl">
            "{q}"
          </div>
        ))}
      </div>
    </div>
  )
}

// suppress linting warnings
void (DURUM_RENK as unknown)
