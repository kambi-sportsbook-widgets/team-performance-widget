(function () {

   'use strict';

   /**
    * @ngdoc directive
    * @name teamPerformanceWidget.directive:matchBoxesDirective
    * @description
    * Directive for the boxes containing match history
    * @restrict A
    * @scope    *
    * @author daniel.hoffmann@globalmouth.com
    */
   (function ($app) {
      return $app.directive('matchBoxesDirective', ['$window', function ($window) {
         return {
            restrict: 'E',
            replace: true,
            scope: {
               matches: '=matches',
               text: '=text'
            },
            template: '<div class=\'l-flexbox l-horizontal l-p-6 \'> ' +
               '<div \ ' +
                  'class=\'l-flexbox l-pack-center l-vertical l-align-center ' +
                  ' kw-match-box\' ' +
                  'ng-repeat=\'match in matches\'> ' +
                  '<span class=\'l-flexbox\'>{{match.result | translate}}</span> ' +
                  '<div class=\'l-flexbox kw-match-{{match.result}}\'></div> ' +
               '</div> ' +
            '</div> '
         };
      }]);
   })(angular.module('teamPerformanceWidget'));

}).call(this);
