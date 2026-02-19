const STATUS_CONFIG = {
  passed: {
    bg:     'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text:   'text-emerald-400',
    icon:   '✓',
    label:  'Passed',
  },
  failed: {
    bg:     'bg-rose-500/10',
    border: 'border-rose-500/20',
    text:   'text-rose-400',
    icon:   '✗',
    label:  'Failed',
  },
};

const ERROR_LABELS = {
  WRONG_ANSWER:         { label: 'Wrong Answer',           color: 'text-rose-400' },
  TIME_LIMIT_EXCEEDED:  { label: 'Time Limit Exceeded',    color: 'text-amber-400' },
  MEMORY_LIMIT_EXCEEDED:{ label: 'Memory Limit Exceeded',  color: 'text-orange-400' },
  COMPILATION_ERROR:    { label: 'Compilation Error',      color: 'text-pink-400' },
  RUNTIME_ERROR:        { label: 'Runtime Error',          color: 'text-rose-400' },
  JUDGE0_ERROR:         { label: 'Judge Error',            color: 'text-dark-400' },
  JUDGE0_TIMEOUT:       { label: 'Judge Timeout',          color: 'text-dark-400' },
  UNSUPPORTED_LANGUAGE: { label: 'Unsupported Language',   color: 'text-dark-400' },
};

export default function RunResultPanel({ runResults }) {
  if (!runResults) return null;

  const { verdict, passed, total, results } = runResults.data;

  return (
    <div className="mt-4 animate-slide-up">
      {/* Summary */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-xl border mb-3
        ${verdict === 'ALL_PASSED'
          ? 'bg-emerald-500/10 border-emerald-500/20'
          : 'bg-amber-500/10 border-amber-500/20'}`}>
        <div className="flex items-center gap-2">
          <span className={verdict === 'ALL_PASSED' ? 'text-emerald-400' : 'text-amber-400'}>
            {verdict === 'ALL_PASSED' ? '✓' : '◑'}
          </span>
          <span className={`font-semibold text-sm ${verdict === 'ALL_PASSED' ? 'text-emerald-300' : 'text-amber-300'}`}>
            {verdict === 'ALL_PASSED' ? 'All Tests Passed!' : 'Partial Pass'}
          </span>
        </div>
        <span className="text-dark-400 text-xs font-mono">{passed}/{total} passed</span>
      </div>

      {/* Per-case results */}
      <div className="space-y-2">
        {results.map((r, idx) => {
          const cfg     = STATUS_CONFIG[r.status] || STATUS_CONFIG.failed;
          const errInfo = ERROR_LABELS[r.error_type] || null;
          return (
            <details key={idx} className={`${cfg.bg} ${cfg.border} border rounded-xl overflow-hidden`}>
              <summary className="flex items-center justify-between px-4 py-2.5 cursor-pointer list-none">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${cfg.text}`}>{cfg.icon}</span>
                  <span className="text-dark-200 text-sm">Test Case {idx + 1}</span>
                  {errInfo && (
                    <span className={`text-xs font-semibold ${errInfo.color}`}>{errInfo.label}</span>
                  )}
                </div>
                <span className="text-dark-500 text-xs">{r.time_taken_ms}ms ▾</span>
              </summary>

              {r.error_message && (
                <div className="px-4 pb-3 pt-1 border-t border-dark-700/40">
                  <pre className="text-xs text-dark-300 font-mono whitespace-pre-wrap break-all leading-5">
                    {r.error_message}
                  </pre>
                </div>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
}