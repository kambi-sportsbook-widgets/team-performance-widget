import React from 'react'
import PropTypes from 'prop-types'

const ParticipantSummary = ({ children }) => {
  return <div className="kw-participantsummary">{children}</div>
}

ParticipantSummary.propTypes = {
  /**
   * Inner components
   */
  children: PropTypes.node.isRequired,
}

export default ParticipantSummary
