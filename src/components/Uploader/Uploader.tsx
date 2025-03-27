import { useState } from "react";
import Papa from "papaparse";
import { UploadCloud } from "lucide-react";
import { useQueryContext } from "@/utils/context";
import "./Uploader.css";

const CsvUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const { setCsvData } = useQueryContext();
  const [showUploadButton, setShowUploadButton] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
      setShowUploadButton(true);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log("Parsed Data:", result.data);
        setCsvData(result.data);
        setShowUploadButton(false);
      },
    });
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
        <UploadCloud size={18} />
        Choose File
      </label>

      {file && showUploadButton && (
        <button className="upload-button upload-confirm" onClick={handleUpload}>
          <UploadCloud size={18} />
          Upload
        </button>
      )}
    </div>
  );
};

export default CsvUploader;
