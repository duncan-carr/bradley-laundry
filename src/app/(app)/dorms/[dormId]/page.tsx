import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { campus } from "~/lib/new-util";
import ClientLaundryRoom from "./client-laundry-room";

export default async function DormPage({
  params,
}: {
  params: Promise<{ dormId: string }>;
}) {
  const building = campus.getBuilding({ id: (await params).dormId });

  if (!building) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" />
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight">
          Building not found
        </h1>
        <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
          The building you&apos;re looking for doesn&apos;t exist or may have
          been moved.
        </p>
        <Button asChild className="mt-5" variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-1.5 size-3.5" />
            Back to home
          </Link>
        </Button>
      </main>
    );
  }

  const laundryFloors = building.getLaundryFloors();

  return (
    <main className="flex flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      {/* Building header */}
      <div>
        <Link
          href="/"
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          All buildings
        </Link>
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">
          {building.displayName}
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {laundryFloors.length}{" "}
          {laundryFloors.length === 1 ? "laundry room" : "laundry rooms"}
        </p>
      </div>

      {/* Laundry rooms */}
      <div className="flex flex-col gap-8">
        {laundryFloors.map((laundryFloor) => (
          <ClientLaundryRoom
            key={laundryFloor.laundryRoomId}
            variant="small"
            roomKey={laundryFloor.laundryRoomId}
          />
        ))}
      </div>
    </main>
  );
}
