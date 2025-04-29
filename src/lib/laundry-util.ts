import { DateTime } from "luxon";

export const locations = new Map([
  [
    "geisert",
    new Map([
      ["2320032-013", "Floor 2"],
      ["2320032-019", "Floor 4"],
      ["2320032-020", "Floor 6"],
      ["2320032-021", "Floor 8"],
      ["2320032-022", "Floor 10"],
    ]),
  ],
  ["harper", new Map([["2320032-009", "Harper Hall"]])],
  [
    "heitz",
    new Map([
      ["2320032-007", "Floor 1B"],
      ["2320032-018", "Floor 3B"],
    ]),
  ],
  [
    "williams",
    new Map([
      ["2320032-001", "Floor 1"],
      ["2320032-014", "Floor 2"],
      ["2320032-015", "Floor 3"],
      ["2320032-016", "Floor 4"],
      ["2320032-017", "Floor 5"],
    ]),
  ],
  ["university", new Map([["2320032-002", "University Hall"]])],
  [
    "singles",
    new Map([
      ["2320032-012", "Elmwood Hall"],
      ["2320032-010", "Lovelace Hall"],
      ["2320032-011", "Wendle Hall"],
    ]),
  ],
  [
    "sac",
    new Map([
      ["2320032-003", "Floor 2"],
      ["2320032-023", "Floor 3"],
    ]),
  ],
]);

export type MachineLocation = {
  buildingName: string;
  roomName: string;
};

export enum MachineStatus {
  AVAILABLE = "available",
  IN_USE = "in-use",
  OUT_OF_ORDER = "out-of-order",
}

export enum MachineType {
  WASHER = "washer",
  DRYER = "dryer",
}

export type MachineData = {
  identifier: string;
  status: MachineStatus;
  timeRemaining: number;
  defaultTotalTime: number;
  location: MachineLocation;
  type: MachineType;
  licensePlate: string;
};

export function countMachinesInUse(machines: MachineData[]) {
  return machines.filter((machine) => machine.status === MachineStatus.IN_USE)
    .length;
}

export function getLocationForKey(key: string): {
  buildingName: string;
  roomName: string;
} {
  for (const [location, rooms] of locations) {
    if (rooms.has(key)) {
      return {
        buildingName: `${location.slice(0, 1).toUpperCase() + location.slice(1)} Hall`,
        roomName: rooms.get(key) ?? "Unknown Room",
      };
    }
  }
  return {
    buildingName: "Unknown Building",
    roomName: "Unknown Room",
  };
}

export function getKeyForLocation({
  buildingName,
  roomName,
}: {
  buildingName: string;
  roomName?: string;
}): string | undefined {
  const building = buildingName.split(" ")[0]?.toLowerCase();

  if (!building) {
    throw new Error("Invalid building name");
  }

  const possibleLocations = locations.get(building);

  if (!possibleLocations) {
    throw new Error("Invalid building name");
  }

  if (!roomName) {
    return possibleLocations.keys().next().value;
  }

  return Array.from(possibleLocations.entries()).find(
    (loc) => roomName === loc[1],
  )?.[0];
}

export function mapCscToMachineData(cscMachine: CSCGoResponse): MachineData {
  const status = cscMachine.available
    ? MachineStatus.AVAILABLE
    : MachineStatus.IN_USE;
  const timeRemaining = cscMachine.timeRemaining;
  const defaultTotalTime = cscMachine.type === "washer" ? 30 : 45;
  const identifier = cscMachine.stickerNumber.toString();
  const roomKey = cscMachine.roomId;
  const location = getLocationForKey(roomKey);

  return {
    identifier,
    status,
    timeRemaining,
    defaultTotalTime,
    location,
    type: cscMachine.type === "washer" ? MachineType.WASHER : MachineType.DRYER,
    licensePlate: cscMachine.licensePlate,
  };
}

export type CSCGoResponse = {
  opaqueId: string;
  controllerType: string;
  type: string;
  locationId: string;
  roomId: string;
  stickerNumber: number;
  licensePlate: string;
  nfcId: string;
  qrCodeId: string;
  doorClosed: boolean;
  available: boolean;
  notAvailableReason?: string;
  freePlay: boolean;
  mode: string;
  timeRemaining: number;
};

export type TimeBucket = {
  dayOfWeek: number;
  timeBucket: string;
};

export function getCurrentDayAndTimeBucket(
  bucketSize: number = 15,
): TimeBucket {
  const now = new Date();

  // getDay() returns 0 (Sunday) to 6 (Saturday)
  const dayOfWeek = now.getDay();

  const hour = now.getHours();
  const minute = now.getMinutes();

  // Calculate the bucket's starting minute.
  const bucketMinute = Math.floor(minute / bucketSize) * bucketSize;

  // Format the hour and minute into "HH:mm:00"
  const formattedHour = hour.toString().padStart(2, "0");
  const formattedMinute = bucketMinute.toString().padStart(2, "0");
  const timeBucket = `${formattedHour}:${formattedMinute}:00`;

  return { dayOfWeek, timeBucket };
}

const TIMEZONE = "America/Chicago";

export function mapMachineDataToSupabase(machine: MachineData) {
  const now = DateTime.now().setZone(TIMEZONE);
  const finished_at =
    machine.status === "in-use"
      ? now.plus({ minutes: machine.timeRemaining }).toISO()
      : null;

  return {
    building_name: machine.location.buildingName,
    default_total_time: machine.defaultTotalTime,
    finished_at,
    identifier: parseInt(machine.identifier),
    // Set last_update to the current time in ISO format
    last_update: now.toISO() ?? new Date().toISOString(),
    license_plate: machine.licensePlate || null,
    machine_type: machine.type,
    room_name: machine.location.roomName,
    status: (machine.status === MachineStatus.AVAILABLE
      ? "available"
      : "in-use") as "available" | "in-use",
    time_remaining: machine.timeRemaining,
  };
}

/**
 * Returns the machine key that corresponds to a given building and room.
 *
 * For example, given MachineLocation:
 * { buildingName: "Geisert Hall", roomName: "Floor 2" }
 * the function returns "2320032-013".
 *
 * @param location - The building and room information.
 * @returns The machine key if found, or undefined if no match exists.
 */
export function getMachineKey(location: MachineLocation): string | undefined {
  // Normalize the input building name for simple matching.
  const normalizedBuildingName = location.buildingName.toLowerCase();

  for (const [buildingKey, roomsMap] of locations.entries()) {
    // Check if the normalized building name includes the key.
    // For example, "geisert hall" includes "geisert".
    if (normalizedBuildingName.includes(buildingKey)) {
      // Loop over each room mapping in the building's rooms map.
      for (const [machineKey, roomLabel] of roomsMap.entries()) {
        if (roomLabel.toLowerCase() === location.roomName.toLowerCase()) {
          return machineKey;
        }
      }
    }
  }
  return undefined;
}

interface TimeRecordInput {
  day_of_week: number;
  room_key: string;
  sample_count: number | null;
  time_bucket: string;
  total_count: number | null;
}

export interface HourlyAverage {
  hour: string;
  hour24: number;
  average_usage: number;
}

function formatHourTo12Hour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

export function getHour24(time: string): number {
  return parseInt(time.split(":")[0]!, 10);
}

export function aggregateToHourly(records: TimeRecordInput[]): HourlyAverage[] {
  const hourlyAverages = new Map<number, { entries: number; total: number }>();

  for (const record of records) {
    const hour24 = getHour24(record.time_bucket);

    const currentTotal = hourlyAverages.get(hour24) ?? { entries: 0, total: 0 };

    hourlyAverages.delete(hour24);

    hourlyAverages.set(hour24, {
      entries: currentTotal.entries + 1,
      total:
        currentTotal.total +
        (record.total_count ?? 0) / (record.sample_count ?? 1),
    });
  }

  const unsorted = Array.from(hourlyAverages.entries()).map((i) => {
    const hour24 = i[0];
    const value = i[1];

    return {
      hour: formatHourTo12Hour(hour24),
      hour24: hour24,
      average_usage: value.total / (value.entries === 0 ? 1 : value.entries),
    };
  });

  // Sort by 24-hour time
  return unsorted.sort((a, b) => a.hour24 - b.hour24);
}
