export interface Floor {
  id: number;
  displayName: string;
  hasLaundry: boolean;
  laundryRoomId?: string;
}

interface LaundryFloor {
  id: number;
  displayName: string;
  hasLaundry: boolean;
  laundryRoomId: string;
}

export class Building {
  private floors: Map<number, Floor>;

  constructor(
    public readonly id: string,
    public readonly displayName: string,
    public readonly parentBuilding?: Building,
  ) {
    this.floors = new Map();
  }

  addFloor({
    floorId,
    displayName,
    laundryRoomId,
  }: {
    floorId: number;
    displayName: string;
    laundryRoomId?: string;
  }): void {
    this.floors.set(floorId, {
      id: floorId,
      displayName,
      hasLaundry: !!laundryRoomId,
      laundryRoomId,
    });
  }

  getFloors(): Floor[] {
    return Array.from(this.floors.values());
  }

  getLaundryFloors(): LaundryFloor[] {
    const laundryFloors = this.getFloors().filter((floor) => floor.hasLaundry);

    return laundryFloors.map((floor) => {
      return {
        id: floor.id,
        displayName: floor.displayName,
        hasLaundry: true,
        laundryRoomId: floor.laundryRoomId!,
      };
    });
  }

  getFloorWithLaundry(currentFloorId: number): Floor | null {
    const currentFloor = this.floors.get(currentFloorId);
    if (!currentFloor) return null;

    // If current floor has laundry, return it
    if (currentFloor.hasLaundry) return currentFloor;

    // Find the closest floor with laundry
    const floorNumbers = Array.from(this.floors.values()).map((floor) => ({
      floor,
      number: floor.id,
    }));

    let closestFloor: Floor | null = null;
    let minDistance = Infinity;

    for (const { floor, number } of floorNumbers) {
      if (floor.hasLaundry) {
        const distance = Math.abs(number - currentFloorId);
        if (distance < minDistance) {
          minDistance = distance;
          closestFloor = floor;
        }
      }
    }

    return closestFloor;
  }

  getSubBuildings(campus: CampusLaundry): Building[] {
    return campus
      .getAllBuildings()
      .filter((building) => building.parentBuilding?.id === this.id);
  }

  isPartOfComplex(campus: CampusLaundry): boolean {
    return this.isSubBuilding() ? true : this.isParentBuilding(campus);
  }

  isParentBuilding(campus: CampusLaundry): boolean {
    return this.getSubBuildings(campus).length > 0;
  }

  isSubBuilding() {
    return this.parentBuilding ? true : false;
  }
}

class CampusLaundry {
  private buildings: Map<string, Building>;

  constructor() {
    this.buildings = new Map();
  }

  addBuilding({
    id,
    displayName,
    parentBuilding,
  }: {
    id: string;
    displayName: string;
    parentBuilding?: Building;
  }): Building {
    const building = new Building(id, displayName, parentBuilding);
    this.buildings.set(id, building);
    return building;
  }

  getBuilding({ id }: { id: string }): Building | undefined {
    return this.buildings.get(id);
  }

  getAllBuildings(allowComplexes: boolean = true): Building[] {
    if (!allowComplexes) {
      return Array.from(this.buildings.values()).filter(
        (building) => !building.isPartOfComplex(this),
      );
    }
    return Array.from(this.buildings.values());
  }

  getAllParentBuildings(): Building[] {
    return this.getAllBuildings().filter((building) =>
      building.isParentBuilding(this),
    );
  }

  getLocationForLaundryKey({
    id,
  }: {
    id: string;
  }): { building: Building; floor: Floor } | undefined {
    const nonParentBuildings = this.getAllBuildings().filter(
      (b) => !b.isParentBuilding(this),
    );

    for (const building of nonParentBuildings) {
      for (const laundryFloor of building.getLaundryFloors()) {
        if (laundryFloor.laundryRoomId === id)
          return { building, floor: laundryFloor };
      }
    }
    return undefined;
  }
}

export const campus = new CampusLaundry();

const geisert = campus.addBuilding({
  id: "geisert",
  displayName: "Geisert Hall",
});

geisert.addFloor({ floorId: 1, displayName: "Floor 1" });
geisert.addFloor({
  floorId: 2,
  displayName: "Floor 2",
  laundryRoomId: "2320032-013",
});
geisert.addFloor({ floorId: 3, displayName: "Floor 3" });
geisert.addFloor({
  floorId: 4,
  displayName: "Floor 4",
  laundryRoomId: "2320032-019",
});
geisert.addFloor({ floorId: 5, displayName: "Floor 5" });
geisert.addFloor({
  floorId: 6,
  displayName: "Floor 6",
  laundryRoomId: "2320032-020",
});
geisert.addFloor({ floorId: 7, displayName: "Floor 7" });
geisert.addFloor({
  floorId: 8,
  displayName: "Floor 8",
  laundryRoomId: "2320032-021",
});
geisert.addFloor({ floorId: 9, displayName: "Floor 9" });
geisert.addFloor({
  floorId: 10,
  displayName: "Floor 10",
  laundryRoomId: "2320032-022",
});

const harper = campus.addBuilding({
  id: "harper",
  displayName: "Harper Hall",
});

harper.addFloor({
  floorId: 0,
  displayName: "Basement",
  laundryRoomId: "2320032-009",
});
harper.addFloor({ floorId: 1, displayName: "Floor 1" });
harper.addFloor({ floorId: 2, displayName: "Floor 2" });
harper.addFloor({ floorId: 3, displayName: "Floor 3" });
harper.addFloor({ floorId: 4, displayName: "Floor 4" });
harper.addFloor({ floorId: 5, displayName: "Floor 5" });
harper.addFloor({ floorId: 6, displayName: "Floor 6" });
harper.addFloor({ floorId: 7, displayName: "Floor 7" });

const heitz = campus.addBuilding({ id: "heitz", displayName: "Heitz Hall" });
heitz.addFloor({ floorId: 0, displayName: "Ground" });
heitz.addFloor({
  floorId: 1,
  displayName: "Floor 1",
  laundryRoomId: "2320032-007",
});
heitz.addFloor({ floorId: 2, displayName: "Floor 2" });
heitz.addFloor({
  floorId: 3,
  displayName: "Floor 3",
  laundryRoomId: "2320032-018",
});
heitz.addFloor({ floorId: 4, displayName: "Floor 4" });

const williams = campus.addBuilding({
  id: "williams",
  displayName: "Williams Hall",
});
williams.addFloor({
  floorId: 1,
  displayName: "Floor 1",
  laundryRoomId: "2320032-001",
});
williams.addFloor({
  floorId: 2,
  displayName: "Floor 2",
  laundryRoomId: "2320032-014",
});
williams.addFloor({
  floorId: 3,
  displayName: "Floor 3",
  laundryRoomId: "2320032-015",
});
williams.addFloor({
  floorId: 4,
  displayName: "Floor 4",
  laundryRoomId: "2320032-016",
});
williams.addFloor({
  floorId: 5,
  displayName: "Floor 5",
  laundryRoomId: "2320032-017",
});

const university = campus.addBuilding({
  id: "university",
  displayName: "University Hall",
});
university.addFloor({
  floorId: 0,
  displayName: "Basement",
  laundryRoomId: "2320032-002",
});
university.addFloor({ floorId: 1, displayName: "Floor 1" });
university.addFloor({ floorId: 2, displayName: "Floor 2" });
university.addFloor({ floorId: 3, displayName: "Floor 3" });
university.addFloor({ floorId: 4, displayName: "Floor 4" });

const sac = campus.addBuilding({
  id: "sac",
  displayName: "Student Apartment Complex",
});
sac.addFloor({ floorId: 1, displayName: "Floor 1" });
sac.addFloor({
  floorId: 2,
  displayName: "Floor 2",
  laundryRoomId: "2320032-003",
});
sac.addFloor({
  floorId: 3,
  displayName: "Floor 3",
  laundryRoomId: "2320032-023",
});
sac.addFloor({ floorId: 4, displayName: "Floor 4" });
sac.addFloor({ floorId: 5, displayName: "Floor 5" });

const singles = campus.addBuilding({
  id: "singles",
  displayName: "Singles Complex",
});

const elmwood = campus.addBuilding({
  id: "elmwood",
  displayName: "Elmwood Hall",
  parentBuilding: singles,
});

elmwood.addFloor({ floorId: 1, displayName: "Floor 1" });
elmwood.addFloor({
  floorId: 2,
  displayName: "Floor 2",
  laundryRoomId: "2320032-012",
});
elmwood.addFloor({ floorId: 3, displayName: "Floor 3" });

const lovelace = campus.addBuilding({
  id: "lovelace",
  displayName: "Lovelace Hall",
  parentBuilding: singles,
});

lovelace.addFloor({ floorId: 1, displayName: "Floor 1" });
lovelace.addFloor({
  floorId: 2,
  displayName: "Floor 2",
  laundryRoomId: "2320032-010",
});
lovelace.addFloor({ floorId: 3, displayName: "Floor 3" });

const wendle = campus.addBuilding({
  id: "wendle",
  displayName: "Wendle Hall",
  parentBuilding: singles,
});

wendle.addFloor({ floorId: 1, displayName: "Floor 1" });
wendle.addFloor({
  floorId: 2,
  displayName: "Floor 2",
  laundryRoomId: "2320032-011",
});
wendle.addFloor({ floorId: 3, displayName: "Floor 3" });
