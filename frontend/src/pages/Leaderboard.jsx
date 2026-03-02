import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaderboard = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/leaderboard?page=${pageNo}&limit=10`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (data.status !== "success") throw new Error("Failed to load leaderboard");

      setStudents(data.data);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(page);
  }, [page]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-white mb-4">Leaderboard</h1>

      <div className="glass border border-dark-700 rounded-2xl overflow-hidden">
        {loading && (
          <p className="text-center text-dark-400 py-6">Loading leaderboard...</p>
        )}

        {error && (
          <p className="text-center text-rose-400 py-6">{error}</p>
        )}

        {!loading && !error && (
          <table className="w-full text-sm">
            <thead className="bg-dark-800 text-dark-300">
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Reg No</th>
                <th className="px-4 py-3 text-left">Dept</th>
                <th className="px-4 py-3 text-left">Batch</th>
                <th className="px-4 py-3 text-left">Score</th>
                <th className="px-4 py-3 text-left">Solved</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr
                  key={s.user_id}
                  className="border-t border-dark-700 hover:bg-dark-800/60 transition"
                >
                  <td className="px-4 py-2 text-primary-400 font-semibold">
                    {s.global_rank ?? i + 1}
                  </td>
                  <td className="px-4 py-2 text-white">{s.full_name}</td>
                  <td className="px-4 py-2 text-dark-300">{s.reg_no}</td>
                  <td className="px-4 py-2 text-dark-300">{s.dept_name}</td>
                  <td className="px-4 py-2 text-dark-300">{s.batch_year}</td>
                  <td className="px-4 py-2 text-amber-400 font-semibold">
                    {s.total_score}
                  </td>
                  <td className="px-4 py-2 text-emerald-400 font-semibold">
                    {s.programs_solved}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg bg-dark-800 text-dark-300 hover:text-white disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-dark-400 text-sm">
          Page {page} of {totalPages}
        </span>

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