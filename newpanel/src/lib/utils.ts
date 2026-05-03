export const bugun = () => new Date().toISOString().split('T')[0]

export const fmtTL = (n: number) =>
  '₺' + n.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export const fmtTarih = (d: string | null) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const fmtTarihKisa = (d: string | null) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

export const uid = () => Math.random().toString(36).slice(2, 10)

export const adresStr = (mahalle?: string | null, sokak?: string | null, bina?: string | null, daire?: string | null) => {
  return [mahalle, sokak, bina, daire].filter(Boolean).join(', ')
}
