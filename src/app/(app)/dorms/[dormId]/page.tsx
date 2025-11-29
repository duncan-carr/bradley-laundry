import ClientLaundryRoom from "./client-laundry-room";
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
        <p className="my-2 max-w-xl text-lg font-light">
          The dorm you are looking for does not exist.
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6 p-6">
      {building.getLaundryFloors().map((laundryFloor) => (
        <ClientLaundryRoom
          key={laundryFloor.laundryRoomId}
          variant="small"
          roomKey={laundryFloor.laundryRoomId}
        />
      ))}
    </main>
  );
}
