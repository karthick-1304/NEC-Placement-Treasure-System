import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

export default function RecentSolves() {

  const [solves, setSolves] = useState([]);

  useEffect(() => {

    const fetchRecent = async () => {

      try {

        const res = await axiosInstance.get("/solved?limit=5&page=1");

        setSolves(res.data.data.programs);

      } catch (err) {
        console.error("Recent solves error:", err);
      }

    };

    fetchRecent();

  }, []);

  return (

    <div className="bg-[#0c0d17] border border-zinc-800 rounded-2xl p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-lg font-semibold text-white">
          Recent Solves
        </h2>

        <Link
          to="/solved"
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          View all →
        </Link>

      </div>

      {/* LIST */}

      <div className="space-y-4">

        {solves.map((p) => (

          <div
            key={p.prog_id}
            className="flex items-center justify-between bg-zinc-900/30 border border-zinc-800 rounded-xl px-4 py-4 hover:bg-zinc-900/50 transition"
          >

            {/* LEFT */}

            <div className="flex items-center gap-3">

              <div
                className={`w-1 h-10 rounded ${
                  p.difficulty === "Easy"
                    ? "bg-emerald-400"
                    : p.difficulty === "Medium"
                    ? "bg-amber-400"
                    : "bg-rose-400"
                }`}
              ></div>

              <div>

                <div className="font-medium text-white">
                  {p.title}
                </div>

                <div className="text-xs text-zinc-500 mt-1">
                  {new Date(p.solved_at).toLocaleDateString()}
                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3">

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  p.difficulty === "Easy"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : p.difficulty === "Medium"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {p.difficulty}
              </span>

              <span className="text-emerald-400 text-lg">
                ✓
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}