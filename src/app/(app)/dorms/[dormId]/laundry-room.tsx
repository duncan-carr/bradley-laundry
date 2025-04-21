import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { getLocationForKey } from "~/lib/laundry-util";
import type { Database } from "~/server/database/database.types";
import { api } from "~/trpc/server";

function finishedMoreThan15MinutesAgo(machine: {
  building_name: string;
  default_total_time: number;
  finished_at: string | null;
  identifier: number;
  last_update: string;
  license_plate: string | null;
  machine_type: Database["public"]["Enums"]["MachineType"];
  room_name: string;
  status: Database["public"]["Enums"]["LaundryStatus"];
  time_remaining: number;
}) {
  if (!machine.finished_at) return false;

  const now = new Date();
  const finishTime = new Date(machine.finished_at);
  const timeDiff = now.getTime() - finishTime.getTime();
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  return minutesDiff > 15;
}

export async function LaundryRoom({ roomKey }: { roomKey: string }) {
  const location = getLocationForKey(roomKey);
  const machines = await api.laundry.get({
    building: location.buildingName,
    room: location.roomName,
  });

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">{location.roomName}</h3>
      <div className="flex flex-wrap gap-4">
        {machines.map((machine) => (
          <Card key={machine.identifier} className="w-80">
            <CardHeader>
              <CardTitle>
                {machine.machine_type.slice(0, 1).toUpperCase() +
                  machine.machine_type.slice(1)}
              </CardTitle>
              <CardDescription>{machine.license_plate}</CardDescription>
            </CardHeader>
            <CardContent>
              {machine.status === "in-use" && (
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="text-sm">
                    {machine.time_remaining > 1
                      ? `${machine.time_remaining} minutes`
                      : `${machine.time_remaining} minute`}
                  </p>
                  <Progress
                    className="w-full"
                    value={machine.time_remaining}
                    max={machine.default_total_time}
                  />
                </div>
              )}
              {machine.status === "available" &&
                finishedMoreThan15MinutesAgo(machine) && (
                  <p>Machine finished more than 15 minutes ago.</p>
                )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
