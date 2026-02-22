import type { ConfigItem } from '@stanko/ctrls';

export const config = [
  {
    type: 'boolean',
    name: 'debug',
    defaultValue: false,
    isRandomizationDisabled: true,
  },
  {
    type: 'boolean',
    name: 'fixedColorDistribution',
    defaultValue: false,
    isRandomizationDisabled: true,
  },
  {
    type: 'boolean',
    name: 'fixedTypeDistribution',
    defaultValue: false,
    isRandomizationDisabled: true,
  },
  {
    type: 'range',
    name: 'width',
    defaultValue: 1600,
    isRandomizationDisabled: true,
    min: 100,
    max: 2000,
    step: 50,
  },
  {
    type: 'range',
    name: 'height',
    defaultValue: 900,
    isRandomizationDisabled: true,
    min: 100,
    max: 2000,
    step: 50,
  },
  {
    type: 'range',
    name: 'padding',
    defaultValue: 10,
    isRandomizationDisabled: true,
    min: 0,
    max: 100,
    step: 10,
  },
  {
    type: 'seed',
    name: 'mainSeed',
  },
  {
    type: 'radio',
    name: 'render',
    items: {
      none: 'none',
      voronoi: 'voronoi',
      offset: 'offset',
      rounded: 'rounded',
      types: 'types',
      all: 'all',
    },
    defaultValue: 'all',
  },
  // ----- TILES ----- //
  {
    type: 'group',
    name: 'tiles',
    controls: [
      {
        type: 'range',
        name: 'size',
        min: 10,
        step: 1,
        max: 100,
        defaultValue: 35,
      },
      {
        type: 'range',
        name: 'chaikinIterations',
        min: 0,
        step: 1,
        max: 5,
        defaultValue: 3,
      },
    ],
  },
  // ----- VORONOI ----- //
  {
    type: 'group',
    name: 'voronoi',
    controls: [
      {
        type: 'radio',
        name: 'points',
        items: {
          square: 'square',
          random: 'random',
          poisson: 'poisson',
          p_linear: 'p_linear',
          p_noise: 'p_noise',
        },
        defaultValue: 'p_noise',
      },
      {
        type: 'range',
        name: 'balanceIterations',
        min: 0,
        step: 1,
        max: 20,
        defaultValue: 10,
      },
      {
        type: 'range',
        name: 'offset',
        min: 0,
        step: 0.5,
        max: 10,
        defaultValue: 1.5,
      },
      {
        type: 'range',
        name: 'shortEdgeFactor',
        min: 0,
        step: 0.05,
        max: 0.4,
        defaultValue: 0.05,
      },
      {
        type: 'range',
        name: 'noiseScale',
        min: 100,
        step: 50,
        max: 2000,
        defaultValue: 800,
      },
      {
        type: 'easing',
        name: 'distribution',
        label: 'density distribution',
        defaultValue: [0.41, 0.1, 1, 1],
      },
      {
        type: 'easing',
        name: 'typesDistribution',
      },
    ],
  },
  // ----- COLORS ----- //
  {
    type: 'group',
    name: 'colors',
    controls: [
      {
        type: 'boolean',
        name: 'enabled',
      },
      {
        type: 'boolean',
        name: 'random',
        defaultValue: false,
      },
      {
        type: 'boolean',
        name: 'useColorsNoise',
      },
      {
        type: 'radio',
        name: 'palette',
        items: {
          'b/r': '0',
          'g/y': '1',
          koi: '2',
          random: 'random',
        },
      },
      {
        type: 'range',
        name: 'count',
        min: 1,
        step: 1,
        max: 10,
        defaultValue: 3,
      },
      {
        type: 'seed',
        name: 'seed',
      },
      {
        type: 'seed',
        // smoke-thick-freedom
        // glass-hang-composed
        // hole-tonight-twice
        // strange-thrown-this
        name: 'paletteSeed',
      },
      {
        type: 'range',
        name: 'noiseScale',
        min: 100,
        step: 50,
        max: 2000,
        defaultValue: 550,
      },
      {
        type: 'easing',
        name: 'distribution',
      },
      {
        type: 'range',
        name: 'variation',
        min: 0,
        step: 0.01,
        max: 0.2,
        defaultValue: 0.05,
      },
    ],
  },
  // ----- LINES ----- //
  {
    type: 'group',
    name: 'lines',
    controls: [
      {
        type: 'seed',
        name: 'seed',
      },
      {
        type: 'range',
        name: 'noiseScale',
        min: 100,
        step: 50,
        max: 2000,
        defaultValue: 1100,
      },
      {
        type: 'range',
        name: 'chaikinIterations',
        min: 0,
        step: 1,
        max: 5,
        defaultValue: 2,
      },
      {
        type: 'range',
        name: 'maxLength',
        min: 1,
        step: 1,
        max: 200,
        defaultValue: 25,
      },
      {
        type: 'boolean',
        name: 'useField',
      },
      {
        type: 'range',
        name: 'angleDiff',
        min: 0.05,
        step: 0.05,
        max: 2,
        defaultValue: 0.65,
      },
      {
        type: 'range',
        name: 'strokeWidth',
        min: 1,
        step: 1,
        max: 10,
        defaultValue: 4,
      },
    ],
  },
  // ----- POINTS ----- //
  {
    type: 'group',
    name: 'points',
    label: 'texture points',
    controls: [
      {
        type: 'range',
        name: 'layers',
        min: 0,
        step: 1,
        max: 10,
        defaultValue: 4,
      },
      {
        type: 'dual-range',
        name: 'opacity',
        min: 0,
        step: 0.05,
        max: 1,
        defaultValue: {
          min: 0.2,
          max: 0.3,
        },
      },
      {
        type: 'dual-range',
        name: 'size',
        min: 0.1,
        step: 0.1,
        max: 5,
        defaultValue: {
          min: 0.8,
          max: 2,
        },
      },
    ],
  },
] as const satisfies readonly ConfigItem[];
