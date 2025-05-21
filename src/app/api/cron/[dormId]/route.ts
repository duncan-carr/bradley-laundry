import { NextResponse } from "next/server";
import { campus } from "~/lib/new-util";
import { api } from "~/trpc/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dormId: string }> },
) {
  const { dormId } = await params;

  // Validate the dormId
  if (!dormId || typeof dormId !== "string") {
    return NextResponse.json(
      { status: "error", message: "Invalid dormId parameter" },
      { status: 400 },
    );
  }

  try {
    // Place your cron job logic here.
    // For example, you could call some service functions:
    // await processDormCronJob(dormId);

    console.log(`Cron job started for dormId: ${dormId}`);
    // Simulate processing
    const dorm = campus.getBuilding({ id: dormId });

    if (!dorm) {
      return NextResponse.json(
        {
          status: "error",
          message: `Dorm with ID ${dormId} not found`,
        },
        { status: 404 },
      );
    }

    for (const floor of dorm.getLaundryFloors()) {
      console.log(`Processing ${floor.laundryRoomId}: ${floor.displayName}`);
      // Simulate processing each item
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
