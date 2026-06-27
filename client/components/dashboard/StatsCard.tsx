"use client";

import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

export default function StatsCard({
  title,
  value,
  icon,
}: StatsCardProps) {

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-400">

            {title}

          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">

            {value}

          </h2>

        </div>

        <div className="rounded-xl bg-indigo-600 p-3">

          {icon}

        </div>

      </div>

    </div>

  );

}