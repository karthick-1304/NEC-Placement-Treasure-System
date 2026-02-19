// src/hooks/useDriveFeedbacks.js
import { useState, useEffect, useCallback } from 'react';
import { getDriveFeedbacksAPI } from '../api/companyAPI.js';

const useDriveFeedbacks = ({ companyId, driveId }) => {
  const [feedbacks,  setFeedbacks]  = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState('');
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState(null);

  const fetchFeedbacks = useCallback(async () => {
    if (!companyId || !driveId) return;   // guard
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDriveFeedbacksAPI({ companyId, driveId, page, search });
      setFeedbacks(data.data.feedbacks);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, driveId, page, search]);

  useEffect(() => { fetchFeedbacks(); }, [fetchFeedbacks]);

  useEffect(() => {
    setPage(1);
    setFeedbacks([]);
    setPagination(null);
  }, [driveId]);

  return { feedbacks, pagination, page, search, isLoading, error, setPage, setSearch };
};

export default useDriveFeedbacks;