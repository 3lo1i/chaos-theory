(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["lotka"],{

/***/ "./src/modules/lotka/lotka.js":
/*!************************************!*\
  !*** ./src/modules/lotka/lotka.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lotka_pug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lotka.pug */ "./src/modules/lotka/lotka.pug");
/* harmony import */ var _lotka_pug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lotka_pug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);



console.log('lotka module has loaded');

const title = 'Модель Лотки — Вольтерры';

const init = () => {
  console.log('lotka init');
  return jquery__WEBPACK_IMPORTED_MODULE_1___default()(_lotka_pug__WEBPACK_IMPORTED_MODULE_0___default()());
};

const destroy = () => {
  console.log('lotka destroyed');
};

/* harmony default export */ __webpack_exports__["default"] = ({ title, init, destroy });


/***/ }),

/***/ "./src/modules/lotka/lotka.pug":
/*!*************************************!*\
  !*** ./src/modules/lotka/lotka.pug ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ "./node_modules/pug-runtime/index.js");

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html + "\u003Cdiv\u003ETBD\u003C\u002Fdiv\u003E";;return pug_html;};
module.exports = template;

/***/ })

}]);
//# sourceMappingURL=lotka.bundle.js.map