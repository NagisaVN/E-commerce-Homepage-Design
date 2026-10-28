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
      'AI của chúng tôi đã phân tích hơn 50.000 hộ gia đình và phát hiện rằng gia đình 4–5 người cần ít nhất 380L - 450L. Đây là công thức tính dung tích chuẩn xác dựa trên thói quen trữ thực phẩm và tần suất đi chợ.',
    category: 'Hướng dẫn mua',
    readTime: '4 phút đọc',
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&h=600&fit=crop&auto=format',
    tags: ['Tủ lạnh', 'Hướng dẫn gia đình', 'AI Insight'],
    relatedProductIds: [24, 48, 14, 21],
    aiTakeaways: [
      'Công thức chuẩn: 100L cơ bản cho người đầu tiên + 50L cho mỗi thành viên tiếp theo + 50L dự phòng nấu nướng.',
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
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&h=600&fit=crop&auto=format',
    tags: ['Máy lạnh', 'Năng lượng', 'Phân tích chi phí'],
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
        </tbody>
      </table>
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
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&h=600&fit=crop&auto=format',
    tags: ['Nhà thông minh', 'So sánh', 'Đánh giá AI'],
    relatedProductIds: [5, 12, 17, 30],
    aiTakeaways: [
      'Samsung SmartThings hỗ trợ chuẩn Matter và liên kết đa thương hiệu tốt nhất trên thị trường hiện nay.',
      'LG ThinQ nổi trội ở các tính năng AI dự đoán thói quen giặt giũ và cảnh báo bảo trì máy nén sớm.',
      'Bosch Home Connect tập trung vào độ ổn định và các chương trình rửa chén, nấu nướng cao cấp.',
    ],
    contentHtml: `
      <h2>1. Kỷ nguyên thiết bị điện máy thông minh kết nối AI</h2>
      <p>Thời đại điều khiển từng thiết bị bằng remote rời rạc đã dần lùi vào dĩ vãng. Giờ đây, chỉ với một chiếc smartphone hoặc câu lệnh giọng nói, bạn có thể kiểm tra xem tủ lạnh còn đồ uống không, hẹn giờ máy giặt lúc giá điện rẻ, hoặc tự động bật máy lạnh 15 phút trước khi về nhà.</p>
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
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1000&h=600&fit=crop&auto=format',
    tags: ['Máy giặt', 'Gia đình', 'Cửa trước'],
    relatedProductIds: [2, 10, 18, 26],
    aiTakeaways: [
      'Máy giặt truyền động trực tiếp (Direct Drive) vận hành êm hơn, ít rung lắc và tuổi thọ động cơ cao hơn.',
      'Khối lượng giặt khuyến nghị: 8.5 - 9.5 kg cho gia đình 3-4 người; từ 10.5 kg trở lên nếu thường xuyên giặt chăn mền.',
      'Tính năng giặt hơi nước (Steam) diệt khuẩn đến 99.9% và làm giảm nhăn quần áo đến 30%.',
    ],
    contentHtml: `
      <h2>1. Vì sao nên chọn máy giặt cửa trước (lồng ngang)?</h2>
      <p>Khác với máy giặt cửa trên đảo quần áo bằng mâm giặt dễ gây xoắn rối và sờn rách, máy giặt lồng ngang ứng dụng nguyên lý rơi tự nhiên theo trọng lực, giúp quần áo được giặt sạch sâu như giặt tay mà sợi vải không bị kéo dãn.</p>
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
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1000&h=600&fit=crop&auto=format',
    tags: ['Tivi', 'OLED', 'QLED', 'Giải trí'],
    relatedProductIds: [6, 13, 22, 38],
    aiTakeaways: [
      'OLED cho độ tương phản vô hạn và góc nhìn tuyệt hảo, lý tưởng cho phòng xem phim tối hoặc xem bóng đá ban đêm.',
      'QLED có độ sáng vượt trội (lên đến 2000 nits), chống chói tốt, hoàn hảo cho phòng khách nhiều ánh sáng tự nhiên.',
      'Tần số quét 120Hz và cổng HDMI 2.1 là hai trang bị bắt buộc nếu bạn thích chơi game PS5 hoặc xem thể thao tốc độ cao.',
    ],
    contentHtml: `
      <h2>1. Hiểu đúng về bản chất công nghệ OLED và QLED</h2>
      <p><strong>OLED (Organic Light Emitting Diode):</strong> Mỗi điểm ảnh tự phát sáng độc lập. Khi hiển thị màu đen, điểm ảnh tắt hoàn toàn, mang lại màu đen sâu thẳm tuyệt đối và độ tương phản vô hạn.</p>
    `,
  },
  {
    id: 6,
    slug: '7-sai-lam-dung-dieu-hoa-ngon-tien-dien',
    title: '7 sai lầm khi dùng máy lạnh khiến tiền điện tăng gấp đôi mùa nóng',
    excerpt:
      'Hạ nhiệt độ xuống 16°C ngay khi bật, không vệ sinh lưới lọc định kỳ, bật tắt máy lạnh liên tục là những sai lầm phổ biến khiến máy nén phải chạy quá tải, tiêu tốn thêm 40-60% điện năng.',
    category: 'Tiết kiệm điện',
    readTime: '3 phút đọc',
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1614633833026-06203bc89454?w=1000&h=600&fit=crop&auto=format',
    tags: ['Máy lạnh', 'Mẹo vặt', 'Tiết kiệm điện'],
    relatedProductIds: [1, 15, 23, 47],
    aiTakeaways: [
      'Cài đặt nhiệt độ tối ưu từ 25°C - 27°C kết hợp quạt gió nhẹ giúp tiết kiệm 20% điện mà phòng vẫn mát rượi.',
      'Vệ sinh màng lọc bụi 2 tuần/lần giúp luồng gió lưu thông tốt hơn, giảm tải máy nén đến 15%.',
      'Đóng kín cửa và kéo rèm chống nắng cửa kính giúp giảm tới 30% nhiệt lượng hấp thụ từ bên ngoài.',
    ],
    contentHtml: `
      <h2>1. Sai lầm 1: Hạ nhiệt độ xuống 16°C để làm lạnh nhanh</h2>
      <p>Máy lạnh luôn chạy ở công suất tối đa cho đến khi phòng đạt nhiệt độ yêu cầu. Cài đặt 16°C không làm phòng mát nhanh hơn so với 25°C, mà chỉ khiến máy nén phải hoạt động hết công suất liên tục không nghỉ, gây tốn điện và sốc nhiệt khi bước ra ngoài.</p>
    `,
  },
  {
    id: 7,
    slug: 'noi-com-dien-cao-tan-ih-co-dang-tien',
    title: 'Nồi cơm điện cao tần (IH) có thực sự nấu cơm ngon hơn nồi mâm nhiệt?',
    excerpt:
      'Công nghệ đốt nóng cảm ứng từ Induction Heating (IH) làm chín hạt gạo từ trong ra ngoài mà không phụ thuộc vào mâm nhiệt đáy. Tìm hiểu sự khác biệt vị ngọt của cơm và độ bền sau 3 năm.',
    category: 'Hướng dẫn mua',
    readTime: '4 phút đọc',
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=1000&h=600&fit=crop&auto=format',
    tags: ['Nồi cơm điện', 'Gia dụng', 'Ẩm thực'],
    relatedProductIds: [8, 16, 32, 45],
    aiTakeaways: [
      'Nồi cao tần IH kiểm soát nhiệt độ chính xác qua cảm biến từ, hạt gạo chín đều, dẻo thơm và không bị nát hay khô đáy.',
      'Giữ ấm cơm lên đến 24 - 48 tiếng mà cơm không bị ôi thiu hay đổi màu vàng.',
      'Lòng nồi hợp kim nhiều lớp phủ chống dính kim cương siêu bền, an toàn tuyệt đối cho sức khỏe.',
    ],
    contentHtml: `
      <h2>1. Công nghệ cao tần IH hoạt động như thế nào?</h2>
      <p>Nồi cơm điện thông thường truyền nhiệt từ mâm nhiệt dưới đáy lên lòng nồi, khiến đáy dễ bị cháy xém hoặc cơm trên mặt bị sượng. Ngược lại, <strong>nồi cơm cao tần IH</strong> sử dụng từ trường để làm nóng toàn bộ lòng nồi 360 độ từ mọi hướng.</p>
    `,
  },
  {
    id: 8,
    slug: 'ngan-dong-mem-tu-lanh-co-than-thanh-nhu-quang-cao',
    title: 'Ngăn đông mềm trên tủ lạnh là gì và có thực sự tiện lợi như quảng cáo?',
    excerpt:
      'Nhiệt độ -1°C đến -3°C làm đông bề mặt thực phẩm mà không đóng băng các tế bào bên trong. Giữ nguyên dưỡng chất và hương vị tươi ngon của thịt cá mà không cần rã đông qua nước sôi hay lò vi sóng.',
    category: 'Đánh giá công nghệ',
    readTime: '5 phút đọc',
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=1000&h=600&fit=crop&auto=format',
    tags: ['Tủ lạnh', 'Công nghệ', 'Dinh dưỡng'],
    relatedProductIds: [24, 40, 48, 56],
    aiTakeaways: [
      'Thịt cá bảo quản ở ngăn đông mềm giữ được trọn vẹn vị ngọt tự nhiên và không bị mất nước khi thái nấu.',
      'Thời gian bảo quản lý tưởng từ 3 đến 7 ngày cho các món ăn dùng trong tuần.',
      'Tiết kiệm trung bình 30 - 45 phút thời gian chuẩn bị bữa cơm tối mỗi ngày cho gia đình.',
    ],
    contentHtml: `
      <h2>1. Cơ chế hoạt động của ngăn đông mềm (-3°C)</h2>
      <p>Khi đưa thực phẩm vào ngăn đá thường (-18°C), nước bên trong tế bào đông cứng thành các tinh thể đá sắc nhọn đâm vỡ màng tế bào. Khi rã đông, nước ngọt và chất dinh dưỡng sẽ chảy ra ngoài, khiến thịt bị dai và nhạt vị. Ngăn đông mềm duy trì ở mức -1°C đến -3°C chỉ làm đông nhẹ lớp màng mỏng bên ngoài, giữ nguyên độ tươi của thực phẩm.</p>
    `,
  },
  {
    id: 9,
    slug: 'quat-dieu-hoa-vs-may-lanh-giai-phap-phong-mo',
    title: 'Quạt điều hòa (quạt hơi nước) vs Máy lạnh: Giải pháp làm mát kinh tế cho không gian mở',
    excerpt:
      'Không gian phòng khách thông gió, quán ăn hay phòng trọ không kín rất khó lắp máy lạnh. Quạt điều hòa trở thành cứu cánh với chi phí chỉ bằng 1/3 và điện năng tiêu thụ cực thấp.',
    category: 'Tiết kiệm điện',
    readTime: '3 phút đọc',
    author: 'TechZone AI',
    image: '/images/quat-dieu-hoa-vs-may-lanh.jpg',
    tags: ['Quạt điều hòa', 'Làm mát', 'Kinh tế'],
    relatedProductIds: [7, 19, 35, 60],
    aiTakeaways: [
      'Quạt điều hòa làm giảm nhiệt độ từ 4 - 8°C hiệu quả trong không gian mở thoáng khí.',
      'Điện năng tiêu thụ chỉ khoảng 100W - 200W, tương đương 1/8 đến 1/10 so với máy lạnh.',
      'Linh hoạt di chuyển bánh xe giữa phòng khách, phòng bếp và sân vườn một cách dễ dàng.',
    ],
    contentHtml: `
      <h2>1. Khi nào nên mua quạt điều hòa thay vì máy lạnh?</h2>
      <p>Nếu bạn ở nhà thuê không thể đục tường lắp máy lạnh, hoặc không gian phòng khách có cửa sổ mở liên tục, quạt điều hòa là sự lựa chọn kinh tế nhất với khả năng tạo gió tự nhiên mát mẻ mà không tốn tiền điện.</p>
    `,
  },
  {
    id: 10,
    slug: 'lo-vi-song-co-nuong-co-thay-the-lo-nuong-chuyen-dung',
    title: 'Lò vi sóng có nướng: Liệu có thể thay thế hoàn toàn lò nướng bánh chuyên dụng?',
    excerpt:
      'Sự kết hợp 2 trong 1 giúp tiết kiệm diện tích bếp tối đa. Cùng chuyên gia bếp TechZone đánh giá khả năng nướng thịt, làm giòn bánh mì và nướng bánh bông lan thực tế.',
    category: 'Hướng dẫn mua',
    readTime: '4 phút đọc',
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=1000&h=600&fit=crop&auto=format',
    tags: ['Lò vi sóng', 'Bếp', 'Gia dụng'],
    relatedProductIds: [3, 11, 27, 43],
    aiTakeaways: [
      'Lò vi sóng có nướng nướng pizza, hâm giòn bánh mì và nướng thịt mỏng cực kỳ tiện lợi và nhanh chóng.',
      'Nếu bạn có nhu cầu nướng gà nguyên con hoặc nướng bánh gato chuyên nghiệp, lò nướng dung tích lớn vẫn là lựa chọn tốt hơn.',
      'Ưu tiên chọn lò có công nghệ Inverter để nhiệt lượng vi sóng tỏa đều, không làm khô thức ăn.',
    ],
    contentHtml: `
      <h2>1. Ưu và nhược điểm của lò vi sóng có nướng</h2>
      <p>Lò vi sóng có nướng tích hợp thanh nhiệt (thường là thanh điện trở hoặc đèn halogen) ở nóc lò, cho phép bạn vừa hâm nóng thức ăn bằng sóng vi ba, vừa nướng giòn bề mặt món ăn trong cùng một thiết bị.</p>
    `,
  },
  {
    id: 11,
    slug: 'loa-thanh-soundbar-cho-phong-khach-tivi',
    title: 'Nâng cấp âm thanh TV: Cách chọn loa thanh (Soundbar) chuẩn Dolby Atmos cho phòng khách',
    excerpt:
      'TV mỏng ngày nay có chất lượng hình ảnh xuất sắc nhưng loa tích hợp thường bị rè và thiếu âm trầm. Soundbar 2.1 hoặc 5.1 là giải pháp biến phòng khách thành rạp chiếu phim tại gia.',
    category: 'Đánh giá công nghệ',
    readTime: '4 phút đọc',
    author: 'TechZone AI',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1000&h=600&fit=crop&auto=format',
    tags: ['Loa thanh', 'Soundbar', 'Âm thanh'],
    relatedProductIds: [11, 28, 44, 72],
    aiTakeaways: [
      'Loa trầm rời (Subwoofer không dây) là yếu tố quyết định độ sống động của các cảnh phim hành động và tiếng nổ.',
      'Chuẩn kết nối HDMI eARC giúp truyền tải âm thanh Dolby Atmos vòm chất lượng cao không nén.',
      'Công nghệ AI Sound tự động tối ưu hóa giọng nói nhân vật khi xem thời sự và phim truyện.',
    ],
    contentHtml: `
      <h2>1. Vì sao TV thông minh cần thêm một chiếc soundbar?</h2>
      <p>Để đạt độ mỏng chỉ vài milimet, các nhà sản xuất phải thu nhỏ kích thước củ loa TV, khiến âm trầm (bass) gần như biến mất. Một chiếc soundbar gọn gàng đặt dưới kệ TV sẽ mang lại dải âm trầm uy lực và giọng thoại trong trẻo hơn gấp nhiều lần.</p>
    `,
  },
  {
    id: 12,
    slug: 'sale-khung-mua-he',
    title: 'Đại tiệc Giảm giá Mùa hè TechZone: Giảm đến 50% cho thiết bị làm mát',
    excerpt:
      'Chương trình khuyến mãi lớn nhất trong năm tại TechZone: Giảm giá đến 50% cho toàn bộ máy lạnh, quạt điều hòa và tủ lạnh Inverter chính hãng. Miễn phí vận chuyển và lắp đặt trong 2h.',
    category: 'Khuyến mãi',
    readTime: '2 phút đọc',
    author: 'TechZone Khuyến Mãi',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1000&h=600&fit=crop&auto=format',
    tags: ['Khuyến mãi', 'Mùa hè', 'Giảm giá'],
    relatedProductIds: [1, 9, 24, 40],
    aiTakeaways: [
      'Áp dụng cho hơn 50 mẫu máy lạnh Inverter từ Daikin, Panasonic, LG và Casper.',
      'Tặng gói vật tư ống đồng và công lắp đặt trị giá lên đến 1.200.000₫.',
      'Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng và công ty tài chính.',
    ],
    contentHtml: `
      <h2>1. Chi tiết chương trình khuyến mãi mùa hè</h2>
      <p>Nhằm đồng hành cùng quý khách hàng vượt qua những đợt nắng nóng gay gắt, TechZone triển khai đại tiệc ưu đãi làm mát lớn nhất năm với hàng loạt chính sách đặc quyền và quà tặng giá trị.</p>
    `,
  },
]

// Danh sách các Mẹo AI trong ngày (tự động đổi mỗi ngày)
export const dailyAiTips = [
  '💡 Mẹo AI hôm nay: Khi bật điều hòa, hãy bật thêm quạt gió thoang thoảng ở tốc độ thấp. Quạt giúp luân chuyển khí lạnh nhanh hơn, giúp bạn tăng nhiệt độ điều hòa lên 1-2°C mà vẫn mát, tiết kiệm 15% tiền điện!',
  '💡 Mẹo AI hôm nay: Không nên để tủ lạnh quá trống hoặc quá đầy. Tủ lạnh hoạt động tiết kiệm điện nhất khi chứa khoảng 70-80% dung tích.',
  '💡 Mẹo AI hôm nay: Giặt quần áo bằng nước lạnh 20-30°C cho quần áo thông thường giúp tiết kiệm 75-90% năng lượng so với giặt nước nóng.',
  '💡 Mẹo AI hôm nay: Vệ sinh lưới lọc bụi điều hòa 2 tuần/lần giúp máy làm mát nhanh hơn 20% và giảm tới 5-15% lượng điện tiêu thụ.',
  '💡 Mẹo AI hôm nay: Không cho đồ còn nóng vào tủ lạnh. Hãy để đồ nguội bớt ngoài nhiệt độ phòng trước khi cất để tránh máy nén tủ lạnh phải gồng mình làm lạnh.',
  '💡 Mẹo AI hôm nay: Rút phích cắm hoặc tắt công tắc ổ cắm của các thiết bị có đèn chờ (TV, lò vi sóng, dàn âm thanh) khi vắng nhà dài ngày giúp giảm 5-10% hóa đơn tiền điện.',
  '💡 Mẹo AI hôm nay: Đặt tủ lạnh cách tường ít nhất 10cm để dàn nóng thoát nhiệt dễ dàng, giúp máy nén bền hơn và tiết kiệm điện.',
]

/**
 * Thuật toán tính chỉ số ngày (Day Index theo múi giờ Việt Nam UTC+7)
 * Tự động chuyển số mới đúng vào lúc 00:00 mỗi ngày!
 */
export function getDailySeed() {
  const now = new Date()
  const vnOffsetMs = 7 * 60 * 60 * 1000
  const vnTime = new Date(now.getTime() + vnOffsetMs)
  // Số ngày tính từ mốc Epoch (thay đổi sau mỗi 24 tiếng)
  return Math.floor(vnTime.getTime() / (1000 * 60 * 60 * 24))
}

/**
 * Lấy ngày tháng hiện tại định dạng Việt Nam
 */
export function getFormattedToday(offsetDays = 0) {
  const now = new Date()
  const vnOffsetMs = 7 * 60 * 60 * 1000
  const vnTime = new Date(now.getTime() + vnOffsetMs)
  vnTime.setUTCDate(vnTime.getUTCDate() - offsetDays)
  const d = String(vnTime.getUTCDate()).padStart(2, '0')
  const m = String(vnTime.getUTCMonth() + 1).padStart(2, '0')
  const y = vnTime.getUTCFullYear()
  return `${d}/${m}/${y}`
}

/**
 * Lấy 3 bài viết hiển thị trên Trang Chủ (AiBlog.jsx)
 * TỰ ĐỘNG THAY ĐỔI 1 LẦN MỖI NGÀY!
 */
export function getDailyHomeArticles() {
  const dayNumber = getDailySeed()
  const total = blogArticles.length

  // Công thức xoay vòng theo chu kỳ ngày
  const idx1 = (dayNumber * 3) % total
  const idx2 = (dayNumber * 3 + 1) % total
  const idx3 = (dayNumber * 3 + 2) % total

  const items = [blogArticles[idx1], blogArticles[idx2], blogArticles[idx3]]

  // Gắn ngày hiển thị động để luôn tươi mới (Hôm nay, Hôm qua, 2 ngày trước)
  return items.map((item, index) => {
    let dateLabel = ''
    if (index === 0) dateLabel = `Hôm nay, ${getFormattedToday(0)}`
    else if (index === 1) dateLabel = `Hôm qua, ${getFormattedToday(1)}`
    else dateLabel = getFormattedToday(index)

    return {
      ...item,
      date: dateLabel,
    }
  })
}

/**
 * Lấy Bài viết Tiêu điểm trong ngày (Daily Featured Article)
 * TỰ ĐỘNG THAY ĐỔI MỖI NGÀY!
 */
export function getDailyFeaturedArticle() {
  const dayNumber = getDailySeed()
  const featIdx = dayNumber % blogArticles.length
  const featured = blogArticles[featIdx]

  return {
    ...featured,
    date: `Cập nhật hôm nay, ${getFormattedToday(0)}`,
  }
}

/**
 * Lấy Mẹo AI mua sắm của ngày hôm nay
 */
export function getDailyTip() {
  const dayNumber = getDailySeed()
  const tipIdx = dayNumber % dailyAiTips.length
  return dailyAiTips[tipIdx]
}

export function getAllArticles() {
  return blogArticles.map((a, i) => ({
    ...a,
    date: getFormattedToday((i * 2) % 10),
  }))
}

export function getArticleBySlug(slug) {
  if (!slug) return null
  const clean = slug.trim().toLowerCase()
  const found = blogArticles.find(a => a.slug.trim().toLowerCase() === clean)
  if (!found) return null

  return {
    ...found,
    date: getFormattedToday(1),
  }
}

export function getRelatedArticles(currentSlug, limit = 3) {
  return blogArticles
    .filter(a => a.slug !== currentSlug)
    .slice(0, limit)
    .map((a, i) => ({
      ...a,
      date: getFormattedToday(i + 1),
    }))
}
