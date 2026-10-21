import Hero from '../components/Hero'
import Categories from '../components/Categories'
import Brands from '../components/Brands'
import FeaturedProducts from '../components/FeaturedProducts'
import AiBlog from '../components/AiBlog'

export const revalidate = 3600 // Tự động làm mới trang chủ (ISR) để cập nhật bài viết AI mới mỗi ngày

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <Brands />
      <FeaturedProducts />
      <AiBlog />
    </>
  )
}
