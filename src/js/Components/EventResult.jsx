import React from 'react';

const EventResult = ({ homeName, homeScore, awayName, awayScore }) => {
   let homeClasses = 'kw-eventresult__participant';
   let awayClasses = 'kw-eventresult__participant';
   if (homeScore > awayScore) {
      homeClasses += ' KambiWidget-card-text-color';
      awayClasses += ' KambiWidget-card-support-text-color';
   } else if (awayScore > homeScore) {
      homeClasses += ' KambiWidget-card-support-text-color';
      awayClasses += ' KambiWidget-card-text-color';
   } else {
      homeClasses += ' KambiWidget-card-support-text-color';
      awayClasses += ' KambiWidget-card-support-text-color';
   }
   return (
      <div className='kw-eventresult'>
         <div className={homeClasses}>
            <div className='kw-eventresult__participant__name'>{homeName}</div>
            <div className='kw-eventresult__participant__score'>{homeScore}</div>
         </div>
         <div className={awayClasses}>
            <div className='kw-eventresult__participant__name'>{awayName}</div>
            <div className='kw-eventresult__participant__score'>{awayScore}</div>
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

export default EventResult;
