'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
const categoryTheme = {
  'tu-lanh': { bg: '#EFF6FF', color: '#1D4ED8' },
  'may-lanh': { bg: '#E0F2FE', color: '#0369A1' },
  'may-giat': { bg: '#EFF6FF', color: '#1D4ED8' },
  'lo-vi-song': { bg: '#F0F9FF', color: '#0284C7' },
  'noi-com-dien': { bg: '#FFF7ED', color: '#C2410C' },
  'quat-dieu-hoa': { bg: '#FFF7ED', color: '#C2410C' },
  tivi: { bg: '#F5F3FF', color: '#6D28D9' },
  'loa-thanh': { bg: '#FFF7ED', color: '#C2410C' },
}

function CategoryIcon({ slug, color }) {
  const iconProps = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'h-8 w-8' }

  if (slug === 'tu-lanh') return <svg viewBox="0 0 32 32" {...iconProps}><rect x="8" y="3" width="16" height="27" rx="3" /><line x1="8" y1="13" x2="24" y2="13" /><line x1="12" y1="8" x2="12" y2="11" /><line x1="12" y1="17" x2="12" y2="22" /></svg>
  if (slug === 'may-lanh') return <svg viewBox="0 0 32 32" {...iconProps}><rect x="3" y="8" width="26" height="10" rx="3" /><path d="M8 18v6M13 18v4M19 18v4M24 18v6" /><path d="M7 13h18" strokeDasharray="2 2" /></svg>
  if (slug === 'may-giat') return <svg viewBox="0 0 32 32" {...iconProps}><rect x="4" y="3" width="24" height="27" rx="3" /><circle cx="16" cy="19" r="6" /><circle cx="16" cy="19" r="2.5" /><circle cx="9" cy="8" r="1.5" fill={color} stroke="none" /><circle cx="14" cy="8" r="1.5" fill="#60A5FA" stroke="none" /></svg>
  if (slug === 'lo-vi-song') return <svg viewBox="0 0 32 32" {...iconProps}><rect x="2" y="7" width="28" height="18" rx="3" /><rect x="5" y="10" width="17" height="12" rx="2" /><circle cx="26" cy="14" r="1.2" fill={color} stroke="none" /><circle cx="26" cy="18" r="1.2" fill={color} stroke="none" /></svg>
  if (slug === 'loa-thanh') return <svg viewBox="0 0 32 32" {...iconProps}><rect x="4" y="6" width="24" height="20" rx="3" /><rect x="6" y="15" width="20" height="6" rx="1.5" /><circle cx="16" cy="9" r="3.5" /></svg>
  if (slug === 'tivi') return <svg viewBox="0 0 32 32" {...iconProps}><rect x="3" y="5" width="26" height="18" rx="2" /><path d="M12 28h8M16 23v5" /></svg>
  return <svg viewBox="0 0 32 32" {...iconProps}><rect x="5" y="4" width="22" height="24" rx="3" /><path d="M9 10h14M9 16h14M9 22h9" /></svg>
}

export default function Categories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/data')
        if (!response.ok) throw new Error('Unable to load category data')
        const data = await response.json()
        const products = data.san_pham ?? []

        setCategories(
          (data.danh_muc_san_pham ?? [])
            .filter(category => Number(category.trang_thai) === 1)
            .sort((a, b) => Number(a.thu_tu_hien_thi) - Number(b.thu_tu_hien_thi))
            .map(category => ({
              ...category,
              slug: category.slug.trim(),
              name: category.ten.trim(),
              productCount: products.filter(product => Number(product.id_danh_muc) === Number(category.id)).length,
            }))
        )
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    fetchCategories()
  }, [])

  return (
    <section className="border-b border-gray-100 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="mb-10 flex items-end justify-between">
          <div><p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand font-display">Khám phá</p><h2 className="text-3xl font-bold text-gray-900 font-display">Danh Mục Sản Phẩm</h2></div>
          <a href="#" className="hidden text-sm font-medium text-brand hover:underline font-body sm:block">Xem tất cả danh mục →</a>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map(category => {
            const theme = categoryTheme[category.slug] ?? { bg: '#F3F4F6', color: '#4B5563' }
            return (
              <Link key={category.id} href={`/danh-muc-san-pham/${category.slug}`} className="group flex cursor-pointer flex-col items-center gap-3.5">
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-[0_12px_28px_rgba(37,99,235,0.24)] sm:h-20 sm:w-20" style={{ backgroundColor: theme.bg }}>
                  <CategoryIcon slug={category.slug} color={theme.color} />
                </div>
                <div className="text-center"><p className="text-sm font-semibold leading-tight text-gray-800 transition-colors group-hover:text-brand font-display">{category.name}</p><p className="mt-0.5 text-xs text-gray-400 font-body">{category.productCount} mẫu</p></div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
