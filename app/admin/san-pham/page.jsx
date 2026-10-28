'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import dbData from '../../../db.json'
import { useAuth } from '../../../context/AuthContext'
import { useAdminToast } from '../_components/AdminToast'

export default function AdminProductsPage() {
  const { user } = useAuth()
  const { showToast } = useAdminToast()

  const [products, setProducts] = useState(dbData.san_pham || [])
  const [categories, setCategories] = useState(dbData.danh_muc_san_pham || [])
  const [brands, setBrands] = useState(dbData.thuong_hieu || [])
  const [loading, setLoading] = useState(false)

  // Bộ lọc
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedBrand, setSelectedBrand] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('ADD') // 'ADD' | 'EDIT'
  const [deleteProductTarget, setDeleteProductTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const initialForm = {
    id: null,
    ten_san_pham: '',
    id_danh_muc: 1,
    id_thuong_hieu: 1,
    gia: '',
    gia_goc: '',
    ton_kho: 10,
    hinh_chinh: '',
    sku: '',
    bao_hanh: '24 tháng',
    noi_bat: 0,
    trang_thai: 1,
  }
  const [formData, setFormData] = useState(initialForm)

  // Tải danh sách sản phẩm từ API
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products)
      }
    } catch (e) {
      console.warn('Dùng dữ liệu tĩnh từ db.json:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

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

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === 'ALL' || String(p.id_danh_muc) === String(selectedCategory)
    const matchBrand =
      selectedBrand === 'ALL' || String(p.id_thuong_hieu) === String(selectedBrand)

    let matchStatus = true
    if (selectedStatus === 'ACTIVE') matchStatus = p.trang_thai === 1
    if (selectedStatus === 'INACTIVE') matchStatus = p.trang_thai === 0
    if (selectedStatus === 'FEATURED') matchStatus = p.noi_bat === 1

    let matchSearch = true
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      matchSearch =
        p.ten_san_pham?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
    }

    return matchCategory && matchBrand && matchStatus && matchSearch
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
    setSearchQuery('')
    setCurrentPage(1)
  }

  // Mở Modal Thêm
  const handleOpenAddModal = () => {
    setFormData(initialForm)
    setModalMode('ADD')
    setIsModalOpen(true)
  }

  // Mở Modal Sửa
  const handleOpenEditModal = (product) => {
    setFormData({
      id: product.id,
      ten_san_pham: product.ten_san_pham || '',
      id_danh_muc: product.id_danh_muc || 1,
      id_thuong_hieu: product.id_thuong_hieu || 1,
      gia: product.gia || '',
      gia_goc: product.gia_goc || product.gia || '',
      ton_kho: product.ton_kho !== undefined ? product.ton_kho : 10,
      hinh_chinh: product.hinh_chinh || '',
      sku: product.sku || '',
      bao_hanh: product.bao_hanh || '24 tháng',
      noi_bat: product.noi_bat || 0,
      trang_thai: product.trang_thai !== undefined ? product.trang_thai : 1,
    })
    setModalMode('EDIT')
    setIsModalOpen(true)
  }

  // Submit Form (Thêm hoặc Sửa)
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    if (!formData.ten_san_pham.trim() || !formData.gia) {
      showToast('Vui lòng điền tên sản phẩm và giá bán!', 'error')
      return
    }

    setSubmitting(true)
    try {
      if (modalMode === 'ADD') {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.message || 'Lỗi khi thêm sản phẩm')

        setProducts((prev) => [data.product, ...prev])
        showToast(`Đã thêm sản phẩm mới: "${data.product.ten_san_pham}"!`, 'success')
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.message || 'Lỗi khi cập nhật sản phẩm')

        setProducts((prev) =>
          prev.map((p) => (String(p.id) === String(formData.id) ? data.product : p))
        )
        showToast(`Đã cập nhật sản phẩm: "${data.product.ten_san_pham}"!`, 'success')
      }
      setIsModalOpen(false)
    } catch (err) {
      showToast(err.message || 'Có lỗi xảy ra!', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Xác nhận Xóa sản phẩm
  const handleConfirmDelete = async (permanent = false) => {
    if (!deleteProductTarget) return

    setSubmitting(true)
    try {
      const res = await fetch(
        `/api/admin/products?id=${deleteProductTarget.id}&role=${user?.role || 'staff'}&permanent=${permanent}`,
        { method: 'DELETE' }
      )
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Không thể xóa sản phẩm')

      if (permanent) {
        setProducts((prev) => prev.filter((p) => String(p.id) !== String(deleteProductTarget.id)))
        showToast(data.message, 'success')
      } else {
        setProducts((prev) =>
          prev.map((p) =>
            String(p.id) === String(deleteProductTarget.id) ? { ...p, trang_thai: 0 } : p
          )
        )
        showToast(data.message, 'info')
      }
      setDeleteProductTarget(null)
    } catch (err) {
      showToast(err.message || 'Lỗi khi xóa sản phẩm!', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
              QUẢN LÝ SẢN PHẨM
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'}`}>
              {isAdmin ? '👑 Quyền Quản trị viên' : '💼 Quyền Nhân viên vận hành'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            Danh sách sản phẩm
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quản lý, thêm mới, điều chỉnh thông tin giá và tồn kho sản phẩm ({filteredProducts.length} sản phẩm).
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <span className="text-lg leading-none">+</span>
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs space-y-4">
        {/* Ô tìm kiếm nhanh */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, mã SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full py-2 pl-10 pr-4 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          {/* Lọc theo Danh mục */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Danh mục ngành hàng
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="ALL">Tất cả danh mục ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.ten?.trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo Thương hiệu */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Thương hiệu
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="ALL">Tất cả thương hiệu ({brands.length})</option>
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
              className="w-full py-2 px-3 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hiện (Kinh doanh)</option>
              <option value="INACTIVE">Đang ẩn (Tạm ngưng)</option>
              <option value="FEATURED">Sản phẩm nổi bật</option>
            </select>
          </div>

          {/* Nút Reset */}
          <div className="lg:col-span-1 flex justify-end">
            <button
              onClick={handleResetFilters}
              title="Đặt lại bộ lọc"
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
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
                <th className="py-3.5 px-5 w-24">HÌNH</th>
                <th className="py-3.5 px-5 min-w-[240px]">SẢN PHẨM</th>
                <th className="py-3.5 px-5 min-w-[180px]">THÔNG TIN GIÁ & KHO</th>
                <th className="py-3.5 px-5 min-w-[150px]">TRẠNG THÁI</th>
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
                  <tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-gray-750/50 transition-colors">
                    {/* Hình ảnh */}
                    <td className="py-4 px-5 align-middle">
                      <div className="w-16 h-16 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white p-1 flex items-center justify-center overflow-hidden shadow-xs flex-shrink-0">
                        {p.hinh_chinh ? (
                          <img
                            src={p.hinh_chinh.trim()}
                            alt={p.ten_san_pham}
                            className="w-full h-full object-contain hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-gray-400">Ảnh</span>
                        )}
                      </div>
                    </td>

                    {/* Sản phẩm */}
                    <td className="py-4 px-5 align-middle">
                      <div className="space-y-1">
                        <span className="font-bold text-gray-900 dark:text-white block hover:text-blue-600 transition-colors">
                          {p.ten_san_pham}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{categoryName}</span>
                          <span>&middot;</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{brandName}</span>
                        </div>
                        <div className="text-[11px] font-mono text-gray-400">
                          SKU: {p.sku?.trim() || `SKU-${p.id}`}
                        </div>
                      </div>
                    </td>

                    {/* Giá & Kho */}
                    <td className="py-4 px-5 align-middle text-xs">
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-blue-600 dark:text-blue-400">
                          {new Intl.NumberFormat('vi-VN').format(p.gia || 0)}₫
                        </div>
                        {p.gia_goc && p.gia_goc > p.gia && (
                          <div className="text-gray-400 line-through text-[11px]">
                            {new Intl.NumberFormat('vi-VN').format(p.gia_goc)}₫
                          </div>
                        )}
                        <div className="text-gray-500 flex items-center gap-1.5 pt-0.5">
                          <span>Tồn kho:</span>
                          <strong className={p.ton_kho > 0 ? 'text-emerald-600' : 'text-red-500'}>
                            {p.ton_kho !== undefined ? p.ton_kho : 10}
                          </strong>
                        </div>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-4 px-5 align-middle">
                      <div className="space-y-1.5">
                        <div>
                          {isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">
                              Đang hiện
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                              Đang ẩn
                            </span>
                          )}
                        </div>
                        {isFeatured && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              ★ Nổi bật
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="py-4 px-5 align-middle text-center">
                      <div className="flex flex-col gap-1.5 w-28 mx-auto">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="w-full flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 transition-colors border border-blue-200/60 cursor-pointer"
                        >
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => setDeleteProductTarget(p)}
                          className="w-full flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 transition-colors border border-rose-200/60 cursor-pointer"
                        >
                          <span>{isAdmin ? 'Xóa' : 'Ẩn'}</span>
                        </button>
                        <Link
                          href={`/san-pham/${p.slug?.trim()}`}
                          target="_blank"
                          className="w-full flex items-center justify-center gap-1 py-1 px-2 rounded-lg text-[11px] text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <span>Xem ngoài web</span>
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
              className="px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors cursor-pointer"
            >
              Trang trước
            </button>
            <span className="px-2 font-bold text-blue-600 dark:text-blue-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors cursor-pointer"
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL THÊM / SỬA SẢN PHẨM ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/40">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {modalMode === 'ADD' ? 'Thêm sản phẩm mới' : `Chỉnh sửa: ${formData.ten_san_pham}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Smart Tivi Samsung Crystal 4K 65 inch"
                  value={formData.ten_san_pham}
                  onChange={(e) => setFormData({ ...formData, ten_san_pham: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Danh mục ngành hàng
                  </label>
                  <select
                    value={formData.id_danh_muc}
                    onChange={(e) => setFormData({ ...formData, id_danh_muc: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.ten}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Thương hiệu
                  </label>
                  <select
                    value={formData.id_thuong_hieu}
                    onChange={(e) => setFormData({ ...formData, id_thuong_hieu: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.ten_thuong_hieu || b.ten}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Giá bán (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="VD: 15000000"
                    value={formData.gia}
                    onChange={(e) => setFormData({ ...formData, gia: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Giá gốc niêm yết
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 18000000"
                    value={formData.gia_goc}
                    onChange={(e) => setFormData({ ...formData, gia_goc: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Số lượng tồn kho
                  </label>
                  <input
                    type="number"
                    value={formData.ton_kho}
                    onChange={(e) => setFormData({ ...formData, ton_kho: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Mã SKU
                  </label>
                  <input
                    type="text"
                    placeholder="Để trống sẽ tự sinh mã SKU-TZ"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Bảo hành
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 24 tháng chính hãng"
                    value={formData.bao_hanh}
                    onChange={(e) => setFormData({ ...formData, bao_hanh: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Đường dẫn ảnh chính (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.hinh_chinh}
                  onChange={(e) => setFormData({ ...formData, hinh_chinh: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                {formData.hinh_chinh && (
                  <div className="mt-2 w-16 h-16 rounded-xl border p-1 bg-white">
                    <img src={formData.hinh_chinh} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.noi_bat === 1}
                    onChange={(e) => setFormData({ ...formData, noi_bat: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">★ Sản phẩm nổi bật</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.trang_thai === 1}
                    onChange={(e) => setFormData({ ...formData, trang_thai: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Kích hoạt kinh doanh (Hiện)</span>
                </label>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Đang lưu...' : modalMode === 'ADD' ? '+ Thêm ngay' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN XÓA / ẨN SẢN PHẨM ================= */}
      {deleteProductTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-2xl">
              🗑️
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Xác nhận thao tác sản phẩm
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sản phẩm: <strong>"{deleteProductTarget.ten_san_pham}"</strong>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs text-left text-gray-600 dark:text-gray-300 space-y-1">
              <p>• Mã SKU: <span className="font-mono">{deleteProductTarget.sku || deleteProductTarget.id}</span></p>
              <p>• Giá: {new Intl.NumberFormat('vi-VN').format(deleteProductTarget.gia || 0)}₫</p>
              <p>• Vai trò thao tác: <strong>{isAdmin ? 'Quản Trị Viên (Admin)' : 'Nhân Viên (Staff)'}</strong></p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {isAdmin && (
                <button
                  onClick={() => handleConfirmDelete(true)}
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {submitting ? 'Đang xử lý...' : 'Xóa vĩnh viễn khỏi Database'}
                </button>
              )}

              <button
                onClick={() => handleConfirmDelete(false)}
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {submitting ? 'Đang xử lý...' : 'Chuyển sang trạng thái Ẩn (An toàn)'}
              </button>

              <button
                onClick={() => setDeleteProductTarget(null)}
                className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-white cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
