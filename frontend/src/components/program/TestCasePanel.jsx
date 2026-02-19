import { useState } from 'react';

export default function TestCasePanel({ testCases }) {
  const [active, setActive] = useState(0);

  if (!testCases?.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3">
        Sample Test Cases
      </h3>

      {/* Tab pills */}
      <div className="flex gap-1 mb-3">
        {testCases.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${active === idx
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-dark-400 hover:text-white border border-dark-700'}`}
          >
            Case {idx + 1}
          </button>
        ))}
      </div>

      {testCases[active] && (
        <div className="space-y-3 animate-fade-in">
          <div className="bg-dark-800/60 border border-dark-700 rounded-xl p-4">
            <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Input</p>
            <pre className="text-dark-200 text-sm font-mono whitespace-pre-wrap break-all">
              {testCases[active].input_data || '(No input)'}
            </pre>
          </div>
          <div className="bg-dark-800/60 border border-emerald-700/30 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Expected Output</p>
            <pre className="text-emerald-300 text-sm font-mono whitespace-pre-wrap break-all">
              {testCases[active].expected_output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}