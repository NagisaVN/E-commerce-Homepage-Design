import Link from 'next/link'

export const metadata = {
  title: '404 - Không tìm thấy trang | TechZone',
  description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di dời.',
}

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-gray-50/50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-2xl border border-gray-100 shadow-sm">
        <div className="w-24 h-24 bg-blue-50 text-brand rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl font-extrabold font-display shadow-inner">
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">
          Không tìm thấy trang
        </h1>
        <p className="text-gray-500 font-body text-sm mb-8 leading-relaxed">
          Trang hoặc sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ khác.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-brand text-white font-semibold font-display px-6 py-2.5 rounded-xl hover:bg-brand-dark transition-colors shadow-sm"
          >
            Về trang chủ
          </Link>
          <Link
            href="/san-pham"
            className="border border-gray-200 text-gray-700 font-semibold font-display px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </div>
  )
}
