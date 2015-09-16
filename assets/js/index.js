/*global angular*/

(function withAngular(angular) {
  'use strict';

  angular.module('720kb', [
    'ngRoute',
    '720kb.tooltips'
  ])
  .controller('Ctrl', [
    '$scope',
    '$timeout',
    function controllerCtrl($scope, $timeout) {

    $scope.generateHTMLextra = function generateHTMLextra(item) {

      return '<i>hello tooltip content' + item + '</i>';
    };
    $scope.items = ['1','2','4','5'];
    $timeout(function () {
      $scope.items.push('7');
        $scope.items.push('9');
    }, 5000);
  }]);
}(angular));
