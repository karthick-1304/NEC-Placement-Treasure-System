import { useEffect, useState } from "react";
import {
  getAllPrograms,
  createProgram,
  deleteProgram,
} from "../../api/programAPI";

import Spinner from "../../components/common/Spinner.jsx";

function AdminProgramsPage() {
  const [allPrograms, setAllPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  const [form, setForm] = useState({
    title: "",
    difficulty: "",
  });

  const loadPrograms = async () => {
    try {
      setLoading(true);
  
      const res = await getAllPrograms({ page, limit: PAGE_SIZE });
  
      setAllPrograms(res?.data || []);
      setTotalPages(res?.totalPages || 1);
  
    } catch (err) {
      console.error("Error loading programs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProgram(form);
setForm({ title: "", difficulty: "" });
setPage(1);
    } catch (err) {
      console.error("Create program error", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProgram(id);
  
      if (allPrograms.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadPrograms();
      }
  
    } catch (err) {
      console.error("Delete program error", err);
    }
  };

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-400";
      case "medium":
        return "bg-orange-500/20 text-orange-400";
      case "hard":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-dark-400 animate-pulse">Loading programs...</p>
        </div>
      </div>
    );
  }

  // Programs for current page

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 animate-slide-up">
      <h2 className="text-2xl font-semibold mb-6">Admin Program Management</h2>

      {/* Create Program */}
      <div className="bg-dark-800 rounded-xl p-6 mb-8 border border-dark-700">
        <h3 className="text-lg font-medium mb-4">Create Program</h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            className="bg-dark-900 border border-dark-600 rounded-lg px-3 py-2"
            placeholder="Program Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

<select
  className="bg-dark-900 border border-dark-600 rounded-lg px-3 py-2"
  value={form.difficulty}
  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
>
  <option value="">Select Difficulty</option>
  <option value="easy">Easy</option>
  <option value="medium">Medium</option>
  <option value="hard">Hard</option>
</select>

          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-500 rounded-lg px-4 py-2 font-medium transition"
          >
            Create Program
          </button>
        </form>
      </div>

      {/* Programs Table */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-700">
          <h3 className="text-lg font-medium">Programs</h3>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-dark-900 text-dark-300">
            <tr>
              <th className="text-left px-6 py-3">Title</th>
              <th className="text-left px-6 py-3">Difficulty</th>
              <th className="text-right px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-dark-700">
          {allPrograms.length > 0 ? (
  allPrograms.map((p) => (
                <tr key={p.prog_id}>
                  <td className="px-6 py-4">{p.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyStyle(
                        p.difficulty
                      )}`}
                    >
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(p.prog_id)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-6 text-dark-400">
                  No programs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg bg-dark-800 text-dark-300 hover:text-white disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-3 py-1.5 rounded-lg ${
              num === page
                ? "bg-primary-600 text-white"
                : "bg-dark-800 text-dark-300 hover:text-white"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg bg-dark-800 text-dark-300 hover:text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminProgramsPage;