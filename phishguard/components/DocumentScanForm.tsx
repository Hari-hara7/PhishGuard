"use client";
import { useState } from "react";

export default function DocScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    prediction: string;
    confidence: number;
    extracted_text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/scan/doc", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert("Error scanning document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Document Fake/Legit Checker</h1>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "Scanning..." : "Upload & Scan"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Prediction Result</h2>
          <p className="mb-1">
            <strong>Status:</strong>{" "}
            <span
              className={
                result.prediction === "Legit"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {result.prediction}
            </span>
          </p>
          <p className="mb-2">
            <strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%
          </p>
          <p className="mb-2">
            <strong>Extracted Text:</strong>
          </p>
          <pre className="whitespace-pre-wrap text-sm bg-white p-2 border rounded max-h-80 overflow-y-auto">
            {result.extracted_text}
          </pre>
        </div>
      )}
    </div>
  );
}
