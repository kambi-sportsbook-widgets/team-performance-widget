import React from 'react';
import { translationModule } from 'widget-core-library';

const Team = ({ children, team, clickHandler }) => {
   const t = translationModule.getTranslation.bind(translationModule);

   return (
      <div key={team.id} className="l-flexbox l-vertical kw-team-wrapper">
         <input className="kw-accordion" type="checkbox" defaultChecked={team.detailed} onChange={clickHandler} />
         <div className="l-flexbox l-horizontal l-pl-16 l-pr-16 l-align-center">
            <div className="kw-title l-flex-1 KambiWidget-card-text-color text-truncate">{t(team.name)}</div>
            <i className="l-flexbox icon-angle-down kw-expand-icon" />
         </div>
         {children}
      </div>
   );
};

Team.propTypes = {
   team: React.PropTypes.object.isRequired,
   clickHandler: React.PropTypes.func.isRequired,
   children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
};

export default Team;
