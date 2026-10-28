import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getPayOSPaymentLinkInfo } from '../../../../lib/payos'

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')?.trim()

    if (!code) {
      return NextResponse.json({ success: false, message: 'Thiếu mã đơn hàng' }, { status: 400 })
    }

    const cleanCode = code.toLowerCase()

    // 1. Kiểm tra trong bộ nhớ RAM
    let foundOrder = (globalThis.__TECHZONE_ORDERS__ || []).find(
      (o) => o.ma_don_hang?.trim().toLowerCase() === cleanCode
    )

    // 2. Nếu chưa thấy, kiểm tra trong file db.json
    if (!foundOrder) {
      const db = readDb()
      foundOrder = (db.don_hang || []).find(
        (o) => o.ma_don_hang?.trim().toLowerCase() === cleanCode
      )
    }

    // 3. Nếu cấu hình PayOS thật, tra cứu trực tiếp từ PayOS Server
    let isPaid =
      foundOrder?.trang_thai_thanh_toan === 'Đã thanh toán' ||
      foundOrder?.trang_thai === 'Đã hoàn thành'

    if (!isPaid && code) {
      try {
        const payosInfo = await getPayOSPaymentLinkInfo(code)
        if (payosInfo && (payosInfo.status === 'PAID' || payosInfo.amountPaid >= payosInfo.amount)) {
          isPaid = true
          // Cập nhật trạng thái sang Đã thanh toán
          if (foundOrder) {
            foundOrder.trang_thai_thanh_toan = 'Đã thanh toán'
            foundOrder.trang_thai = 'Đang giao hàng'
            foundOrder.thoi_diem_thanh_toan = new Date().toISOString()

            // Cập nhật RAM & db.json
            const db = readDb()
            if (Array.isArray(db.don_hang)) {
              db.don_hang = db.don_hang.map((o) =>
                o.ma_don_hang?.trim().toLowerCase() === cleanCode
                  ? { ...o, trang_thai_thanh_toan: 'Đã thanh toán', trang_thai: 'Đang giao hàng' }
                  : o
              )
              saveDb(db)
            }
          }
        }
      } catch (err) {
        // bỏ qua nếu chưa cấu hình key
      }
    }

    return NextResponse.json({
      success: true,
      paid: isPaid,
      status: isPaid ? 'PAID' : 'PENDING',
      order: foundOrder,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// Hỗ trợ mô phỏng thanh toán thành công (Testing/Demo button)
export async function POST(request) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ success: false, message: 'Thiếu mã đơn hàng' }, { status: 400 })
    }

    const cleanCode = code.trim().toLowerCase()

    // Cập nhật RAM
    if (globalThis.__TECHZONE_ORDERS__) {
      globalThis.__TECHZONE_ORDERS__ = globalThis.__TECHZONE_ORDERS__.map((o) =>
        o.ma_don_hang?.trim().toLowerCase() === cleanCode
          ? { ...o, trang_thai_thanh_toan: 'Đã thanh toán', trang_thai: 'Đang xử lý' }
          : o
      )
    }

    // Cập nhật db.json
    const db = readDb()
    if (Array.isArray(db.don_hang)) {
      db.don_hang = db.don_hang.map((o) =>
        o.ma_don_hang?.trim().toLowerCase() === cleanCode
          ? { ...o, trang_thai_thanh_toan: 'Đã thanh toán', trang_thai: 'Đang xử lý' }
          : o
      )
      saveDb(db)
    }

    return NextResponse.json({
      success: true,
      message: 'Mô phỏng thanh toán PayOS thành công!',
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
