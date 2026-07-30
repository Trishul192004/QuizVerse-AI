import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsGrid from "@/components/dashboard/StatsGrid";

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
       <WelcomeBanner />
        <StatsGrid />
    </div>
  );
}