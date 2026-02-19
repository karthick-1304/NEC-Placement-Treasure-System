import { useNavigate } from 'react-router-dom';

export default function CompanyCard({ company }) {
  const navigate = useNavigate();
  const { company_id, company_name, location, logo_url, is_active, total_drives, last_visited_year } = company;

  const initials = company_name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      onClick={() => navigate(`/companies/${company_id}`)}
      className="card p-6 cursor-pointer group animate-fade-in"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-dark-600 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary-500/50 transition-colors">
          {logo_url
            ? <img src={logo_url} alt={company_name} className="w-full h-full object-contain p-1" />
            : <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-accent-400">
                {initials}
              </span>
          }
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
          ${is_active
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-dark-700 text-dark-400 border border-dark-600'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${is_active ? 'bg-emerald-400 animate-pulse' : 'bg-dark-500'}`} />
          {is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Name + location */}
      <h3 className="font-bold text-white text-base leading-tight group-hover:text-primary-300 transition-colors line-clamp-2 mb-1">
        {company_name}
      </h3>
      <p className="text-dark-400 text-sm flex items-center gap-1.5 mb-4">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate">{location || 'Location N/A'}</span>
      </p>

      {/* Stats */}
      <div className="flex items-center gap-3 pt-4 border-t border-dark-700/60">
        <div className="flex-1 text-center">
          <p className="text-xl font-black text-white">{total_drives ?? 0}</p>
          <p className="text-dark-500 text-xs">Drives</p>
        </div>
        <div className="w-px h-8 bg-dark-700" />
        <div className="flex-1 text-center">
          <p className="text-xl font-black text-white">{last_visited_year ?? '—'}</p>
          <p className="text-dark-500 text-xs">Last Visit</p>
        </div>
        <div className="w-px h-8 bg-dark-700" />
        <div className="flex-1 flex justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary-600/10 border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-600 group-hover:border-primary-600 transition-all duration-300">
            <svg className="w-4 h-4 text-primary-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}