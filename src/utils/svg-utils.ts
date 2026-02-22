import type { Point } from './clipper';

const getCircle = (center: Point, r: number, props: Record<string, any> = {}) => {
  const attributes = [];

  for (const key in props) {
    const value = props[key];
    attributes.push(`${key}="${value}"`);
  }

  return `<circle cx="${center.x}" cy="${center.y}" r="${r}" ${attributes.join(' ')} />`;
};

const getRect = (width: number, height: number, props: Record<string, any> = {}) => {
  const attributes = [];

  for (const key in props) {
    const value = props[key];
    attributes.push(`${key}="${value}"`);
  }

  return `<rect width="${width}" height="${height}" ${attributes.join(' ')} />`;
};

const getPath = (path: Point[], isClosed = true, props: Record<string, any> = {}) => {
  const points = path.map((p) => `${p.x} ${p.y}`).join(' L ');

  const d = `M ${points} ${isClosed ? 'Z' : ''}`;
  const attributes = [];

  for (const key in props) {
    const value = props[key];
    attributes.push(`${key}="${value}"`);
  }

  return `<path d="${d}" ${attributes.join(' ')} />`;
};

const getComplexPath = (paths: Point[][], isClosed = true, props: Record<string, any> = {}) => {
  const d = paths
    .map((path) => {
      const points = path.map((p) => `${p.x} ${p.y}`).join(' L ');

      const d = `M ${points} ${isClosed ? 'Z' : ''}`;

      return d;
    })
    .join(' ');

  const attributes = [];

  for (const key in props) {
    const value = props[key];
    attributes.push(`${key}="${value}"`);
  }

  return `<path d="${d}" ${attributes.join(' ')} />`;
};

const group = (className: string, content: string | string[], props: Record<string, any> = {}) => {
  const attributes = [];

  for (const key in props) {
    const value = props[key];
    attributes.push(`${key}="${value}"`);
  }

  return `<g class="${className}" ${attributes.join(' ')}>${[content].flat().join('\n')}</g>`;
};

const svgUtils = {
  group,
  getRect,
  getCircle,
  getPath,
  getComplexPath,
};

export default svgUtils;
