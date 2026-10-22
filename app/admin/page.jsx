import React from 'react'
import AdminMetrics from './_components/AdminMetrics'
import AdminSalesChart from './_components/AdminSalesChart'
import AdminRecentOrders from './_components/AdminRecentOrders'
import AdminTopProducts from './_components/AdminTopProducts'
import dbData from '../../db.json'

export const metadata = {
  title: 'Bảng Điều Khiển Quản Trị | TechZone Admin',
  description: 'Hệ thống quản trị bán hàng điện máy thông minh TechZone',
}

export default function AdminDashboardPage() {
  // Lấy dữ liệu thực từ db.json
  const products = dbData.san_pham || []
  const orders = dbData.don_hang || []
  const users = dbData.nguoi_dung || []

  // Tính toán doanh thu thực tế
  const realRevenue = orders.reduce(
    (sum, o) => sum + (Number(o.tong_tien_cuoi_cung) || 0),
    0
  )

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white shadow-lg shadow-blue-500/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Background glow effects */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute right-1/3 -top-12 w-48 h-48 rounded-full bg-cyan-400/20 blur-xl pointer-events-none"></div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-3 text-cyan-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Hệ thống bán hàng trực tuyến
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Chào mừng trở lại, Quản trị viên! 👋
          </h1>
          <p className="mt-2 text-sm text-blue-100/90 leading-relaxed">
            Hôm nay cửa hàng TechZone có <span className="font-bold text-white underline">{orders.length} đơn hàng</span> cần xử lý và <span className="font-bold text-white">{products.length} sản phẩm điện máy</span> đang sẵn sàng trên kệ.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs md:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Thêm sản phẩm
          </button>
          <a
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs md:text-sm backdrop-blur-md transition-all flex items-center gap-2 border border-white/20"
          >
            <span>Xem website</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <AdminMetrics
        totalProducts={products.length}
        totalOrders={orders.length}
        totalRevenue={realRevenue}
        totalUsers={users.length}
      />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Sales Chart & Recent Orders (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Revenue & Growth Interactive Chart */}
          <AdminSalesChart />

          {/* Orders Table */}
          <AdminRecentOrders orders={orders} />
        </div>

        {/* Right Column: Top Products & System Status (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Top Selling Products */}
          <AdminTopProducts products={products} />

          {/* System Health & Status Card */}
          <div className="p-5 md:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span>Trạng thái hệ thống</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Hoạt động tốt
              </span>
            </h4>

            <div className="space-y-3.5 mt-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Next.js App Router:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/60 px-2 py-0.5 rounded">
                  v16.3.5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Cơ sở dữ liệu (Database):</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  JSON DB Đã kết nối (100 SP)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tailwind CSS:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/60 px-2 py-0.5 rounded">
                  v4.x (PostCSS Engine)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Đồng bộ tự động:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  Thời gian thực
                </span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100/80 dark:border-blue-900/40 text-[11px] text-blue-700 dark:text-blue-300">
              💡 <strong>Gợi ý:</strong> Bạn có thể quản lý sản phẩm hoặc xuất danh sách đơn hàng bất kỳ lúc nào tại thanh menu bên trái.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
