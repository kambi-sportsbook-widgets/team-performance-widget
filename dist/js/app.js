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

         CoreLibrary.init().then(function ( config ) {
            this.scope.args = Object.assign({
               title: 'Football - Team Performance Indicator',
               numberMatchesPerTeam: 6, // Maximum number of matches to show per team
               listLimit: 3 // Set the list limit value to be used for pagination)
            }, config.arguments);
            CoreLibrary.getData('mockdata.json').then(function ( data ) {
               this.scope.teams = parseTeamsInfo(data.tournaments[0].teams, this.scope.numberMatchesPerTeam);
            }.bind(this));
         }.bind(this));

         this.view = rivets.bind(document.getElementById('main'), this.scope);
         this.view.binders['box-css-class'] = this.boxCssClass;
      },

      boxCssClass: function ( el, value ) {
         el.classList.add('kw-match-' + value);
      }
   });

   var teamPerformance = new TeamPerformance();

})();

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
                  void 0;
                  fetch('mockSetupData.json')
                     .then(checkStatus)
                     .then(parseJSON)
                     .then(function ( mockSetupData ) {
                        void 0;
                        void 0;
                        this.applySetupData(mockSetupData, setDefaultHeight);
                        this.fetchTranslations(this.config.clientConfig.locale).then(function () {
                           resolve(this.config);
                        }.bind(this));
                     }.bind(this))
                     .catch(function ( error ) {
                        void 0;
                        void 0;
                        reject();
                     });
               } else {
                  window.KambiWidget.apiReady = function ( api ) {
                     this.widgetModule.api = api;
                     void 0;
                     this.requestSetup(function ( setupData ) {
                        this.applySetupData(setupData, setDefaultHeight);
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
               void 0;
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
                     void 0;
                     self.fetchTranslations('en_GB').then(resolve).catch(function ( error ) {
                        void 0;
                        void 0;
                        resolve();
                     });
                  } else {
                     void 0;
                     void 0;
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
         if ( setupData.arguments != null && setupData.arguments.hasOwnProperty('offering') ) {
            this.offeringModule.setOffering(setupData.arguments.offering);
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
            .then(parseJSON);
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
CoreLibrary.widgetModule = (function () {
   'use strict';

   return {
      api: null,
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
               void 0;
               break;
            case this.api.BETSLIP_OUTCOMES:
               // We've received a response with the outcomes currently in the betslip
               void 0;
               break;
            case this.api.WIDGET_ARGS:
               // We've received a response with the arguments set in the
               void 0;
               break;
            case this.api.PAGE_INFO:
               // Received page info response
               void 0;
               break;
            case this.api.CLIENT_ODDS_FORMAT:
               // Received odds format response
               void 0;
               break;
            case this.api.CLIENT_CONFIG:
               void 0;
               break;
            case this.api.USER_LOGGED_IN:
               void 0;
               void 0;
               break;
            case 'Setup':
               void 0;
               break;
            default:
               // Unhandled response
               void 0;
               void 0;
               void 0;
               break;
         }
      },
      requestSetup: function ( callback ) {
         this.api.requestSetup(callback);
      }
   };
})();