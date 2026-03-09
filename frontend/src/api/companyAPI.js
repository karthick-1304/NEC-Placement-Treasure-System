import axiosInstance from './axiosInstance.js';

export const getAllCompaniesAPI = async ({ page = 1, sort = 'alpha', search = '' }) => {
  const res = await axiosInstance.get('/companies', {
    params: { page, sort, search },
  });
  return res.data;
};

export const getCompanyAPI = async (companyId) => {
  const res = await axiosInstance.get(`/companies/${companyId}`);
  return res.data;
};

export const getDriveFeedbacksAPI = async ({ companyId, driveId, page = 1, search = '' }) => {
  const res = await axiosInstance.get(
    `/student/feedback/${companyId}/drives/${driveId}/feedbacks`,
    { params: { page, search } }
  );
  return res.data.data;   // ⭐ FIX
};

export const getDriveProgramsAPI = async ({ companyId, driveId, page = 1, search = '' }) => {
  const res = await axiosInstance.get(`/companies/${companyId}/drives/${driveId}/programs`, {
    params: { page, search },
  });
  return res.data;
};