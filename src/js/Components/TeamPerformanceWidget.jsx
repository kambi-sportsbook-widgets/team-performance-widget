import React from 'react';
import { widgetModule } from 'kambi-widget-core-library';
import Header from './Header';
import Main from './Main';
import Summary from './Summary';
import Detailed from './Detailed';
import ParticipantResults from './ParticipantResults';
import EventResult from './EventResult';

/**
 * A widget to display the performance indicators of teams last matches.
 */
class TeamPerformanceWidget extends React.Component {

   constructor(props) {
      super(props);
      this.resizeTimeout = null;
      this.state = {
         expanded: false
      };
   }

   /**
    * Called before mounting the widget.
    */
   componentDidMount() {
      document.getElementsByTagName('body')[0].style.display = 'block';
      const adaptHeight = () => {
         widgetModule.adaptWidgetHeight();
      };
      adaptHeight();
      window.addEventListener('resize', () => {
         /*
         preventing this code from being called dozens of time due to the
         user changing the screen size by dragging the edges of the browser
         window
         */
         clearTimeout(this.resizeTimeout);
         this.resizeTimeout = setTimeout(adaptHeight, 350);
      });
   }

   /**
    * Called after updating component's DOM.
    */
   componentDidUpdate() {
      widgetModule.adaptWidgetHeight();
      setTimeout(() => {
         widgetModule.adaptWidgetHeight();
      }, 300);
   }

   componentWillUnmount() {
      clearTimeout(this.resizeTimeout);
   }

   /**
    * Handles details expanding.
    * @param {bool} state Expanded state
    */
   expandHandler(state) {
      this.setState({ expanded: !this.state.expanded });
   }

   /**
    * Creates widget template.
    * @returns {XML}
    */
   render() {
      return (
         <div className='KambiWidget-card-background-color' onClick={this.expandHandler.bind(this)}>
            <Main
               title={this.props.title}
            >
               <Summary participants={this.props.participants} border={this.state.expanded} />
               {
                  this.state.expanded ?
                     <Detailed participants={this.props.participants} />
                  :
                     null
               }
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
