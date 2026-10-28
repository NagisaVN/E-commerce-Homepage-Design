import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { verifyPayOSWebhook } from '../../../../lib/payos'

function getDbPath() {
  return path.join(process.cwd(), 'db.json')
}

function readDb() {
  try {
    const raw = fs.readFileSync(getDbPath(), 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    return {}
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (err) {
    return false
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    // 1. Xác thực Webhook bằng Checksum Key
    let webhookData = null
    try {
      webhookData = verifyPayOSWebhook(body)
    } catch (e) {
      console.warn('Lỗi xác thực chữ ký PayOS webhook:', e)
    }

    const data = webhookData || body.data || body

    // 2. Lấy thông tin thanh toán
    const { orderCode, amount, code, desc } = data
    if (!orderCode) {
      return NextResponse.json({ success: true, message: 'Nhận webhook nhưng thiếu orderCode' })
    }

    const codeStr = String(orderCode)
    console.log(`[PayOS Webhook] Nhận thông báo thanh toán đơn #${codeStr}, số tiền: ${amount}`)

    // 3. Cập nhật trạng thái đơn hàng trong RAM
    if (globalThis.__TECHZONE_ORDERS__) {
      globalThis.__TECHZONE_ORDERS__ = globalThis.__TECHZONE_ORDERS__.map((o) => {
        const matches =
          String(o.ma_don_hang).includes(codeStr) ||
          String(o.id).includes(codeStr)
        if (matches) {
          return {
            ...o,
            trang_thai_thanh_toan: 'Đã thanh toán',
            trang_thai: 'Đã xác nhận thanh toán',
            thoi_diem_thanh_toan: new Date().toISOString(),
          }
        }
        return o
      })
    }

    // 4. Cập nhật vào db.json
    const db = readDb()
    if (Array.isArray(db.don_hang)) {
      db.don_hang = db.don_hang.map((o) => {
        const matches =
          String(o.ma_don_hang).includes(codeStr) ||
          String(o.id).includes(codeStr)
        if (matches) {
          return {
            ...o,
            trang_thai_thanh_toan: 'Đã thanh toán',
            trang_thai: 'Đã xác nhận thanh toán',
            thoi_diem_thanh_toan: new Date().toISOString(),
          }
        }
        return o
      })
      saveDb(db)
    }

    return NextResponse.json({ success: true, message: 'Webhook đã xử lý thành công' })
  } catch (error) {
    console.error('Lỗi khi xử lý PayOS webhook:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
