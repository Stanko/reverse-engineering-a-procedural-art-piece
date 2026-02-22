import type { Point } from './clipper';
import getPolygonArea from './area';

const getDistance = (p1: Point, p2: Point) => {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;

  return Math.sqrt(a * a + b * b);
};

// https://github.com/ayamflow/polygon-centroid/blob/master/index.js
export const getCentroid = (points: Point[]) => {
  var l = points.length;

  return points.reduce(
    function (center, p, i) {
      center.x += p.x;
      center.y += p.y;

      if (i === l - 1) {
        center.x /= l;
        center.y /= l;
      }

      return center;
    },
    { x: 0, y: 0 },
  );
};

export const removeShortEdges = (polygon: Point[], thresholdFactor = 0.2) => {
  const polygonArea = getPolygonArea(polygon);
  const threshold = Math.sqrt(polygonArea) * thresholdFactor;

  return polygon.filter((current, index) => {
    const prev = polygon[(polygon.length + index - 1) % polygon.length];

    if (!prev) {
      return true;
    }

    const d = getDistance(prev, current);

    return d > threshold;
  });
};
