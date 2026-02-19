import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6 animate-fade-in">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-2">
            {idx > 0 && (
              <svg className="w-3.5 h-3.5 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {isLast ? (
              <span className="text-dark-300 font-medium truncate max-w-xs">{item.label}</span>
            ) : (
              <Link to={item.to} className="text-dark-500 hover:text-primary-400 transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}