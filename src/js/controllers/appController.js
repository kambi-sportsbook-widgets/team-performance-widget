(function () {

   'use strict';

   var vine_supported_languages = [
      'en', 'sv', 'fr', 'de', 'ja', 'nl', 'it', 'es', 'pt', 'pt-PT', 'da', 'fi', 'nb', 'ko',
      'zh-Hans', 'zh-Hant', 'ru', 'pl', 'tr', 'uk', 'ar', 'hr', 'cs', 'el', 'he', 'ro', 'sk', 'th',
      'id', 'ms', 'en-GB', 'ca', 'hu', 'vi', 'en-us'
   ];

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



               // Call the init method in the coreWidgetController so that we setup everything using our overridden values
               // The init-method returns a promise that resolves when all of the configurations are set, for instance the $scope.args variables
               // so we can call our methods that require parameters from the widget settings after the init method is called
               $scope.init().then(function () {
                  var teams = window.mockdata.tournaments[0].teams;
                  var teamsInfo = [];
                  teams.forEach(function(team) {
                     var matchHistory= [];

                     //sorting by date descending
                     team.matchHistory.sort(function(a, b) {
                        //TODO check if parsing is done correctly
                        var aDate = new Date(a.date);
                        var bDate = new Date(b.date);
                        if (aDate.getTime() > bDate.getTime())
                           return 1;
                        else
                           return -1;
                     });

                     team.matchHistory.forEach(function(match, index) {
                        if (matchHistory.length >= $scope.args.numberMatchesPerTeam)
                           return;
                        var isInHistory = _.find(matchHistory, function(e) {
                           if (match.id === e.id)
                              return true;
                        });
                        if (isInHistory == null) {
                           var item = {
                              id: match.id,
                              date: match.date,
                              inHome: match.homeTeam === team.name,
                              homeTeam: match.homeTeam,
                              awayTeam: match.awayTeam,
                              result: "lose",
                              resultText: "L", //TODO internationalize this value
                           };
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

                           matchHistory.push(item)
                        }
                     });
                     teamsInfo.push({
                        name: team.name,
                        performance: 0.8,
                        matchHistory: matchHistory,
                     });
                  });

                  $scope.teams = teamsInfo;
               });

            }]);
   })(angular.module('teamPerformanceWidget'));
})($);
