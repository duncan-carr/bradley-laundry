import { locations } from "~/lib/laundry-util";
import { LaundryRoom } from "./laundry-room";
import { api } from "~/trpc/server";

export default async function DormPage({
  params,
}: {
  params: Promise<{ dormId: string }>;
}) {
  const dorm = locations.get((await params).dormId);

  if (!dorm) {
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
    keys: Array.from(dorm.keys()),
  });

  return (
    <main className="flex flex-col gap-6 p-6">
      {Array.from(dorm).map(([key]) => (
        <LaundryRoom
          key={key}
          roomKey={key}
          usage={usageData.filter((entry) => entry.room_key === key)}
        />
      ))}
    </main>
  );
}
