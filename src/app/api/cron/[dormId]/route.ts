import { NextResponse } from "next/server";
import { campus } from "~/lib/new-util";
import { api } from "~/trpc/server";

export async function GET({ params }: { params: Promise<{ dormId: string }> }) {
  const { dormId } = await params;

  if (!dormId || typeof dormId !== "string") {
    return NextResponse.json(
      { status: "error", message: "Invalid dormId parameter" },
      { status: 400 },
    );
  }

  try {
    console.log(`Cron job started for building with ID: ${dormId}`);

    const building = campus.getBuilding({ id: dormId });

    if (!building) {
      return NextResponse.json(
        {
          status: "error",
          message: `Building with ID ${dormId} not found`,
        },
        { status: 404 },
      );
    }

    for (const floor of building.getLaundryFloors()) {
      console.log(`Processing ${floor.laundryRoomId}: ${floor.displayName}`);

      await api.laundry.update({ key: floor.laundryRoomId });
      console.log(`Updated ${floor.laundryRoomId} successfully`);
    }

    console.log(`Cron job completed for dormId: ${dormId}`);
    return NextResponse.json(
      {
        status: "success",
        message: `Cron job successfully executed for dorm ${dormId}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error executing cron job:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
