window.CoreLibrary = (function () {
   'use strict';

   var i18n = {};

   rivets.formatters.translate = function ( value ) {
      if (i18n[value] != null) {
         return i18n[value];
      }
      return value;
   };

   return {
      init: function () {
         return new Promise(function ( resolve, reject ) {
            // TODO fetch the right i18n file based on kambi locale
            var i18nPromise = fetch('i18n/en_GB.json')
               .then(function ( response ) {
                  return response.json();
               })
               .then(function ( response ) {
                  return response;
               });

            var kambiApiPromise = new Promise(function ( resolve, reject ) {
               setTimeout(function () { // "ajax" call
                  var apiData = {
                     filter: 'football/england/premier_league/',
                     args: {}
                  };
                  resolve(apiData);
               }, 100);
            });

            Promise.all([i18nPromise, kambiApiPromise])
               .then(function (results) {
                  i18n = results[0];
                  resolve(results[1]);
               });
         });
      },

      getData: function ( type, filter ) {
         return fetch('mockdata.json').then(function ( response ) {
            return response.json();
         });
      }
   };
})();
