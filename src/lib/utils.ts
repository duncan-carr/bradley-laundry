import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AnnouncementState {
  readResetSummer2025: boolean;
  markReadResetSummer2025: () => void;
}

export const useAnnouncementStore = create<AnnouncementState>()(
  persist(
    (set) => ({
      readResetSummer2025: false,
      markReadResetSummer2025: () => set({ readResetSummer2025: true }),
    }),
    {
      name: "announcement-storage",
    },
  ),
);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
