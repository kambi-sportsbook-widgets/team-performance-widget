var CoreLibrary = (function () {

   'use strict';

   function checkStatus ( response ) {
      if ( response.status >= 200 && response.status < 300 ) {
         return response;
      } else {
         var error = new Error(response.statusText);
         error.response = response;
         throw error;
      }
   }

   function parseJSON ( response ) {
      return response.json();
   }

   var CoreLibrary = {
      api: null,
      config: {},
      init: function () {
         return new Promise(function ( resolve, reject ) {
            if ( window.KambiWidget ) {
               // For development purposes we might want to load a widget on it's own so we check if we are in an iframe, if not then load some fake data
               if ( window.self === window.top ) {
                  console.warn(window.location.host + window.location.pathname + ' is being loaded as stand-alone');
                  fetch('mockSetupData.json')
                     .then(checkStatus)
                     .then(parseJSON)
                     .then(function ( mockSetupData ) {
                        console.debug('Loaded mock setup data');
                        console.debug(mockSetupData);
                        this.applySetupData(mockSetupData);
                        resolve(this.config);
                     }.bind(this))
                     .catch(function ( error ) {
                        console.debug('Request failed:', error);
                        reject();
                     });
               } else {
                  window.KambiWidget.apiReady = function ( api ) {
                     this.api = api;
                     console.debug('API Ready');
                     this.requestSetup(function ( setupData ) {
                        this.applySetupData(setupData);
                        resolve(this.config.arguments);
                     }.bind(this));
                  }.bind(this);
                  window.KambiWidget.receiveResponse = function ( dataObject ) {
                     this.receiveRespone(dataObject);
                  };
               }
            } else {
               console.warn('Kambi widget API not loaded');
               reject();
            }
         }.bind(this));
      },

      applySetupData: function ( setupData ) {
         console.debug(setupData);
         this.config = setupData;
      },

      requestSetup: function ( callback ) {
         this.api.requestSetup(callback);
      },

      receiveRespone: function ( response ) {
         console.debug(response);
      },

      getData: function ( type, filter ) {
         return fetch('mockdata.json').then(function ( response ) {
            return response.json();
         });
      }
   };

   return CoreLibrary;

})();