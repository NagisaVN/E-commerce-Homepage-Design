'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import dbData from '../../../db.json'
import { useToast } from '../_components/AdminToast'

export default function AdminBrandsPage() {
  const { showToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const brands = dbData.thuong_hieu || []

  // Mô tả mặc định nếu trong database chưa có
  const defaultDescriptions = {
    'samsung': 'Thương hiệu công nghệ & gia dụng hàng đầu thế giới từ Hàn Quốc.',
    'lg': 'Đột phá công nghệ Inverter, diệt khuẩn và độ bền vượt trội.',
    'panasonic': 'Công nghệ Nhật Bản, tiết kiệm điện năng tối đa và vận hành êm ái.',
    'sony': 'Đỉnh cao chất lượng hình ảnh, âm thanh và thiết kế đẳng cấp.',
    'toshiba': 'Thương hiệu gia dụng bền bỉ, uy tín lâu năm từ Nhật Bản.',
    'sharp': 'Chuyên gia công nghệ lọc khí Plasmacluster và điện gia dụng tiện ích.',
    'aqua': 'Thiết bị gia dụng hiện đại, giá thành hợp lý cho mọi gia đình.',
    'daikin': 'Chuyên gia điều hòa không khí hàng đầu thế giới.',
    'electrolux': 'Thương hiệu gia dụng phong cách châu Âu, chăm sóc toàn diện gia đình.',
  }

  const filteredBrands = brands.filter((b) => {
    const name = (b.ten || b.ten_thuong_hieu || '').toLowerCase()
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
            Quản lý thương hiệu
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quản lý các thương hiệu điện máy gia dụng chính hãng được sử dụng trên hệ thống website ({brands.length} thương hiệu).
          </p>
        </div>

        <button
          onClick={() => showToast('Mở cửa sổ thêm thương hiệu mới!', 'info')}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="text-lg leading-none">+</span>
          <span>Thêm thương hiệu</span>
        </button>
      </div>

      {/* 2. Search box */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu (Samsung, LG, Panasonic...)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-9 pr-4 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <span className="text-xs text-gray-500 hidden sm:inline-block">
          Hiển thị <strong>{filteredBrands.length}</strong> hãng
        </span>
      </div>

      {/* 3. Table Danh Sách Thương Hiệu */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/90 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5 w-32">HÌNH</th>
                <th className="py-3.5 px-5 min-w-[180px]">TÊN THƯƠNG HIỆU</th>
                <th className="py-3.5 px-5 w-24 text-center">THỨ TỰ</th>
                <th className="py-3.5 px-5 min-w-[280px]">MÔ TẢ</th>
                <th className="py-3.5 px-5 w-32 text-center">TRẠNG THÁI</th>
                <th className="py-3.5 px-5 w-36 text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filteredBrands.map((b, index) => {
                const brandName = (b.ten || b.ten_thuong_hieu || '').trim()
                const slugKey = (b.slug || brandName).toLowerCase().trim()
                const description = b.mo_ta?.trim() || defaultDescriptions[slugKey] || 'Thương hiệu phân phối chính hãng tại TechZone.'
                const orderNum = b.thu_tu_hien_thi !== undefined && b.thu_tu_hien_thi !== 0 ? b.thu_tu_hien_thi : index + 1
                const isActive = b.trang_thai === 1

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-blue-50/30 dark:hover:bg-gray-750/50 transition-colors"
                  >
                    {/* Cột 1: Hình Logo */}
                    <td className="py-4 px-5 align-middle">
                      <div className="w-20 h-16 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white p-2 flex items-center justify-center overflow-hidden shadow-2xs flex-shrink-0">
                        {b.logo_url ? (
                          <img
                            src={b.logo_url.trim()}
                            alt={brandName}
                            className="w-full h-full object-contain hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="text-xs font-bold text-gray-400">{brandName}</span>
                        )}
                      </div>
                    </td>

                    {/* Cột 2: Tên thương hiệu */}
                    <td className="py-4 px-5 align-middle">
                      <div className="font-bold text-gray-900 dark:text-white text-base">
                        {brandName}
                      </div>
                      <span className="text-[11px] text-gray-400">ID: #{b.id}</span>
                    </td>

                    {/* Cột 3: Thứ tự */}
                    <td className="py-4 px-5 align-middle text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 font-bold text-xs text-gray-700 dark:text-gray-200">
                        {orderNum}
                      </span>
                    </td>

                    {/* Cột 4: Mô tả */}
                    <td className="py-4 px-5 align-middle">
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                        {description}
                      </p>
                    </td>

                    {/* Cột 5: Trạng thái */}
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

                    {/* Cột 6: Hành động (Sửa, Xóa) */}
                    <td className="py-4 px-5 align-middle text-center">
                      <div className="flex flex-col gap-1.5 w-28 mx-auto">
                        {/* Nút Sửa */}
                        <button
                          onClick={() => showToast(`Cập nhật thương hiệu: "${brandName}" thành công!`, 'success')}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 transition-colors shadow-2xs border border-blue-200/50 dark:border-blue-800/40"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span>Sửa</span>
                        </button>

                        {/* Nút Xóa */}
                        <button
                          onClick={() => showToast(`Đã xóa thương hiệu: "${brandName}" thành công!`, 'error')}
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
