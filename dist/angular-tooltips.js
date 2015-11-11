/*global angular,window*/
(function withAngular(angular, window) {
  'use strict';

  var directiveName = 'tooltips'
  , marginLeftTooltipArrow = 8
  , deltaTooltipFromTooltipContent = 2
  , resizeObserver = (function optimizedResize() {

    var callbacks = []
      , running = false
      , runCallbacks = function runCallbacks() {

        callbacks.forEach(function iterator(callback) {

          callback();
        });
        running = false;
      }
      , resize = function resize() {

        if (!running) {

          running = true;
          if (window.requestAnimationFrame) {

            window.requestAnimationFrame(runCallbacks);
          } else {

            window.setTimeout(runCallbacks, 66);
          }
        }
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
  , trasformTooltipContent = function trasformTooltipContent(tooltippedContent, tooltipTemplate) {

    var toReturn = [
      '<tooltip tooltips class="tooltips">',
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
    toReturn.push('</tooltip>');
    return toReturn.join(' ');
  }
  , TooltipController = /*@ngInject*/ ["$log", function TooltipController($log) {

    $log.debug('controller called');
  }]
  , tooltipDirective = /*@ngInject*/ function tooltipDirective() {

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

        compileAttributes.tooltipTemplate = compileAttributes.tooltipTemplate || '';
        compileAttributes.tooltipSide = compileAttributes.tooltipSide || 'top';
        compileAttributes.tooltipShowTrigger = compileAttributes.tooltipShowTrigger || 'mousemove';
        compileAttributes.tooltipHideTrigger = compileAttributes.tooltipHideTrigger || 'mouseout';
        var initialElement = getElementHTML(compileElement)
          , startingTooltipContent = trasformTooltipContent(initialElement,
            compileAttributes.tooltipTemplate);

        compileElement.replaceWith(startingTooltipContent);
        return function linkingFunction(scope, element, attrs) {

          var onTooltipShow = function onTooltipShow(event) {
            var tipContElement = element.find('tip-cont')
              , tipElement = element.find('tip')
              , theTipContElement
              , theTipElement
              , theTipContClientRects
              , theTipClientRects
              , clientRectIndex
              , aClientRect
              , contentMinLeft = Number.MAX_SAFE_INTEGER
              , newLeft
              , newTop;

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
                if (attrs.tooltipSide === 'top') {

                  newLeft = theTipContElement.offsetLeft
                    + theTipContClientRects[0].width / 2
                    - theTipClientRects[0].width / 2;
                  newTop = theTipContElement.offsetTop
                    - marginLeftTooltipArrow
                    - theTipClientRects[0].height
                    - deltaTooltipFromTooltipContent;
                } else if (attrs.tooltipSide === 'left') {

                  for (clientRectIndex = 0; clientRectIndex < theTipContClientRects.length; clientRectIndex += 1) {

                    aClientRect = theTipContClientRects.item(clientRectIndex);
                    if (aClientRect &&
                      aClientRect.left <= contentMinLeft) {

                      contentMinLeft = aClientRect.left;
                    }
                  }

                  newLeft = contentMinLeft
                    - theTipElement.offsetWidth
                    - marginLeftTooltipArrow
                    - deltaTooltipFromTooltipContent;
                  newTop = theTipContElement.offsetTop
                    + theTipContElement.offsetHeight / 2
                    - theTipElement.offsetHeight / 2;
                } else if (attrs.tooltipSide === 'bottom') {

                  newLeft = theTipContClientRects[theTipContClientRects.length - 1].left
                    + theTipContClientRects[theTipContClientRects.length - 1].width / 2
                    - theTipClientRects[0].width / 2;
                  newTop = theTipContElement.offsetTop
                    + theTipContElement.offsetHeight
                    + marginLeftTooltipArrow;
                } else if (attrs.tooltipSide === 'right') {

                  for (clientRectIndex = 0; clientRectIndex < theTipContClientRects.length; clientRectIndex += 1) {

                    aClientRect = theTipContClientRects.item(clientRectIndex);
                    if (aClientRect &&
                      aClientRect.left <= contentMinLeft) {

                      contentMinLeft = aClientRect.left;
                    }
                  }

                  newLeft = contentMinLeft
                    + theTipContElement.offsetWidth
                    + marginLeftTooltipArrow;
                  newTop = theTipContElement.offsetTop
                    + theTipContElement.offsetHeight / 2
                    - theTipElement.offsetHeight / 2;
                }
                /*jshint +W014*/
              }

              tipElement.css({
                'left': newLeft + 'px',
                'top': newTop + 'px'
              });
            }
          }
          , onTooltipHide = function onTooltipHide() {

            element.removeClass('active');
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
          , unregisterOnTooltipTemplateChange = attrs.$observe('tooltipTemplate', onTooltipTemplateChange)
          , unregisterOnTooltipSideChangeObserver = attrs.$observe('tooltipSide', onTooltipSideChange)
          , unregisterOnTooltipShowTrigger = attrs.$observe('tooltipShowTrigger', onTooltipShowTrigger)
          , unregisterOnTooltipHideTrigger = attrs.$observe('tooltipHideTrigger', onTooltipHideTrigger);

          resizeObserver.add(function registerResize() {

            onTooltipShow(undefined);
          });
          scope.$on('$destroy', function unregisterListeners() {

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
}(angular, window));
