import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/server";

const buildings = [
  {
    name: "Geisert Hall",
    url: "/dorms/geisert",
    rooms: 5,
  },
  {
    name: "Harper Hall",
    url: "/dorms/harper",
    rooms: 1,
  },
  {
    name: "Heitz Hall",
    url: "/dorms/heitz",
    rooms: 2,
  },
  {
    name: "University Hall",
    url: "/dorms/university",
    rooms: 1,
  },
  {
    name: "Williams Hall",
    url: "/dorms/williams",
    rooms: 5,
  },
];

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
      <h1 className="mt-4 text-4xl font-bold text-pretty">
        Do your laundry the smart way
      </h1>
      <p className="my-2 max-w-[36rem] text-lg font-light">
        Easily view all laundry machines in your building to efficiently plan
        your laundry. Students deserve to have a better laundry experience.
      </p>
      <h3 className="text-2xl font-semibold">
        Select your building to get started...
      </h3>
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
