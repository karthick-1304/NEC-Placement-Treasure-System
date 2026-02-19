import { useRef } from 'react';

export default function CodeEditor({ code, onChange, lang }) {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    // Tab = 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const el    = textareaRef.current;
      const start = el.selectionStart;
      const end   = el.selectionEnd;
      const next  = code.substring(0, start) + '  ' + code.substring(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }

    // Block cut / copy / paste keyboard shortcuts
    const isCtrl = e.ctrlKey || e.metaKey;
    if (isCtrl && ['c', 'x', 'v'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  };

  const handleCopy  = (e) => e.preventDefault();
  const handleCut   = (e) => e.preventDefault();
  const handlePaste = (e) => e.preventDefault();

  const lineCount = code.split('\n').length;

  return (
    <div className="relative flex bg-dark-950 rounded-xl border border-dark-700 overflow-hidden font-mono text-sm">
      {/* Line numbers */}
      <div className="select-none bg-dark-900/80 border-r border-dark-700 px-3 py-4 text-right text-dark-600 text-xs leading-6 min-w-[3rem]">
        {Array.from({ length: Math.max(lineCount, 10) }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onCopy={handleCopy}
        onCut={handleCut}
        onPaste={handlePaste}
        onContextMenu={(e) => e.preventDefault()}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="flex-1 bg-transparent text-dark-100 px-4 py-4 resize-none focus:outline-none leading-6 text-sm min-h-[420px]"
        style={{ caretColor: '#60a5fa', userSelect: 'none' }}
      />
    </div>
  );
}