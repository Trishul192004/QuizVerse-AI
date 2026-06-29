"use client";

import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
  const router = useRouter();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    router.replace("/login");
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />

      Logout
    </Button>
  );
}