import { NextResponse } from 'next/server';
// Import trực tiếp file db.json từ thư mục gốc
import data from '../../../db.json';

export async function GET() {
    try {
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Không thể đọc dữ liệu' }, { status: 500 });
    }
}