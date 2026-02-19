// src/hooks/useDrivePrograms.js
import { useState, useEffect, useCallback } from 'react';
import { getDriveProgramsAPI } from '../api/companyAPI.js';

const useDrivePrograms = ({ companyId, driveId }) => {
  const [programs,   setPrograms]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState('');
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState(null);

  const fetchPrograms = useCallback(async () => {
    if (!companyId || !driveId) return;   // guard
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDriveProgramsAPI({ companyId, driveId, page, search });
      setPrograms(data.data.programs);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, driveId, page, search]);

  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  useEffect(() => {
    setPage(1);
    setPrograms([]);
    setPagination(null);
  }, [driveId]);

  return { programs, pagination, page, search, isLoading, error, setPage, setSearch };
};

export default useDrivePrograms;