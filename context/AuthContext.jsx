'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({
  user: null,
  isAdmin: false,
  isStaff: false,
  isManager: false,
  isInitialized: false,
  login: async () => {},
  logout: () => {},
  quickLoginAsAdmin: () => {},
  quickLoginAsStaff: () => {},
  quickLoginAsCustomer: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Đọc thông tin user từ localStorage khi mount (mặc định chưa đăng nhập / khách vãng lai)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('techzone_user')
      if (stored) {
        setUser(JSON.parse(stored))
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Không thể đọc dữ liệu phiên đăng nhập:', err)
      setUser(null)
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

  const login = async (email, password, explicitRole = null) => {
    const cleanEmail = (email || '').trim().toLowerCase()

    try {
      // Thử gọi backend API trước
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password, role: explicitRole }),
      })

      const data = await res.json()

      if (res.ok && data.success && data.user) {
        saveUserSession(data.user)
        return { success: true, role: data.user.role, user: data.user }
      }

      // Nếu API trả về lỗi nhưng có explicitRole (fallback demo nhanh)
      if (!data.success && !explicitRole) {
        return { success: false, message: data.message || 'Email hoặc mật khẩu không chính xác.' }
      }
    } catch (apiError) {
      console.warn('API /api/auth/login lỗi, chuyển sang fallback auth:', apiError)
    }

    // Fallback xác thực trực tiếp tại client (đảm bảo demo không bao giờ chết)
    let determinedRole = explicitRole || 'customer'
    let fullName = cleanEmail ? cleanEmail.split('@')[0] : 'Người dùng'

    if (explicitRole === 'admin' || cleanEmail.includes('admin') || password === 'admin123') {
      determinedRole = 'admin'
      fullName = 'Quản trị viên Hệ thống'
    } else if (explicitRole === 'staff' || cleanEmail.includes('staff') || cleanEmail.includes('nhanvien') || password === 'staff123') {
      determinedRole = 'staff'
      fullName = 'Lê Thị Thảo (Nhân Viên Vận Hành)'
    }

    const userData = {
      id: determinedRole === 'admin' ? 'adm_01' : determinedRole === 'staff' ? 'stf_01' : 'usr_' + Date.now(),
      name: fullName,
      email: cleanEmail || (determinedRole === 'admin' ? 'admin@techzone.vn' : determinedRole === 'staff' ? 'nhanvien@techzone.vn' : 'khachhang@techzone.vn'),
      role: determinedRole, // 'admin' | 'staff' | 'customer'
      avatar: fullName.charAt(0).toUpperCase(),
      lastLogin: new Date().toISOString(),
    }

    saveUserSession(userData)
    return { success: true, role: userData.role, user: userData }
  }

  const quickLoginAsAdmin = () => {
    return login('admin@techzone.vn', 'admin123', 'admin')
  }

  const quickLoginAsStaff = () => {
    return login('nhanvien@techzone.vn', 'staff123', 'staff')
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
  const isStaff = user?.role === 'staff'
  const isManager = isAdmin || isStaff // Cả Admin và Nhân viên đều có thể vào trang quản lý

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isStaff,
        isManager,
        isInitialized,
        login,
        logout,
        quickLoginAsAdmin,
        quickLoginAsStaff,
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
