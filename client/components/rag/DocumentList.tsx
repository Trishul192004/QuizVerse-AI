"use client";

import { useEffect, useState } from "react";
import { Trash2, FileText } from "lucide-react";
import { toast } from "sonner";

import {
  getDocuments,
  deleteDocument,
} from "@/services/api/rag.service";

interface Document {
  id: number;
  filename: string;
}

interface DocumentListProps {
  refreshKey?: number;
  selectedDocumentId?: number | null;
  onSelectDocument?: (document: Document) => void;
}

export default function DocumentList({
  refreshKey = 0,
  selectedDocumentId,
  onSelectDocument,
}: DocumentListProps) {

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {

    try {

      setLoading(true);

      const response = await getDocuments();

      setDocuments(response.documents);

      // Auto-select first document
      if (
        response.documents.length > 0 &&
        !selectedDocumentId &&
        onSelectDocument
      ) {

        onSelectDocument(response.documents[0]);

      }

    } catch (error: any) {

      toast.error(
        error?.response?.data?.message ??
          "Failed to load documents."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    void loadDocuments();
  }, [refreshKey]);

  const handleDelete = async (id: number) => {

    try {

      await deleteDocument(id);

      toast.success("Document deleted.");

      const updatedDocuments = documents.filter(
        (doc) => doc.id !== id
      );

      setDocuments(updatedDocuments);

      if (
        selectedDocumentId === id &&
        updatedDocuments.length > 0 &&
        onSelectDocument
      ) {

        onSelectDocument(updatedDocuments[0]);

      }

    } catch (error: any) {

      toast.error(
        error?.response?.data?.message ??
          "Delete failed."
      );

    }

  };

  if (loading) {
    return <p>Loading documents...</p>;
  }

  if (documents.length === 0) {
    return (
      <p className="text-slate-500">
        No documents uploaded yet.
      </p>
    );
  }

  return (

    <div className="space-y-3">

      {documents.map((doc) => (

        <div
          key={doc.id}
          className={`flex items-center justify-between rounded-lg border p-4 transition ${
            selectedDocumentId === doc.id
              ? "border-blue-500 bg-blue-50"
              : ""
          }`}
        >

          <div className="flex items-center gap-3">

            <input
              type="radio"
              checked={selectedDocumentId === doc.id}
              onChange={() =>
                onSelectDocument?.(doc)
              }
            />

            <FileText className="h-5 w-5 text-red-500" />

            <span className="font-medium">
              {doc.filename}
            </span>

          </div>

          <button
            onClick={() => handleDelete(doc.id)}
            className="rounded-lg p-2 text-red-500 hover:bg-red-100"
          >
            <Trash2 size={18} />
          </button>

        </div>

      ))}

    </div>

  );

}