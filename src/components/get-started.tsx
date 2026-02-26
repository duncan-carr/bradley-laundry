"use client";

import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useLocationStore } from "~/lib/laundry-util";
import { campus } from "~/lib/new-util";
import { WelcomeDialog } from "./welcome-dialog";
import { Button } from "./ui/button";
import ClientLaundryRoom from "~/app/(app)/dorms/[dormId]/client-laundry-room";

export default function GetStarted({}) {
  const locationStore = useLocationStore();

  // No location set - show full hero CTA
  if (!locationStore.building || !locationStore.floor) {
    return (
      <section className="relative border-b border-border/40 px-4 py-10 md:px-6 md:py-14">
        <div className="relative max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Bradley University
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Find open machines,
            <br />
            <span className="text-muted-foreground">skip the wait.</span>
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Set your building and floor to instantly see the nearest available
            washers and dryers.
          </p>
          <div className="mt-6">
            <WelcomeDialog />
          </div>
        </div>
      </section>
    );
  }

  const building = campus.getBuilding({ id: locationStore.building });

  if (!building) {
    return (
      <section className="relative border-b border-border/40 px-4 py-10 md:px-6 md:py-14">
        <div className="relative max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Bradley University
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Find open machines,
            <br />
            <span className="text-muted-foreground">skip the wait.</span>
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Set your building and floor to instantly see the nearest available
            washers and dryers.
          </p>
          <div className="mt-6">
            <WelcomeDialog />
          </div>
        </div>
      </section>
    );
  }

  const floor = building
    .getFloors()
    .find((floor) => floor.id.toString() === locationStore.floor);

  if (!floor) {
    return (
      <section className="relative border-b border-border/40 px-4 py-10 md:px-6 md:py-14">
        <div className="relative max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            Bradley University
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Find open machines,
            <br />
            <span className="text-muted-foreground">skip the wait.</span>
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            You&apos;ve set your building to{" "}
            <span className="font-semibold text-foreground">
              {building.displayName}
            </span>
            , but we don&apos;t have info on your floor.
          </p>
          <div className="mt-6">
            <WelcomeDialog text="Edit Location" />
          </div>
        </div>
      </section>
    );
  }

  const closestLaundryFloor = building.getClosestLaundryFloor(floor.id);

  return (
    <section className="border-b border-border/40">
      {/* Compact hero when location is set */}
      <div className="px-4 py-6 md:px-6 md:py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MapPin className="size-3" />
              <span>Your location</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">
              {building.displayName}
              <span className="font-normal text-muted-foreground">
                {" "}&middot; {floor.displayName}
              </span>
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button asChild size="sm" className="h-8 text-xs">
                <Link href={`/dorms/${building.id}`}>
                  See all rooms
                  <ArrowRight className="ml-1 size-3" />
                </Link>
              </Button>
              <WelcomeDialog variant="outline" text="Edit" />
            </div>
          </div>
        </div>
      </div>

      {/* Nearest laundry room preview */}
      {closestLaundryFloor ? (
        <div className="px-4 pb-6 md:px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Nearest laundry room
          </p>
          <ClientLaundryRoom
            variant="big"
            roomKey={closestLaundryFloor.laundryRoomId!}
          />
        </div>
      ) : (
        <div className="px-4 pb-6 md:px-6">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dorms/${building.id}`}>
              See {building.displayName}&apos;s laundry rooms
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
