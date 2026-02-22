import type { Point } from './clipper';

/**
 * Calculates the area of a polygon defined by a list of {x, y} points.
 * If `signed` is true, returns the signed area (positive for CCW, negative for CW).
 * Otherwise, returns the absolute area.
 */
export default function getPolygonArea(points: Point[], signed = false): number {
  if (points.length < 3) return 0;

  const closed =
    points[0].x === points[points.length - 1].x && points[0].y === points[points.length - 1].y
      ? points
      : [...points, points[0]];

  let det = 0;
  for (let i = 0; i < points.length; i++) {
    det += closed[i].x * closed[i + 1].y - closed[i].y * closed[i + 1].x;
  }

  const area = det / 2;
  return signed ? area : Math.abs(area);
}
