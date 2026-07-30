"use client";

import {
  Coins,
  GraduationCap,
  Star,
  Users,
  BrainCircuit,
} from "lucide-react";

import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">

      <StatCard
        title="XP"
        value="520"
        icon={Star}
      />

      <StatCard
        title="Coins"
        value="120"
        icon={Coins}
      />

      <StatCard
        title="Students"
        value="98"
        icon={Users}
      />

      <StatCard
        title="Classrooms"
        value="12"
        icon={GraduationCap}
      />

      <StatCard
        title="AI Credits"
        value="250"
        icon={BrainCircuit}
      />

    </section>
  );
}