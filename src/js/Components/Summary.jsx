import React from 'react';
import EventResultIndicator from './EventResultIndicator';
import ParticipantSummary from './ParticipantSummary';
import VersusIcon from './VersusIcon';

const Summary = ({ participants, border }) => {
   const classes = border ? ' KambiWidget-card-inner-border' : '';
   return (
      <div className={'kw-summary' + classes}>
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
   participants: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

   /**
    * Border bool flag
    */
   border: React.PropTypes.booleanValue
};

export default Summary;
