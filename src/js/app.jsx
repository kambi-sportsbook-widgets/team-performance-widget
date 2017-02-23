import React from 'react';
import ReactDOM from 'react-dom';
import { coreLibrary, widgetModule } from 'kambi-widget-core-library';
import TeamPerformanceWidget from './Components/TeamPerformanceWidget';
import store from './Store/store';

coreLibrary.init({
   eventId: null,
   title: 'Form'
})
.then(() => store.getParticipants(coreLibrary.args.eventId))
.then((participants) => {
   if (
      (participants[0].lastEvents === undefined || participants[0].lastEvents.length === 0)
      &&
      (participants[1].lastEvents === undefined || participants[1].lastEvents.length === 0)
   ) {
      throw new Error('Team Perfomance: Unable to get lastevents for teams')
   }
   ReactDOM.render(
      <TeamPerformanceWidget
         participants={participants}
         title={coreLibrary.args.title}
      />,
      document.getElementById('root')
   );
})
.catch((error) => {
   console.error(error);
   widgetModule.removeWidget();
});
