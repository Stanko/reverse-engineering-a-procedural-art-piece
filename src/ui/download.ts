import { controls } from './controls';
import Alea from '../utils/alea';

const getFilename = () => {
  const options = controls.getValues();
  const random = Alea(window.location.hash)().toString(36).substring(2, 8);
  return `cca__${options.mainSeed}__${random}`;
};

export const downloadPNG = async (svg: SVGSVGElement) => {
  const canvas = document.createElement('canvas');
  const bbox = svg.getBBox();
  canvas.width = bbox.width * 2;
  canvas.height = bbox.height * 2;

  const img = new Image();

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  img.addEventListener('load', () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUri = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = dataUri;
    a.download = getFilename();
    a.click();
  });

  img.src = `data:image/svg+xml;base64,${btoa(svg.outerHTML)}`;
};

export const downloadSVG = async (svg: SVGSVGElement) => {
  const content = svg.outerHTML.replace('preserveAspectRatio="none"', '');
  const dataUri = `data:image/svg+xml;base64,${btoa(content)}`;

  const a = document.createElement('a');
  a.href = dataUri;
  a.download = getFilename();
  a.click();
};
