import { useEffect, useState } from "react";
import {
  getAllStudents,
  createStudent,
  deleteStudent
} from "../../api/studentAPI";

import Spinner from "../../components/common/Spinner.jsx";

function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    reg_no: "",
    dept_id: "",
    batch_year: ""
  });
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const res = await getAllStudents(page);
        const data = res?.data || [];
        setStudents(data);
        setHasMore(data.length === 10); // if less than 10 → last page
      } catch (err) {
        console.error("Error loading students", err);
      } finally {
        setLoading(false);
      }
    };
  
    loadStudents();
  }, [page]);

  const refreshStudents = async () => {
    try {
      const res = await getAllStudents(page);
      setStudents(res?.data || []);
    } catch (err) {
      console.error("Error refreshing students", err);
    }
  };

  setTimeout(() => setSuccessMsg(""), 2000);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStudent(form);
      setSuccessMsg("Student added successfully!");
      setForm({
        full_name: "",
        email: "",
        password: "",
        reg_no: "",
        dept_id: "",
        batch_year: ""
      });
      refreshStudents();
    } catch (err) {
      console.error("Create student error:", err);
console.error("Backend response:", err.response);
console.error("Backend data:", err.response?.data);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      refreshStudents();
    } catch (err) {
      console.error("Delete student error", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-dark-400 animate-pulse">
            Loading students...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 animate-slide-up">

      <h2 className="text-2xl font-semibold mb-6">Manage Students</h2>

      {/* Create Student Form */}
      <div className="bg-dark-800 rounded-xl p-6 mb-8 border border-dark-700">
        <h3 className="text-lg font-medium mb-4">Add New Student</h3>

        <form
  onSubmit={handleSubmit}
  className="grid grid-cols-1 md:grid-cols-3 gap-4"
>
  <input
    className="bg-dark-900 border border-dark-600 rounded-lg px-3 py-2"
    placeholder="Full Name"
    value={form.full_name}
    onChange={(e) =>
      setForm({ ...form, full_name: e.target.value })
    }
  />

  <input
    className="bg-dark-900 border border-dark-600 rounded-lg px-3 py-2"
    placeholder="Email"
    type="email"
    value={form.email}
    onChange={(e) =>
      setForm({ ...form, email: e.target.value })
    }
  />

<input
  className="bg-dark-900 border border-dark-600 rounded-lg px-3 py-2"
  placeholder="Password (Ex: Test@1234)"
  type="password"
  value={form.password}
  onChange={(e) =>
    setForm({ ...form, password: e.target.value })
  }
/>

  <input
    className="bg-dark-900 border border-dark-600 rounded-lg px-3 py-2"
    placeholder="Register Number"
    value={form.reg_no}
    onChange={(e) =>
      setForm({ ...form, reg_no: e.target.value })
    }
  />

<select
  className="bg-dark-900 border border-dark-600 rounded-lg px-3 py-2"
  value={form.dept_id}
  onChange={(e) =>
    setForm({ ...form, dept_id: Number(e.target.value) })
  }
>
    <option value="">Select Department</option>
    <option value="1">CSE</option>
    <option value="2">IT</option>
    <option value="3">ECE</option>
    <option value="4">EEE</option>
    <option value="5">MECH</option>
  </select>

  <input
    className="bg-dark-900 border border-dark-600 rounded-lg px-3 py-2"
    placeholder="Batch Year (ex: 2025)"
    value={form.batch_year}
    onChange={(e) =>
      setForm({ ...form, batch_year: Number(e.target.value) })
    }
  />

<button
  className="md:col-span-3 bg-primary-600 hover:bg-primary-500 rounded-lg px-4 py-2 font-medium transition"
>
  Create Student
</button>

{successMsg && (
  <div className="md:col-span-3 text-green-400 bg-green-900/20 border border-green-700 px-4 py-2 rounded-lg text-sm">
    {successMsg}
  </div>
)}
</form>
      </div>

      {/* Students List */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-700">
          <h3 className="text-lg font-medium">Students List</h3>
        </div>

        <div className="divide-y divide-dark-700">
        {students?.map((s) => (
  <div
    key={s.user_id}
    className="flex justify-between items-center px-6 py-4"
  >
    <div className="text-sm">
      <p className="font-medium">{s.full_name}</p>
      <p className="text-dark-400">
        {s.email} • Dept {s.dept_id} • Year {s.batch_year}
      </p>
    </div>

    <button
      onClick={() => handleDelete(s.user_id)}
      className="text-rose-400 hover:text-rose-300 text-sm"
    >
      Delete
    </button>
  </div>
))}
        </div>

        {students.length === 0 && (
          <p className="text-center py-6 text-dark-400">
            No students found
          </p>
        )}
        <div className="flex justify-center gap-4 py-6">
        <button
  disabled={page === 1}
  onClick={() => setPage((p) => Math.max(p - 1, 1))}
  className={`px-4 py-2 rounded-lg ${
    page === 1
      ? "bg-dark-800 text-dark-500 cursor-not-allowed"
      : "bg-dark-700 hover:bg-dark-600"
  }`}
>
  Prev
</button>

  <span className="px-4 py-2 text-dark-300">
    Page {page}
  </span>

  <button
  disabled={!hasMore}
  onClick={() => setPage((p) => p + 1)}
  className={`px-4 py-2 rounded-lg ${
    hasMore
      ? "bg-dark-700 hover:bg-dark-600"
      : "bg-dark-800 text-dark-500 cursor-not-allowed"
  }`}
>
  Next
</button>
</div>
      </div>
    </div>
  );
}

export default AdminStudentsPage;