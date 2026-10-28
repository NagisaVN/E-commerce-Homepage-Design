import { NextResponse } from 'next/server'
import { readDatabase, saveDatabase, toSlug } from '../../../../lib/db'

export async function GET() {
  try {
    const db = readDatabase()
    return NextResponse.json({
      success: true,
      brands: db.thuong_hieu || [],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { ten, slug, logo_url, mo_ta, thu_tu_hien_thi, trang_thai = 1 } = body

    if (!ten?.trim()) {
      return NextResponse.json({ success: false, message: 'Tên thương hiệu là bắt buộc!' }, { status: 400 })
    }

    const db = readDatabase()
    const brands = db.thuong_hieu || []

    const maxId = brands.reduce((max, b) => (Number(b.id) > max ? Number(b.id) : max), 0)
    const newId = maxId + 1

    const newBrand = {
      id: newId,
      ten: ten.trim(),
      ten_thuong_hieu: ten.trim(),
      slug: slug?.trim() || toSlug(ten),
      logo_url: logo_url?.trim() || '',
      mo_ta: mo_ta?.trim() || 'Thương hiệu phân phối chính hãng tại TechZone.',
      thu_tu_hien_thi: Number(thu_tu_hien_thi) || newId,
      trang_thai: Number(trang_thai) === 0 ? 0 : 1,
      created_at: new Date().toISOString(),
    }

    db.thuong_hieu = [...brands, newBrand]
    saveDatabase(db)

    return NextResponse.json({
      success: true,
      message: 'Thêm thương hiệu mới thành công!',
      brand: newBrand,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ten, slug, logo_url, mo_ta, thu_tu_hien_thi, trang_thai } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID thương hiệu' }, { status: 400 })
    }

    const db = readDatabase()
    const brands = db.thuong_hieu || []

    const index = brands.findIndex((b) => String(b.id) === String(id))
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Thương hiệu không tồn tại' }, { status: 404 })
    }

    const current = brands[index]
    const updated = {
      ...current,
      ten: ten !== undefined ? ten.trim() : current.ten,
      ten_thuong_hieu: ten !== undefined ? ten.trim() : (current.ten_thuong_hieu || current.ten),
      slug: slug !== undefined ? slug.trim() : current.slug,
      logo_url: logo_url !== undefined ? logo_url.trim() : current.logo_url,
      mo_ta: mo_ta !== undefined ? mo_ta.trim() : current.mo_ta,
      thu_tu_hien_thi: thu_tu_hien_thi !== undefined ? Number(thu_tu_hien_thi) : current.thu_tu_hien_thi,
      trang_thai: trang_thai !== undefined ? Number(trang_thai) : current.trang_thai,
      updated_at: new Date().toISOString(),
    }

    brands[index] = updated
    db.thuong_hieu = brands
    saveDatabase(db)

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thương hiệu thành công!',
      brand: updated,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const role = searchParams.get('role') || 'staff'

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID thương hiệu' }, { status: 400 })
    }

    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Chỉ Quản trị viên (Admin) mới có quyền xóa thương hiệu!' },
        { status: 403 }
      )
    }

    const db = readDatabase()
    let brands = db.thuong_hieu || []
    const products = db.san_pham || []

    const hasProducts = products.some((p) => String(p.id_thuong_hieu) === String(id))
    if (hasProducts) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không thể xóa thương hiệu này vì vẫn còn sản phẩm liên kết.',
        },
        { status: 400 }
      )
    }

    const target = brands.find((b) => String(b.id) === String(id))
    db.thuong_hieu = brands.filter((b) => String(b.id) !== String(id))
    saveDatabase(db)

    return NextResponse.json({
      success: true,
      message: `Đã xóa thương hiệu "${target?.ten || id}" thành công!`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
