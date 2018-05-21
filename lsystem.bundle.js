(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["lsystem"],{

/***/ "./src/modules/lsystem/drawingtool.js":
/*!********************************************!*\
  !*** ./src/modules/lsystem/drawingtool.js ***!
  \********************************************/
/*! exports provided: AbstractDrawingTool, DrawingTool, SVGDrawingTool */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractDrawingTool", function() { return AbstractDrawingTool; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrawingTool", function() { return DrawingTool; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SVGDrawingTool", function() { return SVGDrawingTool; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/modules/lsystem/util.js");


class AbstractDrawingTool {
  constructor(viewportWidth, viewportHeight) {
    if (this.constructor == AbstractDrawingTool) {
      throw new Error(`Abstract classes can't be instantiated.`);
    }
    this.boundingRect = new _util__WEBPACK_IMPORTED_MODULE_0__["Rect"]();
    this.viewportRect = new _util__WEBPACK_IMPORTED_MODULE_0__["Rect"](0, 0, viewportWidth, viewportHeight);
    this.viewportRect.shrink(5);
  }

  start() {
    throw new Error(`Method not implemented.`);
  }

  moveTo(x, y) {
    throw new Error(`Method not implemented.`);
  }

  lineTo(x, y) {
    throw new Error(`Method not implemented.`);
  }

  finish() {
    throw new Error(`Method not implemented.`);
  }
}

class DrawingTool extends AbstractDrawingTool {
  constructor(canvas, context) {
    super(canvas.width, canvas.height);
    this.canvas = canvas;
    this.context = context;
    this.lines = [];
  }

  start() {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.lines.length = 0;
    this.boundingRect = new _util__WEBPACK_IMPORTED_MODULE_0__["Rect"]();
  }

  moveTo(x, y) {
    const p = new _util__WEBPACK_IMPORTED_MODULE_0__["Point"](x, y);
    this.lines.push([p]);
    this.boundingRect.stretchToPoint(p);
  }

  lineTo(x, y) {
    if (!this.lines.length) {
      return;
    }
    const p = new _util__WEBPACK_IMPORTED_MODULE_0__["Point"](x, y);
    this.lines[this.lines.length - 1].push(p);
    this.boundingRect.stretchToPoint(p);
  }

  finish() {
    const rectangle = this.boundingRect;
    rectangle.notZero();
    const into = this.viewportRect;

    const fitRect = _util__WEBPACK_IMPORTED_MODULE_0__["Rect"].fit(rectangle, into);

    const factorX = fitRect.width / rectangle.width;
    const factorY = fitRect.height / rectangle.height;
    const factor = factorX < factorY ? factorX : factorY;
    const tx = -rectangle.x * factor + fitRect.x;
    const ty = -rectangle.y * factor + fitRect.y;

    // this.context.strokeRect(fitRect.x, fitRect.y, fitRect.width, fitRect.height);

    this.context.save();
    this.context.translate(tx, ty);
    // this.context.translate(-into.width / 2, -into.height / 2);
    this.context.scale(factor, factor);
    // this.context.translate(into.width / 2, into.height / 2);
    this.context.beginPath();
    let startPoint;
    let point;
    for (let i = 0; i < this.lines.length; i++) {
      let line = this.lines[i];
      point = line[0];
      startPoint = point;
      this.context.moveTo(point.x, point.y);
      for (let j = 1; j < line.length; j++) {
        point = line[j];
        this.context.lineTo(point.x, point.y);
      }
    }
    if (startPoint.eq(point)) {
      this.context.closePath();
    }
    this.context.lineWidth = this.context.lineWidth * 0.5 / factor;
    this.context.stroke();
    this.context.restore();
  }
}

class SVGDrawingTool extends AbstractDrawingTool {
  constructor(svg) {
    super(svg.attr('width'), svg.attr('height'));
    this.svg = svg;
    this.pointsStack = [];
    this.stroke = { width: 1 };
    this.fill = 'none';
  }

  start() {
    this.svg.clear();
    this.pointsStack.length = 0;
    this.boundingRect = new _util__WEBPACK_IMPORTED_MODULE_0__["Rect"]();
  }

  moveTo(x, y) {
    if (this.pointsStack.length) {
      this.svg.polyline(this.pointsStack).fill(this.fill).stroke(this.stroke);
    }
    this.pointsStack.length = 0;
    this.pointsStack.push([x, y]);
    this.boundingRect.stretchToPoint({x, y});
  }

  lineTo(x, y) {
    this.pointsStack.push([x, y]);
    this.boundingRect.stretchToPoint({x, y});
  }

  finish() {
    this.svg.polyline(this.pointsStack).fill(this.fill).stroke(this.stroke);
    this.pointsStack.length = 0;

    const rectangle = this.boundingRect;
    const into = this.viewportRect;

    const fitRect = _util__WEBPACK_IMPORTED_MODULE_0__["Rect"].fit(rectangle, into);

    const factorX = fitRect.width / rectangle.width;
    const factorY = fitRect.height / rectangle.height;
    const factor = factorX < factorY ? factorX : factorY;
    const tx = -rectangle.x * factor + fitRect.x;
    const ty = -rectangle.y * factor + fitRect.y;

    // this.svg.attr('transform', `translate(${ tx },${ ty }) scale(${ factor },${ factor })`);
    this.svg.translate(tx, ty);
    this.svg.scale(factor, factor);
  }
}


/***/ }),

/***/ "./src/modules/lsystem/lsystem.js":
/*!****************************************!*\
  !*** ./src/modules/lsystem/lsystem.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _templates_lsystem_pug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./templates/lsystem.pug */ "./src/modules/lsystem/templates/lsystem.pug");
/* harmony import */ var _templates_lsystem_pug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_templates_lsystem_pug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _templates_tabs_pug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./templates/tabs.pug */ "./src/modules/lsystem/templates/tabs.pug");
/* harmony import */ var _templates_tabs_pug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_templates_tabs_pug__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _templates_presetitem_pug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./templates/presetitem.pug */ "./src/modules/lsystem/templates/presetitem.pug");
/* harmony import */ var _templates_presetitem_pug__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_templates_presetitem_pug__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _drawingtool__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./drawingtool */ "./src/modules/lsystem/drawingtool.js");
/* harmony import */ var _turtle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./turtle */ "./src/modules/lsystem/turtle.js");
/* harmony import */ var _presets_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./presets.json */ "./src/modules/lsystem/presets.json");
var _presets_json__WEBPACK_IMPORTED_MODULE_5___namespace = /*#__PURE__*/Object.assign({}, _presets_json__WEBPACK_IMPORTED_MODULE_5__, {"default": _presets_json__WEBPACK_IMPORTED_MODULE_5__});
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var svg_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! svg.js */ "./node_modules/svg.js/dist/svg.js");
/* harmony import */ var svg_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(svg_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _utils_save_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/save-utils */ "./src/utils/save-utils.js");










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

let data;

const init = () => {
  console.log('lsystem init');
  const activity = jquery__WEBPACK_IMPORTED_MODULE_6___default()(_templates_lsystem_pug__WEBPACK_IMPORTED_MODULE_0___default()());

  const tabs = jquery__WEBPACK_IMPORTED_MODULE_6___default()(_templates_tabs_pug__WEBPACK_IMPORTED_MODULE_1___default()());
  jquery__WEBPACK_IMPORTED_MODULE_6___default()('#navbar-tabs-container').append(tabs);

  var path;
  var rules = [
    {predecessor: 'F', successor: 'F'}
  ];

  const canvas = activity.find('#fractal-canvas').get(0);
  const context = canvas.getContext('2d');
  const canvasDrawingTool = new _drawingtool__WEBPACK_IMPORTED_MODULE_3__["DrawingTool"](canvas, context);
  const turtle = new _turtle__WEBPACK_IMPORTED_MODULE_4__["default"]();

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

    data = {
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
        el = jquery__WEBPACK_IMPORTED_MODULE_6___default()(el);
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

  const savePNG = (event) => {
    const data = serializeForm();

    const canvas = jquery__WEBPACK_IMPORTED_MODULE_6___default()(`<canvas width="${ PNG_WIDTH }" height="${ PNG_HEIGHT }"/>`).get(0);
    const context = canvas.getContext('2d');
    const pngDrawingTool = new _drawingtool__WEBPACK_IMPORTED_MODULE_3__["DrawingTool"](canvas, context);

    turtle.start(0, 0, 0);
    turtle.angleStep = data.angle;
    turtle.step = TURTLE_STEP;
    turtle.drawPath(path, pngDrawingTool);

    Object(_utils_save_utils__WEBPACK_IMPORTED_MODULE_8__["saveCanvas"])('fractal.png', canvas);
    if (event) {
      event.preventDefault();
    }
  };

  const saveSVG = (event) => {
    const data = serializeForm();
    
    const div = jquery__WEBPACK_IMPORTED_MODULE_6___default()('<div/>').get(0);
    const draw = svg_js__WEBPACK_IMPORTED_MODULE_7___default()(div).size(SVG_WIDTH, SVG_HEIGHT);
    const svgTool = new _drawingtool__WEBPACK_IMPORTED_MODULE_3__["SVGDrawingTool"](draw);

    turtle.start(0, 0, 0);
    turtle.angleStep = data.angle;
    turtle.step = TURTLE_STEP;
    turtle.drawPath(path, svgTool);

    const blob = new Blob([draw.svg()], {type: 'image/svg+xml'});
    Object(_utils_save_utils__WEBPACK_IMPORTED_MODULE_8__["saveBlob"])('fractal.svg', blob);
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
        el = jquery__WEBPACK_IMPORTED_MODULE_6___default()(el);
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
    _presets_json__WEBPACK_IMPORTED_MODULE_5__.forEach((preset, index) => {
      const name = preset.name;
      const presetLink = jquery__WEBPACK_IMPORTED_MODULE_6___default()(_templates_presetitem_pug__WEBPACK_IMPORTED_MODULE_2___default()({ index, name }));
      presetLink.click({ preset }, loadPreset);
      activity.find('#presets-list').append(presetLink);
    });
  }

  // load initial lsystem and draw it
  data = data || _presets_json__WEBPACK_IMPORTED_MODULE_5__[0];
  deserializeForm(data);
  makeFractal(data);

  return activity;
};

const destroy = () => {
  console.log('lsystem destroyed');

  jquery__WEBPACK_IMPORTED_MODULE_6___default()('#lsystem-tabs-select').remove();
};

/* harmony default export */ __webpack_exports__["default"] = ({ title, init, destroy });


/***/ }),

/***/ "./src/modules/lsystem/presets.json":
/*!******************************************!*\
  !*** ./src/modules/lsystem/presets.json ***!
  \******************************************/
/*! exports provided: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, default */
/***/ (function(module) {

module.exports = [{"name":"Снежинка Коха","iterations":5,"start":"F++F++F","rules":[{"predecessor":"F","successor":"F-F++F-F"}],"angle":60},{"name":"Кривая Коха","iterations":4,"start":"F-F++F-F","rules":[{"predecessor":"F","successor":"F-F++F-F"}],"angle":60},{"name":"Кривая Минковского","iterations":3,"start":"F-F+F+FF-F-F+F","rules":[{"predecessor":"F","successor":"F-F+F+FF-F-F+F"}],"angle":90},{"name":"Кривая Гильберта","iterations":4,"start":"A","rules":[{"predecessor":"A","successor":"-BF+AFA+FB-"},{"predecessor":"B","successor":"+AF-BFB-FA+"}],"angle":90},{"name":"Кривая Леви","iterations":15,"start":"F","rules":[{"predecessor":"F","successor":"-F++F-"}],"angle":45},{"name":"Дракон Хартера — Хейтуэя","iterations":15,"start":"FX","rules":[{"predecessor":"X","successor":"X+YF+"},{"predecessor":"Y","successor":"-FX-Y"}],"angle":90},{"name":"Дерево Пифагора","iterations":7,"start":"--FX","rules":[{"predecessor":"F","successor":"FF"},{"predecessor":"X","successor":"[-FX][+FX]"}],"angle":45},{"name":"Множество Кантора","iterations":3,"start":"F","rules":[{"predecessor":"F","successor":"FbF"},{"predecessor":"b","successor":"bbb"}],"angle":90},{"name":"Треугольник Серпинского","iterations":4,"start":"FXF--FF--FF","rules":[{"predecessor":"F","successor":"FF"},{"predecessor":"X","successor":"--FXF++FXF++FXF--"}],"angle":60},{"name":"Стреловидная кривая Серпинского","iterations":9,"start":"-FA","rules":[{"predecessor":"A","successor":"+FBF-FAF-FBF+"},{"predecessor":"B","successor":"-FAF+FBF+FAF-"}],"angle":60},{"name":"Ковер Серпинского","iterations":5,"start":"FA","rules":[{"predecessor":"A","successor":"FA+FA-FA-FA-FG+FA+FA+FA-FA"},{"predecessor":"G","successor":"FGFGFG"}],"angle":90},{"name":"Фрактальное растение 1","iterations":6,"start":"--X","rules":[{"predecessor":"X","successor":"F-[[X]+X]+F[+FX]-X"},{"predecessor":"F","successor":"FF"}],"angle":25},{"name":"Фрактальное растение 2","iterations":4,"start":"--F","rules":[{"predecessor":"F","successor":"FF-[-F+F+F]+[+F-F-F]"}],"angle":22},{"name":"Фрактальное растение 3","iterations":5,"start":"---FX","rules":[{"predecessor":"F","successor":"FF-[-F+F]+[+F-F]"},{"predecessor":"X","successor":"FF+[+F]+[-F]"}],"angle":25},{"name":"Фрактальное растение 4","iterations":5,"start":"F","rules":[{"predecessor":"F","successor":"FF[-F++F][+F--F]++F--F"}],"angle":27},{"name":"Замощение Пенроуза","iterations":3,"start":"[X]++[X]++[X]++[X]++[X]","rules":[{"predecessor":"W","successor":"--ZF++++YF[+WF++++XF]--XF"},{"predecessor":"X","successor":"+ZF--WF[---YF--XF]+"},{"predecessor":"Y","successor":"ZF++WF----XF[-ZF----YF]++"},{"predecessor":"Z","successor":"-YF++XF[+++ZF++WF]-"},{"predecessor":"F","successor":""}],"angle":36}];

/***/ }),

/***/ "./src/modules/lsystem/templates/lsystem.pug":
/*!***************************************************!*\
  !*** ./src/modules/lsystem/templates/lsystem.pug ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_mixins["numberInput"] = pug_interp = function(variable, param_id, min, max, step, value){
var block = (this && this.block), attributes = (this && this.attributes) || {};
var id = `${param_id}-input`
var target = `#${id}`
pug_html = pug_html + "\u003Cdiv class=\"input-group input-group-plus-minus\"\u003E";
if ((variable)) {
pug_html = pug_html + "\u003Cdiv class=\"input-group-prepend col-2 col-md-1 pr-0\"\u003E\u003Cspan class=\"input-group-text w-100\"\u003E" + (null == (pug_interp = variable) ? "" : pug_interp) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003Cinput" + (" class=\"form-control input-sm\""+" type=\"number\""+pug.attr("id", id, true, true)+pug.attr("name", param_id, true, true)+pug.attr("min", min, true, true)+pug.attr("max", max, true, true)+pug.attr("step", step, true, true)+pug.attr("value", value, true, true)+pug.attr("data-param", param_id, true, true)) + "\u003E\u003Cdiv class=\"input-group-append pl-0 pr-3\"\u003E\u003Cbutton" + (" class=\"btn btn-outline-secondary\""+pug.attr("data-target", target, true, true)+" data-action=\"increment\""+pug.attr("data-step", step, true, true)) + "\u003E+\u003C\u002Fbutton\u003E\u003Cbutton" + (" class=\"btn btn-outline-secondary\""+pug.attr("data-target", target, true, true)+" data-action=\"decrement\""+pug.attr("data-step", step, true, true)) + "\u003E-\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};









pug_mixins["octicon-alert"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cspan class=\"octicon\"\u003E\u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\"\u003E\u003Cpath fill-rule=\"evenodd\" d=\"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z\"\u002F\u003E\u003C\u002Fsvg\u003E\u003C\u002Fspan\u003E";
};








pug_mixins["octicon-arrow-right"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cspan class=\"octicon\"\u003E\u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" width=\"10\" height=\"16\" viewBox=\"0 0 10 16\"\u003E\u003Cpath fill-rule=\"evenodd\" d=\"M10 8L4 3v3H0v4h4v3l6-5z\"\u002F\u003E\u003C\u002Fsvg\u003E\u003C\u002Fspan\u003E";
};








































































































































pug_mixins["octicon-desktop-download"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cspan class=\"octicon\"\u003E\u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\"\u003E\u003Cpath fill-rule=\"evenodd\" d=\"M4 6h3V0h2v6h3l-4 4-4-4zm11-4h-4v1h4v8H1V3h4V2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z\"\u002F\u003E\u003C\u002Fsvg\u003E\u003C\u002Fspan\u003E";
};








































































































































































































































































































































































































































































pug_mixins["octicon-sync"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cspan class=\"octicon\"\u003E\u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" width=\"12\" height=\"16\" viewBox=\"0 0 12 16\"\u003E\u003Cpath fill-rule=\"evenodd\" d=\"M10.236 7.4a4.15 4.15 0 0 1-1.2 3.6 4.346 4.346 0 0 1-5.41.54l1.17-1.14-4.3-.6.6 4.2 1.31-1.26c2.36 1.74 5.7 1.57 7.84-.54a5.876 5.876 0 0 0 1.74-4.46l-1.75-.34zM2.956 5a4.346 4.346 0 0 1 5.41-.54L7.196 5.6l4.3.6-.6-4.2-1.31 1.26c-2.36-1.74-5.7-1.57-7.85.54-1.24 1.23-1.8 2.85-1.73 4.46l1.75.35A4.17 4.17 0 0 1 2.956 5z\"\u002F\u003E\u003C\u002Fsvg\u003E\u003C\u002Fspan\u003E";
};
























































































pug_mixins["form-row"] = pug_interp = function(label){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"form-group row\"\u003E\u003Clabel class=\"col-md-3\"\u003E" + (pug.escape(null == (pug_interp = label) ? "" : pug_interp)) + "\u003C\u002Flabel\u003E\u003Cdiv class=\"col-md-9\"\u003E";
block && block();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
pug_html = pug_html + "\u003Cdiv class=\"tab-content\"\u003E\u003Cdiv class=\"tab-pane fade container show active\" id=\"activity-tab-model\"\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-12 col-lg-6\"\u003E\u003Ccanvas class=\"img-thumbnail\" id=\"fractal-canvas\" width=\"500\" height=\"500\"\u003EВаш браузер не поддерживает canvas.\u003C\u002Fcanvas\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-12 col-lg-6\"\u003E\u003Cform id=\"fractal-form\"\u003E";
pug_mixins["form-row"].call({
block: function(){
pug_mixins["numberInput"]('', 'iterations', 0, 15, 1, 1);
}
}, "Количество итераций:");
pug_mixins["form-row"].call({
block: function(){
pug_html = pug_html + "\u003Cinput class=\"form-control input-sm\" id=\"variables-input\" type=\"text\" name=\"variables\" value=\"A B\"\u003E";
}
}, "Переменные:");
pug_mixins["form-row"].call({
block: function(){
pug_html = pug_html + "\u003Cinput class=\"form-control input-sm\" id=\"constants-input\" type=\"text\" value=\"F b + - [ ]\" disabled=\"true\"\u003E";
}
}, "Константы:");
pug_mixins["form-row"].call({
block: function(){
pug_html = pug_html + "\u003Cinput class=\"form-control input-sm\" id=\"start-input\" type=\"text\" name=\"start\"\u003E";
}
}, "Старт:");
pug_html = pug_html + "\u003Cdiv class=\"form-group row\"\u003E\u003Clabel class=\"col-sm-3\"\u003EПравила:\u003C\u002Flabel\u003E\u003Cdiv class=\"col-sm-9\" id=\"rules-container\"\u003E";
var n = 0;
while (n < 5) {
pug_html = pug_html + "\u003Cdiv class=\"row mb-1\"\u003E\u003Cdiv class=\"col-sm-2 pr-0\"\u003E\u003Cinput class=\"form-control input-sm rule-predecessor\" type=\"text\" value=\"F\" disabled=\"true\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-sm-1 p-0\"\u003E";
pug_mixins["octicon-arrow-right"]();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-sm-9 pl-0\"\u003E\u003Cinput class=\"form-control input-sm rule-successor\" type=\"text\" value=\"F\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
n++
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
pug_mixins["form-row"].call({
block: function(){
pug_mixins["numberInput"]('', 'angle', 0, 180, 1, 90);
}
}, "Угол поворота:");
pug_html = pug_html + "\u003C\u002Fform\u003E\u003Cdiv class=\"alert alert-warning\" id=\"slow-alert\"\u003E";
pug_mixins["octicon-alert"]();
pug_html = pug_html + "\nОтрисовка этой системы займет много времени. Нажмите \u003Cstrong\u003EСгенерировать фрактал\u003C\u002Fstrong\u003E чтобы продолжить.\u003C\u002Fdiv\u003E\u003Cbutton class=\"btn btn-primary m-1\" id=\"draw-btn\"\u003E";
pug_mixins["octicon-sync"]();
pug_html = pug_html + "\nСгенерировать фрактал\u003C\u002Fbutton\u003E\u003Cdiv class=\"dropdown m-1\"\u003E\u003Cbutton class=\"btn btn-secondary dropdown-toggle\" data-toggle=\"dropdown\"\u003E";
pug_mixins["octicon-desktop-download"]();
pug_html = pug_html + "\nСохранить как\u003C\u002Fbutton\u003E\u003Cdiv class=\"dropdown-menu\"\u003E\u003Ca class=\"dropdown-item\" id=\"save-png-btn\" href=\"#\"\u003EPNG\u003C\u002Fa\u003E\u003Ca class=\"dropdown-item\" id=\"save-svg-btn\" href=\"#\"\u003ESVG\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"dropdown m-1\"\u003E\u003Cbutton class=\"btn btn-secondary dropdown-toggle\" data-toggle=\"dropdown\"\u003EПримеры\u003C\u002Fbutton\u003E\u003Cdiv class=\"dropdown-menu\" id=\"presets-list\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"tab-pane fade\" id=\"activity-tab-code\"\u003E\u003Ch3\u003EРедактировать JSON\u003C\u002Fh3\u003E\u003Cdiv class=\"container\"\u003E\u003Cdiv class=\"row mb-3\"\u003E\u003Ctextarea class=\"card\" id=\"json-data\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"\u003E\u003C\u002Ftextarea\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"row mb-3\"\u003E\u003Cbutton class=\"btn btn-primary\" id=\"save-json-btn\"\u003EСохранить\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"tab-pane fade\" id=\"activity-tab-help\"\u003E\u003Cp\u003EДля рисования L-систем на плоскости используется т.н. \u003Ca href=\"https:\u002F\u002Fru.wikipedia.org\u002Fwiki\u002FЧерепашья_графика\"\u003Eчерепашья графика\u003C\u002Fa\u003E.\n\u003Cp\u003EЧепепашка характеризуется координатами \u003Cem\u003Ex\u003C\u002Fem\u003E и \u003Cem\u003Ey\u003C\u002Fem\u003E на плоскости, а так же углом \u003Cem\u003E&alpha;\u003C\u002Fem\u003E, указывающим направление, куда она смотрит. Черепашка может поворачиваться на месте на фиксированный угол, делать шаг вперед (фиксированное расстояние) и прочерчивать за собой след.\n\u003Cp\u003EСистема команд для управления черепашкой следующая:\n\u003Ctable class=\"table\"\u003E\n\u003Ctbody\u003E\n\u003Ctr\u003E\n\u003Ctd\u003EF\u003C\u002Ftd\u003E\u003Ctd\u003Eсделать шаг вперед, нарисовав линию\u003C\u002Ftd\u003E\n\u003C\u002Ftr\u003E\n\u003Ctr\u003E\n\u003Ctd\u003Ed\u003C\u002Ftd\u003E\u003Ctd\u003Eсделать шаг вперед, не рисуя\u003C\u002Ftd\u003E\n\u003C\u002Ftr\u003E\n\u003Ctr\u003E\n\u003Ctd\u003E+\u003C\u002Ftd\u003E\u003Ctd\u003Eповернуть по часовой стрелке\u003C\u002Ftd\u003E\n\u003C\u002Ftr\u003E\n\u003Ctr\u003E\n\u003Ctd\u003E-\u003C\u002Ftd\u003E\u003Ctd\u003Eповернуть против часовой стрелки\u003C\u002Ftd\u003E\n\u003C\u002Ftr\u003E\n\u003Ctr\u003E\n\u003Ctd\u003E[\u003C\u002Ftd\u003E\u003Ctd\u003Eзапомнить текущее положение\u003C\u002Ftd\u003E\n\u003C\u002Ftr\u003E\n\u003Ctr\u003E\n\u003Ctd\u003E]\u003C\u002Ftd\u003E\u003Ctd\u003Eвосстаносить предыдущее положение\u003C\u002Ftd\u003E\n\u003C\u002Ftr\u003E\n\u003C\u002Ftbody\u003E\n\u003C\u002Ftable\u003E\n\u003Cp\u003EВсе другие буквы черепашкой игнорируются, однако на их место могут подставляться другие команды в последующих итерациях.\n\u003Cp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./src/modules/lsystem/templates/presetitem.pug":
/*!******************************************************!*\
  !*** ./src/modules/lsystem/templates/presetitem.pug ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (name) {pug_html = pug_html + "\u003Ca class=\"dropdown-item\" id=\"preset_#{ index }\" data-preset=\"#{ index }\" href=\"#\"\u003E" + (pug.escape(null == (pug_interp = name) ? "" : pug_interp)) + "\u003C\u002Fa\u003E";}.call(this,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined));;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./src/modules/lsystem/templates/tabs.pug":
/*!************************************************!*\
  !*** ./src/modules/lsystem/templates/tabs.pug ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv class=\"nav nav-tabs navbar-nav align-self-end\" id=\"lsystem-tabs-select\"\u003E\u003Ca class=\"nav-link active\" href=\"#activity-tab-model\" data-toggle=\"tab\"\u003EМодель\u003C\u002Fa\u003E\u003Ca class=\"nav-link\" href=\"#activity-tab-code\" data-toggle=\"tab\"\u003EКод\u003C\u002Fa\u003E\u003Ca class=\"nav-link\" href=\"#activity-tab-help\" data-toggle=\"tab\"\u003EСправка\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ }),

/***/ "./src/modules/lsystem/turtle.js":
/*!***************************************!*\
  !*** ./src/modules/lsystem/turtle.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Turtle; });
class Turtle {
  constructor(startX = 0, startY = 0, startAngle = 0, angleStep = 0, step = 10) {
    this.x = Number(startX);
    this.y = Number(startY);
    this.angle = Number(startAngle);
    this.angleStep = Number(angleStep);
    this.step = Number(step);
    this.posStack = [];
  }

  turnCW() {
    this.angle = (this.angle + this.angleStep) % 360;
  }

  turnCCW() {
    this.angle = (this.angle - this.angleStep) % 360;
  }

  moveForward() {
    const rad = this.angle / 180.0 * Math.PI;
    this.x += Math.cos(rad) * this.step;
    this.y += Math.sin(rad) * this.step;
  }

  start(startX, startY, startAngle) {
    this.x = Number(startX);
    this.y = Number(startY);
    this.angle = Number(startAngle);
    this.posStack.length = 0;
  }

  savePos() {
    this.posStack.push({'x': this.x, 'y': this.y, 'angle': this.angle});
  }

  restorePos() {
    if (!this.posStack.length) {
      return;
    }
    const pos = this.posStack.pop();
    this.x = pos.x;
    this.y = pos.y;
    this.angle = pos.angle;
  }

  drawPath(path, drawingTool) {
    drawingTool.start();
    drawingTool.moveTo(this.x, this.y);
    for (let i = 0; i < path.length; i++) {
      const command = path[i];
      switch (command) {
      case '-':
        this.turnCCW();
        break;
      case '+':
        this.turnCW();
        break;
      case 'b':
        this.moveForward();
        drawingTool.moveTo(this.x, this.y);
        break;
      case 'F':
        this.moveForward();
        drawingTool.lineTo(this.x, this.y);
        break;
      case '[':
        this.savePos();
        break;
      case ']':
        this.restorePos();
        drawingTool.moveTo(this.x, this.y);
        break;
      default:
        break;
      }
    }
    drawingTool.finish();
  }
}


/***/ }),

/***/ "./src/modules/lsystem/util.js":
/*!*************************************!*\
  !*** ./src/modules/lsystem/util.js ***!
  \*************************************/
/*! exports provided: Point, Rect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Point", function() { return Point; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Rect", function() { return Rect; });
class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Check if this point and argument are equal (have similar coordinates).
   * @param {Point} point - point to compare to.
   * @param {Number} epsilon - maximum difference in coordinates of two points.
   * @returns {Boolean} true, if points are close to each other, false otherwise.
   */
  eq(point, epsilon = 0.1) {
    return Math.abs(this.x - point.x) < epsilon && Math.abs(this.y - point.y) < epsilon;
  }
}

class Rect {
  constructor(left = 0, top = 0, right = 0, bottom = 0) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  }

  get width() {
    return this.right - this.left;
  }

  get height() {
    return this.bottom - this.top;
  }

  get x() {
    return this.left;
  }

  get y() {
    return this.top;
  }

  /**
   * Move any side of rectangle to coordinates of point if its not inside rectangle.
   * @param {Point} x, y - point that will be inside this rectangle.
   */
  stretchToPoint({x, y}) {
    this.left = Math.min(this.left, x);
    this.right = Math.max(this.right, x);
    this.top = Math.min(this.top, y);
    this.bottom = Math.max(this.bottom, y);
  }

  /**
   * Expand dimentions of rectangle slightly if it have zero width or height.
   */
  notZero() {
    if (this.width === 0) {
      this.left -= 0.0001;
      this.right += 0.0001;
    }
    if (this.height === 0) {
      this.top -= 0.0001;
      this.bottom += 0.0001;
    }
  }

  /**
   * Subtracts padding from each side of rectangle.
   * Negative argument can be used to expand rectangle instead.
   * @param {Number} padding - Number of units to subtract from each side.
   */
  shrink(padding) {
    this.left += padding;
    this.top += padding;
    this.right -= padding;
    this.bottom -= padding;
  }

  /**
   * Creates new rectangle that has same aspect ratio as first argument that fitted and centered to second argument.
   * @param {Rect} rectangle - new Rect will have aspect ratio of this rectangle.
   * @param {Rect} into - new Rect will have dimentions that not exceeds this and will have center in same point.
   * @returns {Rect} new rectangle
   */
  static fit(rectangle, into) {
    let width   = rectangle.width;
    let height  = rectangle.height;
    const factorX = into.width  / width;
    const factorY = into.height / height;

    let factor = 1.0;

    factor = factorX < factorY ? factorX : factorY;
    width  *= factor;
    height *= factor;

    const x = into.x + (into.width  - width)  / 2;
    const y = into.y + (into.height - height) / 2;

    const fitRect = new Rect(x, y, x + width, y + height);
    return fitRect;
  };
}


/***/ }),

/***/ "./src/utils/save-utils.js":
/*!*********************************!*\
  !*** ./src/utils/save-utils.js ***!
  \*********************************/
/*! exports provided: saveBlob, saveCanvas, saveImage, saveChart */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveBlob", function() { return saveBlob; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveCanvas", function() { return saveCanvas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveImage", function() { return saveImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveChart", function() { return saveChart; });
const saveBlob = (filename, blob) => {
  saveImage(filename, URL.createObjectURL(blob));
};

const saveCanvas = (filename, canvas) => {
  saveImage(filename, canvas.toDataURL());
};

const saveImage = (filename, dataUrl) => {
  const anchor = document.createElement('a');
  anchor.setAttribute('href', dataUrl);
  anchor.setAttribute('target', '_blank');
  anchor.setAttribute('download', filename);
  if (document.createEvent) {
    const evtObj = document.createEvent('MouseEvents');
    evtObj.initEvent('click', true, true);
    anchor.dispatchEvent(evtObj);
  } else if (anchor.click) {
    anchor.click();
  }
};

const saveChart = (chart, filename, width = 800, height = 800) => {
  const oldStyle = chart.canvas.parentNode.style;
  const oldClass = chart.canvas.parentNode.className;
  chart.canvas.parentNode.style.width = `${width}px`;
  chart.canvas.parentNode.style.height = `${height}px`;
  chart.canvas.parentNode.className = '';
  chart.resize();
  chart.render();
  const dataUrl = chart.toBase64Image('image/png');
  saveImage(filename, dataUrl);
  chart.canvas.parentNode.style = oldStyle;
  chart.canvas.parentNode.className = oldClass;
};


/***/ })

}]);
//# sourceMappingURL=lsystem.bundle.js.map