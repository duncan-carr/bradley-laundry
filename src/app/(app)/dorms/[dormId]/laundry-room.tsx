import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { aggregateToHourly, getLocationForKey } from "~/lib/laundry-util";
import { api } from "~/trpc/server";
import { UsageChart } from "./usage-chart";

type UsageData = {
  day_of_week: number;
  room_key: string;
  sample_count: number | null;
  time_bucket: string;
  total_count: number | null;
}[];

export async function LaundryRoom({
  roomKey,
  usage,
}: {
  roomKey: string;
  usage: UsageData;
}) {
  const machines = await api.laundry.getFromAPI({
    key: roomKey,
  });

  const chartData = aggregateToHourly(usage);

  const location = getLocationForKey(roomKey);

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">{location.roomName}</h3>
      <div className="flex flex-wrap gap-4">
        <UsageChart chartData={chartData} />
        {machines.map((machine) => {
          return (
            <Card key={machine.identifier} className="w-80">
              <CardHeader>
                <CardTitle>
                  {machine.type.slice(0, 1).toUpperCase() +
                    machine.type.slice(1)}
                </CardTitle>
                <CardDescription>
                  {machine.identifier}: {machine.licensePlate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {machine.status === "in-use" && (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p className="text-sm">
                      {machine.timeRemaining === 1
                        ? `${machine.timeRemaining} minute`
                        : `${machine.timeRemaining} minutes`}
                    </p>
                    <Progress
                      className="w-full"
                      value={
                        ((machine.defaultTotalTime - machine.timeRemaining) /
                          machine.defaultTotalTime) *
                        100
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
