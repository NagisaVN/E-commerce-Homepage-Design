import Link from 'next/link'

async function getPromotions() {
  const data = (await import('../../db.json')).default
  
  // Lấy các bài viết khuyến mãi
  const articles = (data.bai_viet ?? [])
    .filter((a) => Number(a.trang_thai) === 1)
    
  return articles
}

export const metadata = {
  title: 'Khuyến mãi – TechZone',
}

export default async function PromotionsPage() {
  const promotions = await getPromotions()

  return (
    <div className="bg-white min-h-screen py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-2">
          <nav className="flex items-center gap-2 text-xs font-body text-gray-400">
            <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Khuyến mãi</span>
          </nav>
          <div className="flex items-center justify-between mt-2">
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              Chương trình Khuyến mãi
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-body">
            Cập nhật các ưu đãi mới nhất và hấp dẫn nhất từ TechZone
          </p>
        </div>

        {promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promo) => (
              <div key={promo.id} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-brand-light hover:shadow-2xl hover:shadow-blue-50">
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
                  <img src={promo.hinh?.trim()} alt={promo.tieu_de?.trim()} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {promo.is_featured === 1 && (
                    <div className="absolute left-3 top-3 rounded-lg bg-brand px-2.5 py-1 text-xs font-bold text-white font-display">
                      HOT
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 font-display group-hover:text-brand transition-colors">
                    {promo.tieu_de?.trim()}
                  </h3>
                  <p className="text-sm text-gray-500 font-body line-clamp-3">
                    {promo.mo_ta_ngan?.trim()}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-body flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {new Date(promo.created_at?.trim()).toLocaleDateString('vi-VN')}
                    </span>
                    <Link href={`/khuyen-mai/${promo.slug?.trim()}`} className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors font-display">
                      Xem chi tiết →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-500 font-body">Hiện chưa có chương trình khuyến mãi nào.</p>
          </div>
        )}
      </div>
    </div>
  )
}
