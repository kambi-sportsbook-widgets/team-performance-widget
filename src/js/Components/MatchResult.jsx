import React from 'react';
import { translationModule } from 'widget-core-library';

const MatchResult = (props) => {
   const t = translationModule.getTranslation.bind(translationModule);

   return (
      <div className="kw-table-item l-pl-16 l-pr-16 l-flexbox l-horizontal l-align-center">
         <div data-item-attr="home" className="l-flex-5 l-pr-12 text-truncate">
            {t(props.homeName)}
         </div>
         <div data-item-attr="score" className="l-flex-1 l-flexbox">
            <span className="l-flex-1">{t(props.homeScore)}</span>
            <span className="l-flex-2"> - </span>
            <span className="l-flex-1">{t(props.awayScore)}</span>
         </div>
         <div data-item-attr="away" className="l-flex-5 l-pl-12 text-truncate">
            {t(props.awayName)}
         </div>
      </div>
   );
};

MatchResult.propTypes = {
   /**
    * Event entity
    */
   homeName: React.PropTypes.string.isRequired,
   homeScore: React.PropTypes.number.isRequired,
   awayName: React.PropTypes.string.isRequired,
   awayScore: React.PropTypes.number.isRequired
};

export default MatchResult;
