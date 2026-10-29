'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import dbData from '../../../db.json'

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const categories = dbData.danh_muc_san_pham || []

  const filteredCategories = categories.filter((c) => {
    const name = (c.ten || '').toLowerCase()
    return name.includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
            QUẢN LÝ SẢN PHẨM
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            Quản lý danh mục sản phẩm
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quản lý các ngành hàng thiết bị điện máy gia dụng ({categories.length} danh mục).
          </p>
        </div>

        <button
          onClick={() => alert('Mở popup thêm danh mục mới')}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="text-lg leading-none">+</span>
          <span>Thêm danh mục</span>
        </button>
      </div>

      {/* 2. Navigation Pills between Danh mục & Thương hiệu */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin/danh-muc"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm"
        >
          Danh mục sản phẩm ({categories.length})
        </Link>
        <Link
          href="/admin/thuong-hieu"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
        >
          Thương hiệu ({dbData.thuong_hieu?.length || 9})
        </Link>
      </div>

      {/* 3. Table Danh Mục */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/90 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5 w-28">HÌNH</th>
                <th className="py-3.5 px-5 min-w-[200px]">TÊN DANH MỤC</th>
                <th className="py-3.5 px-5 w-28 text-center">THỨ TỰ</th>
                <th className="py-3.5 px-5 min-w-[160px]">SỐ LƯỢNG MẪU</th>
                <th className="py-3.5 px-5 w-32 text-center">TRẠNG THÁI</th>
                <th className="py-3.5 px-5 w-36 text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filteredCategories.map((c, index) => {
                const catName = (c.ten || '').trim()
                const isActive = c.trang_thai === 1

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-blue-50/30 dark:hover:bg-gray-750/50 transition-colors"
                  >
                    {/* Hình */}
                    <td className="py-4 px-5 align-middle">
                      <div className="w-16 h-16 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white p-1.5 flex items-center justify-center overflow-hidden shadow-2xs">
                        {c.image_url ? (
                          <img
                            src={c.image_url.trim()}
                            alt={catName}
                            className="w-full h-full object-contain hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="text-xs font-bold text-gray-400">Ảnh</span>
                        )}
                      </div>
                    </td>

                    {/* Tên */}
                    <td className="py-4 px-5 align-middle">
                      <div className="font-bold text-gray-900 dark:text-white text-base">
                        {catName}
                      </div>
                      <span className="text-[11px] text-gray-400">Slug: /{c.slug?.trim()}</span>
                    </td>

                    {/* Thứ tự */}
                    <td className="py-4 px-5 align-middle text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 font-bold text-xs text-gray-700 dark:text-gray-200">
                        {c.thu_tu_hien_thi || index + 1}
                      </span>
                    </td>

                    {/* Số mẫu */}
                    <td className="py-4 px-5 align-middle">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {c.count || '100+ mẫu'}
                      </span>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-4 px-5 align-middle text-center">
                      {isActive ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60">
                          Đang hiện
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                          Đang ẩn
                        </span>
                      )}
                    </td>

                    {/* Hành động */}
                    <td className="py-4 px-5 align-middle text-center">
                      <div className="flex flex-col gap-1.5 w-28 mx-auto">
                        <button
                          onClick={() => alert(`Sửa danh mục: ${catName}`)}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 transition-colors shadow-2xs border border-blue-200/50 dark:border-blue-800/40"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => alert(`Xác nhận xóa danh mục: ${catName}`)}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 transition-colors shadow-2xs border border-rose-200/50 dark:border-rose-800/40"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
