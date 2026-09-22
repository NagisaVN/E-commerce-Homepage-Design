'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

function getFeatures(specifications, fallback) {
  try {
    const values = Object.values(JSON.parse(specifications ?? '{}')).filter(Boolean)
    if (values.length) return values.slice(0, 3)
  } catch {
    // Use the fallback when `thong_so` is not valid JSON.
  }
  return fallback ? [fallback] : ['Sản phẩm chính hãng']
}

function StarIcon({ filled }) {
  return <svg viewBox="0 0 12 12" className="h-3 w-3" fill={filled ? '#FBBF24' : 'none'} stroke={filled ? '#FBBF24' : '#D1D5DB'} strokeWidth={1}><path d="M6 1l1.3 3.9H11l-3 2.2 1.2 3.8L6 8.8l-3.2 2.1L4 7.1 1 4.9h3.7z" /></svg>
}

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addToCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-brand-light hover:shadow-2xl hover:shadow-blue-50">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {product.discount > 0 && <div className="absolute left-3 top-3 rounded-lg bg-brand px-2.5 py-1 text-xs font-bold text-white font-display">-{product.discount}%</div>}
        {product.tag && <div className="absolute right-3 top-3 rounded-lg border border-brand-light bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand backdrop-blur-sm font-display">{product.tag}</div>}
        <div className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-xs text-white backdrop-blur-sm font-body">{product.category}</div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div><p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand font-display">{product.brand}</p><h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 font-display">{product.name}</h3></div>
        <div className="flex flex-wrap gap-1.5">{product.features.map(feature => <span key={feature} className="rounded-full bg-brand-pale px-2 py-0.5 text-xs text-brand-dark font-body">{feature}</span>)}</div>
        <div className="flex items-center gap-1.5"><div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={i <= Math.floor(product.rating)} />)}</div><span className="text-xs font-semibold text-amber-500">{product.rating}</span><span className="text-xs text-gray-400 font-body">({product.reviews.toLocaleString('vi-VN')})</span></div>
        <div className="mt-auto flex items-baseline gap-2"><span className="text-xl font-bold text-gray-900 font-display">{product.price.toLocaleString('vi-VN')}₫</span>{product.original > product.price && <span className="text-sm text-gray-400 line-through font-body">{product.original.toLocaleString('vi-VN')}₫</span>}</div>
        <div className="flex gap-2">
          <Link href={`/product/${product.slug || product.id}`} className="flex-1 rounded-xl border border-brand py-2.5 text-center text-sm font-semibold text-brand transition-colors hover:bg-brand-pale font-display">Xem</Link>
          <button onClick={handleAdd} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all active:scale-95 font-display ${added ? 'bg-green-500' : 'bg-brand hover:bg-brand-dark'}`}>{added ? '✓ Đã thêm' : 'Thêm vào giỏ'}</button>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [tabs, setTabs] = useState(['Tất cả'])
  const [activeTab, setActiveTab] = useState('Tất cả')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/data')
        if (!response.ok) throw new Error('Unable to load product data')
        const data = await response.json()
        const brandById = new Map((data.thuong_hieu ?? []).map(brand => [Number(brand.id), brand.ten.trim()]))
        const categoryById = new Map((data.danh_muc_san_pham ?? []).map(category => [Number(category.id), category.ten.trim()]))
        const categoryTabs = [...new Set((data.danh_muc_san_pham ?? []).filter(category => Number(category.trang_thai) === 1).map(category => category.ten.trim()))]

        setTabs(['Tất cả', ...categoryTabs])
        setProducts(
          (data.san_pham ?? [])
            .filter(product => Number(product.trang_thai) === 1)
            .sort((a, b) => Number(b.noi_bat) - Number(a.noi_bat) || Number(b.so_lan_xem) - Number(a.so_lan_xem))
            .slice(0, 6)
            .map(product => {
              const price = Number(product.gia) || 0
              const original = Number(product.gia_goc) || price
              const discount = original > price ? Math.round(((original - price) / original) * 100) : 0
              return {
                id: product.id,
                slug: product.slug?.trim(),
                name: product.ten_san_pham.trim(),
                brand: brandById.get(Number(product.id_thuong_hieu)) ?? 'Thương hiệu',
                category: categoryById.get(Number(product.id_danh_muc)) ?? 'Sản phẩm',
                price,
                original,
                discount,
                rating: Number(product.rating) || 4.5,
                reviews: Number(product.so_lan_xem) || 0,
                tag: Number(product.noi_bat) === 1 ? 'Nổi bật' : discount >= 15 ? 'Ưu đãi' : null,
                image: product.hinh_chinh?.trim(),
                features: getFeatures(product.thong_so, product.bao_hanh),
              }
            })
        )
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    fetchProducts()
  }, [])

  const filtered = activeTab === 'Tất cả' ? products : products.filter(product => product.category === activeTab)

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="mb-8 flex items-end justify-between"><div><p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand font-display">Tuần này</p><h2 className="text-3xl font-bold text-gray-900 font-display">Sản Phẩm Nổi Bật</h2></div><a href="#" className="hidden text-sm font-medium text-brand hover:underline font-body sm:block">Xem tất cả sản phẩm →</a></div>
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">{tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all font-display ${activeTab === tab ? 'bg-brand text-white shadow-lg shadow-blue-200' : 'bg-brand-pale text-gray-600 hover:bg-brand-light hover:text-brand'}`}>{tab}</button>)}</div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(product => <ProductCard key={product.id} product={product} />)}</div>
      </div>
    </section>
  )
}
