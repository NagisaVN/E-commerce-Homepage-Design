'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext({
  cartItems: [],
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {}
})

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load giỏ hàng từ sessionStorage khi component mount
  useEffect(() => {
    try {
      const savedCart = sessionStorage.getItem('techzone_cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (e) {
      console.error('Không thể tải giỏ hàng từ sessionStorage', e)
    }
    setIsInitialized(true)
  }, [])

  // Lưu giỏ hàng vào sessionStorage mỗi khi có thay đổi
  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem('techzone_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ))
  }

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
