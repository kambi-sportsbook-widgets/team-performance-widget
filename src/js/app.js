(function () {
   'use strict';

   var parseMatchHistoryItem = function ( match, teamName ) {
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
      var day = d.getUTCDate() + '';
      if ( day.length === 1 ) {
         day = '0' + day;
      }

      var month = (d.getUTCMonth() + 1) + '';
      if ( month.length === 1 ) {
         month = '0' + month;
      }

      item.dateText = day + '/' + month + '/' + d.getUTCFullYear();

      var result = match.result; // TODO can match.result be null? if so special handling is required

      if ( item.inHome ) {
         item.teamScore = result.homeScore;
         item.opponentScore = result.awayScore;
         item.opponentName = match.awayTeam;
      } else {
         item.teamScore = result.awayScore;
         item.opponentScore = result.homeScore;
         item.opponentName = match.homeTeam;
      }

      if ( result.homeScore === result.awayScore ) {
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

   // Returns true if the item is not already present in the provided matchHistory and
   // the matchHistory length is not bigger than args.numberMatchesPerTeam
   var shouldBeAddedToHistory = function ( matchHistory, item, numberMatchesPerTeam ) {
      if ( matchHistory.length >= numberMatchesPerTeam ) {
         return false;
      }
      // Just making sure that the match is not already in there
      var isInHistory = matchHistory.filter(function ( e ) {
            return item.id === e.id;
         }).length > 0;

      if ( isInHistory ) {
         return false;
      }
      return true;
   };

   // Calculates the performance of the team
   var calculatePerformance = function ( matchHistory ) {
      var sum = 0;
      matchHistory.forEach(function ( m ) {
         if ( m.result === 'win' ) {
            sum += 20;
         } else if ( m.result === 'draw' ) {
            sum += 10;
         }
      });
      // TODO check if this calculation is correct
      return sum / (matchHistory.length * 20);
   };

   // Parses the data provided considering only the first numberMatchesPerTeam matches
   var parseTeamsInfo = function ( teams, numberMatchesPerTeam ) {
      var teamsInfo = [];
      teams.forEach(function ( team ) {
         var matchHistory = [];
         var matchHistoryHome = [];
         var matchHistoryAway = [];

         // Parsing date strings
         team.matchHistory.forEach(function ( match, index ) {
            // TODO check if parsing is done correctly
            match.date = new Date(match.date);
         });

         // Sorting by date descending
         team.matchHistory.sort(function ( a, b ) {
            if ( a.date.getTime() > b.date.getTime() ) {
               return 1;
            } else {
               return -1;
            }
         });

         team.matchHistory.forEach(function ( match, index ) {
            var item = parseMatchHistoryItem(match, team.name);

            if ( shouldBeAddedToHistory(matchHistory, item, numberMatchesPerTeam) ) {
               matchHistory.push(item);
            }

            if ( item.inHome && shouldBeAddedToHistory(matchHistoryHome, item, numberMatchesPerTeam) ) {
               matchHistoryHome.push(item);
            }

            if ( !item.inHome && shouldBeAddedToHistory(matchHistoryAway, item, numberMatchesPerTeam) ) {
               matchHistoryAway.push(item);
            }
         });

         teamsInfo.push({
            name: team.name,
            performance: calculatePerformance(matchHistory),
            detailed: false, // Controls if detailed information is visible
            matchHistory: matchHistory,
            matchHistoryHome: matchHistoryHome,
            matchHistoryAway: matchHistoryAway
         });
      });
      return teamsInfo;
   };

   var TeamPerformance = Stapes.subclass({
      constructor: function ( name ) {
         this.scope = {};

         CoreLibrary.init()
            .then(function ( widgetArgs ) {
               this.scope.args = Object.assign({
                  title: 'Football - Team Performance Indicator',
                  numberMatchesPerTeam: 6 // Maximum number of matches to show per team
               }, widgetArgs );

               CoreLibrary.getData('mockdata.json').then(function ( data ) {
                  this.scope.teams = parseTeamsInfo(data.tournaments[0].teams, this.scope.numberMatchesPerTeam);
                  this.scope.teams.forEach(function (team) {
                     sightglass(team, 'detailed', this.adjustHeight.bind(this));
                  }.bind(this));
                  this.adjustHeight();
               }.bind(this));

            }.bind(this))
            .catch(function ( error ) {
               console.debug('init error');
               console.trace(error);
            });

         this.view = rivets.bind(document.getElementById('main'), this.scope);
         this.view.binders['box-css-class'] = this.boxCssClass;
      },

      boxCssClass: function ( el, value ) {
         el.classList.add('kw-match-' + value);
      },

      adjustHeight: function () {
         // TODO maybe try to dinamically get these values?
         // might not be possible to get detailedViewHeight due to the accordion animation
         var headerHeight = 40;
         var compactViewTeamInfoHeight = 85;
         var tableLineHeight = 45;

         var contentHeight = headerHeight;

         this.scope.teams.forEach(function (team) {
            if (team.detailed) {
               contentHeight += compactViewTeamInfoHeight + team.matchHistory.length * tableLineHeight;
            } else {
               contentHeight += compactViewTeamInfoHeight;
            }
         });

         CoreLibrary.widgetModule.setWidgetHeight(contentHeight + 1);
      }
   });

   var teamPerformance = new TeamPerformance();

})();
