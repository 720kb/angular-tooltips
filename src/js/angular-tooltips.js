/*global angular*/

(function withAngular(angular) {

  angular.module('720kb.tooltips', [])
  .directive('tooltips',[ '$window', '$compile', function manageDirective($window, $compile) {

    var TOOLTIP_X_PADDING = 7 //px
      ,  TOOLTIP_Y_PADDING = 0; //px
    
    return {
      'restrict': 'A',
      'scope': {},
      'link': function linkingFunction($scope, element, attr) {
        
        var thisElement  = angular.element(element[0])
          , theTooltip
          , theTooltipElement
          , theTooltipWidth
          , theTooltipHeight
          , theTooltipMargin //used both for margin top left right bottom
          , side = attr.tooltipsSide || 'top'
          , size = attr.tooltipsSize || 'medium'
          , height = element[0].offsetHeight
          , offsetTop = element[0].offsetTop
          , offsetLeft = element[0].offsetLeft
          , htmlTemplate = '<div class="tooltip" ng-class="{\'tooltip-small\': tooltipSize === \'small\',\'tooltip-medium\': tooltipSize === \'medium\',\'tooltip-large\': tooltipSize === \'large\' }">tooltip</div>';
        //create tooltip
        thisElement.after($compile(htmlTemplate)($scope));
        //get tooltip element
        theTooltip = element[0].nextSibling;
        theTooltipElement = angular.element(theTooltip);
        
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

        $scope.setTooltipSize = function setTooltipSize (size) {
          //get tooltip dimension
          theTooltipWidth =  theTooltipElement[0].offsetWidth + TOOLTIP_X_PADDING /*some padding*/;
          theTooltipHeight =  theTooltipElement[0].offsetHeight + TOOLTIP_Y_PADDING /*some padding*/;
          $scope.tooltipSize = size;
        };

        $scope.tooltipPositioning = function tooltipPositioning (side) {
          console.log(size);
          if (size === 'small') {

              theTooltipMargin = 0 //px

          } else if (size === 'medium') {

             theTooltipMargin =  8 //px

          } else if (size === 'large') {

             theTooltipMargin = 28 //px
          }

          if (side === 'left') {
            
            theTooltipElement.css('top', ((offsetTop + (height/2))) + 'px');
            theTooltipElement.css('left', offsetLeft + 'px');
            
            /*if (height > theTooltipHeight) {

            theTooltipElement.css('margin-top', '-' + ((height/2) - (theTooltipHeight/2)) + 'px');
            } else {

            theTooltipElement.css('margin-top', '-' + ((height/2) + (theTooltipHeight/2)) + 'px');
            }*/

            theTooltipElement.css('margin-left', '-' + (theTooltipWidth + theTooltipMargin) + 'px');
          }

          if (side === 'right') {
            
            theTooltipElement.css('top', offsetTop + 'px');
            theTooltipElement.css('right', offsetLeft + 'px');
            
            if (height > theTooltipHeight) {

            theTooltipElement.css('margin-top', '+' + ((height/2) - (theTooltipHeight/4)) + 'px');
            } else {

            theTooltipElement.css('margin-top', '+' + ((theTooltipHeight/4) - (height/2)) + 'px');
            }

            theTooltipElement.css('margin-right', '-' + (theTooltipWidth + theTooltipMargin) + 'px');
          }
        };
        $scope.setTooltipSize(size);
        $scope.tooltipPositioning(side);
        }
      };
  }]);
}(angular));
