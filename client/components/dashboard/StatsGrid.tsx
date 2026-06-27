"use client";

import {
  Coins,
  GraduationCap,
  Star,
  Users,
  BrainCircuit,
} from "lucide-react";

import StatsCard from "./StatsCard";

export default function StatsGrid() {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">

      <StatsCard
        title="XP"
        value="520"
        icon={<Star className="h-6 w-6 text-white" />}
      />

      <StatsCard
        title="Coins"
        value="120"
        icon={<Coins className="h-6 w-6 text-white" />}
      />

      <StatsCard
        title="Students"
        value="98"
        icon={<Users className="h-6 w-6 text-white" />}
      />

      <StatsCard
        title="Classrooms"
        value="12"
        icon={<GraduationCap className="h-6 w-6 text-white" />}
      />

      <StatsCard
        title="AI Credits"
        value="250"
        icon={<BrainCircuit className="h-6 w-6 text-white" />}
      />

    </section>
  );
}