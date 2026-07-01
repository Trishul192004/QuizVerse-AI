import ClassroomForm from "@/components/classroom/ClassroomForm";
export default function CreateClassroomPage() {
  return (
    <div className="max-w-2xl p-6">

      <h1 className="mb-8 text-3xl font-bold">
        Create Classroom
      </h1>

      <ClassroomForm />

    </div>
  );
}