import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import BattleArena from "@/components/battle/BattleArena";
import StatsGrid from "@/components/dashboard/StatsGrid";

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <WelcomeBanner />
      <BattleArena />
      <StatsGrid />
    </div>
  );
}