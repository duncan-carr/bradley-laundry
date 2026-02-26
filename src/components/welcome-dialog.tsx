"use client";

import { Building2, MapPin } from "lucide-react";
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

type ButtonVariants =
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined;

export function WelcomeDialog({
  variant = "default",
  text = "Get Started",
}: {
  variant?: ButtonVariants;
  text?: string;
}) {
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
        <Button variant={variant} size="sm" className="h-8 text-xs">
          {variant === "default" && <MapPin className="mr-1.5 size-3.5" />}
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="space-y-2">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>
          <DialogTitle className="text-center text-base">
            Set your location
          </DialogTitle>
          <DialogDescription className="text-center text-xs">
            Stored locally in your browser. Update anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-col gap-4 py-3">
          <div className="flex w-full flex-col gap-1.5">
            <Label htmlFor="building" className="text-xs font-semibold">
              Building
            </Label>
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
            <div className="animate-fade-in-up flex w-full flex-col gap-1.5">
              <Label htmlFor="floor" className="text-xs font-semibold">
                Floor
              </Label>
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
        <DialogFooter className="flex flex-row justify-between gap-2">
          {(building || floor) && (
            <Button
              size="sm"
              variant="destructive"
              className="h-8 text-xs"
              onClick={() => {
                setBuilding(undefined);
                setFloor(undefined);
                setFormState({
                  building: "",
                  floor: "",
                });
              }}
            >
              Delete
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleSave}
            disabled={!formState.building || !formState.floor}
            className="ml-auto h-8 text-xs"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
