/*global angular*/

(function withAngular(angular) {
  'use strict';

  angular.module('720kb.tooltips', [])
  .directive('tooltips', ['$window', '$compile', function manageDirective($window, $compile) {

    var TOOLTIP_SMALL_MARGIN = 8 //px
      , TOOLTIP_MEDIUM_MARGIN = 9 //px
      , TOOLTIP_LARGE_MARGIN = 10; //px

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
          , showTriggers = attr.tooltipShowTrigger || 'mouseenter mouseover'
          , hideTriggers = attr.tooltipHideTrigger || 'mouseleave mouseout'
          , side = attr.tooltipSide || 'top'
          , size = attr.tooltipSize || 'medium'
          , tryPosition = attr.tooltipTry || 1  // If set into 0 , the auto-position method will not call
          , className = attr.tooltipClass || ''
          , lazyMode = $scope.$eval(attr.tooltipLazy || true)
          , htmlTemplate = '<div class="_720kb-tooltip _720kb-tooltip-' + side + ' _720kb-tooltip-' + size + '">' +
                '<div class="_720kb-tooltip-title"> ' + title + '</div>' +
                content + ' <span class="_720kb-tooltip-caret"></span>' +
              '</div>';

        //create the tooltip
        theTooltip = $compile(htmlTemplate)($scope);

        theTooltip.addClass(className);

        body.append(theTooltip);

        $scope.initTooltip = function getInfos (tooltipSide) {

            height = thisElement[0].offsetHeight;
            width = thisElement[0].offsetWidth;
            offsetTop = $scope.getRootOffsetTop(thisElement[0], 0);
            offsetLeft = $scope.getRootOffsetLeft(thisElement[0], 0);
            //get tooltip dimension
            theTooltipHeight = theTooltip[0].offsetHeight;
            theTooltipWidth = theTooltip[0].offsetWidth;

            $scope.tooltipPositioning(tooltipSide);
        };

        $scope.getRootOffsetTop = function getRootOffsetTop (elem, val){

          if (elem.offsetParent === null){

            return val + elem.offsetTop ;
          }

          return $scope.getRootOffsetTop(elem.offsetParent, val + elem.offsetTop) ;
        };

        $scope.getRootOffsetLeft = function getRootOffsetLeft (elem, val){

          if (elem.offsetParent === null){

            return val + elem.offsetLeft ;
          }

          return $scope.getRootOffsetLeft(elem.offsetParent, val + elem.offsetLeft);
        };

        thisElement.bind(showTriggers, function onMouseEnterAndMouseOver() {

          if (!lazyMode || !initialized) {

            initialized = true;
            $scope.initTooltip(side);
          }

          $scope.showTooltip();
        });

        thisElement.bind(hideTriggers, function onMouseLeaveAndMouseOut() {

          $scope.hideTooltip();
        });

        $scope.showTooltip = function showTooltip () {

          theTooltip.addClass('_720kb-tooltip-open');
        };

        $scope.hideTooltip = function hideTooltip () {

          theTooltip.removeClass('_720kb-tooltip-open');
        };

        $scope.tooltipPositioning = function tooltipPositioning (tooltipSide) {

          var topValue
            , leftValue
            , position;

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

            position = $scope.trySuitablePosition(topValue, leftValue, tooltipSide);
            topValue = position.topValue;
            leftValue = position.leftValue;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
          }

          if (tooltipSide === 'right') {

            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
            leftValue = offsetLeft + width + theTooltipMargin;

            position = $scope.trySuitablePosition(topValue, leftValue, tooltipSide);
            topValue = position.topValue;
            leftValue = position.leftValue;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
          }

          if (tooltipSide === 'top') {

            topValue = offsetTop - theTooltipMargin - theTooltipHeight;
            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;

            position = $scope.trySuitablePosition(topValue, leftValue, tooltipSide);
            topValue = position.topValue;
            leftValue = position.leftValue;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
          }

          if (tooltipSide === 'bottom') {

            topValue = offsetTop + height + theTooltipMargin;
            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;

            position = $scope.trySuitablePosition(topValue, leftValue, tooltipSide);
            topValue = position.topValue;
            leftValue = position.leftValue;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
          }
        };

        // try a suitable position when no space to show
        $scope.trySuitablePosition = function trySuitablePosition (topValue, leftValue, orginPosition){

          var position = {};

          position.topValue = topValue;
          position.leftValue = leftValue;

          if (tryPosition === 0 || (position.topValue >= 0 && position.leftValue >= 0)){

            return position;
          }

          position.topValue = offsetTop + height / 2 - theTooltipHeight / 2;
          position.leftValue = offsetLeft - (theTooltipWidth + theTooltipMargin);

          if (position.topValue >= 0 && position.leftValue >= 0){
            theTooltip.removeClass('_720kb-tooltip-' + orginPosition);
            theTooltip.addClass('_720kb-tooltip-left');

            return position;
          }

          position.topValue = offsetTop + height / 2 - theTooltipHeight / 2;
          position.leftValue = offsetLeft + width + theTooltipMargin;

          if (position.topValue >= 0 && position.leftValue >= 0){

            theTooltip.removeClass('_720kb-tooltip-' + orginPosition);
            theTooltip.addClass('_720kb-tooltip-right');

            return position;
          }

          position.topValue = offsetTop - theTooltipMargin - theTooltipHeight;
          position.leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;

          if (position.topValue >= 0 && position.leftValue >= 0){

            theTooltip.removeClass('_720kb-tooltip-' + orginPosition);
            theTooltip.addClass('_720kb-tooltip-top');

            return position;
          }

          position.topValue = offsetTop + height + theTooltipMargin;
          position.leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;

          theTooltip.removeClass('_720kb-tooltip-' + orginPosition);
          theTooltip.addClass('_720kb-tooltip-bottom');

          return position;
        };

        angular.element($window).bind('resize', function onResize() {

          $scope.initTooltip(side);
        });
      }
    };
  }]);
}(angular));
