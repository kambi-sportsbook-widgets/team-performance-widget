import React from 'react'
import PropTypes from 'prop-types'
import { widgetModule } from 'kambi-widget-core-library'
import Main from './Main'
import Summary from './Summary'
import Detailed from './Detailed'

/**
 * A widget to display the performance indicators of teams last matches.
 */
class TeamPerformanceWidget extends React.Component {
  constructor(props) {
    super(props)
    this.resizeTimeout = null
    this.state = {
      expanded: false,
    }
  }

  /**
   * Called before mounting the widget.
   */
  componentDidMount() {
    document.getElementsByTagName('body')[0].style.display = 'block'

    this.adaptHeight()
    window.addEventListener('resize', () => {
      /*
         preventing this code from being called dozens of time due to the
         user changing the screen size by dragging the edges of the browser
         window
         */
      clearTimeout(this.resizeTimeout)
      this.resizeTimeout = setTimeout(this.adaptHeight, 350)
    })
  }

  /**
   * Called after updating component's DOM.
   */
  componentDidUpdate() {
    this.adaptHeight()
  }

  componentWillUnmount() {
    clearTimeout(this.resizeTimeout)
  }

  adaptHeight = () => {
    const { height } = document.body.getBoundingClientRect()
    widgetModule.setWidgetHeight(height)
  }

  /**
   * Handles details expanding.
   * @param {bool} state Expanded state
   */
  expandHandler() {
    this.setState({ expanded: !this.state.expanded })
  }

  /**
   * Creates widget template.
   * @returns {XML}
   */
  render() {
    return (
      <div
        className="KambiWidget-card-background-color"
        onClick={this.expandHandler.bind(this)}
      >
        <Main title={this.props.title}>
          <Summary
            participants={this.props.participants}
            border={this.state.expanded}
          />
          {this.state.expanded ? (
            <Detailed participants={this.props.participants} />
          ) : null}
        </Main>
      </div>
    )
  }
}

TeamPerformanceWidget.propTypes = {
  /**
   * Array of participants entities
   */
  participants: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * Widget's title
   */
  title: PropTypes.string.isRequired,
}

export default TeamPerformanceWidget
