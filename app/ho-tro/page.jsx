import Link from 'next/link'

export const metadata = {
  title: 'Hỗ trợ khách hàng – TechZone',
}

export default function SupportPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-2 text-center">
          <nav className="flex items-center justify-center gap-2 text-xs font-body text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Hỗ trợ</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 font-display">
            TechZone có thể giúp gì cho bạn?
          </h1>
          <p className="text-base text-gray-500 font-body mt-2">
            Liên hệ với chúng tôi hoặc tìm kiếm câu trả lời trong các câu hỏi thường gặp
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card Liên hệ */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-blue-50 text-brand rounded-2xl flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-display mb-2">Gọi trực tiếp</h3>
            <p className="text-gray-500 font-body mb-6">Hỗ trợ 24/7. Cước phí 1000đ/phút.</p>
            <a href="tel:19001234" className="inline-block bg-brand text-white font-bold font-display px-8 py-3 rounded-xl hover:bg-brand-dark transition-colors shadow-lg shadow-blue-200">
              1900 1234
            </a>
          </div>

          {/* Card Email */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-blue-50 text-brand rounded-2xl flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-display mb-2">Gửi Email</h3>
            <p className="text-gray-500 font-body mb-6">Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>
            <a href="mailto:support@techzone.vn" className="inline-block border-2 border-brand text-brand font-bold font-display px-8 py-2.5 rounded-xl hover:bg-brand hover:text-white transition-colors">
              support@techzone.vn
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 font-display mb-8 text-center">Câu hỏi thường gặp</h2>
          <div className="space-y-6">
            {[
              { q: 'Làm thế nào để theo dõi đơn hàng?', a: 'Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản, chọn mục "Quản lý đơn hàng". Hoặc nhập mã đơn hàng vào phần "Tra cứu đơn hàng" trên trang chủ.' },
              { q: 'Chính sách bảo hành như thế nào?', a: 'Tất cả sản phẩm tại TechZone đều được bảo hành chính hãng từ 12-24 tháng tùy loại. Bạn có thể mang sản phẩm đến các trung tâm bảo hành của hãng hoặc gửi lại cửa hàng TechZone gần nhất.' },
              { q: 'Tôi có thể đổi trả sản phẩm không?', a: 'TechZone hỗ trợ đổi trả miễn phí trong 30 ngày đầu nếu sản phẩm có lỗi từ nhà sản xuất. Sản phẩm đổi trả phải còn nguyên tem, hộp và phụ kiện đi kèm.' },
              { q: 'TechZone có hỗ trợ trả góp không?', a: 'Có. Chúng tôi hỗ trợ trả góp 0% qua thẻ tín dụng của hơn 25 ngân hàng hoặc trả góp qua công ty tài chính với thủ tục vô cùng đơn giản.' }
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h4 className="text-lg font-bold text-gray-800 font-display mb-2">{faq.q}</h4>
                <p className="text-gray-600 font-body leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
