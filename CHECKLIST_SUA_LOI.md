# 📋 CHECKLIST SỬA LỖI & TỐI ƯU TOÀN DIỆN DỰ ÁN TECHZONE

> File này tổng hợp chi tiết các hạng mục cần sửa chữa, tối ưu và mở rộng kèm theo mã code mẫu cụ thể (Before -> After) để bạn có thể kiểm tra và sửa từng file một cách thuận tiện nhất.

---

## 🔴 GIAI ĐOẠN 1: BẮT BUỘC PHẢI SỬA (LỖI GÂY CRASH / 404 / BẢO MẬT)

### [ ] Mục 1: Sửa lỗi đường dẫn sản phẩm trong Giỏ hàng
- **File:** `app/gio-hang/page.jsx` (dòng 65)
- **Vấn đề:** Đường link đang trỏ tới `/product/...` thay vì `/san-pham/...`, đồng thời chưa trim slug khiến URL có thể dính khoảng trắng `%20`.
- **Code hiện tại (Before):**
  ```jsx
  <Link href={`/product/${item.slug}`} className="text-base font-bold text-gray-900 font-display hover:text-brand transition-colors line-clamp-2">
    {item.name}
  </Link>
  ```
- **Code sửa lại (After):**
  ```jsx
  <Link href={`/san-pham/${item.slug?.trim()}`} className="text-base font-bold text-gray-900 font-display hover:text-brand transition-colors line-clamp-2">
    {item.name}
  </Link>
  ```

---

### [ ] Mục 2: Khắc phục nguy cơ Crash Server do `sp.slug.trim()` và giải mã URL
- **File:** `app/san-pham/[slug]/page.jsx`
- **Vấn đề:** 
  1. `sp.slug.trim()` sẽ throw `TypeError` nếu có sản phẩm không có slug hoặc slug là `null`.
  2. `slug` từ params chưa được `decodeURIComponent()`, nếu URL có ký tự đặc biệt/tiếng Việt thì so sánh sẽ trượt dẫn đến 404.
  3. Đang import `db.json` 2 lần lặp lại trong cùng một request.
- **Code sửa lại (After):**
  Thay thế hàm `getProductData` và component `ProductPage`:
  ```javascript
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
  ```

---

### [ ] Mục 3: Xử lý an toàn slug tại các Dynamic Routes còn lại
- **File 1:** `app/danh-muc-san-pham/[slug]/page.jsx`
  - Đảm bảo so khớp an toàn:
    ```javascript
    const cleanSlug = decodeURIComponent(slug).trim()
    const category = data.danh_muc_san_pham?.find(
      (dm) => dm.slug?.trim() === cleanSlug
    )
    ```
- **File 2:** `app/thuong-hieu/[slug]/page.jsx`
  - Đảm bảo so khớp an toàn:
    ```javascript
    const cleanSlug = decodeURIComponent(slug).trim()
    const brand = data.thuong_hieu?.find(
      (th) => th.slug?.trim() === cleanSlug
    )
    ```

---

### [ ] Mục 4: Xóa bỏ lộ lọt dữ liệu tại API `/api/data`
- **File:** `app/api/data/route.js`
- **Vấn đề:** Trả về toàn bộ `db.json` bao gồm bảng `nguoi_dung` và `don_hang`.
- **Code sửa lại (After):**
  Chỉ trả về các bảng công khai cần thiết (hoặc loại bỏ hoàn toàn nếu đã chuyển sang Server Component ở Giai đoạn 2):
  ```javascript
  import { NextResponse } from 'next/server';
  import data from '../../../db.json';

  export async function GET() {
    try {
      // Chỉ bóc tách các trường công khai, loại bỏ thông tin nhạy cảm
      const publicData = {
        banner: data.banner ?? [],
        danh_muc_san_pham: data.danh_muc_san_pham ?? [],
        thuong_hieu: data.thuong_hieu ?? [],
        san_pham: (data.san_pham ?? []).map(sp => ({
          id: sp.id,
          ten_san_pham: sp.ten_san_pham,
          slug: sp.slug,
          gia: sp.gia,
          gia_goc: sp.gia_goc,
          hinh_chinh: sp.hinh_chinh,
          noi_bat: sp.noi_bat,
          so_lan_xem: sp.so_lan_xem,
          rating: sp.rating,
          id_danh_muc: sp.id_danh_muc,
          id_thuong_hieu: sp.id_thuong_hieu,
          thong_so: sp.thong_so,
          bao_hanh: sp.bao_hanh,
          trang_thai: sp.trang_thai,
        })),
      };
      return NextResponse.json(publicData);
    } catch (error) {
      return NextResponse.json({ error: 'Không thể đọc dữ liệu' }, { status: 500 });
    }
  }
  ```

---

### [ ] Mục 5: Sửa link 404 trong trang Khuyến mãi
- **File:** `app/khuyen-mai/page.jsx` (dòng 65)
- **Vấn đề:** Link `href={`/khuyen-mai/${promo.slug?.trim()}`}` nhưng chưa có page chi tiết.
- **Giải pháp:**
  - *Cách 1 (Nhanh):* Trỏ tạm sang modal hoặc link neo `#`, hoặc tắt link xem chi tiết.
  - *Cách 2 (Khuyên dùng):* Tạo thêm file `app/khuyen-mai/[slug]/page.jsx` để render bài viết từ mảng `data.bai_viet` trong `db.json`.

---

### [ ] Mục 6: Xử lý xung đột Lockfile khi deploy Git lên Vercel
- **Thao tác:**
  - Nếu dự án chuẩn hóa dùng **`npm`**:
    Chạy lệnh trong terminal:
    ```bash
    git rm pnpm-lock.yaml
    git commit -m "chore: remove pnpm-lock.yaml to standardize on npm"
    ```
    Thêm `pnpm-lock.yaml` vào file `.gitignore`.
  - Nếu dự án chuẩn hóa dùng **`pnpm`**:
    Xóa `package-lock.json` và commit giữ lại `pnpm-lock.yaml`.

---

## 🟡 GIAI ĐOẠN 2: TỐI ƯU HIỆU NĂNG, UI/UX & CLEAN CODE

### [ ] Mục 7: Sửa lỗi Anti-pattern Component lồng nhau trong `Header.jsx`
- **File:** `components/Header.jsx`
- **Vấn đề:** Khai báo `const SearchBox = () => (...)` bên trong `Header()` làm unmount input mỗi khi re-render.
- **Code sửa lại:**
  Đưa component `SearchBox` ra ngoài component `Header`, thêm thẻ `<form>` để cho phép ấn phím Enter tìm kiếm:
  ```jsx
  'use client'

  import { useState } from 'react'
  import Link from 'next/link'
  import { useRouter } from 'next/navigation'
  import { useCart } from '../context/CartContext'

  function LogoIcon() {
    return (
      <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8">
        <rect width="32" height="32" rx="8" fill="#1D4ED8" />
        <path d="M8 22V13l8-6 8 6v9H8z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
        <rect x="13" y="16" width="6" height="6" rx="1" stroke="white" strokeWidth="1.5" />
      </svg>
    )
  }

  function SparkIcon() {
    return (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 flex-shrink-0">
        <path d="M10 2l1.5 5h5l-4 3 1.5 5-4-3-4 3 1.5-5-4-3h5z" fill="#1D4ED8" opacity="0.8" />
        <circle cx="15.5" cy="4.5" r="1.5" fill="#60A5FA" />
        <circle cx="4" cy="14" r="1" fill="#60A5FA" opacity="0.6" />
      </svg>
    )
  }

  // Tách SearchBox ra ngoài để tránh re-mount input
  function SearchBox({ onSearch }) {
    const [focused, setFocused] = useState(false)
    const [keyword, setKeyword] = useState('')
    const router = useRouter()

    const handleSubmit = (e) => {
      e.preventDefault()
      if (keyword.trim()) {
        router.push(`/san-pham?q=${encodeURIComponent(keyword.trim())}`)
      }
    }

    return (
      <form
        onSubmit={handleSubmit}
        className={`flex items-center gap-2.5 rounded-xl border-2 bg-brand-pale px-3 py-2 transition-all duration-200 sm:gap-3 sm:px-4 sm:py-2.5 ${
          focused ? 'border-brand bg-white shadow-lg shadow-blue-100' : 'border-brand-light hover:border-brand-accent'
        }`}
      >
        <SparkIcon />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Hỏi AI: Tìm tủ lạnh cho gia đình 4 người dưới 10 triệu..."
          aria-label="Tìm kiếm sản phẩm với AI"
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 font-body"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button
          type="submit"
          className="flex-shrink-0 rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:px-4 font-display"
        >
          Tìm kiếm
        </button>
      </form>
    )
  }

  export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const { cartCount } = useCart()

    const navItems = [
      { name: 'Sản phẩm', href: '/san-pham' },
      { name: 'Thương hiệu', href: '/thuong-hieu' },
      { name: 'Khuyến mãi', href: '/khuyen-mai' },
      { name: 'Hỗ trợ', href: '/ho-tro' },
    ]

    return (
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="bg-brand-dark py-1.5 text-center text-xs font-body tracking-wide text-white">
          Miễn phí vận chuyển đơn hàng từ 299K &middot; Hỗ trợ AI 24/7
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center gap-3 sm:gap-5">
            <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
              <LogoIcon />
              <span className="text-xl font-bold tracking-tight text-brand-dark font-display">
                Tech<span className="text-brand">Zone</span>
              </span>
            </Link>

            {/* Menu cho Desktop/Tablet: Hiện từ lg thay vì xl */}
            <nav className="ml-2 hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-brand font-body"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mx-auto hidden max-w-2xl flex-1 md:block">
              <SearchBox />
            </div>

            <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
              <Link
                href="/dang-nhap"
                aria-label="Đăng nhập"
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-gray-600 transition-colors hover:bg-brand-light hover:text-brand sm:px-3"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {/* Đổi 2xl:block thành lg:block để hiện chữ trên laptop */}
                <span className="hidden text-sm font-medium font-body lg:block">Đăng nhập</span>
              </Link>

              <Link
                href="/gio-hang"
                aria-label="Giỏ hàng"
                className="relative flex items-center gap-1.5 rounded-lg px-2 py-2 text-gray-600 transition-colors hover:bg-brand-light hover:text-brand sm:px-3"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {/* Đổi 2xl:block thành lg:block */}
                <span className="hidden text-sm font-medium font-body lg:block">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                aria-label="Mở menu điều hướng"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-brand-light hover:text-brand lg:hidden"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>
          </div>

          <div className="pb-3 md:hidden">
            <SearchBox />
          </div>

          {menuOpen && (
            <nav className="border-t border-gray-100 py-2 lg:hidden" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-light hover:text-brand font-body"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    )
  }
  ```

---

### [ ] Mục 8: Cấu hình `next.config.mjs` cho External Images
- **File:** `next.config.mjs`
- **Code sửa lại:**
  ```javascript
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'plain-apac-prod-public.komododecks.com',
        },
      ],
    },
  }

  export default nextConfig
  ```

---

### [ ] Mục 9: Tinh chỉnh Grid thương hiệu trong `Brands.jsx`
- **File:** `components/Brands.jsx` (dòng 107)
- **Vấn đề:** `grid-cols-3 sm:grid-cols-6` với 9 thương hiệu bị khuyết 3 ô lệch hàng 2.
- **Code sửa lại:**
  ```jsx
  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
  ```

---

### [ ] Mục 10: Tăng cường Fallback trong `ProductDetail.jsx`
- **File:** `components/ProductDetail.jsx`
- **Code sửa lại an toàn:**
  ```javascript
  // Đảm bảo chinh_sach_ban_hang là mảng trước khi find/map
  const policies = Array.isArray(chiTiet?.chinh_sach_ban_hang) ? chiTiet.chinh_sach_ban_hang : []

  const policyBadges = policies.length > 0
    ? [
        { icon: '🚚', label: policies.find(c => c.toLowerCase().includes('giao'))?.replace(/^.{0,}?(Giao)/i, 'Giao') || 'Miễn phí giao hàng', sub: 'Tận nơi' },
        { icon: '🛡️', label: policies.find(c => c.toLowerCase().includes('bảo hành'))?.split(',')[0] || 'Bảo hành chính hãng', sub: 'Chính hãng' },
        { icon: '↩️', label: policies.find(c => c.toLowerCase().includes('đổi'))?.split('(')[0]?.trim() || 'Đổi trả 30 ngày', sub: 'Dễ dàng' },
      ]
    : [
        { icon: '🚚', label: 'Miễn phí giao hàng', sub: 'Trong 3 ngày' },
        { icon: '🛡️', label: 'Bảo hành 2 năm', sub: '+ 10 năm máy nén' },
        { icon: '↩️', label: 'Đổi trả 30 ngày', sub: 'Dễ dàng' },
      ]
  ```

---

## 🟢 GIAI ĐOẠN 3: TÍNH NĂNG MỞ RỘNG (HOÀN THIỆN DỰ ÁN)

### [ ] Mục 11: Tạo trang 404 tùy biến (`app/not-found.jsx`)
- **Tạo file mới:** `app/not-found.jsx`
- **Nội dung mẫu:**
  ```jsx
  import Link from 'next/link'

  export default function NotFound() {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-blue-50 text-brand rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl font-bold font-display">
            404
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">
            Không tìm thấy trang
          </h1>
          <p className="text-gray-500 font-body text-sm mb-8">
            Trang hoặc sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ khác.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-brand text-white font-semibold font-display px-6 py-2.5 rounded-xl hover:bg-brand-dark transition-colors"
            >
              Về trang chủ
            </Link>
            <Link
              href="/san-pham"
              className="border border-gray-200 text-gray-700 font-semibold font-display px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </div>
    )
  }
  ```

---

### [ ] Mục 12: Thêm `generateStaticParams` cho trang sản phẩm để tối ưu Vercel
- **File:** `app/san-pham/[slug]/page.jsx`
- **Thêm hàm sau vào cuối file:**
  ```javascript
  // Tạo sẵn HTML tĩnh cho 100 sản phẩm lúc build -> 0ms latency trên Vercel
  export async function generateStaticParams() {
    const data = (await import('../../../db.json')).default
    return (data.san_pham ?? []).map((sp) => ({
      slug: sp.slug?.trim(),
    }))
  }
  ```

---

### [ ] Mục 13: Tạo trang danh sách tất cả danh mục (`app/danh-muc-san-pham/page.jsx`)
- **Tạo file mới:** `app/danh-muc-san-pham/page.jsx`
- **Mục đích:** Khắc phục link `href="#"` tại dòng 63 của `components/Categories.jsx`, cho phép người dùng click "Xem tất cả danh mục" mà không bị 404.

---

### [ ] Mục 14: Thêm Loading State (`app/loading.jsx`)
- **Tạo file mới:** `app/loading.jsx`
- **Mục đích:** Hiển thị skeleton loading khi Next.js chuyển trang giữa các route, giúp giao diện không bị giật hoặc đơ.

---

### [x] Mục 15: Tích hợp Tìm kiếm AI Thông minh (AI Smart Search & Shopping Assistant) - ĐÃ HOÀN THÀNH
- **Các file đã xây dựng:**
  1. [`lib/ai-search.js`](file:///d:/laragon/www/E-commerce%20Homepage%20Design/lib/ai-search.js): Bộ xử lý ngôn ngữ tự nhiên (NLP) phân tích ý định (Intent Parser), tính điểm phù hợp (Match Score) và tạo lời khuyên mua sắm tự động; hỗ trợ cả Google Gemini API nếu có `GEMINI_API_KEY`.
  2. [`app/api/ai-search/route.js`](file:///d:/laragon/www/E-commerce%20Homepage%20Design/app/api/ai-search/route.js): Endpoint REST API xử lý tìm kiếm AI (`GET` & `POST`).
  3. [`components/AiSearchModal.jsx`](file:///d:/laragon/www/E-commerce%20Homepage%20Design/components/AiSearchModal.jsx): Giao diện Modal tìm kiếm AI với hiệu ứng AI Thinking, thẻ gợi ý Prompt thông minh, thẻ tư vấn AI và danh sách sản phẩm khớp tiêu chí.
  4. [`app/tim-kiem-ai/page.jsx`](file:///d:/laragon/www/E-commerce%20Homepage%20Design/app/tim-kiem-ai/page.jsx): Trang tìm kiếm AI chuyên biệt hỗ trợ URL query `?q=...` thân thiện với SEO.
  5. [`components/Header.jsx`](file:///d:/laragon/www/E-commerce%20Homepage%20Design/components/Header.jsx): Tích hợp nút "✨ Hỏi AI" và mở Modal tìm kiếm AI tức thì.
- **Cách cấu hình mở rộng (Optional):**
  Thêm vào `.env.local` nếu muốn kết nối trực tiếp với Google Gemini 2.5 Flash:
  ```env
  GEMINI_API_KEY=your_gemini_api_key_here
  ```
  *(Nếu không có key, hệ thống NLP Engine nội bộ vẫn hoạt động mượt mà và cực kỳ thông minh với 100% dữ liệu điện máy).*

