(function () {

   'use strict';

   var vine_supported_languages = [
      'en', 'sv', 'fr', 'de', 'ja', 'nl', 'it', 'es', 'pt', 'pt-PT', 'da', 'fi', 'nb', 'ko',
      'zh-Hans', 'zh-Hant', 'ru', 'pl', 'tr', 'uk', 'ar', 'hr', 'cs', 'el', 'he', 'ro', 'sk', 'th',
      'id', 'ms', 'en-GB', 'ca', 'hu', 'vi', 'en-us'
   ];

   var parseMatchHistoryItem = function(match, teamName) {
      var item = {
         id: match.id,
         date: match.date,
         inHome: match.homeTeam === teamName,
         homeTeam: match.homeTeam,
         awayTeam: match.awayTeam,
         homeScore: match.result.homeScore,
         awayScore: match.result.awayScore,
         result: "lose",
         resultText: "L", //TODO internationalize this value
      };
      var d = item.date;
      var day = d.getUTCDate() +'';
      if (day.length === 1)
         day = '0'+day;

      var month = (d.getUTCMonth()+1) +'';
      if (month.length === 1)
         month = '0'+month;

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
         item.result = "draw";
         item.resultText = "D"; //TODO internationalize this value
      } else if (
         (item.inHome && result.homeScore > result.awayScore) ||
         (!item.inHome && result.awayScore > result.homeScore)
         ) {
         item.result = "win";
         item.resultText = "W";//TODO internationalize this value
      }
      item.tooltipText = "vs " + item.opponentName + " - " + item.teamScore + "x" + item.opponentScore;
      return item;
   };

   // returns true if the item is not already present in the provided matchHistory and
   // the matchHistory length is not bigger than args.numberMatchesPerTeam
   var shouldBeAddedToHistory = function(matchHistory, item, numberMatchesPerTeam) {
      if (matchHistory.length >= numberMatchesPerTeam)
         return false;
      //just making sure that the match is not already in there
      var isInHistory = _.find(matchHistory, function(e) {
         if (item.id === e.id)
            return true;
      });
      if (isInHistory != null)
         return false;
      return true;
   };

   //calculates the performance of the team
   var calculatePerformance = function(matchHistory) {
      let sum = 0;
      matchHistory.forEach(function(m) {
         if (m.result === "win")
            sum += 20;
         else if (m.result === "draw")
            sum += 10
      });
      //TODO check if this calculation is correct
      return sum / (matchHistory.length * 20);
   };

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
            if (a.date.getTime() > b.date.getTime())
               return 1;
            else
               return -1;
         });

         team.matchHistory.forEach(function(match, index) {
            var item = parseMatchHistoryItem(match, team.name);

            if (shouldBeAddedToHistory(matchHistory, item, numberMatchesPerTeam))
               matchHistory.push(item);

            if (item.inHome && shouldBeAddedToHistory(matchHistoryHome, item, numberMatchesPerTeam))
               matchHistoryHome.push(item);

            if ( !item.inHome && shouldBeAddedToHistory(matchHistoryAway, item, numberMatchesPerTeam))
               matchHistoryAway.push(item);
         });

         teamsInfo.push({
            name: team.name,
            performance: calculatePerformance(matchHistory, numberMatchesPerTeam),
            matchHistory: matchHistory,
            matchHistoryHome: matchHistoryHome,
            matchHistoryAway: matchHistoryAway,
         });
      });
      return teamsInfo;
   };

   (function ( $app ) {
      return $app.controller('appController',
         ['$scope', '$controller', '$http', '$sce', 'kambiAPIService', 'kambiWidgetService',
            function ( $scope, $controller, $http, $sce, kambiAPIService, kambiWidgetService ) {

               angular.extend(this, $controller('widgetCoreController', {
                  '$scope': $scope
               }));

               // Default arguments, these will be overridden by the arguments from the widget api
               $scope.defaultArgs = {
                  title: 'Football - Team Performance Indicator',
                  numberMatchesPerTeam: 6,
               };

               // The current height of the widget
               $scope.currentHeight = 450;

               $scope.Math = window.Math; //to be able to use Math functions in the template


               // Call the init method in the coreWidgetController so that we setup everything using our overridden values
               // The init-method returns a promise that resolves when all of the configurations are set, for instance the $scope.args variables
               // so we can call our methods that require parameters from the widget settings after the init method is called
               $scope.init().then(function () {
                  var teams = window.mockdata.tournaments[0].teams;
                  var teamsInfo = parseTeamsInfo(teams);

                  $scope.teams = teamsInfo;
               });

            }]);
   })(angular.module('teamPerformanceWidget'));
})($);
