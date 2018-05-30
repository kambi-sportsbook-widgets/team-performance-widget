import React from 'react'
import ReactDOM from 'react-dom'
import {
  coreLibrary,
  widgetModule,
  translationModule,
} from 'kambi-widget-core-library'
import TeamPerformanceWidget from './Components/TeamPerformanceWidget'
import store from './Store/store'

coreLibrary
  .init({
    eventId: null,
    title: null,
  })
  /**
   * FOR TESTING
   */
  // .then(
  //   () =>
  //     (coreLibrary.config.apiStatisticsBaseUrl =
  //       'https://e1-api.kambi.com/statistics/api/')
  // )
  .then(() => store.getParticipants(coreLibrary.args.eventId))
  .then(participants => {
    if (
      (participants[0].lastEvents === undefined ||
        participants[0].lastEvents.length === 0) &&
      (participants[1].lastEvents === undefined ||
        participants[1].lastEvents.length === 0)
    ) {
      throw new Error('Team Perfomance: Unable to get lastevents for teams')
    }
    let title = coreLibrary.args.title
    if (title === null) {
      title = translationModule.getTranslation('Form')
    }
    ReactDOM.render(
      <TeamPerformanceWidget participants={participants} title={title} />,
      coreLibrary.rootElement
    )
  })
  .catch(error => {
    console.error(error)
    widgetModule.removeWidget()
  })
