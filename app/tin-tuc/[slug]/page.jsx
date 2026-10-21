import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getAllArticles, getRelatedArticles } from '../../../lib/blog-data'
import ProductCard from '../../../components/ProductCard'

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((a) => ({
    slug: a.slug,
  }))
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const article = getArticleBySlug(resolvedParams.slug)

  if (!article) {
    return { title: 'Không tìm thấy bài viết – TechZone' }
  }

  return {
    title: `${article.title} – TechZone AI Blog`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
    },
  }
}

export default async function ArticleDetailPage({ params }) {
  const resolvedParams = await params
  const article = getArticleBySlug(resolvedParams.slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = getRelatedArticles(article.slug, 3)

  // Đọc db.json để lấy sản phẩm khuyên dùng liên quan đến bài viết
  const data = (await import('../../../db.json')).default
  const brandById = new Map((data.thuong_hieu ?? []).map(b => [Number(b.id), b.ten.trim()]))
  const categoryById = new Map((data.danh_muc_san_pham ?? []).map(c => [Number(c.id), c.ten.trim()]))

  const relatedProducts = (article.relatedProductIds || [])
    .map(id => (data.san_pham ?? []).find(p => p.id === id))
    .filter(Boolean)
    .map(product => {
      const price = Number(product.gia) || 0
      const original = Number(product.gia_goc) || price
      const discount = original > price ? Math.round(((original - price) / original) * 100) : 0

      let features = ['Sản phẩm chính hãng']
      try {
        const values = Object.values(JSON.parse(product.thong_so ?? '{}')).filter(Boolean)
        if (values.length) features = values.slice(0, 3)
      } catch {
        if (product.bao_hanh) features = [product.bao_hanh]
      }

      return {
        id: product.id,
        slug: product.slug?.trim(),
        name: product.ten_san_pham.trim(),
        brand: brandById.get(Number(product.id_thuong_hieu)) ?? 'Thương hiệu',
        category: categoryById.get(Number(product.id_danh_muc)) ?? 'Sản phẩm',
        price,
        original,
        discount,
        rating: Number(product.rating) || 4.5,
        reviews: Number(product.so_lan_xem) || 0,
        tag: 'AI Khuyên dùng',
        image: product.hinh_chinh?.trim(),
        features,
      }
    })

  return (
    <div className="bg-white min-h-screen py-10 sm:py-14 font-body">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/tin-tuc" className="hover:text-brand transition-colors">Tin tức AI</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
        </nav>

        {/* Header bài viết */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-bold font-display bg-brand text-white px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-gray-400 font-body">
              {article.readTime} &middot; {article.date}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand bg-brand-light px-2.5 py-0.5 rounded-full font-display">
              ✨ Hỗ trợ bởi AI
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 font-body leading-relaxed mb-6">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between py-3 border-y border-gray-100 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <p className="font-semibold text-gray-800 font-display">{article.author}</p>
                <p className="text-[11px] text-gray-400">Đã kiểm chứng thông số kỹ thuật</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/tim-kiem-ai"
                className="text-xs font-semibold text-brand hover:underline font-display"
              >
                Hỏi AI về chủ đề này →
              </Link>
            </div>
          </div>
        </header>

        {/* Ảnh đại diện bài viết */}
        <div className="mb-10 aspect-[16/9] rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-md">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Box Tóm tắt nhanh bởi AI (AI Key Takeaways) */}
        {article.aiTakeaways && article.aiTakeaways.length > 0 && (
          <div className="mb-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-3xl p-6 sm:p-7 border border-blue-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-brand-dark font-display font-bold text-base">
              <span className="text-xl">⚡</span>
              <h3>Tóm tắt cốt lõi trong 10 giây (AI Takeaways)</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-gray-700 font-body">
              {article.aiTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-brand font-bold text-base mt-[-2px]">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nội dung chi tiết bài viết */}
        <div
          className="prose prose-lg max-w-none text-gray-700 font-body leading-relaxed mb-14
            [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:mb-4 [&_p]:text-sm [&_p]:sm:text-base [&_p]:leading-relaxed
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:mb-6
            [&_li]:text-sm [&_li]:sm:text-base
            [&_strong]:text-gray-900 [&_strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Khối Sản phẩm được AI khuyên dùng theo bài viết */}
        {relatedProducts.length > 0 && (
          <div className="my-14 p-6 sm:p-8 bg-gray-50 rounded-3xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand uppercase tracking-wider font-display mb-1">
                  <span>✨ AI Recommendation</span>
                </div>
                <h3 className="text-xl font-bold font-display text-gray-900">
                  Thiết bị tối ưu được AI khuyên dùng trong bài viết
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Thẻ Tags & Chia sẻ */}
        <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 mb-14">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-gray-400 font-medium mr-1">Chủ đề:</span>
            {article.tags.map((t) => (
              <span key={t} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-body">
                #{t}
              </span>
            ))}
          </div>

          <Link
            href="/tin-tuc"
            className="text-xs font-semibold text-brand hover:underline font-display"
          >
            ← Quay lại danh sách bài viết
          </Link>
        </div>

        {/* Bài viết liên quan */}
        {relatedArticles.length > 0 && (
          <div className="pt-10 border-t border-gray-100">
            <h3 className="text-xl font-bold font-display text-gray-900 mb-6">
              Bài viết cùng chủ đề bạn có thể quan tâm
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/tin-tuc/${rel.slug}`}
                  className="group flex flex-col gap-2.5 bg-gray-50 p-4 rounded-2xl hover:bg-brand-pale border border-transparent hover:border-brand-light transition-all"
                >
                  <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-200">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-brand font-display">
                    {rel.category} &middot; {rel.readTime}
                  </span>
                  <h4 className="font-display font-bold text-sm text-gray-900 group-hover:text-brand transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
