"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/point-in-polygon-hao";
exports.ids = ["vendor-chunks/point-in-polygon-hao"];
exports.modules = {

/***/ "(ssr)/./node_modules/point-in-polygon-hao/dist/pointInPolygon.mjs":
/*!*******************************************************************!*\
  !*** ./node_modules/point-in-polygon-hao/dist/pointInPolygon.mjs ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var robust_predicates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! robust-predicates */ \"(ssr)/./node_modules/robust-predicates/index.js\");\n\n\nfunction pointInPolygon(p, polygon) {\n    var i;\n    var ii;\n    var k = 0;\n    var f;\n    var u1;\n    var v1;\n    var u2;\n    var v2;\n    var currentP;\n    var nextP;\n\n    var x = p[0];\n    var y = p[1];\n\n    var numContours = polygon.length;\n    for (i = 0; i < numContours; i++) {\n        ii = 0;\n        var contour = polygon[i];\n        var contourLen = contour.length - 1;\n\n        currentP = contour[0];\n        if (currentP[0] !== contour[contourLen][0] &&\n            currentP[1] !== contour[contourLen][1]) {\n            throw new Error('First and last coordinates in a ring must be the same')\n        }\n\n        u1 = currentP[0] - x;\n        v1 = currentP[1] - y;\n\n        for (ii; ii < contourLen; ii++) {\n            nextP = contour[ii + 1];\n\n            u2 = nextP[0] - x;\n            v2 = nextP[1] - y;\n\n            if (v1 === 0 && v2 === 0) {\n                if ((u2 <= 0 && u1 >= 0) || (u1 <= 0 && u2 >= 0)) { return 0 }\n            } else if ((v2 >= 0 && v1 < 0) || (v2 < 0 && v1 >= 0)) {\n                f = (0,robust_predicates__WEBPACK_IMPORTED_MODULE_0__.orient2d)(u1, u2, v1, v2, 0, 0);\n                if (f === 0) { return 0 }\n                if ((f > 0 && v2 > 0 && v1 <= 0) || (f < 0 && v2 <= 0 && v1 > 0)) { k++; }\n            }\n            currentP = nextP;\n            v1 = v2;\n            u1 = u2;\n        }\n    }\n\n    if (k % 2 === 0) { return false }\n    return true\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pointInPolygon);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcG9pbnQtaW4tcG9seWdvbi1oYW8vZGlzdC9wb2ludEluUG9seWdvbi5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBNkM7O0FBRTdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsaUJBQWlCO0FBQ2xDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxvRUFBb0U7QUFDcEUsY0FBYztBQUNkLG9CQUFvQiwyREFBUTtBQUM1QiwrQkFBK0I7QUFDL0Isb0ZBQW9GO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkI7QUFDQTs7QUFFQSxpRUFBZSxjQUFjLEVBQUMiLCJzb3VyY2VzIjpbIi9ob21lL2FqYXktc2luZ2gvRGVza3RvcC9nbG9iZS1hamF5L0dsb2JhbC1Ib3VzZS1BY3Rpdml0eS9nbG9iZS9ub2RlX21vZHVsZXMvcG9pbnQtaW4tcG9seWdvbi1oYW8vZGlzdC9wb2ludEluUG9seWdvbi5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgb3JpZW50MmQgfSBmcm9tICdyb2J1c3QtcHJlZGljYXRlcyc7XG5cbmZ1bmN0aW9uIHBvaW50SW5Qb2x5Z29uKHAsIHBvbHlnb24pIHtcbiAgICB2YXIgaTtcbiAgICB2YXIgaWk7XG4gICAgdmFyIGsgPSAwO1xuICAgIHZhciBmO1xuICAgIHZhciB1MTtcbiAgICB2YXIgdjE7XG4gICAgdmFyIHUyO1xuICAgIHZhciB2MjtcbiAgICB2YXIgY3VycmVudFA7XG4gICAgdmFyIG5leHRQO1xuXG4gICAgdmFyIHggPSBwWzBdO1xuICAgIHZhciB5ID0gcFsxXTtcblxuICAgIHZhciBudW1Db250b3VycyA9IHBvbHlnb24ubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBudW1Db250b3VyczsgaSsrKSB7XG4gICAgICAgIGlpID0gMDtcbiAgICAgICAgdmFyIGNvbnRvdXIgPSBwb2x5Z29uW2ldO1xuICAgICAgICB2YXIgY29udG91ckxlbiA9IGNvbnRvdXIubGVuZ3RoIC0gMTtcblxuICAgICAgICBjdXJyZW50UCA9IGNvbnRvdXJbMF07XG4gICAgICAgIGlmIChjdXJyZW50UFswXSAhPT0gY29udG91cltjb250b3VyTGVuXVswXSAmJlxuICAgICAgICAgICAgY3VycmVudFBbMV0gIT09IGNvbnRvdXJbY29udG91ckxlbl1bMV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYW5kIGxhc3QgY29vcmRpbmF0ZXMgaW4gYSByaW5nIG11c3QgYmUgdGhlIHNhbWUnKVxuICAgICAgICB9XG5cbiAgICAgICAgdTEgPSBjdXJyZW50UFswXSAtIHg7XG4gICAgICAgIHYxID0gY3VycmVudFBbMV0gLSB5O1xuXG4gICAgICAgIGZvciAoaWk7IGlpIDwgY29udG91ckxlbjsgaWkrKykge1xuICAgICAgICAgICAgbmV4dFAgPSBjb250b3VyW2lpICsgMV07XG5cbiAgICAgICAgICAgIHUyID0gbmV4dFBbMF0gLSB4O1xuICAgICAgICAgICAgdjIgPSBuZXh0UFsxXSAtIHk7XG5cbiAgICAgICAgICAgIGlmICh2MSA9PT0gMCAmJiB2MiA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmICgodTIgPD0gMCAmJiB1MSA+PSAwKSB8fCAodTEgPD0gMCAmJiB1MiA+PSAwKSkgeyByZXR1cm4gMCB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCh2MiA+PSAwICYmIHYxIDwgMCkgfHwgKHYyIDwgMCAmJiB2MSA+PSAwKSkge1xuICAgICAgICAgICAgICAgIGYgPSBvcmllbnQyZCh1MSwgdTIsIHYxLCB2MiwgMCwgMCk7XG4gICAgICAgICAgICAgICAgaWYgKGYgPT09IDApIHsgcmV0dXJuIDAgfVxuICAgICAgICAgICAgICAgIGlmICgoZiA+IDAgJiYgdjIgPiAwICYmIHYxIDw9IDApIHx8IChmIDwgMCAmJiB2MiA8PSAwICYmIHYxID4gMCkpIHsgaysrOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50UCA9IG5leHRQO1xuICAgICAgICAgICAgdjEgPSB2MjtcbiAgICAgICAgICAgIHUxID0gdTI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoayAlIDIgPT09IDApIHsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQgZGVmYXVsdCBwb2ludEluUG9seWdvbjtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/point-in-polygon-hao/dist/pointInPolygon.mjs\n");

/***/ })

};
;