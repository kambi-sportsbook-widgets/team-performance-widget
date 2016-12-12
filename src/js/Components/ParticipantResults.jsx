import React from 'react';

const ParticipantResults = ({ children, name }) => {
   return (
      <div className='kw-participantresults'>
         <div className='kw-participantresults__header KambiWidget-secondary-header KambiWidget-card-inner-border'>{name}</div>
         {children}
      </div>
   );
};

ParticipantResults.propTypes = {
   /**
    * Inner components
    */
   children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,

   /**
    * Participant name
    */
   name: React.PropTypes.string.isRequired
};

export default ParticipantResults;
