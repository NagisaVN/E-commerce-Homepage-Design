'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

export function getFeatures(specifications, fallback) {
  try {
    const values = Object.values(JSON.parse(specifications ?? '{}')).filter(Boolean)
    if (values.length) return values.slice(0, 3)
  } catch {
    // Use the fallback when `thong_so` is not valid JSON.
  }
  return fallback ? [fallback] : ['Sản phẩm chính hãng']
}

export function StarIcon({ filled }) {
  return <svg viewBox="0 0 12 12" className="h-3 w-3" fill={filled ? '#FBBF24' : 'none'} stroke={filled ? '#FBBF24' : '#D1D5DB'} strokeWidth={1}><path d="M6 1l1.3 3.9H11l-3 2.2 1.2 3.8L6 8.8l-3.2 2.1L4 7.1 1 4.9h3.7z" /></svg>
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addToCart(product)
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
