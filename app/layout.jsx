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
  title: 'CoolHome – Smart Home Appliances',
  description: 'AI-powered home appliance e-commerce — fridges, ACs, washing machines and more.',
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
