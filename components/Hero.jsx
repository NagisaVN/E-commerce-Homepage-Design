'use client'

import { useState, useEffect, useCallback } from 'react'

const slides = [
  {
    id: 0,
    badge: '🎉 Tết Holiday Sale',
    headline: 'Welcome Tết with\nSmart Home Upgrades',
    sub: 'Save up to 40% on premium refrigerators, air conditioners & more — limited time offer',
    cta: 'Shop Tết Deals',
    ctaNote: 'Free shipping on all orders',
    badgeColor: '#FCD34D',
    badgeText: '#92400E',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=700&fit=crop&auto=format',
    overlay: 'linear-gradient(100deg, rgba(15,23,92,0.93) 0%, rgba(29,78,216,0.72) 55%, rgba(29,78,216,0.1) 100%)',
  },
  {
    id: 1,
    badge: '☀️ Summer Savings',
    headline: 'Inverter ACs That\nPay for Themselves',
    sub: 'Energy-star rated inverter air conditioners — cut electricity bills by up to 60%',
    cta: 'Browse ACs',
    ctaNote: '24-month financing, 0% interest',
    badgeColor: '#6EE7B7',
    badgeText: '#064E3B',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=700&fit=crop&auto=format',
    overlay: 'linear-gradient(100deg, rgba(7,36,78,0.93) 0%, rgba(37,99,235,0.72) 55%, rgba(37,99,235,0.1) 100%)',
  },
  {
    id: 2,
    badge: '🤖 New Arrival 2024',
    headline: 'AI-Powered Smart\nRefrigerators Are Here',
    sub: 'Voice control, freshness sensors, and auto grocery ordering — the future of freshness',
    cta: 'Discover AI Fridges',
    ctaNote: '2-year extended warranty included',
    badgeColor: '#C4B5FD',
    badgeText: '#4C1D95',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=1600&h=700&fit=crop&auto=format',
    overlay: 'linear-gradient(100deg, rgba(30,26,89,0.95) 0%, rgba(67,56,202,0.75) 55%, rgba(67,56,202,0.1) 100%)',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((index) => {
    if (index === current) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 300)
  }, [current])

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [current, goTo])

  const slide = slides[current]

  return (
    <section className="relative overflow-hidden" style={{ height: 'min(540px, 62vw)', minHeight: '380px' }}>
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0" style={{ background: s.overlay }} />
        </div>
      ))}

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center">
        <div className={`max-w-xl transition-all duration-500 ${animating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}>
          <span
            className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold font-display uppercase tracking-widest mb-5"
            style={{ backgroundColor: slide.badgeColor, color: slide.badgeText }}
          >
            {slide.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-4 whitespace-pre-line">
            {slide.headline}
          </h1>
          <p className="text-blue-100 text-base leading-relaxed mb-8 max-w-md">
            {slide.sub}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-white text-brand-dark px-7 py-3 rounded-xl font-display font-semibold hover:bg-brand-light active:scale-95 transition-all shadow-lg">
              {slide.cta} →
            </button>
            <span className="text-blue-200 text-sm font-body">{slide.ctaNote}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-400 ${
              i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/15 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/15 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="absolute top-5 right-6 z-20 text-white/60 text-sm font-body tabular-nums">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  )
}
