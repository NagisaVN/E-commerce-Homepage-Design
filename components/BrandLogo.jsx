// Component hiển thị logo chữ thương hiệu (Brand Wordmark)
// Tối ưu hóa kích thước nổi bật hơn tên hãng, căn giữa 100% (text-anchor: middle, dominant-baseline: central)
// và overflow-visible để không bao giờ bị lệch hoặc mất chữ.

const BRAND_CONFIGS = {
  Samsung: {
    displayName: 'SAMSUNG',
    className: 'text-[#1428A0] dark:text-blue-400',
    fontWeight: 800,
    fontSize: 28,
    letterSpacing: '0.05em',
  },
  LG: {
    displayName: 'LG',
    className: 'text-[#A50034] dark:text-rose-400',
    fontWeight: 900,
    fontSize: 36,
    letterSpacing: '0.02em',
  },
  Panasonic: {
    displayName: 'Panasonic',
    className: 'text-[#003087] dark:text-blue-400',
    fontWeight: 700,
    fontSize: 26,
    letterSpacing: '-0.01em',
  },
  Sony: {
    displayName: 'SONY',
    className: 'text-[#111827] dark:text-white',
    fontWeight: 800,
    fontSize: 30,
    letterSpacing: '0.08em',
    fontFamily: 'serif',
  },
  Toshiba: {
    displayName: 'TOSHIBA',
    className: 'text-[#FF0000] dark:text-red-400',
    fontWeight: 800,
    fontSize: 27,
    letterSpacing: '0.03em',
  },
  Sharp: {
    displayName: 'SHARP',
    className: 'text-[#BE0028] dark:text-rose-400',
    fontWeight: 800,
    fontSize: 28,
    letterSpacing: '0.05em',
  },
  Aqua: {
    displayName: 'AQUA',
    className: 'text-[#0072CE] dark:text-sky-400',
    fontWeight: 800,
    fontSize: 28,
    letterSpacing: '0.06em',
  },
  Daikin: {
    displayName: 'DAIKIN',
    className: 'text-[#009FE3] dark:text-sky-400',
    fontWeight: 800,
    fontSize: 28,
    letterSpacing: '0.05em',
  },
  Electrolux: {
    displayName: 'Electrolux',
    className: 'text-[#003087] dark:text-blue-300',
    fontWeight: 700,
    fontSize: 25,
    letterSpacing: '-0.01em',
  },
}

export default function BrandLogo({ name, size = 'md', className = '' }) {
  const trimmed = (name || '').trim()
  const config = BRAND_CONFIGS[trimmed] || {
    displayName: trimmed,
    className: 'text-[#374151] dark:text-gray-200',
    fontWeight: 700,
    fontSize: Math.min(28, Math.max(16, Math.floor(180 / (trimmed.length * 0.85 || 1)))),
    letterSpacing: '0.02em',
  }

  // Tăng kích thước chiều cao hiển thị để logo rõ nét và nổi bật hơn tên hãng
  const heightClass = size === 'lg' ? 'h-11 sm:h-13' : size === 'sm' ? 'h-7' : 'h-8 sm:h-9'

  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <svg
        viewBox="0 0 180 40"
        className={`${heightClass} w-auto max-w-full overflow-visible select-none drop-shadow-2xs`}
        fill="none"
        aria-label={config.displayName}
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={config.fontFamily || 'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}
          fontWeight={config.fontWeight}
          fontSize={config.fontSize}
          letterSpacing={config.letterSpacing || 'normal'}
          fill="currentColor"
          className={config.className}
        >
          {config.displayName}
        </text>
      </svg>
    </div>
  )
}
