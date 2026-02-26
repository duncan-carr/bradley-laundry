import { z } from "zod";
import { mapCscToMachineData, type MachineData } from "~/lib/laundry-util";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const laundryRouter = createTRPCRouter({
  getFromAPI: publicProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .query(async ({ input }) => {
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
});
