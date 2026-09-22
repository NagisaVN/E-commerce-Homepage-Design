const brands = [
  {
    name: 'Samsung',
    tagline: 'SmartThings Ready',
    logo: (
      <svg viewBox="0 0 120 40" className="h-7 w-auto">
        <text x="4" y="30" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="28" fill="#1428A0">Samsung</text>
      </svg>
    ),
  },
  {
    name: 'LG',
    tagline: 'ThinQ AI',
    logo: (
      <svg viewBox="0 0 60 40" className="h-7 w-auto">
        <text x="4" y="30" fontFamily="Outfit, sans-serif" fontWeight="800" fontSize="30" fill="#A50034">LG</text>
      </svg>
    ),
  },
  {
    name: 'Panasonic',
    tagline: 'EcoNavi Tech',
    logo: (
      <svg viewBox="0 0 130 40" className="h-7 w-auto">
        <text x="2" y="29" fontFamily="Outfit, sans-serif" fontWeight="600" fontSize="24" fill="#003087">Panasonic</text>
      </svg>
    ),
  },
  {
    name: 'Sony',
    tagline: 'Precision Pro',
    logo: (
      <svg viewBox="0 0 80 40" className="h-7 w-auto">
        <text x="2" y="30" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="28" fill="#111827">Sony</text>
      </svg>
    ),
  },
  {
    name: 'Bosch',
    tagline: 'Invented for life',
    logo: (
      <svg viewBox="0 0 90 40" className="h-7 w-auto">
        <text x="2" y="30" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="28" fill="#E20015">BOSCH</text>
      </svg>
    ),
  },
  {
    name: 'Hitachi',
    tagline: 'Inspire the Next',
    logo: (
      <svg viewBox="0 0 100 40" className="h-7 w-auto">
        <text x="2" y="28" fontFamily="Outfit, sans-serif" fontWeight="600" fontSize="24" fill="#CC0000">Hitachi</text>
      </svg>
    ),
  },
]

export default function Brands() {

  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await fetch('http://localhost:3001/thuong_hieu')
        const data = await response.json()

        const activeBrands = data
          .filter((b) => Number(b.trang_thai) === 1)
          .sort((a, b) => a.thu_tu_hien_thi - b.thu_tu_hien_thi)

        setBrands(activeBrands)
      } catch (error) {
        console.error('Failed to fetch brands:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-brand-pale border-b border-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-6 mb-8">
            <p className="text-sm font-semibold font-display text-gray-400 uppercase tracking-widest whitespace-nowrap">
              Thương Hiệu Hàng Đầu
            </p>
            <div className="flex-1 h-px bg-brand-light" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl px-4 py-5 flex flex-col items-center gap-2 animate-pulse"
              >
                <div className="h-7 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-12 bg-brand-pale border-b border-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-6 mb-8">
          <p className="text-sm font-semibold font-display text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Thương Hiệu Hàng Đầu
          </p>
          <div className="flex-1 h-px bg-brand-light" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {brands.map((brand) => (
            <button
              key={brand.name}
              className="group bg-white rounded-2xl px-4 py-5 flex flex-col items-center gap-2 border border-transparent hover:border-brand-light hover:shadow-lg hover:shadow-blue-50 transition-all duration-200"
            >
              <div className="h-8 flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity">
                {brand.logo}
              </div>
              <span className="text-xs text-gray-400 font-body group-hover:text-brand transition-colors">
                {brand.tagline}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
