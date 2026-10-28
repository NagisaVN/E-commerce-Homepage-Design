import { Outfit, Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import LayoutShell from '../components/LayoutShell'

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
    <html lang="vi" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{const t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
        <AuthProvider>
          <CartProvider>
            <LayoutShell>{children}</LayoutShell>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
