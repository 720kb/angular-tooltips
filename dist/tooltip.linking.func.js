'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('tooltip.linking.func', ['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.tooltipLinkingFunc = mod.exports;
  }
})(this, function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var linkingFunction = exports.linkingFunction = function linkingFunction(scope, element, attrs) {
    'use strict';

    window.console.log(attrs);
  };
});
//# sourceMappingURL=tooltip.linking.func.js.map
