'use client'

import { useState, useEffect } from 'react'

// SVG config per brand name — maps brand name → SVG rendering props
const brandSvgConfig = {
  Samsung: { viewBox: '0 0 120 40', x: 4, y: 30, fontWeight: 700, fontSize: 28, fill: '#1428A0', displayName: 'Samsung' },
  LG: { viewBox: '0 0 60 40', x: 4, y: 30, fontWeight: 800, fontSize: 30, fill: '#A50034', displayName: 'LG' },
  Panasonic: { viewBox: '0 0 130 40', x: 2, y: 29, fontWeight: 600, fontSize: 24, fill: '#003087', displayName: 'Panasonic' },
  Sony: { viewBox: '0 0 80 40', x: 2, y: 30, fontWeight: 700, fontSize: 28, fill: '#111827', displayName: 'Sony' },
  Toshiba: { viewBox: '0 0 110 40', x: 2, y: 29, fontWeight: 700, fontSize: 26, fill: '#FF0000', displayName: 'TOSHIBA' },
  Sharp: { viewBox: '0 0 90 40', x: 2, y: 29, fontWeight: 700, fontSize: 26, fill: '#BE0028', displayName: 'SHARP' },
  Aqua: { viewBox: '0 0 80 40', x: 2, y: 30, fontWeight: 700, fontSize: 28, fill: '#0072CE', displayName: 'AQUA' },
  Daikin: { viewBox: '0 0 100 40', x: 2, y: 29, fontWeight: 700, fontSize: 26, fill: '#009FE3', displayName: 'DAIKIN' },
  Electrolux: { viewBox: '0 0 140 40', x: 2, y: 29, fontWeight: 600, fontSize: 24, fill: '#003087', displayName: 'Electrolux' },
}

// Fallback SVG config for brands not in the map
function getDefaultSvgConfig(name) {
  const charWidth = 14
  const width = Math.max(name.length * charWidth + 10, 80)
  return { viewBox: `0 0 ${width} 40`, x: 2, y: 29, fontWeight: 600, fontSize: 24, fill: '#374151', displayName: name }
}

function BrandLogo({ name }) {
  const trimmed = name.trim()
  const config = brandSvgConfig[trimmed] || getDefaultSvgConfig(trimmed)

  return (
    <svg viewBox={config.viewBox} className="h-7 w-auto">
      <text
        x={config.x}
        y={config.y}
        fontFamily="Outfit, sans-serif"
        fontWeight={config.fontWeight}
        fontSize={config.fontSize}
        fill={config.fill}
      >
        {config.displayName}
      </text>
    </svg>
  )
}

export default function Brands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await fetch('/api/data')
        const data = await response.json()

        // lệnh kèm để deploy
        const activeBrands = (data.thuong_hieu ?? [])
          .filter((b) => Number(b.trang_thai) === 1)
          .sort((a, b) => a.thu_tu_hien_thi - b.thu_tu_hien_thi)

        setBrands(activeBrands)
      } catch (error) {
        console.error('Failed to fetch brands:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-brand-pale border-b border-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-6 mb-8">
            <p className="text-sm font-semibold font-display text-gray-400 uppercase tracking-widest whitespace-nowrap">
              Top Brands
            </p>
            <div className="flex-1 h-px bg-brand-light" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl px-4 py-5 flex flex-col items-center gap-2 animate-pulse"
              >
                <div className="h-7 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-brand-pale border-b border-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-6 mb-8">
          <p className="text-sm font-semibold font-display text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Top Brands
          </p>
          <div className="flex-1 h-px bg-brand-light" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {brands.map((brand) => (
            <button
              key={brand.id}
              className="group bg-white rounded-2xl px-4 py-5 flex flex-col items-center gap-2 border border-transparent hover:border-brand-light hover:shadow-lg hover:shadow-blue-50 transition-all duration-200"
            >
              <div className="h-8 flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity">
                <BrandLogo name={brand.ten} />
              </div>
              <span className="text-xs text-gray-400 font-body group-hover:text-brand transition-colors">
                {brand.ten.trim()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
