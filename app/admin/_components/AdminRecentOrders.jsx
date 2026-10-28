'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function AdminRecentOrders({ orders = [] }) {
  const [filter, setFilter] = useState('ALL')
  const [displayOrders, setDisplayOrders] = useState(orders)

  // Đồng bộ orders từ props và bổ sung các đơn hàng test từ localStorage nếu có
  React.useEffect(() => {
    let combined = [...orders]
    try {
      const guestOrders = JSON.parse(localStorage.getItem('techzone_guest_orders') || '[]')
      if (guestOrders.length > 0) {
        combined = [...guestOrders, ...combined]
      }
    } catch (e) {
      console.warn('Lỗi đọc guest orders:', e)
    }

    const unique = combined.filter(
      (v, i, a) =>
        a.findIndex(
          (t) => t.ma_don_hang?.trim().toLowerCase() === v.ma_don_hang?.trim().toLowerCase()
        ) === i
    )
    setDisplayOrders(unique.length > 0 ? unique : orders)
  }, [orders])

  const getStatusBadge = (status) => {
    const cleanStatus = status?.trim()
    switch (cleanStatus) {
      case 'Đã hoàn thành':
      case 'Đã giao':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/50'
      case 'Đang giao hàng':
      case 'Đang giao':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200/50'
      case 'Chờ xác nhận':
      case 'Chờ xử lý':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200/50'
      case 'Đã hủy':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200/50'
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200/50'
    }
  }

  const filteredOrders = displayOrders.filter((order) => {
    if (filter === 'ALL') return true
    if (filter === 'PENDING') return order.trang_thai?.includes('Chờ')
    if (filter === 'SHIPPING') return order.trang_thai?.includes('giao')
    if (filter === 'COMPLETED') return order.trang_thai?.includes('hoàn thành') || order.trang_thai?.includes('Đã giao')
    return true
  })

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs">
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Đơn hàng mới nhất</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold">
              {filteredOrders.length}
            </span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Danh sách đơn đặt hàng từ khách hàng TechZone
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'PENDING'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Chờ xác nhận
          </button>
          <button
            onClick={() => setFilter('SHIPPING')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'SHIPPING'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Đang giao
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'COMPLETED'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Đã giao
          </button>
        </div>
      </div>

      {/* Table responsive */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700/60 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              <th className="pb-3 font-semibold">Mã đơn</th>
              <th className="pb-3 font-semibold">Khách hàng</th>
              <th className="pb-3 font-semibold">Ngày tạo</th>
              <th className="pb-3 font-semibold">Thanh toán</th>
              <th className="pb-3 font-semibold">Tổng tiền</th>
              <th className="pb-3 font-semibold">Trạng thái</th>
              <th className="pb-3 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
            {filteredOrders.map((order, idx) => (
              <tr key={idx} className="hover:bg-gray-50/70 dark:hover:bg-gray-750/50 transition-colors group">
                <td className="py-3.5 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {order.ma_don_hang?.trim() || `#DH${order.id}`}
                </td>
                <td className="py-3.5">
                  <div className="font-semibold text-gray-800 dark:text-gray-200">
                    {order.ten_nguoi_nhan?.trim() || 'Khách vãng lai'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {order.dien_thoai_nguoi_nhan?.trim() || 'Chưa có SĐT'}
                  </div>
                </td>
                <td className="py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {order.created_at?.trim() || 'Hôm nay'}
                </td>
                <td className="py-3.5 whitespace-nowrap">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 font-medium">
                    {order.phuong_thuc_thanh_toan?.trim() || 'COD'}
                  </span>
                </td>
                <td className="py-3.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.tong_tien_cuoi_cung || 0)}
                </td>
                <td className="py-3.5 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.trang_thai)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                    {order.trang_thai?.trim() || 'Chờ xác nhận'}
                  </span>
                </td>
                <td className="py-3.5 text-right whitespace-nowrap">
                  <Link
                    href={`/don-hang/theo-doi?code=${encodeURIComponent(order.ma_don_hang?.trim() || '')}`}
                    target="_blank"
                    className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/60 rounded-lg transition-colors border border-blue-200/60 dark:border-blue-900/60"
                  >
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
