var CoreLibrary = (function () {

   'use strict';

   /**
    * CoreLibrary code
    */
   return {
      init: function () {
         return new Promise(function ( resolve, reject ) {
            setTimeout(function () { // "ajax" call
               var apiData = {
                  filter: 'football/england/premier_league/',
                  args: {}
               };
               resolve(apiData);
            }, 100);
         });
      },

      getData: function ( type, filter ) {
         return fetch('mockdata.json').then(function ( response ) {
            return response.json();
         });
      }
   };

})();