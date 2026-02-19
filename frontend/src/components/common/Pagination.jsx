export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit, hasNextPage, hasPrevPage } = pagination;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      pages.push(i);
    }
    if (page - delta > 2)           pages.unshift('...');
    if (page + delta < totalPages - 1) pages.push('...');
    pages.unshift(1);
    if (totalPages > 1) pages.push(totalPages);
    return [...new Set(pages)];
  };

  return (
    <div className="flex items-center justify-between mt-8">
      <p className="text-dark-400 text-sm">
        Showing <span className="text-dark-200 font-medium">{(page - 1) * limit + 1}</span>–
        <span className="text-dark-200 font-medium">{Math.min(page * limit, total)}</span> of{' '}
        <span className="text-dark-200 font-medium">{total}</span> results
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="btn-ghost px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {getPages().map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-dark-500">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200
                ${p === page
                  ? 'bg-primary-600 text-white shadow-glow-blue'
                  : 'text-dark-300 hover:bg-dark-800 hover:text-white'}`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="btn-ghost px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}