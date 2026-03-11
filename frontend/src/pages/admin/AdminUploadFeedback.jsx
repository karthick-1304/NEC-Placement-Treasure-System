import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { adminUploadFeedback } from "../../api/feedbackAPI";

function UploadFeedback() {
  const [file, setFile] = useState(null);
  const [studentId, setStudentId] = useState(""); // <-- new state for student ID
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("not_selected");

  const [params] = useSearchParams();
  const driveId = params.get("driveId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!file || !studentId) {
      setMessage("All fields are required");
      return;
    }

    if (!driveId) {
      setMessage("Drive ID missing");
      return;
    }

    const formData = new FormData();
    formData.append("feedback_pdf", file);
    formData.append("drive_id", String(driveId));
    formData.append("student_user_id", studentId); // <-- add student ID
    formData.append("is_selected", status === "selected" ? "1" : "0");

    try {
      await adminUploadFeedback(formData);
      setMessage("Feedback uploaded successfully");
      setFile(null);
      setStudentId(""); // reset student ID
      setStatus("not_selected"); // reset selection status
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage("Upload failed");
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 animate-slide-up">
      <div className="max-w-xl mx-auto bg-dark-800 border border-dark-700 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Upload Placement Feedback
        </h2>

        <p className="text-dark-400 mb-6">
          Drive ID: <span className="text-primary-400 font-medium">{driveId}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Student ID */}
          <div>
            <label className="block text-sm text-dark-300 mb-2">
              Student User ID
            </label>
            <input
              type="text"
              placeholder="Enter Student User ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="
                w-full
                px-3
                py-2
                rounded-lg
                bg-dark-700
                border
                border-dark-600
                text-white
                placeholder-dark-400
                focus:outline-none
                focus:ring-2
                focus:ring-primary-500
              "
            />
          </div>

          {/* File Input */}
          <div>
            <label className="block text-sm text-dark-300 mb-2">
              Upload Feedback PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="
                w-full
                text-sm
                text-dark-300
                file:mr-4
                file:py-2
                file:px-4
                file:rounded-lg
                file:border-0
                file:text-sm
                file:font-medium
                file:bg-primary-600
                file:text-white
                hover:file:bg-primary-700
                cursor-pointer
              "
            />
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-sm text-dark-300 mb-2">
              Selection Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="
                w-full
                px-3
                py-2
                rounded-lg
                bg-dark-700
                border
                border-dark-600
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-primary-500
              "
            >
              <option value="not_selected">Not Selected</option>
              <option value="selected">Selected</option>
            </select>
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            className="
              bg-primary-600
              hover:bg-primary-700
              transition
              text-white
              font-medium
              py-2.5
              rounded-lg
            "
          >
            Upload Feedback
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("success")
                ? "text-green-400"
                : "text-rose-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default UploadFeedback;