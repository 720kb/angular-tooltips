'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('tooltip.directive', ['exports', './tooltip.controller.js', './tooltip.linking.func.js'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./tooltip.controller.js'), require('./tooltip.linking.func.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.tooltipController, global.tooltipLinkingFunc);
    global.tooltipDirective = mod.exports;
  }
})(this, function (exports, _tooltipController, _tooltipLinkingFunc) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.tooltipDirective = undefined;

  var tooltipDirective = exports.tooltipDirective = function tooltipDirective() {
    'use strict';

    return {
      'restrict': 'A',
      'scope': {},
      'bindToController': {
        'tooltipTitle': '=?',
        'tooltipSide': '=?',
        'tooltipTemplate': '=?', //ex tooltipContent
        'tooltipTemplateUrl': '=?', //ex tooltipView
        'tooltipModel': '=?', //ex tooltipViewModel
        'tooltipController': '=?', //ex tooltipViewController
        'tooltipSize': '=?',
        'tooltipSpeed': '=?',
        'tooltipDelay': '=?',
        'tooltipSmart': '=?', //ex tooltipTry actual option
        'tooltipShowTrigger': '=?',
        'tooltipHideTrigger': '=?',
        'tooltipClass': '=?'
      },
      'controllerAs': 'tooltipoCtrl',
      'controller': _tooltipController.TooltipController,
      'link': _tooltipLinkingFunc.linkingFunction
    };
  };
});
//# sourceMappingURL=tooltip.directive.js.map
