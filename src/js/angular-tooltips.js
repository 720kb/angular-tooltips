/*global angular*/

(function withAngular(angular) {
  'use strict';

  angular.module('720kb.tooltips', [])
  .directive('tooltips', ['$window', '$compile', function manageDirective($window, $compile) {

    var TOOLTIP_SMALL_MARGIN = 8 //px
      , TOOLTIP_MEDIUM_MARGIN = 9 //px
      , TOOLTIP_LARGE_MARGIN = 10 //px
      , CSS_PREFIX = '_720kb-tooltip-';
    return {
      'restrict': 'A',
      'scope': {},
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
          , title = attr.tooltipTitle || attr.title || ''
          , content = attr.tooltipContent || ''
          , showTriggers = attr.tooltipShowTrigger || 'mouseover'
          , hideTriggers = attr.tooltipHideTrigger || 'mouseleave'
          , originSide = attr.tooltipSide || 'top'
          , side = originSide
          , size = attr.tooltipSize || 'medium'
          , tryPosition = $scope.$eval(attr.tooltipTry) || true
          , className = attr.tooltipClass || ''
          , speed = (attr.tooltipSpeed || 'medium').toLowerCase()
          , lazyMode = $scope.$eval(attr.tooltipLazy) || true
          , htmlTemplate =
              '<div class="_720kb-tooltip ' + CSS_PREFIX + size + '">' +
              '<div class="' + CSS_PREFIX + 'title"> ' + title + '</div>' +
              content + ' <span class="' + CSS_PREFIX + 'caret"></span>' +
              '</div>';

        //parse the animation speed of tooltips
        $scope.parseSpeed = function parseSpeed () {

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

        $scope.initTooltip = function initTooltip (tooltipSide) {

          height = thisElement[0].offsetHeight;
          width = thisElement[0].offsetWidth;
          offsetTop = $scope.getRootOffsetTop(thisElement[0], 0);
          offsetLeft = $scope.getRootOffsetLeft(thisElement[0], 0);
          //get tooltip dimension
          theTooltipHeight = theTooltip[0].offsetHeight;
          theTooltipWidth = theTooltip[0].offsetWidth;

          $scope.parseSpeed();
          $scope.tooltipPositioning(tooltipSide);
        };

        $scope.getRootOffsetTop = function getRootOffsetTop (elem, val){

          if (elem.offsetParent === null){

            return val + elem.offsetTop;
          }

          return $scope.getRootOffsetTop(elem.offsetParent, val + elem.offsetTop);
        };

        $scope.getRootOffsetLeft = function getRootOffsetLeft (elem, val){

          if (elem.offsetParent === null){

            return val + elem.offsetLeft;
          }

          return $scope.getRootOffsetLeft(elem.offsetParent, val + elem.offsetLeft);
        };

        thisElement.bind(showTriggers, function onMouseEnterAndMouseOver() {

          if (!lazyMode || !initialized) {

            initialized = true;
            $scope.initTooltip(side);
          }
          if (tryPosition) {

            $scope.tooltipTryPosition();
          }
          $scope.showTooltip();
        });

        thisElement.bind(hideTriggers, function onMouseLeaveAndMouseOut() {

          $scope.hideTooltip();
        });

        $scope.showTooltip = function showTooltip () {

          theTooltip.addClass(CSS_PREFIX + 'open');
          theTooltip.css('transition', 'opacity ' + speed + 'ms linear');
        };

        $scope.hideTooltip = function hideTooltip () {

          theTooltip.removeClass(CSS_PREFIX + 'open');
          theTooltip.css('transition', '');
        };

        $scope.removePosition = function removeTooltipPosition () {

          theTooltip
          .removeClass(CSS_PREFIX + 'left')
          .removeClass(CSS_PREFIX + 'right')
          .removeClass(CSS_PREFIX + 'top')
          .removeClass(CSS_PREFIX + 'bottom ');
        };

        $scope.tooltipPositioning = function tooltipPositioning (tooltipSide) {

          $scope.removePosition();

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

        $scope.tooltipTryPosition = function tooltipTryPosition () {

            var topOffset = theTooltip[0].offsetTop
              , leftOffset = theTooltip[0].offsetLeft
              , winWidth = $window.outerWidth
              , winHeight = $window.outerHeight
              , rightOffset = winWidth - (theTooltipWidth + leftOffset)
              , bottomOffset = winHeight - (theTooltipHeight + topOffset)
              , obj = {
                'left': leftOffset,
                'top': topOffset,
                'bottom': bottomOffset,
                'right': rightOffset
              }
              //lets get which position has more free space
              , awesomePosition = Object.keys(obj).reduce(function (largest, key) {

                  return obj[largest] > obj[key] ? largest : key;
              });
            console.log(leftOffset, rightOffset);
            switch (originSide) {
              case 'left':
                if (leftOffset < 8) {

                  side = awesomePosition;
                  $scope.initTooltip(awesomePosition);
                } else {

                  $scope.initTooltip(originSide);
                }
                break;
              case 'right':
                if (rightOffset < 8) {

                  side = awesomePosition;
                  $scope.initTooltip(awesomePosition);
                } else {

                  $scope.initTooltip(originSide);
                }
                break;
              case 'bottom':
              if (bottomOffset < 8) {

                  side = awesomePosition;
                  $scope.initTooltip(awesomePosition);
                } else {

                  $scope.initTooltip(originSide);
                }
                break;
              case 'top':
              if (topOffset < 8) {

                  side = awesomePosition;
                  $scope.initTooltip(awesomePosition);
                } else {

                  $scope.initTooltip(originSide);
                }
                break;

              default:
                $scope.initTooltip(originSide);
            }
        };

        angular.element($window).bind('resize', function onResize() {

          if (tryPosition) {

            $scope.tooltipTryPosition();
          } else {
            $scope.initTooltip(originSide);
          }
        });
      }
    };
  }]);
}(angular));
