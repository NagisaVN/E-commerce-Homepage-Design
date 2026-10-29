'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import AiSearchModal from './AiSearchModal'

function LogoIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8">
      <rect width="32" height="32" rx="8" fill="#1D4ED8" />
      <path d="M8 22V13l8-6 8 6v9H8z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="13" y="16" width="6" height="6" rx="1" stroke="white" strokeWidth="1.5" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 flex-shrink-0 animate-pulse">
      <path d="M10 2l1.5 5h5l-4 3 1.5 5-4-3-4 3 1.5-5-4-3h5z" fill="#1D4ED8" opacity="0.9" />
      <circle cx="15.5" cy="4.5" r="1.5" fill="#60A5FA" />
      <circle cx="4" cy="14" r="1" fill="#60A5FA" opacity="0.6" />
    </svg>
  )
}

function HeaderSearchBox({ value, onChange, onSubmit, onOpenModal }) {
  const [focused, setFocused] = useState(false)

  return (
    <form
      onSubmit={onSubmit}
      className={`flex items-center gap-2 rounded-xl border-2 bg-brand-pale dark:bg-gray-800 px-3 py-1.5 transition-all duration-200 sm:gap-3 sm:px-4 sm:py-2 ${
        focused
          ? 'border-brand dark:border-blue-500 bg-white dark:bg-gray-800 shadow-lg shadow-blue-100 dark:shadow-none'
          : 'border-brand-light dark:border-gray-700 hover:border-brand-accent'
      }`}
    >
      <button
        type="button"
        onClick={() => onOpenModal(value)}
        className="flex items-center text-brand dark:text-blue-400 hover:scale-110 transition-transform flex-shrink-0 cursor-pointer"
        title="Mở Trợ lý AI"
      >
        <SparkIcon />
      </button>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={() => {
          // Khi click vào ô tìm kiếm thì có thể mở Modal AI trải nghiệm cao cấp
          if (!value) onOpenModal('')
        }}
        placeholder="Tìm kiếm sản phẩm, hỏi AI..."
        aria-label="Tìm kiếm sản phẩm với AI"
        className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-gray-700 dark:text-gray-200 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 font-body"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button
        type="submit"
        className="flex-shrink-0 whitespace-nowrap rounded-lg bg-brand px-3 py-1.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:px-4 font-display shadow-xs active:scale-95 cursor-pointer"
      >
        Tìm kiếm
      </button>
    </form>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [modalInitialQuery, setModalInitialQuery] = useState('')
  const [isDark, setIsDark] = useState(false)
  const { cartCount } = useCart()
  const { user, isAdmin, isStaff, isManager, logout } = useAuth()
  const router = useRouter()

  // Khởi tạo và đồng bộ trạng thái Dark/Light mode từ html class hoặc localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = localStorage.getItem('theme') === 'dark'
      setIsDark(isDarkMode)
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains('dark'))
      })
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
      return () => observer.disconnect()
    }
  }, [])

  const toggleDarkMode = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const navItems = [
    { name: 'Sản phẩm', href: '/san-pham' },
    { name: 'Thương hiệu', href: '/thuong-hieu' },
    { name: 'Khuyến mãi', href: '/khuyen-mai' },
    { name: 'Tin tức AI', href: '/tin-tuc' },
    { name: 'Tra cứu đơn', href: '/don-hang/theo-doi' },
    { name: 'Hỗ trợ', href: '/ho-tro' },
  ]

  // Lắng nghe sự kiện toàn cục 'open-ai-search' để mở modal từ các component khác
  useEffect(() => {
    const handleGlobalAiOpen = (e) => {
      const q = e.detail || ''
      setModalInitialQuery(q)
      setAiModalOpen(true)
    }

    window.addEventListener('open-ai-search', handleGlobalAiOpen)
    return () => window.removeEventListener('open-ai-search', handleGlobalAiOpen)
  }, [])

  const handleOpenAiModal = (initQuery = '') => {
    setModalInitialQuery(initQuery || searchVal)
    setAiModalOpen(true)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchVal.trim()) {
      handleOpenAiModal('')
      return
    }
    // Mở popup AI trực tiếp
    handleOpenAiModal(searchVal.trim())
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 shadow-xs backdrop-blur-sm transition-colors">
        <div className="bg-brand-dark py-1.5 text-center text-xs font-body tracking-wide text-white flex items-center justify-center gap-2">
          <span>Miễn phí vận chuyển đơn hàng từ 299K &middot;</span>
          <button
            onClick={() => handleOpenAiModal('Tư vấn sản phẩm phù hợp ngân sách')}
            className="underline hover:text-amber-300 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>✨ Hỗ trợ AI 24/7 (Thử ngay)</span>
          </button>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-2.5 sm:gap-4 lg:gap-5">
            <Link href="/" className="group flex flex-shrink-0 items-center gap-2 sm:gap-2.5">
              <LogoIcon />
              <span className="text-xl font-bold tracking-tight text-brand-dark dark:text-white font-display">
                Tech<span className="text-brand dark:text-blue-400">Zone</span>
              </span>
            </Link>

            {/* Menu điều hướng chính: không để co giãn làm gãy dòng */}
            <nav className="ml-1 xl:ml-3 hidden flex-shrink-0 items-center gap-2.5 xl:gap-5 lg:flex" aria-label="Primary navigation">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="whitespace-nowrap text-xs xl:text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-brand dark:hover:text-blue-400 font-body"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mx-2 hidden min-w-0 max-w-xl xl:max-w-2xl flex-1 md:block">
              <HeaderSearchBox
                value={searchVal}
                onChange={setSearchVal}
                onSubmit={handleSearchSubmit}
                onOpenModal={handleOpenAiModal}
              />
            </div>

            <div className="flex flex-shrink-0 items-center gap-1 sm:gap-1.5 xl:gap-2">
              {/* Nút chuyển đổi Giao diện Sáng / Tối */}
              <button
                onClick={toggleDarkMode}
                type="button"
                className="p-2 rounded-xl text-gray-600 hover:text-yellow-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-yellow-400 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                title={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
                aria-label="Chuyển chế độ sáng tối"
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Trạng thái User / Đăng nhập */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      {user.avatar || 'U'}
                    </div>
                    <span className="hidden whitespace-nowrap text-xs font-semibold font-body lg:block max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <svg className="w-3.5 h-3.5 text-gray-400 hidden lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50">
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                            : user.role === 'staff'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        }`}>
                          {user.role === 'admin' ? 'Quản trị viên' : user.role === 'staff' ? 'Nhân viên vận hành' : 'Khách hàng'}
                        </span>
                      </div>

                      {isManager && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition-colors"
                        >
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Bảng điều khiển {user.role === 'admin' ? 'Quản Trị' : 'Vận Hành'}
                        </Link>
                      )}

                      <Link
                        href="/don-hang"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Đơn hàng của tôi
                      </Link>

                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                          router.push('/')
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/dang-nhap"
                  aria-label="Đăng nhập"
                  className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-gray-600 dark:text-gray-300 transition-colors hover:bg-brand-light dark:hover:bg-gray-800 hover:text-brand dark:hover:text-blue-400 sm:px-2.5 xl:px-3"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 flex-shrink-0">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="hidden whitespace-nowrap text-sm font-medium font-body lg:block">Đăng nhập</span>
                </Link>
              )}

              <Link
                href="/gio-hang"
                aria-label="Giỏ hàng"
                className="relative flex items-center gap-1.5 rounded-lg px-2 py-2 text-gray-600 dark:text-gray-300 transition-colors hover:bg-brand-light dark:hover:bg-gray-800 hover:text-brand dark:hover:text-blue-400 sm:px-2.5 xl:px-3"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 flex-shrink-0">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <span className="hidden whitespace-nowrap text-sm font-medium font-body lg:block">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                aria-label="Mở menu điều hướng"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className="rounded-lg p-2 text-gray-600 dark:text-gray-300 transition-colors hover:bg-brand-light dark:hover:bg-gray-800 hover:text-brand dark:hover:text-blue-400 lg:hidden cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
                  {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>
          </div>

          <div className="pb-3 md:hidden">
            <HeaderSearchBox
              value={searchVal}
              onChange={setSearchVal}
              onSubmit={handleSearchSubmit}
              onOpenModal={handleOpenAiModal}
            />
          </div>

          {menuOpen && (
            <nav className="border-t border-gray-100 dark:border-gray-800 py-2 lg:hidden space-y-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors hover:bg-brand-light dark:hover:bg-gray-800 hover:text-brand dark:hover:text-blue-400 font-body"
                >
                  {item.name}
                </Link>
              ))}

              {/* Nút chuyển sáng tối trên Mobile menu */}
              <button
                onClick={toggleDarkMode}
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>{isDark ? '☀️ Giao diện Sáng' : '🌙 Giao diện Tối'}</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  {isDark ? 'Bật Sáng' : 'Bật Tối'}
                </span>
              </button>

              <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2">
                {isManager && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 font-body"
                  >
                    <span>🛡️ Bảng điều khiển {user?.role === 'admin' ? 'Quản Trị' : 'Vận Hành'}</span>
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      logout()
                      router.push('/')
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-body cursor-pointer"
                  >
                    Đăng xuất ({user.name})
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2 px-1 pt-1">
                    <Link
                      href="/dang-nhap"
                      onClick={() => setMenuOpen(false)}
                      className="text-center rounded-lg py-2 text-xs font-semibold text-brand dark:text-blue-400 bg-brand-pale dark:bg-gray-800 hover:bg-brand-light"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/dang-nhap?redirect=/admin"
                      onClick={() => setMenuOpen(false)}
                      className="text-center rounded-lg py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Vào Admin
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Modal Tìm kiếm AI tương tác cao cấp */}
      <AiSearchModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        initialQuery={modalInitialQuery}
      />
    </>
  )
}
