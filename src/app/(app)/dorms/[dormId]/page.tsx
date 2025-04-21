import { locations } from "~/lib/laundry-util";
import { LaundryRoom } from "./laundry-room";

export default async function DormPage({
  params,
}: {
  params: { dormId: string };
}) {
  const dorm = locations.get(params.dormId);

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

  return (
    <main className="flex flex-col gap-6 p-6">
      {Array.from(dorm).map(([key]) => (
        <LaundryRoom key={key} roomKey={key} />
      ))}
    </main>
  );
}
