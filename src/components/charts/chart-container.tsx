"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({ children, className }: ChartContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn("h-[300px] w-full min-w-0", className)}>
      {mounted ? children : null}
    </div>
  );
}
