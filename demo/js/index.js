/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('720kb', [
    '720kb.tooltips'
  ])
  .controller('Ctrl', [
    '$timeout',
    function controllerCtrl($timeout) {
      var that = this;

      that.items = ['1','2','4','5'];
      $timeout(function doTimeout() {

        that.items.push('7');
        that.items.push('9');
      }, 5000);
    }
  ])
  .controller('DemoCtrl', [
    function controllerCtrl() {

      this.generateHTMLextra = function generateHTMLextra(item) {

        return '<i>hello tooltip content' + item + '</i>';
      };
    }
  ]);
}(angular));
