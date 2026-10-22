'use client'

import React from 'react'
import Link from 'next/link'
import AdminRecentOrders from '../_components/AdminRecentOrders'
import dbData from '../../../db.json'

export default function AdminOrdersPage() {
  const orders = dbData.don_hang || []

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
            Quản Lý Đơn Hàng
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Theo dõi, xử lý và cập nhật trạng thái đơn đặt hàng
          </p>
        </div>
      </div>

      <AdminRecentOrders orders={orders} />
    </div>
  )
}
