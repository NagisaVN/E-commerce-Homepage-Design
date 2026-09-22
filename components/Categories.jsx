'use client'

const categories = [
  {
    name: 'Tủ lạnh',
    count: '240+ mẫu',
    bg: '#EFF6FF',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="#1D4ED8" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="8" y="3" width="16" height="27" rx="3" />
        <line x1="8" y1="13" x2="24" y2="13" />
        <line x1="12" y1="8" x2="12" y2="11" />
        <line x1="12" y1="17" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    name: 'Máy Lạnh',
    count: '180+ mẫu',
    bg: '#E0F2FE',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="#0369A1" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="3" y="8" width="26" height="10" rx="3" />
        <path d="M8 18v6M13 18v4M19 18v4M24 18v6" />
        <path d="M7 13h18" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    name: 'Máy Giặt',
    count: '120+ mẫu',
    bg: '#EFF6FF',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="#1D4ED8" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="4" y="3" width="24" height="27" rx="3" />
        <circle cx="16" cy="19" r="6" />
        <circle cx="16" cy="19" r="2.5" />
        <circle cx="9" cy="8" r="1.5" fill="#1D4ED8" stroke="none" />
        <circle cx="14" cy="8" r="1.5" fill="#60A5FA" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Lò Vi Sóng',
    count: '95+ mẫu',
    bg: '#F0F9FF',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="#0284C7" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="2" y="7" width="28" height="18" rx="3" />
        <rect x="5" y="10" width="17" height="12" rx="2" />
        <circle cx="26" cy="14" r="1.2" fill="#0284C7" stroke="none" />
        <circle cx="26" cy="18" r="1.2" fill="#0284C7" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Máy Rửa Chén',
    count: '60+ mẫu',
    bg: '#EFF6FF',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="#1D4ED8" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="5" y="3" width="22" height="27" rx="3" />
        <line x1="5" y1="10" x2="27" y2="10" />
        <circle cx="16" cy="20" r="5" />
        <path d="M16 15v10M11 20h10" strokeWidth={1.2} />
        <circle cx="10" cy="7" r="1.5" fill="#1D4ED8" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Máy Nước Nóng',
    count: '80+ mẫu',
    bg: '#FFF7ED',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="#C2410C" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="9" y="4" width="14" height="22" rx="7" />
        <path d="M13 28h6" />
        <path d="M16 12v4" strokeWidth={2} stroke="#F97316" />
        <circle cx="16" cy="18" r="2" fill="#FED7AA" stroke="#C2410C" strokeWidth={1.5} />
        <path d="M8 8c-2 2-2 6 0 8" strokeWidth={1.4} />
        <path d="M24 8c2 2 2 6 0 8" strokeWidth={1.4} />
      </svg>
    ),
  },
  {
    name: 'Loa Thanh',
    count: '50+ mẫu',
    bg: '#FFF7ED',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="#C2410C" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="4" y="6" width="24" height="20" rx="3" />
        <rect x="6" y="15" width="20" height="6" rx="1.5" />
        <circle cx="16" cy="9" r="3.5" />
        <circle cx="9" cy="27.5" r="1.5" fill="#C2410C" stroke="none" />
        <circle cx="23" cy="27.5" r="1.5" fill="#C2410C" stroke="none" />
      </svg>
    )
  },
]

export default function Categories() {
  return (
    <section className="py-14 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand text-sm font-semibold font-display uppercase tracking-widest mb-1">Khám phá</p>
            <h2 className="text-3xl font-display font-bold text-gray-900">Danh Mục Sản Phẩm</h2>
          </div>
          <a href="#" className="text-sm text-brand font-medium hover:underline font-body hidden sm:block">
            Xem tất cả danh mục →
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-8">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="group flex flex-col items-center gap-3.5 cursor-pointer"
            >
              <div
                className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-[0_12px_28px_rgba(37,99,235,0.24)]"
                style={{ backgroundColor: cat.bg }}
              >
                {cat.icon}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold font-display text-gray-800 group-hover:text-brand transition-colors leading-tight">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-400 font-body mt-0.5">{cat.count}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
