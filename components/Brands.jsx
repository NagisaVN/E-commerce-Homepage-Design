'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BrandLogo from './BrandLogo'

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
    <section className="py-12 bg-brand-pale dark:bg-gray-900/60 border-b border-brand-light dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-6 mb-8">
          <p className="text-sm font-semibold font-display text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
            Top Brands
          </p>
          <div className="flex-1 h-px bg-brand-light dark:bg-gray-800" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/thuong-hieu/${brand.slug?.trim()}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl px-3 py-4 sm:py-5 flex flex-col items-center justify-center gap-2.5 border border-transparent dark:border-gray-700/60 hover:border-brand-light dark:hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-50 dark:hover:shadow-none transition-all duration-200 text-center"
            >
              <div className="h-10 sm:h-11 w-full flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-105 dark:opacity-95 dark:brightness-125 transition-all duration-200">
                <BrandLogo name={brand.ten} size="md" />
              </div>
              <span className="text-[11px] sm:text-xs text-center text-gray-400 dark:text-gray-400 font-body group-hover:text-brand dark:group-hover:text-blue-400 transition-colors truncate max-w-full block font-medium">
                {brand.ten.trim()}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
