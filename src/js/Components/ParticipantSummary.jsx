import React from 'react';

const ParticipantSummary = ({ children }) => {
   return (
      <div className='kw-participantsummary'>
         { children }
      </div>
   );
};

ParticipantSummary.propTypes = {
   /**
    * Inner components
    */
   children: React.PropTypes.node.isRequired,
};

export default ParticipantSummary;
