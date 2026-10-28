import { PayOS } from '@payos/node'

function getPayOSClient() {
  const clientId = process.env.PAYOS_CLIENT_ID?.trim()
  const apiKey = process.env.PAYOS_API_KEY?.trim()
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY?.trim()

  if (!clientId || !apiKey || !checksumKey) {
    return null
  }

  try {
    return new PayOS({
      clientId,
      apiKey,
      checksumKey,
    })
  } catch (err) {
    console.error('Lỗi khởi tạo PayOS Client:', err)
    return null
  }
}

/**
 * Kiểm tra xem cấu hình PayOS trong .env.local đã sẵn sàng hay chưa
 */
export function isPayOSConfigured() {
  const clientId = process.env.PAYOS_CLIENT_ID?.trim()
  const apiKey = process.env.PAYOS_API_KEY?.trim()
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY?.trim()
  return Boolean(clientId && apiKey && checksumKey)
}

/**
 * Tạo link thanh toán PayOS
 * @param {Object} params
 * @param {number} params.orderCode - Mã đơn dạng số nguyên (PayOS bắt buộc số nguyên <= 9007199254740991)
 * @param {number} params.amount - Số tiền (VND)
 * @param {string} params.description - Mô tả (tối đa 25 ký tự)
 * @param {Array} params.items - Danh sách sản phẩm [{ name, quantity, price }]
 * @param {string} params.returnUrl - URL khi khách thanh toán thành công
 * @param {string} params.cancelUrl - URL khi khách hủy thanh toán
 */
export async function createPayOSPaymentLink({
  orderCode,
  amount,
  description = 'Thanh toan TechZone',
  items = [],
  returnUrl,
  cancelUrl,
}) {
  const payOS = getPayOSClient()

function sanitizePayOSDescription(str) {
  if (!str) return 'TechZone'
  const noTones = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
  return (noTones || 'TechZone').substring(0, 25)
}

  // Chuẩn hóa orderCode về số nguyên dương an toàn (<= 9007199254740991)
  const digitsOnly = String(orderCode).replace(/\D/g, '')
  const safeOrderCode =
    Number(digitsOnly.substring(0, 14)) ||
    Math.floor(Date.now() % 1000000000)

  // Cắt bớt description không quá 25 ký tự và loại bỏ dấu tiếng Việt theo quy định PayOS
  const safeDescription = sanitizePayOSDescription(description || String(orderCode))

  // Nếu đã cấu hình PayOS Key trong .env.local -> Gọi cổng thật
  if (payOS) {
    try {
      const response = await payOS.paymentRequests.create({
        orderCode: safeOrderCode,
        amount: Math.round(Number(amount)),
        description: safeDescription,
        items: items.map((it) => ({
          name: (it.name || 'Sản phẩm').substring(0, 50),
          quantity: Number(it.quantity) || 1,
          price: Math.round(Number(it.price) || 0),
        })),
        returnUrl,
        cancelUrl,
      })

      const qrImageUrl = `https://img.vietqr.io/image/${response.bin || 'MB'}-${response.accountNumber || '0987654321'}-compact2.jpg?amount=${response.amount}&addInfo=${encodeURIComponent(response.description)}&accountName=${encodeURIComponent(response.accountName || 'TECHZONE STORE')}`

      return {
        success: true,
        isSimulation: false,
        orderCode: safeOrderCode,
        checkoutUrl: response.checkoutUrl,
        qrCode: response.qrCode,
        qrImageUrl,
        paymentLinkId: response.paymentLinkId,
        accountName: response.accountName,
        accountNumber: response.accountNumber,
        bin: response.bin,
        amount: response.amount,
        description: response.description,
      }
    } catch (error) {
      console.error('Lỗi khi gọi PayOS paymentRequests.create:', error)
      // Nếu API lỗi (ví dụ key test hết hạn), fallback mượt mà sang VietQR
    }
  }

  // Fallback: Tự động giả lập cổng VietQR chuẩn ngân hàng nếu chưa nhập key
  const fallbackQrUrl = `https://img.vietqr.io/image/MB-0987654321-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(safeDescription)}&accountName=TECHZONE%20STORE`

  return {
    success: true,
    isSimulation: true,
    orderCode: safeOrderCode,
    checkoutUrl: null, // Không chuyển trang nếu chưa có key thật, hiện QR trực tiếp
    qrCode: fallbackQrUrl,
    qrImageUrl: fallbackQrUrl,
    accountName: 'TECHZONE STORE',
    accountNumber: '0987654321',
    bin: '970422', // MBBank
    amount,
    description: safeDescription,
    message: 'Chế độ mô phỏng VietQR (Thêm PAYOS_CLIENT_ID vào .env.local để kích hoạt cổng PayOS thật)',
  }
}

/**
 * Lấy thông tin trạng thái thanh toán từ PayOS
 */
export async function getPayOSPaymentLinkInfo(orderCode) {
  const payOS = getPayOSClient()
  if (!payOS) return null

  try {
    const safeOrderCode = Number(String(orderCode).replace(/\D/g, '').substring(0, 14))
    if (!safeOrderCode) return null
    return await payOS.paymentRequests.get(safeOrderCode)
  } catch (error) {
    console.error('Lỗi getPayOSPaymentLinkInfo:', error?.message)
    return null
  }
}

/**
 * Xác thực dữ liệu Webhook từ PayOS gửi sang
 */
export function verifyPayOSWebhook(body) {
  const payOS = getPayOSClient()
  if (!payOS) return null

  try {
    return payOS.webhooks.verify(body)
  } catch (error) {
    console.error('Lỗi xác thực webhook PayOS:', error?.message)
    return null
  }
}
