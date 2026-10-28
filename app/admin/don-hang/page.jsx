'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AdminRecentOrders from '../_components/AdminRecentOrders'
import dbData from '../../../db.json'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(dbData.don_hang || [])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('')

  const loadOrders = useCallback(async () => {
    setIsRefreshing(true)
    let serverOrders = []

    // 1. Tải đơn hàng từ API server
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      if (data.success && Array.isArray(data.orders)) {
        serverOrders = data.orders
      }
    } catch (e) {
      console.warn('Không thể fetch orders từ API, dùng dữ liệu fallback:', e)
    }

    if (serverOrders.length === 0) {
      serverOrders = dbData.don_hang || []
    }

    // 2. Tải thêm đơn hàng từ localStorage của khách vãng lai (các đơn do khách/admin test trên trình duyệt này)
    let guestOrders = []
    try {
      guestOrders = JSON.parse(localStorage.getItem('techzone_guest_orders') || '[]')
    } catch (e) {
      console.warn('Không thể đọc guestOrders từ localStorage:', e)
    }

    // 3. Tự động đồng bộ các đơn từ localStorage lên API server nếu server chưa có
    if (guestOrders.length > 0) {
      for (const gOrder of guestOrders) {
        const existsOnServer = serverOrders.some(
          (s) => s.ma_don_hang?.trim().toLowerCase() === gOrder.ma_don_hang?.trim().toLowerCase()
        )
        if (!existsOnServer && gOrder.ten_nguoi_nhan && gOrder.dien_thoai_nguoi_nhan) {
          fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customer: {
                name: gOrder.ten_nguoi_nhan,
                phone: gOrder.dien_thoai_nguoi_nhan,
                email: gOrder.email_nguoi_nhan || '',
                address: gOrder.dia_chi_nguoi_nhan || '',
                note: gOrder.ghi_chu || '',
              },
              items: gOrder.san_pham || [],
              paymentMethod: gOrder.payment_method_code || 'COD',
              totalAmount: gOrder.tong_tien_cuoi_cung || 0,
              note: gOrder.ghi_chu || '',
              existingOrderCode: gOrder.ma_don_hang,
              existingTrackingCode: gOrder.ma_van_don,
              existingCreatedAt: gOrder.created_at,
            }),
          }).catch((err) => console.warn('Lỗi sync đơn lên server:', err))
        }
      }
    }

    // 4. HỢP NHẤT: Đơn mới từ localStorage lên đầu, kết hợp đơn server, khử trùng lặp theo ma_don_hang
    const merged = [...guestOrders, ...serverOrders]
    const uniqueOrders = merged.filter(
      (v, i, a) =>
        a.findIndex(
          (t) => t.ma_don_hang?.trim().toLowerCase() === v.ma_don_hang?.trim().toLowerCase()
        ) === i
    )

    if (uniqueOrders.length > 0) {
      setOrders(uniqueOrders)
    }

    const now = new Date()
    setLastUpdated(
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    )
    setIsRefreshing(false)
  }, [])

  // Tải lần đầu và tự động làm mới mỗi 5 giây
  useEffect(() => {
    loadOrders()
    const interval = setInterval(() => {
      loadOrders()
    }, 5000)
    return () => clearInterval(interval)
  }, [loadOrders])

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin" className="hover:text-blue-600">Admin</Link>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-semibold">Đơn hàng</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
            <span>Quản Lý Đơn Hàng</span>
            <span className="text-sm px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold">
              {orders.length}
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Theo dõi, xử lý và cập nhật trạng thái đơn đặt hàng của khách hàng (Tự động cập nhật trực tiếp)
          </p>
        </div>

        {/* Nút bấm Làm mới tức thì */}
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[11px] text-gray-400 hidden sm:inline">
              Cập nhật lúc: {lastUpdated}
            </span>
          )}
          <button
            onClick={() => loadOrders()}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{isRefreshing ? 'Đang tải...' : 'Làm mới'}</span>
          </button>
        </div>
      </div>

      <AdminRecentOrders orders={orders} />
    </div>
  )
}
