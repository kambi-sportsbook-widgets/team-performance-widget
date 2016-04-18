(function () {
   'use strict';

   var TeamPerformance = Stapes.subclass({
      constructor: function ( name ) {
         this.scope = {};

         CoreLibrary.init()
            .then(function ( widgetArgs ) {
               this.scope.args = { // default args
                  title: 'Football - Team Performance Indicator',
                  eventId: '1002788429'
               };

               Object.keys(widgetArgs).forEach(function ( key ) {
                  this.scope.args[key] = widgetArgs[key];
               }.bind(this));

               CoreLibrary.widgetModule.enableWidgetTransition(true);

               // Setting the args.eventId as a fallback
               var eventId;
               if ( CoreLibrary.pageInfo.pageParam == null || isNaN(parseInt(CoreLibrary.pageInfo.pageParam, 10)) ) {
                  eventId = this.scope.args.eventId;
                  console.log('Missing pageParam, eventId set from args');
               } else {
                  eventId = CoreLibrary.pageInfo.pageParam;
               }

               CoreLibrary.statisticsModule.getStatistics('tpi', 'event/' + eventId + '/')
                  .then(function ( data ) {
                     console.debug(data);
                     this.scope.teams = [];
                     this.scope.teams.push({
                        name: data.homeParticipant.participantName,
                        detailed: false,
                        lastEvents: this.parseLastEvents(data.homeParticipant.participantId, data.homeParticipant.lastEvents)
                     });
                     this.scope.teams.push({
                        name: data.awayParticipant.participantName,
                        detailed: false,
                        lastEvents: this.parseLastEvents(data.awayParticipant.participantId, data.awayParticipant.lastEvents)
                     });

                     this.scope.teams.forEach(function ( team ) {
                        sightglass(team, 'detailed', this.adjustHeight.bind(this));
                     }.bind(this));
                     this.adjustHeight();
                  }.bind(this))
                  .catch(function ( e ) {
                     // Error loading the statistics, remove the widget
                     CoreLibrary.widgetModule.removeWidget();
                  });

            }.bind(this))
            .catch(function ( error ) {
               console.debug('init error');
               console.trace(error);
            });

         this.view = rivets.bind(document.getElementById('main'), this.scope);

         this.view.binders['box-css-class'] = function ( el, value ) {
            el.classList.add('kw-match-' + value);
         };
      },

      // flattens lastEvents
      parseLastEvents: function ( teamId, lastEvents ) {
         var events = [];
         lastEvents.forEach(function ( event ) {
            if ( event.homeParticipant && event.awayParticipant &&
               event.scores && event.scores.length > 0 ) {
               var result = 'win';
               if ( event.scores[0].homeScore === event.scores[0].awayScore ) {
                  result = 'draw';
               } else if ( event.homeParticipant.participantId === teamId &&
                  event.scores[0].awayScore > event.scores[0].homeScore ) {
                  result = 'lose';
               } else if ( event.awayParticipant.participantId === teamId &&
                  event.scores[0].homeScore > event.scores[0].awayScore ) {
                  result = 'lose';
               }
               events.push({
                  homeName: event.homeParticipant.participantName,
                  awayName: event.awayParticipant.participantName,
                  homeScore: event.scores[0].homeScore,
                  awayScore: event.scores[0].awayScore,
                  result: result
               });
            }
         });
         return events;
      },

      // sets the height of the widget, called when detailed view on teams is opened/closed
      adjustHeight: function () {
         var headerHeight = 40;
         var compactViewTeamInfoHeight = 85;
         var tableLineHeight = 45;

         var contentHeight = headerHeight;

         this.scope.teams.forEach(function ( team ) {
            if ( team.detailed ) {
               contentHeight += compactViewTeamInfoHeight + team.lastEvents.length * tableLineHeight;
            } else {
               contentHeight += compactViewTeamInfoHeight;
            }
         });

         CoreLibrary.widgetModule.setWidgetHeight(contentHeight + 1);
      }
   });

   var teamPerformance = new TeamPerformance();

})();
