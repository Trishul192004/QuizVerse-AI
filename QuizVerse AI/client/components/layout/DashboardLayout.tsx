"use client";

import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface DashboardLayoutProps {    
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {

  return (

    <div className="flex h-screen bg-slate-950">

      {/* Sidebar */}

      <Sidebar />

      {/* Right Side */}

      <div className="flex flex-1 flex-col">

        {/* Navbar */}

        <Navbar />

        {/* Page */}

        <main
          className="
            flex-1
            overflow-y-auto
            bg-slate-950
            p-8
          "
        >

          {children}

        </main>

      </div>

    </div>

  );

}