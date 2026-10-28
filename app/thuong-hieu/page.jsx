import Link from 'next/link'

// SVG config per brand name — maps brand name → SVG rendering props
const brandSvgConfig = {
  Samsung: { viewBox: '0 0 120 40', x: 4, y: 30, fontWeight: 700, fontSize: 28, className: 'text-[#1428A0] dark:text-blue-400', displayName: 'Samsung' },
  LG: { viewBox: '0 0 60 40', x: 4, y: 30, fontWeight: 800, fontSize: 30, className: 'text-[#A50034] dark:text-rose-400', displayName: 'LG' },
  Panasonic: { viewBox: '0 0 130 40', x: 2, y: 29, fontWeight: 600, fontSize: 24, className: 'text-[#003087] dark:text-blue-400', displayName: 'Panasonic' },
  Sony: { viewBox: '0 0 80 40', x: 2, y: 30, fontWeight: 700, fontSize: 28, className: 'text-[#111827] dark:text-white', displayName: 'Sony' },
  Toshiba: { viewBox: '0 0 110 40', x: 2, y: 29, fontWeight: 700, fontSize: 26, className: 'text-[#FF0000] dark:text-red-400', displayName: 'TOSHIBA' },
  Sharp: { viewBox: '0 0 90 40', x: 2, y: 29, fontWeight: 700, fontSize: 26, className: 'text-[#BE0028] dark:text-rose-400', displayName: 'SHARP' },
  Aqua: { viewBox: '0 0 80 40', x: 2, y: 30, fontWeight: 700, fontSize: 28, className: 'text-[#0072CE] dark:text-sky-400', displayName: 'AQUA' },
  Daikin: { viewBox: '0 0 100 40', x: 2, y: 29, fontWeight: 700, fontSize: 26, className: 'text-[#009FE3] dark:text-sky-400', displayName: 'DAIKIN' },
  Electrolux: { viewBox: '0 0 140 40', x: 2, y: 29, fontWeight: 600, fontSize: 24, className: 'text-[#003087] dark:text-blue-300', displayName: 'Electrolux' },
}

function getDefaultSvgConfig(name) {
  const charWidth = 14
  const width = Math.max(name.length * charWidth + 10, 80)
  return { viewBox: `0 0 ${width} 40`, x: 2, y: 29, fontWeight: 600, fontSize: 24, className: 'text-[#374151] dark:text-gray-200', displayName: name }
}

function BrandLogo({ name }) {
  const trimmed = name.trim()
  const config = brandSvgConfig[trimmed] || getDefaultSvgConfig(trimmed)

  return (
    <svg viewBox={config.viewBox} className="h-10 w-auto">
      <text
        x={config.x}
        y={config.y}
        fontFamily="Outfit, sans-serif"
        fontWeight={config.fontWeight}
        fontSize={config.fontSize}
        fill="currentColor"
        className={config.className}
      >
        {config.displayName}
      </text>
    </svg>
  )
}

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
              className="group bg-white dark:bg-gray-900 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 border border-gray-100 dark:border-gray-800 hover:border-brand-light dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-50 dark:hover:shadow-none transition-all duration-300"
            >
              <div className="h-14 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 dark:opacity-90 transition-all duration-300">
                <BrandLogo name={brand.ten} />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 font-display group-hover:text-brand dark:group-hover:text-blue-400 transition-colors">
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
