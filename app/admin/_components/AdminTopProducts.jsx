'use client'

import React from 'react'
import Image from 'next/image'

export default function AdminTopProducts({ products = [] }) {
  // Lấy top 5 sản phẩm tiêu biểu
  const topList = products.slice(0, 5)

  return (
    <div className="p-5 md:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Sản phẩm bán chạy
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Top thiết bị gia dụng bán chạy nhất tháng
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            TechZone Store
          </span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700/50 mt-2">
          {topList.map((item, index) => (
            <div key={index} className="py-3 flex items-center justify-between gap-3 group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 p-1 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                  {(item.hinh_chinh || item.hinh) ? (
                    <img
                      src={(item.hinh_chinh || item.hinh).trim()}
                      alt={item.ten_san_pham || item.ten}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="text-xs font-bold text-gray-400">SP</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {(item.ten_san_pham || item.ten)?.trim() || `Sản phẩm #${item.id}`}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {(item.gia || item.don_gia)
                      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.gia || item.don_gia)
                      : 'Liên hệ'}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  {35 - index * 6} đã bán
                </span>
                <span className="text-[10px] text-gray-400">
                  Còn {item.so_luong_ton_kho || item.so_luong_ton || 10} máy
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
        <a
          href="/admin/san-pham"
          className="w-full block py-2 text-center text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 dark:text-blue-300 rounded-xl transition-colors"
        >
          Xem tất cả 100 sản phẩm kho →
        </a>
      </div>
    </div>
  )
}
