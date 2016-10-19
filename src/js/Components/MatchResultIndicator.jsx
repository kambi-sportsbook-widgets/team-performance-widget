import React from 'react';
import { translationModule } from 'widget-core-library';

const MatchResultIndicator = (props) => {
   const t = translationModule.getTranslation.bind(translationModule);

   return (
      <div className="l-flexbox l-pack-center l-vertical l-align-center kw-match-box">
         <span className="l-flexbox">{t(props.result)}</span>
         <div className={['l-flexbox', `kw-match-${props.result}`].join(' ')} />
      </div>
   );
};

MatchResultIndicator.propTypes = {
   /**
    * Status of the match
    */
   result: React.PropTypes.string.isRequired
};

export default MatchResultIndicator;
