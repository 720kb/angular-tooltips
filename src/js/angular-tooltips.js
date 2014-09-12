/*global angular*/

(function withAngular(angular) {

  angular.module('720kb.tooltips', [])
  .directive('tooltips',[ '$window', '$compile', function manageDirective($window, $compile) {
    
    var TOOLTIP_SMALL_MARGIN = 8 //px
      , TOOLTIP_MEDIUM_MARGIN = 9 //px
      , TOOLTIP_LARGE_MARGIN = 10 //px;

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
          , theTooltipCaret
          , content = attr.tooltipContent || 'Some content !?'
          , side = attr.tooltipsSide || 'top'
          , size = attr.tooltipsSize || 'medium'
          , height = element[0].offsetHeight
          , width = element[0].offsetWidth
          , offsetTop = element[0].offsetTop
          , offsetLeft = element[0].offsetLeft
          , htmlTemplate = '<div class="tooltip tooltip-' + side + ' tooltip-' + size + '">' + content + ' <span class="tooltip-caret"></span></div>';

        //create tooltip
        thisElement.after($compile(htmlTemplate)($scope));
        //get tooltip element
        theTooltip = element[0].nextSibling;
        theTooltipElement = angular.element(theTooltip);
        //get tooltip dimension
        theTooltipHeight =  theTooltipElement[0].offsetHeight;
        theTooltipWidth =  theTooltipElement[0].offsetWidth;
        theTooltipCaret = angular.element(theTooltipElement[0].lastChild);

        thisElement.bind('mouseenter mouseover', function () {
          
          $scope.showTooltip();
        });

        thisElement.bind('mouseleave mouseout', function () {
          
          $scope.hideTooltip();
        });

        $scope.showTooltip = function showTooltip () {
          
          theTooltip.classList.add('tooltip-open');
        };

        $scope.hideTooltip = function hideTooltip () {
          
          theTooltip.classList.remove('tooltip-open');
        };

        $scope.tooltipPositioning = function tooltipPositioning (side) {
          
          if (size === 'small') {

              theTooltipMargin = TOOLTIP_SMALL_MARGIN

          } else if (size === 'medium') {

             theTooltipMargin =  TOOLTIP_MEDIUM_MARGIN

          } else if (size === 'large') {

             theTooltipMargin = TOOLTIP_LARGE_MARGIN
          }

          if (side === 'left') {

            theTooltipElement.css('top', ((offsetTop + (height/2)) - (theTooltipHeight/2)) + 'px');
            theTooltipElement.css('left', offsetLeft + 'px');
            theTooltipElement.css('margin-left', '-' + (theTooltipWidth + theTooltipMargin) + 'px');
          }

          if (side === 'right') {

            theTooltipElement.css('top', ((offsetTop + (height/2)) - (theTooltipHeight/2)) + 'px');
            theTooltipElement.css('left', (offsetLeft + width + theTooltipMargin) + 'px');
          }

          if (side === 'top') {

            theTooltipElement.css('top', (offsetTop - theTooltipMargin - theTooltipHeight) + 'px');
            theTooltipElement.css('left', (offsetLeft + (width/2)) - (theTooltipWidth/2) + 'px');
          }

          if (side === 'bottom') {

            theTooltipElement.css('top', (offsetTop + height + theTooltipMargin) + 'px');
            theTooltipElement.css('left', (offsetLeft + (width/2)) - (theTooltipWidth/2) + 'px');
          }

        };

        $scope.tooltipPositioning(side);
        }
      };
  }]);
}(angular));
