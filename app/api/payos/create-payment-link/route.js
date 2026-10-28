import { NextResponse } from 'next/server'
import { createPayOSPaymentLink, isPayOSConfigured } from '../../../../lib/payos'

export async function POST(request) {
  try {
    const body = await request.json()
    const { orderCode, amount, items = [], description = '' } = body

    if (!orderCode || !amount) {
      return NextResponse.json(
        { success: false, message: 'Thiếu orderCode hoặc amount' },
        { status: 400 }
      )
    }

    const host = request.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const origin = `${protocol}://${host}`

    const returnUrl = `${origin}/don-hang/theo-doi?code=${orderCode}&success=true&status=PAID`
    const cancelUrl = `${origin}/thanh-toan?code=${orderCode}&status=CANCELLED`

    const payosResult = await createPayOSPaymentLink({
      orderCode,
      amount,
      description: description || orderCode,
      items,
      returnUrl,
      cancelUrl,
    })

    return NextResponse.json({
      success: true,
      data: payosResult,
      isConfigured: isPayOSConfigured(),
    })
  } catch (error) {
    console.error('Lỗi API create-payment-link:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Không thể tạo link thanh toán PayOS' },
      { status: 500 }
    )
  }
}
