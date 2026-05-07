import { motion } from 'framer-motion'
import type { ResultCard as IResultCard } from '../types/tools'
import { Badge } from '../components/ui/Badge'
import { fmtTL, fmtTarihKisa } from '../lib/utils'
import { DURUM_LABEL } from '../types/domain'
import { useModeStore } from '../store/mode.store'

const card = { initial:{ opacity:0, y:6 }, animate:{ opacity:1, y:0 }, transition:{ duration:0.18 } }

export function ResultCard({ card: c }: { card: IResultCard }) {
  switch (c.type) {
    case 'rapor':          return <RaporCard data={c.data as any} />
    case 'siparis_liste':  return <SiparisListeCard data={c.data as any[]} />
    case 'siparis_detay':  return <SiparisDetayCard data={c.data as any} />
    case 'musteri_liste':  return <MusteriListeCard data={c.data as any[]} />
    case 'musteri_detay':  return <MusteriDetayCard data={c.data as any} />
    case 'gider_liste':    return <GiderListeCard data={c.data as any[]} meta={c.meta} />
    case 'basit':          return <BasitCard data={c.data} />
    case 'yeni_siparis':   return <YeniSiparisCard data={c.data as any} />
    default:               return null
  }
}

// ── Rapor ─────────────────────────────────────────────────────────────────────
function RaporCard({ data }: { data: any }) {
  return (
    <motion.div className="rounded-2xl bg-white border border-gray-200 overflow-hidden text-sm" {...card}>
      <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-100 text-xs font-semibold text-blue-700 uppercase tracking-wide">
        Rapor — {data.donem}
      </div>
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        <Stat label="Gelir" value={fmtTL(data.gelir)} cls="text-green-700" />
        <Stat label="Gider" value={fmtTL(data.gider)} cls="text-red-600" />
        <Stat label="Kâr"   value={fmtTL(data.kar)}   cls={data.kar >= 0 ? 'text-blue-700' : 'text-red-600'} />
      </div>
      {data.siparis_sayisi > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
          {data.siparis_sayisi} ödenen sipariş
          {Object.keys(data.gider_dagilim || {}).length > 0 && (
            <span className="ml-2">· {Object.entries(data.gider_dagilim).map(([k,v]) => `${k} ${fmtTL(v as number)}`).join(', ')}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ── Sipariş Liste ─────────────────────────────────────────────────────────────
function SiparisListeCard({ data }: { data: any[] }) {
  if (!data?.length) return null
  return (
    <motion.div className="flex flex-col gap-1.5" {...card}>
      {data.slice(0, 8).map((s: any) => {
        const toplam = (s.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0)
        return (
          <div key={s.id} className="bg-white border border-gray-200 rounded-2xl px-3 py-2.5 flex items-center gap-2 text-sm">
            <div className="flex-1 min-w-0">
              <span className="font-medium text-gray-800">{s.np_musteriler?.ad || '—'}</span>
              <span className="text-gray-400 text-xs ml-1.5">#{s.id}</span>
            </div>
            <DurumBadge durum={s.durum} />
            {toplam > 0 && <span className="text-xs font-semibold text-gray-600 shrink-0">{fmtTL(toplam)}</span>}
          </div>
        )
      })}
      {data.length > 8 && <div className="text-xs text-gray-400 text-center py-1">+{data.length - 8} daha</div>}
    </motion.div>
  )
}

// ── Sipariş Detay ─────────────────────────────────────────────────────────────
function SiparisDetayCard({ data }: { data: any }) {
  if (!data) return null
  const kalemler = data.np_siparis_kalemleri || []
  const kalemToplam = kalemler.reduce((a: number, k: any) => a + (k.toplam || 0), 0)
  const genelToplam = kalemToplam - (data.indirim_tutar || 0) + (data.ek_ucret || 0)

  return (
    <motion.div className="rounded-2xl bg-white border border-gray-200 overflow-hidden text-sm" {...card}>
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Sipariş #{data.id}</span>
        <DurumBadge durum={data.durum} />
      </div>
      {data.np_musteriler && (
        <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500 flex gap-4">
          <span>👤 {data.np_musteriler.ad}</span>
          {data.np_musteriler.tel && <span>📱 {data.np_musteriler.tel}</span>}
        </div>
      )}
      {kalemler.length > 0 && (
        <div className="divide-y divide-gray-100">
          {kalemler.map((k: any) => (
            <div key={k.id} className="px-4 py-2 flex items-center justify-between text-xs">
              <span className="text-gray-700">{k.np_cinsler?.ad || 'Cins?'} × {k.adet}</span>
              <div className="flex items-center gap-2">
                {k.m2 && <span className="text-gray-400">{k.m2} m²</span>}
                {k.m2_sonra && <Badge variant="warn">m2 eksik</Badge>}
                <span className="font-medium">{k.toplam ? fmtTL(k.toplam) : '—'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 flex justify-between text-xs">
        <div className="flex gap-3 text-gray-400">
          {data.tarih && <span>Alındı: {fmtTarihKisa(data.tarih)}</span>}
          {data.teslim_tarihi && <span>Teslim: {fmtTarihKisa(data.teslim_tarihi)}</span>}
        </div>
        <div className="flex items-center gap-2">
          {data.indirim_tutar > 0 && <span className="text-green-600">-{fmtTL(data.indirim_tutar)}</span>}
          {data.ek_ucret > 0 && <span className="text-amber-600">+{fmtTL(data.ek_ucret)}</span>}
          <span className="font-bold text-gray-800">{fmtTL(genelToplam)}</span>
          {data.odendi && <Badge variant="success">Ödendi</Badge>}
        </div>
      </div>
      {data.siparis_notu && (
        <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-500 italic">📝 {data.siparis_notu}</div>
      )}
    </motion.div>
  )
}

// ── Müşteri Liste ─────────────────────────────────────────────────────────────
function MusteriListeCard({ data }: { data: any[] }) {
  if (!data?.length) return null
  return (
    <motion.div className="flex flex-col gap-1.5" {...card}>
      {data.slice(0, 6).map((m: any) => (
        <div key={m.id} className="bg-white border border-gray-200 rounded-2xl px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
            {m.ad.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-800 truncate">{m.ad}</div>
            {m.tel && <div className="text-xs text-gray-400">{m.tel}</div>}
          </div>
          <Badge variant={m.tipi === 'kurumsal' ? 'info' : 'default'}>
            {m.tipi === 'kurumsal' ? 'Kurumsal' : 'Bireysel'}
          </Badge>
        </div>
      ))}
      {data.length > 6 && <div className="text-xs text-gray-400 text-center py-1">+{data.length - 6} daha</div>}
    </motion.div>
  )
}

// ── Müşteri Detay ─────────────────────────────────────────────────────────────
function MusteriDetayCard({ data }: { data: any }) {
  if (!data) return null
  const adres = [data.adres_mahalle, data.adres_sokak, data.adres_bina, data.adres_daire].filter(Boolean).join(', ')
  const siparisler = data.siparisler || []
  const toplamTutar = siparisler.reduce((s: number, sp: any) =>
    s + (sp.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0), 0)

  return (
    <motion.div className="rounded-2xl bg-white border border-gray-200 overflow-hidden text-sm" {...card}>
      <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
          {data.ad.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-800">{data.ad}</div>
          <div className="text-xs text-gray-400 flex gap-3 mt-0.5">
            {data.tel && <span>{data.tel}</span>}
            <Badge variant={data.tipi === 'kurumsal' ? 'info' : 'default'}>
              {data.tipi === 'kurumsal' ? 'Kurumsal' : 'Bireysel'}
            </Badge>
          </div>
        </div>
      </div>
      {adres && (
        <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500">📍 {adres}</div>
      )}
      <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
        <Stat label="Sipariş" value={String(siparisler.length)} />
        <Stat label="Toplam" value={fmtTL(toplamTutar)} />
      </div>
      {siparisler.slice(0, 3).map((s: any) => {
        const t = (s.np_siparis_kalemleri || []).reduce((a: number, k: any) => a + (k.toplam || 0), 0)
        return (
          <div key={s.id} className="px-4 py-2 flex items-center justify-between text-xs border-t border-gray-100 first:border-t-0">
            <span className="text-gray-500">#{s.id} · {fmtTarihKisa(s.tarih)}</span>
            <div className="flex items-center gap-2">
              <DurumBadge durum={s.durum} />
              {t > 0 && <span className="font-medium">{fmtTL(t)}</span>}
            </div>
          </div>
        )
      })}
      {data.notlar && <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 italic">📝 {data.notlar}</div>}
    </motion.div>
  )
}

// ── Gider Liste ───────────────────────────────────────────────────────────────
function GiderListeCard({ data, meta }: { data: any[]; meta?: Record<string, unknown> }) {
  if (!data?.length) return null
  return (
    <motion.div className="rounded-2xl bg-white border border-gray-200 overflow-hidden text-sm" {...card}>
      {meta?.toplam !== undefined && (
        <div className="px-4 py-2.5 bg-red-50 border-b border-red-100 text-xs font-semibold text-red-700 flex justify-between">
          <span>Toplam Gider</span>
          <span>{fmtTL(meta.toplam as number)}</span>
        </div>
      )}
      <div className="divide-y divide-gray-100">
        {data.slice(0, 8).map((g: any) => (
          <div key={g.id} className="px-4 py-2.5 flex items-center justify-between">
            <div>
              <span className="text-gray-800 font-medium">{g.kategori}</span>
              {g.aciklama && <span className="text-gray-400 text-xs ml-2">{g.aciklama}</span>}
              <div className="text-xs text-gray-400 mt-0.5">{fmtTarihKisa(g.tarih)}</div>
            </div>
            <span className="font-bold text-red-600 shrink-0">{fmtTL(g.tutar)}</span>
          </div>
        ))}
      </div>
      {data.length > 8 && <div className="text-xs text-gray-400 text-center py-2">+{data.length - 8} daha</div>}
    </motion.div>
  )
}

// ── Basit (generic) ───────────────────────────────────────────────────────────
function BasitCard({ data }: { data: unknown }) {
  if (typeof data !== 'object' || !data) return null
  return (
    <motion.div className="rounded-2xl bg-white border border-gray-200 text-xs divide-y divide-gray-100" {...card}>
      {Object.entries(data as Record<string, unknown>).slice(0, 12).map(([k, v]) => (
        <div key={k} className="flex justify-between px-3 py-2 gap-2">
          <span className="text-gray-400 shrink-0">{k}</span>
          <span className="text-gray-800 text-right truncate font-medium">{String(v)}</span>
        </div>
      ))}
    </motion.div>
  )
}

// ── Yeni Sipariş Oluşturuldu ──────────────────────────────────────────────────
function YeniSiparisCard({ data }: { data: any }) {
  const setMode = useModeStore(s => s.setMode)
  if (!data) return null
  return (
    <motion.div className="rounded-2xl bg-green-50 border border-green-200 overflow-hidden text-sm" {...card}>
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg shrink-0">
          ✅
        </div>
        <div className="flex-1">
          <div className="font-semibold text-green-800">Sipariş #{data.id} oluşturuldu</div>
          <div className="text-xs text-green-600 mt-0.5">Alınacak siparişlere eklendi</div>
        </div>
        <Badge variant="warn">Alınacak</Badge>
      </div>
      {(data.teslim_tarihi || data.siparis_notu) && (
        <div className="px-4 pb-2 flex gap-4 text-xs text-green-700">
          {data.teslim_tarihi && <span>📅 Teslim: {fmtTarihKisa(data.teslim_tarihi)}</span>}
          {data.siparis_notu  && <span>📝 {data.siparis_notu}</span>}
        </div>
      )}
      <div className="px-4 pb-3">
        <button
          onClick={() => setMode('panel')}
          className="w-full text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200
            active:scale-95 transition-all py-2 rounded-xl"
        >
          Siparişleri Gör →
        </button>
      </div>
    </motion.div>
  )
}

// ── Shared ────────────────────────────────────────────────────────────────────
function Stat({ label, value, cls = 'text-gray-800' }: { label: string; value: string; cls?: string }) {
  return (
    <div className="flex flex-col items-center py-3 gap-0.5">
      <span className="text-[11px] text-gray-400">{label}</span>
      <span className={`font-bold text-base ${cls}`}>{value}</span>
    </div>
  )
}

function DurumBadge({ durum }: { durum: string }) {
  const variant: Record<string, 'default'|'info'|'warn'|'success'|'danger'> = {
    alinacak: 'warn', alindi: 'info', 'yikanıyor': 'info', hazir: 'success', dagitimda: 'warn', teslim: 'default',
  }
  return <Badge variant={variant[durum] || 'default'}>{DURUM_LABEL[durum as keyof typeof DURUM_LABEL] || durum}</Badge>
}
