'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminRecentOrders from '../_components/AdminRecentOrders'
import dbData from '../../../db.json'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(dbData.don_hang || [])

  useEffect(() => {
    // Tải đơn hàng từ API và localStorage (đơn hàng mới nhất của khách vãng lai)
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders')
        const data = await res.json()
        if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
          setOrders(data.orders)
          return
        }
      } catch (e) {
        console.warn('Không thể fetch orders từ API, dùng local/fallback:', e)
      }

      // Fallback: kết hợp với đơn hàng lưu trong localStorage của khách nếu có
      try {
        const guestOrders = JSON.parse(localStorage.getItem('techzone_guest_orders') || '[]')
        if (guestOrders.length > 0) {
          const merged = [...guestOrders, ...(dbData.don_hang || [])]
          // Lọc trùng ma_don_hang
          const unique = merged.filter(
            (v, i, a) => a.findIndex((t) => t.ma_don_hang === v.ma_don_hang) === i
          )
          setOrders(unique)
        }
      } catch (e) {
        // ignore
      }
    }

    loadOrders()
  }, [])

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/admin" className="hover:text-blue-600">Admin</Link>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-semibold">Đơn hàng</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Quản Lý Đơn Hàng ({orders.length})
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Theo dõi, xử lý và cập nhật trạng thái đơn đặt hàng của khách hàng
          </p>
        </div>
      </div>

      <AdminRecentOrders orders={orders} />
    </div>
  )
}

