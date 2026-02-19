import CompanyCard from './CompanyCard.jsx';
import Pagination from '../common/Pagination.jsx';
import Spinner from '../common/Spinner.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';

export default function CompanyGrid({ companies, pagination, isLoading, error, onPageChange }) {
  if (isLoading) return (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-dark-400 text-sm animate-pulse">Loading companies...</p>
      </div>
    </div>
  );

  if (error) return <ErrorMessage message={error} />;

  if (!companies.length) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center border border-dark-700">
        <svg className="w-10 h-10 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <p className="text-dark-300 font-semibold">No companies found</p>
      <p className="text-dark-500 text-sm">Try adjusting your search or filters</p>
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((company) => (
          <CompanyCard key={company.company_id} company={company} />
        ))}
      </div>
      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}