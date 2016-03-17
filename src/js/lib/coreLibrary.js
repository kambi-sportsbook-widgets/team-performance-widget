window.CoreLibrary = (function () {

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

   var i18n = {};

   rivets.formatters.translate = function ( value ) {
      if (i18n[value] != null) {
         return i18n[value];
      }
      return value;
   };

   return {
      widgetModule: null,
      offeringModule: null,
      statisticsModule: null,
      config: {
         oddsFormat: 'decimal',
         apiVersion: 'v2',
         streamingAllowedForPlayer: false
      },
      height: 450,
      pageInfo: {},
      init: function ( setDefaultHeight ) {
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
                        this.applySetupData(mockSetupData, setDefaultHeight);
                        this.fetchTranslations(this.config.clientConfig.locale).then(function () {
                           resolve(this.config);
                        }.bind(this));
                     }.bind(this))
                     .catch(function ( error ) {
                        console.debug('Request failed');
                        console.trace(error);
                        reject();
                     });
               } else {
                  window.KambiWidget.apiReady = function ( api ) {
                     this.widgetModule.api = api;
                     console.debug('API Ready');
                     this.requestSetup(function ( setupData ) {
                        this.applySetupData(setupData, setDefaultHeight);

                        // Request the outcomes from the betslip so we can update our widget, this will also sets up a subscription for future betslip updates
                        this.widgetModule.requestBetslipOutcomes();
                        // Request the odds format that is set in the sportsbook, this also sets up a subscription for future odds format changes
                        this.widgetModule.requestOddsFormat();

                        this.fetchTranslations(this.config.arguments.clientConfig.locale).then(function () {
                           resolve(this.config.arguments);
                        }.bind(this));
                     }.bind(this));
                  }.bind(this);
                  window.KambiWidget.receiveResponse = function ( dataObject ) {
                     this.widgetModule.handleResponse(dataObject);
                  }.bind(this);
               }
            } else {
               console.warn('Kambi widget API not loaded');
               reject();
            }
         }.bind(this));
      },

      fetchTranslations: function ( locale ) {
         if (locale == null) {
            locale = 'en_GB';
         }
         var self = this;
         var promise = new Promise (function ( resolve, reject ) {
            self.getData('i18n/' + locale + '.json')
               .then(function ( response ) {
                  i18n = response;
                  resolve();
               })
               .catch(function ( error ) {
                  if (locale !== 'en_GB') {
                     console.debug('Could not load translations for ' + locale + ' falling back to en_GB');
                     self.fetchTranslations('en_GB').then(resolve).catch(function ( error ) {
                        console.debug('Could not load translations for en_GB');
                        console.trace(error);
                        resolve();
                     });
                  } else {
                     console.debug('Could not load translations for en_GB');
                     console.trace(error);
                     resolve();
                  }
               });
         });
         return promise;
      },

      applySetupData: function ( setupData, setDefaultHeight ) {
         if ( setupData.clientConfig.oddsFormat != null ) {
            this.setOddsFormat(setupData.clientConfig.oddsFormat);
         }

         // Set the configuration in the offering module
         this.offeringModule.setConfig(setupData.clientConfig);

         // Set the configuration in the widget api module
         this.widgetModule.setConfig(setupData.clientConfig);

         // Set page info
         this.setPageInfo(setupData.pageInfo);

         // Set the offering in the API service
         if ( setupData['arguments'] != null && setupData['arguments'].hasOwnProperty('offering') ) {
            this.offeringModule.setOffering(setupData['arguments'].offering);
         } else {
            console.warn('No offering has been set, API requests will not work. Make sure the offering is set in the widget args in your configuration');
         }

         if ( setDefaultHeight === true ) {
            this.setHeight(setupData.height);
         }

         this.config = setupData;
      },

      requestSetup: function ( callback ) {
         this.widgetModule.requestSetup(callback);
      },

      receiveRespone: function ( response ) {
         console.debug(response);
      },

      setOddsFormat: function ( oddsFormat ) {
         this.config.oddsFormat = oddsFormat;
      },

      setHeight: function ( height ) {
         this.height = height;
         this.widgetModule.setHeight(height);
      },

      setPageInfo: function ( pageInfo ) {
         // Check if the last character in the pageParam property is a slash, if not add it so we can use this property in filter requests
         if ( pageInfo.pageType === 'filter' && pageInfo.pageParam.substr(-1) !== '/' ) {
            pageInfo.pageParam += '/';
         }
         this.pageInfo = pageInfo;
      },

      getData: function ( url ) {
         return fetch(url)
            .then(checkStatus)
            .then(parseJSON);
      }
   };

})();
