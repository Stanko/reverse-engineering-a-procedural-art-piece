import type { Options } from '../ui/options-type';
import random from '../utils/random';

interface OKLCH {
  l: number;
  c: number;
  h: number;
}

export interface PaletteConfig {
  colors: OKLCH[];
  bg: OKLCH;
}

export const PALETTES: PaletteConfig[] = [
  {
    colors: [
      { l: 0.97, c: 0.04, h: 78.8 },
      { l: 0.6589, c: 0.1595, h: 33.83 },
      { l: 0.29, c: 0.0626, h: 264.58 },
    ],
    bg: { l: 0.4055, c: 0.0907, h: 264.41 },
  },
  {
    colors: [
      { l: 0.1332, c: 0.0097, h: 165.22 },
      { l: 0.4819, c: 0.0882, h: 150.23 },
      { l: 0.7734, c: 0.1452, h: 68.45 },
      { l: 0.898, c: 0.0377, h: 173.3 },
    ],
    bg: { l: 0.2422, c: 0.0202, h: 179.65 },
  },
  {
    colors: [
      { l: 0.913, c: 0.0292, h: 39.33 },
      { l: 0.6578, c: 0.1816, h: 43.33 },
      { l: 0.54, c: 0.2016, h: 43.33 },
    ],
    bg: { l: 0.3867, c: 0.0822, h: 265.76 },
  },
];

export const getRandomPaletteConfig = (options: Options): PaletteConfig => {
  const { count, paletteSeedRng } = options.colors;
  const base = random(0, 360, paletteSeedRng);

  const config: PaletteConfig = {
    colors: [],
    bg: { l: 0, c: 0, h: 0 },
  };

  for (let i = 0; i < count; i++) {
    config.colors.push({
      l: random(0.3, 0.9, paletteSeedRng),
      c: random(0.01, 0.3, paletteSeedRng),
      h: (base + i * random(50, 100, paletteSeedRng)) % 360,
    });
  }

  config.bg = {
    l: 0.2,
    c: 0.05,
    h: config.colors[0].h,
  };

  return config;
};

export class Palette {
  colors: OKLCH[];
  bg: OKLCH;
  noise: (x: number, y: number) => number;
  colorCount: number;

  constructor(palette: PaletteConfig, noise: (x: number, y: number) => number, colorCount: number) {
    this.colors = palette.colors;
    this.bg = palette.bg;
    this.noise = noise;
    this.colorCount = colorCount;
  }

  formatColor(c: OKLCH, variation = 0) {
    const color = {
      ...c,
    };

    color.l += random(-variation, variation);
    color.h += random(-variation, variation);

    return `oklch(${color.l} ${color.c} ${color.h})`;
  }

  getBgColor() {
    return this.formatColor(this.bg);
  }

  getColorAt(x: number, y: number, variation = 0.05) {
    const colorStep = 1 / this.colorCount;
    let colorIndex = Math.floor(this.noise(x, y) / colorStep);

    // When n is 1, colorIndex gets out of bounds, we want open range
    if (colorIndex === this.colorCount) {
      colorIndex--;
    }

    return this.formatColor(this.colors[colorIndex % this.colors.length], variation);
  }

  getRandomColor(variation = 0.05) {
    const colorIndex = Math.floor(Math.random() * this.colors.length);
    const color = this.colors[colorIndex];
    return this.formatColor(color, variation);
  }
}
