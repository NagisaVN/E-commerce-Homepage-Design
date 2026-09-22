const tips = [
  {
    id: 1,
    category: 'Hướng dẫn mua',
    readTime: '4 phút đọc',
    title: 'Cách chọn dung tích tủ lạnh phù hợp cho gia đình bạn',
    excerpt:
      'AI của chúng tôi đã phân tích 50.000 hộ gia đình và phát hiện rằng gia đình 4–5 người cần ít nhất 500L. Đây là công thức tính dung tích đầy đủ — bao gồm thói quen trữ thực phẩm, khí hậu và tần suất mua sắm.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&h=420&fit=crop&auto=format',
    tags: ['Tủ lạnh', 'Hướng dẫn gia đình', 'AI Insight'],
    date: '03/09/2024',
    author: 'TechZone AI',
  },
  {
    id: 2,
    category: 'Tiết kiệm điện',
    readTime: '3 phút đọc',
    title: 'Máy lạnh Inverter vs. định tốc: Chi phí thực tế sau 5 năm',
    excerpt:
      'Chúng tôi đã tính toán. Máy lạnh inverter tiết kiệm trung bình 5 triệu/năm so với định tốc. Sau 5 năm, số tiền tiết kiệm bù được tới 65% giá mua — ngay cả với dòng cao cấp.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&h=420&fit=crop&auto=format',
    tags: ['Máy lạnh', 'Năng lượng', 'Phân tích chi phí'],
    date: '28/08/2024',
    author: 'TechZone AI',
  },
  {
    id: 3,
    category: 'Nhà thông minh',
    readTime: '5 phút đọc',
    title: 'Kết nối tất cả thiết bị: SmartThings vs. ThinQ vs. Home Connect',
    excerpt:
      'Samsung, LG và Bosch đều có hệ sinh thái nhà thông minh riêng. Chúng tôi đã thử nghiệm cả ba trong 30 ngày để cho bạn biết hệ thống nào tương thích tốt nhất với Alexa, Google Home và Apple HomeKit.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=420&fit=crop&auto=format',
    tags: ['Nhà thông minh', 'So sánh', 'Đánh giá AI'],
    date: '20/08/2024',
    author: 'TechZone AI',
  },
]

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
  return (
    <section className="py-16 bg-brand-pale border-t border-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand text-sm font-semibold font-display uppercase tracking-widest mb-1">Hỗ trợ bởi AI</p>
            <h2 className="text-3xl font-display font-bold text-gray-900">Mẹo hay & Hướng dẫn mua sắm</h2>
            <p className="text-gray-500 font-body mt-2 text-sm">Những kiến thức chuyên sâu được tạo bởi TechZone AI — cập nhật hàng tuần</p>
          </div>
          <a href="#" className="text-sm text-brand font-medium hover:underline font-body hidden sm:block">
            Xem tất cả bài viết →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <article
              key={tip.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-light hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 flex flex-col"
            >
              <div className="relative overflow-hidden bg-brand-light aspect-[16/9]">
                <img
                  src={tip.image}
                  alt={tip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-semibold font-display bg-white/95 backdrop-blur-sm text-brand px-2.5 py-1 rounded-full">
                    {tip.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-5 gap-3">
                <div className="flex items-center gap-2">
                  <AiChip />
                  <span className="text-xs text-gray-400 font-body">{tip.readTime}</span>
                </div>

                <h3 className="text-base font-bold font-display text-gray-900 leading-snug group-hover:text-brand transition-colors">
                  {tip.title}
                </h3>

                <p className="text-sm text-gray-500 font-body leading-relaxed flex-1 line-clamp-3">
                  {tip.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {tip.tags.map(tag => (
                    <span key={tag} className="text-xs bg-brand-pale text-brand-dark px-2 py-0.5 rounded-full font-body">
                      {tag}
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
                    <span className="text-xs text-gray-500 font-body">{tip.author}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-body">{tip.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-brand-dark to-brand rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
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
          <button className="flex-shrink-0 bg-white text-brand-dark px-6 py-3 rounded-xl font-display font-semibold hover:bg-brand-light transition-colors active:scale-95 whitespace-nowrap">
            ✨ Thử AI Tư Vấn
          </button>
        </div>
      </div>
    </section>
  )
}
