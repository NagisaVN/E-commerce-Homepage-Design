'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const AdminSidebarContext = createContext({
  isExpanded: true,
  isMobileOpen: false,
  toggleSidebar: () => {},
  toggleMobileSidebar: () => {},
  closeMobileSidebar: () => {},
})

export function AdminSidebarProvider({ children }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Tự động đóng menu trên điện thoại khi chuyển trang
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const toggleSidebar = () => setIsExpanded((prev) => !prev)
  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev)
  const closeMobileSidebar = () => setIsMobileOpen(false)

  return (
    <AdminSidebarContext.Provider
      value={{
        isExpanded,
        isMobileOpen,
        toggleSidebar,
        toggleMobileSidebar,
        closeMobileSidebar,
      }}
    >
      {children}
    </AdminSidebarContext.Provider>
  )
}

export const useAdminSidebar = () => useContext(AdminSidebarContext)
