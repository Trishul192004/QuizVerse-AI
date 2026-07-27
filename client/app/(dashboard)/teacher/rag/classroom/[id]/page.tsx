"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import PDFUpload from "@/components/rag/PDFUpload";
import DocumentList from "@/components/rag/DocumentList";
import AIStudyConfig from "@/components/rag/AIStudyConfig";

export default function AIStudyWorkspace() {

  const { id } = useParams();

  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedDocumentId, setSelectedDocumentId] =
    useState<number | null>(null);

  const refreshDocuments = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (

    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          AI Study Workspace
        </h1>

        <p className="mt-2 text-slate-500">
          Classroom ID: {id}
        </p>

      </div>

      {/* Knowledge Base */}

      <div className="rounded-xl border bg-white p-6 space-y-6">

        <div>

          <h2 className="text-xl font-semibold">
            Knowledge Base
          </h2>

          <p className="text-slate-500 mt-1">
            Upload PDFs for this classroom.
          </p>

        </div>

        <PDFUpload
          onUploadSuccess={refreshDocuments}
        />

        <DocumentList
          refreshKey={refreshKey}
          selectedDocumentId={selectedDocumentId}
          onSelectDocument={setSelectedDocumentId}
        />

      </div>

      {/* AI Study Configuration */}

      <AIStudyConfig
        classroomId={Number(id)}
        documentId={selectedDocumentId}
      />

    </div>

  );

}