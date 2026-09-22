import { Outfit, Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../context/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-outfit',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'TechZone – Điện Máy Thông Minh',
  description: 'Cửa hàng điện máy gia dụng thông minh hỗ trợ AI — tủ lạnh, máy lạnh, máy giặt và nhiều hơn nữa.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${outfit.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
