import generate from './generate';
import svgUtils from '../utils/svg-utils';
import type { Options } from '../ui/options-type';

export default async function render(options: Options): Promise<SVGElement> {
  const { width, height, debug, colors, padding, lines: linesConfig } = options;

  // ----- SVG init ----- //
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgElement.setAttribute('viewBox', `${-padding} ${-padding} ${width + 2 * padding} ${height + 2 * padding}`);

  // ----- Main logic ----- //
  console.time('drawing data');
  const data = await generate(options);
  console.timeEnd('drawing data');

  // ----- Render ----- //
  console.time('svg render');
  // Add current URL with parameters into the SVG
  let svgContent = `\n<!-- ${window.location.href} -->\n`;

  svgContent += svgUtils.getRect(width + 2 * padding, height + 2 * padding, {
    x: -padding,
    y: -padding,
    fill: data.bg,
  });

  if (options.render === 'voronoi') {
    svgContent += svgUtils.group(
      'tiles',
      data.tiles.map((item) => {
        return svgUtils.getPath(item.polygon, true, {
          fill: colors.enabled ? item.color : 'none',
          stroke: colors.enabled ? 'none' : 'white',
        });
      }),
    );
  } else if (options.render === 'offset') {
    svgContent += svgUtils.group(
      'tiles-offset',
      data.tiles.map((item) => {
        return svgUtils.getPath(item.offsetPolygon, true, {
          fill: colors.enabled ? item.color : 'none',
          stroke: colors.enabled ? 'none' : 'white',
        });
      }),
    );
  } else if (options.render === 'types' || options.render === 'all') {
    svgContent += '<g class="tiles">';

    data.tiles.forEach((item) => {
      const isPolygon = item.type === 'polygon';
      const isDot = item.type === 'dot';

      if (isPolygon) {
        svgContent += svgUtils.getPath(item.roundedPolygon, true, {
          fill: colors.enabled ? item.color : 'none',
          stroke: colors.enabled ? 'none' : 'white',
        });
      } else if (isDot) {
        svgContent += svgUtils.getCircle(item.point, item.radius, {
          fill: colors.enabled ? item.color : 'none',
          stroke: colors.enabled ? 'none' : 'white',
        });
      } else {
        if (options.render === 'types') {
          svgContent += svgUtils.getCircle(item.point, 1, {
            fill: 'white',
          });
          // svgContent += svgUtils.getPath(item.roundedPolygon, true, {
          //   stroke: colors.enabled ? item.color : 'white',
          //   fill: 'none',
          // });
        }
      }
    });

    svgContent += '</g>';

    if (options.render === 'all') {
      svgContent += svgUtils.group(
        'lines',
        data.lines.map((line) => {
          return svgUtils.getPath(line.points, false, {
            stroke: colors.enabled ? line.color : 'white',
          });
        }),
        {
          'stroke-width': linesConfig.strokeWidth,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          fill: 'none',
        },
      );
    }
  } else if (options.render === 'all' || options.render === 'rounded') {
    svgContent += svgUtils.group(
      'tiles-rounded',
      data.tiles.map((item) => {
        return svgUtils.getPath(item.roundedPolygon, true, {
          fill: colors.enabled ? item.color : 'none',
          stroke: colors.enabled ? 'none' : 'white',
        });
      }),
    );
  }

  svgContent += svgUtils.group(
    'points',
    data.texturePoints.map((point) => {
      return svgUtils.getCircle(point, point.r, {
        fill: point.color,
        opacity: point.opacity,
      });
    }),
  );

  if (debug) {
    svgContent += svgUtils.group(
      'points',
      data.points.map((point) => {
        return svgUtils.getCircle(point, 2, {
          fill: 'white',
        });
      }),
    );
  }

  svgElement.innerHTML = svgContent;
  console.timeEnd('svg render');

  return svgElement;
}
