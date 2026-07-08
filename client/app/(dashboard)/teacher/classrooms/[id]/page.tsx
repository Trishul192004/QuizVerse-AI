interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassroomDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Classroom {id}
      </h1>

      <p className="mt-4 text-slate-600">
        Classroom details page coming next...
      </p>
    </div>
  );
}