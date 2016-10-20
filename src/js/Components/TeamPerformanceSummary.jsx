import React from 'react';
import { translationModule } from 'widget-core-library';

const TeamPerformanceSummary = (props) => {
   const t = translationModule.getTranslation.bind(translationModule);

   return (
      <div className="l-flexbox l-vertical kw-team-wrapper">
         <input className="kw-accordion" type="checkbox" defaultChecked={props.isExpanded} onChange={props.onClick} />
         <div className="l-flexbox l-horizontal l-pl-16 l-pr-16 l-align-center">
            <div className="kw-title l-flex-1 KambiWidget-card-text-color text-truncate">{t(props.name)}</div>
            <i className="l-flexbox icon-angle-down kw-expand-icon" />
         </div>
         { props.children }
      </div>
   );
};

TeamPerformanceSummary.defaultProps = {
   isExpanded: false
};

TeamPerformanceSummary.propTypes = {
   /**
    * Name of team
    */
   name: React.PropTypes.string.isRequired,

   /**
    * Show teams last matches
    */
   isExpanded: React.PropTypes.bool,

   /**
    * Called on toggling detailed mode
    */
   onClick: React.PropTypes.func.isRequired,

   /**
    * Array of Events/DetailedEvents components
    */
   children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
};

export default TeamPerformanceSummary;
