import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '../../../components/ProductCard'

async function getBrandData(slug) {
  const data = (await import('../../../db.json')).default

  // Tìm thương hiệu
  const brand = data.thuong_hieu?.find(
    (th) => th.slug.trim() === slug
  )

  if (!brand) return null

  // Lấy các sản phẩm thuộc thương hiệu
  const products = data.san_pham?.filter(
    (sp) => Number(sp.id_thuong_hieu) === Number(brand.id)
  ) || []

  const brandById = new Map((data.thuong_hieu ?? []).map(b => [Number(b.id), b.ten.trim()]))
  const categoryById = new Map((data.danh_muc_san_pham ?? []).map(cat => [Number(cat.id), cat.ten.trim()]))

  // Chuẩn hóa dữ liệu sản phẩm cho ProductCard
  const formattedProducts = products.map(product => {
    const price = Number(product.gia) || 0
    const original = Number(product.gia_goc) || price
    const discount = original > price ? Math.round(((original - price) / original) * 100) : 0
    
    // getFeatures in server side
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
      tag: Number(product.noi_bat) === 1 ? 'Nổi bật' : discount >= 15 ? 'Ưu đãi' : null,
      image: product.hinh_chinh?.trim(),
      features,
    }
  })

  return { brand, products: formattedProducts }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const rawSlug = resolvedParams.slug
  const result = await getBrandData(rawSlug)

  if (!result) {
    return { title: 'Không tìm thấy thương hiệu' }
  }

  return {
    title: `${result.brand.ten.trim()} – TechZone`,
  }
}

export default async function BrandPage({ params }) {
  const resolvedParams = await params
  const rawSlug = resolvedParams.slug

  const result = await getBrandData(rawSlug)

  if (!result) {
    notFound()
  }

  const { brand, products } = result

  return (
    <div className="bg-white min-h-screen py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="mb-6 flex flex-col gap-2">
          <nav className="flex items-center gap-2 text-xs font-body text-gray-400">
            <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Thương hiệu {brand.ten}</span>
          </nav>
          <div className="flex items-center gap-4 mt-2">
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              {brand.ten}
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-body">
            Hiển thị {products.length} sản phẩm
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-500 font-body">Hiện chưa có sản phẩm nào thuộc thương hiệu này.</p>
            <Link href="/" className="mt-4 inline-block text-brand hover:underline font-body font-medium">
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
