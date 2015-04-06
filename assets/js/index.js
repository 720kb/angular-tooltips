/*global angular*/

(function withAngular(angular) {
  'use strict';

  angular.module('720kb', [
    'ngRoute',
    'ngSanitize',
    '720kb.tooltips'
  ]);
  
  angular.module('720kb').controller('test', function($scope) {
    $scope.tooltipContent = 'Yeo man<br/>LineBreak!';
  });
}(angular));
