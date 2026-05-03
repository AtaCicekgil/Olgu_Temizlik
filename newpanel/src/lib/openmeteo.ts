// Open-Meteo API — ücretsiz, API key gerektirmez
// https://open-meteo.com/

const KOORD: Record<string, { lat: number; lon: number }> = {
  ankara:   { lat: 39.93, lon: 32.85 },
  istanbul: { lat: 41.01, lon: 28.95 },
  izmir:    { lat: 38.42, lon: 27.14 },
  konya:    { lat: 37.87, lon: 32.48 },
  bursa:    { lat: 40.18, lon: 29.06 },
  antalya:  { lat: 36.88, lon: 30.70 },
}

const WMO: Record<number, string> = {
  0: 'Açık', 1: 'Az bulutlu', 2: 'Parçalı bulutlu', 3: 'Kapalı',
  45: 'Sisli', 48: 'Kırağılı sis',
  51: 'Hafif çisenti', 53: 'Orta çisenti', 55: 'Yoğun çisenti',
  61: 'Hafif yağmur', 63: 'Orta yağmur', 65: 'Şiddetli yağmur',
  71: 'Hafif kar', 73: 'Orta kar', 75: 'Yoğun kar',
  80: 'Hafif sağanak', 81: 'Orta sağanak', 82: 'Şiddetli sağanak',
  95: 'Gök gürültülü fırtına', 96: 'Dolu ile fırtına', 99: 'Yoğun dolu ile fırtına',
}

export interface HavaDurumu {
  sehir:      string
  sicaklik:   number
  hissedilen: number
  durum:      string
  nem:        number
  ruzgar:     number   // km/h
  tahmin:     GunTahmin[]
  hali_uyari: boolean  // yağmur/kar varsa true
}

interface GunTahmin {
  gun:     string  // "Pazartesi"
  max:     number
  min:     number
  durum:   string
  yagisli: boolean
}

export async function havaDurumuGetir(sehir: string): Promise<HavaDurumu> {
  const key = sehir.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const koord = KOORD[key] || KOORD['ankara']

  const url = `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${koord.lat}&longitude=${koord.lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
    `&timezone=Europe%2FIstanbul&forecast_days=4`

  const res  = await fetch(url)
  if (!res.ok) throw new Error(`Hava durumu alınamadı: ${res.status}`)
  const json = await res.json()

  const c = json.current
  const d = json.daily

  const gunler = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi']

  const tahmin: GunTahmin[] = (d.time as string[]).slice(0, 4).map((tarih: string, i: number) => {
    const wmo  = d.weather_code[i] as number
    const gun  = new Date(tarih + 'T12:00:00').getDay()
    const yagisli = wmo >= 51
    return {
      gun:     gunler[gun],
      max:     Math.round(d.temperature_2m_max[i]),
      min:     Math.round(d.temperature_2m_min[i]),
      durum:   WMO[wmo] || 'Bilinmiyor',
      yagisli,
    }
  })

  const bugunWmo = c.weather_code as number
  const hali_uyari = tahmin.slice(0, 3).some(t => t.yagisli)

  return {
    sehir,
    sicaklik:   Math.round(c.temperature_2m),
    hissedilen: Math.round(c.apparent_temperature),
    durum:      WMO[bugunWmo] || 'Bilinmiyor',
    nem:        c.relative_humidity_2m,
    ruzgar:     Math.round(c.wind_speed_10m),
    tahmin,
    hali_uyari,
  }
}
