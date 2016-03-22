(function () {
   'use strict';

   var parseMatchHistoryItem = function ( match, teamName ) {
      var item = {
         id: match.id,
         date: match.date,
         inHome: match.homeTeam === teamName,
         homeTeam: match.homeTeam,
         awayTeam: match.awayTeam,
         homeScore: match.result.homeScore,
         awayScore: match.result.awayScore,
         result: 'lose'
      };
      var d = item.date;
      var day = d.getUTCDate() + '';
      if ( day.length === 1 ) {
         day = '0' + day;
      }

      var month = (d.getUTCMonth() + 1) + '';
      if ( month.length === 1 ) {
         month = '0' + month;
      }

      item.dateText = day + '/' + month + '/' + d.getUTCFullYear();

      var result = match.result; // TODO can match.result be null? if so special handling is required

      if ( item.inHome ) {
         item.teamScore = result.homeScore;
         item.opponentScore = result.awayScore;
         item.opponentName = match.awayTeam;
      } else {
         item.teamScore = result.awayScore;
         item.opponentScore = result.homeScore;
         item.opponentName = match.homeTeam;
      }

      if ( result.homeScore === result.awayScore ) {
         item.result = 'draw';
      } else if (
         (item.inHome && result.homeScore > result.awayScore) ||
         (!item.inHome && result.awayScore > result.homeScore)
      ) {
         item.result = 'win';
      }
      item.tooltipText = 'vs ' + item.opponentName + ' - ' + item.teamScore + 'x' + item.opponentScore;
      return item;
   };

   // Returns true if the item is not already present in the provided matchHistory and
   // the matchHistory length is not bigger than args.numberMatchesPerTeam
   var shouldBeAddedToHistory = function ( matchHistory, item, numberMatchesPerTeam ) {
      if ( matchHistory.length >= numberMatchesPerTeam ) {
         return false;
      }
      // Just making sure that the match is not already in there
      var isInHistory = matchHistory.filter(function ( e ) {
            return item.id === e.id;
         }).length > 0;

      if ( isInHistory ) {
         return false;
      }
      return true;
   };

   // Calculates the performance of the team
   var calculatePerformance = function ( matchHistory ) {
      var sum = 0;
      matchHistory.forEach(function ( m ) {
         if ( m.result === 'win' ) {
            sum += 20;
         } else if ( m.result === 'draw' ) {
            sum += 10;
         }
      });
      // TODO check if this calculation is correct
      return sum / (matchHistory.length * 20);
   };

   // Parses the data provided considering only the first numberMatchesPerTeam matches
   var parseTeamsInfo = function ( teams, numberMatchesPerTeam ) {
      var teamsInfo = [];
      teams.forEach(function ( team ) {
         var matchHistory = [];
         var matchHistoryHome = [];
         var matchHistoryAway = [];

         // Parsing date strings
         team.matchHistory.forEach(function ( match, index ) {
            // TODO check if parsing is done correctly
            match.date = new Date(match.date);
         });

         // Sorting by date descending
         team.matchHistory.sort(function ( a, b ) {
            if ( a.date.getTime() > b.date.getTime() ) {
               return 1;
            } else {
               return -1;
            }
         });

         team.matchHistory.forEach(function ( match, index ) {
            var item = parseMatchHistoryItem(match, team.name);

            if ( shouldBeAddedToHistory(matchHistory, item, numberMatchesPerTeam) ) {
               matchHistory.push(item);
            }

            if ( item.inHome && shouldBeAddedToHistory(matchHistoryHome, item, numberMatchesPerTeam) ) {
               matchHistoryHome.push(item);
            }

            if ( !item.inHome && shouldBeAddedToHistory(matchHistoryAway, item, numberMatchesPerTeam) ) {
               matchHistoryAway.push(item);
            }
         });

         teamsInfo.push({
            name: team.name,
            performance: calculatePerformance(matchHistory),
            detailed: false, // Controls if detailed information is visible
            matchHistory: matchHistory,
            matchHistoryHome: matchHistoryHome,
            matchHistoryAway: matchHistoryAway
         });
      });
      return teamsInfo;
   };

   var TeamPerformance = Stapes.subclass({
      constructor: function ( name ) {
         this.scope = {};

         CoreLibrary.init()
            .then(function ( widgetArgs ) {
               this.scope.args = { // default args
                  title: 'Football - Team Performance Indicator',
                  numberMatchesPerTeam: 6 // Maximum number of matches to show per team
               };

               Object.keys(widgetArgs).forEach(function ( key ) {
                  this.scope.args[key] = widgetArgs[key];
               }.bind(this));

               CoreLibrary.widgetModule.enableWidgetTransition(true);

               CoreLibrary.getData('mockdata.json').then(function ( data ) {
                  this.scope.teams = parseTeamsInfo(data.tournaments[0].teams, this.scope.numberMatchesPerTeam);
                  this.scope.teams.forEach(function ( team ) {
                     sightglass(team, 'detailed', this.adjustHeight.bind(this));
                  }.bind(this));
                  this.adjustHeight();
               }.bind(this));

            }.bind(this))
            .catch(function ( error ) {
               void 0;
               void 0;
            });

         this.view = rivets.bind(document.getElementById('main'), this.scope);
         this.view.binders['box-css-class'] = this.boxCssClass;
      },

      boxCssClass: function ( el, value ) {
         el.classList.add('kw-match-' + value);
      },

      adjustHeight: function () {
         // TODO maybe try to dinamically get these values?
         // might not be possible to get detailedViewHeight due to the accordion animation
         var headerHeight = 40;
         var compactViewTeamInfoHeight = 85;
         var tableLineHeight = 45;

         var contentHeight = headerHeight;

         this.scope.teams.forEach(function ( team ) {
            if ( team.detailed ) {
               contentHeight += compactViewTeamInfoHeight + team.matchHistory.length * tableLineHeight;
            } else {
               contentHeight += compactViewTeamInfoHeight;
            }
         });

         CoreLibrary.widgetModule.setWidgetHeight(contentHeight + 1);
      }
   });

   var teamPerformance = new TeamPerformance();

})();

window.CoreLibrary = (function () {

   'use strict';
   /**
    * Checks the HTTP status of a response
    */
   function checkStatus ( response ) {
      if ( response.status >= 200 && response.status < 300 ) {
         return response;
      } else {
         var error = new Error(response.statusText);
         error.response = response;
         throw error;
      }
   }

   /**
    * Parses the response as json
    */
   function parseJSON ( response ) {
      return response.json();
   }

   sightglass.adapters = rivets.adapters;
   sightglass.root = '.';

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
                  void 0;
                  // Load the mock config data
                  fetch('mockSetupData.json')
                     .then(checkStatus)
                     .then(parseJSON)
                     .then(function ( mockSetupData ) {
                        // Output some debug info that could be helpful
                        void 0;
                        void 0;
                        // Apply the mock config data to the core
                        this.applySetupData(mockSetupData, setDefaultHeight);
                        if (this.translationModule != null) {
                           this.translationModule.fetchTranslations(mockSetupData.clientConfig.locale).then(function () {
                              resolve(mockSetupData['arguments']);
                           }.bind(this));
                        } else {
                           resolve(mockSetupData['arguments']);
                        }
                     }.bind(this))
                     .catch(function ( error ) {
                        void 0;
                        void 0;
                        reject();
                     });
               } else {
                  window.KambiWidget.apiReady = function ( api ) {
                     this.widgetModule.api = api;
                     // Request the setup info from the widget api
                     this.requestSetup(function ( setupData ) {
                        // Apply the config data to the core
                        this.applySetupData(setupData, setDefaultHeight);

                        // TODO: Move this to widgets so we don't request them when not needed
                        // Request the outcomes from the betslip so we can update our widget, this will also sets up a subscription for future betslip updates
                        this.widgetModule.requestBetslipOutcomes();
                        // Request the odds format that is set in the sportsbook, this also sets up a subscription for future odds format changes
                        this.widgetModule.requestOddsFormat();

                        if (this.translationModule != null) {
                           this.translationModule.fetchTranslations(setupData.clientConfig.locale).then(function () {
                              resolve(setupData['arguments']);
                           }.bind(this));
                        } else {
                           resolve(setupData['arguments']);
                        }
                     }.bind(this));
                  }.bind(this);
                  // Setup the response handler for the widget api
                  window.KambiWidget.receiveResponse = function ( dataObject ) {
                     this.widgetModule.handleResponse(dataObject);
                  }.bind(this);
               }
            } else {
               void 0;
               reject();
            }
         }.bind(this));
      },

      applySetupData: function ( setupData, setDefaultHeight ) {
         // Set the odds format
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
            void 0;
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
         void 0;
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
            .then(parseJSON)
            .catch(function ( error ) {
               void 0;
               void 0;
            });
      }
   };

})();

CoreLibrary.offeringModule = (function () {
   'use strict';

   return {
      config: {
         apiBaseUrl: null,
         apiUrl: null,
         channelId: null,
         currency: null,
         locale: null,
         market: null,
         offering: null,
         clientId: null,
         version: null,
         routeRoot: '',
         auth: false,
         device: null
      },
      setConfig: function ( config ) {
         // Iterate over the passed object properties, if the exist in the predefined config object then we set them
         for ( var i in config ) {
            if ( config.hasOwnProperty(i) && this.config.hasOwnProperty(i) ) {
               this.config[i] = config[i];
               switch ( i ) {
                  case 'locale':
                     // TODO: deal with locale setting
                     break;
               }
            }
         }
      },
      setOffering: function ( offering ) {
         this.config.offering = offering;
      },
      getGroupEvents: function ( groupId ) {
         var requesPath = '/event/group/' + groupId + '.json';
         return this.doRequest(requesPath);
      },
      getEventsByFilter: function ( filter, params ) {
         // Todo: Update this method once documentation is available
         var requestPath = '/listView/' + filter;
         return this.doRequest(requestPath, params, 'v3');
      },
      getLiveEvents: function () {
         var requestPath = '/event/live/open.json';
         return this.doRequest(requestPath);
      },
      doRequest: function ( requestPath, params, version ) {
         if ( this.config.offering == null ) {
            void 0;
         } else {
            var apiUrl = this.config.apiBaseUrl.replace('{apiVersion}', (version != null ? version : this.config.version));
            var requestUrl = apiUrl + this.config.offering + requestPath;
            var overrideParams = params || {};
            var requestParams = {
               lang: overrideParams.locale || this.config.locale,
               market: overrideParams.market || this.config.market,
               client_id: overrideParams.clientId || this.config.clientId,
               include: overrideParams.include || null
            };
            requestUrl += '?' + Object.keys(requestParams).map(function ( k ) {
                  return encodeURIComponent(k) + '=' + encodeURIComponent(requestParams[k]);
               }).join('&');

            return CoreLibrary.getData(requestUrl);
         }
      }
   };
})();
CoreLibrary.statisticsModule = (function () {
   'use strict';

   return {
      getStatistics: function ( type, filter ) {
         // Remove url parameters from filter
         filter = filter.match(/[^?]*/)[0];
         // Remove trailing slash
         filter = filter.slice(0, -1);
         var baseApiUrl = 'https://api.kambi.com/statistics/api/';
         void 0;
         return CoreLibrary.getData(baseApiUrl + CoreLibrary.config.offering + '/' + type + '/' + filter + '.json');
      }
   };
})();
window.CoreLibrary.translationModule = (function () {
   'use strict';

   var translationModule = {
      i18nStrings: {},

      fetchTranslations: function ( locale ) {
         if ( locale == null ) {
            locale = 'en_GB';
         }
         var self = this;
         return new Promise(function ( resolve, reject ) {
            self.getData('i18n/' + locale + '.json')
               .then(function ( response ) {
                  translationModule.i18nStrings = response;
                  resolve();
               })
               .catch(function ( error ) {
                  if ( locale !== 'en_GB' ) {
                     void 0;
                     self.fetchTranslations('en_GB').then(resolve);
                  } else {
                     void 0;
                     void 0;
                     resolve();
                  }
               });
         });
      }
   };

   rivets.formatters.translate = function ( value ) {
      if ( translationModule.i18nStrings[value] != null ) {
         return translationModule.i18nStrings[value];
      }
      return value;
   };

   return translationModule;
})();

CoreLibrary.widgetModule = (function () {
   'use strict';

   var Module = Stapes.subclass();

   return {
      api: { // placeholders for when not running inside iframe
         requestSetup: function () {},
         request: function () {},
         set: function () {},
         remove: function () {}
      },
      events: new Module(),
      config: {
         routeRoot: '',
         auth: false,
         device: null
      },
      setConfig: function ( config ) {
         for ( var i in config ) {
            if ( config.hasOwnProperty(i) && this.config.hasOwnProperty(i) ) {
               this.config[i] = config[i];
            }
         }
         // Make sure that the routeRoot is not null or undefined
         if ( this.config.routeRoot == null ) {
            this.config.routeRoot = '';
         } else if ( this.config.routeRoot.length > 0 && this.config.routeRoot.slice(-1) !== '/' ) {
            // If the routeRoot is not empty we need to make sure it has a trailing slash
            this.config.routeRoot += '/';
         }
      },
      handleResponse: function ( response ) {
         switch ( response.type ) {
            case this.api.WIDGET_HEIGHT:
               // We've received a height response
               this.events.emit('WIDGET:HEIGHT', response.data);
               break;
            case this.api.BETSLIP_OUTCOMES:
               // We've received a response with the outcomes currently in the betslip
               this.events.emit('OUTCOMES:UPDATE', response.data);
               break;
            case this.api.WIDGET_ARGS:
               // We've received a response with the arguments set in the
               this.events.emit('WIDGET:ARGS', response.data);
               break;
            case this.api.PAGE_INFO:
               // Received page info response
               this.events.emit('PAGE:INFO', response.data);
               break;
            case this.api.CLIENT_ODDS_FORMAT:
               // Received odds format response
               this.events.emit('ODDS:FORMAT', response.data);
               break;
            case this.api.CLIENT_CONFIG:
               this.events.emit('CLIENT:CONFIG', response.data);
               break;
            case this.api.USER_LOGGED_IN:
               void 0;
               this.events.emit('USER:LOGGED_IN', response.data);
               break;
            case 'Setup':
               this.events.emit('Setup response', response.data);
               break;
            default:
               // Unhandled response
               void 0;
               void 0;
               break;
         }
      },
      requestSetup: function ( callback ) {
         this.api.requestSetup(callback);
      },

      requestWidgetHeight: function () {
         this.api.request(this.api.WIDGET_HEIGHT);
      },

      setWidgetHeight: function ( height ) {
         this.api.set(this.api.WIDGET_HEIGHT, height);
      },

      enableWidgetTransition: function ( enableTransition ) {
         if ( enableTransition ) {
            this.api.set(this.api.WIDGET_ENABLE_TRANSITION);
         } else {
            this.api.set(this.api.WIDGET_DISABLE_TRANSITION);
         }
      },

      removeWidget: function () {
         this.api.remove();
      },

      navigateToLiveEvent: function ( eventId ) {
         this.navigateClient('event/live/' + eventId);
      },

      navigateToEvent: function ( eventId ) {
         this.navigateClient('event/' + eventId);
      },

      navigateToFilter: function ( filterParams ) {
         this.navigateClient(filterParams);
      },

      navigateToLiveEvents: function () {
         this.navigateClient(['in-play']);
      },

      addOutcomeToBetslip: function ( outcomes, stakes, updateMode, source ) {
         var arrOutcomes = [];
         // Check if the outcomes parameter is an array and add it, otherwise add the the single value as an array
         if ( outcomes.isArray() ) {
            arrOutcomes = outcomes;
         } else {
            arrOutcomes.push(outcomes);
         }

         // Setup the data object to be sent to the widget API
         var data = {
            outcomes: arrOutcomes
         };

         // Check if we got any stakes passed to use, add them to the data object if so
         if ( stakes != null ) {
            if ( stakes.isArray() ) {
               data.stakes = stakes;
            } else {
               data.stakes = [stakes];
            }
         }

         // Set the coupon type, defaults to TYPE_SINGLE
         data.couponType = arrOutcomes.length === 1 ? this.api.BETSLIP_OUTCOMES_ARGS.TYPE_SINGLE : this.api.BETSLIP_OUTCOMES_ARGS.TYPE_COMBINATION;

         // Set the update mode, defaults to UPDATE_APPEND
         data.updateMode = updateMode !== 'replace' ? this.api.BETSLIP_OUTCOMES_ARGS.UPDATE_APPEND : this.api.BETSLIP_OUTCOMES_ARGS.UPDATE_REPLACE;
         if ( source != null ) {
            data.source = source;
         }

         // Send the data to the widget this.api
         this.api.set(this.api.BETSLIP_OUTCOMES, data);
      },

      removeOutcomeFromBetslip: function ( outcomes ) {
         var arrOutcomes = [];
         if ( outcomes.isArray() ) {
            arrOutcomes = outcomes;
         } else {
            arrOutcomes.push(outcomes);
         }
         this.api.set(this.api.BETSLIP_OUTCOMES_REMOVE, { outcomes: arrOutcomes });
      },

      requestBetslipOutcomes: function () {
         this.api.request(this.api.BETSLIP_OUTCOMES);
      },

      requestPageInfo: function () {
         this.api.request(this.api.PAGE_INFO);
      },

      requestWidgetArgs: function () {
         this.api.request(this.api.WIDGET_ARGS);
      },

      requestClientConfig: function () {
         this.api.request(this.api.CLIENT_CONFIG);
      },

      requestOddsFormat: function () {
         this.api.request(this.api.CLIENT_ODDS_FORMAT);
      },

      requestOddsAsAmerican: function ( odds ) {
         return new Promise(function ( resolve, reject ) {
            this.api.requestOddsAsAmerican(odds, function ( americanOdds ) {
               resolve(americanOdds);
            });
         }.bind(this));
      },

      requestOddsAsFractional: function ( odds ) {
         return new Promise(function ( resolve, reject ) {
            this.api.requestOddsAsFractional(odds, function ( fractionalOdds ) {
               resolve(fractionalOdds);
            });
         });
      },

      navigateClient: function ( destination ) {
         if ( typeof destination === 'string' ) {
            this.api.navigateClient('#' + this.config.routeRoot + destination);
         } else if ( destination.isArray() ) {
            var filter = this.api.createFilterUrl(destination, this.config.routeRoot);
            this.api.navigateClient(filter);
         }
      }
   };
})();
