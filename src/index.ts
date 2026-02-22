import { controls } from './ui/controls';
import render from './drawing/render';
import setTitle from './ui/set-title';
import { initUI, drawingDiv } from './ui/init';
// CSS
import '@stanko/ctrls/dist/ctrls.css';
import './scss/index.scss';

// Backup reference to the browser's Math.random method
export const originalRandom = Math.random;

export const titleText = document.querySelector('title')?.textContent || '';

const draw = async () => {
  const options = controls.getValues();

  // Swap random method for a seeded RNG
  Math.random = options.mainSeedRng;

  // Set unique favicon and title
  setTitle(options, titleText);

  // Render the image
  const svg = await render(options);

  drawingDiv.replaceChildren(svg);
};

// Redraw on options change
controls.onChange = draw;

// Initialize
initUI();
draw();
