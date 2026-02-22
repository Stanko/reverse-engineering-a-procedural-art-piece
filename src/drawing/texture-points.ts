import PoissonDiskSampling from 'poisson-disk-sampling';
import random from '../utils/random';
import type { Palette } from './colors';
import type { Options } from '../ui/options-type';
import memoize from '../utils/memoize';

export const getTexturePoints = memoize(
  (width: number, height: number, palette: Palette, options: Options) => {
    const {
      points: { layers, size, opacity },
    } = options;
    const texturePoints = [];

    for (let i = 0; i < layers; i++) {
      const poisson = new PoissonDiskSampling({
        shape: [width, height],
        minDistance: width * 0.02,
        maxDistance: width * 0.05,
        tries: 20,
      });

      const points = poisson.fill();

      const items = points.map((p) => {
        return {
          x: p[0],
          y: p[1],
          r: random(size.min, size.max),
          opacity: random(opacity.min, opacity.max),
          color: palette.getRandomColor(),
        };
      });

      texturePoints.push(...items);
    }

    return texturePoints;
  },
  {
    cacheKey: (args) => {
      const [width, height, _palette, options] = args;
      const {
        mainSeed,
        points: { layers, size, opacity },
        colors: { variation, seed, paletteSeed, palette, count },
      } = options;
      return [width, height, layers, size, opacity, palette, paletteSeed, variation, seed, count, mainSeed];
    },
  },
);
