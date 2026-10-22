'use client'

import React, { useState } from 'react'

export default function AdminSalesChart() {
  const [period, setPeriod] = useState('7d') // '7d' | '30d' | 'year'

  // Dữ liệu mẫu theo chu kỳ
  const dataMap = {
    '7d': [
      { label: 'Thứ 2', revenue: 12.5, orders: 4 },
      { label: 'Thứ 3', revenue: 18.2, orders: 7 },
      { label: 'Thứ 4', revenue: 15.0, orders: 5 },
      { label: 'Thứ 5', revenue: 24.8, orders: 9 },
      { label: 'Thứ 6', revenue: 32.1, orders: 12 },
      { label: 'Thứ 7', revenue: 45.6, orders: 18 },
      { label: 'Chủ nhật', revenue: 38.4, orders: 14 },
    ],
    '30d': [
      { label: 'Tuần 1', revenue: 85.0, orders: 32 },
      { label: 'Tuần 2', revenue: 112.5, orders: 48 },
      { label: 'Tuần 3', revenue: 98.2, orders: 41 },
      { label: 'Tuần 4', revenue: 145.0, orders: 60 },
    ],
    'year': [
      { label: 'Thg 1', revenue: 120, orders: 45 },
      { label: 'Thg 2', revenue: 95, orders: 38 },
      { label: 'Thg 3', revenue: 140, orders: 55 },
      { label: 'Thg 4', revenue: 180, orders: 70 },
      { label: 'Thg 5', revenue: 210, orders: 85 },
      { label: 'Thg 6', revenue: 250, orders: 102 },
      { label: 'Thg 7', revenue: 230, orders: 92 },
      { label: 'Thg 8', revenue: 280, orders: 115 },
      { label: 'Thg 9', revenue: 310, orders: 128 },
      { label: 'Thg 10', revenue: 290, orders: 110 },
      { label: 'Thg 11', revenue: 360, orders: 145 },
      { label: 'Thg 12', revenue: 420, orders: 175 },
    ],
  }

  const currentData = dataMap[period]
  const maxRevenue = Math.max(...currentData.map((d) => d.revenue)) * 1.15

  const totalPeriodRevenue = currentData.reduce((acc, curr) => acc + curr.revenue, 0)
  const totalPeriodOrders = currentData.reduce((acc, curr) => acc + curr.orders, 0)

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs">
      {/* Header with Title and Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Phân tích Doanh thu & Tăng trưởng</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-semibold">
              Live Data
            </span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Biểu đồ thống kê lượng bán và doanh thu cửa hàng
          </p>
        </div>

        {/* Period toggle buttons */}
        <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-900 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setPeriod('7d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              period === '7d'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            7 ngày qua
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              period === '30d'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Tháng này
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              period === 'year'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Cả năm 2026
          </button>
        </div>
      </div>

      {/* Summary stats in chart */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4 py-2">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
          <p className="text-[11px] text-gray-400 font-medium">Doanh thu giai đoạn</p>
          <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
            {totalPeriodRevenue.toFixed(1)} tr VNĐ
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
          <p className="text-[11px] text-gray-400 font-medium">Đơn hàng phát sinh</p>
          <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
            {totalPeriodOrders} đơn
          </p>
        </div>
        <div className="hidden sm:block p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
          <p className="text-[11px] text-gray-400 font-medium">Giá trị TB/Đơn</p>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {(totalPeriodRevenue / (totalPeriodOrders || 1)).toFixed(1)} tr VNĐ
          </p>
        </div>
      </div>

      {/* Modern CSS/SVG Bar Chart */}
      <div className="mt-6 pt-4">
        <div className="h-64 flex items-end gap-2 sm:gap-4 justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          {currentData.map((item, index) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 100)
            return (
              <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Hover Tooltip */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-20 flex flex-col items-center">
                  <span className="font-bold">{item.revenue} tr VNĐ</span>
                  <span className="text-[10px] text-gray-300">{item.orders} đơn hàng</span>
                </div>

                {/* Bar */}
                <div className="w-full max-w-[40px] flex flex-col items-center h-full justify-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-cyan-400 transition-all duration-300 shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                {/* X-axis Label */}
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-2 truncate w-full text-center">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          <span>Doanh thu (triệu đồng)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>Tỷ lệ hoàn thành mục tiêu</span>
        </div>
      </div>
    </div>
  )
}
