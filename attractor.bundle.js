(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["attractor"],{

/***/ "./src/modules/attractor/attractor.js":
/*!********************************************!*\
  !*** ./src/modules/attractor/attractor.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _attractor_pug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attractor.pug */ "./src/modules/attractor/attractor.pug");
/* harmony import */ var _attractor_pug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_attractor_pug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_save_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/save-utils */ "./src/utils/save-utils.js");




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

  const activity = jquery__WEBPACK_IMPORTED_MODULE_1___default()(_attractor_pug__WEBPACK_IMPORTED_MODULE_0___default()());

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
    Object(_utils_save_utils__WEBPACK_IMPORTED_MODULE_2__["saveCanvas"])('attractor.png', canvas[0]);
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

/* harmony default export */ __webpack_exports__["default"] = ({ title, init, destroy });


/***/ }),

/***/ "./src/modules/attractor/attractor.pug":
/*!*********************************************!*\
  !*** ./src/modules/attractor/attractor.pug ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;









pug_mixins["sliderInput"] = pug_interp = function(variable, param_id, min, max, step, value){
var block = (this && this.block), attributes = (this && this.attributes) || {};
var id = `${param_id}-input`
pug_html = pug_html + "\u003Cdiv class=\"input-group\"\u003E";
if ((variable)) {
pug_html = pug_html + "\u003Cdiv class=\"input-group-prepend col-2 col-md-1 pr-0\"\u003E\u003Cspan class=\"input-group-text w-100\"\u003E" + (null == (pug_interp = variable) ? "" : pug_interp) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003Cdiv class=\"form-control col\"\u003E\u003Cinput" + (" class=\"form-control\""+" type=\"range\""+pug.attr("id", id, true, true)+pug.attr("name", param_id, true, true)+pug.attr("min", min, true, true)+pug.attr("max", max, true, true)+pug.attr("step", step, true, true)+pug.attr("value", value, true, true)+pug.attr("data-param", param_id, true, true)) + "\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"input-group-append col-2 col-md-1 pl-0\"\u003E\u003Cspan" + (" class=\"input-group-text w-100\""+pug.attr("data-bind", param_id, true, true)) + "\u003E" + (pug.escape(null == (pug_interp = value) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
























































































































































pug_mixins["octicon-desktop-download"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cspan class=\"octicon\"\u003E\u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\"\u003E\u003Cpath fill-rule=\"evenodd\" d=\"M4 6h3V0h2v6h3l-4 4-4-4zm11-4h-4v1h4v8H1V3h4V2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z\"\u002F\u003E\u003C\u002Fsvg\u003E\u003C\u002Fspan\u003E";
};




































































































































































































































































































































































































































































































































































pug_mixins["form-row"] = pug_interp = function(label){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Cdiv class=\"form-group row\"\u003E\u003Clabel class=\"col-md-3\"\u003E" + (pug.escape(null == (pug_interp = label) ? "" : pug_interp)) + "\u003C\u002Flabel\u003E\u003Cdiv class=\"col-md-9\"\u003E";
block && block();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
};
pug_html = pug_html + "\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-12 col-lg-6\"\u003E\u003Ccanvas class=\"img-thumbnail\" id=\"attractor-canvas\" width=\"500\" height=\"500\"\u003EВаш браузер не поддерживает canvas.\u003C\u002Fcanvas\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-12 col-lg-6\"\u003E\u003Cform id=\"attractor-form\"\u003E";
pug_mixins["form-row"].call({
block: function(){
pug_mixins["sliderInput"]("σ", "a", 0.1, 40.0, 0.01, 5.0);
}
}, "Параметр σ");
pug_mixins["form-row"].call({
block: function(){
pug_mixins["sliderInput"]("r", "b", 0.1, 40.0, 0.01, 15.0);
}
}, "Параметр r");
pug_mixins["form-row"].call({
block: function(){
pug_mixins["sliderInput"]("b", "c", 0.1, 40.0, 0.01, 1.0);
}
}, "Параметр b");
pug_mixins["form-row"].call({
block: function(){
pug_mixins["sliderInput"]("dt", "dt", 0.0001, 0.01, 0.0001, 0.0001);
}
}, "Время между итерациями");
pug_mixins["form-row"].call({
block: function(){
pug_mixins["sliderInput"]("n", "iterations", 10, 500, 10, 500);
}
}, "Число итераций (x1000)");
pug_html = pug_html + "\u003C\u002Fform\u003E\u003Cdiv class=\"dropdown m-1\"\u003E\u003Cbutton class=\"btn btn-secondary dropdown-toggle\" data-toggle=\"dropdown\"\u003E";
pug_mixins["octicon-desktop-download"]();
pug_html = pug_html + "\nСохранить как\u003C\u002Fbutton\u003E\u003Cdiv class=\"dropdown-menu\"\u003E\u003Ca class=\"dropdown-item\" id=\"save-png-btn\" href=\"#\"\u003EPNG\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

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
//# sourceMappingURL=attractor.bundle.js.map