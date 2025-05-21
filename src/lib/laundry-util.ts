import { DateTime } from "luxon";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Building, campus, type Floor } from "./new-util";

interface LocationState {
  building: string | undefined;
  floor: string | undefined;
  setBuilding: (building: string | undefined) => void;
  setFloor: (floor: string | undefined) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      building: undefined,
      floor: undefined,
      setBuilding: (building: string | undefined) => set({ building }),
      setFloor: (floor: string | undefined) => set({ floor }),
    }),
    {
      name: "location-storage",
    },
  ),
);

const TIMEZONE = "America/Chicago";

export type MachineLocation = {
  building: Building;
  floor: Floor;
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

export function mapCscToMachineData(cscMachine: CSCGoResponse): MachineData {
  const status = cscMachine.available
    ? MachineStatus.AVAILABLE
    : MachineStatus.IN_USE;
  const timeRemaining = cscMachine.timeRemaining;
  const defaultTotalTime = cscMachine.type === "washer" ? 30 : 45;
  const identifier = cscMachine.stickerNumber.toString();
  const location = campus.getLocationForLaundryKey({ id: cscMachine.roomId })!;

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
  const now = DateTime.now().setZone(TIMEZONE);

  // getDay() returns 0 (Sunday) to 6 (Saturday)
  const dayOfWeek = now.weekday % 7;

  const hour = now.hour;
  const minute = now.minute;

  // Calculate the bucket's starting minute.
  const bucketMinute = Math.floor(minute / bucketSize) * bucketSize;

  // Format the hour and minute into "HH:mm:00"
  const formattedHour = hour.toString().padStart(2, "0");
  const formattedMinute = bucketMinute.toString().padStart(2, "0");
  const timeBucket = `${formattedHour}:${formattedMinute}:00`;

  return { dayOfWeek, timeBucket };
}

export function mapMachineDataToSupabase(machine: MachineData) {
  const now = DateTime.now().setZone(TIMEZONE);
  const finished_at =
    machine.status === "in-use"
      ? now.plus({ minutes: machine.timeRemaining }).toISO()
      : null;

  return {
    building_name: machine.location.building.displayName,
    default_total_time: machine.defaultTotalTime,
    finished_at,
    identifier: parseInt(machine.identifier),
    // Set last_update to the current time in ISO format
    last_update: now.toISO() ?? new Date().toISOString(),
    license_plate: machine.licensePlate || null,
    machine_type: machine.type,
    room_name: machine.location.floor.displayName,
    status: (machine.status === MachineStatus.AVAILABLE
      ? "available"
      : "in-use") as "available" | "in-use",
    time_remaining: machine.timeRemaining,
  };
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
