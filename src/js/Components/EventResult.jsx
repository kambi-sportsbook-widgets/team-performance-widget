import React from 'react';

const EventResult = ({ homeName, homeScore, awayName, awayScore }) => {
   return (
      <div className="kw-eventresult">
         <div className="kw-eventresult__participant KambiWidget-card-text-color">
            <div className="kw-eventresult__participant__name">{homeName}</div>
            <div className="kw-eventresult__participant__score">{homeScore}</div>
         </div>
         <div className="kw-eventresult__participant KambiWidget-card-support-text-color">
            <div className="kw-eventresult__participant__name">{awayName}</div>
            <div className="kw-eventresult__participant__score">{awayScore}</div>
         </div>
      </div>
   );
};

EventResult.propTypes = {
   /**
    * Home participant name
    */
   homeName: React.PropTypes.string.isRequired,

   /**
    * Home participant score
    */
   homeScore: React.PropTypes.number.isRequired,

   /**
    * Away participant name
    */
   awayName: React.PropTypes.string.isRequired,

   /**
    * Away participant score
    */
   awayScore: React.PropTypes.number.isRequired
};

EventResult.HEIGHT = 69;

export default EventResult;
