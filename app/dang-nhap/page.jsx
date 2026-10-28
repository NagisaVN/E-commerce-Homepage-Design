'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')

  const {
    user,
    isAdmin,
    isStaff,
    login,
    quickLoginAsAdmin,
    quickLoginAsStaff,
    quickLoginAsCustomer,
    logout,
  } = useAuth()

  // Tabs: 'customer' | 'staff' | 'admin'
  const [activeRole, setActiveRole] = useState(
    redirectUrl?.startsWith('/admin') ? 'admin' : 'customer'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    // Nếu có redirect=/admin, tự động chuyển tab sang admin
    if (redirectUrl?.startsWith('/admin')) {
      setActiveRole('admin')
      setEmail('admin@techzone.vn')
      setPassword('admin123')
    }
  }, [redirectUrl])

  const handleRoleChange = (role) => {
    setActiveRole(role)
    setErrorMessage('')
    setSuccessMessage('')
    if (role === 'admin') {
      setEmail('admin@techzone.vn')
      setPassword('admin123')
    } else if (role === 'staff') {
      setEmail('nhanvien@techzone.vn')
      setPassword('staff123')
    } else {
      setEmail('')
      setPassword('')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    try {
      const res = await login(email, password, activeRole)
      if (res.success) {
        if (res.role === 'admin') {
          setSuccessMessage('Đăng nhập Quản trị viên thành công! Đang chuyển hướng Admin...')
        } else if (res.role === 'staff') {
          setSuccessMessage('Đăng nhập Nhân viên vận hành thành công! Đang vào hệ thống quản lý...')
        } else {
          setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...')
        }

        setTimeout(() => {
          if (res.role === 'admin' || res.role === 'staff') {
            router.push(redirectUrl || '/admin')
          } else {
            router.push(redirectUrl || '/')
          }
        }, 800)
      } else {
        setErrorMessage(res.message || 'Email hoặc mật khẩu không chính xác.')
        setIsLoading(false)
      }
    } catch (err) {
      setErrorMessage('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.')
      setIsLoading(false)
    }
  }

  const handleQuickAdmin = async () => {
    setIsLoading(true)
    await quickLoginAsAdmin()
    setSuccessMessage('Đăng nhập Quản trị viên thành công! Đang vào trang quản trị...')
    setTimeout(() => {
      router.push(redirectUrl || '/admin')
    }, 700)
  }

  const handleQuickStaff = async () => {
    setIsLoading(true)
    await quickLoginAsStaff()
    setSuccessMessage('Đăng nhập Nhân viên thành công! Đang vào trang quản lý...')
    setTimeout(() => {
      router.push(redirectUrl || '/admin')
    }, 700)
  }

  const handleQuickCustomer = async () => {
    setIsLoading(true)
    await quickLoginAsCustomer()
    setSuccessMessage('Đăng nhập Khách hàng thành công! Đang vào trang mua sắm...')
    setTimeout(() => {
      router.push(redirectUrl && !redirectUrl.startsWith('/admin') ? redirectUrl : '/')
    }, 700)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-body">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2 mb-4 group">
          <div className="h-10 w-10 bg-brand rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
              <path d="M8 22V13l8-6 8 6v9H8z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <rect x="13" y="16" width="6" height="6" rx="1" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-brand-dark font-display">
            Tech<span className="text-brand">Zone</span>
          </span>
        </Link>

        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
          {activeRole === 'admin'
            ? 'Đăng nhập Quản Trị Viên'
            : activeRole === 'staff'
            ? 'Đăng nhập Nhân Viên Vận Hành'
            : 'Đăng nhập Khách Hàng'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {activeRole === 'admin' ? (
            <span className="text-amber-700 font-medium">Hệ thống toàn quyền Quản trị TechZone Admin</span>
          ) : activeRole === 'staff' ? (
            <span className="text-emerald-700 font-medium">Cổng thông tin Xử lý Đơn hàng & Kho vận</span>
          ) : (
            <>
              Chưa có tài khoản?{' '}
              <Link href="/dang-ky" className="font-medium text-brand hover:text-brand-dark transition-colors">
                Đăng ký tài khoản mới miễn phí
              </Link>
            </>
          )}
        </p>

        {/* Thông báo nếu vừa bị redirect từ trang Admin */}
        {redirectUrl?.startsWith('/admin') && (
          <div className="mt-4 mx-4 sm:mx-0 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2 shadow-xs">
            <svg className="w-5 h-5 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Vui lòng đăng nhập bằng tài khoản <strong>Quản trị viên</strong> hoặc <strong>Nhân viên</strong> để vào trang Quản trị.</span>
          </div>
        )}
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Nếu đã đăng nhập trước đó */}
        {user && (
          <div className="mb-4 bg-white p-4 rounded-2xl border border-blue-100 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                {user.avatar || 'U'}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-gray-500">{user.email}</p>
                <span
                  className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : user.role === 'staff'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {user.role === 'admin'
                    ? 'Quản trị viên (Admin)'
                    : user.role === 'staff'
                    ? 'Nhân viên (Staff)'
                    : 'Khách hàng'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {user.role === 'admin' || user.role === 'staff' ? (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  Vào Quản Trị
                </Link>
              ) : (
                <Link
                  href="/"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  Về Shop
                </Link>
              )}
              <button
                onClick={logout}
                className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                Thoát
              </button>
            </div>
          </div>
        )}

        <div className="bg-white py-7 px-4 shadow-xl shadow-blue-900/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          {/* Role Tabs: Khách hàng / Nhân viên / Quản trị viên */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('customer')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                activeRole === 'customer'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Khách hàng</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('staff')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                activeRole === 'staff'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Nhân viên</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                activeRole === 'admin'
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Quản trị viên</span>
            </button>
          </div>

          {/* Alert thông báo lỗi / thành công */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0 text-emerald-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700">
                {activeRole === 'admin'
                  ? 'Email Quản trị viên'
                  : activeRole === 'staff'
                  ? 'Email Nhân viên'
                  : 'Địa chỉ Email'}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2.5 border border-gray-200 rounded-xl shadow-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm transition-colors"
                  placeholder={
                    activeRole === 'admin'
                      ? 'admin@techzone.vn'
                      : activeRole === 'staff'
                      ? 'nhanvien@techzone.vn'
                      : 'khachhang@techzone.vn'
                  }
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700">
                Mật khẩu
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2.5 border border-gray-200 rounded-xl shadow-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-gray-700 cursor-pointer">
                  Ghi nhớ phiên đăng nhập
                </label>
              </div>

              {activeRole === 'customer' && (
                <div>
                  <a href="#" className="font-medium text-brand hover:text-brand-dark transition-colors">
                    Quên mật khẩu?
                  </a>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white transition-all active:scale-[0.98] font-display cursor-pointer ${
                  activeRole === 'admin'
                    ? 'bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 shadow-blue-500/20'
                    : activeRole === 'staff'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20'
                    : 'bg-brand hover:bg-brand-dark shadow-blue-500/20'
                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  <span>
                    {activeRole === 'admin'
                      ? 'Đăng nhập vào Hệ Thống Admin ➔'
                      : activeRole === 'staff'
                      ? 'Đăng nhập vào Hệ Thống Nhân Viên ➔'
                      : 'Đăng nhập Mua Sắm'}
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Khối Đăng Nhập Nhanh Trải Nghiệm Demo 3 Vai Trò */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-center text-xs font-semibold text-gray-500 mb-3 tracking-wide">
              ⚡ ĐĂNG NHẬP NHANH 1-CHẠM (DEMO)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleQuickAdmin}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-900 border border-blue-200/80 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>🛡️ Admin</span>
              </button>

              <button
                type="button"
                onClick={handleQuickStaff}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-900 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>💼 Nhân viên</span>
              </button>

              <button
                type="button"
                onClick={handleQuickCustomer}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-medium transition-all active:scale-95 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>🛒 Khách hàng</span>
              </button>
            </div>
          </div>

          {/* Social login for customers */}
          {activeRole === 'customer' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleQuickCustomer}
                  className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-200 rounded-xl shadow-xs bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickCustomer}
                  className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-200 rounded-xl shadow-xs bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                      clipRule="evenodd"
                      color="#1877F2"
                    />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
