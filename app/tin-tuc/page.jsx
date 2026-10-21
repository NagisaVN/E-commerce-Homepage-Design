import Link from 'next/link'
import { getAllArticles, blogCategories, getDailyFeaturedArticle, getDailyTip } from '../../lib/blog-data'

export const revalidate = 3600 // Tự động làm mới trang định kỳ (ISR) để nhận bài viết mới mỗi ngày

export const metadata = {
  title: 'Tin tức, Mẹo hay & Hướng dẫn Mua sắm AI – TechZone',
  description: 'Những kiến thức chuyên sâu, mẹo tiết kiệm điện và phân tích thiết bị điện máy gia dụng được hỗ trợ bởi TechZone AI.',
}

function AiChip() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-brand-light border border-brand-light text-brand text-xs font-semibold font-display px-2.5 py-1 rounded-full">
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
        <path d="M8 1.5l1 3h3l-2.4 1.8.9 2.7-2.5-1.8-2.5 1.8.9-2.7L3 4.5h3z" fill="#1D4ED8" />
        <circle cx="13" cy="3" r="1.2" fill="#60A5FA" />
        <circle cx="3" cy="12" r="0.8" fill="#93C5FD" />
      </svg>
      Tạo bởi AI
    </span>
  )
}

export default async function BlogIndexPage({ searchParams }) {
  const resolvedParams = await searchParams
  const selectedCat = resolvedParams?.category || 'Tất cả'

  const allArticles = getAllArticles()
  const dailyTip = getDailyTip()
  const featured = getDailyFeaturedArticle() // TỰ ĐỘNG THAY ĐỔI MỖI NGÀY!

  const filtered = selectedCat === 'Tất cả'
    ? allArticles
    : allArticles.filter(a => a.category.toLowerCase() === selectedCat.toLowerCase())

  const regularArticles = filtered.filter(a => selectedCat !== 'Tất cả' || a.id !== featured.id)

  return (
    <div className="bg-gray-50 min-h-screen py-10 sm:py-14 font-body">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium">Tin tức AI</span>
        </nav>

        {/* Hero Banner Header */}
        <div className="bg-gradient-to-r from-brand-dark via-brand to-indigo-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold font-display uppercase tracking-wider mb-4">
              <span>✨ TechZone AI Insights</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold mb-3 leading-tight">
              Mẹo hay, Tin tức & Cẩm nang Mua sắm
            </h1>
            <p className="text-blue-100 text-sm sm:text-base font-body leading-relaxed mb-6">
              Những phân tích dữ liệu chuyên sâu từ hơn 50.000 hộ gia đình, giúp bạn chọn đúng thiết bị điện máy bền bỉ, tiết kiệm điện và chuẩn công năng nhất.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/tim-kiem-ai"
                className="bg-white hover:bg-brand-light text-brand-dark font-display font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5"
              >
                <span>🤖 Thử Trợ lý Tư vấn AI</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Banner Mẹo AI Hôm Nay */}
        {dailyTip && (
          <div className="mb-8 p-4 sm:p-5 bg-white border border-blue-100 rounded-2xl flex items-start sm:items-center gap-3.5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 text-lg">
              💡
            </div>
            <div className="flex-1 text-xs sm:text-sm text-gray-700 font-body leading-relaxed">
              <strong className="font-semibold text-brand-dark">Lời khuyên AI hôm nay: </strong>
              <span>{dailyTip.replace(/^💡\s*Mẹo AI hôm nay:\s*/, '')}</span>
            </div>
            <span className="hidden sm:inline-flex text-[11px] font-semibold text-brand font-display bg-brand-pale px-2.5 py-1 rounded-lg border border-blue-100 flex-shrink-0">
              Đổi mới mỗi 00:00
            </span>
          </div>
        )}

        {/* Thanh lọc Category Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {blogCategories.map((cat) => {
            const active = selectedCat.toLowerCase() === cat.toLowerCase()
            return (
              <Link
                key={cat}
                href={cat === 'Tất cả' ? '/tin-tuc' : `/tin-tuc?category=${encodeURIComponent(cat)}`}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-display transition-all ${
                  active
                    ? 'bg-brand text-white shadow-md shadow-blue-200'
                    : 'bg-white hover:bg-brand-pale text-gray-600 border border-gray-200'
                }`}
              >
                {cat}
              </Link>
            )
          })}
        </div>

        {/* Bài viết Tiêu điểm (Featured Article) - Chỉ hiện khi ở tab Tất cả */}
        {selectedCat === 'Tất cả' && featured && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold font-display uppercase tracking-widest text-brand bg-blue-50 px-2.5 py-1 rounded-lg">
                🔥 Bài viết Tiêu điểm AI — Tự động đổi mới mỗi ngày
              </span>
              <span className="text-xs text-gray-400 font-body hidden sm:inline">
                ({featured.date})
              </span>
            </div>

            <article className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-brand-light hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-gray-100">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-semibold font-display bg-white/95 backdrop-blur-md text-brand px-3 py-1.5 rounded-xl shadow-xs">
                    {featured.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AiChip />
                    <span className="text-xs text-gray-400 font-body">{featured.readTime}</span>
                  </div>

                  <Link href={`/tin-tuc/${featured.slug}`}>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-gray-900 leading-snug group-hover:text-brand transition-colors mb-3">
                      {featured.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-gray-600 font-body leading-relaxed mb-4 line-clamp-3">
                    {featured.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {featured.tags.map((t) => (
                      <span key={t} className="text-xs bg-brand-pale text-brand-dark px-2.5 py-0.5 rounded-full font-body">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-body">
                    {featured.author} &middot; {featured.date}
                  </span>
                  <Link
                    href={`/tin-tuc/${featured.slug}`}
                    className="text-xs sm:text-sm font-semibold font-display text-brand hover:underline flex items-center gap-1"
                  >
                    <span>Đọc tiếp</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Lưới các bài viết thông thường */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-gray-900">
              {selectedCat === 'Tất cả' ? 'Danh sách bài viết mới nhất' : `Chủ đề: ${selectedCat}`} ({filtered.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-brand-light hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-semibold font-display bg-white/95 backdrop-blur-sm text-brand px-2.5 py-1 rounded-lg">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
                  <div className="flex items-center gap-2">
                    <AiChip />
                    <span className="text-xs text-gray-400 font-body">{article.readTime}</span>
                  </div>

                  <Link href={`/tin-tuc/${article.slug}`}>
                    <h3 className="text-base sm:text-lg font-bold font-display text-gray-900 leading-snug group-hover:text-brand transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-gray-500 font-body leading-relaxed flex-1 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {article.tags.map((t) => (
                      <span key={t} className="text-[11px] bg-brand-pale text-brand-dark px-2 py-0.5 rounded-full font-body">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-body">
                    <span>{article.date}</span>
                    <Link
                      href={`/tin-tuc/${article.slug}`}
                      className="font-semibold text-brand font-display hover:underline"
                    >
                      Chi tiết →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Box kêu gọi trải nghiệm AI tư vấn */}
        <div className="mt-14 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg shadow-blue-200">
              💡
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-brand-dark mb-1">
                Bạn đang băn khoăn chưa biết chọn thiết bị nào?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-body">
                Hỏi ngay Trợ lý AI TechZone để nhận lời khuyên mua sắm dựa trên diện tích phòng và ngân sách thực tế.
              </p>
            </div>
          </div>

          <Link
            href="/tim-kiem-ai"
            className="flex-shrink-0 bg-brand hover:bg-brand-dark text-white font-display font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
          >
            ✨ Thử Tư Vấn AI Ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
