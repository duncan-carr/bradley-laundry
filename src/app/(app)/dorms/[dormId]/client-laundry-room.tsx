"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Skeleton } from "~/components/ui/skeleton";
import { campus } from "~/lib/new-util";
import { api } from "~/trpc/react";

export default function ClientLaundryRoom({
  roomKey,
  variant,
}: {
  roomKey: string;
  variant: "small" | "big";
}) {
  const { data: machines, isLoading } = api.laundry.getFromAPI.useQuery(
    {
      key: roomKey,
    },
    { refetchInterval: 1000 * 60 },
  );

  const location = campus.getLocationForLaundryKey({ id: roomKey });

  if (!location) {
    return (
      <p className="text-red-500">
        Error: Unable to locate floor with laundry room ID {roomKey}.
      </p>
    );
  }

  if (isLoading) {
    return (
      <>
        <Link
          href={`#${location.floor.id.toString()}`}
          className={
            variant === "small" ? "text-lg font-bold" : "text-2xl font-bold"
          }
        >
          {variant === "small" ? "" : location.building.displayName}
          {variant === "small" ? "" : " "}
          {location.floor.displayName}
        </Link>
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-28 w-80"></Skeleton>
          <Skeleton className="h-28 w-80"></Skeleton>
          <Skeleton className="h-28 w-80"></Skeleton>
          <Skeleton className="h-28 w-80"></Skeleton>
        </div>
      </>
    );
  }

  return (
    <section className="flex flex-col gap-4" id={location.floor.id.toString()}>
      <Link
        href={`#${location.floor.id.toString()}`}
        className={
          variant === "small" ? "text-lg font-bold" : "text-2xl font-bold"
        }
      >
        {variant === "small" ? "" : location.building.displayName}
        {variant === "small" ? "" : " "}
        {location.floor.displayName}
      </Link>
      <div className="flex flex-wrap gap-4">
        {(machines ?? []).map((machine) => {
          return (
            <Card key={machine.identifier} className="w-80">
              <CardHeader>
                <CardTitle>
                  {machine.type.slice(0, 1).toUpperCase() +
                    machine.type.slice(1)}
                </CardTitle>
                <CardDescription>
                  {machine.identifier}: {machine.licensePlate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {machine.status === "in-use" && (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p className="text-sm">
                      {machine.timeRemaining === 1
                        ? `${machine.timeRemaining} minute`
                        : `${machine.timeRemaining} minutes`}
                    </p>
                    <Progress
                      className="w-full"
                      value={
                        ((machine.defaultTotalTime - machine.timeRemaining) /
                          machine.defaultTotalTime) *
                        100
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
