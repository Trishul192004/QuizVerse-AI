import {
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import StatCard from "./StatCard";

export default function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Classrooms"
        value={12}
        icon={GraduationCap}
        description="Active classrooms"
      />

      <StatCard
        title="Students"
        value={98}
        icon={Users}
        description="Enrolled students"
      />

      <StatCard
        title="Quizzes"
        value={34}
        icon={BookOpen}
        description="Published quizzes"
      />

      <StatCard
        title="AI Credits"
        value={250}
        icon={Sparkles}
        description="Credits remaining"
      />

    </div>
  );
}