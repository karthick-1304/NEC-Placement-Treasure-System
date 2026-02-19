import { useParams, useLocation } from "react-router-dom";
import useProgram from "../hooks/useProgram.js";
import Breadcrumb from "../components/common/Breadcrumb.jsx";
import Spinner from "../components/common/Spinner.jsx";
import ProgramHeader from "../components/program/ProgramHeader.jsx";
import ProgramDescription from "../components/program/ProgramDescription.jsx";
import TestCasePanel from "../components/program/TestCasePanel.jsx";
import LangSelector from "../components/program/LangSelector.jsx";
import CodeEditor from "../components/program/CodeEditor.jsx";
import RunResultPanel from "../components/program/RunResultPanel.jsx";
import SubmitResultPanel from "../components/program/SubmitResultPanel.jsx";

export default function ProgramPage() {
  const { progId } = useParams();
  const location = useLocation();
  const companyName = location.state?.companyName || null;
  const companyId = location.state?.companyId || null;

  const {
    currentProgram,
    langTemplates,
    publicTestCases,
    selectedLang,
    code,
    isSolved,
    isRunning,
    isSubmitting,
    runResults,
    submitResults,
    error,
    handleLangChange,
    handleRun,
    handleSubmit,
    setCode,
  } = useProgram(progId);

  if (!currentProgram && !error)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-dark-400 animate-pulse">Loading problem...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-10 text-center text-rose-400">
        {error}
      </div>
    );

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    ...(companyId && companyName
      ? [{ label: companyName, to: `/companies/${companyId}` }]
      : []),
    { label: currentProgram.title },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 animate-slide-up">
      <Breadcrumb items={breadcrumbItems} />
      <ProgramHeader program={currentProgram} isSolved={isSolved} />

      {/* Split layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* LEFT — description + test cases */}
        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 overflow-y-auto max-h-[calc(100vh-12rem)] custom-scroll">
          <ProgramDescription
            description={currentProgram.description}
            constraintsText={currentProgram.constraints_text}
          />
          <TestCasePanel testCases={publicTestCases} />
        </div>

        {/* RIGHT — editor + actions + results */}
        <div className="flex flex-col gap-4">
          {/* Editor header */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700 bg-dark-800/50">
              <LangSelector
                langTemplates={langTemplates}
                selectedLang={selectedLang}
                onChange={handleLangChange}
              />
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
            </div>
            <CodeEditor code={code} onChange={setCode} lang={selectedLang} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRun}
              disabled={isRunning || isSubmitting || !code.trim()}
              className="btn-secondary flex-1 py-3 disabled:opacity-40"
            >
              {isRunning ? (
                <>
                  <Spinner size="sm" /> Running...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Run Code
                </>
              )}
            </button>

            <button
              onClick={handleSubmit}
              disabled={isRunning || isSubmitting || !code.trim()}
              className="btn-primary flex-1 py-3 disabled:opacity-40"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" color="white" /> Submitting...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {isSolved ? "Submit Again" : "Submit"}
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {runResults && !submitResults && (
            <RunResultPanel runResults={runResults} />
          )}
          {submitResults && <SubmitResultPanel submitResults={submitResults} />}
        </div>
      </div>
    </div>
  );
}
