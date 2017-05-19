import React from 'react';
import PropTypes from 'prop-types';
import ParticipantResults from './ParticipantResults';
import EventResult from './EventResult';
import EventResultIndicator from './EventResultIndicator';

const Detailed = ({ participants }) => {
   return (
      <div className='kw-detailed'>
         {
            participants.map(participant =>
               <ParticipantResults key={participant.id} name={participant.name}>
                  {
                     participant.lastEvents.map((event, idx) =>
                        <div key={idx} className='kw-eventresult-container'>
                           <EventResultIndicator result={event.result} />
                           <EventResult
                              key={event.start}
                              homeName={event.homeName}
                              homeScore={event.homeScore}
                              awayName={event.awayName}
                              awayScore={event.awayScore}
                           />
                        </div>
                     )
                  }
               </ParticipantResults>
            )
         }
      </div>
   );
};

Detailed.propTypes = {
   /**
    * The participants
    */
   participants: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Detailed;
