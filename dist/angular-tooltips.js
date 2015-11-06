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
'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('tooltip.controller', ['exports'], factory);
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

  var TooltipController = exports.TooltipController = ["$log", function TooltipController($log) {
    'ngInject';

    _classCallCheck(this, TooltipController);

    this.log = $log;
  }];
});
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

  var tooltipDirective = function tooltipDirective($log) {
    'use strict';

    $log.info('Called!');
    return {
      'restrict': 'A',
      'scope': {},
      'bindToController': {
        'tooltipTitle': '=?',
        'tooltipSide': '=?',
        'tooltipTemplate': '=?',
        'tooltipTemplateUrl': '=?',
        'tooltipModel': '=?',
        'tooltipController': '=?',
        'tooltipSize': '=?',
        'tooltipSpeed': '=?',
        'tooltipDelay': '=?',
        'tooltipSmart': '=?',
        'tooltipShowTrigger': '=?',
        'tooltipHideTrigger': '=?',
        'tooltipClass': '=?'
      },
      'controllerAs': 'tooltipoCtrl',
      'controller': _tooltipController.TooltipController,
      'link': _tooltipLinkingFunc.linkingFunction
    };
  };

  exports.default = tooltipDirective;
});
'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('tooltip.module', ['exports', 'angular', './tooltip.directive.js'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('angular'), require('./tooltip.directive.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.angular, global.tooltipDirective);
    global.tooltipModule = mod.exports;
  }
})(this, function (exports, _angular, _tooltipDirective) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _angular2 = _interopRequireDefault(_angular);

  var _tooltipDirective2 = _interopRequireDefault(_tooltipDirective);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var tooltipModule = _angular2.default.module('720kb.tooltips', [], {
    'strictDi': true
  });

  tooltipModule.directive('tooltips', _tooltipDirective2.default);
  exports.default = tooltipModule;
});