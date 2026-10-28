import { NextResponse } from 'next/server'
import { readDatabase, saveDatabase } from '../../../../lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('q')?.toLowerCase().trim()

    const db = readDatabase()
    const fileOrders = db.don_hang || []
    const memoryOrders = globalThis.__TECHZONE_ORDERS__ || []

    // Gộp và khử trùng lặp
    const all = [...memoryOrders, ...fileOrders]
    let orders = all.filter(
      (v, i, a) =>
        a.findIndex(
          (t) => t.ma_don_hang?.trim().toLowerCase() === v.ma_don_hang?.trim().toLowerCase()
        ) === i
    )

    if (status && status !== 'ALL') {
      orders = orders.filter((o) => o.trang_thai?.toLowerCase().includes(status.toLowerCase()))
    }

    if (search) {
      orders = orders.filter(
        (o) =>
          o.ma_don_hang?.toLowerCase().includes(search) ||
          o.ten_nguoi_nhan?.toLowerCase().includes(search) ||
          o.dien_thoai_nguoi_nhan?.includes(search)
      )
    }

    return NextResponse.json({
      success: true,
      total: orders.length,
      orders,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { orderCode, trang_thai, trang_thai_thanh_toan, note, updatedBy, role } = body

    if (!orderCode) {
      return NextResponse.json({ success: false, message: 'Thiếu mã đơn hàng' }, { status: 400 })
    }

    const cleanCode = String(orderCode).trim().toLowerCase()
    const db = readDatabase()
    let orders = db.don_hang || []

    const nowStr = new Date().toISOString()
    let foundOrder = null

    // Cập nhật trong file db.json
    orders = orders.map((o) => {
      if (o.ma_don_hang?.trim().toLowerCase() === cleanCode) {
        foundOrder = {
          ...o,
          trang_thai: trang_thai || o.trang_thai,
          trang_thai_thanh_toan: trang_thai_thanh_toan || o.trang_thai_thanh_toan,
          ghi_chu_admin: note || o.ghi_chu_admin,
          lich_su_cap_nhat: [
            ...(o.lich_su_cap_nhat || []),
            {
              thoi_gian: nowStr,
              trang_thai_moi: trang_thai || o.trang_thai,
              nguoi_thuc_hien: updatedBy || 'Ban Quản Trị',
              vai_tro: role || 'admin',
              ghi_chu: note || '',
            },
          ],
          updated_at: nowStr,
        }
        return foundOrder
      }
      return o
    })

    if (!foundOrder) {
      // Nếu không có trong db.json, kiểm tra trong RAM
      if (globalThis.__TECHZONE_ORDERS__) {
        globalThis.__TECHZONE_ORDERS__ = globalThis.__TECHZONE_ORDERS__.map((o) => {
          if (o.ma_don_hang?.trim().toLowerCase() === cleanCode) {
            foundOrder = {
              ...o,
              trang_thai: trang_thai || o.trang_thai,
              trang_thai_thanh_toan: trang_thai_thanh_toan || o.trang_thai_thanh_toan,
              ghi_chu_admin: note || o.ghi_chu_admin,
              updated_at: nowStr,
            }
            return foundOrder
          }
          return o
        })
      }
    }

    if (!foundOrder) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy đơn hàng' }, { status: 404 })
    }

    db.don_hang = orders
    saveDatabase(db)
    globalThis.__TECHZONE_ORDERS__ = orders

    return NextResponse.json({
      success: true,
      message: `Cập nhật trạng thái đơn #${orderCode} thành công: "${trang_thai || foundOrder.trang_thai}"`,
      order: foundOrder,
    })
  } catch (error) {
    console.error('Lỗi PATCH admin/orders:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
