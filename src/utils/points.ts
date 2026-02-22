import PoissonDiskSampling from 'poisson-disk-sampling';
import type { Point } from './clipper';
import random from './random';

export const getSquarePoints = (width: number, height: number, step: number = 50) => {
  const points: Point[] = [];

  for (let x = step / 2; x <= width; x += step) {
    for (let y = step / 2; y <= height; y += step) {
      points.push({
        x,
        y,
      });
    }
  }

  return points;
};

export const getRandomPoints = (width: number, height: number, size = 50) => {
  const points: Point[] = [];

  const max = (width * height) / (size * 40);
  for (let i = 0; i < max; i++) {
    points.push({
      x: random(0, width, null, 2),
      y: random(0, height, null, 2),
    });
  }

  return points;
};

export const getPoissonPoints = (width: number, height: number, size = 50) => {
  const p = new PoissonDiskSampling({
    shape: [width, height],
    minDistance: size / 2,
    maxDistance: size,
    tries: 20,
  });

  const points = p.fill();

  return points.map((p) => ({ x: p[0], y: p[1] }));
};

export const getPoissonLinearPoints = (width: number, height: number, size = 50) => {
  const p = new PoissonDiskSampling({
    shape: [width, height],
    minDistance: size / 5,
    maxDistance: size * 5,
    tries: 20,
    distanceFunction: (p) => {
      return 1 - Math.sqrt(Math.sqrt(p[0] / width));
    },
  });

  const points = p.fill();

  return points.map((p) => ({ x: p[0], y: p[1] }));
};

export const getPoissonNoisePoints = (
  width: number,
  height: number,
  noise: (x: number, y: number) => number,
  size = 50,
) => {
  const p = new PoissonDiskSampling({
    shape: [width, height],
    minDistance: 5,
    maxDistance: size,
    tries: 20,
    distanceFunction: (p) => {
      return noise(p[0], p[1]);
    },
  });

  const points = p.fill();

  return points.map((p) => ({ x: p[0], y: p[1] }));
};
