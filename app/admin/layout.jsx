'use client'

import React from 'react'
import { AdminSidebarProvider, useAdminSidebar } from './_components/AdminSidebarContext'
import AdminSidebar from './_components/AdminSidebar'
import AdminHeader from './_components/AdminHeader'
import { ToastProvider } from './_components/AdminToast'

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

export default function AdminLayout({ children }) {
  return (
    <ToastProvider>
      <AdminSidebarProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminSidebarProvider>
    </ToastProvider>
  )
}
