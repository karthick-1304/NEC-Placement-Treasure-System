import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function SolvedProblemsPage() {

  const [programs, setPrograms] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {

    const fetchSolved = async () => {

      try {

        const res = await axiosInstance.get(`/solved?page=${page}&limit=10`);

        setPrograms(res.data.data.programs);
        setTotalPages(res.data.data.pagination.totalPages);

      } catch (err) {
        console.error("Solved fetch error:", err);
      }

    };

    fetchSolved();

  }, [page]);


  return (

    <div className="max-w-screen-lg mx-auto text-white p-6">

      <h1 className="text-2xl font-bold mb-6">
        Solved Problems
      </h1>

      <table className="w-full border-collapse">

        <thead>

          <tr className="border-b border-gray-700">

            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Difficulty</th>
            <th className="p-3 text-left">Solved At</th>

          </tr>

        </thead>

        <tbody>

          {programs.map((p) => (

            <tr key={p.prog_id} className="border-b border-gray-800">

              <td className="p-3">{p.title}</td>

              <td className="p-3 capitalize">{p.difficulty}</td>

              <td className="p-3">
                {new Date(p.solved_at).toLocaleDateString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>


      {/* Pagination */}

      <div className="flex gap-3 mt-6">

        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          Next
        </button>

      </div>

    </div>

  );
}