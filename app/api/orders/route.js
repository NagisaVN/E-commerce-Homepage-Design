import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function getDbPath() {
  return path.join(process.cwd(), 'db.json')
}

function readDb() {
  try {
    const raw = fs.readFileSync(getDbPath(), 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Lỗi đọc db.json:', err)
    return {}
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (err) {
    // Trên Vercel hoặc môi trường read-only, fs write có thể không cho phép
    console.warn('Không thể ghi file db.json (có thể do môi trường read-only):', err?.message)
    return false
  }
}

// Khởi tạo bộ nhớ RAM server để giữ đơn hàng ngay cả khi Vercel ở chế độ read-only
if (!globalThis.__TECHZONE_ORDERS__) {
  const initialDb = readDb()
  globalThis.__TECHZONE_ORDERS__ = initialDb.don_hang || []
}

// Lấy chuỗi ngày giờ theo chuẩn múi giờ Việt Nam (UTC+7)
function getVietnamNowString() {
  const now = new Date()
  const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000)
  const y = vnTime.getUTCFullYear()
  const m = String(vnTime.getUTCMonth() + 1).padStart(2, '0')
  const d = String(vnTime.getUTCDate()).padStart(2, '0')
  const hh = String(vnTime.getUTCHours()).padStart(2, '0')
  const mm = String(vnTime.getUTCMinutes()).padStart(2, '0')
  const ss = String(vnTime.getUTCSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

// Sinh mã đơn hàng chuẩn theo ngày giờ Việt Nam (VD: DH202610294891)
function generateOrderCode() {
  const now = new Date()
  const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000)
  const y = vnTime.getUTCFullYear()
  const m = String(vnTime.getUTCMonth() + 1).padStart(2, '0')
  const d = String(vnTime.getUTCDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `DH${y}${m}${d}${rand}`
}

// Sinh mã vận đơn bưu tá (VD: VN-TZ-884920473G)
function generateTrackingCode() {
  const randNum = Math.floor(100000000 + Math.random() * 900000000)
  return `VN-TZ-${randNum}G`
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')?.trim()
    const phone = searchParams.get('phone')?.trim()

    const data = readDb()
    const fileOrders = data.don_hang || []
    const memoryOrders = globalThis.__TECHZONE_ORDERS__ || []

    // Gộp cả đơn từ file db.json và đơn mới từ bộ nhớ
    const all = [...memoryOrders, ...fileOrders]
    const orders = all.filter(
      (v, i, a) =>
        a.findIndex(
          (t) => t.ma_don_hang?.trim().toLowerCase() === v.ma_don_hang?.trim().toLowerCase()
        ) === i
    )

    if (code) {
      const found = orders.find(
        (o) => o.ma_don_hang?.trim().toLowerCase() === code.toLowerCase()
      )
      if (found) {
        return NextResponse.json({ success: true, order: found })
      }
      return NextResponse.json({ success: false, message: 'Không tìm thấy đơn hàng' }, { status: 404 })
    }

    if (phone) {
      const list = orders.filter((o) => o.dien_thoai_nguoi_nhan?.trim() === phone)
      return NextResponse.json({ success: true, orders: list })
    }

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      customer = {},
      items = [],
      paymentMethod = 'COD',
      totalAmount = 0,
      note = '',
      isVatInvoice = false,
      vatInfo = {},
      existingOrderCode = null,
      existingTrackingCode = null,
      existingCreatedAt = null,
    } = body

    // Validate thông tin bắt buộc
    if (!customer.name || !customer.phone || !customer.address) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Giỏ hàng của bạn đang trống' },
        { status: 400 }
      )
    }

    const orderCode = existingOrderCode || generateOrderCode()
    const trackingCode = existingTrackingCode || generateTrackingCode()
    const nowStr = existingCreatedAt || getVietnamNowString()

    // Tạo địa chỉ đầy đủ
    const fullAddress = [
      customer.address,
      customer.ward,
      customer.district,
      customer.city,
    ].filter(Boolean).join(', ')

    const newOrder = {
      id: Date.now(),
      ma_don_hang: orderCode,
      ma_van_don: trackingCode,
      ten_nguoi_nhan: customer.name.trim(),
      dien_thoai_nguoi_nhan: customer.phone.trim(),
      email_nguoi_nhan: customer.email?.trim() || '',
      dia_chi_nguoi_nhan: fullAddress,
      ghi_chu: note || customer.note || '',
      is_guest: true,
      phuong_thuc_thanh_toan: paymentMethod === 'COD' ? 'COD - Tiền mặt khi nhận hàng' : 'Chuyển khoản PayOS VietQR',
      payment_method_code: paymentMethod, // 'COD' | 'BANK_TRANSFER'
      trang_thai: 'Chờ xác nhận',
      trang_thai_thanh_toan: paymentMethod === 'COD' ? 'Chưa thanh toán' : 'Chờ chuyển khoản',
      tong_tien_hang: totalAmount,
      phi_van_chuyen: 0,
      tong_tien_cuoi_cung: totalAmount,
      payos: body.payos || null,
      san_pham: items.map((it) => ({
        id: it.id,
        name: it.name || it.ten_san_pham,
        price: it.price || it.gia || 0,
        originalPrice: it.originalPrice || it.original || it.gia_goc || it.price,
        quantity: it.quantity || 1,
        image: it.image || it.hinh_chinh || '',
        sku: it.sku || `SKU-TZ-${it.id}`,
        variant: it.variant || 'Chính hãng TechZone',
      })),
      is_vat_invoice: !!isVatInvoice,
      vat_info: isVatInvoice ? vatInfo : null,
      created_at: nowStr,
    }

    // 1. Lưu vào RAM server
    if (!globalThis.__TECHZONE_ORDERS__) {
      globalThis.__TECHZONE_ORDERS__ = []
    }
    // Tránh trùng mã đơn
    globalThis.__TECHZONE_ORDERS__ = [
      newOrder,
      ...globalThis.__TECHZONE_ORDERS__.filter((o) => o.ma_don_hang !== orderCode),
    ]

    // 2. Ghi vào file db.json trên đĩa
    const db = readDb()
    if (!Array.isArray(db.don_hang)) {
      db.don_hang = []
    }
    db.don_hang = [
      newOrder,
      ...db.don_hang.filter((o) => o.ma_don_hang !== orderCode),
    ]
    saveDb(db)

    return NextResponse.json({
      success: true,
      message: 'Đặt hàng thành công!',
      order: newOrder,
    })
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error)
    return NextResponse.json(
      { success: false, message: 'Đã có lỗi xảy ra khi tạo đơn hàng', error: error.message },
      { status: 500 }
    )
  }
}
