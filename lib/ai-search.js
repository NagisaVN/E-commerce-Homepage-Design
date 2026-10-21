import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const data = require('../db.json')

// Chuẩn hóa chuỗi tiếng Việt không dấu để so khớp linh hoạt
export function removeVietnameseTones(str) {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

/**
 * Bộ phân tích Ý định tự nhiên (Natural Language Intent Parser)
 * Trích xuất: Danh mục, Thương hiệu, Ngân sách, Nhu cầu gia đình/phòng, Tính năng
 */
export function parseUserQuery(query) {
  const raw = (query || '').trim()
  const normalized = removeVietnameseTones(raw)

  const parsed = {
    rawQuery: raw,
    normalizedQuery: normalized,
    category: null,
    categoryName: null,
    brand: null,
    brandName: null,
    minPrice: null,
    maxPrice: null,
    priceNote: null,
    familySize: null,
    roomSize: null,
    features: [],
    keywords: [],
  }

  // 1. Phân tích Danh mục sản phẩm (Categories)
  const categoryRules = [
    { id: 4, name: 'Tủ lạnh', slug: 'tu-lanh', matches: ['tu lanh', 'refrigerator', 'fridge', 'ngan da', 'side by side'] },
    { id: 5, name: 'Máy lạnh', slug: 'may-lanh', matches: ['may lanh', 'dieu hoa', 'may dieu hoa', 'air conditioner', 'ac'] },
    { id: 6, name: 'Máy giặt', slug: 'may-giat', matches: ['may giat', 'giat say', 'may say', 'long ngang', 'long dung', 'cua truoc', 'cua tren'] },
    { id: 7, name: 'Lò vi sóng', slug: 'lo-vi-song', matches: ['lo vi song', 'microwave', 'vi song'] },
    { id: 8, name: 'Nồi cơm điện', slug: 'noi-com-dien', matches: ['noi com', 'noi com dien', 'rice cooker', 'cao tan'] },
    { id: 9, name: 'Quạt điều hòa', slug: 'quat-dieu-hoa', matches: ['quat dieu hoa', 'quat hoi nuoc', 'quat lam mat', 'air cooler'] },
    { id: 10, name: 'Tivi', slug: 'tivi', matches: ['tivi', 'tv', 'smart tv', 'oled', 'qled', '4k'] },
    { id: 11, name: 'Loa thanh', slug: 'loa-thanh', matches: ['loa thanh', 'soundbar', 'loa', 'am thanh'] },
  ]

  for (const cat of categoryRules) {
    if (cat.matches.some(m => normalized.includes(m))) {
      parsed.category = cat.id
      parsed.categoryName = cat.name
      break
    }
  }

  // 2. Phân tích Thương hiệu (Brands)
  const brandRules = [
    { id: 1, name: 'Samsung', matches: ['samsung'] },
    { id: 2, name: 'LG', matches: ['lg'] },
    { id: 3, name: 'Panasonic', matches: ['panasonic', 'pana'] },
    { id: 4, name: 'Sony', matches: ['sony'] },
    { id: 5, name: 'Toshiba', matches: ['toshiba'] },
    { id: 6, name: 'Sharp', matches: ['sharp'] },
    { id: 7, name: 'Aqua', matches: ['aqua'] },
    { id: 8, name: 'Daikin', matches: ['daikin'] },
    { id: 9, name: 'Electrolux', matches: ['electrolux', 'elec'] },
  ]

  for (const br of brandRules) {
    if (br.matches.some(m => new RegExp(`\\b${m}\\b`, 'i').test(normalized))) {
      parsed.brand = br.id
      parsed.brandName = br.name
      break
    }
  }

  // 3. Phân tích Ngân sách / Mức giá (Price Extraction)
  // Mẫu: "dưới 10 triệu", "< 10tr", "10 triệu đổ lại", "nhỏ hơn 8tr"
  const underMatch = normalized.match(/(?:duoi|<|<=|nho hon|tam duoi|toi da|do lai|tro xuong)\s*(\d+(?:[.,]\d+)?)\s*(?:trieu|tr|m\b)/)
  if (underMatch) {
    const val = parseFloat(underMatch[1].replace(',', '.'))
    parsed.maxPrice = val * 1_000_000
    parsed.priceNote = `Dưới ${val} triệu`
  }

  // Mẫu: "trên 15 triệu", "> 10tr", "từ 12 triệu trở lên"
  const overMatch = normalized.match(/(?:tren|>|>=|lon hon|tu)\s*(\d+(?:[.,]\d+)?)\s*(?:trieu|tr|m\b)(?!\s*(?:-|den|toi))/);
  if (overMatch && !parsed.maxPrice) {
    const val = parseFloat(overMatch[1].replace(',', '.'))
    parsed.minPrice = val * 1_000_000
    parsed.priceNote = `Trên ${val} triệu`
  }

  // Mẫu: "từ 5 đến 10 triệu", "5-10 triệu", "khoảng 7-8 tr"
  const rangeMatch = normalized.match(/(?:tu|tam|khoang)?\s*(\d+(?:[.,]\d+)?)\s*(?:-|den|toi)\s*(\d+(?:[.,]\d+)?)\s*(?:trieu|tr|m\b)/)
  if (rangeMatch) {
    const minVal = parseFloat(rangeMatch[1].replace(',', '.'))
    const maxVal = parseFloat(rangeMatch[2].replace(',', '.'))
    parsed.minPrice = minVal * 1_000_000
    parsed.maxPrice = maxVal * 1_000_000
    parsed.priceNote = `Từ ${minVal} - ${maxVal} triệu`
  }

  // Mẫu: "khoảng 10 triệu", "tầm 10tr" (dao động ±20%)
  if (!parsed.minPrice && !parsed.maxPrice) {
    const approxMatch = normalized.match(/(?:khoang|tam|co|quanh)\s*(\d+(?:[.,]\d+)?)\s*(?:trieu|tr|m\b)/)
    if (approxMatch) {
      const val = parseFloat(approxMatch[1].replace(',', '.'))
      parsed.minPrice = val * 0.8 * 1_000_000
      parsed.maxPrice = val * 1.2 * 1_000_000
      parsed.priceNote = `Khoảng ${val} triệu (±20%)`
    }
  }

  // 3.5 Phân khúc giá rẻ / cao cấp
  const isCheapQuery = normalized.includes('gia re') || normalized.includes('tiet kiem chi phi') || normalized.includes('sinh vien') || normalized.includes('re nhat') || normalized.includes('binh dan') || normalized.includes('gia tot') || normalized.includes('gia mem')
  if (isCheapQuery) {
    parsed.isCheap = true
    parsed.features.push('Phân khúc giá rẻ / tiết kiệm')
    if (!parsed.priceNote) parsed.priceNote = 'Ưu tiên giá rẻ'
  }

  if (normalized.includes('cao cap') || normalized.includes('sang trong') || normalized.includes('flagship')) {
    parsed.isPremium = true
    parsed.features.push('Phân khúc cao cấp')
    if (!parsed.minPrice) parsed.minPrice = 15_000_000
    if (!parsed.priceNote) parsed.priceNote = 'Phân khúc cao cấp'
  }

  // 4. Phân tích Quy mô gia đình (Family Size)
  const familyMatch = normalized.match(/(?:gia dinh|nha)?\s*(\d+)\s*(?:nguoi|thanh vien)/)
  if (familyMatch) {
    parsed.familySize = parseInt(familyMatch[1], 10)
  } else if (normalized.includes('doc than') || normalized.includes('2 nguoi') || normalized.includes('vo chong')) {
    parsed.familySize = 2
  } else if (normalized.includes('dong nguoi') || normalized.includes('nhieu the he')) {
    parsed.familySize = 6
  }

  // 5. Phân tích Diện tích phòng (Room Size / BTU / HP)
  const roomMatch = normalized.match(/(\d+)\s*(?:m2|met vuong)/)
  if (roomMatch) {
    parsed.roomSize = parseInt(roomMatch[1], 10)
  } else if (normalized.includes('phong ngu') || normalized.includes('phong nho')) {
    parsed.roomSize = 15
  } else if (normalized.includes('phong khach') || normalized.includes('phong rong')) {
    parsed.roomSize = 30
  }

  // 6. Phân tích Tính năng công nghệ (Features)
  if (normalized.includes('inverter') || normalized.includes('tiet kiem dien')) {
    parsed.features.push('Inverter tiết kiệm điện')
  }
  if (normalized.includes('diet khuan') || normalized.includes('nanoe') || normalized.includes('plasmaster') || normalized.includes('ion')) {
    parsed.features.push('Kháng khuẩn & Khử mùi')
  }
  if (normalized.includes('chong on') || normalized.includes('chay em') || normalized.includes('em ai')) {
    parsed.features.push('Vận hành siêu êm')
  }
  if (normalized.includes('thong minh') || normalized.includes('smart') || normalized.includes('wifi') || normalized.includes('dien thoai')) {
    parsed.features.push('Điều khiển thông minh / Wifi')
  }
  if (normalized.includes('ngan dong mem') || normalized.includes('dong mem')) {
    parsed.features.push('Ngăn đông mềm')
  }
  if (normalized.includes('cua truoc') || normalized.includes('long ngang')) {
    parsed.features.push('Cửa trước (Lồng ngang)')
  }

  return parsed
}

/**
 * Tính điểm tương thích AI cho từng sản phẩm (AI Relevance Scoring)
 */
export function scoreProduct(product, chiTiet, parsed) {
  let score = 0
  const reasons = []

  const prodNameNorm = removeVietnameseTones(product.ten_san_pham || '')
  const prodDescNorm = removeVietnameseTones(product.mo_ta_ngan || '')
  const ctDescNorm = removeVietnameseTones(chiTiet?.mo_ta_chi_tiet || '')
  const allSpecsText = chiTiet?.thong_so_ky_thuat ? JSON.stringify(chiTiet.thong_so_ky_thuat).toLowerCase() : ''
  const allSpecsNorm = removeVietnameseTones(allSpecsText)

  // 1. Khớp Danh mục (Category match)
  if (parsed.category) {
    if (product.id_danh_muc === parsed.category) {
      score += 50
      reasons.push(`Đúng danh mục ${parsed.categoryName}`)
    } else {
      // Sai danh mục yêu cầu: giảm điểm rất nặng
      score -= 100
      return { score: 0, reasons: [] }
    }
  }

  // 2. Khớp Thương hiệu (Brand match)
  if (parsed.brand) {
    if (product.id_thuong_hieu === parsed.brand) {
      score += 35
      reasons.push(`Thương hiệu chính hãng ${parsed.brandName}`)
    } else {
      score -= 15
    }
  }

  // 3. Khớp Ngân sách & Giá bán (Price match)
  const price = Number(product.gia) || 0
  const original = Number(product.gia_goc) || price
  const discountAmount = original > price ? original - price : 0
  const discountPct = original > price ? Math.round((discountAmount / original) * 100) : 0

  if (parsed.isCheap) {
    // Với nhu cầu "giá rẻ": giá càng thấp thì điểm càng cao
    if (price <= 3_500_000) {
      score += 65
      reasons.push(`Giá cực rẻ, siêu tiết kiệm (${price.toLocaleString('vi-VN')}₫)`)
    } else if (price <= 6_000_000) {
      score += 45
      reasons.push(`Mức giá bình dân, dễ tiếp cận (${price.toLocaleString('vi-VN')}₫)`)
    } else if (price <= 9_000_000) {
      score += 25
      reasons.push(`Mức giá hợp lý (${price.toLocaleString('vi-VN')}₫)`)
    } else {
      score -= 50
    }
  } else if (parsed.maxPrice) {
    if (price <= parsed.maxPrice) {
      score += 40
      reasons.push(`Phù hợp ngân sách (dưới ${(parsed.maxPrice / 1_000_000).toLocaleString('vi-VN')} triệu)`)
    } else if (price <= parsed.maxPrice * 1.1) {
      // Vượt nhẹ dưới 10%
      score += 10
      reasons.push(`Hơi vượt ngân sách nhẹ (${Math.round((price - parsed.maxPrice) / 1000)}k)`)
    } else {
      score -= 60
    }
  }

  if (parsed.minPrice) {
    if (price >= parsed.minPrice) {
      score += 25
      reasons.push(`Thuộc phân khúc cao cấp (${price.toLocaleString('vi-VN')}₫)`)
    } else {
      score -= 30
    }
  }

  // Thêm lý do giảm giá từ GIÁ GỐC (nếu sản phẩm đang sale thực sự so với giá niêm yết)
  if (discountAmount >= 500_000 && discountPct >= 15) {
    score += 15
    reasons.push(`Đang giảm ${discountPct}% (tiết kiệm ${discountAmount.toLocaleString('vi-VN')}₫ so với giá gốc)`)
  }

  // 4. Khớp Quy mô gia đình & Dung tích (Family Size)
  if (parsed.familySize) {
    // Với Tủ lạnh
    if (parsed.category === 4 || prodNameNorm.includes('tu lanh')) {
      const capMatch = allSpecsNorm.match(/(\d+)\s*lit/)
      const capacity = capMatch ? parseInt(capMatch[1], 10) : 0

      if (parsed.familySize >= 4) {
        if (capacity >= 350 || allSpecsNorm.includes('side by side') || allSpecsNorm.includes('4 cua')) {
          score += 30
          reasons.push(`Dung tích ${capacity ? capacity + 'L ' : ''}rất rộng rãi cho ${parsed.familySize} người`)
        } else if (capacity >= 280) {
          score += 20
          reasons.push(`Dung tích ${capacity}L vừa vặn cho ${parsed.familySize} người`)
        } else if (capacity > 0 && capacity < 250) {
          score -= 20
        }
      } else {
        if (capacity > 0 && capacity <= 300) {
          score += 25
          reasons.push(`Dung tích ${capacity}L nhỏ gọn, tiết kiệm điện`)
        }
      }
    }

    // Với Máy giặt
    if (parsed.category === 6 || prodNameNorm.includes('may giat')) {
      const kgMatch = allSpecsNorm.match(/(\d+(?:\.\d+)?)\s*kg/)
      const kg = kgMatch ? parseFloat(kgMatch[1]) : 0
      if (parsed.familySize >= 4 && kg >= 9) {
        score += 30
        reasons.push(`Khối lượng giặt ${kg}kg đáp ứng giặt đồ cho cả gia đình`)
      } else if (parsed.familySize <= 2 && kg > 0 && kg <= 8.5) {
        score += 25
        reasons.push(`Khối lượng giặt ${kg}kg tối ưu cho gia đình nhỏ`)
      }
    }
  }

  // 5. Khớp Diện tích phòng (Room Size / Công suất máy lạnh)
  if (parsed.roomSize && (parsed.category === 5 || prodNameNorm.includes('may lanh'))) {
    if (parsed.roomSize <= 15) {
      if (allSpecsNorm.includes('1 hp') || allSpecsNorm.includes('9.000 btu') || allSpecsNorm.includes('9000 btu')) {
        score += 35
        reasons.push('Công suất 1 HP làm lạnh tối ưu cho phòng dưới 15m²')
      }
    } else if (parsed.roomSize <= 22) {
      if (allSpecsNorm.includes('1.5 hp') || allSpecsNorm.includes('12.000 btu') || allSpecsNorm.includes('12000 btu')) {
        score += 35
        reasons.push('Công suất 1.5 HP mạnh mẽ cho phòng 15 - 22m²')
      }
    } else {
      if (allSpecsNorm.includes('2 hp') || allSpecsNorm.includes('18.000 btu') || allSpecsNorm.includes('18000 btu')) {
        score += 35
        reasons.push('Công suất 2 HP làm lạnh cực nhanh cho không gian lớn')
      }
    }
  }

  // 6. Khớp Tính năng đặc biệt (Features)
  for (const feat of parsed.features) {
    if (feat.includes('Inverter')) {
      if (prodNameNorm.includes('inverter') || allSpecsNorm.includes('inverter') || ctDescNorm.includes('inverter')) {
        score += 25
        reasons.push('Công nghệ Inverter tiết kiệm điện đến 60%')
      }
    }
    if (feat.includes('Kháng khuẩn')) {
      if (prodNameNorm.includes('diet khuan') || allSpecsNorm.includes('diet khuan') || ctDescNorm.includes('khang khuan') || ctDescNorm.includes('ion')) {
        score += 25
        reasons.push('Công nghệ diệt khuẩn ion/nanoe bảo vệ sức khỏe')
      }
    }
    if (feat.includes('Ngăn đông mềm')) {
      if (allSpecsNorm.includes('ngan dong mem') || ctDescNorm.includes('dong mem')) {
        score += 25
        reasons.push('Có ngăn đông mềm nấu ăn ngay không cần rã đông')
      }
    }
    if (feat.includes('Cửa trước')) {
      if (allSpecsNorm.includes('cua truoc') || allSpecsNorm.includes('long ngang') || ctDescNorm.includes('long ngang')) {
        score += 25
        reasons.push('Thiết kế cửa trước (lồng ngang) bảo vệ sợi vải')
      }
    }
  }

  // 7. Điểm thưởng Rating và Sản phẩm nổi bật
  if (Number(product.noi_bat) === 1) score += 10
  if (Number(product.rating) >= 4.5) score += 10

  // Đảm bảo không âm điểm
  const finalScore = Math.max(0, score)
  // Quy đổi match rate thành phần trăm từ 60% đến 99%
  const matchPercent = Math.min(99, Math.max(65, Math.round(55 + (finalScore / 200) * 44)))

  return {
    score: finalScore,
    matchPercent,
    reasons: [...new Set(reasons)].slice(0, 3),
  }
}

/**
 * Trình tạo văn bản tư vấn AI (AI Advice & Consultation Synthesizer)
 */
export function generateAiAdvice(parsed, matchedProducts) {
  if (matchedProducts.length === 0) {
    return {
      summary: `AI đã rà soát 100 sản phẩm trong hệ thống nhưng chưa tìm thấy thiết bị nào khớp hoàn toàn với tiêu chí "${parsed.rawQuery}".`,
      advice: 'Gợi ý: Bạn có thể thử nới rộng ngân sách hoặc tìm kiếm theo danh mục chính (ví dụ: "Tủ lạnh Inverter", "Máy lạnh 1.5 HP").',
      criteriaTags: [],
    }
  }

  const tags = []
  if (parsed.categoryName) tags.push(`🎯 Danh mục: ${parsed.categoryName}`)
  if (parsed.brandName) tags.push(`🏷️ Thương hiệu: ${parsed.brandName}`)
  if (parsed.priceNote) tags.push(`💰 Ngân sách: ${parsed.priceNote}`)
  if (parsed.familySize) tags.push(`👨‍👩‍👧‍👦 Gia đình: ${parsed.familySize} người`)
  if (parsed.roomSize) tags.push(`📐 Phòng: ~${parsed.roomSize}m²`)
  parsed.features.forEach(f => tags.push(`✨ ${f}`))

  const bestProduct = matchedProducts[0]

  let summary = `Dựa trên phân tích yêu cầu của bạn, TechZone AI đã tìm thấy **${matchedProducts.length} sản phẩm** tối ưu nhất.`
  if (parsed.isCheap) {
    summary = `TechZone AI đã chọn lọc **${matchedProducts.length} sản phẩm có mức giá tốt nhất** trong kho hàng, đáp ứng tiêu chí tiết kiệm chi phí nhưng vẫn đảm bảo độ bền và bảo hành chính hãng.`
  } else if (parsed.categoryName && parsed.priceNote) {
    summary += ` Các mẫu ${parsed.categoryName.toLowerCase()} này đều đảm bảo mức giá **${parsed.priceNote.toLowerCase()}** kèm chính sách bảo hành chính hãng từ 24 tháng.`
  }

  let advice = ''
  if (parsed.isCheap) {
    advice = `💡 **Mẹo chuyên gia:** Sản phẩm có mức giá mềm nhất là **${bestProduct.name}** (${bestProduct.price.toLocaleString('vi-VN')}₫). Dù thuộc phân khúc giá rẻ nhưng thiết bị vẫn sở hữu công nghệ Inverter và bảo hành đầy đủ.`
  } else if (parsed.familySize && (parsed.category === 4 || parsed.categoryName === 'Tủ lạnh')) {
    advice = `💡 **Mẹo chuyên gia:** Với gia đình ${parsed.familySize} người, lựa chọn hàng đầu là **${bestProduct.name}** nhờ dung tích rộng rãi và công nghệ Inverter duy trì nhiệt độ ổn định, tiết kiệm đáng kể chi phí điện hàng tháng.`
  } else if (parsed.roomSize && (parsed.category === 5 || parsed.categoryName === 'Máy lạnh')) {
    advice = `💡 **Mẹo chuyên gia:** Với diện tích khoảng ${parsed.roomSize}m², bạn nên chọn máy có công suất phù hợp để tránh máy phải chạy quá tải gây tốn điện và nhanh hỏng.`
  } else {
    advice = `💡 **Mẹo chuyên gia:** Sản phẩm nổi bật nhất là **${bestProduct.name}** được đánh giá ${bestProduct.rating}⭐ với tỉ lệ phản hồi tích cực cao từ người dùng thực tế.`
  }

  return { summary, advice, criteriaTags: tags }
}

/**
 * Gọi Gemini API nếu có cấu hình GEMINI_API_KEY
 */
async function callGeminiIfAvailable(query, topCandidates) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || topCandidates.length === 0) return null

  try {
    const candidatesCatalog = topCandidates.slice(0, 5).map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      rating: p.rating,
      features: p.features,
    }))

    const prompt = `Bạn là chuyên gia tư vấn điện máy của TechZone Việt Nam.
Khách hàng tìm kiếm: "${query}".
Dưới đây là danh sách sản phẩm tiềm năng trong kho:
${JSON.stringify(candidatesCatalog, null, 2)}

Hãy phân tích và trả về định dạng JSON thuần túy (không markdown codeblock) theo cấu trúc sau:
{
  "summary": "1-2 câu tóm tắt phân tích nhu cầu và ngân sách của khách",
  "advice": "Lời khuyên mua sắm chuyên sâu và gợi ý sản phẩm phù hợp nhất",
  "recommendedIds": [danh sách id sản phẩm tốt nhất theo thứ tự]
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    )

    if (!response.ok) return null
    const resData = await response.json()
    const content = resData.candidates?.[0]?.content?.parts?.[0]?.text
    if (content) {
      return JSON.parse(content)
    }
  } catch (error) {
    console.warn('Gemini API call skipped or failed, falling back to local NLP engine:', error?.message)
  }
  return null
}

/**
 * Hàm điều phối chính (Main Execution Function)
 */
export async function runAiSearch(query) {
  if (!query || !query.trim()) {
    return {
      success: true,
      query: '',
      total: 0,
      summary: 'Vui lòng nhập câu hỏi hoặc mô tả nhu cầu để TechZone AI hỗ trợ bạn.',
      advice: 'Ví dụ: "Tìm tủ lạnh cho gia đình 4 người dưới 10 triệu" hoặc "Máy lạnh Inverter phòng 15m2"',
      criteriaTags: [],
      products: [],
    }
  }

  // 1. Phân tích ý định ngôn ngữ tự nhiên
  const parsed = parseUserQuery(query)

  // 2. Lấy dữ liệu sản phẩm và chi tiết
  const products = data.san_pham ?? []
  const chiTietList = data.chi_tiet_san_pham ?? []
  const brands = data.thuong_hieu ?? []
  const categories = data.danh_muc_san_pham ?? []

  const brandById = new Map(brands.map(b => [Number(b.id), b.ten.trim()]))
  const categoryById = new Map(categories.map(c => [Number(c.id), c.ten.trim()]))
  const chiTietBySpId = new Map(chiTietList.map(c => [Number(c.id_san_pham), c]))

  // 3. Chấm điểm tương thích AI cho từng sản phẩm
  const scoredProducts = []
  for (const product of products) {
    if (Number(product.trang_thai) !== 1) continue
    const chiTiet = chiTietBySpId.get(Number(product.id)) || null
    const { score, matchPercent, reasons } = scoreProduct(product, chiTiet, parsed)

    if (score > 0) {
      const price = Number(product.gia) || 0
      const original = Number(product.gia_goc) || price
      const discount = original > price ? Math.round(((original - price) / original) * 100) : 0

      scoredProducts.push({
        id: product.id,
        slug: product.slug?.trim(),
        name: product.ten_san_pham.trim(),
        brand: brandById.get(Number(product.id_thuong_hieu)) ?? 'Thương hiệu',
        category: categoryById.get(Number(product.id_danh_muc)) ?? 'Sản phẩm',
        price,
        original,
        discount,
        rating: Number(product.rating) || 4.5,
        reviews: Number(product.so_lan_xem) || 0,
        image: product.hinh_chinh?.trim(),
        aiScore: score,
        aiMatchPercent: matchPercent,
        aiReasons: reasons,
        specs: chiTiet?.thong_so_ky_thuat || {},
      })
    }
  }

  // Sắp xếp theo điểm tương thích AI cao nhất
  scoredProducts.sort((a, b) => b.aiScore - a.aiScore)
  const topProducts = scoredProducts.slice(0, 8)

  // 4. Sinh lời khuyên và phân tích AI
  let { summary, advice, criteriaTags } = generateAiAdvice(parsed, topProducts)

  // 5. Nếu có Gemini API Key, thử làm giàu kết quả bằng LLM
  const geminiResult = await callGeminiIfAvailable(query, topProducts)
  if (geminiResult) {
    if (geminiResult.summary) summary = geminiResult.summary
    if (geminiResult.advice) advice = geminiResult.advice
  }

  return {
    success: true,
    query,
    total: topProducts.length,
    summary,
    advice,
    criteriaTags,
    products: topProducts,
  }
}
