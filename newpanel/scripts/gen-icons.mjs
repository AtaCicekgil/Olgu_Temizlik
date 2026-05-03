// PWA ikon üretici — node scripts/gen-icons.mjs
// sharp paketi gerekli: npm install -D sharp

import sharp from 'sharp'
import { writeFileSync } from 'fs'

const SIZES = [192, 512]
const BG    = { r: 37, g: 99, b: 235, alpha: 1 }   // #2563eb

async function gen(size) {
  // Mavi kare + beyaz "O" harfi SVG
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#2563eb"/>
    <text x="50%" y="54%" font-family="Arial,sans-serif" font-size="${size * 0.5}"
      font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">O</text>
  </svg>`

  await sharp(Buffer.from(svg))
    .png()
    .toFile(`public/icon-${size}.png`)

  console.log(`✅ public/icon-${size}.png`)
  void BG
}

for (const s of SIZES) await gen(s)
