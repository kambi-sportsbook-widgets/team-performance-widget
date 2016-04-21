(function () {
   'use strict';

   var TeamPerformance = CoreLibrary.Component.subclass({
      defaultArgs: {
         title: 'Football - Team Performance Indicator'
      },

      constructor: function () {
         CoreLibrary.Component.apply(this, arguments);
      },

      init: function () {
         CoreLibrary.widgetModule.enableWidgetTransition(true);

         // Setting the pageParam as a fallback
         var eventId;
         if ( this.scope.args.eventId != null ) {
            eventId = this.scope.args.eventId;
            void 0;
         } else {
            eventId = CoreLibrary.pageInfo.pageParam;
            void 0;
         }
         CoreLibrary.statisticsModule.getStatistics('tpi', 'event/' + eventId + '/')
            .then(function ( data ) {
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
               this.scope.onLoad = 'block';
            }.bind(this))
            .catch(function ( e ) {
               // Error loading the statistics, remove the widget
               CoreLibrary.widgetModule.removeWidget();
            });

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
         var headerHeight = 56;
         var compactViewTeamInfoHeight = 74 + 6; // collapsed item plus half bottom border
         var tableLineHeight = 24 + 8; // line-height + margin bottom

         var contentHeight = headerHeight;

         this.scope.teams.forEach(function ( team ) {
            if ( team.detailed === true ) {
               contentHeight += compactViewTeamInfoHeight + team.lastEvents.length * tableLineHeight;
            } else {
               contentHeight += compactViewTeamInfoHeight;
            }
         });

         CoreLibrary.widgetModule.setWidgetHeight(contentHeight + 1);
      }
   });

   var teamPerformance = new TeamPerformance({
      rootElement: 'body'
   });

})();
