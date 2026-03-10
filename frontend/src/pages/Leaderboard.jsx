import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const PAGE_SIZE = 10;

  const fetchLeaderboard = async (pageNo = 1) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `http://localhost:5000/api/leaderboard?page=${pageNo}&limit=${PAGE_SIZE}`,
        { credentials: "include" }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      if (data.status !== "success") {
        throw new Error("Failed to load leaderboard");
      }

      // Backend already filters students
      setStudents(data.data || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(page);
  }, [page]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-6">Leaderboard</h1>

      <div className="glass border border-dark-700 rounded-2xl overflow-hidden">
        {loading && (
          <p className="text-center text-dark-400 py-6">
            Loading leaderboard...
          </p>
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
                <th className="px-4 py-3 text-left">Score</th>
                <th className="px-4 py-3 text-left">Solved</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, i) => {
                const absoluteRank = (page - 1) * PAGE_SIZE + (i + 1);

                let bg = i % 2 === 0 ? "bg-dark-900" : "bg-dark-800";
                let rowHeight = "py-2";
                let borderLeft = "";

                let rankDisplay = absoluteRank;

                if (page === 1) {
                  if (i === 0) {
                    rankDisplay = "🥇";
                    bg = "bg-yellow-500/20";
                    rowHeight = "py-4";
                    borderLeft = "border-l-4 border-yellow-400";
                  } else if (i === 1) {
                    rankDisplay = "🥈";
                    bg = "bg-gray-400/20";
                    rowHeight = "py-3";
                    borderLeft = "border-l-4 border-gray-300";
                  } else if (i === 2) {
                    rankDisplay = "🥉";
                    bg = "bg-orange-400/20";
                    rowHeight = "py-3";
                    borderLeft = "border-l-4 border-orange-400";
                  }
                }

                return (
                  <tr
                    key={s.user_id}
                    className={`${bg} hover:bg-dark-700 transition ${borderLeft}`}
                  >
                    <td className={`px-4 ${rowHeight} text-primary-400 font-semibold`}>
                      {rankDisplay}
                    </td>

                    <td className={`px-4 ${rowHeight} text-white font-semibold`}>
                      {s.full_name}
                    </td>

                    <td className={`px-4 ${rowHeight} text-amber-400 font-semibold`}>
                      {s.total_score}
                    </td>

                    <td className={`px-4 ${rowHeight} text-emerald-400 font-semibold`}>
                      {s.programs_solved}
                    </td>
                  </tr>
                );
              })}

              {students.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-dark-400 py-6">
                    No leaderboard data available
                  </td>
                </tr>
              )}
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