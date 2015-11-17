/*global angular,window*/
(function withAngular(angular, window) {
  'use strict';

  var directiveName = 'tooltips'
  , marginLeftTooltipArrow = 8
  , deltaTooltipFromTooltipContent = 2
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
      , el = window.document.createElement('div');

    element.removeAttr(directiveName);
    el.appendChild(element.clone()[0]);
    txt = el.innerHTML;
    el = null;
    return txt;
  }
  , trasformTooltipContent = function trasformTooltipContent(tooltippedContent, tooltipTemplate, isTemplateUrl) {

    var toReturn = [
      '<tooltip tooltips class="tooltips">',
        '<tip-cont>',
          tooltippedContent,
        '</tip-cont>'
      ];

    if (tooltipTemplate ||
      isTemplateUrl) {

      toReturn = toReturn.concat([
        '<tip>',
          '<tip-tip>',
            tooltipTemplate,
          '</tip-tip>',
          '<tip-arrow></tip-arrow>',
        '</tip>'
      ]);
    }
    toReturn.push('</tooltip>');
    return toReturn.join(' ');
  }
  , calculateTop = function calculateTop(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement) {
    var newLeft = theTipContElement.offsetLeft + theTipContClientRects[0].width / 2 - theTipClientRects[0].width / 2
      , newTop = theTipContElement.offsetTop - marginLeftTooltipArrow - theTipClientRects[0].height - deltaTooltipFromTooltipContent
      , newRight = newLeft + theTipElement.offsetWidth
      , newBottom = newTop + theTipElement.offsetHeight;

    return {
      'top': newTop,
      'left': newLeft,
      'bottom': newBottom,
      'right': newRight
    };
  }
  , calculateLeft = function calculateLeft(theTipContClientRects, theTipElement, theTipContElement) {
    var clientRectIndex = 0
      , clientRectsLength = theTipContClientRects.length
      , aClientRect
      , contentMinLeft = Number.MAX_VALUE
      , newLeft
      , newTop
      , newRight
      , newBottom;

    for (; clientRectIndex < clientRectsLength; clientRectIndex += 1) {

      aClientRect = theTipContClientRects.item(clientRectIndex);
      if (aClientRect &&
        aClientRect.left <= contentMinLeft) {

        contentMinLeft = aClientRect.left;
      }
    }

    newLeft = contentMinLeft - theTipElement.offsetWidth - marginLeftTooltipArrow - deltaTooltipFromTooltipContent;
    newTop = theTipContElement.offsetTop + theTipContElement.offsetHeight / 2 - theTipElement.offsetHeight / 2;
    newRight = newLeft + theTipElement.offsetWidth;
    newBottom = newTop + theTipElement.offsetHeight;

    return {
      'top': newTop,
      'left': newLeft,
      'bottom': newBottom,
      'right': newRight
    };
  }
  , calculateBottom = function calculateBottom(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement) {
    var newLeft = theTipContClientRects[theTipContClientRects.length - 1].left + theTipContClientRects[theTipContClientRects.length - 1].width / 2 - theTipClientRects[0].width / 2
      , newTop = theTipContElement.offsetTop + theTipContElement.offsetHeight + marginLeftTooltipArrow
      , newRight = newLeft + theTipElement.offsetWidth
      , newBottom = newTop + theTipElement.offsetHeight;

    return {
      'top': newTop,
      'left': newLeft,
      'bottom': newBottom,
      'right': newRight
    };
  }
  , calculateRight = function calculateRight(theTipContClientRects, theTipElement, theTipContElement) {
    var clientRectIndex = 0
      , clientRectsLength = theTipContClientRects.length
      , aClientRect
      , contentMinLeft = Number.MAX_VALUE
      , newLeft
      , newTop
      , newRight
      , newBottom;

    for (clientRectIndex = 0; clientRectIndex < clientRectsLength; clientRectIndex += 1) {

      aClientRect = theTipContClientRects.item(clientRectIndex);
      if (aClientRect &&
        aClientRect.left <= contentMinLeft) {

        contentMinLeft = aClientRect.left;
      }
    }

    newLeft = contentMinLeft + theTipContElement.offsetWidth + marginLeftTooltipArrow;
    newTop = theTipContElement.offsetTop + theTipContElement.offsetHeight / 2 - theTipElement.offsetHeight / 2;
    newRight = newLeft + theTipElement.offsetWidth;
    newBottom = newTop + theTipElement.offsetHeight;

    return {
      'top': newTop,
      'left': newLeft,
      'bottom': newBottom,
      'right': newRight
    };
  }
  , isOutOfPage = function isOutOfPage(squarePosition) {

    if (squarePosition) {

      if (squarePosition.top < 0 ||
        squarePosition.top > window.document.body.offsetHeight) {

        return true;
      }

      if (squarePosition.left < 0 ||
        squarePosition.left > window.document.body.offsetWidth) {

        return true;
      }

      if (squarePosition.bottom < 0 ||
        squarePosition.bottom > window.document.body.offsetHeight) {

        return true;
      }

      if (squarePosition.right < 0 ||
        squarePosition.right > window.document.body.offsetWidth) {

        return true;
      }

      return false;
    }

    throw new Error('You must provide a position');
  }
  , TooltipController = /*@ngInject*/ function TooltipController($log) {

    $log.debug('controller called');
  }
  , tooltipDirective = /*@ngInject*/ function tooltipDirective($http, $compile) {

    var linkingFunction = function linkingFunction(scope, element, attrs) {

      var onTooltipShow = function onTooltipShow(event) {
        var tipContElement = element.find('tip-cont')
          , tipElement = element.find('tip')
          , theTipContElement
          , theTipElement
          , theTipContClientRects
          , theTipClientRects
          , newPosition;

        if (event) {

          element.addClass('active');
        }
        if (tipContElement.length > 0 &&
          tipElement.length > 0) {

          theTipContElement = tipContElement[0];
          theTipElement = tipElement[0];
          theTipContClientRects = theTipContElement.getClientRects();
          theTipClientRects = theTipElement.getClientRects();
          if (theTipClientRects.length > 0) {

            /*jshint -W014*/
            if (attrs.tooltipSmart) {

              switch (attrs.tooltipSide) {
                case 'top': {

                  newPosition = calculateTop(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement);
                  if (isOutOfPage(newPosition)) {

                    element.removeClass('_top');
                    newPosition = calculateLeft(theTipContClientRects, theTipElement, theTipContElement);
                    element.addClass('_left');
                    if (isOutOfPage(newPosition)) {

                      element.removeClass('_left');
                      newPosition = calculateBottom(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement);
                      element.addClass('_bottom');
                      if (isOutOfPage(newPosition)) {

                        element.removeClass('_bottom');
                        newPosition = calculateRight(theTipContClientRects, theTipElement, theTipContElement);
                        element.addClass('_right');
                        if (isOutOfPage(newPosition)) {

                          element.removeClass('_right');
                          newPosition = calculateTop(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement);
                          element.addClass('_top');
                        }
                      }
                    }
                  }
                  break;
                }

                case 'left': {

                  newPosition = calculateLeft(theTipContClientRects, theTipElement, theTipContElement);
                  if (isOutOfPage(newPosition)) {

                    element.removeClass('_left');
                    newPosition = calculateBottom(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement);
                    element.addClass('_bottom');
                    if (isOutOfPage(newPosition)) {

                      element.removeClass('_bottom');
                      newPosition = calculateRight(theTipContClientRects, theTipElement, theTipContElement);
                      element.addClass('_right');
                      if (isOutOfPage(newPosition)) {

                        element.removeClass('_right');
                        newPosition = calculateTop(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement);
                        element.addClass('_top');
                        if (isOutOfPage(newPosition)) {

                          element.removeClass('_top');
                          newPosition = calculateLeft(theTipContClientRects, theTipElement, theTipContElement);
                          element.addClass('_left');
                        }
                      }
                    }
                  }
                  break;
                }

                case 'bottom': {

                  newPosition = calculateBottom(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement);
                  if (isOutOfPage(newPosition)) {

                    element.removeClass('_bottom');
                    newPosition = calculateLeft(theTipContClientRects, theTipElement, theTipContElement);
                    element.addClass('_left');
                    if (isOutOfPage(newPosition)) {

                      element.removeClass('_left');
                      newPosition = calculateTop(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement);
                      element.addClass('_top');
                      if (isOutOfPage(newPosition)) {

                        element.removeClass('_top');
                        newPosition = calculateRight(theTipContClientRects, theTipElement, theTipContElement);
                        element.addClass('_right');
                        if (isOutOfPage(newPosition)) {

                          element.removeClass('_right');
                          newPosition = calculateBottom(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement);
                          element.addClass('_bottom');
                        }
                      }
                    }
                  }
                  break;
                }

                case 'right': {

                  newPosition = calculateRight(theTipContClientRects, theTipElement, theTipContElement);
                  if (isOutOfPage(newPosition)) {

                    element.removeClass('_right');
                    newPosition = calculateTop(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement);
                    element.addClass('_top');
                    if (isOutOfPage(newPosition)) {

                      element.removeClass('_top');
                      newPosition = calculateLeft(theTipContClientRects, theTipElement, theTipContElement);
                      element.addClass('_left');
                      if (isOutOfPage(newPosition)) {

                        element.removeClass('_left');
                        newPosition = calculateBottom(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement);
                        element.addClass('_bottom');
                        if (isOutOfPage(newPosition)) {

                          element.removeClass('_bottom');
                          newPosition = calculateRight(theTipContClientRects, theTipElement, theTipContElement);
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

                  newPosition = calculateTop(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement);
                  break;
                }

                case 'left': {

                  newPosition = calculateLeft(theTipContClientRects, theTipElement, theTipContElement);
                  break;
                }

                case 'bottom': {

                  newPosition = calculateBottom(theTipContClientRects, theTipClientRects, theTipElement, theTipContElement);
                  break;
                }

                case 'right': {

                  newPosition = calculateRight(theTipContClientRects, theTipElement, theTipContElement);
                  break;
                }
                default: {

                  throw new Error('Position not supported');
                }
              }
            }
            /*jshint +W014*/
            tipElement.css({
              'left': newPosition.left + 'px',
              'top': newPosition.top + 'px'
            });
          }
        }
      }
      , onTooltipHide = function onTooltipHide() {

        element.removeClass('active');
      }
      , onTooltipTemplateChange = function onTooltipTemplateChange(newValue) {

        if (newValue) {

          scope.tooltipCtrl.tooltipTemplate = newValue;
          scope.$applyAsync(function doAsycn() {

            onTooltipShow();
          });
        }
      }
      , onTooltipTemplateUrlChange = function onTooltipTemplateUrlChange(newValue) {

        if (newValue) {

          $http.get(newValue).then(function onResponse(response) {

            if (response &&
              response.data) {
              var tipElement = getElementHTML(element.find('tip-tip').append(response.data));

              scope.tooltipCtrl.tooltipTemplateUrl = response.data;
              element.find('tip-tip').replaceWith($compile(tipElement)(scope));
              scope.$applyAsync(function doAsycn() {

                onTooltipShow();
              });
            }
          });
        }
      }
      , onTooltipTemplateControllerChange = function onTooltipTemplateControllerChange(newValue) {

        if (newValue) {

          element.find('tip-tip').attr('ng-controller', newValue);
        }
      }
      , onTooltipSideChange = function onTooltipSideChange(newValue, oldValue) {

        if (newValue) {

          if (oldValue) {

            element.removeAttr('_' + oldValue);
          }
          element.addClass('_' + newValue);
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
      , onTooltipSmartChange = function onTooltipSmartChange(newValue) {

        if (newValue) {

          scope.tooltipCtrl.tooltipSmart = newValue;
        }
      }
      , onTooltipClassChange = function onTooltipClassChange(newValue, oldValue) {
        var tipElement = element.find('tip-tip');

        if (newValue) {

          if (oldValue) {

            tipElement.removeClass(oldValue);
          }
          tipElement.addClass(newValue);
        }
      }
      , unregisterOnTooltipTemplateChange = attrs.$observe('tooltipTemplate', onTooltipTemplateChange)
      , unregisterOnTooltipTemplateUrlChange = attrs.$observe('tooltipTemplateUrl', onTooltipTemplateUrlChange)
      , unregisterOnTooltipControllerChange = attrs.$observe('tooltipController', onTooltipTemplateControllerChange)
      , unregisterOnTooltipSideChangeObserver = attrs.$observe('tooltipSide', onTooltipSideChange)
      , unregisterOnTooltipShowTrigger = attrs.$observe('tooltipShowTrigger', onTooltipShowTrigger)
      , unregisterOnTooltipHideTrigger = attrs.$observe('tooltipHideTrigger', onTooltipHideTrigger)
      , unregisterOnTooltipSmartChange = attrs.$observe('tooltipSmart', onTooltipSmartChange)
      , unregisterOnTooltipClassChange = attrs.$observe('tooltipClass', onTooltipClassChange);

      resizeObserver.add(function registerResize() {

        onTooltipShow();
      });
      scope.$on('$destroy', function unregisterListeners() {

        unregisterOnTooltipTemplateChange();
        unregisterOnTooltipTemplateUrlChange();
        unregisterOnTooltipControllerChange();
        unregisterOnTooltipSideChangeObserver();
        unregisterOnTooltipShowTrigger();
        unregisterOnTooltipHideTrigger();
        unregisterOnTooltipSmartChange();
        unregisterOnTooltipClassChange();
        element.off(attrs.tooltipShowTrigger + ' ' + attrs.tooltipHideTrigger);
      });
    };

    return {
      'restrict': 'A',
      'scope': true,
      'bindToController': {
        'tooltipModel': '=?', //ex tooltipViewModel
        /*'tooltipSize': '=?', // These are css classes...
        'tooltipSpeed': '=?',
        'tooltipDelay': '=?',*/
        'tooltipCloseButton': '=?'
      },
      'controllerAs': 'tooltipCtrl',
      'controller': TooltipController,
      'compile': function compiling(compileElement, compileAttributes) {

        if (compileAttributes.tooltipTemplate &&
          compileAttributes.tooltipTemplateUrl) {

          throw new Error('You can not define tooltip-template and tooltip-url together');
        }

        if (!(compileAttributes.tooltipTemplateUrl || compileAttributes.tooltipTemplate) &&
          compileAttributes.tooltipController) {

          throw new Error('You can not have a controller without a template or templateUrl defined');
        }

        compileAttributes.tooltipTemplate = compileAttributes.tooltipTemplate || '';
        compileAttributes.tooltipTemplateUrl = compileAttributes.tooltipTemplateUrl || '';
        compileAttributes.tooltipController = compileAttributes.tooltipController || '';

        compileAttributes.tooltipSide = compileAttributes.tooltipSide || 'top';
        compileAttributes.tooltipShowTrigger = compileAttributes.tooltipShowTrigger || 'mousemove';
        compileAttributes.tooltipHideTrigger = compileAttributes.tooltipHideTrigger || 'mouseout';
        compileAttributes.tooltipSmart = Boolean(compileAttributes.tooltipSmart) || false;
        compileAttributes.tooltipClass = compileAttributes.tooltipClass || '';
        var initialElement = getElementHTML(compileElement)
          , startingTooltipContent = trasformTooltipContent(initialElement,
            compileAttributes.tooltipTemplate, !!compileAttributes.tooltipTemplateUrl);

        compileElement.replaceWith(startingTooltipContent);
        return linkingFunction;
      }
    };
  };

  angular.module('720kb.tooltips', [])
  .directive(directiveName, tooltipDirective);
}(angular, window));
