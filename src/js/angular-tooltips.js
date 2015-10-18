/*global angular*/
(function withAngular(angular) {
  'use strict';

  angular.module('720kb.tooltips', [])
  .provider('tooltipsConfig', function TooltipsConfigProvider() {
    var options = {
      'scroll': false
      , 'showTrigger': 'mouseover'
      , 'hideTrigger': 'mouseleave'
      , 'hideTarget': 'element'
      , 'side': 'top'
      , 'size': 'medium'
      , 'try': true
      , 'class': ''
      , 'speed': 'medium'
      , 'delay': 0
      , 'lazy': true
      , 'closeButton': null
    };

    this.options = function optionsAccessor() {
      if (arguments.length === 1) {
        angular.extend(options, arguments[0]);
      }
      return angular.copy(options);
    };

    this.$get = function getTooltipsConfig() {
      return options;
    };
  })
  .directive('tooltips', ['$window', '$compile', '$interpolate', '$interval', '$sce', 'tooltipsConfig',
   function manageDirective($window, $compile, $interpolate, $interval, $sce, tooltipsConfig) {

     var TOOLTIP_SMALL_MARGIN = 8 //px
      , TOOLTIP_MEDIUM_MARGIN = 9 //px
      , TOOLTIP_LARGE_MARGIN = 10 //px
      , POSITION_CHECK_INTERVAL = 20 // ms
      , CSS_PREFIX = '_720kb-tooltip-'
      , INTERPOLATE_START_SYM = $interpolate.startSymbol()
      , INTERPOLATE_END_SYM = $interpolate.endSymbol();

     return {
      'restrict': 'A',
      'scope': {
         'tooltipViewModel': '='
       },
      'link': function linkingFunction($scope, element, attr) {

        var initialized = false
          , thisElement = angular.element(element[0])
          , body = angular.element($window.document.getElementsByTagName('body')[0])
          , theTooltip
          , theTooltipHeight
          , theTooltipWidth
          , theTooltipMargin //used both for margin top left right bottom
          , height
          , width
          , offsetTop
          , offsetLeft
          , positionInterval
          , oldBoundingRect
          , title = attr.tooltipTitle || attr.title || ''
          , tooltipScroll = attr.tooltipScroll || tooltipsConfig.scroll
          , content = attr.tooltipContent || ''
          , html = attr.tooltipHtml || ''
          , showTriggers = attr.tooltipShowTrigger || tooltipsConfig.showTrigger
          , hideTriggers = attr.tooltipHideTrigger || tooltipsConfig.hideTrigger
          , hideTarget = typeof attr.tooltipHideTarget !== 'undefined' && attr.tooltipHideTarget !== null ? attr.tooltipHideTarget : tooltipsConfig.hideTarget
          , originSide = attr.tooltipSide || tooltipsConfig.side
          , side = originSide
          , size = attr.tooltipSize || tooltipsConfig.size
          , tryPosition = typeof attr.tooltipTry !== 'undefined' && attr.tooltipTry !== null ? $scope.$eval(attr.tooltipTry) : tooltipsConfig.try
          , className = attr.tooltipClass || tooltipsConfig.class
          , speed = (attr.tooltipSpeed || tooltipsConfig.speed).toLowerCase()
          , delay = attr.tooltipDelay || tooltipsConfig.delay
          , lazyMode = typeof attr.tooltipLazy !== 'undefined' && attr.tooltipLazy !== null ? $scope.$eval(attr.tooltipLazy) : tooltipsConfig.lazy
          , closeButtonContent = attr.tooltipCloseButton || tooltipsConfig.closeButton
          , hasCloseButton = typeof closeButtonContent !== 'undefined' && closeButtonContent !== null
          , htmlTemplate = '<div class="_720kb-tooltip ' + CSS_PREFIX + size + '">';

        if (hideTarget !== 'element' && hideTarget !== 'tooltip') {

          hideTarget = 'element';
        }
        if (hasCloseButton) {

          htmlTemplate = htmlTemplate + '<span class="' + CSS_PREFIX + 'close-button" ng-click="hideTooltip()"> ' + closeButtonContent + ' </span>';
        }
        if (attr.tooltipView) {
          if (attr.tooltipViewCtrl) {

            htmlTemplate = htmlTemplate + '<div ng-controller="' + attr.tooltipViewCtrl + '" ng-include="\'' + attr.tooltipView + '\'"></div>';
          } else {

            htmlTemplate = htmlTemplate + '<div ng-include="\'' + attr.tooltipView + '\'"></div>';
          }
        }

        htmlTemplate = htmlTemplate + '<div class="' + CSS_PREFIX + 'title"> ' + INTERPOLATE_START_SYM + 'title' + INTERPOLATE_END_SYM + '</div>' +
                                      INTERPOLATE_START_SYM + 'content' + INTERPOLATE_END_SYM +
                                      ' <span class="' + CSS_PREFIX + 'html_content" ng-bind-html="getHtml()"></span>' +
                                      ' <span class="' + CSS_PREFIX + 'caret"></span>' + '</div>';
        $scope.title = title;
        $scope.content = content;
        $scope.html = html;

        $scope.getHtml = function(){
          return $sce.trustAsHtml($scope.html);
        };

        //parse the animation speed of tooltips
        $scope.parseSpeed = function parseSpeed() {

          switch (speed) {
            case 'fast':
              speed = 100;
              break;

            case 'medium':
              speed = 450;
              break;

            case 'slow':
              speed = 800;
              break;

            default:
              speed = Number(speed);
          }
        };
        //create the tooltip
        theTooltip = $compile(htmlTemplate)($scope);

        theTooltip.addClass(className);

        body.append(theTooltip);

        $scope.isTooltipEmpty = function checkEmptyTooltip() {

          if (!$scope.title && !$scope.content && !$scope.html && !attr.tooltipView) {

            return true;
          }
        };

        $scope.initTooltip = function initTooltip(tooltipSide) {
          if (!$scope.isTooltipEmpty()) {

            theTooltip.css('visibility', 'visible');

            height = thisElement[0].offsetHeight;
            width = thisElement[0].offsetWidth;

            //get tooltip dimension
            theTooltipHeight = theTooltip[0].offsetHeight;
            theTooltipWidth = theTooltip[0].offsetWidth;

            $scope.parseSpeed();
            $scope.tooltipPositioning(tooltipSide);
          } else {
            theTooltip.css('visibility', 'hidden');
          }
        };

        $scope.getOffsets = function getRootOffsets() {
          offsetTop = $scope.getOffsetTop(thisElement[0]);
          offsetLeft = $scope.getOffsetLeft(thisElement[0]);
        };

        $scope.getOffsetTop = function getOffsetTop(elem) {

          var offtop = elem.getBoundingClientRect().top + $window.scrollY;
          //ie8 - 11 fix - window.scrollY is undefied, and offtop is NaN.
          if (isNaN(offtop)) {
            //get the offset on old properties
            offtop = elem.getBoundingClientRect().top + $window.pageYOffset;
          }
          return offtop;
        };

        $scope.getOffsetLeft = function getOffsetLeft(elem) {

          var offleft = elem.getBoundingClientRect().left + $window.scrollX;
          //ie8 - 11 fix - window.scrollX is undefied, and offtop is NaN.
          if (isNaN(offleft)) {
            //get the offset on old properties
            offleft = elem.getBoundingClientRect().left + $window.pageXOffset;
          }
          return offleft;
        };

        function onMouseEnterAndMouseOver() {
          if (!lazyMode || !initialized) {

            initialized = true;
            $scope.initTooltip(side);
          }
          if (tryPosition) {

            $scope.tooltipTryPosition();
          }
          $scope.showTooltip();
        }

        function onMouseLeaveAndMouseOut() {
          $scope.hideTooltip();
        }

        $scope.bindShowTriggers = function bindShowTriggerHandle() {
          thisElement.bind(showTriggers, onMouseEnterAndMouseOver);
        };

        $scope.bindHideTriggers = function bindHideTriggersHandle() {
          if (hideTarget === 'tooltip'){

            theTooltip.bind(hideTriggers, onMouseLeaveAndMouseOut);
          } else {

            thisElement.bind(hideTriggers, onMouseLeaveAndMouseOut);
          }
        };

        $scope.clearTriggers = function clearTriggersHandle() {
          thisElement.unbind(showTriggers, onMouseEnterAndMouseOver);
          thisElement.unbind(hideTriggers, onMouseLeaveAndMouseOut);
        };

        $scope.bindShowTriggers();

        $scope.showTooltip = function showTooltip() {

          if (tooltipScroll) {
            oldBoundingRect = thisElement[0].getBoundingClientRect();
            positionInterval = $interval(function intervalShowTooltip() {
              var newBoundingRect = thisElement[0].getBoundingClientRect();

              if (!angular.equals(oldBoundingRect, newBoundingRect)) {
                $scope.tooltipPositioning(side);
              }

              oldBoundingRect = newBoundingRect;
            }, POSITION_CHECK_INTERVAL);
          }

          theTooltip.addClass(CSS_PREFIX + 'open');
          theTooltip.css('transition', 'opacity ' + speed + 'ms linear');

          if (delay) {

            theTooltip.css('transition-delay', delay + 'ms' );
          }

          $scope.clearTriggers();
          $scope.bindHideTriggers();
        };

        $scope.hideTooltip = function hideTooltip() {

          theTooltip.css('transition', 'opacity ' + speed + 'ms linear, visibility 0s linear ' + speed + 'ms');
          theTooltip.removeClass(CSS_PREFIX + 'open');
          $scope.clearTriggers();
          $scope.bindShowTriggers();

          if (angular.isDefined($scope.positionInterval)) {
            $interval.cancel(positionInterval);
            positionInterval = undefined;
          }
        };

        $scope.removePosition = function removeTooltipPosition() {

          theTooltip
          .removeClass(CSS_PREFIX + 'left')
          .removeClass(CSS_PREFIX + 'right')
          .removeClass(CSS_PREFIX + 'top')
          .removeClass(CSS_PREFIX + 'bottom ');
        };

        $scope.tooltipPositioning = function tooltipPositioning(tooltipSide) {

          $scope.removePosition();
          $scope.getOffsets();

          var topValue
            , leftValue;

          if (size === 'small') {

            theTooltipMargin = TOOLTIP_SMALL_MARGIN;

          } else if (size === 'medium') {

            theTooltipMargin = TOOLTIP_MEDIUM_MARGIN;

          } else if (size === 'large') {

            theTooltipMargin = TOOLTIP_LARGE_MARGIN;
          }

          if (tooltipSide === 'left') {

            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
            leftValue = offsetLeft - (theTooltipWidth + theTooltipMargin);

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
            theTooltip.addClass(CSS_PREFIX + 'left');
          }

          if (tooltipSide === 'right') {

            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
            leftValue = offsetLeft + width + theTooltipMargin;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
            theTooltip.addClass(CSS_PREFIX + 'right');
          }

          if (tooltipSide === 'top') {

            topValue = offsetTop - theTooltipMargin - theTooltipHeight;
            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
            theTooltip.addClass(CSS_PREFIX + 'top');
          }

          if (tooltipSide === 'bottom') {

            topValue = offsetTop + height + theTooltipMargin;
            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;
            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
            theTooltip.addClass(CSS_PREFIX + 'bottom');
          }
        };

        $scope.tooltipTryPosition = function tooltipTryPosition() {

          var theTooltipH = theTooltip[0].offsetHeight
            , theTooltipW = theTooltip[0].offsetWidth
            , topOffset = theTooltip[0].offsetTop
            , leftOffset = theTooltip[0].offsetLeft
            , winWidth = $window.innerWidth
            , winHeight = $window.innerHeight
            , rightOffset = winWidth - (theTooltipW + leftOffset)
            , bottomOffset = winHeight - (theTooltipH + topOffset)
            //element OFFSETS (not tooltip offsets)
            , elmHeight = thisElement[0].offsetHeight
            , elmWidth = thisElement[0].offsetWidth
            , elmOffsetLeft = thisElement[0].offsetLeft
            , elmOffsetTop = thisElement[0].offsetTop
            , elmOffsetRight = winWidth - (elmOffsetLeft + elmWidth)
            , elmOffsetBottom = winHeight - (elmHeight + elmOffsetTop)
            , offsets = {
              'left': leftOffset,
              'top': topOffset,
              'bottom': bottomOffset,
              'right': rightOffset
            }
            , posix = {
              'left': elmOffsetLeft,
              'right': elmOffsetRight,
              'top': elmOffsetTop,
              'bottom': elmOffsetBottom
            }
            , bestPosition = Object.keys(posix).reduce(function reduceBestPositions(best, key) {

              return posix[best] > posix[key] ? best : key;
            })
            , worstOffset = Object.keys(offsets).reduce(function reduceWorstOffset(worst, key) {

              return offsets[worst] < offsets[key] ? worst : key;
            });

          if (originSide !== bestPosition && offsets[worstOffset] < 20) {

            side = bestPosition;

            $scope.tooltipPositioning(side);
            $scope.initTooltip(bestPosition);
          }
        };

        function onResize() {
          $scope.hideTooltip();
          $scope.initTooltip(originSide);
        }

        angular.element($window).bind('resize', onResize);
        // destroy the tooltip when the directive is destroyed
        // unbind all dom event handlers
        $scope.$on('$destroy', function scopeOnDestroy() {

          angular.element($window).unbind('resize', onResize);
          $scope.clearTriggers();
          theTooltip.remove();
        });

        if (attr.tooltipTitle) {

          attr.$observe('tooltipTitle', function observeTooltipTitle(val) {
            $scope.title = val;
            $scope.initTooltip(side);
          });
        }

        if (attr.title) {

          attr.$observe('title', function observeElementTitle(val) {
            $scope.title = val;
            $scope.initTooltip(side);
          });
        }

        if (attr.tooltipContent) {

          attr.$observe('tooltipContent', function observeTooltipContent(val) {
            $scope.content = val;
            $scope.initTooltip(side);
          });
        }

        if (attr.tooltipHtml) {

          attr.$observe('tooltipHtml', function observeTooltipHtml(val) {
            $scope.html = val;
            $scope.initTooltip(side);
          });
        }
      }
    };
   }]);
}(angular));
