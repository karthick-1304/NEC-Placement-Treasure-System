import Spinner from '../common/Spinner.jsx';
import Pagination from '../common/Pagination.jsx';
import SearchBar from '../common/SearchBar.jsx';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { deleteFeedback } from "../../api/feedbackAPI";

export default function FeedbackTable({ feedbacks, pagination, isLoading, error, search, setPage, setSearch, driveId }) {
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.user?.role);
  const isAdmin = role === "admin";

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;

    try {
      await deleteFeedback(id);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, reg no, email..."
        />

        <button
          onClick={() =>
            role === "admin"
              ? navigate(`/admin/upload-feedback?driveId=${driveId}`)
              : navigate(`/upload-feedback?driveId=${driveId}`)
          }
          className="bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          Upload Feedback
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-center py-16 text-rose-400">{error}</div>
      ) : !feedbacks || feedbacks.length === 0 ? (
        <div className="text-center py-16 text-dark-400">No feedbacks found for this drive.</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-dark-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-800/80 border-b border-dark-700">
                  {['Student Name', 'Reg No','Email','Status','Feedback PDF',...(isAdmin ? ['Actions'] : [])].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/50">
                {feedbacks.map((fb) => (
                  <tr key={fb.feedback_id} className="hover:bg-dark-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {fb.full_name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{fb.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-dark-300 text-xs">{fb.reg_no}</span>
                    </td>
                    <td className="px-4 py-3.5 text-dark-400">{fb.email}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                        ${fb.is_selected
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {fb.is_selected ? '✓ Selected' : '✗ Not Selected'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {fb.feedback_pdf_url
                        ? <a href={fb.feedback_pdf_url} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 font-medium transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View PDF
                          </a>
                        : <span className="text-dark-600 text-xs">No PDF</span>
                      }
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3.5 flex gap-2">
                        <button
                          onClick={() => handleDelete(fb.feedback_id)}
                          className="bg-rose-600 hover:bg-rose-500 text-white text-xs px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}