'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

function LogoIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
      <rect width="32" height="32" rx="8" fill="#1D4ED8" />
      <path d="M8 22V13l8-6 8 6v9H8z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      <rect x="13" y="16" width="6" height="6" rx="1" stroke="white" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 flex-shrink-0">
      <path d="M10 2l1.5 5h5l-4 3 1.5 5-4-3-4 3 1.5-5-4-3h5z" fill="#1D4ED8" opacity="0.8" />
      <circle cx="15.5" cy="4.5" r="1.5" fill="#60A5FA" />
      <circle cx="4" cy="14" r="1" fill="#60A5FA" opacity="0.6" />
    </svg>
  )
}

export default function Header() {
  const [focused, setFocused] = useState(false)
  const { cartCount } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="bg-brand-dark text-white text-xs py-1.5 text-center font-body tracking-wide">
        Free shipping on orders over $299 · 24/7 AI Support Available
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-5 h-16">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <LogoIcon />
            <span className="text-xl font-bold font-display text-brand-dark tracking-tight">
              Cool<span className="text-brand">Home</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 ml-2">
            {['Products', 'Brands', 'Deals', 'Support'].map(item => (
              <Link
                key={item}
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-brand transition-colors font-body"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex-1 max-w-2xl mx-auto">
            <div
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 bg-brand-pale transition-all duration-200 ${
                focused
                  ? 'border-brand shadow-lg shadow-blue-100 bg-white'
                  : 'border-brand-light hover:border-brand-accent'
              }`}
            >
              <SparkIcon />
              <input
                type="text"
                placeholder="Ask AI: Find a fridge for a family of 4 under $500..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none font-body min-w-0"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              <button className="flex-shrink-0 bg-brand hover:bg-brand-dark text-white px-4 py-1.5 rounded-lg text-sm font-semibold font-display transition-colors">
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-brand-light text-gray-600 hover:text-brand transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-sm font-medium font-body hidden sm:block">Sign In</span>
            </button>

            <button className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-brand-light text-gray-600 hover:text-brand transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className="text-sm font-medium font-body hidden sm:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
