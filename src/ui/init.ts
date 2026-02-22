import { controls } from './controls';
import { dom } from './dom';
import { downloadPNG, downloadSVG } from './download';

export const controlsDiv = document.querySelector('.controls') as HTMLDivElement;
export const drawingDiv = document.querySelector('.drawing') as HTMLDivElement;

const downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>`;

export const initUI = () => {
  controlsDiv.appendChild(controls.element);
  const controlsInner = controls.element.querySelector('.ctrls__controls-inner') as HTMLElement;

  // ----- SAVE SVG ----- //
  const saveButton = dom.button('controls-save ctrls__btn ctrls__btn--lg', {
    innerHTML: 'Save SVG' + downloadIcon,
  });
  saveButton.addEventListener('click', () => {
    const svg = drawingDiv.querySelector('.drawing svg') as SVGSVGElement;
    downloadSVG(svg);
  });
  controlsInner.appendChild(dom.div('ctrls__control-no-label', { children: [saveButton] }));

  // ----- SAVE PNG ----- //
  const savePngButton = dom.button('controls-save ctrls__btn ctrls__btn--lg', {
    innerHTML: 'Save PNG' + downloadIcon,
  });
  savePngButton.addEventListener('click', () => {
    const svg = drawingDiv.querySelector('.drawing svg') as SVGSVGElement;
    downloadPNG(svg);
  });
  controlsInner.appendChild(dom.div('ctrls__control-no-label', { children: [savePngButton] }));

  // Add global keyboard shortcuts
  document.addEventListener('keypress', (e: KeyboardEvent) => {
    // Check if document.activeElement is not a text input
    const active = document.activeElement;
    const isTextInput = active instanceof HTMLInputElement && active.type === 'text';

    if (isTextInput) {
      return;
    }

    if (e.key === 'r') {
      e.preventDefault();
      controls.randomize();
    } else if (e.key === 'c') {
      e.preventDefault();
      controlsDiv.classList.toggle('controls--hidden');
    }
  });
};
