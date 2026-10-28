'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import dbData from '../../../db.json'
import { useAuth } from '../../../context/AuthContext'
import { useAdminToast } from '../_components/AdminToast'

export default function AdminCategoriesPage() {
  const { user } = useAuth()
  const { showToast } = useAdminToast()

  const [categories, setCategories] = useState(dbData.danh_muc_san_pham || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('ADD') // 'ADD' | 'EDIT'
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const initialForm = {
    id: null,
    ten: '',
    slug: '',
    count: '100+ mẫu',
    image_url: '',
    thu_tu_hien_thi: 1,
    trang_thai: 1,
  }
  const [formData, setFormData] = useState(initialForm)

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories)
      }
    } catch (e) {
      console.warn('Dùng danh mục tĩnh:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const filteredCategories = categories.filter((c) => {
    const name = (c.ten || '').toLowerCase()
    return name.includes(searchTerm.toLowerCase())
  })

  // Mở modal Thêm
  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      thu_tu_hien_thi: categories.length + 1,
    })
    setModalMode('ADD')
    setIsModalOpen(true)
  }

  // Mở modal Sửa
  const handleOpenEdit = (category) => {
    setFormData({
      id: category.id,
      ten: category.ten || '',
      slug: category.slug || '',
      count: category.count || '100+ mẫu',
      image_url: category.image_url || '',
      thu_tu_hien_thi: category.thu_tu_hien_thi || 1,
      trang_thai: category.trang_thai !== undefined ? category.trang_thai : 1,
    })
    setModalMode('EDIT')
    setIsModalOpen(true)
  }

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.ten.trim()) {
      showToast('Vui lòng nhập tên danh mục!', 'error')
      return
    }

    setSubmitting(true)
    try {
      if (modalMode === 'ADD') {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.message || 'Lỗi khi thêm danh mục')

        setCategories((prev) => [...prev, data.category])
        showToast(`Đã thêm danh mục: "${data.category.ten}"!`, 'success')
      } else {
        const res = await fetch('/api/admin/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.message || 'Lỗi khi cập nhật danh mục')

        setCategories((prev) =>
          prev.map((c) => (String(c.id) === String(formData.id) ? data.category : c))
        )
        showToast(`Đã cập nhật danh mục: "${data.category.ten}"!`, 'success')
      }
      setIsModalOpen(false)
    } catch (err) {
      showToast(err.message || 'Lỗi xử lý danh mục!', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Xóa danh mục
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    setSubmitting(true)
    try {
      const res = await fetch(
        `/api/admin/categories?id=${deleteTarget.id}&role=${user?.role || 'staff'}`,
        { method: 'DELETE' }
      )
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Không thể xóa danh mục')

      setCategories((prev) => prev.filter((c) => String(c.id) !== String(deleteTarget.id)))
      showToast(data.message, 'success')
      setDeleteTarget(null)
    } catch (err) {
      showToast(err.message || 'Lỗi khi xóa danh mục!', 'error')
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
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isAdmin ? '👑 Quyền Admin' : '💼 Quyền Nhân viên'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            Quản lý danh mục sản phẩm
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quản lý cấu trúc các ngành hàng thiết bị điện máy gia dụng ({categories.length} danh mục).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <span className="text-lg leading-none">+</span>
          <span>Thêm danh mục</span>
        </button>
      </div>

      {/* 2. Navigation Pills between Danh mục & Thương hiệu & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/danh-muc"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm"
          >
            Danh mục ({categories.length})
          </Link>
          <Link
            href="/admin/thuong-hieu"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            Thương hiệu ({dbData.thuong_hieu?.length || 9})
          </Link>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      {/* 3. Table Danh Mục */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/90 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5 w-24">HÌNH</th>
                <th className="py-3.5 px-5 min-w-[200px]">TÊN DANH MỤC</th>
                <th className="py-3.5 px-5 w-24 text-center">THỨ TỰ</th>
                <th className="py-3.5 px-5 min-w-[160px]">SỐ LƯỢNG MẪU</th>
                <th className="py-3.5 px-5 w-32 text-center">TRẠNG THÁI</th>
                <th className="py-3.5 px-5 w-32 text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filteredCategories.map((c, index) => {
                const catName = (c.ten || '').trim()
                const isActive = c.trang_thai === 1

                return (
                  <tr key={c.id} className="hover:bg-blue-50/30 dark:hover:bg-gray-750/50 transition-colors">
                    {/* Hình */}
                    <td className="py-4 px-5 align-middle">
                      <div className="w-14 h-14 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white p-1 flex items-center justify-center overflow-hidden shadow-2xs">
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
                      <span className="text-[11px] text-gray-400 font-mono">/{c.slug?.trim()}</span>
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Đang hiện
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                          Đang ẩn
                        </span>
                      )}
                    </td>

                    {/* Hành động */}
                    <td className="py-4 px-5 align-middle text-center">
                      <div className="flex flex-col gap-1.5 w-24 mx-auto">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="w-full py-1 px-2 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60 cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            if (!isAdmin) {
                              showToast('Chỉ Quản trị viên (Admin) mới có quyền xóa danh mục!', 'error')
                              return
                            }
                            setDeleteTarget(c)
                          }}
                          className="w-full py-1 px-2 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 border border-rose-200/60 cursor-pointer"
                        >
                          Xóa
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

      {/* ================= MODAL THÊM / SỬA DANH MỤC ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/40">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {modalMode === 'ADD' ? 'Thêm danh mục mới' : `Chỉnh sửa: ${formData.ten}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Máy hút ẩm, Máy sấy quần áo..."
                  value={formData.ten}
                  onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Slug đường dẫn
                  </label>
                  <input
                    type="text"
                    placeholder="Tự sinh nếu để trống"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={formData.thu_tu_hien_thi}
                    onChange={(e) => setFormData({ ...formData, thu_tu_hien_thi: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Số lượng mẫu hiển thị
                </label>
                <input
                  type="text"
                  placeholder="VD: 250+ mẫu"
                  value={formData.count}
                  onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Đường dẫn ảnh đại diện (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.trang_thai === 1}
                    onChange={(e) => setFormData({ ...formData, trang_thai: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Kích hoạt hiển thị</span>
                </label>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Đang lưu...' : modalMode === 'ADD' ? 'Thêm mới' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN XÓA ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-xl">
              🗑️
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Xóa danh mục "{deleteTarget.ten}"?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Lưu ý: Chỉ xóa được danh mục khi không còn sản phẩm nào thuộc ngành hàng này.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
