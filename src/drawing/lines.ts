import type { Point } from '../utils/clipper';
import type { Options } from '../ui/options-type';
import chaikin from './chaikin';
import type { Tile } from './generate';

const shuffle = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

const TAU = Math.PI * 2;

const angleTo = (from: Point, to: Point) => Math.atan2(to.y - from.y, to.x - from.x); // [-PI, PI]

const norm = (a: number) => ((a % TAU) + TAU) % TAU; // [0, 2PI)

const angularDistance = (a: number, b: number) => {
  const d = norm(a - b); // [0, 2PI)
  return Math.min(d, TAU - d); // [0, PI]
};

function getLine(start: Tile, options: Options) {
  const { lines: linesConfig } = options;

  // The point is already used in another line
  if (start.used) {
    return;
  }

  let points = [];
  let current = start;

  for (let i = 0; i < linesConfig.maxLength; i++) {
    points.push(current.point);
    current.used = true;

    shuffle(current.neighbors);

    const available = current.neighbors.filter((tile) => {
      // Filter all points which angle to is too large
      const angle = angleTo(current.point, tile.point);
      const isAngle = angularDistance(angle, current.angle) < linesConfig.angleDiff * Math.PI;

      return isAngle && !tile.used && (linesConfig.useField || tile.type === 'line');
    });

    if (linesConfig.useField) {
      available.sort((a, b) => {
        // current.angle is angle in the vector field between 0 and 2 * PI
        // I want to sort point's neighbors by angle difference compared to current point
        // So they are sorted in a way that follows the vector field the closest
        const aa = angleTo(current.point, a.point);
        const ab = angleTo(current.point, b.point);
        return angularDistance(aa, current.angle) - angularDistance(ab, current.angle);
      });
    }

    const next = available[0];

    if (next && next.type === 'line') {
      current = next;
    } else {
      break;
    }
  }

  return {
    points: chaikin(points, linesConfig.chaikinIterations, false, 0.2),
    color: start.color,
  };
}

interface Line {
  points: Point[];
  color: string;
}

export const getLines = (items: Tile[], options: Options) => {
  const lines: Line[] = [];

  items.forEach((item) => {
    // Reset after memoization
    item.used = false;
  });

  items
    .filter((item) => item.type === 'line')
    .map((item) => {
      const line = getLine(item, options);

      if (line) {
        lines.push(line);
      }
    });

  return lines;
};
