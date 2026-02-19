import { useNavigate } from "react-router-dom";
import Spinner from "../common/Spinner.jsx";
import Pagination from "../common/Pagination.jsx";
import SearchBar from "../common/SearchBar.jsx";

export default function ProgramTable({
  programs,
  pagination,
  isLoading,
  error,
  page,
  search,
  setPage,
  setSearch,
}) {
  const navigate = useNavigate();

  const diffBadge = (d) => {
    if (d === "easy") return <span className="badge-easy">Easy</span>;
    if (d === "medium") return <span className="badge-medium">Medium</span>;
    return <span className="badge-hard">Hard</span>;
  };

  return (
    <div>
      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search programs..."
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-rose-400">{error}</div>
      ) : !programs.length ? (
        <div className="text-center py-16 text-dark-400">
          No programs found for this drive.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-dark-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-800/80 border-b border-dark-700">
                  {[
                    "#",
                    "Program Title",
                    "Difficulty",
                    "Languages",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/50">
                {programs.map((prog) => {
                  const langs =
                    typeof prog.supported_languages === "string"
                      ? JSON.parse(prog.supported_languages)
                      : prog.supported_languages;
                  return (
                    <tr
                      key={prog.prog_id}
                      className="hover:bg-dark-800/40 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-dark-500 font-mono text-xs">
                        #{prog.prog_id}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="font-medium text-white hover:text-primary-300 cursor-pointer transition-colors"
                          onClick={() => navigate(`/programs/${prog.prog_id}`)}
                        >
                          {prog.title}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {diffBadge(prog.difficulty)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {langs?.map((l) => (
                            <span
                              key={l}
                              className="px-2 py-0.5 bg-dark-700 rounded text-xs text-dark-300 font-mono"
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center justify-between w-full">
                            <span className={`text-xs font-semibold ${prog.is_solved ? 'text-emerald-400' : 'text-dark-400'}`}>
                              {prog.is_solved ? 'Solved' : 'Not solved'}
                            </span>

                            <button
                              onClick={() => navigate(`/programs/${prog.prog_id}`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-semibold transition-all duration-200 shadow-glow-blue"
                            >
                              Solve →
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
