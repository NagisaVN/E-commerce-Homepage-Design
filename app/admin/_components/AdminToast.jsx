'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext({
  showToast: (message, type = 'success') => {},
})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])

    // Tự động tắt sau 3.5 giây
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const getToastStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-600 dark:bg-emerald-700',
          iconBg: 'bg-emerald-500/30',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ),
          title: 'Thành công',
        }
      case 'error':
        return {
          bg: 'bg-rose-600 dark:bg-rose-700',
          iconBg: 'bg-rose-500/30',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          title: 'Đã xóa',
        }
      case 'info':
        return {
          bg: 'bg-blue-600 dark:bg-blue-700',
          iconBg: 'bg-blue-500/30',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Thông báo',
        }
      default:
        return {
          bg: 'bg-gray-800 dark:bg-gray-900',
          iconBg: 'bg-gray-700/50',
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Hệ thống',
        }
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Container hiển thị các Toast ở góc trên bên phải */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const style = getToastStyle(toast.type)
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl text-white shadow-xl shadow-black/15 transition-all duration-300 animate-fade-slide ${style.bg}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
                  {style.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight">{style.title}</p>
                  <p className="text-xs opacity-95 truncate mt-0.5">{toast.message}</p>
                </div>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
export const useAdminToast = useToast
