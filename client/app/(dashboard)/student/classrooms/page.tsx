import StudentClassroomGrid from "@/components/classroom/Student.ClassroomGrid";

export default function StudentClassroomsPage() {
  return (
    <div className="space-y-8 p-6">

      <div>

        <h1 className="text-3xl font-bold">
          My Classrooms
        </h1>

        <p className="mt-1 text-slate-500">
          View the classrooms you have joined.
        </p>

      </div>

      <StudentClassroomGrid />

    </div>
  );
}