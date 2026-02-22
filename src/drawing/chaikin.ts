import type { Point } from '../utils/clipper';

function cut(start: Point, end: Point, ratio: number): [Point, Point] {
  const r1: Point = {
    x: start.x * (1 - ratio) + end.x * ratio,
    y: start.y * (1 - ratio) + end.y * ratio,
  };

  const r2: Point = {
    x: start.x * ratio + end.x * (1 - ratio),
    y: start.y * ratio + end.y * (1 - ratio),
  };

  return [r1, r2];
}

export default function chaikin(
  curve: readonly Point[],
  iterations: number = 1,
  closed: boolean = false,
  ratio: number = 0.25,
): Point[] {
  let r = ratio > 0.5 ? 1 - ratio : ratio;

  let current: Point[] = curve.slice();

  for (let i = 0; i < iterations; i++) {
    let refined: Point[] = [];
    refined.push(current[0]);

    for (let j = 1; j < current.length; j++) {
      refined.push(...cut(current[j - 1], current[j], r));
    }

    if (closed) {
      refined.shift();
      refined.push(...cut(current[current.length - 1], current[0], r));
    } else {
      refined.push(current[current.length - 1]);
    }

    current = refined;
  }

  return current;
}
