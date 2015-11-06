(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.tooltipLinkingFunc = mod.exports;
  }
})(this, function (exports) {
  /*global window*/
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  var linkingFunction = function linkingFunction(scope, element, attrs) {
    'use strict';

    window.console.log(attrs);
  };
  exports.linkingFunction = linkingFunction;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
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
  // jscs:disable disallowAnonymousFunctions
  // jscs:disable requireNamedUnassignedFunctions
  // jscs:disable requireSpacesInAnonymousFunctionExpression
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var TooltipController =

  /*@ngInject*/
  ["$log", function TooltipController($log) {
    _classCallCheck(this, TooltipController);

    this.log = $log;
  }]
  // jscs:enable disallowAnonymousFunctions
  // jscs:enable requireNamedUnassignedFunctions
  // jscs:enable requireSpacesInAnonymousFunctionExpression
  ;

  exports.TooltipController = TooltipController;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './tooltip.controller.js', './tooltip.linking.func.js'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./tooltip.controller.js'), require('./tooltip.linking.func.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.tooltipController, global.tooltipLinkingFunc);
    global.tooltipDirective = mod.exports;
  }
})(this, function (exports, module, _tooltipControllerJs, _tooltipLinkingFuncJs) {
  'use strict';

  var tooltipDirective = /*@ngInject*/["$log", function tooltipDirective($log) {
    'use strict';

    $log.info('Called!');

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
      'controller': _tooltipControllerJs.TooltipController,
      'link': _tooltipLinkingFuncJs.linkingFunction
    };
  }];

  module.exports = tooltipDirective;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'angular', './tooltip.directive.js'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('angular'), require('./tooltip.directive.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.angular, global.tooltipDirective);
    global.tooltipModule = mod.exports;
  }
})(this, function (exports, module, _angular, _tooltipDirectiveJs) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _angular2 = _interopRequireDefault(_angular);

  var _tooltipDirective = _interopRequireDefault(_tooltipDirectiveJs);

  var tooltipModule = _angular2['default'].module('720kb.tooltips', [], {
    'strictDi': true
  });

  tooltipModule.directive('tooltips', _tooltipDirective['default']);

  module.exports = tooltipModule;
});