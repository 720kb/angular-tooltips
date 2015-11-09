/*global angular,document*/
(function withAngular(angular, document) {
  'use strict';

  var directiveName = 'tooltips'
  , getElementHTML = function getElementHTML(element) {
    var txt
      , ax
      , el = document.createElement('div');

    element.removeAttr(directiveName);
    el.appendChild(element.clone()[0]);
    txt = el.innerHTML;
    ax = txt.indexOf('>') + 1;
    txt = txt.substring(0, ax) + element.html() + txt.substring(ax);
    el = null;
    return txt;
  }
  , trasformTooltipContent = function trasformTooltipContent(element, tooltippedContent, tooltipContent, side) {

    if (!side) {

      side = 'top';
    }

    return [
      '<a tooltips class="' + side + ' tooltips">',
        tooltippedContent,
        '<tip>',
          tooltipContent,
        '</tip>',
      '</a>'
    ].join(' ');
  }
  , TooltipController = /*@ngInject*/ function TooltipController($log) {

    $log.info('controller called');
  }
  , tooltipDirective = /*@ngInject*/ function tooltipDirective($log) {

    $log.info('Called!');
    return {
      'restrict': 'A',
      'scope': {},
      'bindToController': {
        'tooltipTemplate': '=?', //ex tooltipContent
        'tooltipTemplateUrl': '=?', //ex tooltipView
        'tooltipModel': '=?', //ex tooltipViewModel
        'tooltipController': '=?', //ex tooltipViewController
        'tooltipSize': '=?',
        'tooltipSpeed': '=?',
        'tooltipDelay': '=?',
        'tooltipSmart': '=?', //ex tooltipTry actual option
        'tooltipClass': '=?'
      },
      'controllerAs': 'tooltipCtrl',
      'controller': TooltipController,
      'compile': function compiling(compileElement, compileAttributes) {

        var initialElement = getElementHTML(compileElement)
          , startingTooltipContent = trasformTooltipContent(compileElement, initialElement, compileAttributes.tooltipTitle, compileAttributes.tooltipSide);

        compileElement.replaceWith(startingTooltipContent);
        return function linkingFunction(scope, element, attrs) {

          var onTooltipShow = function onTooltipShow() {

            element.addClass('active');
          }
          , onTooltipHide = function onTooltipHide() {

            element.removeClass('active');
          }
          , onTooltipTitleChange = function onTooltipTitleChange(newValue, oldValue) {

            if (newValue) {

              if (oldValue) {

                element.find('tip').html(newValue);
              }
              scope.tooltipCtrl.tooltipTitle = newValue;
            }
          }
          , onTooltipSideChange = function onTooltipSideChange(newValue, oldValue) {

            if (newValue) {

              if (oldValue) {

                element.removeAttr(oldValue);
              }
              element.addClass(newValue);
              scope.tooltipCtrl.tooltipSide = newValue;
            }
          }
          , onTooltipShowTrigger = function onTooltipShowTrigger(newValue, oldValue) {

            if (newValue) {

              if (oldValue) {

                element.off(oldValue);
              }
              element.on(newValue, onTooltipShow);
            }
          }
          , onTooltipHideTrigger = function onTooltipHideTrigger(newValue, oldValue) {

            if (newValue) {

              if (oldValue) {

                element.off(oldValue);
              }
              element.on(newValue, onTooltipHide);
            }
          }
          , unregisterOnTooltipTitleChangeObserver = attrs.$observe('tooltipTitle', onTooltipTitleChange)
          , unregisterOnTooltipSideChangeObserver = attrs.$observe('tooltipSide', onTooltipSideChange)
          , unregisterOnTooltipShowTrigger = attrs.$observe('tooltipShowTrigger', onTooltipShowTrigger)
          , unregisterOnTooltipHideTrigger = attrs.$observe('tooltipHideTrigger', onTooltipHideTrigger);

          attrs.tooltipShowTrigger = attrs.tooltipShowTrigger || 'mousemove';
          attrs.tooltipHideTrigger = attrs.tooltipHideTrigger || 'mouseout';
          scope.$on('$destroy', function unregisterListeners() {

            unregisterOnTooltipTitleChangeObserver();
            unregisterOnTooltipSideChangeObserver();
            unregisterOnTooltipShowTrigger();
            unregisterOnTooltipHideTrigger();
          });
        };
      }
    };
  };

  angular.module('720kb.tooltips', [])
  .directive(directiveName, tooltipDirective);
}(angular, document));
