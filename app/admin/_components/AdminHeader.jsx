'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdminSidebar } from './AdminSidebarContext'
import { useAuth } from '../../../context/AuthContext'
import { useAdminToast } from './AdminToast'

export default function AdminHeader() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { showToast } = useAdminToast()
  const { toggleMobileSidebar, toggleSidebar, isExpanded } = useAdminSidebar()
  const [isDark, setIsDark] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Khởi tạo Dark mode từ class của html hoặc localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark'
      setIsDark(isDarkMode)
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      }
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

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      {/* Left: Mobile hamburger & Desktop toggle + Quick Search */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 lg:hidden"
          title="Mở menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop sidebar toggle icon */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
          title={isExpanded ? 'Thu nhỏ menu' : 'Mở rộng menu'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
          </svg>
        </button>

        {/* Global Search box */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, mã đơn..."
            className="w-full py-1.5 pl-9 pr-3 text-sm bg-gray-100/80 dark:bg-gray-800 border-none rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right Actions: Store link, Dark mode, Notifications, Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick View Store */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 rounded-xl transition-colors border border-blue-200/50 dark:border-blue-800/40"
        >
          <span>Xem Cửa Hàng</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-yellow-400 dark:hover:bg-gray-800 transition-colors"
          title={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
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

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowUserMenu(false)
            }}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 relative transition-colors"
            title="Thông báo"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900 animate-pulse"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-700">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">Thông báo mới</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold dark:bg-blue-900 dark:text-blue-300">2 mới</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors cursor-pointer">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Đơn hàng mới #DH20260918001</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">Khách: Nguyễn Văn Khách - 15.030.000đ</p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1 block">5 phút trước</span>
                </div>
                <div className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Kho hàng cập nhật</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">100 sản phẩm điện máy đã sẵn sàng kinh doanh</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">Hôm nay</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              {user?.avatar || 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">
                {user?.name || 'Admin TechZone'}
              </span>
              <span className="text-[10px] text-gray-400">Super Admin</span>
            </div>
            <svg className="w-4 h-4 text-gray-400 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* User dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {user?.name || 'Admin TechZone'}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  {user?.email || 'admin@techzone.vn'}
                </p>
              </div>
              <Link
                href="/admin/cai-dat"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Thông tin tài khoản
              </Link>
              <Link
                href="/"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Trang chủ bán hàng
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  logout()
                  showToast('Đã đăng xuất khỏi tài khoản Quản trị!', 'info')
                  router.push('/dang-nhap?redirect=/admin')
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Đăng xuất Admin
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
