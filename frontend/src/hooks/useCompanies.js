//src/hooks/useCompanies.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllCompaniesAPI } from '../api/companyAPI.js';

const useCompanies = () => {
  const [companies,   setCompanies]   = useState([]);
  const [pagination,  setPagination]  = useState(null);
  const [sort,        setSort]        = useState('alpha');
  const [search,      setSearch]      = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchCompanies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllCompaniesAPI({ page: currentPage, sort, search });
        if (!cancelled) {
          setCompanies(data.data.companies);
          setPagination(data.data.pagination);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchCompanies();

    return () => { cancelled = true; };
  }, [currentPage, sort, search]);

  const handleSort = useCallback((s) => {
    setSort(s);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((q) => {
    setSearch(q);
    setCurrentPage(1);
  }, []);

  const handlePage = useCallback((p) => setCurrentPage(p), []);

  return {
    companies, pagination, sort, search, currentPage,
    isLoading, error, handleSort, handleSearch, handlePage,
  };
};

export default useCompanies;