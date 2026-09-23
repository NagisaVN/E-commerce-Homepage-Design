import { notFound } from 'next/navigation'
import ProductDetail from '../../../components/ProductDetail'

async function getProductData(slug) {
  // Đọc trực tiếp db.json trong Server Component
  const data = (await import('../../../db.json')).default

  // Tìm sản phẩm: so sánh slug đã trim với rawSlug
  const product = data.san_pham.find(
    (sp) => sp.slug.trim() === slug
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

  const danhMuc = data.danh_muc_san_pham?.find(
    (dm) => dm.id === product.id_danh_muc
  ) || null

  return { product, chiTiet, thuongHieu, danhMuc }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const rawSlug = resolvedParams.slug
  const result = await getProductData(rawSlug)

  if (!result) {
    return { title: 'Không tìm thấy sản phẩm' }
  }

  return {
    title: `${result.product.ten_san_pham.trim()} – TechZone`,
    description: result.product.mo_ta_ngan?.trim() || '',
  }
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params
  const rawSlug = resolvedParams.slug

  const result = await getProductData(rawSlug)

  if (!result) {
    notFound()
  }

  const { product, chiTiet, thuongHieu, danhMuc } = result
  
  // Đọc dữ liệu để lấy hinh_anh_san_pham
  const data = (await import('../../../db.json')).default
  const hinhAnh = data.hinh_anh_san_pham?.filter(
    (ha) => ha.id_san_pham === product.id
  ) || []

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
