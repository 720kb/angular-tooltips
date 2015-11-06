import {TooltipController} from './tooltip.controller.js';
import {linkingFunction} from './tooltip.linking.func.js';

const tooltipDirective = /*@ngInject*/ function tooltipDirective($log) {
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
    'controller': TooltipController,
    'link': linkingFunction
  };
};

export default tooltipDirective;
