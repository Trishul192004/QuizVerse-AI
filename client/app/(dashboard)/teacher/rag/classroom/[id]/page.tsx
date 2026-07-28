"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import {
  Brain,
  Sparkles,
  FileText,
  Database,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

import PDFUpload from "@/components/rag/PDFUpload";
import DocumentList from "@/components/rag/DocumentList";
import AIStudyConfig from "@/components/rag/AIStudyConfig";

export default function AIStudyWorkspace() {

  const { id } = useParams();

  const [refreshKey, setRefreshKey] = useState(0);

const [selectedDocument, setSelectedDocument] = useState<{
  id: number;
  filename: string;
} | null>(null);

  const refreshDocuments = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (

    <div className="space-y-10">

      {/* Hero */}

      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-gradient-to-br
          from-indigo-600
          via-violet-600
          to-cyan-600
          p-8
          text-white
          shadow-2xl
        "
      >

        <div
          className="
            absolute
            -right-16
            -top-16
            h-56
            w-56
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-20
            -left-20
            h-64
            w-64
            rounded-full
            bg-cyan-300/20
            blur-3xl
          "
        />

        <div className="relative z-10">

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/20
              bg-white/10
              px-4
              py-2
              text-sm
              font-semibold
              backdrop-blur
            "
          >

            <Brain className="h-5 w-5" />

            AI Study Workspace

          </div>

          <h1
            className="
              mt-6
              text-4xl
              font-extrabold
              tracking-tight
            "
          >
            Build Your Classroom
            Knowledge Base
          </h1>

          <p
            className="
              mt-4
              max-w-3xl
              text-base
              leading-7
              text-indigo-100
            "
          >
            Upload PDFs, create embeddings,
            perform semantic retrieval, and
            generate intelligent AI-powered
            quizzes using Retrieval-Augmented
            Generation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">

            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">

              <Sparkles className="mr-2 inline h-4 w-4" />

              Semantic Search

            </div>

            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">

              <Database className="mr-2 inline h-4 w-4" />

              Vector Knowledge Base

            </div>

            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">

              <FileText className="mr-2 inline h-4 w-4" />

              PDF Intelligence

            </div>

            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">

              <ShieldCheck className="mr-2 inline h-4 w-4" />

              RAG Enabled

            </div>

          </div>

          <div
            className="
              mt-8
              inline-flex
              items-center
              rounded-2xl
              bg-white/10
              px-5
              py-3
              backdrop-blur
            "
          >

            <BookOpen className="mr-3 h-6 w-6" />

            <div>

              <p className="text-xs uppercase tracking-widest text-indigo-200">
                Classroom
              </p>

              <p className="text-lg font-bold">
                ID #{id}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Workspace */}

      <div className="grid gap-8 xl:grid-cols-3">

        {/* Left */}

        <div className="xl:col-span-2 space-y-8">

          <section
            className="
              rounded-3xl
              border
              bg-white
              p-8
              shadow-sm
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  Knowledge Base
                </h2>

                <p className="mt-2 text-slate-500">
                  Upload PDFs that will power
                  your AI Study Workspace.
                </p>

              </div>

              <div
                className="
                  rounded-2xl
                  bg-violet-100
                  p-4
                  text-violet-700
                "
              >
                <Brain className="h-7 w-7" />
              </div>

            </div>

            <div className="mt-8">

              <PDFUpload
                onUploadSuccess={refreshDocuments}
              />

            </div>

            <div className="mt-8">

            <DocumentList
              refreshKey={refreshKey}
              selectedDocumentId={selectedDocument?.id}
              onSelectDocument={setSelectedDocument}
            />

            </div>

          </section>

          {/* AI Study Configuration */}

          <AIStudyConfig
            classroomId={Number(id)}
            documentId={selectedDocument?.id ?? null}
          />

        </div>

        {/* Right Sidebar */}

        <div className="space-y-6">

          {/* AI Status */}

          <section
            className="
              rounded-3xl
              border
              bg-white
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  rounded-2xl
                  bg-emerald-100
                  p-3
                  text-emerald-700
                "
              >
                <Brain className="h-6 w-6" />
              </div>

              <div>

                <h3 className="text-lg font-bold">
                  AI Status
                </h3>

                <p className="text-sm text-slate-500">
                  Workspace Ready
                </p>

              </div>

            </div>

            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between">

                <span className="text-slate-500">
                  Knowledge Base
                </span>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Active
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-slate-500">
                  Semantic Search
                </span>

                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  Enabled
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-slate-500">
                  AI Generation
                </span>

                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                  Ready
                </span>

              </div>

            </div>

          </section>

          {/* Selected Document */}

          <section
            className="
              rounded-3xl
              border
              bg-white
              p-6
              shadow-sm
            "
          >

            <h3 className="text-lg font-bold">
              Current Selection
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Selected PDF used for quiz generation.
            </p>

            <div
              className="
                mt-6
                rounded-2xl
                border-2
                border-dashed
                border-slate-200
                bg-slate-50
                p-6
                text-center
              "
            >

              <FileText className="mx-auto h-10 w-10 text-violet-600" />

              <p className="mt-4 font-semibold">

              {selectedDocument
                ? selectedDocument.filename
                : "No Document Selected"}

              </p>

              <p className="mt-2 text-sm text-slate-500">

             

                {selectedDocument
                  ? "Ready for AI quiz generation."
                  : "Choose a document from the knowledge base."}

              </p>


            </div>

          </section>

          {/* AI Features */}

          <section
            className="
              rounded-3xl
              border
              bg-gradient-to-br
              from-violet-600
              via-indigo-600
              to-cyan-600
              p-6
              text-white
              shadow-xl
            "
          >

            <h3 className="text-xl font-bold">
              AI Capabilities
            </h3>

            <p className="mt-2 text-sm text-indigo-100 leading-6">
              Your uploaded PDFs are transformed into
              an intelligent searchable knowledge base
              that powers contextual AI quiz generation.
            </p>

            <div className="mt-6 space-y-3">

              <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                🧠 Retrieval-Augmented Generation
              </div>

              <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                📄 PDF Knowledge Base
              </div>

              <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                🔍 Semantic Search
              </div>

              <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                ⚡ Intelligent Quiz Generation
              </div>

            </div>

          </section>

        </div>

      </div>

    </div>

  );

}