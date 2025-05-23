import { NextResponse } from "next/server";
import { campus } from "~/lib/new-util";
import { api } from "~/trpc/server";

export async function GET() {
  try {
    for (const building of campus
      .getAllBuildings()
      .filter((b) => !b.isParentBuilding(campus))) {
      console.log(`Cron job started for ${building.displayName}...`);

      for (const floor of building.getLaundryFloors()) {
        console.log(
          `Processing ${floor.laundryRoomId} (${floor.displayName}) for ${building.displayName}`,
        );

        await api.laundry.update({ key: floor.laundryRoomId });
        console.log(`Updated key ${floor.displayName} successfully`);
      }

      console.log(`Cron job completed for ${building.displayName}`);
    }

    return NextResponse.json(
      { status: "success", message: "Cron job executed for all dorms" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error executing cron job:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 },
    );
  }
}
