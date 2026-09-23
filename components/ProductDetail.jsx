'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

// ── Fallback defaults (dùng khi không có chiTiet) ──────────
const defaultImages = [
  'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=900&h=900&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format',
]

const defaultRatingBreakdown = [
  { stars: 5, pct: 68 },
  { stars: 4, pct: 21 },
  { stars: 3, pct: 7 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 2 },
]

const defaultReviews = [
  {
    name: 'Nguyen Thi Lan',
    date: 'Aug 12, 2024',
    stars: 5,
    title: 'Sản phẩm rất tốt!',
    body: 'Mua trong đợt khuyến mãi và rất hài lòng. Sản phẩm hoạt động mượt mà, chất lượng vượt mong đợi. Giao hàng nhanh, lắp đặt miễn phí.',
  },
  {
    name: 'Tran Minh Duc',
    date: 'Jul 29, 2024',
    stars: 4,
    title: 'Đáng tiền, chất lượng ổn',
    body: 'Sản phẩm chắc chắn với giá hợp lý. Chất lượng build tốt, dùng ổn định. Dịch vụ hậu mãi cũng rất tận tâm.',
  },
  {
    name: 'Le Phuong Anh',
    date: 'Jul 5, 2024',
    stars: 5,
    title: 'Rất phù hợp cho gia đình',
    body: 'Dùng được 2 tháng rồi, rất hài lòng. Tiết kiệm điện thật sự so với sản phẩm cũ. Vận hành êm ái, thiết kế đẹp.',
  },
]

// ── Helper components ──────────────────────────────────────
function StarRow({ filled, half }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} viewBox="0 0 14 14" className="w-3.5 h-3.5">
          {i <= filled ? (
            <path d="M7 1l1.5 4h4.3l-3.5 2.5 1.3 4L7 9.3l-3.5 2.2 1.3-4L1.2 5h4.3z" fill="#FBBF24" />
          ) : half && i === filled + 1 ? (
            <>
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="50%" stopColor="#E5E7EB" />
                </linearGradient>
              </defs>
              <path d="M7 1l1.5 4h4.3l-3.5 2.5 1.3 4L7 9.3l-3.5 2.2 1.3-4L1.2 5h4.3z" fill="url(#half)" />
            </>
          ) : (
            <path d="M7 1l1.5 4h4.3l-3.5 2.5 1.3 4L7 9.3l-3.5 2.2 1.3-4L1.2 5h4.3z" fill="#E5E7EB" />
          )}
        </svg>
      ))}
    </div>
  )
}

function AiExplainButton({ text }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="ml-1.5 inline-flex items-center gap-1 bg-brand-pale border border-brand-light text-brand text-[11px] font-semibold font-display px-2 py-0.5 rounded-full hover:bg-brand-light transition-colors"
      >
        <svg viewBox="0 0 14 14" className="w-3 h-3" fill="none">
          <path d="M7 1.5l1 3h3l-2.4 1.8.9 2.7-2.5-1.8-2.5 1.8.9-2.7L3 4.5h3z" fill="#1D4ED8" />
          <circle cx="11" cy="2.5" r="1" fill="#60A5FA" />
        </svg>
        AI Giải thích
      </button>

      {open && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl shadow-blue-100 border border-brand-light p-4">
          <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white border-r border-b border-brand-light rotate-45" />
          <div className="flex items-start gap-2.5">
            <div className="flex-shrink-0 w-7 h-7 bg-brand-light rounded-lg flex items-center justify-center mt-0.5">
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                <path d="M8 1.5l1.2 3.6H13l-2.9 2.1 1.1 3.4L8 8.8l-3.2 1.8 1.1-3.4L3 5.1h3.8z" fill="#1D4ED8" />
                <circle cx="13" cy="3" r="1.2" fill="#60A5FA" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-brand-dark font-display mb-1.5">Giải thích AI</p>
              <p className="text-xs text-gray-600 font-body leading-relaxed">{text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BrandLogo({ name }) {
  const brandName = name?.trim() || 'TechZone'
  return (
    <svg viewBox="0 0 110 30" className="h-6 w-auto">
      <text x="2" y="24" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="24" fill="#1428A0">{brandName}</text>
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────
export default function ProductDetail({ product, chiTiet, thuongHieu, hinhAnh }) {
  const { addToCart } = useCart()
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [buyState, setBuyState] = useState('idle')
  const [cartState, setCartState] = useState('idle')
  const [activeTab, setActiveTab] = useState('specs')

  // ── Derived data from props ──────────────────────────────
  const productName = product?.ten_san_pham?.trim() || 'Sản phẩm'
  const productSku = product?.sku?.trim() || 'N/A'
  const productPrice = product?.gia || 0
  const productOriginal = product?.gia_goc || 0
  const productRating = product?.rating || 4.5
  const productViews = product?.so_lan_xem || 0
  const productStock = product?.so_luong_ton_kho || 0
  const productImage = product?.hinh_chinh?.trim() || defaultImages[0]
  const brandName = thuongHieu?.ten?.trim() || 'TechZone'

  // Tính % giảm giá
  const discount = productOriginal > 0
    ? Math.round((1 - productPrice / productOriginal) * 100)
    : 0

  // Số lượng đánh giá (dùng views như proxy)
  const reviewCount = Math.max(Math.floor(productViews * 6.2), 100)

  // Sử dụng hình chính + hình phụ từ hinhAnh (nếu có), hoặc fallback gallery
  const productImages = [productImage]
  if (hinhAnh && hinhAnh.length > 0) {
    hinhAnh.forEach(ha => {
      if (ha.image_url) productImages.push(ha.image_url.trim())
    })
  } else {
    productImages.push(...defaultImages.slice(1))
  }
  const images = productImages

  // ── Map specs từ chiTiet ─────────────────────────────────
  const specs = chiTiet?.thong_so_ky_thuat
    ? Object.entries(chiTiet.thong_so_ky_thuat).map(([attr, value]) => ({
        attr,
        value,
      }))
    : [
        { attr: 'Tên sản phẩm', value: productName },
        { attr: 'SKU', value: productSku },
        { attr: 'Đánh giá', value: `${productRating} / 5 sao` },
        { attr: 'Tình trạng', value: productStock > 0 ? `Còn ${productStock} sản phẩm` : 'Hết hàng' },
      ]

  // ── Description HTML ─────────────────────────────────────
  const descriptionHTML = chiTiet?.mo_ta_chi_tiet
    ? `<h3>Mô tả chi tiết</h3><p>${chiTiet.mo_ta_chi_tiet}</p>${
        chiTiet.chinh_sach_ban_hang
          ? `<h3>Chính sách bán hàng</h3><ul>${chiTiet.chinh_sach_ban_hang.map(cs => `<li>${cs}</li>`).join('')}</ul>`
          : ''
      }`
    : `<h3>Thông tin sản phẩm</h3><p>${product?.mo_ta_ngan?.trim() || 'Thông tin chi tiết đang được cập nhật.'}</p>`

  // ── Policy badges ────────────────────────────────────────
  const policyBadges = chiTiet?.chinh_sach_ban_hang
    ? [
        { icon: '🚚', label: chiTiet.chinh_sach_ban_hang.find(c => c.toLowerCase().includes('giao'))?.replace(/^.{0,}?(Giao)/i, 'Giao') || 'Miễn phí giao hàng', sub: 'Tận nơi' },
        { icon: '🛡️', label: chiTiet.chinh_sach_ban_hang.find(c => c.toLowerCase().includes('bảo hành'))?.split(',')[0] || 'Bảo hành chính hãng', sub: 'Chính hãng' },
        { icon: '↩️', label: chiTiet.chinh_sach_ban_hang.find(c => c.toLowerCase().includes('đổi'))?.split('(')[0]?.trim() || 'Đổi trả 30 ngày', sub: 'Dễ dàng' },
      ]
    : [
        { icon: '🚚', label: 'Miễn phí giao hàng', sub: 'Trong 3 ngày' },
        { icon: '🛡️', label: 'Bảo hành 2 năm', sub: '+ 10 năm máy nén' },
        { icon: '↩️', label: 'Đổi trả 30 ngày', sub: 'Dễ dàng' },
      ]

  // ── Handlers ─────────────────────────────────────────────
  const handleBuyNow = () => {
    addToCart()
    setBuyState('added')
    setTimeout(() => setBuyState('idle'), 2000)
  }

  const handleAddCart = () => {
    addToCart()
    setCartState('added')
    setTimeout(() => setCartState('idle'), 2000)
  }

  // ── Rating breakdown (tính từ rating) ────────────────────
  const ratingBreakdown = defaultRatingBreakdown

  // ── AI review tags ───────────────────────────────────────
  const positiveRate = Math.min(98, Math.max(75, Math.round(productRating * 20)))

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-brand-pale">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3">
          <nav className="flex items-center gap-2 text-xs font-body text-gray-400">
            <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="hover:text-brand cursor-pointer transition-colors">{brandName}</span>
            <span>/</span>
            <span className="text-gray-600 font-medium truncate max-w-[200px]">{productName}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* Left: Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group">
              <img
                src={images[activeImage]}
                alt={productName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-brand text-white text-sm font-bold font-display px-3 py-1.5 rounded-xl shadow-lg">
                  -{discount}% GIẢM
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === i
                      ? 'border-brand shadow-md shadow-blue-100 scale-95'
                      : 'border-gray-100 hover:border-brand-accent hover:scale-95'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              {policyBadges.map(b => (
                <div key={b.label} className="bg-brand-pale rounded-xl p-3 text-center border border-brand-light">
                  <div className="text-xl mb-1">{b.icon}</div>
                  <p className="text-xs font-semibold font-display text-gray-800">{b.label}</p>
                  <p className="text-[11px] text-gray-400 font-body">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product info */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <BrandLogo name={thuongHieu?.ten} />
              <span className="text-xs text-gray-400 font-body bg-gray-50 px-2.5 py-1 rounded-lg">
                SKU: {productSku}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 leading-tight">
                {productName}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <StarRow filled={Math.floor(productRating)} half={productRating % 1 >= 0.3} />
                <span className="text-sm font-bold text-amber-500 font-display">{productRating}</span>
                <span className="text-sm text-gray-400 font-body">({reviewCount.toLocaleString()} đánh giá)</span>
                <span className={`text-xs font-semibold font-display px-2 py-0.5 rounded-full ${
                  productStock > 0
                    ? 'text-green-600 bg-green-50'
                    : 'text-red-600 bg-red-50'
                }`}>
                  {productStock > 0 ? '✓ Còn hàng' : '✗ Hết hàng'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-3 border-y border-gray-100">
              <span className="text-4xl font-display font-bold text-gray-900">{productPrice.toLocaleString('vi-VN')}₫</span>
              {productOriginal > productPrice && (
                <span className="text-xl text-gray-300 line-through font-body">{productOriginal.toLocaleString('vi-VN')}₫</span>
              )}
              {discount > 0 && (
                <div className="ml-auto flex flex-col items-end">
                  <span className="text-green-600 font-bold font-display text-sm">
                    Tiết kiệm {(productOriginal - productPrice).toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-xs text-gray-400 font-body">Đã bao gồm thuế & phí</span>
                </div>
              )}
            </div>

            {/* AI Review Summary */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 p-4 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200/30 rounded-full blur-xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 bg-brand rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                      <path d="M8 1.5l1.2 3.6H13l-2.9 2.1 1.1 3.4L8 8.8l-3.2 1.8 1.1-3.4L3 5.1h3.8z" fill="white" />
                      <circle cx="13" cy="3" r="1.2" fill="#93C5FD" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold font-display text-brand-dark">✨ Tóm tắt đánh giá AI</p>
                  <span className="ml-auto text-[11px] text-brand bg-white border border-blue-200 px-2 py-0.5 rounded-full font-body">
                    Dựa trên {reviewCount.toLocaleString()} đánh giá
                  </span>
                </div>

                <p className="text-sm text-gray-700 font-body leading-relaxed mb-3">
                  {positiveRate}% người mua yêu thích sản phẩm <strong className="text-gray-900">{productName}</strong>.{' '}
                  Điểm đánh giá trung bình <span className="text-amber-700 font-medium">{productRating}/5 sao</span> — chất lượng được khẳng định qua hàng ngàn đánh giá thực tế.
                </p>

                <div className="flex flex-wrap gap-2 mb-3.5">
                  {[
                    { label: '👍 Chất lượng tốt', color: 'green' },
                    { label: '👍 Tiết kiệm điện', color: 'green' },
                    { label: '👍 Dịch vụ tốt', color: 'green' },
                    { label: '⚠️ Cần so sánh giá', color: 'amber' },
                  ].map(tag => (
                    <div
                      key={tag.label}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full font-body ${
                        tag.color === 'green'
                          ? 'bg-green-50 border border-green-200 text-green-700'
                          : 'bg-amber-50 border border-amber-200 text-amber-700'
                      }`}
                    >
                      {tag.label}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-body text-gray-400 mb-1">
                    <span>Cảm nhận chung</span>
                    <span className="text-green-600 font-semibold">{positiveRate}% Tích cực</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" style={{ width: `${positiveRate}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity + CTA */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 font-body w-16">Số lượng</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold font-display text-gray-900">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-400 font-body">
                  × {productPrice.toLocaleString('vi-VN')}₫ = <strong className="text-gray-700">{(productPrice * qty).toLocaleString('vi-VN')}₫</strong>
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBuyNow}
                  className={`flex-1 py-3.5 rounded-xl font-display font-bold text-sm transition-all duration-200 active:scale-95 shadow-lg ${
                    buyState === 'added'
                      ? 'bg-green-500 text-white shadow-green-200'
                      : 'bg-brand hover:bg-brand-dark text-white shadow-blue-200'
                  }`}
                >
                  {buyState === 'added' ? '✓ Đã đặt hàng!' : '⚡ Mua ngay'}
                </button>
                <button
                  onClick={handleAddCart}
                  className={`flex-1 py-3.5 rounded-xl font-display font-semibold text-sm border-2 transition-all duration-200 active:scale-95 ${
                    cartState === 'added'
                      ? 'bg-green-50 border-green-400 text-green-600'
                      : 'bg-white border-brand text-brand hover:bg-brand-pale'
                  }`}
                >
                  {cartState === 'added' ? '✓ Đã thêm vào giỏ' : '🛒 Thêm vào giỏ'}
                </button>
              </div>

              <p className="text-xs text-gray-400 font-body text-center">
                Miễn phí lắp đặt · Đổi trả 30 ngày · Thanh toán an toàn
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div className="flex gap-1 border-b border-gray-100 mb-8">
            {[['specs', 'Thông số kỹ thuật'], ['description', 'Mô tả'], ['reviews', 'Đánh giá']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2.5 text-sm font-semibold font-display transition-all ${
                  activeTab === key
                    ? 'text-brand border-b-2 border-brand -mb-px'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'specs' && (
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((row, i) => (
                    <tr key={row.attr} className={`border-b border-gray-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-brand-pale/40'}`}>
                      <td className="px-5 py-3.5 font-medium text-gray-500 font-body w-1/3 align-top">
                        <div className="flex items-center gap-1">
                          {row.attr}
                          {row.explain && <AiExplainButton text={row.explain} />}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800 font-display">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'description' && (
            <div
              className="prose prose-sm max-w-none text-gray-700 font-body leading-relaxed
                [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:text-base [&_h3]:mb-2 [&_h3]:mt-6 [&_h3:first-child]:mt-0
                [&_p]:mb-3 [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:list-disc [&_strong]:text-gray-900"
              dangerouslySetInnerHTML={{ __html: descriptionHTML }}
            />
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-brand-pale rounded-2xl p-6 flex flex-col items-center text-center border border-brand-light">
                <span className="text-6xl font-display font-bold text-gray-900">{productRating}</span>
                <StarRow filled={Math.floor(productRating)} half={productRating % 1 >= 0.3} />
                <span className="text-sm text-gray-400 font-body mt-1">{reviewCount.toLocaleString()} đánh giá</span>
                <div className="w-full mt-6 flex flex-col gap-2">
                  {ratingBreakdown.map(r => (
                    <div key={r.stars} className="flex items-center gap-2 text-xs font-body">
                      <span className="text-gray-400 w-4">{r.stars}★</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-gray-400 w-6 text-right">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-4">
                {defaultReviews.map(r => (
                  <div key={r.name} className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-brand-light transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold font-display text-sm text-gray-900">{r.name}</span>
                          <span className="text-[11px] text-green-600 font-body bg-green-50 px-1.5 py-0.5 rounded-full">✓ Đã xác minh</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRow filled={r.stars} />
                          <span className="text-xs text-gray-400 font-body">{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-semibold font-display text-gray-800 mb-1">{r.title}</p>
                    <p className="text-sm text-gray-500 font-body leading-relaxed">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
