import { NextResponse } from "next/server";
import { locations } from "~/lib/laundry-util";
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
    const dorm = locations.get(dormId);

    if (!dorm) {
      return NextResponse.json(
        {
          status: "error",
          message: `Dorm with ID ${dormId} not found`,
        },
        { status: 404 },
      );
    }

    for (const [key, value] of dorm) {
      console.log(`Processing ${key}: ${value}`);
      // Simulate processing each item
      await api.laundry.update({ key });
      console.log(`Updated ${key} successfully`);
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
