'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

const product = {
  name: 'Samsung Inverter 208L Refrigerator',
  sku: 'SAM-RT20T3021S2',
  price: 299,
  original: 449,
  discount: 33,
  rating: 4.6,
  reviews: 2847,
  brand: 'Samsung',
}

const images = [
  'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=900&h=900&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=300&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format',
]

const ratingBreakdown = [
  { stars: 5, pct: 68 },
  { stars: 4, pct: 21 },
  { stars: 3, pct: 7 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 2 },
]

const specs = [
  { attr: 'Capacity', value: '208 Liters' },
  {
    attr: 'Technology',
    value: 'Digital Inverter',
    explain:
      'Digital Inverter adjusts compressor speed continuously based on cooling demand — saving up to 46% more energy than fixed-speed compressors and running significantly quieter (no on/off cycling noise).',
  },
  { attr: 'Compressor Type', value: 'Variable Speed' },
  {
    attr: 'Refrigerant Gas',
    value: 'R32',
    explain:
      "R32 is a next-generation eco-refrigerant with a Global Warming Potential (GWP) of 675 — about 2.5× lower than the older R410A. It's more energy-efficient and easier to recover at end-of-life.",
  },
  { attr: 'Energy Consumption', value: '115 kWh / year' },
  { attr: 'Energy Star Rating', value: '5-Star (A++)' },
  { attr: 'Noise Level', value: '38 dB (A)' },
  { attr: 'Defrost System', value: 'No Frost — Full Fan Cooled' },
  { attr: 'Number of Doors', value: '2 Doors (Top Freezer)' },
  { attr: 'Color / Finish', value: 'Elegant Inox (Silver Steel)' },
  { attr: 'Dimensions (H × W × D)', value: '1375 × 545 × 600 mm' },
  { attr: 'Net Weight', value: '48 kg' },
  {
    attr: 'Stabilizer Free Operation',
    value: '100V – 300V',
    explain:
      'This fridge operates safely without an external voltage stabilizer across a wide voltage range (100–300V), protecting the compressor during power fluctuations common in many regions.',
  },
  { attr: 'Shelf Material', value: 'Tempered Glass (Spill-Proof)' },
]

const descriptionHTML = `
<h3>Stay Fresh, Stay Smart</h3>
<p>The <strong>Samsung Inverter 208L Refrigerator</strong> brings digital precision to everyday freshness. Engineered for families who want reliable, energy-efficient cooling without compromise, this top-freezer refrigerator features Samsung's signature Digital Inverter compressor.</p>
<h3>Key Features</h3>
<ul>
  <li><strong>Digital Inverter Compressor</strong> — Runs quieter, lasts longer, and consumes up to 46% less energy. Backed by a 10-year warranty on the compressor.</li>
  <li><strong>No Frost Technology</strong> — Eliminates frost build-up automatically so you never need to manually defrost.</li>
  <li><strong>Eco-Friendly R32 Refrigerant</strong> — Lower Global Warming Potential, better for the environment.</li>
  <li><strong>Stabilizer-Free Operation</strong> — Works safely across 100V–300V voltage range without an external stabilizer.</li>
  <li><strong>Tempered Glass Shelves</strong> — Spill-proof shelves support up to 100 kg combined load.</li>
</ul>
<h3>What's in the Box</h3>
<ul>
  <li>1× Samsung RT20T3021S2 Refrigerator</li>
  <li>2× Adjustable door bins</li>
  <li>1× Vegetable crisper drawer</li>
  <li>User manual & warranty card</li>
</ul>
<h3>Warranty</h3>
<p>1-year comprehensive warranty + <strong>10-year warranty on the Digital Inverter compressor</strong>. Free installation within 3 business days of delivery.</p>
`

function StarRow({ filled, half }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} viewBox="0 0 14 14" className="w-3.5 h-3.5">
          {i <= filled ? (
            <path d="M7 1l1.5 4h4.3l-3.5 2.5 1.3 4L7 9.3l-3.5 2.2 1.3-4L1.2 5h4.3z" fill="#FBBF24" />
          ) : half && i === filled + 1 ? (
            <>
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="50%" stopColor="#E5E7EB" />
                </linearGradient>
              </defs>
              <path d="M7 1l1.5 4h4.3l-3.5 2.5 1.3 4L7 9.3l-3.5 2.2 1.3-4L1.2 5h4.3z" fill="url(#half)" />
            </>
          ) : (
            <path d="M7 1l1.5 4h4.3l-3.5 2.5 1.3 4L7 9.3l-3.5 2.2 1.3-4L1.2 5h4.3z" fill="#E5E7EB" />
          )}
        </svg>
      ))}
    </div>
  )
}

function AiExplainButton({ text }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="ml-1.5 inline-flex items-center gap-1 bg-brand-pale border border-brand-light text-brand text-[11px] font-semibold font-display px-2 py-0.5 rounded-full hover:bg-brand-light transition-colors"
      >
        <svg viewBox="0 0 14 14" className="w-3 h-3" fill="none">
          <path d="M7 1.5l1 3h3l-2.4 1.8.9 2.7-2.5-1.8-2.5 1.8.9-2.7L3 4.5h3z" fill="#1D4ED8" />
          <circle cx="11" cy="2.5" r="1" fill="#60A5FA" />
        </svg>
        AI Explain
      </button>

      {open && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl shadow-blue-100 border border-brand-light p-4">
          <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white border-r border-b border-brand-light rotate-45" />
          <div className="flex items-start gap-2.5">
            <div className="flex-shrink-0 w-7 h-7 bg-brand-light rounded-lg flex items-center justify-center mt-0.5">
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                <path d="M8 1.5l1.2 3.6H13l-2.9 2.1 1.1 3.4L8 8.8l-3.2 1.8 1.1-3.4L3 5.1h3.8z" fill="#1D4ED8" />
                <circle cx="13" cy="3" r="1.2" fill="#60A5FA" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-brand-dark font-display mb-1.5">AI Explanation</p>
              <p className="text-xs text-gray-600 font-body leading-relaxed">{text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SamsungLogo() {
  return (
    <svg viewBox="0 0 110 30" className="h-6 w-auto">
      <text x="2" y="24" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="24" fill="#1428A0">Samsung</text>
    </svg>
  )
}

export default function ProductDetail() {
  const { addToCart } = useCart()
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [buyState, setBuyState] = useState('idle')
  const [cartState, setCartState] = useState('idle')
  const [activeTab, setActiveTab] = useState('specs')

  const handleBuyNow = () => {
    addToCart()
    setBuyState('added')
    setTimeout(() => setBuyState('idle'), 2000)
  }

  const handleAddCart = () => {
    addToCart()
    setCartState('added')
    setTimeout(() => setCartState('idle'), 2000)
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-brand-pale">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3">
          <nav className="flex items-center gap-2 text-xs font-body text-gray-400">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <span>/</span>
            <span className="hover:text-brand cursor-pointer transition-colors">Refrigerators</span>
            <span>/</span>
            <span className="hover:text-brand cursor-pointer transition-colors">Samsung</span>
            <span>/</span>
            <span className="text-gray-600 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* Left: Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-brand text-white text-sm font-bold font-display px-3 py-1.5 rounded-xl shadow-lg">
                -{product.discount}% OFF
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === i
                      ? 'border-brand shadow-md shadow-blue-100 scale-95'
                      : 'border-gray-100 hover:border-brand-accent hover:scale-95'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { icon: '🚚', label: 'Free Delivery', sub: 'Within 3 days' },
                { icon: '🛡️', label: '2-Year Warranty', sub: '+ 10yr compressor' },
                { icon: '↩️', label: '30-Day Returns', sub: 'Hassle-free' },
              ].map(b => (
                <div key={b.label} className="bg-brand-pale rounded-xl p-3 text-center border border-brand-light">
                  <div className="text-xl mb-1">{b.icon}</div>
                  <p className="text-xs font-semibold font-display text-gray-800">{b.label}</p>
                  <p className="text-[11px] text-gray-400 font-body">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product info */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <SamsungLogo />
              <span className="text-xs text-gray-400 font-body bg-gray-50 px-2.5 py-1 rounded-lg">
                SKU: {product.sku}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <StarRow filled={4} half />
                <span className="text-sm font-bold text-amber-500 font-display">{product.rating}</span>
                <span className="text-sm text-gray-400 font-body">({product.reviews.toLocaleString()} reviews)</span>
                <span className="text-xs text-green-600 font-semibold font-display bg-green-50 px-2 py-0.5 rounded-full">
                  ✓ In Stock
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-3 border-y border-gray-100">
              <span className="text-4xl font-display font-bold text-gray-900">${product.price}</span>
              <span className="text-xl text-gray-300 line-through font-body">${product.original}</span>
              <div className="ml-auto flex flex-col items-end">
                <span className="text-green-600 font-bold font-display text-sm">
                  Save ${product.original - product.price}
                </span>
                <span className="text-xs text-gray-400 font-body">Incl. taxes & fees</span>
              </div>
            </div>

            {/* AI Review Summary */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 p-4 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200/30 rounded-full blur-xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 bg-brand rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                      <path d="M8 1.5l1.2 3.6H13l-2.9 2.1 1.1 3.4L8 8.8l-3.2 1.8 1.1-3.4L3 5.1h3.8z" fill="white" />
                      <circle cx="13" cy="3" r="1.2" fill="#93C5FD" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold font-display text-brand-dark">✨ AI Review Summary</p>
                  <span className="ml-auto text-[11px] text-brand bg-white border border-blue-200 px-2 py-0.5 rounded-full font-body">
                    Based on {product.reviews.toLocaleString()} reviews
                  </span>
                </div>

                <p className="text-sm text-gray-700 font-body leading-relaxed mb-3">
                  95% of buyers love the <strong className="text-gray-900">fast cooling feature</strong>, but some mention the{' '}
                  <span className="text-amber-700 font-medium">side panels get slightly warm</span> during heavy use — a normal characteristic of this compressor type.
                </p>

                <div className="flex flex-wrap gap-2 mb-3.5">
                  {[
                    { label: '👍 Fast cooling', color: 'green' },
                    { label: '👍 Whisper quiet', color: 'green' },
                    { label: '👍 Energy saver', color: 'green' },
                    { label: '⚠️ Warm side panels', color: 'amber' },
                  ].map(tag => (
                    <div
                      key={tag.label}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full font-body ${
                        tag.color === 'green'
                          ? 'bg-green-50 border border-green-200 text-green-700'
                          : 'bg-amber-50 border border-amber-200 text-amber-700'
                      }`}
                    >
                      {tag.label}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-body text-gray-400 mb-1">
                    <span>Overall Sentiment</span>
                    <span className="text-green-600 font-semibold">95% Positive</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity + CTA */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 font-body w-16">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold font-display text-gray-900">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-400 font-body">
                  × ${product.price} = <strong className="text-gray-700">${product.price * qty}</strong>
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBuyNow}
                  className={`flex-1 py-3.5 rounded-xl font-display font-bold text-sm transition-all duration-200 active:scale-95 shadow-lg ${
                    buyState === 'added'
                      ? 'bg-green-500 text-white shadow-green-200'
                      : 'bg-brand hover:bg-brand-dark text-white shadow-blue-200'
                  }`}
                >
                  {buyState === 'added' ? '✓ Order Placed!' : '⚡ Buy Now'}
                </button>
                <button
                  onClick={handleAddCart}
                  className={`flex-1 py-3.5 rounded-xl font-display font-semibold text-sm border-2 transition-all duration-200 active:scale-95 ${
                    cartState === 'added'
                      ? 'bg-green-50 border-green-400 text-green-600'
                      : 'bg-white border-brand text-brand hover:bg-brand-pale'
                  }`}
                >
                  {cartState === 'added' ? '✓ Added to Cart' : '🛒 Add to Cart'}
                </button>
              </div>

              <p className="text-xs text-gray-400 font-body text-center">
                Free installation · 30-day returns · Secure checkout
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div className="flex gap-1 border-b border-gray-100 mb-8">
            {[['specs', 'Specifications'], ['description', 'Description'], ['reviews', 'Reviews']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2.5 text-sm font-semibold font-display transition-all ${
                  activeTab === key
                    ? 'text-brand border-b-2 border-brand -mb-px'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'specs' && (
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((row, i) => (
                    <tr key={row.attr} className={`border-b border-gray-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-brand-pale/40'}`}>
                      <td className="px-5 py-3.5 font-medium text-gray-500 font-body w-1/3 align-top">
                        <div className="flex items-center gap-1">
                          {row.attr}
                          {row.explain && <AiExplainButton text={row.explain} />}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800 font-display">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'description' && (
            <div
              className="prose prose-sm max-w-none text-gray-700 font-body leading-relaxed
                [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:text-base [&_h3]:mb-2 [&_h3]:mt-6 [&_h3:first-child]:mt-0
                [&_p]:mb-3 [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:list-disc [&_strong]:text-gray-900"
              dangerouslySetInnerHTML={{ __html: descriptionHTML }}
            />
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-brand-pale rounded-2xl p-6 flex flex-col items-center text-center border border-brand-light">
                <span className="text-6xl font-display font-bold text-gray-900">{product.rating}</span>
                <StarRow filled={4} half />
                <span className="text-sm text-gray-400 font-body mt-1">{product.reviews.toLocaleString()} reviews</span>
                <div className="w-full mt-6 flex flex-col gap-2">
                  {ratingBreakdown.map(r => (
                    <div key={r.stars} className="flex items-center gap-2 text-xs font-body">
                      <span className="text-gray-400 w-4">{r.stars}★</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-gray-400 w-6 text-right">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-4">
                {[
                  {
                    name: 'Nguyen Thi Lan',
                    date: 'Aug 12, 2024',
                    stars: 5,
                    title: 'Cools down incredibly fast!',
                    body: 'Bought this during the Tết sale and absolutely love it. The fridge reached 4°C within 45 minutes of first turning it on. Very quiet — can barely hear it running.',
                  },
                  {
                    name: 'Tran Minh Duc',
                    date: 'Jul 29, 2024',
                    stars: 4,
                    title: 'Great value, minor nitpick',
                    body: 'Solid fridge for the price. Build quality feels premium. The only thing is the right side panel gets warm to the touch — nothing alarming, just noticeable.',
                  },
                  {
                    name: 'Le Phuong Anh',
                    date: 'Jul 5, 2024',
                    stars: 5,
                    title: 'Perfect for our family of 3',
                    body: '208L is just right for our household. The no-frost feature means I never have to deal with ice build-up. My previous fridge was much louder — this one is whisper-quiet even at night.',
                  },
                ].map(r => (
                  <div key={r.name} className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-brand-light transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold font-display text-sm text-gray-900">{r.name}</span>
                          <span className="text-[11px] text-green-600 font-body bg-green-50 px-1.5 py-0.5 rounded-full">✓ Verified</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRow filled={r.stars} />
                          <span className="text-xs text-gray-400 font-body">{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-semibold font-display text-gray-800 mb-1">{r.title}</p>
                    <p className="text-sm text-gray-500 font-body leading-relaxed">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
