import Link from 'next/link'
import BrandLogo from '../../components/BrandLogo'

async function getBrands() {
  const data = (await import('../../db.json')).default

  const activeBrands = (data.thuong_hieu ?? [])
    .filter((b) => Number(b.trang_thai) === 1)
    .sort((a, b) => a.thu_tu_hien_thi - b.thu_tu_hien_thi)

  return activeBrands
}

export const metadata = {
  title: 'Thương hiệu – TechZone',
}

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-14 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-2">
          <nav className="flex items-center gap-2 text-xs font-body text-gray-400 dark:text-gray-500">
            <Link href="/" className="hover:text-brand dark:hover:text-blue-400 transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-600 dark:text-gray-300 font-medium">Thương hiệu</span>
          </nav>
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-display">
              Tất cả Thương hiệu
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body">
            Khám phá các thương hiệu hàng đầu đang được phân phối tại TechZone
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/thuong-hieu/${brand.slug?.trim()}`}
              className="group bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center gap-4 border border-gray-100 dark:border-gray-800 hover:border-brand-light dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-50 dark:hover:shadow-none transition-all duration-300 text-center"
            >
              <div className="h-16 sm:h-20 w-full flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-105 dark:opacity-95 transition-all duration-300">
                <BrandLogo name={brand.ten} size="lg" />
              </div>
              <div className="text-center w-full">
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-400 font-display group-hover:text-brand dark:group-hover:text-blue-400 transition-colors truncate">
                  {brand.ten.trim()}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
