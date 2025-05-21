import { LaundryRoom } from "./laundry-room";
import { api } from "~/trpc/server";
import { campus } from "~/lib/new-util";

export default async function DormPage({
  params,
}: {
  params: Promise<{ dormId: string }>;
}) {
  const building = campus.getBuilding({ id: (await params).dormId });

  if (!building) {
    return (
      <main className="p-6">
        <h1 className="mt-4 text-4xl font-bold text-pretty">Error 404</h1>
        <p className="my-2 max-w-[36rem] text-lg font-light">
          The dorm you are looking for does not exist.
        </p>
      </main>
    );
  }

  const usageData = await api.laundry.getUsage({
    keys: building.getLaundryFloors().map((floor) => floor.laundryRoomId),
  });

  return (
    <main className="flex flex-col gap-6 p-6">
      {building.getLaundryFloors().map((laundryFloor) => (
        <LaundryRoom
          key={laundryFloor.laundryRoomId}
          roomKey={laundryFloor.laundryRoomId}
          usage={usageData.filter(
            (entry) => entry.room_key === laundryFloor.laundryRoomId,
          )}
        />
      ))}
    </main>
  );
}
