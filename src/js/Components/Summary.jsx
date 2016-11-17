import React from 'react';
import EventResultIndicator from './EventResultIndicator';
import ParticipantSummary from './ParticipantSummary';
import VersusIcon from './VersusIcon';

const Summary = ({ participants }) => {
   return (
      <div className='kw-summary'>
         {
            participants.map((participant, i) => {
               const nodes = i > 0 ? [<VersusIcon />]
                  : [];

               return nodes.concat([<ParticipantSummary key={participant.id}>
                  {
                     participant.lastEvents.map(event =>
                        <EventResultIndicator key={event.start} result={event.result} />
                     )
                  }
               </ParticipantSummary>]);
            })
         }
      </div>
   );
};

Summary.propTypes = {
   /**
    * The participants
    */
   participants: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

export default Summary;
