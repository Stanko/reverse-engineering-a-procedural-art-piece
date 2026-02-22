import type Voronoi from 'voronoi';
import type { Options } from '../ui/options-type';
import Alea from '../utils/alea';
import getPolygonArea from '../utils/area';
import { clipperOffset, initClipper, type Point } from '../utils/clipper';
import {
  getPoissonPoints,
  getPoissonLinearPoints,
  getPoissonNoisePoints,
  getRandomPoints,
  getSquarePoints,
} from '../utils/points';
import { removeShortEdges } from '../utils/polygon';
import chaikin from './chaikin';
import { getRandomPaletteConfig, Palette, PALETTES, type PaletteConfig } from './colors';
import { getLines } from './lines';
import { getNoise } from './noise';
import { getTexturePoints } from './texture-points';
import { getVoronoiCellPolygon, getVoronoiData } from './voronoi';
import memoize from '../utils/memoize';

// ----- TYPES ----- //

export type TileType = 'polygon' | 'line' | 'dot';

export interface Tile {
  polygon: Point[];
  offsetPolygon: Point[];
  roundedPolygon: Point[];
  type: TileType;
  point: Point;
  radius: number;
  used: boolean;
  neighbors: Tile[];
  voronoiId: number;
  color: string;
  angle: number;
}

type NoiseFunction = (x: number, y: number) => number;

interface Noises {
  voronoi: NoiseFunction;
  lines: NoiseFunction;
  color: NoiseFunction;
  type: NoiseFunction;
}

// ----- HELPERS ----- //

// ----- Prepare noise functions used for distributions ---- //
const getNoises = (options: Options): Noises => {
  const {
    width,
    height,
    mainSeed,
    mainSeedRng,
    colors,
    voronoi,
    lines,
    fixedColorDistribution,
    fixedTypeDistribution,
  } = options;

  const mainRngDuplicate = Alea(...mainSeed.split('-'));

  const verticalDistribution = (_x: number, y: number) => 1 - y / height;
  const horizontalDistribution = (_x: number, _y: number) => 1 - _x / width;

  const voronoiNoise = getNoise(mainSeedRng, voronoi.distributionEasing, voronoi.noiseScale);
  const linesNoise = getNoise(lines.seedRng, (n) => n, lines.noiseScale);
  const colorNoise = getNoise(colors.seedRng, colors.distributionEasing, colors.noiseScale);
  const typeNoise = getNoise(mainRngDuplicate, voronoi.typesDistributionEasing, voronoi.noiseScale);

  return {
    voronoi: voronoiNoise,
    lines: linesNoise,
    color: fixedColorDistribution ? verticalDistribution : colorNoise,
    type: fixedTypeDistribution ? horizontalDistribution : typeNoise,
  };
};

// ----- Get points for voronoi diagram ----- //
const getPoints = memoize(
  (options: Options, noises: Noises) => {
    const {
      width,
      height,
      voronoi: { points },
      tiles: { size },
    } = options;

    if (points === 'square') {
      return getSquarePoints(width, height, size);
    } else if (points === 'random') {
      return getRandomPoints(width, height, size);
    } else if (points === 'poisson') {
      return getPoissonPoints(width, height, size);
    } else if (points === 'p_linear') {
      return getPoissonLinearPoints(width, height, size);
    }

    return getPoissonNoisePoints(width, height, noises.voronoi, size);
  },
  {
    cacheKey: (args) => {
      const [options] = args;
      const {
        mainSeed,
        width,
        height,
        voronoi: { points, distribution, noiseScale },
        tiles: { size },
      } = options;

      return [mainSeed, width, height, points, distribution, noiseScale, size]
        .map((value) => JSON.stringify(value))
        .join('_');
    },
  },
);

// ----- Get color palette, predefined or random ----- //
const getPalette = (options: Options, noises: Noises) => {
  const { colors } = options;

  let paletteConfig: PaletteConfig;

  if (['0', '1', '2'].includes(colors.palette)) {
    paletteConfig = PALETTES[parseInt(colors.palette, 10)];
  } else {
    paletteConfig = getRandomPaletteConfig(options);
  }

  return new Palette(paletteConfig, colors.useColorsNoise ? noises.color : noises.type, colors.count);
};

// ----- Main method which calculates the tiles ----- //
const getTiles = (
  options: Options,
  noises: Noises,
  palette: Palette,
  diagram: Voronoi.VoronoiDiagram,
  neighborIds: number[][],
) => {
  const {
    fixedTypeDistribution,
    colors: { variation, random: randomColors },
    voronoi: { offset, shortEdgeFactor },
    tiles: { chaikinIterations },
  } = options;

  const tiles: Tile[] = [];
  const tilesMap = new Map<number, Tile>();

  for (let i = 0; i < diagram.cells.length; i++) {
    const cell = diagram.cells[i];
    const point = {
      x: cell.site.x,
      y: cell.site.y,
    };

    // Get the polygon for the cell
    const polygon = getVoronoiCellPolygon(cell);

    if (!polygon) {
      continue;
    }

    // Offset polygon
    const rawOffsetPolygon = clipperOffset([polygon], -offset, 'round', 'polygon')[0];

    if (!rawOffsetPolygon) {
      continue;
    }

    // Remove short edges
    const offsetPolygon = removeShortEdges(rawOffsetPolygon, shortEdgeFactor);

    if (offsetPolygon.length === 0) {
      continue;
    }

    // Round polygon
    const roundedPolygon = chaikin(offsetPolygon, chaikinIterations, true, 0.25);

    // Determine type
    const typeNoiseValue = noises.type(point.x, point.y);

    let type: TileType = 'polygon';

    const lineThreshold = fixedTypeDistribution ? 0.3333 : 0.45;
    const dotThreshold = fixedTypeDistribution ? 0.6666 : 0.55;
    if (typeNoiseValue <= lineThreshold) {
      type = 'line';
    } else if (typeNoiseValue > lineThreshold && typeNoiseValue < dotThreshold) {
      type = 'dot';
    }

    // Add color
    const color = randomColors ? palette.getRandomColor() : palette.getColorAt(point.x, point.y, variation);

    // Angle for lines noise field
    const angle = noises.lines(point.x, point.y) * Math.PI * 2;

    const tile: Tile = {
      point,
      polygon,
      offsetPolygon,
      roundedPolygon,
      type,
      radius: Math.sqrt(getPolygonArea(polygon)) * 0.25,
      neighbors: [],
      voronoiId: cell.site.voronoiId,
      color,
      used: false,
      angle,
    };

    tilesMap.set(tile.voronoiId, tile);
    tiles.push(tile);
  }

  // Add references to neighbor objects
  tiles.forEach((tile) => {
    tile.neighbors = neighborIds[tile.voronoiId]
      .map((id) => {
        return tilesMap.get(id);
      })
      .filter((neighbor) => neighbor !== undefined);
  });

  return tiles;
};

// ----- GENERATE ----- //

const generate = async (options: Options) => {
  const { width, height, voronoi: voronoiConfig } = options;

  // Init clipper wasm library
  console.time('clipper');
  await initClipper();
  console.timeEnd('clipper');

  console.time('noise');
  const noises = getNoises(options);
  console.timeEnd('noise');

  console.time('points');
  const points = getPoints(options, noises);
  console.timeEnd('points');

  console.time('voronoi');
  const { diagram, neighborIds } = getVoronoiData(width, height, points, voronoiConfig.balanceIterations);
  console.timeEnd('voronoi');

  console.time('palette');
  const palette = getPalette(options, noises);
  console.timeEnd('palette');

  console.time('tiles');
  const tiles = getTiles(options, noises, palette, diagram, neighborIds);
  console.timeEnd('tiles');

  console.time('lines');
  const lines = getLines(tiles, options);
  console.timeEnd('lines');

  console.time('texture points');
  const texturePoints = getTexturePoints(width, height, palette, options);
  console.timeEnd('texture points');

  // --------- Main logic

  return {
    points,
    tiles,
    lines,
    texturePoints,
    bg: palette.getBgColor(),
  };
};

export default generate;
