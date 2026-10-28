'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const AdminSidebarContext = createContext({
  isExpanded: true,
  isMobileOpen: false,
  toggleSidebar: () => {},
  expandSidebar: () => {},
  collapseSidebar: () => {},
  toggleMobileSidebar: () => {},
  closeMobileSidebar: () => {},
})

export function AdminSidebarProvider({ children }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Khôi phục trạng thái sidebar từ localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_sidebar_expanded')
      if (saved !== null) {
        setIsExpanded(saved === 'true')
      }
    }
  }, [])

  // Tự động đóng menu trên điện thoại khi chuyển trang
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Lắng nghe phím tắt Ctrl+B hoặc Cmd+B để thu gọn/mở rộng sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_sidebar_expanded', String(next))
      }
      return next
    })
  }

  const expandSidebar = () => {
    setIsExpanded(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_sidebar_expanded', 'true')
    }
  }

  const collapseSidebar = () => {
    setIsExpanded(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_sidebar_expanded', 'false')
    }
  }

  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev)
  const closeMobileSidebar = () => setIsMobileOpen(false)

  return (
    <AdminSidebarContext.Provider
      value={{
        isExpanded,
        isMobileOpen,
        toggleSidebar,
        expandSidebar,
        collapseSidebar,
        toggleMobileSidebar,
        closeMobileSidebar,
      }}
    >
      {children}
    </AdminSidebarContext.Provider>
  )
}

export const useAdminSidebar = () => useContext(AdminSidebarContext)
