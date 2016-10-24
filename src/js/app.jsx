import React from 'react';
import ReactDOM from 'react-dom';
import { coreLibrary, widgetModule } from 'widget-core-library';
import TeamPerformanceWidget from './Components/TeamPerformanceWidget';
import store from './Store/store';

coreLibrary.init({
   eventId: null,
   title: 'Form'
})
.then(() => store.getParticipants(coreLibrary.args.eventId))
.then((participants) => {
   ReactDOM.render(
      <TeamPerformanceWidget
         participants={participants}
         title={coreLibrary.args.title}
      />,
      document.getElementById('root')
   );
})
.catch((error) => {
   widgetModule.removeWidget();
   throw error;
});
