import { useState, useEffect } from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', debounce = 400 }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => { setLocalValue(value); }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => { onChange(localValue); }, debounce);
    return () => clearTimeout(timer);
  }, [localValue, debounce, onChange]);

  return (
    <div className="relative group">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500 group-focus-within:text-primary-400 transition-colors"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 pr-4"
      />
      {localValue && (
        <button
          onClick={() => { setLocalValue(''); onChange(''); }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}