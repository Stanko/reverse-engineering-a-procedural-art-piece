import { createNoise2D, type RandomFn } from 'simplex-noise';

export const getNoise = (rng: RandomFn, easingFn: (n: number) => number, noiseFactor: number) => {
  const noise = createNoise2D(rng);

  return (x: number, y: number) => {
    // map -1,1 range to 0, 1
    const n = (noise(x / noiseFactor, y / noiseFactor) + 1) / 2;
    return easingFn(n);
  };
};
