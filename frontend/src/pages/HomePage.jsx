import { useRef } from 'react';
import useCompanies from '../hooks/useCompanies.js';
import SortTabs from '../components/home/SortTabs.jsx';
import CompanyGrid from '../components/home/CompanyGrid.jsx';
import SearchBar from '../components/common/SearchBar.jsx';

export default function HomePage() {
  const {
    companies, pagination, sort, search,
    currentPage, isLoading, error,
    handleSort, handleSearch, handlePage,
  } = useCompanies();

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-black text-white mb-2">
          Placement{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
            Companies
          </span>
        </h1>
        <p className="text-dark-400">
          Explore companies that visited NEC campus for recruitment
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="flex-1 w-full sm:max-w-sm">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search company name..."
          />
        </div>
        <SortTabs active={sort} onChange={handleSort} />
      </div>

      <CompanyGrid
        companies={companies}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        onPageChange={handlePage}
      />
    </div>
  );
}