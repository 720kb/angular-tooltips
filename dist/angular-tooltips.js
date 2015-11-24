/*global angular,window*/
(function withAngular(angular, window) {
  'use strict';

  var directiveName = 'tooltips'
  , marginTooltipArrow = 8
  , resizeObserver = (function resizeObserver() {

    var callbacks = []
      , lastTime = 0
      , runCallbacks = function runCallbacks(currentTime) {

        if (currentTime - lastTime >= 15) {

          callbacks.forEach(function iterator(callback) {

            callback();
          });
          lastTime = currentTime;
        } else {

          window.console.log('Skipped!');
        }
      }
      , resize = function resize() {

        window.requestAnimationFrame(runCallbacks);
      }
      , addCallback = function addCallback(callback) {

        if (callback) {

          callbacks.push(callback);
        }
      };

    return {
      'add': function add(callback) {

        if (!callbacks.length) {

          window.addEventListener('resize', resize);
        }
        addCallback(callback);
      }
    };
  }())
  , getElementHTML = function getElementHTML(element) {
    var txt
      , el = window.document.createElement('div')
      , attributesToAdd = [{
        'key': directiveName,
        'value': ''
      }];

    element.removeAttr(directiveName);
    if (element.attr('tooltip-template') !== undefined) {

      attributesToAdd.push({
        'key': 'tooltip-template',
        'value': element.attr('tooltip-template')
      });
      element.removeAttr('tooltip-template');
    }

    if (element.attr('tooltip-template-url') !== undefined) {

      attributesToAdd.push({
        'key': 'tooltip-template-url',
        'value': element.attr('tooltip-template-url')
      });
      element.removeAttr('tooltip-template-url');
    }

    if (element.attr('tooltip-controller') !== undefined) {

      attributesToAdd.push({
        'key': 'tooltip-controller',
        'value': element.attr('tooltip-controller')
      });
      element.removeAttr('tooltip-controller');
    }

    if (element.attr('tooltip-side') !== undefined) {

      attributesToAdd.push({
        'key': 'tooltip-side',
        'value': element.attr('tooltip-side')
      });
      element.removeAttr('tooltip-side');
    }

    if (element.attr('tooltip-show-trigger') !== undefined) {

      attributesToAdd.push({
        'key': 'tooltip-show-trigger',
        'value': element.attr('tooltip-show-trigger')
      });
      element.removeAttr('tooltip-show-trigger');
    }

    if (element.attr('tooltip-hide-trigger') !== undefined) {

      attributesToAdd.push({
        'key': 'tooltip-hide-trigger',
        'value': element.attr('tooltip-hide-trigger')
      });
      element.removeAttr('tooltip-hide-trigger');
    }

    if (element.attr('tooltip-smart') !== undefined) {

      attributesToAdd.push({
        'key': 'tooltip-smart',
        'value': element.attr('tooltip-smart')
      });
      element.removeAttr('tooltip-smart');
    }

    if (element.attr('tooltip-class') !== undefined) {

      attributesToAdd.push({
        'key': 'tooltip-class',
        'value': element.attr('tooltip-class')
      });
      element.removeAttr('tooltip-class');
    }

    if (element.attr('tooltip-close-button') !== undefined) {

      attributesToAdd.push({
        'key': 'tooltip-close-button',
        'value': element.attr('tooltip-close-button')
      });
      element.removeAttr('tooltip-close-button');
    }

    if (element.attr('tooltip-size') !== undefined) {

      attributesToAdd.push({
        'key': 'tooltip-size',
        'value': element.attr('tooltip-size')
      });
      element.removeAttr('tooltip-size');
    }

    el.appendChild(element.clone()[0]);
    txt = el.innerHTML;
    el = null;
    return {
      'text': txt,
      'attrs': attributesToAdd
    };
  }
  , trasformTooltipContent = function trasformTooltipContent(tooltippedContent, tooltipTemplate, isTemplateUrl) {
    var attributes = ''
      , toReturn = [];

    tooltippedContent.attrs.forEach(function iterator(anElement) {

      if (anElement &&
        anElement.key) {

        attributes += anElement.key + '="' + anElement.value + '"';
      }
    });

    toReturn = [
      '<tooltip ' + attributes + ' class="tooltips">',
        '<tip-cont>',
          tooltippedContent.text,
        '</tip-cont>'
      ];
    if (tooltipTemplate ||
      isTemplateUrl) {

      toReturn = toReturn.concat([
        '<tip class="_hidden">',
          '<tip-tip>',
            '<span id="close-button">&times;</span>',
            tooltipTemplate,
          '</tip-tip>',
          '<tip-arrow></tip-arrow>',
        '</tip>'
      ]);
    }
    toReturn.push('</tooltip>');
    return toReturn.join(' ');
  }
  , calculateTop = function calculateTop(theTipElement, theTipContElement) {
    var tipStyle
      , paddingBottom
      , bottom
      , left = Math.floor(theTipContElement[0].offsetWidth / 2 - theTipElement[0].offsetWidth / 2);

    try {
      tipStyle = window.getComputedStyle(theTipElement[0], null);

      paddingBottom = parseInt(tipStyle.getPropertyValue('padding-bottom'), 10);
    } catch (e) {

      paddingBottom = parseInt(theTipElement[0].currentStyle.paddingBottom, 10);
    }
    bottom = Math.floor(theTipContElement[0].offsetHeight + marginTooltipArrow + paddingBottom);

    theTipElement.css({
      'bottom': bottom + 'px',
      'left': left + 'px'
    });
  }
  , calculateLeft = function calculateLeft(theTipElement, theTipContElement) {
    var bottom = Math.floor(-theTipElement[0].offsetHeight / 2 + theTipContElement[0].offsetHeight / 2)
      , right = Math.floor(theTipContElement[0].offsetWidth + marginTooltipArrow);

    theTipElement.css({
      'bottom': bottom + 'px',
      'right': right + 'px'
    });
  }
  , calculateBottom = function calculateBottom(theTipElement, theTipContElement) {
    var tipStyle
      , paddingTop
      , left = Math.floor(theTipContElement[0].offsetWidth / 2 - theTipElement[0].offsetWidth / 2)
      , top;

    try {
      tipStyle = window.getComputedStyle(theTipElement[0], null);

      paddingTop = parseInt(tipStyle.getPropertyValue('padding-top'), 10);
    } catch (e) {

      paddingTop = parseInt(theTipElement[0].currentStyle.paddingTop, 10);
    }

    top = Math.floor(theTipContElement[0].offsetHeight + paddingTop + marginTooltipArrow);

    theTipElement.css({
      'top': top + 'px',
      'left': left + 'px'
    });
  }
  , calculateRight = function calculateRight(theTipElement, theTipContElement) {
    var bottom = Math.floor(-theTipElement[0].offsetHeight / 2 + theTipContElement[0].offsetHeight / 2)
      , left = theTipContElement[0].offsetWidth + marginTooltipArrow;

    theTipElement.css({
      'bottom': bottom + 'px',
      'left': left + 'px'
    });
  }
  , isOutOfPage = function isOutOfPage(theTipElement) {

    if (theTipElement) {
      var squarePosition = theTipElement[0].getBoundingClientRect();

      if (squarePosition.top < 0 ||
        squarePosition.top > window.document.body.offsetHeight ||
        squarePosition.left < 0 ||
        squarePosition.left > window.document.body.offsetWidth ||
        squarePosition.bottom < 0 ||
        squarePosition.bottom > window.document.body.offsetHeight ||
        squarePosition.right < 0 ||
        squarePosition.right > window.document.body.offsetWidth) {

        theTipElement.css({
          'top': '',
          'left': '',
          'bottom': '',
          'right': ''
        });
        return true;
      }

      return false;
    }

    throw new Error('You must provide a position');
  }
  , tooltipDirective = /*@ngInject*/ ["$log", "$http", "$compile", "$timeout", function tooltipDirective($log, $http, $compile, $timeout) {

    var linkingFunction = function linkingFunction(scope, element, attrs) {

      var oldTooltipSide
      , oldTooltipShowTrigger
      , oldTooltipHideTrigger
      , oldTooltipClass
      , oldSize
      , oldSpeed
      , onTooltipShow = function onTooltipShow(event) {
        var tipContElement = element.find('tip-cont')
          , tipElement = element.find('tip');

        if (event) {

          element.addClass('active');
        }

        if (attrs.tooltipSmart) {

          tipElement.css({
            'top': '',
            'left': '',
            'bottom': '',
            'right': ''
          });
          switch (attrs.tooltipSide) {
            case 'top': {

              calculateTop(tipElement, tipContElement);
              if (isOutOfPage(tipElement)) {

                element.removeClass('_top');
                calculateLeft(tipElement, tipContElement);
                element.addClass('_left');
                if (isOutOfPage(tipElement)) {

                  element.removeClass('_left');
                  calculateBottom(tipElement, tipContElement);
                  element.addClass('_bottom');
                  if (isOutOfPage(tipElement)) {

                    element.removeClass('_bottom');
                    calculateRight(tipElement, tipContElement);
                    element.addClass('_right');
                    if (isOutOfPage(tipElement)) {

                      element.removeClass('_right');
                      calculateTop(tipElement, tipContElement);
                      element.addClass('_top');
                    }
                  }
                }
              }
              break;
            }

            case 'left': {

              calculateLeft(tipElement, tipContElement);
              if (isOutOfPage(tipElement)) {

                element.removeClass('_left');
                calculateBottom(tipElement, tipContElement);
                element.addClass('_bottom');
                if (isOutOfPage(tipElement)) {

                  element.removeClass('_bottom');
                  calculateRight(tipElement, tipContElement);
                  element.addClass('_right');
                  if (isOutOfPage(tipElement)) {

                    element.removeClass('_right');
                    calculateTop(tipElement, tipContElement);
                    element.addClass('_top');
                    if (isOutOfPage(tipElement)) {

                      element.removeClass('_top');
                      calculateLeft(tipElement, tipContElement);
                      element.addClass('_left');
                    }
                  }
                }
              }
              break;
            }

            case 'bottom': {

              calculateBottom(tipElement, tipContElement);
              if (isOutOfPage(tipElement)) {

                element.removeClass('_bottom');
                calculateLeft(tipElement, tipContElement);
                element.addClass('_left');
                if (isOutOfPage(tipElement)) {

                  element.removeClass('_left');
                  calculateTop(tipElement, tipContElement);
                  element.addClass('_top');
                  if (isOutOfPage(tipElement)) {

                    element.removeClass('_top');
                    calculateRight(tipElement, tipContElement);
                    element.addClass('_right');
                    if (isOutOfPage(tipElement)) {

                      element.removeClass('_right');
                      calculateBottom(tipElement, tipContElement);
                      element.addClass('_bottom');
                    }
                  }
                }
              }
              break;
            }

            case 'right': {

              calculateRight(tipElement, tipContElement);
              if (isOutOfPage(tipElement)) {

                element.removeClass('_right');
                calculateTop(tipElement, tipContElement);
                element.addClass('_top');
                if (isOutOfPage(tipElement)) {

                  element.removeClass('_top');
                  calculateLeft(tipElement, tipContElement);
                  element.addClass('_left');
                  if (isOutOfPage(tipElement)) {

                    element.removeClass('_left');
                    calculateBottom(tipElement, tipContElement);
                    element.addClass('_bottom');
                    if (isOutOfPage(tipElement)) {

                      element.removeClass('_bottom');
                      calculateRight(tipElement, tipContElement);
                      element.addClass('_right');
                    }
                  }
                }
              }
              break;
            }
            default: {

              throw new Error('Position not supported');
            }
          }
        } else {

          switch (attrs.tooltipSide) {
            case 'top': {

              calculateTop(tipElement, tipContElement);
              break;
            }

            case 'left': {

              calculateLeft(tipElement, tipContElement);
              break;
            }

            case 'bottom': {

              calculateBottom(tipElement, tipContElement);
              break;
            }

            case 'right': {

              calculateRight(tipElement, tipContElement);
              break;
            }
            default: {

              throw new Error('Position not supported');
            }
          }
        }
      }
      , onTooltipHide = function onTooltipHide() {

        element.removeClass('active');
      }
      , onTooltipTemplateChange = function onTooltipTemplateChange(newValue) {

        if (newValue) {

          $timeout(function doLater() {

            onTooltipShow();
          });
        }
      }
      , onTooltipTemplateUrlChange = function onTooltipTemplateUrlChange(newValue) {

        if (newValue) {

          $http.get(newValue).then(function onResponse(response) {

            if (response &&
              response.data) {
              var tipElement = getElementHTML(element.find('tip-tip').append(response.data)).text;

              element.find('tip-tip').replaceWith($compile(tipElement)(scope));
              $timeout(function doLater() {

                onTooltipShow();
              });
            }
          });
        }
      }
      , onTooltipTemplateControllerChange = function onTooltipTemplateControllerChange(newValue) {

        if (newValue) {

          element.find('tip-tip').attr('ng-controller', newValue);
          /*eslint-disable no-use-before-define*/
          unregisterOnTooltipControllerChange();
          /*eslint-enable no-use-before-define*/
        }
      }
      , onTooltipSideChange = function onTooltipSideChange(newValue) {

        if (newValue) {

          if (oldTooltipSide) {

            element.removeAttr('_' + oldTooltipSide);
          } else {

            element.removeAttr('_top');
          }
          element.addClass('_' + newValue);
          oldTooltipSide = newValue;
        } else {

          element.addClass('_top');
          oldTooltipSide = '_top';
        }
      }
      , onTooltipShowTrigger = function onTooltipShowTrigger(newValue) {

        if (newValue) {

          if (oldTooltipShowTrigger) {

            element.off(oldTooltipShowTrigger);
          } else {

            element.off('mouseover');
          }
          element.on(newValue, onTooltipShow);
          oldTooltipShowTrigger = newValue;
        } else {

          element.on('mouseover', onTooltipShow);
          oldTooltipShowTrigger = 'mouseover';
        }
      }
      , onTooltipHideTrigger = function onTooltipHideTrigger(newValue) {

        if (newValue) {

          if (oldTooltipHideTrigger) {

            element.off(oldTooltipHideTrigger);
          } else {

            element.off('mouseout');
          }
          element.on(newValue, onTooltipHide);
          oldTooltipHideTrigger = newValue;
        } else {

          element.on('mouseout', onTooltipHide);
          oldTooltipHideTrigger = 'mouseout';
        }
      }
      , onTooltipClassChange = function onTooltipClassChange(newValue) {
        var tipElement = element.find('tip-tip');

        if (newValue) {

          if (oldTooltipClass) {

            tipElement.removeClass(oldTooltipClass);
          }
          tipElement.addClass(newValue);
          oldTooltipClass = newValue;
        }
      }
      , onTooltipCloseButtonChange = function onTooltipCloseButtonChange(newValue) {
        var theXButton = angular.element(element.find('tip-tip').children()[0])
          , enableButton = newValue === 'true';

        if (enableButton) {

          theXButton.on('click', onTooltipHide);
          theXButton.css('display', 'block');
        } else {

          theXButton.off('click');
          theXButton.css('display', 'none');
        }
      }
      , onTooltipSizeChange = function onTooltipSizeChange(newValue) {
        var tipElement = element.find('tip-tip');

        if (newValue) {

          if (oldSize) {

            tipElement.removeClass('_' + oldSize);
          }
          tipElement.addClass('_' + newValue);
          oldSize = newValue;
        }
      }
      , onTooltipSpeedChange = function onTooltipSpeedChange(newValue) {

        if (newValue) {

          if (oldSpeed) {

            element.removeClass('_' + oldSpeed);
          } else {

            element.removeClass('_steady');
          }
          element.addClass('_' + newValue);
          oldSpeed = newValue;
        } else {

          element.addClass('_steady');
          oldTooltipSide = '_steady';
        }
      }
      , unregisterOnTooltipTemplateChange = attrs.$observe('tooltipTemplate', onTooltipTemplateChange)
      , unregisterOnTooltipTemplateUrlChange = attrs.$observe('tooltipTemplateUrl', onTooltipTemplateUrlChange)
      , unregisterOnTooltipControllerChange = attrs.$observe('tooltipController', onTooltipTemplateControllerChange)
      , unregisterOnTooltipSideChangeObserver = attrs.$observe('tooltipSide', onTooltipSideChange)
      , unregisterOnTooltipShowTrigger = attrs.$observe('tooltipShowTrigger', onTooltipShowTrigger)
      , unregisterOnTooltipHideTrigger = attrs.$observe('tooltipHideTrigger', onTooltipHideTrigger)
      , unregisterOnTooltipClassChange = attrs.$observe('tooltipClass', onTooltipClassChange)
      , unregisterOnTooltipCloseButtonChange = attrs.$observe('tooltipCloseButton', onTooltipCloseButtonChange)
      , unregisterOnTooltipSizeChange = attrs.$observe('tooltipSize', onTooltipSizeChange)
      , unregisterOnTooltipSpeedChange = attrs.$observe('tooltipSpeed', onTooltipSpeedChange);

      attrs.tooltipSide = attrs.tooltipSide || 'top';
      attrs.tooltipShowTrigger = attrs.tooltipShowTrigger || 'mouseover';
      attrs.tooltipHideTrigger = attrs.tooltipHideTrigger || 'mouseout';
      attrs.tooltipClass = attrs.tooltipClass || '';
      attrs.tooltipSmart = attrs.tooltipSmart === 'true';
      attrs.tooltipCloseButton = attrs.tooltipCloseButton === 'true';
      attrs.tooltipSpeed = attrs.tooltipSpeed || 'steady';
      resizeObserver.add(function registerResize() {

        onTooltipShow();
      });

      $timeout(function doLater() {

        onTooltipShow();
        element.find('tip').removeClass('_hidden');
      });

      scope.$on('$destroy', function unregisterListeners() {

        unregisterOnTooltipTemplateChange();
        unregisterOnTooltipTemplateUrlChange();
        unregisterOnTooltipSideChangeObserver();
        unregisterOnTooltipShowTrigger();
        unregisterOnTooltipHideTrigger();
        unregisterOnTooltipClassChange();
        unregisterOnTooltipCloseButtonChange();
        unregisterOnTooltipSizeChange();
        unregisterOnTooltipSpeedChange();
        element.off(attrs.tooltipShowTrigger + ' ' + attrs.tooltipHideTrigger);
      });
    };

    return {
      'restrict': 'A',
      'scope': true,
      'compile': function compiling(compileElement, compileAttributes) {

        if (compileAttributes.tooltipTemplate &&
          compileAttributes.tooltipTemplateUrl) {

          throw new Error('You can not define tooltip-template and tooltip-url together');
        }

        if (!(compileAttributes.tooltipTemplateUrl || compileAttributes.tooltipTemplate) &&
          compileAttributes.tooltipController) {

          throw new Error('You can not have a controller without a template or templateUrl defined');
        }

        var initialElement = getElementHTML(compileElement)
          , startingTooltipContent = trasformTooltipContent(initialElement,
            compileAttributes.tooltipTemplate,
            !!compileAttributes.tooltipTemplateUrl);

        compileElement.replaceWith(startingTooltipContent);
        return linkingFunction;
      }
    };
  }];

  angular.module('720kb.tooltips', [])
  .directive(directiveName, tooltipDirective);
}(angular, window));
