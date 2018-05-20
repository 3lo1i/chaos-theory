import template from './templates/lsystem.pug';
import tabsTemplate from './templates/tabs.pug';
import presetTemplate from './templates/presetitem.pug';
import { DrawingTool, SVGDrawingTool } from './drawingtool';
import Turtle from './turtle';
import presets from './presets.json';
import $ from 'jquery';
import SVG from 'svg.js';

console.log('lsystem module has loaded');

const title = 'L-системы';

const MAX_RULES = 5;
const TURTLE_STEP = 10;
const CRITICAL_PATH_LENGTH = 200000;
const FATAL_PATH_LENGTH = 100000000;
const PNG_WIDTH = 2048;
const PNG_HEIGHT = 2048;
const SVG_WIDTH = 2048;
const SVG_HEIGHT = 2048;


const init = () => {
  console.log('lsystem init');
  const activity = $(template());

  const tabs = $(tabsTemplate());
  $('#navbar-tabs-container').append(tabs);

  var path;
  var rules = [
    {predecessor: 'F', successor: 'F'}
  ];

  const canvas = activity.find('#fractal-canvas').get(0);
  const context = canvas.getContext('2d');
  const canvasDrawingTool = new DrawingTool(canvas, context);
  const turtle = new Turtle();

  const getLSystemVariables = () => {
    const val = activity
      .find('#variables-input')
      .val()
      .split('');

    const letters = val.filter((letter, i) =>
      // filter non-letters
      letter.match(/[A-Za-z]/) &&
      // filter duplicate values
      val.indexOf(letter) === i);
    return letters.length ? letters.splice(0, MAX_RULES) : ['F'];
  };

  const serializeForm = () => {
    const form = activity.find('#fractal-form');
    // transform serializeArray data to JSON
    const o = form
      .serializeArray()
      .reduce((obj, itm) => {
        if (obj[itm.name]) {
          if (!obj[itm.name].push) {
            obj[itm.name] = [obj[itm.name]];
          }
          obj[itm.name].push(itm.value || '');
        } else {
          obj[itm.name] = itm.value || '';
        }
        return obj;
      }, {});

    const data = {
      name: 'Текущие значения',
      iterations: Number(o.iterations),
      start: o.start,
      rules: [],
      angle: Number(o.angle)
    };

    const variables = getLSystemVariables();

    activity
      .find('#rules-container .row')
      .each((index, el) => {
        el = $(el);
        if (index >= variables.length) {
          return false;
        }
        const predecessor = el
          .find('.rule-predecessor')
          .val();
        if (!variables.includes(predecessor)) {
          return;
        }
        const successor = el
          .find('.rule-successor')
          .val();
        const rule = { predecessor, successor };
        data.rules.push(rule);
    });
    rules = data.rules;

    return data;
  };

  const deserializeForm = (data) => {
    activity.find('#angle-input').val(data.angle);
    activity.find('#iterations-input').val(data.iterations);
    activity.find('#start-input').val(data.start);
    rules = data.rules.map((rule) => ({ predecessor: rule.predecessor, successor: rule.successor }));
    updateRules();
  };

  const saveAs = (blob, filename) => {
    const anchor = document.createElement('a');
    const dataUrl  = URL.createObjectURL(blob);
    anchor.setAttribute('href', dataUrl);
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('download', filename);
    if (document.createEvent) {
      const evtObj = document.createEvent('MouseEvents');
      evtObj.initEvent('click', true, true);
      anchor.dispatchEvent(evtObj);
    }
    else if (anchor.click) {
      anchor.click();
    }
  };

  const savePNG = (event) => {
    const data = serializeForm();

    const canvas = $(`<canvas width="${ PNG_WIDTH }" height="${ PNG_HEIGHT }"/>`).get(0);
    const context = canvas.getContext('2d');
    const pngDrawingTool = new DrawingTool(canvas, context);

    turtle.start(0, 0, 0);
    turtle.angleStep = data.angle;
    turtle.step = TURTLE_STEP;
    turtle.drawPath(path, pngDrawingTool);

    canvas.toBlob((blob) => saveAs(blob, 'fractal.png'), 'image/png');
    if (event) {
      event.preventDefault();
    }
  };

  const saveSVG = (event) => {
    const data = serializeForm();
    
    const div = $('<div/>').get(0);
    const draw = SVG(div).size(SVG_WIDTH, SVG_HEIGHT);
    const svgTool = new SVGDrawingTool(draw);

    turtle.start(0, 0, 0);
    turtle.angleStep = data.angle;
    turtle.step = TURTLE_STEP;
    turtle.drawPath(path, svgTool);

    const blob = new Blob([draw.svg()], {type: 'image/svg+xml'});
    saveAs(blob, 'fractal.svg');
    if (event) {
      event.preventDefault();
    }
  };

  const getWord = (axiom, rules, force=false) => {
    let word = '';
    for (const char of axiom.split('')) {
      const r = rules.find((rule) => rule.predecessor === char);
      if (r) {
        word += r.successor;
      } else {
        word += char;
      }
      if (!force && word.length > CRITICAL_PATH_LENGTH) {
        break;
      }
      if (word.length > FATAL_PATH_LENGTH) {
        break;
      }
    }
    return word;
  };

  const makeFractal = (data, force=false) => {
    let overflow = false;

    path = data.start;
    // var stepsEl = activity.find('#steps');
    // stepsEl.html('<li>' + path + '</li>');
    for (let i = 0; i < data.iterations; i++) {
      const newPath = getWord(path, data.rules, force);
      if (newPath.length >= CRITICAL_PATH_LENGTH) {
        if (newPath.length >= FATAL_PATH_LENGTH) {
          alert(`Слишком большое число команд! (>${ FATAL_PATH_LENGTH })`);
          return;
        }
        overflow = true;
        if (!force) {
          break;
        }
      }
      path = newPath;
      // stepsEl.append('<li>' + path + '</li>');
    }

    activity.find('#json-data').val(JSON.stringify(data, null, 2));

    if (overflow) {
      activity.find('#slow-alert').show();
    } else {
      activity.find('#slow-alert').hide();
    }
    drawPath();
  };


  const drawPath = (event) => {
    if (!path) {
      console.error('Path is empty!');
      return;
    }

    turtle.start(0, 0, 0);
    turtle.angleStep = serializeForm().angle;
    turtle.step = 10;
    turtle.drawPath(path, canvasDrawingTool);
  };


  const onLSystemParamsChange = () => {
    const data = serializeForm();
    makeFractal(data, false);
  };

  activity.find('#draw-btn').click(() => makeFractal(serializeForm(), true));
  activity.find('#save-png-btn').click(savePNG);
  activity.find('#save-svg-btn').click(saveSVG);
  activity.find('#angle-input').change(drawPath);
  activity.find('#iterations-input').change(onLSystemParamsChange);
  activity.find('#start-input').change(onLSystemParamsChange);
  activity.find('#save-json-btn').click(() => {
    let data = {};
    try {
      data = JSON.parse(activity.find('#json-data').val());
    } catch (e) {
      alert(e);
      return;
    }
    data.name = data.name || 'Текущие значения';
    const maxIterations = 15;
    const minIterations = 0;
    data.iterations = Math.min(Math.max(Number(data.iterations) || 0, minIterations), maxIterations);
    const maxAngle = 180;
    const minAngle = 0;
    data.start = data.start || '';
    data.rules = data.rules || [];
    for (let i = 0; i < data.rules.length; i++) {
      let rule = data.rules[i];
      if (typeof rule !== 'object') {
        rule = {};
      }
      rule.predecessor = rule.predecessor || '';
      rule.successor = rule.successor || '';
      if (rule.predecessor.match(/[^A-Za-z\s\[\]\+\-]/g)) {
        rule.predecessor = rule.predecessor.replace(/[^A-Za-z\s\[\]\+\-]/g, '');
      }
      rule.predecessor = rule.predecessor.substr(0, 1);
      if (rule.successor.match(/[^A-Za-z\s\[\]\+\-]/g)) {
        rule.successor = rule.successor.replace(/[^A-Za-z\s\[\]\+\-]/g, '');
      }
      data.rules[i] = rule;
    }
    data.angle = Math.min(Math.max(Number(data.angle) || 0, minAngle), maxAngle);
    activity.find('#json-data').val(JSON.stringify(data, null, 2));
    deserializeForm(data);
  });


  const updateRules = () => {
    activity
      .find('#rules-container .row')
      .each((index, el) => {
        const rule = rules[index];
        el = $(el);
        if (rule) {
          const { predecessor, successor } = rule;
          el.show();
          el.find('.rule-predecessor')
            .val(predecessor);
          el
            .find('.rule-successor')
            .val(successor);      
        } else {
          el.val('')
            .hide();
        }
      });
    const letters = rules.map((r) => r.predecessor);
    activity
      .find('#variables-input')
      .val(letters.join(', '));
    activity
      .find('#json-data')
      .val(JSON.stringify(serializeForm(), null, 2));
  };

  // variables input handler
  activity
    .find('#variables-input')
    .keyup(() => {
      const letters = getLSystemVariables();

      rules.length = letters.length;
      letters.forEach((letter, i) => {
        const rule = rules[i];
        if (!rule) {
          rules[i] = { predecessor: letter, successor: letter };
        } else if (rule.predecessor !== letter) {
          rule.predecessor = letter;
          rule.successor = letter;
        }
      });
      updateRules();
    });

  const restrictInput = (event) => {
    const t = event.target;
    if (t.value.match(/[^A-Za-z\s\[\]\+\-]/g)) {
      t.value = t.value.replace(/[^A-Za-z\s\[\]\+\-]/g, '');
    }
  };

  // start input handler
  activity
    .find('#start-input')
    .keyup(restrictInput);

  // rules successor input handler
  activity
    .find('#rules-container .rule-successor')
    .keyup(restrictInput)
    .change(onLSystemParamsChange);

  // populate examples dropdown
  {
    const loadPreset = (event) => {
      deserializeForm(event.data.preset);
      makeFractal(event.data.preset);
      event.preventDefault();
    };
    presets.forEach((preset, index) => {
      const name = preset.name;
      const presetLink = $(presetTemplate({ index, name }));
      presetLink.click({ preset }, loadPreset);
      activity.find('#presets-list').append(presetLink);
    });
  }

  // load initial lsystem and draw it
  {
    const data = presets[0];
    deserializeForm(data);
    makeFractal(data);
  }

  return activity;
};

const destroy = () => {
  console.log('lsystem destroyed');

  $('#lsystem-tabs-select').remove();
};

export default { title, init, destroy };
