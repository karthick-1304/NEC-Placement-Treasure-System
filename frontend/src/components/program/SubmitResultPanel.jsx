const ERROR_LABELS = {
  WRONG_ANSWER:         { label: 'Wrong Answer',           color: 'text-rose-400',   bg: 'bg-rose-500/10',   border: 'border-rose-500/20'   },
  TIME_LIMIT_EXCEEDED:  { label: 'Time Limit Exceeded',    color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
  MEMORY_LIMIT_EXCEEDED:{ label: 'Memory Limit Exceeded',  color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  COMPILATION_ERROR:    { label: 'Compilation Error',      color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20'   },
  RUNTIME_ERROR:        { label: 'Runtime Error',          color: 'text-rose-400',   bg: 'bg-rose-500/10',   border: 'border-rose-500/20'   },
};

export default function SubmitResultPanel({ submitResults }) {
  if (!submitResults) return null;

  const { verdict, passed, total, already_solved, score_awarded, updated_profile, results } = submitResults.data;
  const isAccepted = verdict === 'ACCEPTED';

  // Find first failing test case for error display
  const firstFail = results?.find((r) => r.status === 'failed');
  const errInfo   = firstFail ? ERROR_LABELS[firstFail.error_type] : null;

  return (
    <div className="mt-4 animate-slide-up space-y-3">

      {/* Main verdict banner */}
      {isAccepted ? (
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600/20 to-primary-600/20 border border-emerald-500/30 rounded-2xl p-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-emerald-300 font-black text-lg">
                {already_solved ? 'Already Solved!' : 'Accepted!'}
              </p>
              <p className="text-dark-400 text-sm">
                {already_solved
                  ? 'You have already solved this — no extra points awarded.'
                  : `All ${total} test cases passed.`}
              </p>
            </div>
          </div>

          {/* Score + profile update */}
          {!already_solved && score_awarded > 0 && updated_profile && (
            <div className="mt-4 pt-4 border-t border-emerald-500/20 grid grid-cols-3 gap-3">
              {[
                { label: 'Points Earned',   value: `+${score_awarded}`,              color: 'text-amber-400' },
                { label: 'Total Score',     value: updated_profile.total_score,       color: 'text-white'     },
                { label: 'Global Rank',     value: `#${updated_profile.global_rank}`, color: 'text-primary-400'},
              ].map((s) => (
                <div key={s.label} className="text-center bg-dark-900/50 rounded-xl p-3">
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-dark-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={`${errInfo?.bg || 'bg-rose-500/10'} ${errInfo?.border || 'border-rose-500/20'} border rounded-2xl p-5`}>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className={`font-black text-lg ${errInfo?.color || 'text-rose-400'}`}>
                {errInfo?.label || 'Wrong Answer'}
              </p>
              <p className="text-dark-400 text-sm">{passed}/{total} test cases passed</p>
            </div>
          </div>

          {/* Error detail */}
          {firstFail?.error_message && (
            <div className="bg-dark-900/60 rounded-xl p-3 border border-dark-700">
              <p className="text-xs text-dark-500 font-semibold uppercase tracking-wider mb-1">Error Detail</p>
              <pre className="text-xs text-dark-300 font-mono whitespace-pre-wrap break-all leading-5">
                {firstFail.error_message}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Per-test summary pills */}
      <div className="flex flex-wrap gap-2">
        {results?.map((r, idx) => (
          <span
            key={idx}
            title={r.error_type || 'Passed'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border
              ${r.status === 'passed'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}
          >
            {r.status === 'passed' ? '✓' : '✗'} TC{idx + 1}
            <span className="text-dark-600 font-normal">{r.time_taken_ms}ms</span>
          </span>
        ))}
      </div>
    </div>
  );
}