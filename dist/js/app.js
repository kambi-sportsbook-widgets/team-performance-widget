(function () {

   var arrDependencies;

   arrDependencies = [
      'widgetCore',
      'widgetCore.translate',
      'ngAnimate'
   ];

   (function ( $app ) {
      'use strict';

      return $app;
   })(angular.module('teamPerformanceWidget', arrDependencies));
}).call(this);

/* globals _ */
(function () {

   'use strict';

   var parseMatchHistoryItem = function(match, teamName) {
      var item = {
         id: match.id,
         date: match.date,
         inHome: match.homeTeam === teamName,
         homeTeam: match.homeTeam,
         awayTeam: match.awayTeam,
         homeScore: match.result.homeScore,
         awayScore: match.result.awayScore,
         result: 'lose'
      };
      var d = item.date;
      var day = d.getUTCDate() +'';
      if (day.length === 1) {
         day = '0'+day;
      }

      var month = (d.getUTCMonth()+1) +'';
      if (month.length === 1) {
         month = '0'+month;
      }

      item.dateText = day + '/' + month + '/' + d.getUTCFullYear();

      var result = match.result; //TODO can match.result be null? if so special handling is required

      if (item.inHome) {
         item.teamScore = result.homeScore;
         item.opponentScore = result.awayScore;
         item.opponentName = match.awayTeam;
      } else {
         item.teamScore = result.awayScore;
         item.opponentScore = result.homeScore;
         item.opponentName = match.homeTeam;
      }

      if (result.homeScore === result.awayScore) {
         item.result = 'draw';
      } else if (
         (item.inHome && result.homeScore > result.awayScore) ||
         (!item.inHome && result.awayScore > result.homeScore)
         ) {
         item.result = 'win';
      }
      item.tooltipText = 'vs ' + item.opponentName + ' - ' + item.teamScore + 'x' + item.opponentScore;
      return item;
   };

   // returns true if the item is not already present in the provided matchHistory and
   // the matchHistory length is not bigger than args.numberMatchesPerTeam
   var shouldBeAddedToHistory = function(matchHistory, item, numberMatchesPerTeam) {
      if (matchHistory.length >= numberMatchesPerTeam) {
         return false;
      }
      //just making sure that the match is not already in there
      var isInHistory = _.find(matchHistory, function(e) {
         return item.id === e.id;
      });
      if (isInHistory != null) {
         return false;
      }
      return true;
   };

   //calculates the performance of the team
   var calculatePerformance = function(matchHistory) {
      var sum = 0;
      matchHistory.forEach(function(m) {
         if (m.result === 'win') {
            sum += 20;
         } else if (m.result === 'draw') {
            sum += 10;
         }
      });
      //TODO check if this calculation is correct
      return sum / (matchHistory.length * 20);
   };

   // parses the data provided considering only the first numberMatchesPerTeam matches
   var parseTeamsInfo = function(teams, numberMatchesPerTeam) {
      var teamsInfo = [];
      teams.forEach(function(team) {
         var matchHistory= [];
         var matchHistoryHome= [];
         var matchHistoryAway= [];

         //parsing date strings
         team.matchHistory.forEach(function(match, index) {
            //TODO check if parsing is done correctly
            match.date = new Date(match.date);
         });

         //sorting by date descending
         team.matchHistory.sort(function(a, b) {
            if (a.date.getTime() > b.date.getTime()) {
               return 1;
            } else {
               return -1;
            }
         });

         team.matchHistory.forEach(function(match, index) {
            var item = parseMatchHistoryItem(match, team.name);

            if (shouldBeAddedToHistory(matchHistory, item, numberMatchesPerTeam)) {
               matchHistory.push(item);
            }

            if (item.inHome && shouldBeAddedToHistory(matchHistoryHome, item, numberMatchesPerTeam)) {
               matchHistoryHome.push(item);
            }

            if ( !item.inHome && shouldBeAddedToHistory(matchHistoryAway, item, numberMatchesPerTeam)) {
               matchHistoryAway.push(item);
            }
         });

         teamsInfo.push({
            name: team.name,
            performance: calculatePerformance(matchHistory),
            detailed: false, //controls if detailed information is visible
            matchHistory: matchHistory,
            matchHistoryHome: matchHistoryHome,
            matchHistoryAway: matchHistoryAway,
         });
      });
      return teamsInfo;
   };

   var $app = angular.module('teamPerformanceWidget');

   $app.controller('appController',
      ['$scope', '$controller', '$http', '$sce', 'kambiAPIService', 'kambiWidgetService',
      function ( $scope, $controller, $http, $sce, kambiAPIService, kambiWidgetService ) {

         angular.extend(this, $controller('widgetCoreController', {
            '$scope': $scope
         }));

         // Default arguments, these will be overridden by the arguments from the widget api
         $scope.defaultArgs = {
            title: 'Football - Team Performance Indicator',
            numberMatchesPerTeam: 6, // maximum number of matches to show per team
            listLimit: 3, // Set the list limit value to be used for pagination
         };

         $scope.Math = window.Math; //to be able to use Math functions in the template

         $scope.startFrom = 0;
         $scope.teams = [];

         $scope.adjustHeight = function() {
            //TODO maybe try to dinamically get these values?
            //might not be possible to get detailedViewHeight due to the accordion animation
            var headerHeight = 40;
            var footerHeight = 40;
            var mainPadding = 16;
            var compactViewHeight = 201;
            var detailedViewHeight = compactViewHeight + 460;
            var contentHeight = headerHeight + footerHeight + mainPadding + 1;
            var teams = $scope.teams;
            var i = $scope.startFrom;
            while (i < $scope.startFrom + $scope.args.listLimit && i < teams.length) {
               contentHeight += teams[i].detailed ? detailedViewHeight : compactViewHeight;
               i++;
            }
            $scope.setWidgetHeight(contentHeight);
         };

         $scope.init().then(function () {
            $http({
               method: 'GET',
               url: './mockdata.json'
            }).then(function(response) {
               var teams = response.data.tournaments[0].teams;
               var teamsInfo = parseTeamsInfo(teams, $scope.args.numberMatchesPerTeam);
               $scope.teams = teamsInfo;
               $scope.setPages($scope.teams, $scope.args.listLimit);
               $scope.adjustHeight();
            });
         });
      }]);
})($);
