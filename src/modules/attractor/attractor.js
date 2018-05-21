import template from './attractor.pug';
import $ from 'jquery';
import { saveCanvas } from '../../utils/save-utils';

console.log('attractor module has loaded');

const title = 'Аттрактор Лоренца';

const data = {
  'a': 5,
  'b': 15,
  'c': 1,
  'dt': 0.0001,
  'iterations': 500000
};

const HSVtoRGB = (h) => {
  const i = Math.floor(h * 6);
  const f = Math.round((h * 6 - i) * 255);
  const q = Math.round(255 - f);
  switch (i % 6) {
    case 0: return [255, f, 0]; break;
    case 1: return [q, 255, 0]; break;
    case 2: return [0, 255, f]; break;
    case 3: return [0, q, 255]; break;
    case 4: return [f, 0, 255]; break;
    case 5: return [255, 0, q]; break;
  }
};


const drawAttractor = (context, w, h, {a, b, c, dt, iterations}) => {
  let [x, y, z] = [3.051522, 1.582542, 15.62388];
  context.clearRect(0, 0, w, h);
  var imageData = context.getImageData(0, 0, w, h);
  var idx = 0;
  const iterationPercent = 1 / iterations;
  var i = iterations;
  while (i--) {
    [x, y, z] = [
      x + a * (-x + y) * dt,
      y + (b * x - y - z * x) * dt,
      z + (-c * z + x * y) * dt
    ];
    idx = 4 * (Math.round(19.3 * (y - x * 0.292893) + 320) + Math.round(-11 * (z + x * 0.292893) + 392) * w);
    const hue = i * iterationPercent;
    const [col_r, col_g, col_b] = HSVtoRGB(hue);
    imageData.data[idx + 0] = col_r;  // r
    imageData.data[idx + 1] = col_g;  // g
    imageData.data[idx + 2] = col_b;  // b
    imageData.data[idx + 3] = 255;  // a
  }
  context.putImageData(imageData, 0, 0);
};


const init = () => {
  console.log('attractor init');

  const activity = $(template());

  const canvas = activity.find('#attractor-canvas');
  const context = canvas[0].getContext('2d');
  const h = parseInt(canvas.attr("height"));
  const w = parseInt(canvas.attr("width"));

  activity
    .find('input[data-param]')
    .on('input', (e) => {
      const input = e.target;
      const { param } = input.dataset;
      if (param === 'iterations') {
        data[param] = parseFloat(input.value) * 1000;
      } else {
        data[param] = parseFloat(input.value);
      }
      console.log(data);
      const t = Date.now();
      drawAttractor(context, w, h, data);
      console.log(Date.now() - t);
    });

  activity.find('#save-png-btn').click((e) => {
    saveCanvas('attractor.png', canvas[0]);
    e.preventDefault();
  });

  const deserializeForm = () => {
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'iterations') {
        value /= 1000;
      }
      const input = activity.find(`input[data-param=${key}]`);
      input.val(value);
      const step = parseFloat(input.attr('step'));
      const numberOfZeroes = Math.max(Math.log10(1 / step), 0);
      activity.find(`[data-bind=${key}]`).text(value.toFixed(numberOfZeroes));
    });
  };

  deserializeForm();
  drawAttractor(context, w, h, data);

  return activity;
};

const destroy = () => {
  console.log('attractor destroyed');
};

export default { title, init, destroy };
