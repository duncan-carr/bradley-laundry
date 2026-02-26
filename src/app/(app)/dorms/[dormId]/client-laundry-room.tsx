"use client";

import {
  Check,
  CircleCheck,
  Clipboard,
  Droplets,
  Loader2,
  Wind,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Progress } from "~/components/ui/progress";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useFilterStore } from "~/lib/laundry-util";
import { campus } from "~/lib/new-util";
import { api } from "~/trpc/react";

export default function ClientLaundryRoom({
  roomKey,
  variant,
}: {
  roomKey: string;
  variant: "small" | "big";
}) {
  const [copiedPlate, setCopiedPlate] = useState<string | null>(null);
  const filter = useFilterStore((s) => s.filter);
  useEffect(() => {
    if (!copiedPlate) return;
    const timer = setTimeout(() => setCopiedPlate(null), 2000);
    return () => clearTimeout(timer);
  }, [copiedPlate]);

  const { data: machines, isLoading } = api.laundry.getFromAPI.useQuery(
    {
      key: roomKey,
    },
    { refetchInterval: 1000 * 60 },
  );

  const location = campus.getLocationForLaundryKey({ id: roomKey });

  if (!location) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Unable to locate floor with laundry room ID {roomKey}.
      </div>
    );
  }

  // Sort: washers first, then dryers
  const sorted = [...(machines ?? [])].sort((a, b) => {
    if (a.type === b.type) return 0;
    return a.type === "washer" ? -1 : 1;
  });

  // Apply filter
  const filtered =
    filter === "all" ? sorted : sorted.filter((m) => m.type === filter);

  // Counts based on filtered list
  const availableCount = filtered.filter((m) => m.status === "available").length;
  const totalCount = filtered.length;

  if (isLoading) {
    return (
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`#${location.floor.id.toString()}`}
            className={
              variant === "small"
                ? "text-sm font-semibold"
                : "text-base font-bold"
            }
          >
            {variant === "small" ? "" : `${location.building.displayName} `}
            {location.floor.displayName}
          </Link>
          <div className="h-px flex-1 bg-border/60" />
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-14" />
                    <Skeleton className="h-3 w-18" />
                  </div>
                </div>
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className="animate-fade-in-up flex flex-col gap-3"
      id={location.floor.id.toString()}
    >
      {/* Section header with availability count */}
      <div className="flex items-center gap-3">
        <Link
          href={`#${location.floor.id.toString()}`}
          className={
            variant === "small"
              ? "text-sm font-semibold"
              : "text-base font-bold"
          }
        >
          {variant === "small" ? "" : `${location.building.displayName} `}
          {location.floor.displayName}
        </Link>
        <div className="h-px flex-1 bg-border/60" />
        <span className="shrink-0 text-xs text-muted-foreground">
          <span
            className={
              availableCount > 0
                ? "font-bold text-emerald-600 dark:text-emerald-400"
                : "font-bold text-muted-foreground"
            }
          >
            {availableCount}
          </span>
          <span className="text-muted-foreground/60">/{totalCount}</span>
          {" "}open
        </span>
      </div>

      {/* Machine cards grid */}
      <div className="stagger-children grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((machine) => {
          const isAvailable = machine.status === "available";
          const isInUse = machine.status === "in-use";
          const isWasher = machine.type === "washer";

          return (
            <div
              key={machine.identifier}
              className={`relative flex flex-col gap-3 rounded-xl p-4 transition-all duration-200 ${
                isAvailable
                  ? "bg-emerald-50 ring-1 ring-emerald-200/80 dark:bg-emerald-950/30 dark:ring-emerald-500/20"
                  : "bg-card shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
              }`}
            >
              {/* Top row: icon + type + license plate */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex size-9 items-center justify-center rounded-lg ${
                      isAvailable
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isWasher ? (
                      <Droplets className="size-[18px]" />
                    ) : (
                      <Wind className="size-[18px]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      {isWasher ? "Washer" : "Dryer"}
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            void navigator.clipboard.writeText(
                              machine.licensePlate,
                            );
                            setCopiedPlate(machine.licensePlate);
                          }}
                          className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {copiedPlate === machine.licensePlate ? (
                            <Check className="size-2.5 text-emerald-500" />
                          ) : (
                            <Clipboard className="size-2.5" />
                          )}
                          {machine.licensePlate}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {copiedPlate === machine.licensePlate
                            ? "Copied!"
                            : "Copy to clipboard"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Status badge */}
                {isAvailable ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                    <CircleCheck className="size-3" />
                    Open
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    <Loader2 className="animate-pulse-dot size-3" />
                    In use
                  </span>
                )}
              </div>

              {/* Progress bar for in-use machines */}
              {isInUse && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-bold tabular-nums">
                      {machine.timeRemaining === 1
                        ? "1 min"
                        : `${machine.timeRemaining} min`}
                    </span>
                  </div>
                  <Progress
                    className="h-1.5"
                    value={
                      ((machine.defaultTotalTime - machine.timeRemaining) /
                        machine.defaultTotalTime) *
                      100
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
