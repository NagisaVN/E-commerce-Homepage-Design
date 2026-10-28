'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const FALLBACK_BANNERS = [
  {
    id: 1,
    image: 'https://iili.io/n8BWyDx.jpg',
    backupUrl: 'https://files.catbox.moe/jxc9gk.jpg',
    ctaHref: '/khuyen-mai',
    badge: '🎉 Khuyến Mãi Tết',
    headline: 'Đón Tết Cùng\nThiết Bị Thông Minh',
    sub: 'Giảm đến 40% cho tủ lạnh cao cấp, máy lạnh & hơn thế nữa — Ưu đãi có hạn',
    cta: 'Mua Sắm Ngay',
    ctaNote: 'Miễn phí vận chuyển mọi đơn hàng',
    badgeColor: '#FCD34D',
    badgeText: '#92400E',
    overlay: 'linear-gradient(100deg, rgba(15,23,92,0.93) 0%, rgba(29,78,216,0.72) 55%, rgba(29,78,216,0.1) 100%)',
  },
  {
    id: 3,
    image: 'https://iili.io/n8BXufI.jpg',
    backupUrl: 'https://files.catbox.moe/mjlcod.jpg',
    ctaHref: '/danh-muc-san-pham/may-lanh',
    badge: '☀️ Ưu Đãi Mùa Hè',
    headline: 'Máy Lạnh Inverter\nTiết Kiệm Tối Đa',
    sub: 'Máy lạnh Inverter đạt chuẩn tiết kiệm điện — giảm hóa đơn điện năng lên đến 60%',
    cta: 'Xem Các Mẫu',
    ctaNote: 'Trả góp 24 tháng, lãi suất 0%',
    badgeColor: '#6EE7B7',
    badgeText: '#064E3B',
    overlay: 'linear-gradient(100deg, rgba(7,36,78,0.93) 0%, rgba(37,99,235,0.72) 55%, rgba(37,99,235,0.1) 100%)',
  },
  {
    id: 4,
    image: 'https://iili.io/n8BXcbf.jpg',
    backupUrl: 'https://files.catbox.moe/qk9pdg.jpg',
    ctaHref: '/danh-muc-san-pham/tu-lanh',
    badge: '🤖 Sản Phẩm Mới 2024',
    headline: 'Tủ Lạnh Thông Minh\nTích Hợp AI Đã Ra Mắt',
    sub: 'Điều khiển bằng giọng nói, cảm biến độ tươi và tự động đặt hàng tạp hóa — tương lai của sự tươi mới',
    cta: 'Khám Phá Ngay',
    ctaNote: 'Bao gồm 2 năm bảo hành mở rộng',
    badgeColor: '#C4B5FD',
    badgeText: '#4C1D95',
    overlay: 'linear-gradient(100deg, rgba(30,26,89,0.95) 0%, rgba(67,56,202,0.75) 55%, rgba(67,56,202,0.1) 100%)',
  },
]

export default function Hero() {
  const [slides, setSlides] = useState(FALLBACK_BANNERS)
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await fetch('/api/data')
        if (!response.ok) throw new Error('Unable to load banner data')
        const data = await response.json()
        const banners = data.banner ?? []

        const heroSlides = banners
          .filter((banner) => Number(banner.trang_thai) === 1)
          .sort((a, b) => a.thu_tu_hien_thi - b.thu_tu_hien_thi)
          .map((banner) => ({
            ...banner,
            image: banner.url ? banner.url.trim() : '',
            ctaHref: banner.link ? banner.link.trim() : '/khuyen-mai',
          }))

        if (heroSlides.length > 0) {
          setSlides(heroSlides)
        }
      } catch (err) {
        console.warn('Lỗi tải banner từ API, sử dụng danh sách banner mặc định:', err)
      }
    }

    fetchBanners()
  }, [])

  const goTo = useCallback((index) => {
    if (index === current) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 300)
  }, [current])

  useEffect(() => {
    // Chưa tải xong, hoặc chỉ có 1 banner: không tự chuyển
    if (slides.length < 2) return

    const timer = setInterval(() => {
      goTo((current + 1) % slides.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [current, goTo, slides.length])

  if (slides.length === 0) return null
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
            alt={s.headline ? s.headline.replace('\n', ' ') : 'Banner khuyến mãi'}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
            onError={(e) => {
              if (s.backupUrl && e.currentTarget.src !== s.backupUrl) {
                e.currentTarget.src = s.backupUrl
              }
            }}
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
            <Link
              href={slide.ctaHref || '/tim-kiem-ai'}
              className="bg-white text-brand-dark px-7 py-3 rounded-xl font-display font-semibold hover:bg-brand-light active:scale-95 transition-all shadow-lg inline-block"
            >
              {slide.cta} →
            </Link>
            <span className="text-blue-200 text-sm font-body">{slide.ctaNote}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-400 ${i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
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
