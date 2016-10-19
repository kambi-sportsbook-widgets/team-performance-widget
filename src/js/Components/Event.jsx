import React from 'react';
import { translationModule } from 'widget-core-library';

const Event = ({ event }) => {
   const t = translationModule.getTranslation.bind(translationModule);

   return (
      <div key={event.start} className="l-flexbox l-pack-center l-vertical l-align-center kw-match-box">
         <span className="l-flexbox">{t(event.result)}</span>
         <div className={['l-flexbox', `kw-match-${event.result}`].join(' ')} />
      </div>
   );
};

Event.propTypes = {
   /**
    * Event entity
    */
   event: React.PropTypes.object.isRequired
};

export default Event;
