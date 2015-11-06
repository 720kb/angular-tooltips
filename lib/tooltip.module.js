import angular from 'angular';
import tooltipDirective from './tooltip.directive.js';

let tooltipModule = angular.module('720kb.tooltips', [], {
  'strictDi': true
});

tooltipModule.directive('tooltips', tooltipDirective);

export default tooltipModule;
