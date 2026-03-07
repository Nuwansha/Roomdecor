export type ViewMode = "2d" | "3d";

export type ItemType = "sofa" | "table" | "bed" | "chair" | "cabinet";

export type Room = {
  width: number;   // meters
  length: number;  // meters
  height: number;  // meters
  wallColor: string;
  floorColor: string;
};

export type DesignItem = {
  id: string;
  type: ItemType;
  name: string;
  // position in meters (top-down): x in [0,width], z in [0,length]
  x: number;
  z: number;
  // size in meters
  w: number;
  d: number;
  h: number;
  rotY: number; // radians
  color: string;
};

export type Design = {
  id: string;
  name: string;
  room: Room;
  items: DesignItem[];
  shade: number; // 0..1 (lighting intensity)
  updatedAt: number;
};
