import Voronoi from 'voronoi';
import { type Point } from '../utils/clipper';
import { getCentroid } from '../utils/polygon';
import memoize from 'memoize';

export const getVoronoiData = memoize(
  (width: number, height: number, points: Point[], balanceIterations = 0) => {
    const voronoi = new Voronoi();
    const bbox = { xl: 0, xr: width, yt: 0, yb: height };

    let diagram = voronoi.compute(points, bbox);

    // Balance the diagram
    // In each iteration calculate centroids of each polygon
    // and recalculate the diagram with the centroids as points
    for (let i = 0; i < balanceIterations; i++) {
      const centroids = [];

      for (let i = 0; i < diagram.cells.length; i++) {
        const cell = diagram.cells[i];

        let polygon = getVoronoiCellPolygon(cell);

        if (!polygon) {
          continue;
        }

        centroids.push(getCentroid(polygon));
      }

      diagram = voronoi.compute(centroids, bbox);
    }

    // Neighbors
    const neighborIds = getNeighborIds(diagram);

    return {
      diagram,
      neighborIds,
    };
  },
  {
    cacheKey: (args) => {
      const [width, height, points, balanceIterations] = args;

      const key = [width, height, points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`), balanceIterations]
        .map((value) => JSON.stringify(value))
        .join('_');

      return key;
    },
  },
);

// ----- HELPERS ----- //

// Remap half-edges into polygons
export const getVoronoiCellPolygon = (cell: Voronoi.Cell): Point[] | null => {
  if (cell.halfedges.length) {
    const p: Point[] = [];

    cell.halfedges.forEach((halfEdge) => {
      const start = halfEdge.getStartpoint();
      const current = {
        x: start.x,
        y: start.y,
      };
      p.push(current);
    });

    if (p.length > 2) {
      return p;
    }

    return null;
  }

  return null;
};

// Connect each point and it's polygon with polygons around it
const getNeighborIds = (diagram: Voronoi.VoronoiDiagram) => {
  const ids: number[][] = [];

  diagram.edges.forEach((edge) => {
    if (edge.lSite && edge.rSite) {
      if (!ids[edge.lSite.voronoiId]) {
        ids[edge.lSite.voronoiId] = [];
      }
      if (!ids[edge.rSite.voronoiId]) {
        ids[edge.rSite.voronoiId] = [];
      }

      ids[edge.lSite.voronoiId].push(edge.rSite.voronoiId);
      ids[edge.rSite.voronoiId].push(edge.lSite.voronoiId);
    }
  });

  return ids;
};
