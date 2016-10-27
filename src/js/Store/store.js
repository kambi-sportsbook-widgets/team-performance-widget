import { coreLibrary, statisticsModule } from 'kambi-widget-core-library';

/**
 * Transforms lastEvents into form suitable for template.
 * @param {number} teamId Team identifier
 * @param {object[]} lastEvents Team's last events list
 * @returns {object[]}
 */
const parseLastEvents = function(teamId, lastEvents) {
   return lastEvents
      .reduce((events, event) => {
         let result,
            homeScore,
            awayScore;

         if ( event.homeParticipant && event.awayParticipant &&
            event.scores && event.scores.length > 0 && event.scores[0].hasOwnProperty('homeScore') ) {
            homeScore = event.scores[0].homeScore;
            awayScore = event.scores[0].awayScore;
            result = 'win';
            if ( event.scores[0].homeScore === event.scores[0].awayScore ) {
               result = 'draw';
            } else if ( event.homeParticipant.participantId === teamId &&
               event.scores[0].awayScore > event.scores[0].homeScore ) {
               result = 'lose';
            } else if ( event.awayParticipant.participantId === teamId &&
               event.scores[0].homeScore > event.scores[0].awayScore ) {
               result = 'lose';
            }
         } else if ( event.scores[0].hasOwnProperty('winner') ) {
            result = 'win';
            homeScore = 'win';
            awayScore = 'lose';
            if ( event.scores[0].winner === 'HOME' && event.awayParticipant.participantId === teamId ) {
               result = 'lose';
               homeScore = 'win';
               awayScore = 'lose';
            } else if ( event.scores[0].winner === 'AWAY' && event.awayParticipant.participantId === teamId ) {
               result = 'win';
               homeScore = 'lose';
               awayScore = 'win';
            } else if ( event.scores[0].winner === 'AWAY' && event.homeParticipant.participantId === teamId ) {
               result = 'lose';
               homeScore = 'lose';
               awayScore = 'win';
            }
         }

         if (result) {
            events.push({
               homeName: event.homeParticipant.participantName,
               awayName: event.awayParticipant.participantName,
               homeScore: homeScore,
               awayScore: awayScore,
               result: result,
               start: event.start
            });
         }

         return events;
      }, []);
};

/**
 * Fetches participants information from external service.
 * @param {number} eventId Event identifier
 * @returns {Promise.<object[]>}
 */
const getParticipants = function(eventId) {
   if (!eventId) {
      console.warn('eventId set from pageParam');
      eventId = coreLibrary.pageInfo.pageParam;
   } else {
      console.warn('eventId set from args.eventId');
   }

   return statisticsModule.getTeamPerformanceStatistics(eventId)
      .then((data) => {
         return [
            {
               id: data.homeParticipant.participantId,
               name: data.homeParticipant.participantName,
               lastEvents: parseLastEvents(data.homeParticipant.participantId, data.homeParticipant.lastEvents)
            },
            {
               id: data.awayParticipant.participantId,
               name: data.awayParticipant.participantName,
               lastEvents: parseLastEvents(data.awayParticipant.participantId, data.awayParticipant.lastEvents)
            }
         ];
      });
};

export default { getParticipants };
