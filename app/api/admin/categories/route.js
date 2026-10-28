import { NextResponse } from 'next/server'
import { readDatabase, saveDatabase, toSlug } from '../../../../lib/db'

export async function GET() {
  try {
    const db = readDatabase()
    return NextResponse.json({
      success: true,
      categories: db.danh_muc_san_pham || [],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { ten, slug, count = '100+ mẫu', image_url, thu_tu_hien_thi, trang_thai = 1 } = body

    if (!ten?.trim()) {
      return NextResponse.json({ success: false, message: 'Tên danh mục là bắt buộc!' }, { status: 400 })
    }

    const db = readDatabase()
    const categories = db.danh_muc_san_pham || []

    const maxId = categories.reduce((max, c) => (Number(c.id) > max ? Number(c.id) : max), 0)
    const newId = maxId + 1

    const newCategory = {
      id: newId,
      ten: ten.trim(),
      slug: slug?.trim() || toSlug(ten),
      count: count || '100+ mẫu',
      image_url: image_url?.trim() || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200',
      thu_tu_hien_thi: Number(thu_tu_hien_thi) || newId,
      trang_thai: Number(trang_thai) === 0 ? 0 : 1,
      created_at: new Date().toISOString(),
    }

    db.danh_muc_san_pham = [...categories, newCategory]
    saveDatabase(db)

    return NextResponse.json({
      success: true,
      message: 'Thêm danh mục mới thành công!',
      category: newCategory,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ten, slug, count, image_url, thu_tu_hien_thi, trang_thai } = body

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID danh mục' }, { status: 400 })
    }

    const db = readDatabase()
    const categories = db.danh_muc_san_pham || []

    const index = categories.findIndex((c) => String(c.id) === String(id))
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Danh mục không tồn tại' }, { status: 404 })
    }

    const current = categories[index]
    const updated = {
      ...current,
      ten: ten !== undefined ? ten.trim() : current.ten,
      slug: slug !== undefined ? slug.trim() : current.slug,
      count: count !== undefined ? count : current.count,
      image_url: image_url !== undefined ? image_url.trim() : current.image_url,
      thu_tu_hien_thi: thu_tu_hien_thi !== undefined ? Number(thu_tu_hien_thi) : current.thu_tu_hien_thi,
      trang_thai: trang_thai !== undefined ? Number(trang_thai) : current.trang_thai,
      updated_at: new Date().toISOString(),
    }

    categories[index] = updated
    db.danh_muc_san_pham = categories
    saveDatabase(db)

    return NextResponse.json({
      success: true,
      message: 'Cập nhật danh mục thành công!',
      category: updated,
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
      return NextResponse.json({ success: false, message: 'Thiếu ID danh mục' }, { status: 400 })
    }

    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Chỉ Quản trị viên (Admin) mới có quyền xóa vĩnh viễn danh mục!' },
        { status: 403 }
      )
    }

    const db = readDatabase()
    let categories = db.danh_muc_san_pham || []
    const products = db.san_pham || []

    // Kiểm tra xem danh mục có sản phẩm không
    const hasProducts = products.some((p) => String(p.id_danh_muc) === String(id))
    if (hasProducts) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không thể xóa danh mục này vì đang có sản phẩm thuộc danh mục. Vui lòng chuyển sản phẩm sang danh mục khác trước.',
        },
        { status: 400 }
      )
    }

    const target = categories.find((c) => String(c.id) === String(id))
    db.danh_muc_san_pham = categories.filter((c) => String(c.id) !== String(id))
    saveDatabase(db)

    return NextResponse.json({
      success: true,
      message: `Đã xóa danh mục "${target?.ten || id}" thành công!`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
