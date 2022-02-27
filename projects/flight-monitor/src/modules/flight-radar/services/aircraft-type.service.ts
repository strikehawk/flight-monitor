import { Injectable } from "@angular/core";
import data from "../../../../../../samples/icao-aircraft-type-mesh.json";
import meshes from "../../../../../../samples/meshes.json";

export interface AircraftTypeData {
  /**
   * ICAO aircraft type designator.
   */
  designator: string;

  /**
   * Name of the .OBJ file containing the mesh for the aircraft.
   */
  filename: string;

  /**
   * Size, in meters, of the real aircraft.
   */
  size: number;
}

export interface MeshData {
  filename: string;
  size: number;
}

@Injectable({
  providedIn: "root"
})
export class AircraftTypeService {

  public readonly aircraftTypes: Map<string, AircraftTypeData> = new Map<string, AircraftTypeData>();

  constructor() {
    this._parseData();
  }

  private _parseData(): void {
    const meshesMap = new Map<string, any>();
    for (const mesh of (meshes as MeshData[])) {
      meshesMap.set(mesh.filename, mesh);
    }

    for (const aircraftType of (data as AircraftTypeData[])) {
      aircraftType.size = meshesMap.get(aircraftType.filename).size;
      this.aircraftTypes.set(aircraftType.designator, aircraftType);
    }
  }
}
