import type { MainModule, Path64, Paths64, JoinType, EndType } from 'clipper2-wasm/dist/clipper2z';
import Clipper2ZFactory from 'clipper2-wasm/dist/umd/clipper2z';
import wasmFile from 'clipper2-wasm/dist/es/clipper2z.wasm?url';

// ----- Types ----- //

export interface Point {
  x: number;
  y: number;
}

type JoinTypeString = 'square' | 'round' | 'miter';

type EndTypeString = 'polygon' | 'joined' | 'butt' | 'square' | 'round';

// ----- Constants ----- //

const SCALE = 100;

// ----- Initialization ----- //

let clipper: MainModule;
let promise: Promise<MainModule>;

export async function initClipper(): Promise<MainModule> {
  // Return the existing instance if it exists
  if (clipper) {
    return clipper;
  }

  // If a promise is already in progress, wait for it to resolve instead of creating a new one
  if (promise) {
    return await promise;
  }

  // Save the promise to avoid multiple initializations
  promise = Clipper2ZFactory({
    locateFile: () => {
      return wasmFile;
    },
  });

  // Save the shared instance
  clipper = await promise;

  return clipper;
}

// ----- Conversion helpers ----- //

const toPath64 = (polygon: Point[]): Path64 => {
  const { MakePath64 } = clipper;

  const points = polygon
    .map((point) => {
      return [Math.round(point.x * SCALE), Math.round(point.y * SCALE)];
    })
    .flat();

  const path = MakePath64(points);
  return path;
};

const toPaths64 = (polygons: Point[][]): Paths64 => {
  const { Paths64 } = clipper;
  const paths = new Paths64();

  polygons.forEach((polygon) => {
    const path = toPath64(polygon);
    paths.push_back(path);
  });

  return paths;
};

const fromPath64 = (path: Path64): Point[] => {
  const polygon: Point[] = [];

  for (let i = 0; i < path.size(); i++) {
    const p = path.get(i);

    polygon.push({
      x: Number(p.x) / SCALE,
      y: Number(p.y) / SCALE,
    });
  }

  return polygon;
};

const fromPaths64 = (paths: Paths64): Point[][] => {
  // const { Paths64 } = clipper;
  const polygons: Point[][] = [];

  for (let i = 0; i < paths.size(); i++) {
    const path = paths.get(i);
    const polygon = fromPath64(path);
    polygons.push(polygon);
  }

  return polygons;
};

// ----- Offset ------ //

export const clipperOffset = (
  polygons: Point[][],
  delta: number,
  joinType: JoinTypeString = 'round',
  endType: EndTypeString = 'round',
  miterLimit: number = 2,
  arcTolerance: number = 0,
): Point[][] => {
  const { InflatePaths64, JoinType: JoinTypeValue, EndType: EndTypeValue } = clipper;

  const joinTypeMap: Record<JoinTypeString, JoinType> = {
    square: JoinTypeValue.Square,
    round: JoinTypeValue.Round,
    miter: JoinTypeValue.Miter,
  };

  const endTypeMap: Record<EndTypeString, EndType> = {
    polygon: EndTypeValue.Polygon,
    joined: EndTypeValue.Joined,
    butt: EndTypeValue.Butt,
    square: EndTypeValue.Square,
    round: EndTypeValue.Round,
  };

  if (polygons.length === 0) {
    return [];
  }

  const paths = toPaths64(polygons);
  const offsetPaths = InflatePaths64(
    paths,
    delta * SCALE,
    joinTypeMap[joinType],
    endTypeMap[endType],
    miterLimit * SCALE,
    arcTolerance * SCALE,
  );

  return fromPaths64(offsetPaths);
};
