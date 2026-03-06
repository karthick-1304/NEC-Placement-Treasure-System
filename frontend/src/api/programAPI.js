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
// ADMIN CREATE PROGRAM
export const createProgram = async (data) => {
  const res = await axiosInstance.post(`/admin/programs`, data);
  return res.data;
};

// ADMIN UPDATE PROGRAM
export const updateProgram = async (id, data) => {
  const res = await axiosInstance.put(`/admin/programs/${id}`, data);
  return res.data;
};

// ADMIN DELETE PROGRAM
export const deleteProgram = async (id) => {
  const res = await axiosInstance.delete(`/admin/programs/${id}`);
  return res.data;
};