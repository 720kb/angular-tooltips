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
  , trasformTooltipContent = function trasformTooltipContent(tooltippedContent, tooltipContent, tooltipTemplate, side) {

    var toReturn = [
      '<a tooltips title="' + tooltipContent + '" class="' + side + ' tooltips">',
        '<tip-cont>',
          tooltippedContent,
        '</tip-cont>'
      ];

    if (tooltipTemplate) {

      toReturn = toReturn.concat([
        '<tip>',
          tooltipTemplate,
        '</tip>'
      ]);
    }
    toReturn.push('</a>');
    return toReturn.join(' ');
  }
  , TooltipController = /*@ngInject*/ function TooltipController($log) {

    $log.info('controller called');
  }
  , tooltipDirective = /*@ngInject*/ function tooltipDirective($window) {

    return {
      'restrict': 'A',
      'scope': {},
      'bindToController': {
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

        compileAttributes.tooltipTitle = compileAttributes.tooltipTitle || '';
        compileAttributes.tooltipTemplate = compileAttributes.tooltipTemplate || '';
        compileAttributes.tooltipSide = compileAttributes.tooltipSide || 'top';
        compileAttributes.tooltipShowTrigger = compileAttributes.tooltipShowTrigger || 'mousemove';
        compileAttributes.tooltipHideTrigger = compileAttributes.tooltipHideTrigger || 'mouseout';
        var initialElement = getElementHTML(compileElement)
          , startingTooltipContent = trasformTooltipContent(initialElement,
            compileAttributes.tooltipTitle,
            compileAttributes.tooltipTemplate,
            compileAttributes.tooltipSide);

        compileElement.replaceWith(startingTooltipContent);
        return function linkingFunction(scope, element, attrs) {

          var onTooltipShow = function onTooltipShow() {
            var tipElement = element.find('tip')
              , newLeft
              , newTop
              , computedStyle
              , actualWidth
              , actualHeight
              , actualPaddingLeft
              , actualPaddingTop;

            element.addClass('active');
            if (tipElement.length > 0) {

              try {

                computedStyle = $window.getComputedStyle(tipElement[0], null);
                actualWidth = computedStyle.getPropertyValue('width');
                actualHeight = computedStyle.getPropertyValue('height');
                actualPaddingLeft = computedStyle.getPropertyValue('padding-left');
                actualPaddingTop = computedStyle.getPropertyValue('padding-top');
              } catch (exp) {

                actualWidth = tipElement[0].currentStyle.width;
                actualHeight = tipElement[0].currentStyle.height;
                actualPaddingLeft = tipElement[0].currentStyle.paddingLeft;
                actualPaddingTop = tipElement[0].currentStyle.paddingTop;
              }

              actualWidth = $window.parseInt(actualWidth);
              actualHeight = $window.parseInt(actualHeight);
              actualPaddingLeft = $window.parseInt(actualPaddingLeft);
              actualPaddingTop = $window.parseInt(actualPaddingTop);

              if (attrs.tooltipSide === 'top' || attrs.tooltipSide === 'bottom') {

                newLeft = -(actualWidth / 2 + actualPaddingLeft / 2);
                tipElement.css('left', newLeft + 'px');
              } else if (attrs.tooltipSide === 'left' || attrs.tooltipSide === 'right') {

                newTop = -(actualHeight / 2 + actualPaddingTop / 2);
                tipElement.css('top', newTop + 'px');
              }
            }
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
          , onTooltipTemplateChange = function onTooltipTemplateChange(newValue, oldValue) {

            if (newValue) {

              if (oldValue) {

                element.find('tip-cont').html(newValue);
              }
              scope.tooltipCtrl.tooltipTemplate = newValue;
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
          , unregisterOnTooltipTemplateChange = attrs.$observe('tooltipTemplate', onTooltipTemplateChange)
          , unregisterOnTooltipSideChangeObserver = attrs.$observe('tooltipSide', onTooltipSideChange)
          , unregisterOnTooltipShowTrigger = attrs.$observe('tooltipShowTrigger', onTooltipShowTrigger)
          , unregisterOnTooltipHideTrigger = attrs.$observe('tooltipHideTrigger', onTooltipHideTrigger);

          scope.$on('$destroy', function unregisterListeners() {

            unregisterOnTooltipTitleChangeObserver();
            unregisterOnTooltipTemplateChange();
            unregisterOnTooltipSideChangeObserver();
            unregisterOnTooltipShowTrigger();
            unregisterOnTooltipHideTrigger();
            element.off(attrs.tooltipShowTrigger + ' ' + attrs.tooltipHideTrigger);
          });
        };
      }
    };
  };

  angular.module('720kb.tooltips', [])
  .directive(directiveName, tooltipDirective);
}(angular, document));
