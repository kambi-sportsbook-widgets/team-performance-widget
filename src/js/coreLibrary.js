var CoreLibrary = (function () {

   'use strict';

   /**
    * CoreLibrary code
    */
   var Model = Stapes.subclass();

   return {
      init: function () {
         var initModel = new Model();

         setTimeout(function () { // "ajax" call
            var apiData = {
               filter: 'football/england/premier_league/',
               args: {}
            };
            initModel.emit('ready', apiData);
         }, 100);

         return initModel;
      },

      getData: function ( type, filter ) {
         var statisticsModel = new Model();

         var xhr = new XMLHttpRequest();
         xhr.open('GET', 'mockdata.json');
         xhr.send(null);
         xhr.onreadystatechange = function () {
            if ( xhr.readyState === 4 ) {
               if ( xhr.status === 200 ) {
                  statisticsModel.emit('change', JSON.parse(xhr.responseText));
               } else {
                  console.log('Error: ' + xhr.status);
               }
            }
         };
         return statisticsModel;
      }
   };

})();