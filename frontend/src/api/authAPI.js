import axiosInstance from './axiosInstance.js';

export const loginAPI = async ({ email, password }) => {
  const res = await axiosInstance.post('/auth/login', { email, password });
  return res.data;
};

export const forgotPasswordAPI = async ({ email }) => {
  const res = await axiosInstance.post('/auth/forgot-password', { email });
  return res.data;
};

export const verifyOTPAPI = async ({ user_id, otp, new_password, confirm_password }) => {
  const res = await axiosInstance.post('/auth/verify-otp-and-reset-password', { user_id, otp, new_password, confirm_password });
  return res.data;
};

export const getMeAPI = async () => {
  const res = await axiosInstance.get('/auth/me');
  return res.data;
};

export const logoutAPI = async () => {
  const res = await axiosInstance.post('/auth/logout');
  return res.data;
};