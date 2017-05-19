import React from 'react';
import PropTypes from 'prop-types';
import { translationModule } from 'kambi-widget-core-library';

const EventResultIndicator = ({ result }) => {
   const t = translationModule.getTranslation.bind(translationModule);

   return <div className={`kw-eventresultindicator KambiWidget-box--${result}`}>{t(result)}</div>;
};

EventResultIndicator.propTypes = {
   /**
    * Result of the event
    */
   result: PropTypes.string.isRequired
};

export default EventResultIndicator;
