import { ArrowRight } from "lucide-react";
import Link from "next/link";
import GetStarted from "~/components/get-started";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { campus } from "~/lib/new-util";

const buildings = campus
  .getAllBuildings()
  .filter((b) => !b.isParentBuilding(campus))
  .map((b) => {
    return {
      name: b.displayName,
      url: `/dorms/${b.id}`,
      rooms: b.getLaundryFloors().length,
    };
  });

export default async function Page() {
  return (
    <main className="p-6">
      <a
        href="https://github.com/duncan-carr/bradley-laundry"
        target="_blank"
        className="group flex w-fit items-center gap-2 text-sm"
      >
        <p className="text-nowrap group-hover:underline">
          This project is open to contributions
        </p>{" "}
        <ArrowRight className="scale-75" />
      </a>

      <GetStarted />

      <h3 className="text-2xl font-semibold">Or select your building...</h3>
      <section className="flex flex-wrap gap-4 py-6">
        {buildings.map((building) => (
          <Link className="w-80" key={building.name} href={building.url}>
            <Card>
              <CardHeader>
                <CardTitle>{building.name}</CardTitle>
                <CardDescription>
                  {building.rooms > 1
                    ? `${building.rooms} laundry rooms`
                    : `${building.rooms} laundry room`}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
