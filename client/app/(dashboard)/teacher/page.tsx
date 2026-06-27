import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsGrid from "@/components/dashboard/StatsGrid";

export default function TeacherPage() {
  return (
    <div className="space-y-8">

      <WelcomeBanner />

      <StatsGrid />

    </div>
  );
}