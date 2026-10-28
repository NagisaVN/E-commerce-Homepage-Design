import { notFound } from 'next/navigation'
import Link from 'next/link'

async function getPromotionData(rawSlug) {
  if (!rawSlug) return null
  const cleanSlug = decodeURIComponent(rawSlug).trim()

  const data = (await import('../../../db.json')).default
  const promo = data.bai_viet?.find(
    (a) => a.slug?.trim() === cleanSlug && Number(a.trang_thai) === 1
  )

  if (!promo) return null

  // Lấy các khuyến mãi liên quan khác
  const otherPromotions = (data.bai_viet ?? [])
    .filter((a) => a.id !== promo.id && Number(a.trang_thai) === 1)
    .slice(0, 3)

  return { promo, otherPromotions }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const rawSlug = resolvedParams.slug
  const result = await getPromotionData(rawSlug)

  if (!result) {
    return { title: 'Không tìm thấy khuyến mãi – TechZone' }
  }

  return {
    title: `${result.promo.tieu_de?.trim()} – TechZone Khuyến Mãi`,
    description: result.promo.mo_ta_ngan?.trim() || '',
  }
}

export default async function PromotionDetailPage({ params }) {
  const resolvedParams = await params
  const rawSlug = resolvedParams.slug
  const result = await getPromotionData(rawSlug)

  if (!result) {
    notFound()
  }

  const { promo, otherPromotions } = result

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-body text-gray-400 mb-6">
          <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/khuyen-mai" className="hover:text-brand transition-colors">Khuyến mãi</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300 font-medium truncate max-w-xs">{promo.tieu_de?.trim()}</span>
        </nav>

        {/* Tiêu đề & meta */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            {promo.is_featured === 1 && (
              <span className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                Ưu đãi Hot
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 font-body flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {promo.created_at ? new Date(promo.created_at.trim()).toLocaleDateString('vi-VN') : 'Đang diễn ra'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display leading-tight">
            {promo.tieu_de?.trim()}
          </h1>

          {promo.mo_ta_ngan && (
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-body leading-relaxed border-l-4 border-brand pl-4 py-1 italic bg-blue-50/40 dark:bg-blue-950/20 rounded-r-lg">
              {promo.mo_ta_ngan.trim()}
            </p>
          )}
        </div>

        {/* Ảnh bài viết */}
        {promo.hinh && (
          <div className="mb-10 overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 aspect-[16/9] bg-gray-50 dark:bg-gray-800">
            <img
              src={promo.hinh.trim()}
              alt={promo.tieu_de?.trim()}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Nội dung chi tiết */}
        <article className="prose prose-blue dark:prose-invert max-w-none font-body text-gray-700 dark:text-gray-300 leading-relaxed mb-12">
          {promo.noi_dung ? (
            <div dangerouslySetInnerHTML={{ __html: promo.noi_dung }} />
          ) : (
            <p>Thông tin chi tiết chương trình khuyến mãi đang được cập nhật. Vui lòng quay lại sau hoặc liên hệ bộ phận hỗ trợ khách hàng của TechZone.</p>
          )}
        </article>

        {/* Nút hành động */}
        <div className="flex flex-wrap gap-4 py-6 border-t border-b border-gray-100 dark:border-gray-800 mb-12 justify-between items-center">
          <Link
            href="/khuyen-mai"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand transition-colors"
          >
            ← Quay lại danh sách khuyến mãi
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark transition-all"
          >
            Khám phá sản phẩm ngay
          </Link>
        </div>

        {/* Các khuyến mãi khác */}
        {otherPromotions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display mb-6">
              Các chương trình ưu đãi khác
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {otherPromotions.map((item) => (
                <Link
                  key={item.id}
                  href={`/khuyen-mai/${item.slug?.trim()}`}
                  className="group block overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-50 dark:bg-gray-800">
                    <img
                      src={item.hinh?.trim()}
                      alt={item.tieu_de?.trim()}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand transition-colors font-display">
                      {item.tieu_de?.trim()}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
