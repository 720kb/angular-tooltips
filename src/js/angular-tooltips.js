/*global angular*/

(function withAngular(angular) {

  angular.module('720kb.tooltips', [])
  .directive('tooltips', ['$window', '$compile', function manageDirective($window, $compile) {

    var TOOLTIP_SMALL_MARGIN = 8 //px
      , TOOLTIP_MEDIUM_MARGIN = 9 //px
      , TOOLTIP_LARGE_MARGIN = 10; //px

    return {
      'restrict': 'A',
      'scope': {},
      'link': function linkingFunction($scope, element, attr) {

        var thisElement  = angular.element(element[0])
          , theTooltip
          , theTooltipElement
          , theTooltipHeight
          , theTooltipWidth
          , theTooltipMargin //used both for margin top left right bottom
          , height
          , width
          , offsetTop
          , offsetLeft
          , title = attr.title || ''
          , content = attr.tooltipContent || ''
          , side = attr.tooltipSide || 'top'
          , size = attr.tooltipSize || 'medium'
          , htmlTemplate = '<div class="tooltip tooltip-' + side + ' tooltip-' + size + '">' +
                '<div class="tooltip-title"> ' + title + '</div>' +
                content + ' <span class="tooltip-caret"></span>' +
              '</div>';

        //create the tooltip
        thisElement.after($compile(htmlTemplate)($scope));
        //get tooltip element
        theTooltip = element[0].nextSibling;
        theTooltipElement = angular.element(theTooltip);

        $scope.initTooltip = function getInfos (side) {

            height = element[0].offsetHeight;
            width = element[0].offsetWidth;
            offsetTop = element[0].offsetTop;
            offsetLeft = element[0].offsetLeft;
            //get tooltip dimension
            theTooltipHeight =  theTooltipElement[0].offsetHeight;
            theTooltipWidth =  theTooltipElement[0].offsetWidth;

            $scope.tooltipPositioning(side);
        };

        thisElement.bind('mouseenter mouseover', function onMouseEnterAndMouseOver() {

          $scope.showTooltip();
        });

        thisElement.bind('mouseleave mouseout', function onMouseLeaveAndMouseOut() {

          $scope.hideTooltip();
        });

        $scope.showTooltip = function showTooltip () {

          theTooltip.classList.add('tooltip-open');
        };

        $scope.hideTooltip = function hideTooltip () {

          theTooltip.classList.remove('tooltip-open');
        };

        $scope.tooltipPositioning = function tooltipPositioning (side) {

          var topValue
            , leftValue;
          if (size === 'small') {

            theTooltipMargin = TOOLTIP_SMALL_MARGIN;

          } else if (size === 'medium') {

            theTooltipMargin =  TOOLTIP_MEDIUM_MARGIN;

          } else if (size === 'large') {

            theTooltipMargin = TOOLTIP_LARGE_MARGIN;
          }

          if (side === 'left') {

            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
            theTooltipElement.css('top', topValue + 'px');
            theTooltipElement.css('left', offsetLeft + 'px');
            theTooltipElement.css('margin-left', '-' + (theTooltipWidth + theTooltipMargin) + 'px');
          }

          if (side === 'right') {

            topValue = offsetTop + height / 2 - theTooltipHeight / 2;
            leftValue = offsetLeft + width + theTooltipMargin;
            theTooltipElement.css('top', topValue + 'px');
            theTooltipElement.css('left', leftValue + 'px');
          }

          if (side === 'top') {

            topValue = offsetTop - theTooltipMargin - theTooltipHeight;
            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;
            theTooltipElement.css('top', topValue + 'px');
            theTooltipElement.css('left', leftValue + 'px');
          }

          if (side === 'bottom') {

            topValue = offsetTop + height + theTooltipMargin;
            leftValue = offsetLeft + width / 2 - theTooltipWidth / 2;
            theTooltipElement.css('top', topValue + 'px');
            theTooltipElement.css('left', leftValue + 'px');
          }
        };

        $scope.initTooltip(side);

         angular.element($window).bind('resize', function onResize() {

          $scope.initTooltip(side);
        });
      }
    };
  }]);
}(angular));
