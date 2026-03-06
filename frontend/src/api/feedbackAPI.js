import axios from "./axiosInstance";

// STUDENT UPLOAD FEEDBACK
export const uploadFeedback = async (formData) => {
  const res = await axios.post(
    "/student/feedback",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

// ADMIN GET ALL FEEDBACKS
export const getAllFeedbacks = async () => {
  const res = await axios.get("/admin/feedbacks");
  return res.data;
};

// ADMIN DELETE FEEDBACK
export const deleteFeedback = (id) => {
  return axios.delete(`/admin/feedbacks/${id}`);
};

// ADMIN UPDATE FEEDBACK
export const updateFeedback = (id, data) => {
  return axios.put(`/admin/feedbacks/${id}`, data);
};

export const adminUploadFeedback = async (formData) => {
  const res = await axios.post(
    "/admin/feedbacks",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};