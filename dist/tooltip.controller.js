"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("tooltip.controller", ["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.tooltipController = mod.exports;
  }
})(this, function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var TooltipController = exports.TooltipController = function TooltipController($log) {
    _classCallCheck(this, TooltipController);

    this.log = $log;
  };
});
//# sourceMappingURL=tooltip.controller.js.map
