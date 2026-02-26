import { ArrowUpRight, Building2 } from "lucide-react";
import Link from "next/link";
import GetStarted from "~/components/get-started";

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
    <main className="flex flex-col">
      {/* Hero Section */}
      <GetStarted />

      {/* Building Grid */}
      <section className="px-4 pb-12 pt-8 md:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              All Buildings
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {buildings.length} residence halls on campus
            </p>
          </div>
          <a
            href="https://github.com/duncan-carr/bradley-laundry"
            target="_blank"
            className="group flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="hidden sm:inline">Open source</span>
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
          </a>
        </div>
        <div className="stagger-children grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {buildings.map((building) => (
            <Link key={building.name} href={building.url} className="group">
              <div className="flex items-center gap-3 rounded-xl border border-transparent bg-card p-3.5 shadow-sm ring-1 ring-black/[0.04] transition-all duration-200 group-hover:shadow-md group-hover:ring-black/[0.08] dark:ring-white/[0.06] dark:group-hover:ring-white/[0.1]">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Building2 className="size-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-tight">
                    {building.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {building.rooms > 1
                      ? `${building.rooms} laundry rooms`
                      : `${building.rooms} laundry room`}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
