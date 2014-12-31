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
          , body = angular.element('body')
          , theTooltip
          , theTooltipHeight
          , theTooltipWidth
          , theTooltipMargin //used both for margin top left right bottom
          , height
          , width
          , offsetTop
          , offsetLeft
          , title = attr.title || ''
          , content = attr.tooltipContent || ''
          , showTriggers = attr.tooltipShowTrigger || 'mouseenter mouseover'
          , hideTriggers = attr.tooltipHideTrigger || 'mouseleave mouseout'
          , side = attr.tooltipSide || 'top'
          , size = attr.tooltipSize || 'medium'
          , tryPosition = attr.tooltipTry || 1  // If set into 0 , the auto-position method will not call
          , htmlTemplate = '<div class="_720kb-tooltip _720kb-tooltip-' + side + ' _720kb-tooltip-' + size + '">' +
                '<div class="_720kb-tooltip-title"> ' + title + '</div>' +
                content + ' <span class="_720kb-tooltip-caret"></span>' +
              '</div>';

        //create the tooltip
        theTooltip = $compile(htmlTemplate)($scope);
        body.append(theTooltip);

        console.log(tryPosition);

        $scope.initTooltip = function getInfos (side) {

            height = thisElement.outerHeight();
            width = thisElement.outerWidth();
            offsetTop = thisElement.offset().top;
            offsetLeft = thisElement.offset().left;
            //get tooltip dimension
            theTooltipHeight = theTooltip.outerHeight();
            theTooltipWidth = theTooltip.outerWidth();

            $scope.tooltipPositioning(side);
        };

        thisElement.bind(showTriggers, function onMouseEnterAndMouseOver() {

          if (!initialized) {

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

        $scope.tooltipPositioning = function tooltipPositioning (side) {

          var topValue
            , leftValue;
          if (size === 'small') {

            theTooltipMargin = TOOLTIP_SMALL_MARGIN;

          } else if (size === 'medium') {

            theTooltipMargin = TOOLTIP_MEDIUM_MARGIN;

          } else if (size === 'large') {

            theTooltipMargin = TOOLTIP_LARGE_MARGIN;
          }

          if (side === 'left') {

            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
            leftValue = offsetLeft - (theTooltipWidth + theTooltipMargin) ;

            var position = $scope.trySuitablePosition(topValue, leftValue, side);
            topValue = position.topValue;
            leftValue = position.leftValue;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
          }

          if (side === 'right') {

            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
            leftValue = offsetLeft + width + theTooltipMargin;

            var position = $scope.trySuitablePosition(topValue, leftValue, side);
            topValue = position.topValue;
            leftValue = position.leftValue;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
          }

          if (side === 'top') {

            topValue = offsetTop - theTooltipMargin - theTooltipHeight;
            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;

            var position = $scope.trySuitablePosition(topValue, leftValue, side);
            topValue = position.topValue;
            leftValue = position.leftValue;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
          }

          if (side === 'bottom') {

            topValue = offsetTop + height + theTooltipMargin;
            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;

            var position = $scope.trySuitablePosition(topValue, leftValue, side);
            topValue = position.topValue;
            leftValue = position.leftValue;

            theTooltip.css('top', topValue + 'px');
            theTooltip.css('left', leftValue + 'px');
          }
        };

        // try a suitable position when no space to show
        $scope.trySuitablePosition = function(topValue, leftValue, orgin_position){
          var _position = {} ;
          _position.topValue = topValue ; 
          _position.leftValue = leftValue ; 
          console.log(tryPosition);
          if((_position.topValue >= 0 && _position.leftValue >= 0) || tryPosition == 0) 
            return _position;
          console.log()

          _position.topValue = offsetTop + height / 2 - theTooltipHeight / 2;
          _position.leftValue = offsetLeft - (theTooltipWidth + theTooltipMargin) ;

          if(_position.topValue >= 0 && _position.leftValue >= 0){
            theTooltip.removeClass('_720kb-tooltip-'+orgin_position);
            theTooltip.addClass('_720kb-tooltip-left');
            return _position;
          }

          _position.topValue = offsetTop + height / 2 - theTooltipHeight / 2;
          _position.leftValue = offsetLeft + width + theTooltipMargin;

          if(_position.topValue >= 0 && _position.leftValue >= 0){
            theTooltip.removeClass('_720kb-tooltip-'+orgin_position);
            theTooltip.addClass('_720kb-tooltip-right');
            return _position;
          }

          
          _position.topValue = offsetTop - theTooltipMargin - theTooltipHeight;
          _position.leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;

          if(_position.topValue >= 0 && _position.leftValue >= 0){
            theTooltip.removeClass('_720kb-tooltip-'+orgin_position);
            theTooltip.addClass('_720kb-tooltip-top');
            return _position;
          }

          
          _position.topValue = offsetTop + height + theTooltipMargin;
          _position.leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;


          theTooltip.removeClass('_720kb-tooltip-'+orgin_position);
          theTooltip.addClass('_720kb-tooltip-bottom');

          return _position;
        }

        angular.element($window).bind('resize', function onResize() {

          $scope.initTooltip(side);
        });
      }
    };
  }]);
}(angular));
