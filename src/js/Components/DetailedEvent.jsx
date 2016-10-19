import React from 'react';
import { translationModule } from 'widget-core-library';

const DetailedEvent = ({ event }) => {
   const t = translationModule.getTranslation.bind(translationModule);

   return (
      <div className="kw-table-item l-pl-16 l-pr-16 l-flexbox l-horizontal l-align-center">
         <div data-item-attr="home" className="l-flex-5 l-pr-12 text-truncate">
            {t(event.homeName)}
         </div>
         <div data-item-attr="score" className="l-flex-1 l-flexbox">
            <span className="l-flex-1">{t(event.homeScore)}</span>
            <span className="l-flex-2"> - </span>
            <span className="l-flex-1">{t(event.awayScore)}</span>
         </div>
         <div data-item-attr="away" className="l-flex-5 l-pl-12 text-truncate">
            {t(event.awayName)}
         </div>
      </div>
   );
};

DetailedEvent.propTypes = {
   /**
    * Event entity
    */
   event: React.PropTypes.object.isRequired
};

export default DetailedEvent;
