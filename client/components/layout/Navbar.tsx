"use client";

import {
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {

  return (

    <header
      className="
        sticky
        top-0
        z-50
        flex
        h-16
        items-center
        justify-between
        border-b
        border-slate-800
        bg-slate-950/95
        px-8
        backdrop-blur
      "
    >

      {/* Left */}

      <div className="flex items-center gap-6">

        <h1 className="text-xl font-bold text-white">

          QuizVerse AI

        </h1>

        <div className="relative hidden lg:block">

          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <Input
            placeholder="Search..."
            className="
              w-72
              border-slate-700
              bg-slate-900
              pl-10
              text-white
            "
          />

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-4">

        <div
          className="
            rounded-lg
            bg-indigo-600
            px-4
            py-2
            text-sm
            font-semibold
            text-white
          "
        >

          XP 520

        </div>

        <Button
          size="icon"
          variant="ghost"
        >

          <Bell />

        </Button>

        <DropdownMenu>

          <DropdownMenuTrigger asChild>

            <Button
              variant="ghost"
              className="gap-2"
            >

              <Avatar>

                <AvatarFallback>

                  TS

                </AvatarFallback>

              </Avatar>

              <span className="hidden md:block">

                Trishul

              </span>

              <ChevronDown size={16} />

            </Button>

          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
          >

            <DropdownMenuItem>

              Profile

            </DropdownMenuItem>

            <DropdownMenuItem>

              Settings

            </DropdownMenuItem>

            <DropdownMenuItem>

              Logout

            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </div>

    </header>

  );

}