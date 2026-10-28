'use client'

import React from 'react'
import Link from 'next/link'
import { AdminSidebarProvider, useAdminSidebar } from './_components/AdminSidebarContext'
import AdminSidebar from './_components/AdminSidebar'
import AdminHeader from './_components/AdminHeader'
import { ToastProvider } from './_components/AdminToast'
import { useAuth } from '../../context/AuthContext'

function AdminLayoutContent({ children }) {
  const { isExpanded } = useAdminSidebar()

  return (
    <div className="min-h-screen bg-gray-50/70 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isExpanded ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {/* Top Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 text-center text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-gray-800">
          © 2026 TechZone E-Commerce Admin Dashboard. Thiết kế & phát triển cho hệ sinh thái TechZone.
        </footer>
      </div>
    </div>
  )
}

function AdminAuthGuard({ children }) {
  const { user, isAdmin, isStaff, isManager, isInitialized, quickLoginAsAdmin, quickLoginAsStaff } = useAuth()

  // Khi đang nạp dữ liệu session
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Đang kiểm tra quyền truy cập Quản trị...</p>
        </div>
      </div>
    )
  }

  // Nếu chưa đăng nhập quyền Admin hoặc Nhân viên (Staff)
  if (!isManager) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 font-body">
        <div className="w-full max-w-md bg-white/10 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-2 font-display">
            Yêu Cầu Quyền Quản Trị
          </h2>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            Khu vực này chỉ dành riêng cho Ban Quản trị và Nhân viên vận hành TechZone. Vui lòng đăng nhập để truy cập các tính năng quản lý.
          </p>

          {user && (
            <div className="mb-6 p-3 bg-white/10 rounded-xl text-xs text-amber-300 border border-amber-400/30">
              Bạn đang đăng nhập dưới tài khoản: <strong>{user.email}</strong> (Chưa có quyền Quản trị hoặc Nhân viên).
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/dang-nhap?redirect=/admin"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Đến trang Đăng nhập</span>
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => quickLoginAsAdmin()}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 font-medium text-xs transition-colors cursor-pointer"
              >
                <span>⚡ Vào vai Admin</span>
              </button>
              <button
                onClick={() => quickLoginAsStaff()}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-medium text-xs transition-colors cursor-pointer"
              >
                <span>💼 Vào vai Nhân viên</span>
              </button>
            </div>

            <Link
              href="/"
              className="block pt-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              ← Quay lại Cửa hàng TechZone
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default function AdminLayout({ children }) {
  return (
    <ToastProvider>
      <AdminSidebarProvider>
        <AdminAuthGuard>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminAuthGuard>
      </AdminSidebarProvider>
    </ToastProvider>
  )
}
