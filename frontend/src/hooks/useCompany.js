// src/hooks/useCompany.js
import { useState, useEffect } from 'react';
import { getCompanyAPI } from '../api/companyAPI.js';

const useCompany = (companyId) => {
  const [selectedCompany,  setSelectedCompany]  = useState(null);
  const [recruitmentYears, setRecruitmentYears] = useState([]);
  const [selectedDriveId,  setSelectedDriveId]  = useState(null);
  const [isLoading,        setIsLoading]        = useState(false);
  const [error,            setError]            = useState(null);

  useEffect(() => {
    if (!companyId) return;

    // Reset everything on company change
    setSelectedCompany(null);
    setRecruitmentYears([]);
    setSelectedDriveId(null);
    setError(null);

    const fetch = async () => {
      setIsLoading(true);
      try {
        const data = await getCompanyAPI(companyId);
        setSelectedCompany(data.data.company);
        setRecruitmentYears(data.data.recruitment_years);
        if (data.data.recruitment_years?.length) {
          setSelectedDriveId(data.data.recruitment_years[0].drive_id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [companyId]);

  const handleDriveSelect = (driveId) => setSelectedDriveId(driveId);

  return {
    selectedCompany, recruitmentYears, selectedDriveId,
    isLoading, error, handleDriveSelect,
  };
};

export default useCompany;