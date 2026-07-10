"use client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuizDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-4xl font-bold">
        Quiz #{id}
      </h1>

      <div className="rounded-xl border p-8">
        <h2 className="text-2xl font-semibold">
          Question Management
        </h2>

        <p className="mt-2 text-slate-500">
          Add, edit and delete questions for this quiz.
        </p>
      </div>
    </div>
  );
}