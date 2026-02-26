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

export type MachineFilter = "all" | "washer" | "dryer";

interface FilterState {
  filter: MachineFilter;
  setFilter: (filter: MachineFilter) => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  filter: "all",
  setFilter: (filter: MachineFilter) => set({ filter }),
}));

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
