'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminSidebar } from './AdminSidebarContext'
import { useAuth } from '../../../context/AuthContext'

export default function AdminSidebar() {
  const pathname = usePathname()
  const { isExpanded, isMobileOpen, closeMobileSidebar, toggleSidebar } = useAdminSidebar()

  const navGroups = [
    {
      group: 'TỔNG QUAN',
      items: [
        {
          title: 'Dashboard',
          href: '/admin',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ),
          exact: true,
        },
      ],
    },
    {
      group: 'BÁN HÀNG & KHO',
      items: [
        {
          title: 'Sản phẩm',
          href: '/admin/san-pham',
          badge: '100',
          badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
        },
        {
          title: 'Đơn hàng',
          href: '/admin/don-hang',
          badge: 'Mới',
          badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          ),
        },
        {
          title: 'Khách hàng',
          href: '/admin/khach-hang',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
        {
          title: 'Quản lý danh mục',
          href: '/admin/danh-muc',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
        },
        {
          title: 'Quản lý thương hiệu',
          href: '/admin/thuong-hieu',
          badge: '9 hãng',
          badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          ),
        },
        {
          title: 'Tin tức & Khuyến mãi',
          href: '/admin/tin-tuc',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          ),
        },
      ],
    },
    {
      group: 'HỆ THỐNG',
      items: [
        {
          title: 'Cài đặt hệ thống',
          href: '/admin/cai-dat',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          title: 'Xem trang mua sắm',
          href: '/',
          external: true,
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          ),
        },
      ],
    },
  ]

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-50 flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-20'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className={`flex items-center h-16 border-b border-gray-100 dark:border-gray-800 px-4 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
          <Link href="/admin" className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden group" title="Trang chủ Quản trị TechZone">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 shadow-md shadow-blue-500/20 text-white font-bold text-lg group-hover:scale-105 transition-transform">
              TZ
            </div>
            {isExpanded && (
              <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                <span className="font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight truncate text-sm">
                  TechZone <span className="text-blue-600 text-xs px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 ml-1 font-bold">Admin</span>
                </span>
                <span className="text-[11px] text-gray-400 font-medium truncate">Hệ thống quản trị v2.0</span>
              </div>
            )}
          </Link>

          {/* Close on mobile only */}
          <button
            onClick={closeMobileSidebar}
            type="button"
            className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden cursor-pointer rounded-lg"
            title="Đóng menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {isExpanded && (
                <div className="px-3 pb-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500 tracking-wider">
                  {group.group}
                </div>
              )}
              {group.items.map((item, iIdx) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))

                return (
                  <Link
                    key={iIdx}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    title={!isExpanded ? item.title : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative
                      ${isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white'
                      }
                      ${!isExpanded ? 'justify-center px-2' : ''}
                    `}
                  >
                    <span className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110'}`}>
                      {item.icon}
                    </span>

                    {isExpanded && (
                      <span className="flex-1 truncate">{item.title}</span>
                    )}

                    {isExpanded && item.badge && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-gray-100 text-gray-600'}`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {!isExpanded && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                        {item.title}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer: Thông tin Tài Khoản Đang Đăng Nhập (Động theo role Admin / Staff) */}
        {(() => {
          const isAdmin = user?.role === 'admin'
          const displayName = user?.name || (isAdmin ? 'Quản Trị Viên' : 'Nhân Viên Vận Hành')
          const displayEmail = user?.email || (isAdmin ? 'admin@techzone.vn' : 'nhanvien@techzone.vn')
          const roleLabel = isAdmin ? 'Super Admin' : 'Nhân Viên Vận Hành'
          const avatarInitials = isAdmin ? 'AD' : 'NV'
          const bgBadge = isAdmin ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'

          return (
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex-shrink-0">
              {isExpanded ? (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 shadow-xs">
                  <div className="relative flex-shrink-0">
                    <div className={`w-9 h-9 rounded-full ${bgBadge} font-bold flex items-center justify-center text-xs shadow-xs`}>
                      {avatarInitials}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800"></span>
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-gray-800 dark:text-white truncate">{displayName}</p>
                    </div>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate">{roleLabel}</p>
                    <p className="text-[10px] text-gray-400 truncate">{displayEmail}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center py-1">
                  <div className="relative group cursor-pointer" title={`${displayName} (${roleLabel} - ${displayEmail})`}>
                    <div className={`w-10 h-10 rounded-full ${bgBadge} font-bold flex items-center justify-center text-xs shadow-xs hover:ring-2 hover:ring-blue-500 transition-all`}>
                      {avatarInitials}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800"></span>

                    <div className="absolute left-full ml-3 bottom-0 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                      {displayName} ({roleLabel})
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })()}
      </aside>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}
    </>
  )
}
