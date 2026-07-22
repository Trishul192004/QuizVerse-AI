"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface Props {
  minutes: number;
  onTimeUp: () => void;
}

export default function QuizTimer({
  minutes,
  onTimeUp,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState(
    minutes * 60
  );

  useEffect(() => {
    setSecondsLeft(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const isWarning = secondsLeft <= 60;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-5 py-3 shadow-sm ${
        isWarning
          ? "border-red-500 bg-red-50 text-red-600"
          : "bg-background"
      }`}
    >
      <Clock className="h-5 w-5" />

      <div>
        <p className="text-xs text-muted-foreground">
          Time Remaining
        </p>

        <p className="text-xl font-bold">
          {String(mins).padStart(2, "0")}:
          {String(secs).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}