import React from 'react';
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
                        <div className='kw-eventresult-container'>
                           <EventResultIndicator key={idx} result={event.result} />
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
   participants: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

export default Detailed;
