import axiosInstance from './axiosInstance.js';

export const getProgramAPI = async (progId) => {
  const res = await axiosInstance.get(`/programs/${progId}`);
  return res.data;
};

export const getLangTemplateAPI = async ({ progId, lang }) => {
  const res = await axiosInstance.get(`/programs/${progId}/template`, {
    params: { lang },
  });
  return res.data;
};

export const runProgramAPI = async ({ progId, lang, code }) => {
  const res = await axiosInstance.post(`/programs/${progId}/run`, { lang, code });
  return res.data;
};

export const submitProgramAPI = async ({ progId, lang, code }) => {
  const res = await axiosInstance.post(`/programs/${progId}/submit`, { lang, code });
  return res.data;
};