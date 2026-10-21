'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'

const SAMPLE_PROMPTS = [
  { label: 'Tủ lạnh 4 người dưới 10 triệu', query: 'Tìm tủ lạnh cho gia đình 4 người dưới 10 triệu', icon: '❄️' },
  { label: 'Máy lạnh Inverter phòng 15m²', query: 'Máy lạnh Inverter tiết kiệm điện phòng 15m2', icon: '🌬️' },
  { label: 'Máy giặt cửa trước giặt êm', query: 'Máy giặt cửa trước chạy êm tiết kiệm điện', icon: '🧺' },
  { label: 'Smart TV 4K phòng khách', query: 'Smart TV 4K cho phòng khách rộng', icon: '📺' },
  { label: 'Nồi cơm điện giá rẻ', query: 'Nồi cơm điện giá rẻ tiết kiệm điện', icon: '🍚' },
]

export default function AiSearchModal({ isOpen, onClose, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [addedId, setAddedId] = useState(null)
  const inputRef = useRef(null)
  const modalRef = useRef(null)
  const router = useRouter()
  const { addToCart } = useCart()

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery)
      setTimeout(() => inputRef.current?.focus(), 100)
      if (initialQuery.trim()) {
        executeSearch(initialQuery.trim())
      }
    } else {
      setResult(null)
    }
  }, [isOpen, initialQuery])

  // Lắng nghe phím ESC để đóng modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const executeSearch = async (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/ai-search?q=${encodeURIComponent(searchQuery.trim())}`)
      const data = await res.json()
      if (data.success) {
        setResult(data)
      }
    } catch (err) {
      console.error('Lỗi tìm kiếm AI:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    executeSearch(query)
  }

  const handlePromptClick = (pQuery) => {
    setQuery(pQuery)
    executeSearch(pQuery)
  }

  const handleAddToCart = (product, e) => {
    e.stopPropagation()
    addToCart(product, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1800)
  }

  const handleViewFullPage = () => {
    onClose()
    if (query.trim()) {
      router.push(`/tim-kiem-ai?q=${encodeURIComponent(query.trim())}`)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden my-auto sm:my-8 transition-all"
      >
        {/* Header với hiệu ứng AI Gradient */}
        <div className="bg-gradient-to-r from-brand-dark via-brand to-indigo-700 p-5 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-amber-300">
                  <path d="M10 2l1.5 5h5l-4 3 1.5 5-4-3-4 3 1.5-5-4-3h5z" fill="currentColor" />
                  <circle cx="15.5" cy="4.5" r="1.5" fill="#93C5FD" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold font-display leading-tight flex items-center gap-2">
                  Trợ lý Mua sắm AI TechZone
                  <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold uppercase px-2 py-0.5 rounded-full">
                    AI Powered
                  </span>
                </h2>
                <p className="text-xs text-blue-200 font-body">
                  Mô tả nhu cầu bằng tiếng Việt tự nhiên: ngân sách, diện tích phòng, số người...
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              aria-label="Đóng cửa sổ"
            >
              ✕
            </button>
          </div>

          {/* Ô nhập liệu tìm kiếm AI */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Hỏi AI: Tìm tủ lạnh cho gia đình 4 người dưới 10 triệu..."
                className="w-full bg-white text-gray-800 text-sm sm:text-base font-body pl-4 pr-28 py-3.5 rounded-2xl shadow-inner outline-none border-2 border-transparent focus:border-amber-400 transition-all placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-1.5 bg-brand hover:bg-brand-dark disabled:bg-gray-300 text-white font-display font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Đang tìm...</span>
                  </>
                ) : (
                  <>
                    <span>✨ Phân tích</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Gợi ý câu hỏi nhanh (Prompt Pills) */}
          <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-blue-200 whitespace-nowrap font-medium text-[11px]">Gợi ý:</span>
            {SAMPLE_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(p.query)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all text-xs flex items-center gap-1"
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nội dung kết quả tìm kiếm */}
        <div className="p-5 sm:p-6 max-h-[62vh] overflow-y-auto">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-brand-accent/40 flex items-center justify-center animate-pulse">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-brand animate-spin" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="16" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 text-lg">✨</div>
              </div>
              <div>
                <p className="font-display font-bold text-gray-800 text-base">
                  TechZone AI đang xử lý yêu cầu...
                </p>
                <p className="text-xs text-gray-500 font-body mt-1">
                  Đang đối soát thông số 100 sản phẩm, mức giá và công nghệ tiết kiệm điện tối ưu
                </p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-6">
              {/* Thẻ tư vấn tổng hợp từ AI */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50/60 to-brand-pale rounded-2xl p-4 sm:p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-2 text-brand-dark font-display font-bold text-sm">
                  <span className="text-lg">🤖</span>
                  <span>Kết luận & Lời khuyên từ TechZone AI</span>
                </div>

                <p className="text-sm text-gray-700 font-body leading-relaxed mb-3">
                  {result.summary}
                </p>

                {result.advice && (
                  <div className="bg-white/80 rounded-xl p-3 border border-blue-100 text-xs text-gray-700 font-body mb-3">
                    <p dangerouslySetInnerHTML={{ __html: result.advice.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                )}

                {/* Các tiêu chí mà AI đã nhận diện */}
                {result.criteriaTags && result.criteriaTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-gray-500 font-medium self-center mr-1">Tiêu chí bóc tách:</span>
                    {result.criteriaTags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-white text-brand border border-blue-200 px-2.5 py-0.5 rounded-full font-medium shadow-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Danh sách sản phẩm được AI đề xuất */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-gray-900 text-base flex items-center gap-2">
                    Top {result.products.length} Lựa Chọn Phù Hợp Nhất
                  </h3>
                  <button
                    onClick={handleViewFullPage}
                    className="text-xs font-semibold text-brand hover:underline font-body"
                  >
                    Mở trang đầy đủ →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.products.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl border border-gray-100 p-3.5 flex gap-3.5 hover:border-brand-accent hover:shadow-lg transition-all duration-200 relative overflow-hidden"
                    >
                      {/* Badge Match Rate AI */}
                      <div className="absolute top-2 right-2 bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold font-display px-2 py-0.5 rounded-full z-10">
                        {product.aiMatchPercent}% Phù hợp
                      </div>

                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0 pr-12">
                        <div>
                          <p className="text-[11px] font-semibold text-brand uppercase tracking-wider font-display">
                            {product.brand}
                          </p>
                          <Link
                            href={`/san-pham/${product.slug || product.id}`}
                            onClick={onClose}
                            className="font-display font-bold text-sm text-gray-900 hover:text-brand transition-colors line-clamp-2 leading-snug mt-0.5"
                          >
                            {product.name}
                          </Link>

                          {/* Điểm nổi bật mà AI chọn */}
                          {product.aiReasons && product.aiReasons.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {product.aiReasons.map((reason, rIdx) => (
                                <span
                                  key={rIdx}
                                  className="text-[10px] bg-brand-pale text-brand-dark px-1.5 py-0.5 rounded font-body"
                                >
                                  ✓ {reason}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-gray-50">
                          <div>
                            <span className="font-display font-bold text-base text-brand">
                              {product.price.toLocaleString('vi-VN')}₫
                            </span>
                            {product.original > product.price && (
                              <span className="text-xs text-gray-400 line-through ml-2 font-body">
                                {product.original.toLocaleString('vi-VN')}₫
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              className={`text-xs font-display font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                                addedId === product.id
                                  ? 'bg-green-600 text-white'
                                  : 'bg-brand hover:bg-brand-dark text-white'
                              }`}
                            >
                              {addedId === product.id ? '✓ Đã thêm' : '+ Giỏ'}
                            </button>
                            <Link
                              href={`/san-pham/${product.slug || product.id}`}
                              onClick={onClose}
                              className="text-xs font-display font-semibold px-2 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Xem
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="py-10 text-center">
              <div className="w-14 h-14 bg-blue-50 text-brand rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
                💡
              </div>
              <h4 className="font-display font-bold text-gray-800 text-base mb-1">
                Tìm kiếm thông minh hỗ trợ bởi AI
              </h4>
              <p className="text-sm text-gray-500 font-body max-w-md mx-auto mb-6">
                Bạn không cần nhớ chính xác mã sản phẩm. Hãy nói cho AI biết bạn cần mua thiết bị gì, cho ai dùng, diện tích phòng bao nhiêu và ngân sách tối đa!
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                {SAMPLE_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(p.query)}
                    className="text-xs bg-gray-50 hover:bg-brand-pale hover:text-brand border border-gray-200 rounded-xl px-3 py-2 font-body transition-colors"
                  >
                    {p.icon} {p.query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer của Modal */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-between text-xs text-gray-500 font-body">
          <div className="flex items-center gap-3">
            <span>Bấm <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono text-[11px]">ESC</kbd> để đóng</span>
            <span>&middot;</span>
            <span>Hỗ trợ 100 sản phẩm điện máy trong kho TechZone</span>
          </div>
          {result && (
            <button
              onClick={handleViewFullPage}
              className="font-semibold text-brand hover:underline font-display"
            >
              Xem trang kết quả đầy đủ →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
