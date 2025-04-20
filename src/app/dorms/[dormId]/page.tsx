import { locations } from "~/lib/laundry-util";
import { LaundryRoom } from "./laundry-room";

export default async function DormPage({
  params,
}: {
  params: { dormId: string };
}) {
  const dorm = locations.get(params.dormId);

  if (!dorm) {
    return <div>Dorm not found</div>;
  }

  return (
    <div>
      {Array.from(dorm).map(([key]) => (
        <LaundryRoom key={key} roomKey={key} />
      ))}
    </div>
  );
}
