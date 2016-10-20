import React from 'react';
import ReactDOM from 'react-dom';
import { coreLibrary, widgetModule } from 'widget-core-library';
import TeamPerformanceWidget from './Components/TeamPerformanceWidget';
import store from './Store/store';

coreLibrary.init({
   eventId: 1003589914,
   title: ''
})
.then(() => store.getTeams(coreLibrary.args.eventId))
.then((teams) => {
   console.log(teams);
   ReactDOM.render(
      <TeamPerformanceWidget
         teams={teams}
         title={coreLibrary.args.title}
      />,
      document.getElementById('root')
   );
})
.catch((error) => {
   console.error(error);
   widgetModule.removeWidget();
});
