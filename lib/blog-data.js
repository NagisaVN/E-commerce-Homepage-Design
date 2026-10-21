// Dữ liệu bài viết Tin tức & Cẩm nang AI TechZone
export const blogCategories = [
  'Tất cả',
  'Hướng dẫn mua',
  'Tiết kiệm điện',
  'Nhà thông minh',
  'Đánh giá công nghệ',
  'Khuyến mãi',
]

export const blogArticles = [
  {
    id: 1,
    slug: 'cach-chon-dung-tich-tu-lanh-phu-hop',
    title: 'Cách chọn dung tích tủ lạnh phù hợp cho gia đình bạn',
    excerpt:
      'AI của chúng tôi đã phân tích 50.000 hộ gia đình và phát hiện rằng gia đình 4–5 người cần ít nhất 400L - 500L. Đây là công thức tính dung tích đầy đủ — bao gồm thói quen trữ thực phẩm, khí hậu và tần suất mua sắm.',
    category: 'Hướng dẫn mua',
    readTime: '4 phút đọc',
    date: '03/09/2024',
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&h=600&fit=crop&auto=format',
    tags: ['Tủ lạnh', 'Hướng dẫn gia đình', 'AI Insight'],
    isFeatured: true,
    relatedProductIds: [24, 48, 14, 21],
    aiTakeaways: [
      'Công thức chuẩn: 100L cơ bản cho 1 người đầu tiên + 50L cho mỗi thành viên tiếp theo + 50L dự phòng nấu nướng.',
      'Gia đình 4-5 người tại Việt Nam nên ưu tiên tủ từ 380L - 450L có ngăn đông mềm để nấu ăn nhanh không cần rã đông.',
      'Chọn công nghệ Inverter giúp tiết kiệm 30-50% điện năng tiêu thụ liên tục suốt 24/7.',
    ],
    contentHtml: `
      <h2>1. Vì sao chọn đúng dung tích tủ lạnh lại quan trọng?</h2>
      <p>Chọn tủ lạnh quá nhỏ sẽ khiến thực phẩm bị nhồi nhét, cản trở các luồng khí lạnh đối lưu dẫn đến thực phẩm nhanh hỏng. Ngược lại, chọn tủ lạnh quá lớn so với nhu cầu thực tế sẽ gây lãng phí diện tích phòng bếp và tiêu tốn thêm từ 20% - 40% điện năng không cần thiết mỗi tháng.</p>

      <h2>2. Công thức tính dung tích chuẩn từ TechZone AI</h2>
      <p>Dựa trên thói quen sinh hoạt và tần suất đi chợ của các gia đình Việt Nam hiện đại, mô hình AI của chúng tôi đã xây dựng công thức tính dung tích tối ưu:</p>
      
      <div class="my-6 p-5 bg-blue-50 border-l-4 border-brand rounded-r-2xl">
        <p class="font-bold text-brand-dark mb-1">Công thức khuyến nghị:</p>
        <p class="font-mono text-sm text-gray-800">Dung tích cần = 100L (Người đầu tiên) + (Số người còn lại × 50L) + Dung tích dự phòng thói quen (30L - 50L)</p>
      </div>

      <table class="w-full my-6 text-sm border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100 text-gray-800 font-bold">
            <th class="p-3 border border-gray-200 text-left">Số lượng thành viên</th>
            <th class="p-3 border border-gray-200 text-left">Dung tích khuyến nghị</th>
            <th class="p-3 border border-gray-200 text-left">Kiểu tủ gợi ý</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-3 border border-gray-200">1 - 2 người (Sinh viên, độc thân)</td>
            <td class="p-3 border border-gray-200 font-semibold text-brand">150L - 250L</td>
            <td class="p-3 border border-gray-200">Tủ 2 cửa ngăn đá trên truyền thống</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="p-3 border border-gray-200">3 - 4 người (Gia đình tiêu chuẩn)</td>
            <td class="p-3 border border-gray-200 font-semibold text-brand">300L - 420L</td>
            <td class="p-3 border border-gray-200">Tủ ngăn đá dưới hoặc tủ có ngăn đông mềm</td>
          </tr>
          <tr>
            <td class="p-3 border border-gray-200">5 người trở lên (Gia đình nhiều thế hệ)</td>
            <td class="p-3 border border-gray-200 font-semibold text-brand">Từ 450L - 600L+</td>
            <td class="p-3 border border-gray-200">Side by Side hoặc French Door nhiều cửa</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Những tính năng công nghệ thông minh không nên bỏ qua</h2>
      <ul>
        <li><strong>Ngăn đông mềm (-1°C đến -3°C):</strong> Giữ thịt cá tươi ngon trong 3-7 ngày mà không bị đông đá cứng, thái nấu ngay lập tức không mất thời gian rã đông.</li>
        <li><strong>Công nghệ Inverter kép (Dual Inverter):</strong> Tự động điều chỉnh vòng quay máy nén theo lượng thực phẩm và nhiệt độ môi trường, tiết kiệm điện vượt trội và vận hành êm ái.</li>
        <li><strong>Bộ lọc than hoạt tính / Ion khử mùi:</strong> Khử sạch mùi tanh của hải sản và ức chế 99.9% vi khuẩn nấm mốc phát triển.</li>
      </ul>
    `,
  },
  {
    id: 2,
    slug: 'may-lanh-inverter-vs-dinh-toc-chi-phi-5-nam',
    title: 'Máy lạnh Inverter vs. định tốc: Chi phí thực tế sau 5 năm',
    excerpt:
      'Chúng tôi đã tính toán thực tế: Máy lạnh Inverter tiết kiệm trung bình 4–5 triệu đồng tiền điện mỗi năm so với máy lạnh thường. Sau 5 năm, số tiền tiết kiệm bù được tới 65% chi phí mua máy ban đầu.',
    category: 'Tiết kiệm điện',
    readTime: '3 phút đọc',
    date: '28/08/2024',
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&h=600&fit=crop&auto=format',
    tags: ['Máy lạnh', 'Năng lượng', 'Phân tích chi phí'],
    isFeatured: true,
    relatedProductIds: [1, 9, 23, 31],
    aiTakeaways: [
      'Máy lạnh Inverter tiết kiệm từ 35% đến 60% điện năng nếu sử dụng liên tục trên 6 - 8 tiếng mỗi ngày.',
      'Sau 5 năm vận hành, một chiếc máy lạnh Inverter giúp gia đình bạn tiết kiệm từ 18 - 25 triệu đồng tiền điện.',
      'Nhiệt độ phòng khi dùng Inverter luôn duy trì ổn định trong khoảng ±0.5°C, không gây sốc nhiệt hay khô họng.',
    ],
    contentHtml: `
      <h2>1. Nguyên lý khác biệt giữa Inverter và máy lạnh thông thường (Non-Inverter)</h2>
      <p>Máy lạnh thông thường (định tốc) hoạt động theo cơ chế bật/tắt liên tục: khi đạt nhiệt độ cài đặt, máy nén dừng hẳn; khi phòng ấm lên, máy nén lại khởi động lại ở công suất tối đa. Quá trình bật tắt này tiêu tốn một lượng điện cực kỳ lớn.</p>
      <p>Trong khi đó, <strong>máy lạnh Inverter</strong> sử dụng vi xử lý thông minh để điều chỉnh tần số quay của máy nén. Khi phòng đã đủ mát, máy nén sẽ giảm dần tốc độ quay xuống mức tối thiểu để duy trì nhiệt độ ổn định mà không cần ngắt hẳn.</p>

      <h2>2. Bảng so sánh chi phí điện năng thực tế sau 5 năm</h2>
      <p>Giả định máy lạnh 1.5 HP (12.000 BTU) hoạt động trung bình 8 tiếng/ngày vào mùa nóng tại Việt Nam (đơn giá điện bình quân bậc thang ~2.500đ/kWh):</p>

      <table class="w-full my-6 text-sm border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100 text-gray-800 font-bold">
            <th class="p-3 border border-gray-200 text-left">Hạng mục so sánh</th>
            <th class="p-3 border border-gray-200 text-left">Máy lạnh Non-Inverter</th>
            <th class="p-3 border border-gray-200 text-left">Máy lạnh Inverter</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-3 border border-gray-200">Giá mua máy ban đầu</td>
            <td class="p-3 border border-gray-200 font-medium">~7.500.000₫</td>
            <td class="p-3 border border-gray-200 font-medium text-brand">~10.500.000₫</td>
          </tr>
          <tr class="bg-gray-50">
            <td class="p-3 border border-gray-200">Điện năng tiêu thụ/năm</td>
            <td class="p-3 border border-gray-200">~2.800 kWh (~7.000.000₫)</td>
            <td class="p-3 border border-gray-200 text-green-700 font-semibold">~1.500 kWh (~3.750.000₫)</td>
          </tr>
          <tr>
            <td class="p-3 border border-gray-200">Tiền điện tiết kiệm/năm</td>
            <td class="p-3 border border-gray-200">0₫</td>
            <td class="p-3 border border-gray-200 text-green-700 font-bold">+3.250.000₫/năm</td>
          </tr>
          <tr class="bg-blue-50 font-bold">
            <td class="p-3 border border-gray-200">Tổng chi phí sau 5 năm (Máy + Điện)</td>
            <td class="p-3 border border-gray-200 text-red-600">42.500.000₫</td>
            <td class="p-3 border border-gray-200 text-brand">29.250.000₫ (Tiết kiệm >13 triệu)</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Lời khuyên khi nào nên mua máy lạnh Inverter?</h2>
      <p>Nếu bạn lắp máy lạnh cho phòng ngủ gia đình, phòng làm việc thường xuyên bật trên 5 tiếng/ngày, <strong>100% nên chọn máy lạnh Inverter</strong>. Khoản chênh lệch giá mua ban đầu sẽ được hoàn vốn tiền điện chỉ sau 8 - 12 tháng sử dụng!</p>
    `,
  },
  {
    id: 3,
    slug: 'smartthings-vs-thinq-vs-home-connect',
    title: 'Kết nối tất cả thiết bị: SmartThings vs. ThinQ vs. Home Connect',
    excerpt:
      'Samsung, LG và Bosch đều có hệ sinh thái nhà thông minh riêng. Chúng tôi đã thử nghiệm cả ba nền tảng trong 30 ngày để phân tích khả năng tương thích tốt nhất với Alexa, Google Home và Apple HomeKit.',
    category: 'Nhà thông minh',
    readTime: '5 phút đọc',
    date: '20/08/2024',
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&h=600&fit=crop&auto=format',
    tags: ['Nhà thông minh', 'So sánh', 'Đánh giá AI'],
    isFeatured: true,
    relatedProductIds: [5, 12, 17, 30],
    aiTakeaways: [
      'Samsung SmartThings hỗ trợ chuẩn Matter và liên kết đa thương hiệu tốt nhất trên thị trường hiện nay.',
      'LG ThinQ nổi trội ở các tính năng AI dự đoán thói quen giặt giũ và cảnh báo bảo trì máy nén sớm.',
      'Bosch Home Connect tập trung vào độ ổn định và các chương trình rửa chén, nấu nướng cao cấp.',
    ],
    contentHtml: `
      <h2>1. Kỷ nguyên thiết bị điện máy thông minh kết nối AI</h2>
      <p>Thời đại điều khiển từng thiết bị bằng remote rời rạc đã dần lùi vào dĩ vãng. Giờ đây, chỉ với một chiếc smartphone hoặc câu lệnh giọng nói, bạn có thể kiểm tra xem tủ lạnh còn đồ uống không, hẹn giờ máy giặt lúc giá điện rẻ, hoặc tự động bật máy lạnh 15 phút trước khi về nhà.</p>

      <h2>2. Đánh giá chi tiết 3 hệ sinh thái hàng đầu</h2>
      
      <h3>A. Samsung SmartThings: Vua của khả năng kết nối Matter</h3>
      <p>SmartThings của Samsung là nền tảng mở rộng nhất hiện nay. Nhờ hỗ trợ giao thức Matter và Zigbee, bạn không chỉ kết nối TV hay tủ lạnh Samsung mà còn có thể liên kết đèn Philips Hue, khóa cửa Yale hay cảm biến Aqara trong cùng một ứng dụng duy nhất.</p>

      <h3>B. LG ThinQ: Trí tuệ nhân tạo chuyên sâu cho đồ gia dụng</h3>
      <p>LG ThinQ tập trung sâu vào trải nghiệm của từng thiết bị gia dụng: tính năng AI DD trên máy giặt tự nhận diện độ mềm của sợi vải để điều chỉnh chu trình giặt tối ưu; tủ lạnh Instaview kết nối Wifi báo cáo ngày hết hạn của thực phẩm và hỗ trợ chẩn đoán lỗi Smart Diagnosis từ xa cực kỳ tiện lợi.</p>

      <h3>C. Bosch Home Connect: Đẳng cấp thiết bị nhà bếp châu Âu</h3>
      <p>Nếu bạn sở hữu máy rửa chén, lò nướng hoặc bếp từ Bosch, ứng dụng Home Connect đem lại độ chính xác gần như hoàn hảo với kho công thức nấu ăn tích hợp và hướng dẫn xếp bát đĩa thông minh.</p>
    `,
  },
  {
    id: 4,
    slug: 'huong-dan-chon-may-giat-cua-truoc-cho-gia-dinh',
    title: 'Kinh nghiệm chọn máy giặt cửa trước: Động cơ truyền động trực tiếp hay gián tiếp?',
    excerpt:
      'Máy giặt cửa trước (lồng ngang) ngày càng được ưa chuộng nhờ khả năng giặt sạch vượt trội, tiết kiệm nước và bảo vệ sợi vải. Tìm hiểu cách chọn đúng khối lượng và công nghệ động cơ êm ái nhất.',
    category: 'Hướng dẫn mua',
    readTime: '4 phút đọc',
    date: '15/08/2024',
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1000&h=600&fit=crop&auto=format',
    tags: ['Máy giặt', 'Gia đình', 'Cửa trước'],
    isFeatured: false,
    relatedProductIds: [2, 10, 18, 26],
    aiTakeaways: [
      'Máy giặt truyền động trực tiếp (Direct Drive) vận hành êm hơn, ít rung lắc và tuổi thọ động cơ cao hơn.',
      'Khối lượng giặt khuyến nghị: 8.5 - 9.5 kg cho gia đình 3-4 người; từ 10.5 kg trở lên nếu thường xuyên giặt chăn mền.',
      'Tính năng giặt hơi nước (Steam) diệt khuẩn đến 99.9% và làm giảm nhăn quần áo đến 30%.',
    ],
    contentHtml: `
      <h2>1. Vì sao nên chọn máy giặt cửa trước (lồng ngang)?</h2>
      <p>Khác với máy giặt cửa trên đảo quần áo bằng mâm giặt dễ gây xoắn rối và sờn rách, máy giặt lồng ngang ứng dụng nguyên lý rơi tự nhiên theo trọng lực, giúp quần áo được giặt sạch sâu như giặt tay mà sợi vải không bị kéo dãn.</p>

      <h2>2. So sánh Động cơ truyền động trực tiếp vs Curoa gián tiếp</h2>
      <p>Đây là yếu tố then chốt quyết định độ êm ái của máy giặt:</p>
      <ul>
        <li><strong>Truyền động gián tiếp (Dây curoa):</strong> Giá thành rẻ hơn nhưng sau 2-3 năm dây curoa có thể bị chùng, phát ra tiếng rít và độ rung lắc cao hơn khi vắt tốc độ cao.</li>
        <li><strong>Truyền động trực tiếp (Direct Drive / Inverter):</strong> Động cơ gắn thẳng vào lồng giặt, triệt tiêu tiếng ồn, giảm tiêu hao năng lượng và thường được bảo hành động cơ lên đến 10 - 20 năm.</li>
      </ul>
    `,
  },
  {
    id: 5,
    slug: 'smart-tv-oled-vs-qled-nen-mua-loai-nao',
    title: 'OLED vs QLED: Đâu là công nghệ màn hình xem bóng đá & phim ảnh đỉnh cao?',
    excerpt:
      'Cuộc chiến giữa sắc đen tuyệt đối của OLED và độ sáng rực rỡ của QLED vẫn chưa có hồi kết. Cùng TechZone AI phân tích điều kiện ánh sáng phòng khách để bạn chọn chiếc TV chuẩn xác nhất.',
    category: 'Đánh giá công nghệ',
    readTime: '6 phút đọc',
    date: '10/08/2024',
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1000&h=600&fit=crop&auto=format',
    tags: ['Tivi', 'OLED', 'QLED', 'Giải trí'],
    isFeatured: false,
    relatedProductIds: [6, 13, 22, 38],
    aiTakeaways: [
      'OLED cho độ tương phản vô hạn và góc nhìn tuyệt hảo, lý tưởng cho phòng xem phim tối hoặc xem bóng đá ban đêm.',
      'QLED có độ sáng vượt trội (lên đến 2000 nits), chống chói tốt, hoàn hảo cho phòng khách nhiều ánh sáng tự nhiên.',
      'Tần số quét 120Hz và cổng HDMI 2.1 là hai trang bị bắt buộc nếu bạn thích chơi game PS5 hoặc xem thể thao tốc độ cao.',
    ],
    contentHtml: `
      <h2>1. Hiểu đúng về bản chất công nghệ OLED và QLED</h2>
      <p><strong>OLED (Organic Light Emitting Diode):</strong> Mỗi điểm ảnh tự phát sáng độc lập. Khi hiển thị màu đen, điểm ảnh tắt hoàn toàn, mang lại màu đen sâu thẳm tuyệt đối và độ tương phản vô hạn.</p>
      <p><strong>QLED (Quantum Dot LED):</strong> Sử dụng đèn nền LED chiếu qua một lớp chấm lượng tử Quantum Dot để tăng cường dải màu và độ sáng rực rỡ.</p>

      <h2>2. Bạn nên chọn loại nào?</h2>
      <ul>
        <li><strong>Chọn OLED nếu:</strong> Bạn là tín đồ điện ảnh thích xem phim trong phòng ánh sáng dịu hoặc bóng đá ban đêm, đòi hỏi góc nhìn rộng để cả gia đình ngồi nhiều góc đều thấy màu sắc chuẩn xác.</li>
        <li><strong>Chọn QLED nếu:</strong> Phòng khách nhà bạn có nhiều cửa sổ lớn, ban ngày nhiều ánh sáng tự nhiên và bạn cần một chiếc màn hình siêu sáng, bền bỉ hiển thị liên tục cả ngày.</li>
      </ul>
    `,
  },
  {
    id: 6,
    slug: 'sale-khung-mua-he',
    title: 'Sale Khủng Mùa Hè - Giảm 50% cho thiết bị làm mát',
    excerpt:
      'Chương trình khuyến mãi lớn nhất trong năm tại TechZone: Giảm giá đến 50% cho toàn bộ máy lạnh, quạt điều hòa và tủ lạnh Inverter chính hãng. Miễn phí vận chuyển và lắp đặt trong 2h.',
    category: 'Khuyến mãi',
    readTime: '2 phút đọc',
    date: '27/08/2024',
    author: 'TechZone Khuyến Mãi',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1000&h=600&fit=crop&auto=format',
    tags: ['Khuyến mãi', 'Mùa hè', 'Giảm giá'],
    isFeatured: false,
    relatedProductIds: [1, 9, 24, 40],
    aiTakeaways: [
      'Áp dụng cho hơn 50 mẫu máy lạnh Inverter từ Daikin, Panasonic, LG và Casper.',
      'Tặng gói vật tư ống đồng và công lắp đặt trị giá lên đến 1.200.000₫.',
      'Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng và công ty tài chính.',
    ],
    contentHtml: `
      <h2>1. Chi tiết chương trình khuyến mãi mùa hè 2024</h2>
      <p>Nhằm đồng hành cùng quý khách hàng vượt qua những đợt nắng nóng gay gắt, TechZone triển khai đại tiệc ưu đãi làm mát lớn nhất năm với hàng loạt chính sách đặc quyền:</p>
      <ul>
        <li><strong>Giảm trực tiếp đến 50%</strong> trên giá niêm yết cho các sản phẩm máy lạnh, quạt điều hòa và tủ lạnh thế hệ mới.</li>
        <li><strong>Miễn phí 100% công lắp đặt tiêu chuẩn</strong> và hỗ trợ hút chân không đường ống đúng kỹ thuật.</li>
        <li><strong>Đổi mới 1 - 1 trong vòng 30 ngày</strong> nếu phát sinh lỗi từ nhà sản xuất ngay tại nhà.</li>
      </ul>
    `,
  },
]

export function getAllArticles() {
  return blogArticles
}

export function getArticleBySlug(slug) {
  if (!slug) return null
  const clean = slug.trim().toLowerCase()
  return blogArticles.find(a => a.slug.trim().toLowerCase() === clean) || null
}

export function getRelatedArticles(currentSlug, limit = 3) {
  return blogArticles
    .filter(a => a.slug !== currentSlug)
    .slice(0, limit)
}
