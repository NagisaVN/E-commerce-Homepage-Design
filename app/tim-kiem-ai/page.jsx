import Link from 'next/link'
import { runAiSearch } from '../../lib/ai-search'
import ProductCard from '../../components/ProductCard'

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams
  const q = resolvedParams?.q || ''
  return {
    title: q ? `AI Tìm kiếm: "${q}" – TechZone` : 'Tìm kiếm thông minh AI – TechZone',
    description: 'Trợ lý tìm kiếm và tư vấn mua sắm điện máy thông minh bằng AI tại TechZone.',
  }
}

export default async function AiSearchPage({ searchParams }) {
  const resolvedParams = await searchParams
  const query = (resolvedParams?.q || '').trim()

  const result = query ? await runAiSearch(query) : null

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 sm:py-14 font-body transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <Link href="/" className="hover:text-brand dark:hover:text-blue-400 transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300 font-medium">Tìm kiếm AI</span>
        </nav>

        {/* Thanh tìm kiếm AI đầu trang */}
        <div className="bg-gradient-to-r from-brand-dark via-brand to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold font-display uppercase tracking-wider mb-4">
              <span className="text-sm">✨</span>
              <span>Trợ lý AI Mua sắm thông minh</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold mb-3 leading-tight">
              {query ? `Kết quả AI cho: "${query}"` : 'Hỏi AI để tìm thiết bị gia dụng hoàn hảo'}
            </h1>
            <p className="text-blue-200 text-sm sm:text-base font-body mb-6">
              AI sẽ phân tích dung tích, công suất, diện tích phòng và mức ngân sách của bạn để gợi ý sản phẩm tối ưu nhất.
            </p>

            <form action="/tim-kiem-ai" method="GET" className="relative flex items-center">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Hỏi AI: Tìm tủ lạnh cho gia đình 4 người dưới 10 triệu..."
                className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm sm:text-base font-body pl-5 pr-28 py-3.5 sm:py-4 rounded-2xl shadow-inner outline-none border-2 border-transparent focus:border-amber-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="absolute right-2 bg-brand hover:bg-brand-dark text-white font-display font-semibold text-xs sm:text-sm px-5 py-2.5 sm:py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                ✨ Tìm kiếm AI
              </button>
            </form>
          </div>
        </div>

        {/* Nếu có kết quả tìm kiếm */}
        {result && (
          <div className="space-y-8">
            {/* Box Lời khuyên & Tiêu chí nhận diện */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3 text-brand-dark dark:text-blue-300 font-display font-bold text-lg">
                <span className="text-2xl">🤖</span>
                <h2>Phân tích & Lời khuyên chuyên gia TechZone AI</h2>
              </div>

              <p className="text-gray-700 dark:text-gray-300 font-body text-base leading-relaxed mb-4">
                {result.summary}
              </p>

              {result.advice && (
                <div className="bg-brand-pale dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-brand-light dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 font-body mb-5">
                  <p dangerouslySetInnerHTML={{ __html: result.advice.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              )}

              {result.criteriaTags && result.criteriaTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold self-center mr-1">Tiêu chí đã nhận diện:</span>
                  {result.criteriaTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-50 dark:bg-blue-950/60 text-brand dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Danh sách sản phẩm tương thích */}
            {result.products.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">
                      Sản phẩm tương thích nhất ({result.products.length})
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-body mt-0.5">
                      Được sắp xếp theo chỉ số tương thích nhu cầu & tính năng kỹ thuật
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {result.products.map((product) => {
                    const formatted = {
                      id: product.id,
                      slug: product.slug,
                      name: product.name,
                      brand: product.brand,
                      category: product.category,
                      price: product.price,
                      original: product.original,
                      discount: product.discount,
                      rating: product.rating,
                      reviews: product.reviews,
                      image: product.image,
                      tag: `${product.aiMatchPercent}% Phù hợp`,
                      features: product.aiReasons && product.aiReasons.length > 0
                        ? product.aiReasons
                        : ['Sản phẩm chính hãng'],
                    }

                    return <ProductCard key={product.id} product={formatted} />
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  🔍
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display mb-2">
                  Chưa tìm thấy sản phẩm hoàn toàn khớp
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-body text-sm mb-6 max-w-md mx-auto">
                  Bạn có thể thử nới rộng ngân sách hoặc tìm kiếm theo danh mục chung (ví dụ: &quot;Tủ lạnh Inverter&quot;, &quot;Máy giặt cửa trước&quot;).
                </p>
                <Link
                  href="/san-pham"
                  className="inline-block bg-brand text-white font-bold font-display px-8 py-3 rounded-xl hover:bg-brand-dark transition-all"
                >
                  Xem tất cả sản phẩm
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Khi chưa nhập câu hỏi */}
        {!result && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
            <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-2">
              Các câu hỏi mẫu bạn có thể thử ngay
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-8">
              Bấm vào bất kỳ câu hỏi nào dưới đây để AI phân tích và đưa ra khuyến nghị phù hợp:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
              {[
                { title: 'Tủ lạnh gia đình 4 người dưới 10 triệu', query: 'Tìm tủ lạnh cho gia đình 4 người dưới 10 triệu', icon: '❄️' },
                { title: 'Máy lạnh Inverter tiết kiệm điện phòng 15m²', query: 'Máy lạnh Inverter tiết kiệm điện phòng 15m2', icon: '🌬️' },
                { title: 'Máy giặt cửa trước giặt êm, diệt khuẩn', query: 'Máy giặt cửa trước chạy êm tiết kiệm điện', icon: '🧺' },
                { title: 'Smart TV 4K cho phòng khách xem bóng đá', query: 'Smart TV 4K cho phòng khách rộng', icon: '📺' },
                { title: 'Nồi cơm điện giá rẻ cho sinh viên', query: 'Nồi cơm điện giá rẻ tiết kiệm điện', icon: '🍚' },
                { title: 'Lò vi sóng có nướng công nghệ Inverter', query: 'Lò vi sóng có nướng inverter', icon: '🍲' },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={`/tim-kiem-ai?q=${encodeURIComponent(item.query)}`}
                  className="group bg-brand-pale dark:bg-gray-800 hover:bg-brand-light dark:hover:bg-gray-750 p-4 rounded-2xl border border-brand-light dark:border-gray-700 transition-all flex items-start gap-3"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-display font-semibold text-sm text-gray-900 dark:text-white group-hover:text-brand dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-body mt-1">
                      Bấm để AI phân tích →
                    </p>
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
