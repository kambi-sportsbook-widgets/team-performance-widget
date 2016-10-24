import React from 'react';
import { translationModule } from 'widget-core-library';

const EventResultIndicator = ({ result }) => {
   const t = translationModule.getTranslation.bind(translationModule);

   return <div className={`kw-eventresultindicator kw-eventresultindicator--${result}`}>{t(result)}</div>;
};

EventResultIndicator.propTypes = {
   /**
    * Result of the event
    */
   result: React.PropTypes.string.isRequired
};

export default EventResultIndicator;
