"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { LogOut } from "lucide-react";

import { sidebarItems } from "@/constants/sidebar";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuth();

  const role = user?.role ?? "teacher";

  const menu = sidebarItems.find(
    (section) => section.role === role
  );

  const handleLogout = () => {
    logout();

    router.replace("/login");
  };

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-slate-950 text-white">

      {/* ===========================
          Logo
      ============================ */}

      <div className="border-b border-slate-800 p-6">

        <h1 className="text-2xl font-bold">
          QuizVerse AI
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Smart Learning Platform
        </p>

      </div>

      {/* ===========================
          Navigation
      ============================ */}

      <nav className="flex-1 space-y-2 p-4">

        {menu?.items.map((item) => {

          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (

            <Link
              key={item.title}
              href={item.href}
              className={`
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                transition-all
                duration-200

                ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >

              <Icon size={20} />

              <span>
                {item.title}
              </span>

            </Link>

          );

        })}

      </nav>

      {/* ===========================
          User Section
      ============================ */}

      <div className="border-t border-slate-800 p-4">

        <div className="mb-4">

          <p className="font-semibold">
            {user?.username ?? "Guest"}
          </p>

          <p className="text-sm capitalize text-slate-400">
            {user?.role ?? "Teacher"}
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            bg-red-500/10
            px-4
            py-3
            text-red-400
            transition
            hover:bg-red-500
            hover:text-white
          "
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
}