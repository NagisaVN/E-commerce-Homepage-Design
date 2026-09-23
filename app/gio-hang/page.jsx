'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '../../context/CartContext'

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart: removeItem } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalAmount = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
  const totalOriginalAmount = cartItems.reduce((sum, item) => {
    const original = item.originalPrice || item.original || item.price || 0
    return sum + (original * (item.quantity || 1))
  }, 0)
  const savings = totalOriginalAmount - totalAmount

  if (!mounted) {
    return (
      <div className="bg-gray-50 min-h-screen py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 sm:py-14 font-body">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-display">Giỏ hàng của bạn</h1>
          <p className="text-sm text-gray-500 mt-2">
            {cartItems.length > 0 ? `Bạn có ${cartItems.length} sản phẩm trong giỏ hàng` : 'Giỏ hàng của bạn đang trống'}
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cột trái: Danh sách sản phẩm */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="w-full sm:w-32 aspect-square rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <Link href={`/product/${item.slug}`} className="text-base font-bold text-gray-900 font-display hover:text-brand transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Xóa sản phẩm"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                        </button>
                      </div>
                      
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-brand font-display">{item.price.toLocaleString('vi-VN')}₫</span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-gray-400 line-through">{item.originalPrice.toLocaleString('vi-VN')}₫</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-semibold font-display text-gray-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                          disabled={item.quantity >= (item.stock || 10)}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900 font-display">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cột phải: Tổng tiền */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 font-display mb-4">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                  <span>{totalOriginalAmount.toLocaleString('vi-VN')}₫</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Khuyến mãi:</span>
                    <span>-{savings.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí giao hàng:</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-gray-900 font-bold font-display">Tổng cộng:</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-brand font-display block">
                      {totalAmount.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="text-xs text-gray-400">(Đã bao gồm VAT)</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-brand text-white font-bold font-display py-3.5 rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-blue-200 active:scale-[0.98]">
                Tiến hành thanh toán
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-green-500"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-xs text-gray-500">Thanh toán bảo mật 100%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-gray-400">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-display mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-500 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
            <Link href="/" className="inline-block bg-brand text-white font-bold font-display px-8 py-3 rounded-xl hover:bg-brand-dark transition-all">
              Tiếp tục mua sắm
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
