'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

function LogoIcon() {
  return <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8"><rect width="32" height="32" rx="8" fill="#1D4ED8" /><path d="M8 22V13l8-6 8 6v9H8z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" /><rect x="13" y="16" width="6" height="6" rx="1" stroke="white" strokeWidth="1.5" /></svg>
}

function SparkIcon() {
  return <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 flex-shrink-0"><path d="M10 2l1.5 5h5l-4 3 1.5 5-4-3-4 3 1.5-5-4-3h5z" fill="#1D4ED8" opacity="0.8" /><circle cx="15.5" cy="4.5" r="1.5" fill="#60A5FA" /><circle cx="4" cy="14" r="1" fill="#60A5FA" opacity="0.6" /></svg>
}

export default function Header() {
  const [focused, setFocused] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const navItems = ['Products', 'Brands', 'Deals', 'Support']

  const SearchBox = () => (
    <div className={`flex items-center gap-2.5 rounded-xl border-2 bg-brand-pale px-3 py-2 transition-all duration-200 sm:gap-3 sm:px-4 sm:py-2.5 ${focused ? 'border-brand bg-white shadow-lg shadow-blue-100' : 'border-brand-light hover:border-brand-accent'}`}>
      <SparkIcon />
      <input type="text" placeholder="Ask AI: Find a fridge for a family of 4 under $500..." aria-label="Search products with AI" className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 font-body" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      <button className="flex-shrink-0 rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:px-4 font-display">Search</button>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="bg-brand-dark py-1.5 text-center text-xs font-body tracking-wide text-white">Free shipping on orders over $299 &middot; 24/7 AI Support Available</div>

      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center gap-3 sm:gap-5">
          <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5"><LogoIcon /><span className="text-xl font-bold tracking-tight text-brand-dark font-display">Tech<span className="text-brand">Zone</span></span></Link>

          <nav className="ml-2 hidden items-center gap-5 xl:flex" aria-label="Primary navigation">
            {navItems.map(item => <Link key={item} href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-brand font-body">{item}</Link>)}
          </nav>

          <div className="mx-auto hidden max-w-2xl flex-1 md:block"><SearchBox /></div>

          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
            <Link href="/dangnhap" aria-label="Sign in" className="flex items-center gap-2 rounded-lg px-2 py-2 text-gray-600 transition-colors hover:bg-brand-light hover:text-brand sm:px-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg><span className="hidden text-sm font-medium font-body 2xl:block">Sign In</span></Link>
            <Link href="/giohang" aria-label="Cart" className="relative flex items-center gap-1.5 rounded-lg px-2 py-2 text-gray-600 transition-colors hover:bg-brand-light hover:text-brand sm:px-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg><span className="hidden text-sm font-medium font-body 2xl:block">Cart</span>{cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{cartCount}</span>}</Link>
            <button type="button" aria-label="Toggle navigation menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)} className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-brand-light hover:text-brand xl:hidden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">{menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg></button>
          </div>
        </div>

        <div className="pb-3 md:hidden"><SearchBox /></div>
        {menuOpen && <nav className="border-t border-gray-100 py-2 xl:hidden" aria-label="Mobile navigation">{navItems.map(item => <Link key={item} href="#" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-light hover:text-brand font-body">{item}</Link>)}</nav>}
      </div>
    </header>
  )
}
