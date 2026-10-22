import { NextResponse } from 'next/server';
import data from '../../../db.json';

export async function GET() {
  try {
    // Chỉ bóc tách các trường công khai, loại bỏ thông tin nhạy cảm (nguoi_dung, don_hang)
    const publicData = {
      banner: data.banner ?? [],
      danh_muc_san_pham: data.danh_muc_san_pham ?? [],
      thuong_hieu: data.thuong_hieu ?? [],
      san_pham: (data.san_pham ?? []).map(sp => ({
        id: sp.id,
        ten_san_pham: sp.ten_san_pham,
        slug: sp.slug,
        gia: sp.gia,
        gia_goc: sp.gia_goc,
        hinh_chinh: sp.hinh_chinh,
        noi_bat: sp.noi_bat,
        so_lan_xem: sp.so_lan_xem,
        rating: sp.rating,
        id_danh_muc: sp.id_danh_muc,
        id_thuong_hieu: sp.id_thuong_hieu,
        thong_so: sp.thong_so,
        bao_hanh: sp.bao_hanh,
        trang_thai: sp.trang_thai,
      })),
      bai_viet: data.bai_viet ?? [],
      danh_muc_bai_viet: data.danh_muc_bai_viet ?? [],
    };
    return NextResponse.json(publicData);
  } catch (error) {
    return NextResponse.json({ error: 'Không thể đọc dữ liệu' }, { status: 500 });
  }
}