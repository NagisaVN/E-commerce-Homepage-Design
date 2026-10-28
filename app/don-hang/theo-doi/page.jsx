'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import dbData from '../../../db.json'

function OrderTrackingContent() {
  const searchParams = useSearchParams()
  const codeParam = searchParams.get('code')?.trim()
  const isPaidSuccess = searchParams.get('success') === 'true'

  const [copied, setCopied] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [searchCode, setSearchCode] = useState('')
  const [currentOrder, setCurrentOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  // Tải đơn hàng dựa trên codeParam, localStorage (khách vãng lai), hoặc db.json
  useEffect(() => {
    setLoading(true)

    // 1. Kiểm tra trong localStorage (khách vãng lai vừa đặt)
    let foundOrder = null
    try {
      const guestOrders = JSON.parse(localStorage.getItem('techzone_guest_orders') || '[]')
      if (codeParam) {
        foundOrder = guestOrders.find(
          (o) => o.ma_don_hang?.toLowerCase() === codeParam.toLowerCase()
        )
      } else if (guestOrders.length > 0) {
        // Mặc định lấy đơn hàng gần nhất của khách
        foundOrder = guestOrders[0]
      }
    } catch (e) {
      console.warn('Lỗi đọc guest orders:', e)
    }

    // 2. Nếu chưa thấy, tìm trong db.json
    if (!foundOrder && codeParam) {
      const dbOrders = dbData.don_hang || []
      foundOrder = dbOrders.find(
        (o) => o.ma_don_hang?.toLowerCase() === codeParam.toLowerCase()
      )
    }

    // 3. Fallback: Nếu không tìm thấy hoặc chưa có mã, dùng đơn mặc định
    if (!foundOrder) {
      foundOrder = dbData.don_hang?.[0] || {
        ma_don_hang: codeParam || 'DH20261028001',
        ma_van_don: 'VN-TZ-884920473G',
        ten_nguoi_nhan: 'Nguyễn Văn Khách',
        dien_thoai_nguoi_nhan: '0987654321',
        dia_chi_nguoi_nhan: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        tong_tien_cuoi_cung: 15030000,
        phuong_thuc_thanh_toan: 'COD - Tiền mặt khi nhận hàng',
        payment_method_code: 'COD',
        trang_thai: 'Chờ xác nhận',
        san_pham: [
          {
            id: 1,
            name: 'Máy lạnh LG Diệt khuẩn OJ2470 Dual Inverter 1.5 HP',
            sku: 'SKU-OJ2470-1',
            price: 15000000,
            quantity: 1,
            image: 'https://plain-apac-prod-public.komododecks.com/202609/17/n1o3lQk2vszITBdQny83/image.png',
            variant: 'Trắng tinh tế • Inverter tiết kiệm điện',
          },
        ],
      }
    }

    setCurrentOrder(foundOrder)
    setLoading(false)
  }, [codeParam])

  const trackingCode = currentOrder?.ma_van_don || 'VN-TZ-884920473G'
  const isBankTransfer =
    currentOrder?.payment_method_code === 'BANK_TRANSFER' ||
    currentOrder?.phuong_thuc_thanh_toan?.includes('Chuyển khoản')

  // URL VietQR tạo tự động theo đúng mã đơn hàng và số tiền
  const vietQrUrl = `https://img.vietqr.io/image/MB-0987654321-compact2.jpg?amount=${currentOrder?.tong_tien_cuoi_cung || 0}&addInfo=${currentOrder?.ma_don_hang || 'TECHZONE'}&accountName=TECHZONE%20STORE`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(trackingCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyAccount = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(true)
    setTimeout(() => setCopiedAccount(false), 2000)
  }

  const handleSearchOrder = (e) => {
    e.preventDefault()
    if (!searchCode.trim()) return
    window.location.href = `/don-hang/theo-doi?code=${encodeURIComponent(searchCode.trim())}`
  }

  // Lộ trình đơn hàng mô phỏng theo chuẩn bưu cục
  const trackingEvents = [
    {
      time: '07:30',
      date: 'Hôm nay',
      status: 'Đơn hàng đã được xác nhận thành công trên hệ thống',
      subtext: `Nhân viên kho TechZone đang tiến hành đóng gói tiêu chuẩn chống va đập và dán tem bảo hành điện tử.`,
      isCurrent: true,
      color: 'text-emerald-600 dark:text-emerald-400',
      dotColor: 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950',
    },
    {
      time: '07:05',
      date: 'Hôm nay',
      status: 'Tiếp nhận thông tin đặt hàng từ khách hàng',
      subtext: `Mã đơn hàng #${currentOrder?.ma_don_hang} đã được tạo tự động (${currentOrder?.phuong_thuc_thanh_toan}).`,
      isCurrent: false,
      color: 'text-gray-500 dark:text-gray-400',
      dotColor: 'bg-gray-300 dark:bg-gray-600',
    },
  ]

  const products = currentOrder?.san_pham || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 sm:py-10 text-gray-800 dark:text-gray-100 font-body">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
        {/* THANH ĐIỀU HƯỚNG TOP */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
              title="Quay lại Trang chủ"
            >
              <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Theo Dõi Đơn Hàng
              </h1>
              <p className="text-xs text-gray-400">
                Mã đơn: <strong className="text-brand font-mono">#{currentOrder?.ma_don_hang}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/gio-hang"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Giỏ hàng
            </Link>
          </div>
        </div>

        {/* Ô TRA CỨU ĐƠN HÀNG NHANH CHO KHÁCH VÃNG LAI */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <form onSubmit={handleSearchOrder} className="flex gap-2">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Nhập Mã đơn hàng (VD: DH2026...) để tra cứu"
              className="flex-1 px-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-brand text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-brand-dark transition-all whitespace-nowrap"
            >
              Tra cứu
            </button>
          </form>
        </div>

        {/* THÔNG BÁO TRẠNG THÁI ĐẶT HÀNG THÀNH CÔNG */}
        {isPaidSuccess ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-extrabold text-sm sm:text-base">
                  🎉 Đặt hàng thành công!
                </p>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Mã đơn hàng: <span className="font-mono font-bold text-white">#{currentOrder?.ma_don_hang}</span> &middot; Cảm ơn bạn đã mua sắm tại TechZone.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 text-white whitespace-nowrap">
              Đã ghi nhận
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base">ℹ️</span>
              <span>Đang hiển thị lộ trình chi tiết cho đơn hàng <strong>#{currentOrder?.ma_don_hang}</strong>.</span>
            </div>
            <span className="text-[11px] font-bold bg-blue-100 dark:bg-blue-900 px-2.5 py-1 rounded-lg">
              {currentOrder?.trang_thai || 'Chờ xác nhận'}
            </span>
          </div>
        )}

        {/* KHỐI CHUYỂN KHOẢN NGÂN HÀNG VIETQR (NẾU KHÁCH CHỌN CHUYỂN KHOẢN) */}
        {isBankTransfer && (
          <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border-2 border-brand/30 shadow-md">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xl">🏦</span>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Thanh toán Chuyển khoản VietQR
                </h3>
                <p className="text-xs text-gray-500">
                  Quét mã QR bằng mọi App Ngân hàng hoặc MoMo để hoàn tất thanh toán tức thì
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Cột ảnh QR */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-[220px]">
                  <img
                    src={vietQrUrl}
                    alt="Mã VietQR thanh toán TechZone"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <span className="text-[11px] text-gray-400 mt-2">
                  Quét bằng App Ngân hàng bất kỳ
                </span>
              </div>

              {/* Cột thông tin STK */}
              <div className="md:col-span-7 space-y-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 space-y-1.5">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Ngân hàng:</span>
                    <strong className="text-gray-900 dark:text-white">MBBank (Ngân hàng Quân Đội)</strong>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                    <span>Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-brand font-mono text-base">0987654321</strong>
                      <button
                        onClick={() => handleCopyAccount('0987654321')}
                        className="text-[11px] text-blue-600 font-semibold hover:underline"
                      >
                        {copiedAccount ? 'Đã sao chép' : 'Sao chép'}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Chủ tài khoản:</span>
                    <strong className="text-gray-900 dark:text-white uppercase">TECHZONE STORE</strong>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-200 dark:border-gray-700">
                    <span>Số tiền:</span>
                    <strong className="text-emerald-600 font-bold font-display text-base">
                      {new Intl.NumberFormat('vi-VN').format(currentOrder?.tong_tien_cuoi_cung || 0)}₫
                    </strong>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Nội dung chuyển:</span>
                    <strong className="text-amber-600 font-mono font-bold bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                      {currentOrder?.ma_don_hang}
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed">
                  ⚡ <em>Hệ thống sẽ tự động đối soát và kích hoạt đơn hàng trong vòng 1-3 phút sau khi nhận được chuyển khoản.</em>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KHỐI 1: THỜI GIAN NHẬN HÀNG DỰ KIẾN */}
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={products[0]?.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200'}
              alt="Sản phẩm"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              Dự kiến giao hàng: <span className="text-brand font-extrabold">Trong 24h - 48h tới</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
              <span>Đơn vị vận chuyển:</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">TechZone Express / Hỏa tốc nội thành</span>
            </div>
          </div>
        </div>

        {/* KHỐI 2: LỘ TRÌNH ĐƠN HÀNG (DÒNG THỜI GIAN) */}
        <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Mã vận đơn:</span>
              <span className="font-mono text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                {trackingCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="text-xs font-bold text-brand hover:underline flex items-center gap-1 transition-colors uppercase tracking-wide"
            >
              {copied ? '✓ ĐÃ SAO CHÉP' : 'SAO CHÉP'}
            </button>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
            {trackingEvents.map((event, idx) => (
              <div key={idx} className="relative flex items-start gap-4 sm:gap-6 group">
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full flex items-center justify-center transition-all ${event.dotColor}`}
                >
                  {event.isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  )}
                </div>

                <div className="w-20 sm:w-24 text-right flex-shrink-0">
                  <p className={`text-xs sm:text-sm font-bold ${event.isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                    {event.date}
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                    {event.time}
                  </p>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm font-bold leading-snug ${event.color}`}>
                    {event.status}
                  </p>
                  {event.subtext && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {event.subtext}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KHỐI 3: ĐỊA CHỈ NHẬN HÀNG VÀ CHI TIẾT SẢN PHẨM */}
        <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <span>📍 Thông tin & Địa chỉ giao hàng</span>
          </h3>
          <div className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {currentOrder?.ten_nguoi_nhan} • <span className="font-normal text-gray-500">{currentOrder?.dien_thoai_nguoi_nhan}</span>
            </p>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {currentOrder?.dia_chi_nguoi_nhan}
            </p>
            {currentOrder?.ghi_chu && (
              <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-1">
                Ghi chú: "{currentOrder?.ghi_chu}"
              </p>
            )}
            <p className="text-xs text-brand font-semibold pt-1">
              Phương thức thanh toán: {currentOrder?.phuong_thuc_thanh_toan}
            </p>
          </div>

          <h3 className="text-sm font-bold text-gray-900 dark:text-white pt-3 pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <span>📦 Sản phẩm trong đơn hàng ({products.length})</span>
          </h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((p, idx) => (
              <div key={p.id || idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-white p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {p.variant || 'Chính hãng'} &middot; SL: {p.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 font-bold text-sm text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('vi-VN').format((p.price || 0) * (p.quantity || 1))}₫
                </div>
              </div>
            ))}
          </div>

          {/* TỔNG KẾT CHI PHÍ */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Tiền hàng:</span>
              <span>{new Intl.NumberFormat('vi-VN').format(currentOrder?.tong_tien_cuoi_cung || 0)}₫</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Phí vận chuyển:</span>
              <span className="text-emerald-600 font-semibold">Miễn phí giao tận nơi</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 dark:text-white pt-2 border-t border-dashed border-gray-200 dark:border-gray-800">
              <span>Tổng thanh toán:</span>
              <span className="text-brand dark:text-blue-400">
                {new Intl.NumberFormat('vi-VN').format(currentOrder?.tong_tien_cuoi_cung || 0)}₫
              </span>
            </div>
          </div>
        </div>

        {/* NÚT THAO TÁC TIẾP TỤC */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-sm text-center shadow-md shadow-blue-200 transition-all active:scale-98"
          >
            ← Tiếp tục mua sắm
          </Link>
          <a
            href="tel:19008888"
            className="py-3 px-5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm transition-colors text-center text-gray-700 dark:text-gray-200"
          >
            📞 Hỗ trợ đơn hàng: 1900 8888
          </a>
        </div>
      </div>
    </div>
  )
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-sm">
          Đang tải thông tin đơn hàng...
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  )
}
