"use client";

import { Button } from "./ui/button";
import { useAnnouncementStore } from "~/lib/utils";
import { useEffect, useState } from "react";

export function AnnouncementBar() {
  const [isHydrated, setIsHydrated] = useState(false);
  const readResetSummer2025 = useAnnouncementStore(
    (state) => state.readResetSummer2025 ?? true,
  );
  const markReadResetSummer2025 = useAnnouncementStore(
    (state) => state.markReadResetSummer2025,
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {!readResetSummer2025 && (
        <div className="bg-amber-400 px-6 py-1.5 dark:bg-amber-600">
          <p className="text-sm">
            Data for the usage charts has been reset as usage will change
            throughout the summer.{" "}
            <Button
              size="sm"
              variant="link"
              className="cursor-pointer underline"
              onClick={markReadResetSummer2025}
            >
              I understand
            </Button>
          </p>
        </div>
      )}
    </>
  );
}
