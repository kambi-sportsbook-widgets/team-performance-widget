import React from 'react';
import { widgetModule, translationModule } from 'widget-core-library';
import MatchResult from './MatchResult';
import MatchResultList from './MatchResultList';
import MatchResultIndicator from './MatchResultIndicator';
import MatchResultIndicatorList from './MatchResultIndicatorList';
import TeamPerformanceSummary from './TeamPerformanceSummary';

/**
 *
 * @type {number}
 */
const HEADER_HEIGHT = 56;

/**
 * Collapsed item plus half bottom border
 * @type {number}
 */
const COMPACT_VIEW_TEAM_INFO_HEIGHT = 74 + 6;

/**
 * Table line height + margin bottom
 * @type {number}
 */
const TABLE_LINE_HEIGHT = 24 + 8;

/**
 * A widget to display the performance indicators of teams last matches.
 */
class TeamPerformanceWidget extends React.Component {

   /**
    * Constructs.
    * @param {object} props Widget properties
    */

   constructor(props) {
      super(props);

      widgetModule.enableWidgetTransition(true);

      this.state = {
         detailed: props.teams.map(() => false)
      };
   }

   /**
    * Called before mounting the widget.
    */
   componentWillMount() {
      document.getElementsByTagName('body')[0].style.display = 'block';
      this.adjustHeight();
   }

   /**
    * Called on attributes change.
    * @param {object} nextProps New attributes
    */
   componentWillReceiveProps(nextProps) {
      this.setState({ detailed: nextProps.teams.map(() => false) });
   }

   /**
    * Called after updating component's DOM.
    */
   componentDidUpdate() {
      this.adjustHeight();
   }

   /**
    * Calculates and updates widget height based on actual content.
    */
   adjustHeight() {
      const contentHeight = this.props.teams.reduce((contentHeight, team, i) => {
         return contentHeight
            + COMPACT_VIEW_TEAM_INFO_HEIGHT
            + (this.state.detailed[i] ? team.lastEvents.length * TABLE_LINE_HEIGHT + 20 : 0);
      }, HEADER_HEIGHT + 1);

      widgetModule.setWidgetHeight(contentHeight);
   }

   /**
    * Handles click on details button.
    * @param {number} teamIdx Team index
    * @param {object} event onChange event
    */
   detailsClickHandler(teamIdx, event) {
      this.state.detailed[teamIdx] = event.target.checked;
      this.adjustHeight();
   }

   /**
    * Creates widget template.
    * @returns {XML}
    */
   render() {

      const t = translationModule.getTranslation.bind(translationModule);

      return (
         <div
            className="KambiWidget-card-background-color KambiWidget-card-text-color l-flexbox l-vertical kw-wrapper KambiWidget-card-border-color"
         >
            <header className="KambiWidget-font kw-header l-flexbox l-align-center l-pt-16 l-pb-16 l-pl-16">
               { t(this.props.title) }
            </header>
            <main className="KambiWidget-font l-flexbox l-vertical l-flexed l-pack-start l-mb-12">
               { this.props.teams.map((team, index) =>
                  <TeamPerformanceSummary
                     key={team.id}
                     name={team.name}
                     isExpanded={this.state.detailed[index]}
                     onClick={this.detailsClickHandler}>
                     onClickArguments={index}
                     <MatchResultIndicatorList>
                        {team.lastEvents.map(event => <MatchResultIndicator key={event.start} result={event.result} />)}
                     </MatchResultIndicatorList>
                     <MatchResultList>
                        {team.lastEvents.map(event => <MatchResult
                           key={event.start}
                           homeName={event.homeName}
                           homeScore={event.homeScore}
                           awayName={event.awayName}
                           awayScore={event.awayScore}
                        />)}
                     </MatchResultList>
                  </TeamPerformanceSummary>) }
            </main>
         </div>
      );
   }
}

TeamPerformanceWidget.propTypes = {
   /**
    * Array of team entities
    */
   teams: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
   /**
    * Widget's title
    */
   title: React.PropTypes.string.isRequired
};

export default TeamPerformanceWidget;
