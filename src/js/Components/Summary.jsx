import React from 'react'
import PropTypes from 'prop-types'
import EventResultIndicator from './EventResultIndicator'
import ParticipantSummary from './ParticipantSummary'
import VersusIcon from './VersusIcon'

const Summary = ({ participants, border }) => {
  const classes = border ? ' KambiWidget-card-inner-border' : ''
  return (
    <div className={'kw-summary' + classes}>
      {participants.map((participant, i) => {
        const nodes = i > 0 ? [<VersusIcon />] : []

        return nodes.concat([
          <ParticipantSummary key={participant.id}>
            {participant.lastEvents.map(event => (
              <EventResultIndicator key={event.start} result={event.result} />
            ))}
          </ParticipantSummary>,
        ])
      })}
    </div>
  )
}

Summary.propTypes = {
  /**
   * The participants
   */
  participants: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * Border bool flag
   */
  border: PropTypes.bool,
}

export default Summary
