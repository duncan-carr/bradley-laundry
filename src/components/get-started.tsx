"use client";

import { useLocationStore } from "~/lib/laundry-util";
import { campus } from "~/lib/new-util";
import { WelcomeDialog } from "./welcome-dialog";
import { Button } from "./ui/button";
import Link from "next/link";

export default function GetStarted({}) {
  const locationStore = useLocationStore();

  if (!locationStore.building || !locationStore.floor) {
    return (
      <div>
        <h1 className="mt-4 text-4xl font-bold text-pretty">
          Do your laundry the smart way
        </h1>
        <p className="my-2 max-w-[36rem] text-lg font-light">
          Select your building and your floor number to let us find your closest
          open machine for you, or select your building to see all machines.
        </p>
        <div className="py-2 pb-10">
          <WelcomeDialog />
        </div>
      </div>
    );
  }

  const building = campus.getBuilding({ id: locationStore.building });

  if (!building) {
    return (
      <div>
        <h1 className="mt-4 text-4xl font-bold text-pretty">
          Do your laundry the smart way
        </h1>
        <p className="my-2 max-w-[36rem] text-lg font-light">
          Select your building and your floor number to let us find your closest
          open machine for you, or select your building to see all machines.
        </p>
        <div className="py-2 pb-10">
          <WelcomeDialog />
        </div>
      </div>
    );
  }

  const floor = building
    .getFloors()
    .find((floor) => floor.id.toString() === locationStore.floor);

  if (!floor) {
    return (
      <div>
        <h1 className="mt-4 text-4xl font-bold text-pretty">
          Do your laundry the smart way
        </h1>
        <p className="my-2 max-w-[36rem] text-lg font-light">
          You&apos;ve set your building to be {building.displayName}, but we do
          not have information on your floor. A challenging feat!
        </p>
        <div className="py-2 pb-10">
          <WelcomeDialog text="Edit Location" />
        </div>
      </div>
    );
  }

  const closestLaundryFloor = building.getClosestLaundryFloor(floor.id);

  return (
    <div>
      <h1 className="mt-4 text-4xl font-bold text-pretty">
        Do your laundry the smart way
      </h1>
      <p className="my-2 max-w-[40rem] text-lg font-light">
        Currently, you are set to live on{" "}
        <span className="font-bold">
          {building.displayName} {floor.displayName}
        </span>
        . Soon, this information will be used to automatically find the nearest
        open machines.
      </p>
      <div className="flex gap-2 py-2 pb-10">
        {closestLaundryFloor ? (
          <Button asChild>
            <Link href={`/dorms/${building.id}#${closestLaundryFloor.id}`}>
              See closest laundry room
            </Link>
          </Button>
        ) : (
          <Button disabled>No laundry room found</Button>
        )}

        <WelcomeDialog variant="outline" text="Edit Location" />
      </div>
    </div>
  );
}
