import axios from "./axiosInstance";

// GET all students
export const getAllStudents = async (page = 1) => {
  const res = await axios.get(`/admin/students?page=${page}&limit=10`);
  return res.data;
};

// CREATE student
export const createStudent = async (data) => {
  const res = await axios.post("/admin/students", data);
  return res.data;
};

// UPDATE student
export const updateStudent = async (id, data) => {
  const res = await axios.put(`/admin/students/${id}`, data);
  return res.data;
};

// DELETE student
export const deleteStudent = async (id) => {
  const res = await axios.delete(`/admin/students/${id}`);
  return res.data;
};