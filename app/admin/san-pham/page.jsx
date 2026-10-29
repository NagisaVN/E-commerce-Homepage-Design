'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import dbData from '../../../db.json'
import { useToast } from '../_components/AdminToast'

export default function AdminProductsPage() {
  const { showToast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedBrand, setSelectedBrand] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const products = dbData.san_pham || []
  const categories = dbData.danh_muc_san_pham || []
  const brands = dbData.thuong_hieu || []

  // Helper tìm tên danh mục
  const getCategoryName = (id) => {
    const found = categories.find((c) => String(c.id) === String(id))
    return found?.ten?.trim() || 'Điện máy'
  }

  // Helper tìm tên thương hiệu
  const getBrandName = (id) => {
    const found = brands.find((b) => String(b.id) === String(id))
    return found?.ten_thuong_hieu?.trim() || found?.ten?.trim() || 'Chính hãng'
  }

  // Lọc sản phẩm theo các tiêu chí trên thanh lọc
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === 'ALL' || String(p.id_danh_muc) === String(selectedCategory)
    const matchBrand =
      selectedBrand === 'ALL' || String(p.id_thuong_hieu) === String(selectedBrand)

    let matchStatus = true
    if (selectedStatus === 'ACTIVE') matchStatus = p.trang_thai === 1
    if (selectedStatus === 'INACTIVE') matchStatus = p.trang_thai === 0
    if (selectedStatus === 'FEATURED') matchStatus = p.noi_bat === 1

    return matchCategory && matchBrand && matchStatus
  })

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleResetFilters = () => {
    setSelectedCategory('ALL')
    setSelectedBrand('ALL')
    setSelectedStatus('ALL')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
            QUẢN LÝ SẢN PHẨM
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            Danh sách sản phẩm
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quản lý các sản phẩm điện máy của TechZone ({filteredProducts.length} sản phẩm).
          </p>
        </div>

        <button
          onClick={() => showToast('Mở cửa sổ thêm sản phẩm mới thành công!', 'info')}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="text-lg leading-none">+</span>
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* 2. Filter Bar (Thanh Lọc theo Danh mục, Thương hiệu, Trạng thái) */}
      <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          {/* Lọc theo Danh mục */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Danh mục
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full py-2.5 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            >
              <option value="ALL">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.ten?.trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo Thương hiệu */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Thương hiệu
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full py-2.5 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            >
              <option value="ALL">Tất cả thương hiệu</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.ten_thuong_hieu?.trim() || b.ten?.trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo Trạng thái */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Trạng thái
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full py-2.5 px-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hiện</option>
              <option value="INACTIVE">Đang ẩn</option>
              <option value="FEATURED">Nổi bật</option>
            </select>
          </div>

          {/* Nút Lọc và Nút Reset */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Lọc</span>
            </button>

            <button
              onClick={handleResetFilters}
              title="Đặt lại bộ lọc"
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Table Danh Sách Sản Phẩm */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/90 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5 w-28">HÌNH</th>
                <th className="py-3.5 px-5 min-w-[240px]">SẢN PHẨM</th>
                <th className="py-3.5 px-5 min-w-[180px]">THÔNG TIN</th>
                <th className="py-3.5 px-5 min-w-[180px]">TRẠNG THÁI</th>
                <th className="py-3.5 px-5 w-36 text-center">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {paginatedProducts.map((p) => {
                const categoryName = getCategoryName(p.id_danh_muc)
                const brandName = getBrandName(p.id_thuong_hieu)
                const isFeatured = p.noi_bat === 1
                const isActive = p.trang_thai === 1

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-blue-50/30 dark:hover:bg-gray-750/50 transition-colors"
                  >
                    {/* Cột 1: Hình ảnh */}
                    <td className="py-4 px-5 align-middle">
                      <div className="w-20 h-20 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white p-1.5 flex items-center justify-center overflow-hidden shadow-xs flex-shrink-0">
                        {p.hinh_chinh ? (
                          <img
                            src={p.hinh_chinh.trim()}
                            alt={p.ten_san_pham}
                            className="w-full h-full object-contain hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-gray-400">Không có ảnh</span>
                        )}
                      </div>
                    </td>

                    {/* Cột 2: Sản phẩm (Tên, Danh mục, Thương hiệu) */}
                    <td className="py-4 px-5 align-middle">
                      <div className="space-y-1">
                        <Link
                          href={`/san-pham/${p.slug?.trim()}`}
                          target="_blank"
                          className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-sm leading-snug line-clamp-2 transition-colors"
                        >
                          {p.ten_san_pham?.trim()}
                        </Link>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Danh mục: <span className="font-semibold text-gray-800 dark:text-gray-200">{categoryName}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Thương hiệu: <span className="font-semibold text-gray-800 dark:text-gray-200">{brandName}</span>
                        </div>
                      </div>
                    </td>

                    {/* Cột 3: Thông tin (Giá, Tồn kho, Lượt xem) */}
                    <td className="py-4 px-5 align-middle">
                      <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                        {/* Giá */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-blue-600 dark:text-blue-400">🏷️</span>
                          <span>Giá:</span>
                          <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                            {new Intl.NumberFormat('vi-VN').format(p.gia || 0)}đ
                          </span>
                        </div>

                        {/* Tồn kho */}
                        <div className="flex items-center gap-1.5">
                          <span>📦</span>
                          <span>Tồn kho:</span>
                          <span className="font-bold text-gray-800 dark:text-gray-100">
                            {p.so_luong_ton_kho || 15}
                          </span>
                        </div>

                        {/* Lượt xem */}
                        <div className="flex items-center gap-1.5">
                          <span>👁️</span>
                          <span>Lượt xem:</span>
                          <span className="font-bold text-gray-800 dark:text-gray-100">
                            {new Intl.NumberFormat('vi-VN').format(p.so_lan_xem || 120)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Cột 4: Trạng thái (Nổi bật, Trạng thái hiển thị, SKU) */}
                    <td className="py-4 px-5 align-middle">
                      <div className="space-y-2">
                        {/* Huy hiệu Nổi bật */}
                        <div>
                          {isFeatured ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/60">
                              ★ Nổi bật
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300">
                              Không nổi bật
                            </span>
                          )}
                        </div>

                        {/* Huy hiệu Đang hiện / Đang ẩn */}
                        <div>
                          {isActive ? (
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60">
                              Đang hiện
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/60 dark:text-rose-300">
                              Đang ẩn
                            </span>
                          )}
                        </div>

                        {/* Mã SKU */}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          SKU: <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{p.sku?.trim() || `SKU-${p.id}`}</span>
                        </div>
                      </div>
                    </td>

                    {/* Cột 5: Thao tác (Sửa, Xóa, Xem chi tiết - 3 nút xếp dọc) */}
                    <td className="py-4 px-5 align-middle text-center">
                      <div className="flex flex-col gap-1.5 w-32 mx-auto">
                        {/* Nút Sửa */}
                        <button
                          onClick={() => showToast(`Cập nhật thông tin sản phẩm: "${p.ten_san_pham?.trim()}" thành công!`, 'success')}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 transition-colors shadow-2xs border border-blue-200/50 dark:border-blue-800/40"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span>Sửa</span>
                        </button>

                        {/* Nút Xóa */}
                        <button
                          onClick={() => showToast(`Đã xóa sản phẩm: "${p.ten_san_pham?.trim()}" thành công!`, 'error')}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 transition-colors shadow-2xs border border-rose-200/50 dark:border-rose-800/40"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Xóa</span>
                        </button>

                        {/* Nút Xem chi tiết */}
                        <Link
                          href={`/san-pham/${p.slug?.trim()}`}
                          target="_blank"
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors shadow-2xs border border-gray-200/60 dark:border-gray-700/60"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Xem chi tiết</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} / {filteredProducts.length} sản phẩm
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              Trang trước
            </button>
            <span className="px-2 font-bold text-blue-600 dark:text-blue-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
