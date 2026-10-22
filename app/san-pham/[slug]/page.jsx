import { notFound } from 'next/navigation'
import ProductDetail from '../../../components/ProductDetail'

async function getProductData(rawSlug) {
  if (!rawSlug) return null
  const slug = decodeURIComponent(rawSlug).trim()

  // Đọc trực tiếp db.json trong Server Component
  const data = (await import('../../../db.json')).default

  // Tìm sản phẩm an toàn với Optional Chaining
  const product = data.san_pham?.find(
    (sp) => sp.slug?.trim() === slug
  )

  if (!product) return null

  // Tìm chi tiết sản phẩm
  const chiTiet = data.chi_tiet_san_pham?.find(
    (ct) => ct.id_san_pham === product.id
  ) || null

  // Tìm thương hiệu
  const thuongHieu = data.thuong_hieu?.find(
    (th) => th.id === product.id_thuong_hieu
  ) || null

  // Tìm danh mục
  const danhMuc = data.danh_muc_san_pham?.find(
    (dm) => dm.id === product.id_danh_muc
  ) || null

  // Lấy hình ảnh phụ (gộp luôn tại đây, không cần import lại db.json)
  const hinhAnh = data.hinh_anh_san_pham?.filter(
    (ha) => ha.id_san_pham === product.id
  ) || []

  return { product, chiTiet, thuongHieu, danhMuc, hinhAnh }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const result = await getProductData(resolvedParams.slug)

  if (!result) {
    return { title: 'Không tìm thấy sản phẩm – TechZone' }
  }

  return {
    title: `${result.product.ten_san_pham?.trim()} – TechZone`,
    description: result.product.mo_ta_ngan?.trim() || '',
  }
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params
  const result = await getProductData(resolvedParams.slug)

  if (!result) {
    notFound()
  }

  const { product, chiTiet, thuongHieu, danhMuc, hinhAnh } = result

  return (
    <ProductDetail
      product={product}
      chiTiet={chiTiet}
      thuongHieu={thuongHieu}
      hinhAnh={hinhAnh}
      danhMuc={danhMuc}
    />
  )
}

// Tạo sẵn HTML tĩnh cho các sản phẩm lúc build -> 0ms latency trên Vercel
export async function generateStaticParams() {
  const data = (await import('../../../db.json')).default
  return (data.san_pham ?? [])
    .filter((sp) => Boolean(sp.slug?.trim()))
    .map((sp) => ({
      slug: sp.slug.trim(),
    }))
}

