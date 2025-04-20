import { api } from "~/trpc/server";

export async function LaundryRoom({ roomKey }: { roomKey: string }) {
  const { machines } = await api.laundry.room({
    key: roomKey,
  });

  return <div>{JSON.stringify(machines)}</div>;
}
