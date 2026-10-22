'use client'

import React from 'react'

export default function AdminMetrics({ totalProducts = 100, totalOrders = 2, totalRevenue = 15030000, totalUsers = 2 }) {
  const metrics = [
    {
      title: 'Tổng doanh thu',
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue || 15030000),
      growth: '+14.2%',
      isPositive: true,
      comparison: 'so với tháng trước',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Đơn hàng mới',
      value: `${totalOrders.toLocaleString()} đơn`,
      growth: '+8.5%',
      isPositive: true,
      comparison: 'so với tuần trước',
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      title: 'Sản phẩm kinh doanh',
      value: `${totalProducts} SP`,
      growth: 'Đang hoạt động',
      isPositive: true,
      comparison: '100% còn tồn kho',
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Khách hàng thành viên',
      value: `${totalUsers.toLocaleString()} thành viên`,
      growth: '+22.4%',
      isPositive: true,
      comparison: 'tỷ lệ quay lại 85%',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {metrics.map((item, index) => (
        <div
          key={index}
          className="p-5 md:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
              {item.title}
            </span>
            <div className={`p-2.5 rounded-xl ${item.iconBg} transition-transform group-hover:scale-110 duration-200`}>
              {item.icon}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {item.value}
            </h3>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold ${
              item.isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
            }`}>
              {item.isPositive && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {item.growth}
            </span>
            <span className="text-gray-400 dark:text-gray-500">{item.comparison}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
