import { useEffect } from 'react'
import { ModeController } from './modes/ModeController'
import { ToastContainer } from './components/ui/Toast'
import { sb } from './lib/supabase'

function useHatirlaticiNotifications() {
  useEffect(() => {
    if (!('Notification' in window)) return

    const run = async () => {
      // Sadece izin önceden verilmişse çalış — otomatik sorma
      if (Notification.permission !== 'granted') return

      try {
        const bugun = new Date().toISOString().slice(0, 10)
        const { data } = await sb
          .from('np_hatirlatici')
          .select('*')
          .eq('tarih', bugun)
          .eq('gonderildi', false)

        if (!data?.length) return

        for (const h of data) {
          new Notification('Olgu Temizlik Hatırlatıcı', {
            body: h.hatirlatici_notu || h.baslik || 'Hatırlatıcı',
            icon: '/icon-192.png',
          })
        }

        const ids = data.map((h: any) => h.id)
        await sb.from('np_hatirlatici').update({ gonderildi: true }).in('id', ids)
      } catch {
        // Tablo henüz yoksa sessizce geç
      }
    }

    run()
    // Re-check every 10 minutes
    const interval = setInterval(run, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
}

export default function App() {
  useHatirlaticiNotifications()

  return (
    <>
      <div className="h-full w-full overflow-hidden">
        <ModeController />
      </div>
      <ToastContainer />
    </>
  )
}
