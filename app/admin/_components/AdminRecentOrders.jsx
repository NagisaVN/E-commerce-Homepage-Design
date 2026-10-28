'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../context/AuthContext'
import { useAdminToast } from './AdminToast'

export default function AdminRecentOrders({ orders = [] }) {
  const { user } = useAuth()
  const { showToast } = useAdminToast()
  const [filter, setFilter] = useState('ALL')
  const [displayOrders, setDisplayOrders] = useState(orders)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [showCancelPrompt, setShowCancelPrompt] = useState(false)

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
      case 'Đã xác nhận':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200/50'
      case 'Chờ xác nhận':
      case 'Chờ xử lý':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200/50'
      case 'Đã hủy':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200/50'
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200/50'
    }
  }

  // Cập nhật trạng thái đơn hàng (Xác nhận, Giao hàng, Hoàn thành, Hủy)
  const handleUpdateOrderStatus = async (orderCode, newStatus, newPaymentStatus = null, customNote = '') => {
    setIsUpdating(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderCode,
          trang_thai: newStatus,
          trang_thai_thanh_toan: newPaymentStatus,
          note: customNote,
          updatedBy: user?.name || 'Ban Quản Trị',
          role: user?.role || 'admin',
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Không thể cập nhật trạng thái đơn hàng!')
      }

      const updated = data.order

      // Cập nhật state nội bộ
      setDisplayOrders((prev) =>
        prev.map((o) => (o.ma_don_hang?.toLowerCase() === orderCode.toLowerCase() ? updated : o))
      )
      if (selectedOrder && selectedOrder.ma_don_hang?.toLowerCase() === orderCode.toLowerCase()) {
        setSelectedOrder(updated)
      }

      // Cập nhật localStorage
      try {
        const guestOrders = JSON.parse(localStorage.getItem('techzone_guest_orders') || '[]')
        const newGuest = guestOrders.map((o) =>
          o.ma_don_hang?.toLowerCase() === orderCode.toLowerCase() ? updated : o
        )
        localStorage.setItem('techzone_guest_orders', JSON.stringify(newGuest))
      } catch (err) {}

      showToast(`Đã cập nhật đơn #${orderCode} sang trạng thái: "${newStatus}"!`, 'success')
      setShowCancelPrompt(false)
      setCancelReason('')
    } catch (error) {
      console.error('Lỗi cập nhật đơn:', error)
      showToast(error.message || 'Lỗi khi cập nhật đơn hàng!', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredOrders = displayOrders.filter((order) => {
    if (filter === 'ALL') return true
    if (filter === 'PENDING') return order.trang_thai?.includes('Chờ')
    if (filter === 'CONFIRMED') return order.trang_thai?.includes('xác nhận')
    if (filter === 'SHIPPING') return order.trang_thai?.includes('giao')
    if (filter === 'COMPLETED') return order.trang_thai?.includes('hoàn thành') || order.trang_thai?.includes('Đã giao')
    if (filter === 'CANCELLED') return order.trang_thai?.includes('hủy')
    return true
  })

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs">
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Danh sách đơn đặt hàng</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold">
              {filteredOrders.length}
            </span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Xem chi tiết lộ trình, duyệt đơn và cập nhật tiến trình giao nhận
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'PENDING'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Chờ xác nhận
          </button>
          <button
            onClick={() => setFilter('SHIPPING')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'SHIPPING'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Đang giao
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'COMPLETED'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Đã hoàn thành
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
              <th className="pb-3 font-semibold text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
            {filteredOrders.map((order, idx) => (
              <tr key={order.id || idx} className="hover:bg-gray-50/70 dark:hover:bg-gray-750/50 transition-colors group">
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
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 font-medium">
                      {order.phuong_thuc_thanh_toan?.includes('PayOS') || order.payment_method_code === 'BANK_TRANSFER'
                        ? 'PayOS VietQR'
                        : (order.phuong_thuc_thanh_toan?.trim() || 'COD')}
                    </span>
                    {order.trang_thai_thanh_toan === 'Đã thanh toán' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                        ✓ Đã thanh toán
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">
                        Chờ thanh toán
                      </span>
                    )}
                  </div>
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
                <td className="py-3.5 text-center whitespace-nowrap">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white rounded-xl transition-all border border-blue-200/80 dark:border-blue-800 shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Quản lý & Duyệt</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL XEM CHI TIẾT & XÁC NHẬN ĐƠN HÀNG ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Header Modal */}
            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-bold">
                  📦
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      Đơn hàng #{selectedOrder.ma_don_hang}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(selectedOrder.trang_thai)}`}>
                      {selectedOrder.trang_thai}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Mã vận đơn: <span className="font-mono font-semibold">{selectedOrder.ma_van_don || 'Chưa gán'}</span> &middot; Tạo lúc: {selectedOrder.created_at}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Nội dung chi tiết */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
              {/* KHỐI 1: NÚT THAO TÁC XÁC NHẬN TIẾN TRÌNH NHANH */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 dark:text-blue-200 text-xs uppercase tracking-wide">
                    ⚡ Thao tác xử lý đơn ({user?.role === 'admin' ? 'Quyền Quản Trị Viên' : 'Quyền Nhân Viên Vận Hành'}):
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Người duyệt: <strong>{user?.name}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedOrder.trang_thai?.includes('Chờ') && (
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.ma_don_hang, 'Đã xác nhận')}
                      disabled={isUpdating}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>✓ Xác nhận đơn hàng</span>
                    </button>
                  )}

                  {(selectedOrder.trang_thai?.includes('xác nhận') || selectedOrder.trang_thai?.includes('Chờ')) && (
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.ma_don_hang, 'Đang giao hàng')}
                      disabled={isUpdating}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🚚 Bàn giao cho bưu tá giao hàng</span>
                    </button>
                  )}

                  {selectedOrder.trang_thai?.includes('giao') && (
                    <button
                      onClick={() =>
                        handleUpdateOrderStatus(
                          selectedOrder.ma_don_hang,
                          'Đã hoàn thành',
                          'Đã thanh toán',
                          'Khách hàng đã nhận hàng và hoàn tất thanh toán'
                        )
                      }
                      disabled={isUpdating}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🎉 Đã giao thành công & Hoàn tất</span>
                    </button>
                  )}

                  {!selectedOrder.trang_thai?.includes('hủy') && !selectedOrder.trang_thai?.includes('hoàn thành') && (
                    <button
                      onClick={() => setShowCancelPrompt(true)}
                      disabled={isUpdating}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <span>✕ Hủy đơn này</span>
                    </button>
                  )}

                  <Link
                    href={`/don-hang/theo-doi?code=${encodeURIComponent(selectedOrder.ma_don_hang)}`}
                    target="_blank"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 font-semibold shadow-xs hover:bg-gray-50 transition-colors ml-auto flex items-center gap-1"
                  >
                    <span>Mở trang theo dõi khách</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>

                {showCancelPrompt && (
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-rose-200 dark:border-rose-900 mt-2 space-y-2 animate-fade-in">
                    <p className="font-bold text-rose-700 dark:text-rose-400 text-xs">
                      Xác nhận lý do hủy đơn hàng #{selectedOrder.ma_don_hang}:
                    </p>
                    <input
                      type="text"
                      placeholder="VD: Khách đổi ý, hết màu, không liên lạc được..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowCancelPrompt(false)}
                        className="px-3 py-1 rounded-lg text-gray-500 hover:bg-gray-100 text-xs"
                      >
                        Đóng
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(
                            selectedOrder.ma_don_hang,
                            'Đã hủy',
                            selectedOrder.trang_thai_thanh_toan,
                            cancelReason || 'Hủy bởi nhân viên quản trị'
                          )
                        }
                        className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs"
                      >
                        Đồng ý hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* KHỐI 2: THÔNG TIN KHÁCH HÀNG & GIAO NHẬN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                    <span>👤 Người nhận hàng</span>
                  </h4>
                  <div className="space-y-1 text-gray-600 dark:text-gray-300">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {selectedOrder.ten_nguoi_nhan}
                    </p>
                    <p className="flex items-center gap-2">
                      <span>Điện thoại:</span>
                      <a href={`tel:${selectedOrder.dien_thoai_nguoi_nhan}`} className="text-blue-600 font-bold hover:underline">
                        {selectedOrder.dien_thoai_nguoi_nhan}
                      </a>
                    </p>
                    {selectedOrder.email_nguoi_nhan && (
                      <p>Email: {selectedOrder.email_nguoi_nhan}</p>
                    )}
                    <p className="pt-1 text-xs">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Địa chỉ:</span>{' '}
                      {selectedOrder.dia_chi_nguoi_nhan}
                    </p>
                    {selectedOrder.ghi_chu && (
                      <p className="text-amber-700 dark:text-amber-400 italic bg-amber-50 dark:bg-amber-950/60 p-2 rounded-lg mt-1 text-xs">
                        Ghi chú: "{selectedOrder.ghi_chu}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                    <span>💳 Thanh toán & Vận chuyển</span>
                  </h4>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Hình thức:</span>
                      <strong className="text-gray-900 dark:text-white">
                        {selectedOrder.phuong_thuc_thanh_toan}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Trạng thái tiền:</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${selectedOrder.trang_thai_thanh_toan === 'Đã thanh toán' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {selectedOrder.trang_thai_thanh_toan || 'Chờ chuyển khoản'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đơn vị giao:</span>
                      <span className="font-medium">TechZone Express (Nội thành hỏa tốc)</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700 font-bold text-sm text-gray-900 dark:text-white">
                      <span>Tổng giá trị đơn:</span>
                      <span className="text-blue-600 font-extrabold text-base">
                        {new Intl.NumberFormat('vi-VN').format(selectedOrder.tong_tien_cuoi_cung || 0)}₫
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* KHỐI 3: DANH SÁCH SẢN PHẨM */}
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Sản phẩm trong đơn ({(selectedOrder.san_pham || []).length} mặt hàng)
                </h4>
                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
                  {(selectedOrder.san_pham || []).map((p, idx) => (
                    <div key={p.id || idx} className="p-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 dark:border-gray-700 p-1 flex-shrink-0 flex items-center justify-center">
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white line-clamp-1">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {p.variant || 'Chính hãng'} &middot; SL: <strong>{p.quantity}</strong>
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-bold text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('vi-VN').format((p.price || 0) * (p.quantity || 1))}₫
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 font-semibold text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
