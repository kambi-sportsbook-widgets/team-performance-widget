import React from 'react';
import { widgetModule } from 'widget-core-library';
import Header from './Header';
import Main from './Main';
import Summary from './Summary';
import VersusIcon from './VersusIcon';
import ParticipantSummary from './ParticipantSummary';
import EventResultIndicator from './EventResultIndicator';
import Detailed from './Detailed';
import ParticipantResults from './ParticipantResults';
import EventResult from './EventResult';

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
         expanded: false
      };
   }

   /**
    * Called before mounting the widget.
    */
   componentWillMount() {
      document.getElementsByTagName('body')[0].style.display = 'block';
      this.adjustWidgetHeight();
   }

   /**
    * Called after updating component's DOM.
    */
   componentDidUpdate() {
      this.adjustWidgetHeight();
   }

   /**
    * Handles details expanding.
    * @param {bool} state Expanded state
    */
   expandHandler(state) {
      this.setState({ expanded: state });
   }

   /**
    * Recalculates widget height.
    */
   adjustWidgetHeight() {
      let height = Header.HEIGHT + Summary.HEIGHT;

      if (this.state.expanded) {
         height += this.props.participants.reduce((participantResultsHeight, participant) => {
            return participantResultsHeight + ParticipantResults.HEADER_HEIGHT + participant.lastEvents.length * EventResult.HEIGHT;
         }, 0);
      }

      widgetModule.setWidgetHeight(height);
   }

   /**
    * Creates widget template.
    * @returns {XML}
    */
   render() {
      return (
         <div className="KambiWidget-font">
            <Header title={this.props.title} />
            <Main defaultExpanded={this.state.expanded} expandHandler={this.expandHandler.bind(this)}>
               <Summary>
                  { this.props.participants.map((participant, i) => {
                     const nodes = i > 0 ? [<VersusIcon />]
                        : [];

                     return nodes.concat([<ParticipantSummary key={participant.id}>
                        { participant.lastEvents.map(event =>
                           <EventResultIndicator key={event.start} result={event.result} />
                        ) }
                     </ParticipantSummary>]);
                  }) }
               </Summary>
               <Detailed>
                  { this.props.participants.map(participant =>
                     <ParticipantResults key={participant.id} name={participant.name}>
                        { participant.lastEvents.map(event =>
                           <EventResult
                              key={event.start}
                              homeName={event.homeName}
                              homeScore={event.homeScore}
                              awayName={event.awayName}
                              awayScore={event.awayScore}
                           />
                        ) }
                     </ParticipantResults>
                  ) }
               </Detailed>
            </Main>
         </div>
      );
   }
}

TeamPerformanceWidget.propTypes = {
   /**
    * Array of participants entities
    */
   participants: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,

   /**
    * Widget's title
    */
   title: React.PropTypes.string.isRequired
};

export default TeamPerformanceWidget;
