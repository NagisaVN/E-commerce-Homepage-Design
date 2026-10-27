'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({
  user: null,
  isAdmin: false,
  isInitialized: false,
  login: () => {},
  logout: () => {},
  quickLoginAsAdmin: () => {},
  quickLoginAsCustomer: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Đọc thông tin user từ localStorage khi mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('techzone_user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Không thể đọc dữ liệu phiên đăng nhập:', err)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  const saveUserSession = (userData) => {
    setUser(userData)
    try {
      localStorage.setItem('techzone_user', JSON.stringify(userData))
    } catch (err) {
      console.error('Không thể lưu phiên đăng nhập:', err)
    }
  }

  const login = (email, password, explicitRole = null) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    
    // Kiểm tra xem là tài khoản Admin hay Khách hàng
    const isAdminAccount =
      explicitRole === 'admin' ||
      cleanEmail.includes('admin') ||
      cleanEmail === 'admin@techzone.vn' ||
      password === 'admin123'

    const userData = {
      id: isAdminAccount ? 'adm_01' : 'usr_' + Date.now(),
      name: isAdminAccount ? 'Admin TechZone' : (cleanEmail ? cleanEmail.split('@')[0] : 'Khách Hàng'),
      email: cleanEmail || (isAdminAccount ? 'admin@techzone.vn' : 'khachhang@techzone.vn'),
      role: isAdminAccount ? 'admin' : 'customer',
      avatar: isAdminAccount ? 'A' : (cleanEmail ? cleanEmail.charAt(0).toUpperCase() : 'U'),
      lastLogin: new Date().toISOString(),
    }

    saveUserSession(userData)
    return { success: true, role: userData.role, user: userData }
  }

  const quickLoginAsAdmin = () => {
    return login('admin@techzone.vn', 'admin123', 'admin')
  }

  const quickLoginAsCustomer = () => {
    return login('khachhang@techzone.vn', '123456', 'customer')
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('techzone_user')
    } catch (err) {
      console.error('Lỗi khi xóa phiên đăng nhập:', err)
    }
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isInitialized,
        login,
        logout,
        quickLoginAsAdmin,
        quickLoginAsCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
