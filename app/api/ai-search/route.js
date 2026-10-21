import { NextResponse } from 'next/server'
import { runAiSearch } from '../../../lib/ai-search'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    const result = await runAiSearch(query)
    return NextResponse.json(result)
  } catch (error) {
    console.error('AI Search GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể xử lý tìm kiếm AI', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const query = body.query || ''

    const result = await runAiSearch(query)
    return NextResponse.json(result)
  } catch (error) {
    console.error('AI Search POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể xử lý tìm kiếm AI', details: error.message },
      { status: 500 }
    )
  }
}
