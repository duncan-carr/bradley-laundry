import { z } from "zod";
import {
  countMachinesInUse,
  getCurrentDayAndTimeBucket,
  mapCscToMachineData,
  mapMachineDataToSupabase,
  type MachineData,
} from "~/lib/laundry-util";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { supabase } from "~/server/database/supabase";

export const laundryRouter = createTRPCRouter({
  getFromAPI: publicProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .query(async ({ input }) => {
      // const key = getKeyForLocation({
      //   buildingName: input.building,
      //   roomName: input.room,
      // });

      // if (!key) {
      //   throw new Error("Invalid location");
      // }

      const response = await fetch(
        `https://mycscgo.com/api/v1/location/c0a88120-c994-4581-8f6f-51f35533cf5c/room/${input.key}/machines`,
      );

      if (!response.ok) {
        throw Error(`Could not update machines for key ${input.key}`);
      }

      const jsonMachines = await response.json();
      const machines: MachineData[] =
        jsonMachines.map(mapCscToMachineData) ?? [];

      return machines;
    }),
  getUsage: publicProcedure
    .input(
      z.object({
        keys: z.array(z.string()),
      }),
    )
    .query(async ({ input }) => {
      const timeBucket = getCurrentDayAndTimeBucket();

      const { data: usageData, error } = await supabase
        .from("usage_aggregates")
        .select("*")
        .eq("day_of_week", timeBucket.dayOfWeek)
        .in("room_key", input.keys);

      if (error) {
        throw new Error(error.message);
      }

      return usageData;
    }),
  getFromSupabase: publicProcedure
    .input(
      z
        .object({
          building: z.string(),
          room: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      if (!input) {
        const { data, error } = await supabase.from("machines").select("*");
        if (error) throw Error(error.message);
        return data;
      }

      if (!input.room) {
        const { data, error } = await supabase
          .from("machines")
          .select("*")
          .eq("building_name", input.building);
        if (error) throw Error(error.message);
        return data;
      }

      const { data, error } = await supabase
        .from("machines")
        .select("*")
        .eq("building_name", input.building)
        .eq("room_name", input.room);
      if (error) throw Error(error.message);
      return data;
    }),
  update: publicProcedure
    .input(
      z.object({
        key: z.string().length(11, {
          message: "Bradley laundry room keys are exactly 11 characters long.",
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await fetch(
        `https://mycscgo.com/api/v1/location/c0a88120-c994-4581-8f6f-51f35533cf5c/room/${input.key}/machines`,
      );

      if (!response.ok) {
        throw Error(`Could not update machines for key ${input.key}`);
      }

      const jsonMachines = await response.json();
      const machines: MachineData[] =
        jsonMachines.map(mapCscToMachineData) ?? [];

      const supabaseMachines = machines.map(mapMachineDataToSupabase);

      await supabase.from("machines").upsert(supabaseMachines);

      const bucket = getCurrentDayAndTimeBucket();

      console.log("Calculated current time bucket as", JSON.stringify(bucket));

      const machinesInUse = countMachinesInUse(machines);

      const { data } = await supabase
        .from("usage_aggregates")
        .select("*")
        .eq("room_key", input.key)
        .eq("day_of_week", bucket.dayOfWeek)
        .eq("time_bucket", bucket.timeBucket)
        .single();

      if (!data) {
        await supabase.from("usage_aggregates").insert({
          day_of_week: bucket.dayOfWeek,
          time_bucket: bucket.timeBucket,
          room_key: input.key,
          total_count: machinesInUse,
          sample_count: 1,
        });
      } else {
        await supabase
          .from("usage_aggregates")
          .update({
            total_count: (data.total_count ?? 0) + machinesInUse,
            sample_count: (data.sample_count ?? 0) + 1,
          })
          .eq("room_key", input.key)
          .eq("day_of_week", bucket.dayOfWeek)
          .eq("time_bucket", bucket.timeBucket);
      }
    }),
});
