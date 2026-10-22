'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import dbData from '../../../db.json'

function OrderTrackingContent() {
  const searchParams = useSearchParams()
  const isPaidSuccess = searchParams.get('success') === 'true'
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('tracking') // 'tracking' | 'items'

  const trackingCode = 'VN-TZ-884920473G'

  // Lấy đơn hàng thực tế từ db.json hoặc dữ liệu mẫu
  const sampleOrder = dbData.don_hang?.[0] || {
    ma_don_hang: 'DH20260918001',
    ten_nguoi_nhan: 'Nguyễn Văn Khách',
    dien_thoai_nguoi_nhan: '0987654321',
    dia_chi_nguoi_nhan: '123 Đường ABC, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    tong_tien_cuoi_cung: 15030000,
    phuong_thuc_thanh_toan: 'Chuyển khoản QR TechZone Pay (Đã thanh toán)',
  }

  // Danh sách sản phẩm mua
  const orderedProducts = [
    {
      id: 1,
      name: 'Máy lạnh LG Diệt khuẩn OJ2470 Dual Inverter 1.5 HP',
      sku: 'SKU-OJ2470-1',
      price: 15000000,
      quantity: 1,
      image: 'https://plain-apac-prod-public.komododecks.com/202609/17/n1o3lQk2vszITBdQny83/image.png',
      variant: 'Trắng tinh tế • Inverter tiết kiệm điện',
    },
  ]

  // Lộ trình đơn hàng chuẩn theo mẫu ảnh
  const trackingEvents = [
    {
      time: '07:04',
      date: 'Hôm nay',
      status: 'Đơn hàng đã đến kho VN-HỒ CHÍ MINH - Bưu cục Quận 1',
      subtext: 'Bưu tá Nguyễn Văn Tài (0912.888.999) đang chuẩn bị xếp xe đi giao đến bạn trong ngày hôm nay.',
      isCurrent: true,
      color: 'text-emerald-600 dark:text-emerald-400',
      dotColor: 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950',
    },
    {
      time: '19:32',
      date: 'Hôm qua',
      status: 'Giao hàng đang được điều phối tuyến xe chuyên chở hỏa tốc',
      subtext: 'Xe tải trung chuyển tuyến Hà Nội - TP.HCM đã hoàn tất thông quan kho tổng.',
      isCurrent: false,
      color: 'text-gray-500 dark:text-gray-400',
      dotColor: 'bg-gray-300 dark:bg-gray-600',
    },
    {
      time: '19:05',
      date: 'Hôm qua',
      status: 'Đang giao hàng liên tỉnh',
      subtext: 'Kiện hàng được đóng gói tiêu chuẩn chống sốc điện máy an toàn.',
      isCurrent: false,
      color: 'text-gray-500 dark:text-gray-400',
      dotColor: 'bg-gray-300 dark:bg-gray-600',
    },
    {
      time: '17:26',
      date: '20 Th10',
      status: 'Đơn hàng đã đến kho trung chuyển MegaHub TechZone miền Nam',
      subtext: 'Đã hoàn tất phân loại tự động bằng robot quét mã vạch AI.',
      isCurrent: false,
      color: 'text-gray-500 dark:text-gray-400',
      dotColor: 'bg-gray-300 dark:bg-gray-600',
    },
    {
      time: '12:36',
      date: '20 Th10',
      status: 'Người gửi TechZone đang chuẩn bị hàng',
      subtext: 'Đã dán tem bảo hành điện tử chính hãng 24 tháng.',
      isCurrent: false,
      color: 'text-gray-500 dark:text-gray-400',
      dotColor: 'bg-gray-300 dark:bg-gray-600',
    },
    {
      time: '08:15',
      date: '20 Th10',
      status: 'Đã thanh toán thành công & Đơn hàng đã được xác nhận',
      subtext: 'Giao dịch thanh toán trực tuyến bảo mật qua cổng TechZone Pay.',
      isCurrent: false,
      color: 'text-gray-500 dark:text-gray-400',
      dotColor: 'bg-gray-300 dark:bg-gray-600',
    },
  ]

  const handleCopyCode = () => {
    navigator.clipboard.writeText(trackingCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 sm:py-10 text-gray-800 dark:text-gray-100 font-body">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
        
        {/* TOP APP BAR (Giống thanh điều hướng di động trong ảnh) */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
              title="Quay lại"
            >
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Đang giao
              </h1>
              <p className="text-xs text-gray-400">Mã đơn: #{sampleOrder.ma_don_hang?.trim()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Hỗ trợ khách hàng */}
            <button
              onClick={() => alert('Liên hệ tổng đài CSKH TechZone: 1900 8888 (Miễn phí)')}
              className="p-2 rounded-xl text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
              title="Tổng đài CSKH"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button
              onClick={() => alert('Chính sách giao nhận: Miễn phí đổi trả 30 ngày nếu lỗi kỹ thuật')}
              className="p-2 rounded-xl text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
              title="Trợ giúp"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* THÔNG BÁO ĐÃ THANH TOÁN THÀNH CÔNG */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-extrabold text-sm sm:text-base">Đã thanh toán thành công!</p>
              <p className="text-xs text-emerald-100 mt-0.5">Số tiền: {new Intl.NumberFormat('vi-VN').format(sampleOrder.tong_tien_cuoi_cung)}₫ • TechZone Pay</p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white whitespace-nowrap">
            Đã xác nhận
          </span>
        </div>

        {/* KHỐI 1: THỜI GIAN NHẬN HÀNG DỰ KIẾN (Chuẩn theo ảnh) */}
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={orderedProducts[0].image}
              alt="Sản phẩm"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              Nhận hàng trước <span className="text-orange-600 dark:text-orange-400 font-extrabold">Thứ Ba, 28 Th10 2026</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
              <span>Vận chuyển bởi</span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Nhanh - Ninja Van / TechZone Express</span>
            </div>
          </div>
        </div>

        {/* KHỐI 2: LỘ TRÌNH ĐƠN HÀNG (Chuẩn dòng thời gian như ảnh) */}
        <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-6">
          {/* Header mã vận đơn và nút sao chép */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Mã vận đơn:</span>
              <span className="font-mono text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                {trackingCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1 transition-colors active:scale-95 uppercase tracking-wide"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ĐÃ CHÉP</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>SAO CHÉP</span>
                </>
              )}
            </button>
          </div>

          {/* Dòng thời gian chi tiết (Timeline) */}
          <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
            {trackingEvents.map((event, idx) => (
              <div key={idx} className="relative flex items-start gap-4 sm:gap-6 group">
                {/* Dấu chấm tròn mốc thời gian */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full flex items-center justify-center transition-all ${event.dotColor}`}
                >
                  {event.isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  )}
                </div>

                {/* Cột ngày giờ */}
                <div className="w-20 sm:w-24 text-right flex-shrink-0">
                  <p className={`text-xs sm:text-sm font-bold ${event.isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                    {event.date}
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                    {event.time}
                  </p>
                </div>

                {/* Cột thông tin trạng thái */}
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
            <span>📍 Địa chỉ nhận hàng</span>
          </h3>
          <div className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {sampleOrder.ten_nguoi_nhan?.trim()} • <span className="font-normal text-gray-500">{sampleOrder.dien_thoai_nguoi_nhan?.trim()}</span>
            </p>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {sampleOrder.dia_chi_nguoi_nhan?.trim()}
            </p>
          </div>

          <h3 className="text-sm font-bold text-gray-900 dark:text-white pt-3 pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <span>📦 Chi tiết sản phẩm trong kiện hàng</span>
          </h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {orderedProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-white p-1 flex-shrink-0 flex items-center justify-center">
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{p.variant} • SL: {p.quantity}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 font-bold text-sm text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('vi-VN').format(p.price)}₫
                </div>
              </div>
            ))}
          </div>

          {/* Tổng kết chi phí */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Tổng tiền hàng:</span>
              <span>15.000.000₫</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>Phí vận chuyển:</span>
              <span className="text-emerald-600 font-semibold">Miễn phí giao tận nơi</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 dark:text-white pt-2 border-t border-dashed border-gray-200 dark:border-gray-800">
              <span>Tổng thanh toán:</span>
              <span className="text-blue-600 dark:text-blue-400">
                {new Intl.NumberFormat('vi-VN').format(sampleOrder.tong_tien_cuoi_cung)}₫
              </span>
            </div>
          </div>
        </div>

        {/* NÚT THAO TÁC TIẾP TỤC */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm text-center shadow-md shadow-blue-500/20 transition-all active:scale-98"
          >
            Tiếp tục mua sắm
          </Link>
          <button
            onClick={() => alert('Đã sao chép mã vận đơn và gửi tin nhắn cập nhật lộ trình tới Zalo/SĐT!')}
            className="py-3 px-5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm transition-colors text-center text-gray-700 dark:text-gray-200"
          >
            Nhận thông báo qua Zalo / SMS
          </button>
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
