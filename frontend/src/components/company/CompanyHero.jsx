export default function CompanyHero({ company }) {
  const { company_name, location, logo_url, is_active, total_drives, last_visited_year, first_visited_year } = company;
  const initials = company_name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-900 to-dark-800 border border-dark-700 rounded-3xl p-8 mb-6">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-dark-800 border border-dark-600 flex items-center justify-center shrink-0 shadow-card">
          {logo_url
            ? <img src={logo_url} alt={company_name} className="w-full h-full object-contain p-2" />
            : <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-accent-400">{initials}</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">{company_name}</h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
              ${is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-dark-700 text-dark-400 border border-dark-600'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${is_active ? 'bg-emerald-400 animate-pulse' : 'bg-dark-500'}`} />
              {is_active ? 'Actively Recruiting' : 'Inactive'}
            </span>
          </div>
          <p className="text-dark-400 flex items-center gap-1.5 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {location || 'Location not specified'}
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Total Drives',   value: total_drives ?? 0,          icon: '🏢' },
              { label: 'Last Visited',   value: last_visited_year ?? '—',   icon: '📅' },
              { label: 'Since',          value: first_visited_year ?? '—',  icon: '🚀' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 bg-dark-800/60 border border-dark-700 rounded-xl px-4 py-2">
                <span className="text-base">{stat.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm">{stat.value}</p>
                  <p className="text-dark-500 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}