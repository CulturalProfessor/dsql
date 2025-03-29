import { useState } from "react";
import { useQueryContext } from "@/utils/context";
import { UploadCloud, Loader, AlertCircle } from "lucide-react";
import CsvWorker from "@/workers/csvWorker?worker";
import "./Uploader.css";

const MAX_FILE_SIZE_MB = 15;

const CsvUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const { setCsvData } = useQueryContext();
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null); 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const selectedFile = event.target.files[0];

      // Check file size
      if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setWarning("File is larger than 15MB. Uploading may take longer.");
      } else {
        setWarning(null);
      }

      setFile(selectedFile);
      setShowUploadButton(true);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setLoading(true);
    setWarning(null);

    const worker = new CsvWorker();
    worker.postMessage({ file });

    worker.onmessage = (event) => {
      if (event.data.complete) {
        console.log("CSV processing complete", event.data.data);
        setCsvData(event.data.data);
        setShowUploadButton(false);
      } else if (event.data.error) {
        console.error("CSV Parsing Error:", event.data.error);
      }
      setLoading(false);
    };
  };

  return (
    <div className="uploader-container">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        id="csv-upload"
        hidden
      />

      <label htmlFor="csv-upload" className="upload-button">
        <UploadCloud size={16} />
        Choose File
      </label>

      {warning && (
        <p className="warning-message">
          <AlertCircle size={12} /> {warning}
        </p>
      )}

      {file && showUploadButton && (
        <button
          className="upload-button upload-confirm"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? (
            <Loader size={12} className="spinner" />
          ) : (
            <UploadCloud size={16} />
          )}
          {loading ? "" : "Upload"}
        </button>
      )}
    </div>
  );
};

export default CsvUploader;
