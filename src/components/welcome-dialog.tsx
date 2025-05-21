"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { useLocationStore } from "~/lib/laundry-util";
import { campus } from "~/lib/new-util";

export function WelcomeDialog() {
  const [open, setOpen] = useState(false);
  const { building, floor, setBuilding, setFloor } = useLocationStore();

  const [formState, setFormState] = useState({
    building: building || "",
    floor: floor || "",
  });

  const availableFloors = formState.building
    ? (campus.getBuilding({ id: formState.building })?.getFloors() ?? [])
    : [];

  const handleSave = () => {
    setBuilding(formState.building);
    setFloor(formState.floor);
    setOpen(false);
  };

  const handleBuildingChange = (newBuilding: string) => {
    setFormState({
      building: newBuilding,
      floor: "",
    });
  };

  const handleFloorChange = (newFloor: string) => {
    setFormState((prev) => ({
      ...prev,
      floor: newFloor,
    }));
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setFormState({
        building: building || "",
        floor: floor || "",
      });
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Get Started</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Let&apos;s set up your profile</DialogTitle>
          <DialogDescription>
            Your information is stored in your browser, never by us. You can
            update these at any time.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-4 py-4">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="building">Building</Label>
            <Select
              value={formState.building}
              onValueChange={handleBuildingChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a building" />
              </SelectTrigger>
              <SelectContent>
                {campus.getAllBuildings(false).map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.displayName}
                  </SelectItem>
                ))}

                {campus.getAllParentBuildings().map((parent) => {
                  return (
                    <SelectGroup key={parent.id}>
                      <SelectLabel>{parent.displayName}</SelectLabel>
                      {parent.getSubBuildings(campus).map((bldg) => (
                        <SelectItem key={bldg.id} value={bldg.id}>
                          {bldg.displayName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {formState.building && (
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="floor">Floor</Label>
              <Select value={formState.floor} onValueChange={handleFloorChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a floor" />
                </SelectTrigger>
                <SelectContent>
                  {availableFloors.map((floor) => (
                    <SelectItem key={floor.id} value={floor.id.toString()}>
                      {floor.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!formState.building || !formState.floor}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
