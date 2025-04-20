// app/api/cron/route.ts

import { NextResponse } from "next/server";
import { locations } from "~/lib/laundry-util";
import { api } from "~/trpc/server";

export async function GET() {
  try {
    // Loop through each dorm in the locations Map.
    for (const [dormId, dorm] of locations.entries()) {
      console.log(`Cron job started for dormId: ${dormId}`);

      // Check that the dorm has a valid inner Map.
      if (!dorm) {
        console.warn(`Dorm with ID ${dormId} not found`);
        continue;
      }

      // Loop through each key in the dorm Map.
      for (const [key, value] of dorm.entries()) {
        console.log(
          `Processing key: ${key} (value: ${value}) for dormId: ${dormId}`,
        );
        // Call your TRPC method to update the laundry machine data (or perform another action)
        await api.laundry.update({ key });
        console.log(`Updated key ${key} successfully`);
      }

      console.log(`Cron job completed for dormId: ${dormId}`);
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
