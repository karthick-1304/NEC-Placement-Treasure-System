import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { uploadFeedback } from "../../api/feedbackAPI";

function UploadFeedback() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const [params] = useSearchParams();
  const driveId = params.get("driveId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a PDF file");
      return;
    }

    if (!driveId) {
      setMessage("Drive ID missing");
      return;
    }

    const formData = new FormData();
    formData.append("feedback_pdf", file);
    formData.append("drive_id", driveId);
    formData.append("is_selected", 0);

    try {
      await uploadFeedback(formData);
      setMessage("Feedback uploaded successfully");
      setFile(null);
    } catch (err) {
      console.error(err);
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