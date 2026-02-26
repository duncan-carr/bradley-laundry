"use client";

import { Droplets, Wind } from "lucide-react";
import { type MachineFilter, useFilterStore } from "~/lib/laundry-util";
import { ModeToggle } from "./theme-toggle";

const filters: { value: MachineFilter; label: string; icon?: React.ReactNode }[] = [
  { value: "all", label: "All" },
  { value: "washer", label: "Washers", icon: <Droplets className="size-3" /> },
  { value: "dryer", label: "Dryers", icon: <Wind className="size-3" /> },
];

export function Toolbar() {
  const { filter, setFilter } = useFilterStore();

  return (
    <div className="sticky top-14 z-40 flex items-center justify-between border-b border-border/40 bg-background/90 px-4 py-2 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-1">
        {filters.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              filter === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
      <ModeToggle />
    </div>
  );
}
