export default function ProgramHeader({ program, isSolved }) {
  const diffBadge = {
    easy:   <span className="badge-easy">Easy +10pts</span>,
    medium: <span className="badge-medium">Medium +20pts</span>,
    hard:   <span className="badge-hard">Hard +30pts</span>,
  };

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl font-black text-white">{program.title}</h1>
          {isSolved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ✓ Solved
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {diffBadge[program.difficulty]}
          <span className="flex items-center gap-1.5 text-dark-400 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {program.time_limit_ms}ms
          </span>
          <span className="flex items-center gap-1.5 text-dark-400 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 3H5a2 2 0 00-2 2v4m2-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9a2 2 0 00-2-2h-3" />
            </svg>
            {program.memory_limit_mb}MB
          </span>
          <span className="text-dark-600 text-xs">#{program.prog_id}</span>
        </div>
      </div>
    </div>
  );
}