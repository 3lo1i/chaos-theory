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



console.log('attractor module has loaded');

const title = 'Аттрактор Лоренца';

const init = () => {
  console.log('attractor init');
  return jquery__WEBPACK_IMPORTED_MODULE_1___default()(_attractor_pug__WEBPACK_IMPORTED_MODULE_0___default()());
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

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv\u003ETBD\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ })

}]);
//# sourceMappingURL=attractor.bundle.js.map