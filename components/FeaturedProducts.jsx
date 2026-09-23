'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

import ProductCard, { getFeatures } from './ProductCard'

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

  const filtered = (activeTab === 'Tất cả' ? products : products.filter(product => product.category === activeTab)).slice(0, 6)

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
