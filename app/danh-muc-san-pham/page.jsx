import Link from 'next/link'
import Image from 'next/image'

const categoryTheme = {
  'tu-lanh': { bg: '#EFF6FF', text: '#1D4ED8', badge: 'bg-blue-50 text-blue-700' },
  'may-lanh': { bg: '#E0F2FE', text: '#0369A1', badge: 'bg-sky-50 text-sky-700' },
  'may-giat': { bg: '#EFF6FF', text: '#1D4ED8', badge: 'bg-indigo-50 text-indigo-700' },
  'lo-vi-song': { bg: '#F0F9FF', text: '#0284C7', badge: 'bg-cyan-50 text-cyan-700' },
  'noi-com-dien': { bg: '#FFF7ED', text: '#C2410C', badge: 'bg-orange-50 text-orange-700' },
  'quat-dieu-hoa': { bg: '#FFF7ED', text: '#C2410C', badge: 'bg-amber-50 text-amber-700' },
  'tivi': { bg: '#F5F3FF', text: '#6D28D9', badge: 'bg-purple-50 text-purple-700' },
  'loa-thanh': { bg: '#FFF7ED', text: '#C2410C', badge: 'bg-rose-50 text-rose-700' },
}

function CategoryIcon({ slug, color }) {
  const iconProps = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'h-8 w-8' }

  if (slug === 'tu-lanh') return <svg viewBox="0 0 32 32" {...iconProps}><rect x="8" y="3" width="16" height="27" rx="3" /><line x1="8" y1="13" x2="24" y2="13" /><line x1="12" y1="8" x2="12" y2="11" /><line x1="12" y1="17" x2="12" y2="22" /></svg>
  if (slug === 'may-lanh') return <svg viewBox="0 0 32 32" {...iconProps}><rect x="3" y="8" width="26" height="10" rx="3" /><path d="M8 18v6M13 18v4M19 18v4M24 18v6" /><path d="M7 13h18" strokeDasharray="2 2" /></svg>
  if (slug === 'may-giat') return <svg viewBox="0 0 32 32" {...iconProps}><rect x="4" y="3" width="24" height="27" rx="3" /><circle cx="16" cy="19" r="6" /><circle cx="16" cy="19" r="2.5" /><circle cx="9" cy="8" r="1.5" fill={color} stroke="none" /><circle cx="14" cy="8" r="1.5" fill="#60A5FA" stroke="none" /></svg>
  if (slug === 'lo-vi-song') return <svg viewBox="0 0 32 32" {...iconProps}><rect x="2" y="7" width="28" height="18" rx="3" /><rect x="5" y="10" width="17" height="12" rx="2" /><circle cx="26" cy="14" r="1.2" fill={color} stroke="none" /><circle cx="26" cy="18" r="1.2" fill={color} stroke="none" /></svg>
  if (slug === 'loa-thanh') return <svg viewBox="0 0 32 32" {...iconProps}><rect x="4" y="6" width="24" height="20" rx="3" /><rect x="6" y="15" width="20" height="6" rx="1.5" /><circle cx="16" cy="9" r="3.5" /></svg>
  if (slug === 'tivi') return <svg viewBox="0 0 32 32" {...iconProps}><rect x="3" y="5" width="26" height="18" rx="2" /><path d="M12 28h8M16 23v5" /></svg>
  return <svg viewBox="0 0 32 32" {...iconProps}><rect x="5" y="4" width="22" height="24" rx="3" /><path d="M9 10h14M9 16h14M9 22h9" /></svg>
}

async function getCategoriesData() {
  const data = (await import('../../db.json')).default
  const allProducts = data.san_pham ?? []

  const categories = (data.danh_muc_san_pham ?? [])
    .filter(cat => Number(cat.trang_thai) === 1)
    .sort((a, b) => Number(a.thu_tu_hien_thi) - Number(b.thu_tu_hien_thi))
    .map(category => {
      const slug = category.slug?.trim() || ''
      const matchedProducts = allProducts.filter(sp => Number(sp.id_danh_muc) === Number(category.id))
      return {
        id: category.id,
        name: category.ten?.trim() || '',
        slug,
        countText: category.count || `${matchedProducts.length} mẫu`,
        productCount: matchedProducts.length,
        imageUrl: category.image_url?.trim(),
        featuredProducts: matchedProducts.slice(0, 3).map(p => ({
          name: p.ten_san_pham?.trim(),
          slug: p.slug?.trim(),
        }))
      }
    })

  return { categories, totalProducts: allProducts.length }
}

export const metadata = {
  title: 'Tất cả danh mục sản phẩm – TechZone',
  description: 'Khám phá tất cả các danh mục điện lạnh, gia dụng và công nghệ chính hãng tại TechZone.',
}

export default async function CategoriesPage() {
  const { categories, totalProducts } = await getCategoriesData()

  return (
    <div className="bg-gray-50/50 dark:bg-gray-950 min-h-screen py-10 sm:py-14 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-body text-gray-400 dark:text-gray-500">
          <Link href="/" className="hover:text-brand dark:hover:text-blue-400 transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300 font-medium">Danh mục sản phẩm</span>
        </nav>

        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-gray-200/80 dark:border-gray-800 pb-8">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand dark:text-blue-400 font-display">
              Hệ thống ngành hàng
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display tracking-tight">
              Tất Cả Danh Mục Sản Phẩm
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-body max-w-2xl leading-relaxed">
              Khám phá hơn {totalProducts} thiết bị điện lạnh, điện gia dụng và âm thanh thông minh chính hãng 100% với ưu đãi hấp dẫn và chính sách bảo hành chu đáo.
            </p>
          </div>
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand dark:text-blue-400 hover:text-brand-dark transition-colors font-display self-start md:self-auto"
          >
            Xem toàn bộ sản phẩm →
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const theme = categoryTheme[category.slug] || { bg: '#EFF6FF', text: '#1D4ED8', badge: 'bg-blue-50 text-blue-700' }
            return (
              <div
                key={category.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-gray-900 p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand/20 dark:hover:border-blue-500/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: theme.bg }}
                    >
                      <CategoryIcon slug={category.slug} color={theme.text} />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${theme.badge} font-display`}>
                      {category.productCount} sản phẩm
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand dark:group-hover:text-blue-400 transition-colors font-display">
                    {category.name}
                  </h2>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-400 font-body">
                    {category.countText} sẵn sàng giao ngay
                  </p>

                  {/* Sample items */}
                  {category.featuredProducts.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-1.5">
                      <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider font-display">
                        Sản phẩm tiêu biểu:
                      </span>
                      {category.featuredProducts.map((p, idx) => (
                        <span key={idx} className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 hover:text-brand dark:hover:text-blue-400 font-body">
                          • {p.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3">
                  <Link
                    href={`/danh-muc-san-pham/${category.slug}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-800 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 font-display transition-all group-hover:bg-brand group-hover:text-white"
                  >
                    <span>Khám phá danh mục</span>
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white font-display">100% Chính Hãng</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-body">Cam kết xuất xứ rõ ràng</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚚</span>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white font-display">Giao Siêu Tốc</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-body">Miễn phí nội thành toàn quốc</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white font-display">Bảo Hành Chính Hãng</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-body">Hỗ trợ kích hoạt tận nhà</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white font-display">Đổi Trả 30 Ngày</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-body">Lỗi 1 đổi 1 nhanh chóng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
