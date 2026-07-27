"use client";

import { useState, ChangeEvent } from "react";
import { toast } from "sonner";

import { uploadDocument } from "@/services/api/rag.service";

interface PDFUploadProps {
  onUploadSuccess?: () => void;
}

export default function PDFUpload({
  onUploadSuccess,
}: PDFUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      toast.error("Please select a PDF file.");
      return;
    }

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF first.");
      return;
    }

    try {
      setUploading(true);

      const response = await uploadDocument(file);

      toast.success(
        response.message || "PDF uploaded successfully."
      );

      setFile(null);

      onUploadSuccess?.();

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="block w-full rounded-lg border p-3"
      />

      {file && (
        <p className="text-sm text-slate-500">
          Selected: {file.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="
          rounded-lg
          bg-indigo-600
          px-5
          py-2
          font-medium
          text-white
          hover:bg-indigo-700
          disabled:opacity-50
        "
      >
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>

    </div>
  );
}