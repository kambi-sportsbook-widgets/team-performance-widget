import React from 'react';

const ParticipantResults = ({ children, name }) => {
   return (
      <div className="kw-participantresults">
         <div className="kw-participantresults__header">{name}</div>
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

ParticipantResults.HEADER_HEIGHT = 50;

export default ParticipantResults;
