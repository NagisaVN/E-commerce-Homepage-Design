import Link from 'next/link'
import { getDailyHomeArticles, getDailyTip } from '../lib/blog-data'

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

export default function AiBlog() {
  const tips = getDailyHomeArticles()
  const dailyTip = getDailyTip()

  return (
    <section className="py-16 bg-brand-pale border-t border-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-brand text-xs font-semibold font-display mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tự động cập nhật mỗi ngày &middot; Hỗ trợ bởi TechZone AI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">Mẹo hay & Cẩm nang Mua sắm</h2>
            <p className="text-gray-500 font-body mt-1.5 text-xs sm:text-sm">
              Những bài phân tích chuyên sâu được luân chuyển và làm mới tự động mỗi 00:00 hàng ngày
            </p>
          </div>
          <Link href="/tin-tuc" className="text-sm text-brand font-semibold hover:underline font-display inline-flex items-center gap-1 flex-shrink-0">
            <span>Xem tất cả bài viết</span>
            <span>→</span>
          </Link>
        </div>

        {/* Banner Mẹo AI Hôm Nay */}
        {dailyTip && (
          <div className="mb-8 p-4 sm:p-5 bg-white/95 border border-blue-100 rounded-2xl flex items-start sm:items-center gap-3.5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 text-lg">
              💡
            </div>
            <div className="flex-1 text-xs sm:text-sm text-gray-700 font-body leading-relaxed">
              <strong className="font-semibold text-brand-dark">Lời khuyên AI hôm nay: </strong>
              <span>{dailyTip.replace(/^💡\s*Mẹo AI hôm nay:\s*/, '')}</span>
            </div>
            <span className="hidden md:inline-flex text-[11px] font-semibold text-brand font-display bg-brand-pale px-2.5 py-1 rounded-lg border border-blue-100 flex-shrink-0">
              Đổi mới mỗi 00:00
            </span>
          </div>
        )}

        {/* Grid 3 bài viết xoay vòng mỗi ngày */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <article
              key={tip.id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-brand-light hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 flex flex-col"
            >
              <Link href={`/tin-tuc/${tip.slug}`} className="block relative overflow-hidden bg-brand-light aspect-[16/9]">
                <img
                  src={tip.image}
                  alt={tip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-semibold font-display bg-white/95 backdrop-blur-sm text-brand px-2.5 py-1 rounded-lg">
                    {tip.category}
                  </span>
                </div>
              </Link>

              <div className="flex flex-col flex-1 p-5 gap-3">
                <div className="flex items-center gap-2">
                  <AiChip />
                  <span className="text-xs text-gray-400 font-body">{tip.readTime}</span>
                </div>

                <Link href={`/tin-tuc/${tip.slug}`}>
                  <h3 className="text-base font-bold font-display text-gray-900 leading-snug group-hover:text-brand transition-colors line-clamp-2">
                    {tip.title}
                  </h3>
                </Link>

                <p className="text-sm text-gray-500 font-body leading-relaxed flex-1 line-clamp-3">
                  {tip.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {tip.tags.map(tag => (
                    <span key={tag} className="text-xs bg-brand-pale text-brand-dark px-2 py-0.5 rounded-full font-body">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="white">
                        <path d="M8 1.5l1 3h3l-2.4 1.8.9 3-2.5-1.8-2.5 1.8.9-3L3 4.5h3z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500 font-body">
                      {tip.author} &middot; <span className="text-brand font-medium">{tip.date}</span>
                    </span>
                  </div>
                  <Link href={`/tin-tuc/${tip.slug}`} className="text-xs font-semibold font-display text-brand hover:underline">
                    Đọc tiếp →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Tư Vấn AI */}
        <div className="mt-10 bg-gradient-to-r from-brand-dark to-brand rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
              <path d="M16 4l2 7h7l-5.7 4.1 2.2 6.9L16 18.2l-5.5 3.8 2.2-6.9L7 11h7z" fill="#FCD34D" />
              <circle cx="26" cy="7" r="2.5" fill="#60A5FA" />
              <circle cx="5" cy="24" r="1.5" fill="#93C5FD" opacity="0.7" />
            </svg>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-display font-bold text-white mb-1">
              Hỏi AI của chúng tôi — nhận tư vấn mua hàng cá nhân hóa
            </h3>
            <p className="text-blue-200 font-body text-sm">
              Cho chúng tôi biết ngân sách, diện tích phòng và nhu cầu gia đình. AI sẽ gợi ý sản phẩm hoàn hảo trong vài giây.
            </p>
          </div>
          <Link
            href="/tim-kiem-ai"
            className="flex-shrink-0 bg-white text-brand-dark px-6 py-3 rounded-xl font-display font-semibold hover:bg-brand-light transition-colors active:scale-95 whitespace-nowrap"
          >
            ✨ Thử AI Tư Vấn
          </Link>
        </div>
      </div>
    </section>
  )
}
