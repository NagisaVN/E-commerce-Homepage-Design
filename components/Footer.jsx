import Link from 'next/link'

const links = {
  Products: ['Refrigerators', 'Air Conditioners', 'Washing Machines', 'Microwaves', 'Dishwashers', 'Water Heaters'],
  Support: ['Track My Order', 'Installation Service', 'Warranty Claims', 'Repair Request', 'Contact Us'],
  Company: ['About CoolHome', 'AI Technology', 'Careers', 'Press', 'Sustainability'],
}

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                  <path d="M8 22V13l8-6 8 6v9H8z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
                  <rect x="13" y="16" width="6" height="6" rx="1" stroke="white" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <span className="text-xl font-bold font-display text-white">CoolHome</span>
            </Link>
            <p className="text-blue-300 font-body text-sm leading-relaxed mb-5">
              Vietnam's #1 AI-powered home appliance store. Premium brands, expert advice, fast delivery.
            </p>
            <div className="flex flex-col gap-2">
              {[
                { icon: '🚚', text: 'Free delivery on $299+' },
                { icon: '🛡️', text: '2-year extended warranty' },
                { icon: '💳', text: '0% financing, 36 months' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2.5 text-xs text-blue-300 font-body">
                  <span>{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-4">{section}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-blue-300 hover:text-white font-body transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <h4 className="font-display font-semibold text-white mb-1">Get AI deals in your inbox</h4>
              <p className="text-blue-300 text-sm font-body">Weekly curated deals, buying guides, and exclusive offers.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-56 bg-white/10 border border-white/20 text-white placeholder-blue-300 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-brand-accent font-body transition-colors"
              />
              <button className="bg-brand hover:bg-brand-mid text-white px-5 py-2.5 rounded-xl text-sm font-semibold font-display transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-400 text-xs font-body">© 2024 CoolHome. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
              <a key={link} href="#" className="text-blue-400 hover:text-white text-xs font-body transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
