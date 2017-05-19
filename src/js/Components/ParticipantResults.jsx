import React from 'react';
import PropTypes from 'prop-types';

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
   children: PropTypes.node.isRequired,

   /**
    * Participant name
    */
   name: PropTypes.string.isRequired
};

export default ParticipantResults;
