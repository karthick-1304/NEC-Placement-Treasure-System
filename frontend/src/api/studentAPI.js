import axios from "./axiosInstance";

// GET ALL STUDENTS
export const getStudents = () => {
  return axios.get("/admin/students");
};

// CREATE STUDENT
export const createStudent = (data) => {
  return axios.post("/admin/students", data);
};

// UPDATE STUDENT
export const updateStudent = (id, data) => {
  return axios.put(`/admin/students/${id}`, data);
};

// DELETE STUDENT
export const deleteStudent = (id) => {
  return axios.delete(`/admin/students/${id}`);
};