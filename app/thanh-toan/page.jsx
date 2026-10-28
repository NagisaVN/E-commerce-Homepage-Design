'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

// Danh sách các tỉnh thành phố phổ biến ở Việt Nam
const VIETNAM_CITIES = [
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
  'Bà Rịa - Vũng Tàu',
  'Quảng Ninh',
  'Khánh Hòa',
  'Lâm Đồng',
  'Thừa Thiên Huế',
  'Nghệ An',
  'Thanh Hóa',
  'Tỉnh thành khác',
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, clearCart } = useCart()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'TP. Hồ Chí Minh',
    district: '',
    ward: '',
    address: '',
    note: '',
    paymentMethod: 'COD', // 'COD' | 'BANK_TRANSFER'
    isVatInvoice: false,
    vatCompany: '',
    vatTaxId: '',
    vatAddress: '',
  })

  // Prefill nếu user đã đăng nhập
  useEffect(() => {
    setMounted(true)
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
        address: user.address || prev.address,
      }))
    }
  }, [user])

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  )
  const totalOriginalAmount = cartItems.reduce((sum, item) => {
    const original = item.originalPrice || item.original || item.price || 0
    return sum + original * (item.quantity || 1)
  }, 0)
  const savings = totalOriginalAmount - totalAmount

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errorMsg) setErrorMsg('')
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    // Validate
    if (!formData.name.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên người nhận.')
      return
    }

    const phoneClean = formData.phone.trim().replace(/\s+/g, '')
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/
    if (!phoneRegex.test(phoneClean)) {
      setErrorMsg('Số điện thoại không hợp lệ (vui lòng nhập 10 chữ số, ví dụ 0912345678).')
      return
    }

    if (!formData.address.trim()) {
      setErrorMsg('Vui lòng nhập Địa chỉ nhận hàng chi tiết (số nhà, tên đường).')
      return
    }

    if (cartItems.length === 0) {
      setErrorMsg('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.')
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        customer: {
          name: formData.name.trim(),
          phone: phoneClean,
          email: formData.email.trim(),
          city: formData.city,
          district: formData.district.trim(),
          ward: formData.ward.trim(),
          address: formData.address.trim(),
          note: formData.note.trim(),
        },
        items: cartItems,
        paymentMethod: formData.paymentMethod,
        totalAmount,
        note: formData.note.trim(),
        isVatInvoice: formData.isVatInvoice,
        vatInfo: formData.isVatInvoice
          ? {
              company: formData.vatCompany,
              taxId: formData.vatTaxId,
              address: formData.vatAddress,
            }
          : null,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Không thể tạo đơn hàng, vui lòng thử lại!')
      }

      const createdOrder = data.order

      // Nếu chọn chuyển khoản ngân hàng -> Gọi API tạo Link / QR thanh toán PayOS
      if (formData.paymentMethod === 'BANK_TRANSFER') {
        try {
          const payosRes = await fetch('/api/payos/create-payment-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderCode: createdOrder.ma_don_hang,
              amount: totalAmount,
              description: createdOrder.ma_don_hang,
              items: cartItems.map((it) => ({
                name: it.name,
                quantity: it.quantity,
                price: it.price,
              })),
            }),
          })
          const payosJson = await payosRes.json()
          if (payosJson.success && payosJson.data) {
            createdOrder.payos = payosJson.data
          }
        } catch (payosErr) {
          console.warn('Lỗi khởi tạo PayOS link:', payosErr)
        }
      }

      // Lưu đơn hàng vào localStorage của khách vãng lai để họ có thể tra cứu lại bất cứ lúc nào
      try {
        const storedGuestOrders = JSON.parse(localStorage.getItem('techzone_guest_orders') || '[]')
        storedGuestOrders.unshift(createdOrder)
        localStorage.setItem('techzone_guest_orders', JSON.stringify(storedGuestOrders.slice(0, 20)))
      } catch (err) {
        console.warn('Không thể lưu đơn hàng vào localStorage:', err)
      }

      // Xóa giỏ hàng
      clearCart()

      // Nếu có URL thanh toán PayOS trực tiếp (khi đã cấu hình PayOS Client ID thật)
      if (formData.paymentMethod === 'BANK_TRANSFER' && createdOrder.payos?.checkoutUrl) {
        window.location.href = createdOrder.payos.checkoutUrl
        return
      }

      // Chuyển hướng sang trang theo dõi đơn hàng kèm tham số mã đơn
      router.push(`/don-hang/theo-doi?code=${createdOrder.ma_don_hang}&success=true`)
    } catch (err) {
      console.error('Lỗi đặt hàng:', err)
      setErrorMsg(err.message || 'Đã có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại!')
      setSubmitting(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 font-body">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-blue-50 text-brand rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🛒
            </div>
            <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">
              Giỏ hàng của bạn đang trống
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Bạn chưa có sản phẩm nào để tiến hành thanh toán. Hãy dạo một vòng và chọn cho mình sản phẩm ưng ý nhé!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-brand text-white font-semibold font-display px-6 py-3 rounded-xl hover:bg-brand-dark transition-all shadow-md shadow-blue-200"
            >
              <span>← Tiếp tục mua sắm</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // VietQR URL mẫu để hiển thị trực quan khi khách chọn chuyển khoản ngân hàng
  const vietQrPreviewUrl = `https://img.vietqr.io/image/MB-0987654321-compact2.jpg?amount=${totalAmount}&addInfo=THANHTOAN_TECHZONE&accountName=TECHZONE%20STORE`

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 font-body text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-brand transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/gio-hang" className="hover:text-brand transition-colors">
            Giỏ hàng
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-semibold">Thanh toán</span>
        </nav>

        {/* Thông báo chế độ Khách vãng lai */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex items-start sm:items-center gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-base shadow-xs">
            👤
          </div>
          <div className="flex-1 text-xs sm:text-sm text-gray-700 leading-relaxed">
            {user ? (
              <span>
                Bạn đang đặt hàng với tài khoản <strong className="text-brand-dark">{user.name}</strong> ({user.email}). Thông tin đã được tự động điền sẵn.
              </span>
            ) : (
              <span>
                <strong>Chế độ Khách Vãng Lai:</strong> Bạn không cần đăng ký tài khoản! Chỉ cần nhập tên và địa chỉ bên dưới để nhận hàng tận nơi. Đơn hàng sẽ được tự động lưu vào thiết bị để bạn tra cứu nhanh.
              </span>
            )}
          </div>
          {!user && (
            <Link
              href="/dang-nhap"
              className="hidden sm:inline-flex text-xs font-semibold text-brand font-display bg-white px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Đăng nhập nếu có tài khoản
            </Link>
          )}
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 animate-shake">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG & PHƯƠNG THỨC THANH TOÁN (8 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* KHỐI 1: THÔNG TIN NGƯỜI NHẬN */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-brand font-bold font-display flex items-center justify-center text-sm">
                  1
                </span>
                <h2 className="text-lg font-bold font-display text-gray-900">
                  Thông tin người nhận hàng
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Họ và tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VD: Nguyễn Văn An"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="VD: 0912345678"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email nhận thông báo đơn hàng <span className="text-gray-400 font-normal">(không bắt buộc)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="VD: nguyenvanan@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* KHỐI 2: ĐỊA CHỈ GIAO HÀNG */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-brand font-bold font-display flex items-center justify-center text-sm">
                  2
                </span>
                <h2 className="text-lg font-bold font-display text-gray-900">
                  Địa chỉ nhận hàng
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Tỉnh / Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm bg-white transition-all"
                  >
                    {VIETNAM_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Quận / Huyện
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="VD: Quận 1, Cầu Giấy..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Phường / Xã
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    placeholder="VD: Phường Bến Nghé..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="VD: Số 123 Đường Nguyễn Huệ, Chung cư Horizon phòng 804"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Ghi chú giao hàng <span className="text-gray-400 font-normal">(tùy chọn)</span>
                  </label>
                  <textarea
                    name="note"
                    rows={2}
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Ví dụ: Giao vào giờ hành chính, gọi trước khi đến 15 phút, nhờ hỗ trợ khiêng lên tầng 2..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-sm transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* KHỐI 3: PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-brand font-bold font-display flex items-center justify-center text-sm">
                  3
                </span>
                <h2 className="text-lg font-bold font-display text-gray-900">
                  Chọn phương thức thanh toán
                </h2>
              </div>

              <div className="space-y-3.5">
                {/* Lựa chọn 1: COD */}
                <label
                  className={`block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD'
                      ? 'border-brand bg-blue-50/50 shadow-xs ring-2 ring-brand/10'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm sm:text-base text-gray-900 font-display flex items-center gap-2">
                          <span>🚚 Thanh toán khi nhận hàng (COD)</span>
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          Khuyên dùng
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Bạn chỉ cần thanh toán bằng tiền mặt cho nhân viên giao hàng sau khi đã kiểm tra máy móc chính hãng, nguyên đai nguyên kiện.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Lựa chọn 2: Chuyển khoản VietQR */}
                <label
                  className={`block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'BANK_TRANSFER'
                      ? 'border-brand bg-blue-50/50 shadow-xs ring-2 ring-brand/10'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={formData.paymentMethod === 'BANK_TRANSFER'}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm sm:text-base text-gray-900 font-display flex items-center gap-2">
                          <span>🏦 Chuyển khoản Ngân hàng (Cổng PayOS VietQR 24/7)</span>
                        </span>
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                          PayOS Tự Động
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Thanh toán qua Cổng Open Banking PayOS (Quét mã VietQR bằng bất kỳ App ngân hàng nào hoặc MoMo, ZaloPay). Hệ thống tự động kích hoạt đơn hàng trong 3 giây.
                      </p>

                      {/* Thông tin chuyển khoản chi tiết */}
                      {formData.paymentMethod === 'BANK_TRANSFER' && (
                        <div className="mt-4 p-4 rounded-xl bg-white border border-blue-200/80 shadow-xs text-xs space-y-2">
                          <div className="flex items-center justify-between text-gray-600">
                            <span>Ngân hàng thụ hưởng:</span>
                            <strong className="text-gray-900">MBBank (Ngân hàng Quân Đội)</strong>
                          </div>
                          <div className="flex items-center justify-between text-gray-600">
                            <span>Số tài khoản:</span>
                            <strong className="text-brand font-mono text-sm tracking-wider">0987654321</strong>
                          </div>
                          <div className="flex items-center justify-between text-gray-600">
                            <span>Chủ tài khoản:</span>
                            <strong className="text-gray-900 uppercase">CTCP THIET BI DIEN MAY TECHZONE</strong>
                          </div>
                          <div className="flex items-center justify-between text-gray-600 pt-2 border-t border-gray-100">
                            <span>Số tiền cần chuyển:</span>
                            <strong className="text-emerald-600 font-bold font-display text-sm">
                              {totalAmount.toLocaleString('vi-VN')}₫
                            </strong>
                          </div>
                          <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded-lg mt-2 font-medium">
                            📌 <strong>Lưu ý:</strong> Mã QR chuyển khoản chính thức kèm Cú pháp mã đơn hàng sẽ hiển thị ngay khi bạn nhấn "Xác nhận đặt hàng" ở bước kế tiếp.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* KHỐI 4: HÓA ĐƠN VAT CÔNG TY (TÙY CHỌN) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isVatInvoice"
                  checked={formData.isVatInvoice}
                  onChange={handleChange}
                  className="w-4 h-4 text-brand rounded focus:ring-brand"
                />
                <span className="text-sm font-semibold text-gray-800">
                  Yêu cầu xuất hóa đơn giá trị gia tăng (VAT) cho doanh nghiệp
                </span>
              </label>

              {formData.isVatInvoice && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Tên công ty / Đơn vị
                    </label>
                    <input
                      type="text"
                      name="vatCompany"
                      value={formData.vatCompany}
                      onChange={handleChange}
                      placeholder="VD: Công ty TNHH Giải Pháp Công Nghệ ABC"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mã số thuế
                    </label>
                    <input
                      type="text"
                      name="vatTaxId"
                      value={formData.vatTaxId}
                      onChange={handleChange}
                      placeholder="VD: 0312345678"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Địa chỉ theo đăng ký kinh doanh
                    </label>
                    <input
                      type="text"
                      name="vatAddress"
                      value={formData.vatAddress}
                      onChange={handleChange}
                      placeholder="VD: Tầng 5, Tòa nhà Bitexco..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (4 COLS STICKY) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h3 className="text-base font-bold font-display text-gray-900">
                  Đơn hàng ({cartItems.length} sản phẩm)
                </h3>
                <Link href="/gio-hang" className="text-xs text-brand font-semibold hover:underline">
                  Sửa giỏ hàng
                </Link>
              </div>

              {/* Danh sách sản phẩm mua */}
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1 divide-y divide-gray-50">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Số lượng: {item.quantity} &times; {(item.price || 0).toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold font-display text-gray-900">
                        {((item.price || 0) * (item.quantity || 1)).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tính toán tiền */}
              <div className="pt-5 mt-5 border-t border-gray-100 space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Tiền hàng tạm tính:</span>
                  <span className="font-semibold text-gray-800">
                    {totalOriginalAmount.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Giảm giá khuyến mãi:</span>
                    <span className="font-semibold">
                      -{savings.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển toàn quốc:</span>
                  <span className="font-bold text-emerald-600">
                    MIỄN PHÍ
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-sm font-bold font-display text-gray-900 block">
                      Tổng tiền thanh toán:
                    </span>
                    <span className="text-[11px] text-gray-400">
                      (Đã bao gồm thuế GTGT 10%)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-display text-brand">
                      {totalAmount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              </div>

              {/* Nút bấm Submit */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand hover:bg-brand-dark text-white font-bold font-display py-4 rounded-2xl shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xử lý đơn hàng...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {formData.paymentMethod === 'COD'
                          ? '🚀 Xác nhận đặt hàng (COD)'
                          : '💳 Đặt hàng & Thanh toán PayOS VietQR'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Cam kết TechZone */}
              <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>100% Hàng chính hãng, nguyên đai nguyên kiện</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Bảo hành chính hãng 24 tháng tận nhà</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Đổi mới 1 - 1 trong 30 ngày nếu phát sinh lỗi kỹ thuật</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
