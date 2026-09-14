'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

const products = [
  {
    id: 1,
    name: 'Samsung 4-Door French Door Fridge',
    brand: 'Samsung',
    category: 'Refrigerator',
    price: 489,
    original: 799,
    discount: 39,
    rating: 4.8,
    reviews: 1284,
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=500&fit=crop&auto=format',
    features: ['617L capacity', 'No Frost', 'A+++ Energy'],
  },
  {
    id: 2,
    name: 'LG 9kg Front Load Washing Machine',
    brand: 'LG',
    category: 'Washing Machine',
    price: 369,
    original: 549,
    discount: 33,
    rating: 4.7,
    reviews: 847,
    tag: 'Tet Deal',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop&auto=format',
    features: ['TurboWash™ 360°', 'AI DD Motor', '1400 RPM'],
  },
  {
    id: 3,
    name: 'Panasonic 18000 BTU Inverter AC',
    brand: 'Panasonic',
    category: 'Air Conditioner',
    price: 449,
    original: 649,
    discount: 31,
    rating: 4.6,
    reviews: 523,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format',
    features: ['Inverter tech', 'EcoNavi', '-15°C Heating'],
  },
  {
    id: 4,
    name: 'Samsung Smart Microwave 32L',
    brand: 'Samsung',
    category: 'Microwave',
    price: 199,
    original: 289,
    discount: 31,
    rating: 4.5,
    reviews: 412,
    tag: 'AI Powered',
    image: 'https://images.unsplash.com/photo-1556909144-f2a5ac8d1a80?w=500&h=500&fit=crop&auto=format',
    features: ['Voice control', '32L capacity', 'Auto cook'],
  },
  {
    id: 5,
    name: 'Bosch Series 6 Dishwasher',
    brand: 'Bosch',
    category: 'Dishwasher',
    price: 679,
    original: 949,
    discount: 28,
    rating: 4.9,
    reviews: 218,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500&h=500&fit=crop&auto=format',
    features: ['14 place settings', 'PerfectDry', 'Wi-Fi Home Connect'],
  },
  {
    id: 6,
    name: 'LG ThinQ 500L Smart Fridge',
    brand: 'LG',
    category: 'Refrigerator',
    price: 399,
    original: 599,
    discount: 33,
    rating: 4.7,
    reviews: 651,
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=500&h=500&fit=crop&auto=format',
    features: ['InstaView Door', 'Linear Compressor', 'SmartDiagnosis™'],
  },
]

const tabs = ['All', 'Refrigerators', 'Air Conditioners', 'Washing Machines', 'Microwaves']

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 12 12" className="w-3 h-3" fill={filled ? '#FBBF24' : 'none'} stroke={filled ? '#FBBF24' : '#D1D5DB'} strokeWidth={1}>
      <path d="M6 1l1.3 3.9H11l-3 2.2 1.2 3.8L6 8.8l-3.2 2.1L4 7.1 1 4.9h3.7z" />
    </svg>
  )
}

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-brand-light hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-brand text-white text-xs font-bold font-display px-2.5 py-1 rounded-lg">
          -{product.discount}%
        </div>
        {product.tag && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border border-brand-light text-brand text-xs font-semibold font-display px-2.5 py-1 rounded-lg">
            {product.tag}
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-body">
          {product.category}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-xs text-brand font-semibold font-display uppercase tracking-wide mb-1">{product.brand}</p>
          <h3 className="text-sm font-semibold font-display text-gray-900 leading-snug line-clamp-2">{product.name}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.features.map(f => (
            <span key={f} className="text-xs bg-brand-pale text-brand-dark px-2 py-0.5 rounded-full font-body">
              {f}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <StarIcon key={i} filled={i <= Math.floor(product.rating)} />
            ))}
          </div>
          <span className="text-xs font-semibold text-amber-500">{product.rating}</span>
          <span className="text-xs text-gray-400 font-body">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-xl font-bold font-display text-gray-900">${product.price}</span>
          <span className="text-sm text-gray-400 line-through font-body">${product.original}</span>
          <span className="text-xs text-green-600 font-semibold font-display ml-auto">
            Save ${product.original - product.price}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            href={product.id === 1 ? '/product/samsung-inverter-208l' : `/product/${product.id}`}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-display text-center border border-brand text-brand hover:bg-brand-pale transition-colors"
          >
            View
          </Link>
          <button
            onClick={handleAdd}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold font-display transition-all duration-200 active:scale-95 ${
              added ? 'bg-green-500 text-white' : 'bg-brand hover:bg-brand-dark text-white'
            }`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = activeTab === 'All'
    ? products
    : products.filter(p => p.category.startsWith(activeTab.slice(0, -1)))

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand text-sm font-semibold font-display uppercase tracking-widest mb-1">This Week</p>
            <h2 className="text-3xl font-display font-bold text-gray-900">Featured Products</h2>
          </div>
          <a href="#" className="text-sm text-brand font-medium hover:underline font-body hidden sm:block">
            View all products →
          </a>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 mb-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium font-display transition-all ${
                activeTab === tab
                  ? 'bg-brand text-white shadow-lg shadow-blue-200'
                  : 'bg-brand-pale text-gray-600 hover:bg-brand-light hover:text-brand'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
