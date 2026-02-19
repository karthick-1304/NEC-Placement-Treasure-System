export default function ProgramDescription({ description, constraintsText }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3">Problem Statement</h3>
        <div className="text-dark-200 text-sm leading-relaxed whitespace-pre-wrap">{description}</div>
      </div>

      {constraintsText && (
        <div className="bg-dark-800/60 border border-dark-700 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Constraints
          </h3>
          <p className="text-dark-300 text-sm font-mono leading-relaxed whitespace-pre-wrap">{constraintsText}</p>
        </div>
      )}
    </div>
  );
}