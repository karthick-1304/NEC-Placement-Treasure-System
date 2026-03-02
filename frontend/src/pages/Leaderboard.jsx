import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const PAGE_SIZE = 10; // same as API limit

  const fetchLeaderboard = async (pageNo = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/leaderboard?page=${pageNo}&limit=${PAGE_SIZE}`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (data.status !== "success") throw new Error("Failed to load leaderboard");

      // Only users with at least 1 solved problem
      const filteredData = data.data.filter((s) => s.programs_solved >= 1);

      setStudents(filteredData);
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
      <h1 className="text-2xl font-bold text-white mb-6">Leaderboard</h1>

      <div className="glass border border-dark-700 rounded-2xl overflow-hidden">
        {loading && <p className="text-center text-dark-400 py-6">Loading leaderboard...</p>}
        {error && <p className="text-center text-rose-400 py-6">{error}</p>}

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

                let rankDisplay;
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
                  } else {
                    rankDisplay = absoluteRank;
                  }
                } else {
                  rankDisplay = absoluteRank;
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