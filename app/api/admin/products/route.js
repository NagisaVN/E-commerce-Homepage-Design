import { NextResponse } from 'next/server'
import { readDatabase, saveDatabase, toSlug } from '../../../../lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const status = searchParams.get('status')
    const search = searchParams.get('q')?.toLowerCase().trim()

    const db = readDatabase()
    let products = db.san_pham || []

    if (category && category !== 'ALL') {
      products = products.filter((p) => String(p.id_danh_muc) === String(category))
    }

    if (brand && brand !== 'ALL') {
      products = products.filter((p) => String(p.id_thuong_hieu) === String(brand))
    }

    if (status && status !== 'ALL') {
      if (status === 'ACTIVE') products = products.filter((p) => p.trang_thai === 1)
      if (status === 'INACTIVE') products = products.filter((p) => p.trang_thai === 0)
      if (status === 'FEATURED') products = products.filter((p) => p.noi_bat === 1)
    }

    if (search) {
      products = products.filter(
        (p) =>
          p.ten_san_pham?.toLowerCase().includes(search) ||
          p.sku?.toLowerCase().includes(search) ||
          p.slug?.toLowerCase().includes(search)
      )
    }

    return NextResponse.json({
      success: true,
      total: products.length,
      products,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      ten_san_pham,
      id_danh_muc,
      id_thuong_hieu,
      gia,
      gia_goc,
      ton_kho,
      hinh_chinh,
      noi_bat = 0,
      trang_thai = 1,
      bao_hanh = '24 tháng',
      mo_ta = '',
      thong_so = {},
      sku,
    } = body

    if (!ten_san_pham || !gia) {
      return NextResponse.json(
        { success: false, message: 'Tên sản phẩm và Giá bán là bắt buộc!' },
        { status: 400 }
      )
    }

    const db = readDatabase()
    const products = db.san_pham || []

    // Sinh ID mới
    const maxId = products.reduce((max, p) => (Number(p.id) > max ? Number(p.id) : max), 0)
    const newId = maxId + 1

    const slug = toSlug(ten_san_pham) + `-${newId}`
    const generatedSku = sku?.trim() || `SKU-TZ-${newId}`

    const newProduct = {
      id: newId,
      ten_san_pham: ten_san_pham.trim(),
      slug,
      sku: generatedSku,
      id_danh_muc: Number(id_danh_muc) || 1,
      id_thuong_hieu: Number(id_thuong_hieu) || 1,
      gia: Math.round(Number(gia)),
      gia_goc: Math.round(Number(gia_goc || gia)),
      ton_kho: Number(ton_kho) || 10,
      hinh_chinh: hinh_chinh?.trim() || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
      noi_bat: Number(noi_bat) || 0,
      trang_thai: Number(trang_thai) === 0 ? 0 : 1,
      so_lan_xem: 0,
      rating: 5,
      bao_hanh: bao_hanh || '24 tháng',
      mo_ta: mo_ta || '',
      thong_so: thong_so || {},
      created_at: new Date().toISOString(),
    }

    db.san_pham = [newProduct, ...products]
    saveDatabase(db)

    return NextResponse.json({
      success: true,
      message: 'Thêm sản phẩm mới thành công!',
      product: newProduct,
    })
  } catch (error) {
    console.error('Lỗi POST admin/products:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID sản phẩm cần cập nhật' }, { status: 400 })
    }

    const db = readDatabase()
    const products = db.san_pham || []

    const index = products.findIndex((p) => String(p.id) === String(id))
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm' }, { status: 404 })
    }

    const current = products[index]

    // Cập nhật các trường
    const updatedProduct = {
      ...current,
      ...updates,
      id: current.id, // Giữ nguyên ID
      gia: updates.gia !== undefined ? Math.round(Number(updates.gia)) : current.gia,
      gia_goc: updates.gia_goc !== undefined ? Math.round(Number(updates.gia_goc)) : current.gia_goc,
      ton_kho: updates.ton_kho !== undefined ? Number(updates.ton_kho) : current.ton_kho,
      id_danh_muc: updates.id_danh_muc !== undefined ? Number(updates.id_danh_muc) : current.id_danh_muc,
      id_thuong_hieu: updates.id_thuong_hieu !== undefined ? Number(updates.id_thuong_hieu) : current.id_thuong_hieu,
      noi_bat: updates.noi_bat !== undefined ? Number(updates.noi_bat) : current.noi_bat,
      trang_thai: updates.trang_thai !== undefined ? Number(updates.trang_thai) : current.trang_thai,
      updated_at: new Date().toISOString(),
    }

    products[index] = updatedProduct
    db.san_pham = products
    saveDatabase(db)

    return NextResponse.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      product: updatedProduct,
    })
  } catch (error) {
    console.error('Lỗi PUT admin/products:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const role = searchParams.get('role') || 'staff'
    const permanent = searchParams.get('permanent') === 'true'

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID sản phẩm' }, { status: 400 })
    }

    const db = readDatabase()
    let products = db.san_pham || []

    const target = products.find((p) => String(p.id) === String(id))
    if (!target) {
      return NextResponse.json({ success: false, message: 'Sản phẩm không tồn tại' }, { status: 404 })
    }

    // Phân quyền:
    // Nếu là Admin và chọn xóa vĩnh viễn: Xóa khỏi mảng
    // Nếu là Nhân viên: Chuyển trạng thái sang Đang ẩn (trang_thai = 0)
    if (role === 'admin' && permanent) {
      db.san_pham = products.filter((p) => String(p.id) !== String(id))
      saveDatabase(db)
      return NextResponse.json({
        success: true,
        message: `Quản trị viên đã xóa vĩnh viễn sản phẩm: "${target.ten_san_pham}"`,
        deletedId: id,
        type: 'PERMANENT',
      })
    } else {
      // Ẩn sản phẩm
      target.trang_thai = 0
      target.updated_at = new Date().toISOString()
      saveDatabase(db)
      return NextResponse.json({
        success: true,
        message: `Đã chuyển sản phẩm "${target.ten_san_pham}" sang trạng thái Đang ẩn.`,
        product: target,
        type: 'INACTIVE',
      })
    }
  } catch (error) {
    console.error('Lỗi DELETE admin/products:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
