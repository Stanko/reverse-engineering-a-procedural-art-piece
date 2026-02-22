/// <reference types="vite/client" />

declare module 'clipper2-wasm/dist/umd/clipper2z' {
  import type { Clipper2ZFactoryFunction } from 'clipper2-wasm/dist/clipper2z';
  const Clipper2ZFactory: Clipper2ZFactoryFunction;
  export default Clipper2ZFactory;
}

declare const COMMIT_HASH: string;

declare module 'voronoi' {
  namespace Voronoi {
    class Point {
      x: number;
      y: number;
    }

    class Site {
      x: number;
      y: number;
      voronoiId: number;
    }

    class Cell {
      site: Site;
      halfedges: HalfEdge[];
      closeMe: boolean;
    }

    class Edge {
      lSite: Site;
      rSite: Site;
      vb: Point;
      va: Point;
    }

    class HalfEdge {
      site: Site;
      edge: Edge;
      angle: number;
      getStartpoint(): Point;
      getEndpoint(): Point;
    }

    class BBox {
      xl: number;
      xr: number;
      yt: number;
      yb: number;
    }

    export class VoronoiDiagram {
      site: any;
      cells: Cell[];
      edges: Edge[];
      vertices: Point[];
      execTime: number;
    }
  }

  class Voronoi {
    constructor(): VoronoiDiagram;
    compute(sites: Voronoi.Point[], bbox: Voronoi.BBox): Voronoi.VoronoiDiagram;
  }

  export default Voronoi;
}
