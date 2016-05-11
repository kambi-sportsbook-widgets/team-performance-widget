'use strict';

window.CoreLibrary = function () {
   'use strict';

   /** Rivets formatters **/

   rivets.formatters['==='] = function (v1, v2) {
      return v1 === v2;
   };
   rivets.formatters['=='] = function (v1, v2) {
      return v1 == v2; // jshint ignore:line
   };
   rivets.formatters['>='] = function (v1, v2) {
      return v1 >= v2;
   };
   rivets.formatters['>'] = function (v1, v2) {
      return v1 > v2;
   };
   rivets.formatters['<='] = function (v1, v2) {
      return v1 <= v2;
   };
   rivets.formatters['<'] = function (v1, v2) {
      return v1 < v2;
   };
   rivets.formatters['!='] = function (v1, v2) {
      return v1 != v2; // jshint ignore:line
   };
   rivets.formatters['!=='] = function (v1, v2) {
      return v1 !== v2;
   };
   rivets.formatters['and'] = function (v1, v2) {
      return v1 && v2;
   };
   rivets.formatters['or'] = function (v1, v2) {
      return v1 || v2;
   };
   rivets.formatters['not'] = function (v1) {
      return !v1;
   };
   rivets.formatters['-'] = function (v1, v2) {
      return v1 - v2;
   };
   rivets.formatters['+'] = function (v1, v2) {
      return v1 + v2;
   };
   rivets.formatters['*'] = function (v1, v2) {
      return v1 * v2;
   };
   rivets.formatters['/'] = function (v1, v2) {
      return v1 / v2;
   };
   rivets.formatters['?'] = function (v1, v2) {
      return v1 ? v1 : v2;
   };

   /**
    * Returns specified object at specified key for specified array index
    * @param arr The source array
    * @param index The desired index from given array
    * @param key The desired key of the object to be returned
    * @returns {*}
    */
   rivets.formatters.array_at = function (arr, index, key) {
      return arr == null ? [] : arr[index][key];
   };

   /**
    * Returns an array of objects where each objects contains key and value properties based on the passed array
    * @param {Object} obj The source object
    * @returns {Array}
    */
   rivets.formatters.property_list = function (obj) {
      return function () {
         var properties = [];
         for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
               properties.push({ key: key, value: obj[key] });
            }
         }
         return properties;
      }();
   };

   /**
    * Custom style binder
    * @param el
    * @param value
    */
   rivets.binders['style-*'] = function (el, value) {
      el.style.setProperty(this.args[0], value);
   };

   /**
    * Cloaking waits for element to bind and then sets it visible
    * @type {{priority: number, bind: rivets.binders.cloak.bind}}
    */
   rivets.binders.cloak = {
      priority: -1000,
      bind: function bind(el) {
         el.style.opacity = 1;
      }
   };

   /**
    * Binder that adds animation class
    *
    * Used in DOM as <div rv-anim-stagger="index"></div>
    *
    * @param el DOM element to apply classes
    * @param index List item index
    */
   rivets.binders['anim-stagger'] = function (el, index) {
      if (index < 0) {
         return false;
      }
      var speed = 70;
      el.classList.remove('anim-stagger');
      el.classList.add('anim-stagger');
      setTimeout(function () {
         el.classList.add('anim-enter-active');
         setTimeout(function () {
            el.classList.remove('anim-stagger');
            el.classList.remove('anim-enter-active');
         }, 200);
      }, speed * index);
   };

   /**
    * Binder to toggle a custom class based on the passed property, picks up the class name form the "rv-toggle-class" attribute
    *
    * Used in DOM as <div rv-custom-class="myBoolean" rv-toggle-class="myCustomClass" ></div>
    *
    * @param el DOM element to apply class to
    * @param property The property to check
    */
   rivets.binders['custom-class'] = function (el, property) {
      var cssClass = el.getAttribute('rv-toggle-class');

      if (property === true) {
         el.classList.add(cssClass);
      } else {
         el.classList.remove(cssClass);
      }
   };

   /**
    * Checks the HTTP status of a response
    */
   function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
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
   function parseJSON(response) {
      return response.json();
   }

   sightglass.adapters = rivets.adapters;
   sightglass.root = '.';

   return {
      expectedApiVersion: '1.0.0.10', // this value is replaced with the API version number during the compilation step
      development: false,
      utilModule: null,
      widgetModule: null,
      offeringModule: null,
      statisticsModule: null,
      apiReady: false, // this value is set to true once the kambi API has finished loaded
      config: {
         apiBaseUrl: '',
         auth: false,
         channelId: 1,
         currency: '',
         customer: '',
         device: 'desktop',
         locale: 'en_GB',
         market: 'GB',
         oddsFormat: 'decimal',
         offering: '',
         routeRoot: '',
         streamingAllowedForPlayer: true,
         client_id: 2,
         version: 'v2'
      },
      height: 450,
      pageInfo: {
         leaguePaths: [],
         pageParam: '',
         pageTrackingPath: '',
         pageType: ''
      },
      apiVersions: {
         client: '',
         libs: '',
         wapi: ''
      },
      args: {},
      init: function init(setDefaultHeight) {
         return new Promise(function (resolve, reject) {
            if (window.KambiWidget) {
               // For development purposes we might want to load a widget on it's own so we check if we are in an iframe, if not then load some fake data
               if (window.self === window.top) {
                  void 0;
                  // Load the mock config data
                  fetch('mockSetupData.json').then(checkStatus).then(parseJSON).then(function (mockSetupData) {
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
                  }.bind(this)).catch(function (error) {
                     void 0;
                     void 0;
                     reject();
                  });
               } else {
                  window.KambiWidget.apiReady = function (api) {
                     this.widgetModule.api = api;
                     if (api.VERSION !== this.expectedApiVersion) {
                        void 0;
                     }

                     // Request the setup info from the widget api
                     this.requestSetup(function (setupData) {
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
                  window.KambiWidget.receiveResponse = function (dataObject) {
                     this.widgetModule.handleResponse(dataObject);
                  }.bind(this);
               }
            } else {
               void 0;
               reject();
            }
         }.bind(this));
      },

      applySetupData: function applySetupData(setupData, setDefaultHeight) {

         // Set the configuration
         this.setConfig(setupData.clientConfig);

         // Set page info
         this.setPageInfo(setupData.pageInfo);

         this.setVersions(setupData.versions);

         if (setDefaultHeight === true) {
            this.setHeight(setupData.height);
         }
         this.apiReady = true;
      },

      setConfig: function setConfig(config) {
         for (var i in config) {
            if (config.hasOwnProperty(i) && this.config.hasOwnProperty(i)) {
               this.config[i] = config[i];
            }
         }
         // Make sure that the routeRoot is not null or undefined
         if (this.config.routeRoot == null) {
            this.config.routeRoot = '';
         } else if (this.config.routeRoot.length > 0 && this.config.routeRoot.slice(-1) !== '/') {
            // If the routeRoot is not empty we need to make sure it has a trailing slash
            this.config.routeRoot += '/';
         }
      },

      setPageInfo: function setPageInfo(pageInfo) {
         // Check if the last character in the pageParam property is a slash, if not add it so we can use this property in filter requests
         if (pageInfo.pageType === 'filter' && pageInfo.pageParam.substr(-1) !== '/') {
            pageInfo.pageParam += '/';
         }
         this.pageInfo = pageInfo;
      },

      setVersions: function setVersions(versions) {
         for (var i in versions) {
            if (versions.hasOwnProperty(i) && this.apiVersions.hasOwnProperty(i)) {
               this.apiVersions[i] = versions[i];
            }
         }
      },

      setArgs: function setArgs(args) {
         this.args = args;
      },

      requestSetup: function requestSetup(callback) {
         this.widgetModule.requestSetup(callback);
      },

      receiveRespone: function receiveRespone(response) {
         void 0;
      },

      setOddsFormat: function setOddsFormat(oddsFormat) {
         this.config.oddsFormat = oddsFormat;
      },

      setHeight: function setHeight(height) {
         this.height = height;
         this.widgetModule.setHeight(height);
      },

      getData: function getData(url) {
         return fetch(url).then(checkStatus).then(parseJSON).catch(function (error) {
            void 0;
            void 0;
            throw error;
         });
      },

      getFile: function getFile(url) {
         return fetch(url).then(checkStatus).catch(function (error) {
            void 0;
            void 0;
            throw error;
         });
      }
   };
}();
//# sourceMappingURL=coreLibrary.js.map

'use strict';

(function () {
   CoreLibrary.Component = Stapes.subclass({
      /** object with default values from args if they are not present in
       * the Kambi API provided ones
       */
      defaultArgs: {},

      /**
       * If string this value is appended to rootElement with the innerHTML DOM call
       * essentially parsing the the text as HTML
       */
      htmlTemplate: null,

      /**
       * Same as htmlTemplate, but uses this value as a path to fetch an HTML file
       * Do not use at the same time as htmlTemplate
       */
      htmlTemplateFile: null,

      constructor: function constructor(options) {
         var _this = this;

         /** object to be used in the HTML templates for data binding */
         this.scope = {};

         /**
          * Rivets view object, binds this.scope to this.rootElement
          */
         this.view = null;

         /**
          * HTML element to in which rivets.bind will be called,
          * if string uses document.querySelector to get the element
          */
         this.rootElement = null;

         if (options == null) {
            options = {};
         }
         // setting options that can be received in the constructor
         var optionsKeys = ['defaultArgs', 'rootElement'];
         optionsKeys.forEach(function (key) {
            if (typeof options[key] !== 'undefined') {
               _this[key] = options[key];
            }
         });

         if (typeof this.htmlTemplate === 'string' && typeof this.htmlTemplateFile === 'string') {
            throw new Error('Widget can not have htmlTemplate and htmlTemplateFile set at the same time');
         }
         if (this.rootElement == null) {
            throw new Error('options.rootElement not set, please pass a HTMLElement or a CSS selector');
         }

         this.scope.args = this.defaultArgs;

         var fetchHtmlPromise;
         if (typeof this.htmlTemplateFile === 'string') {
            fetchHtmlPromise = CoreLibrary.getFile(this.htmlTemplateFile).then(function (response) {
               return response.text();
            }).then(function (html) {
               _this.htmlTemplate = html;
               return _this.htmlTemplate;
            });
         } else {
            // just resolve the promise
            fetchHtmlPromise = new Promise(function (resolve) {
               resolve();
            });
         }

         var coreLibraryPromise;
         if (CoreLibrary.apiReady === true) {
            coreLibraryPromise = new Promise(function (resolve, reject) {
               resolve();
            });
         } else {
            coreLibraryPromise = new Promise(function (resolve, reject) {
               CoreLibrary.init().then(function (widgetArgs) {
                  Object.keys(widgetArgs).forEach(function (key) {
                     _this.scope.args[key] = widgetArgs[key];
                  });

                  var apiVersion = CoreLibrary.widgetModule.api.VERSION;
                  if (apiVersion == null) {
                     var apiVersion = '1.0.0.10';
                  }
                  _this.scope.widgetCss = '//c3-static.kambi.com/sb-mobileclient/widget-api/' + apiVersion + '/resources/css/' + CoreLibrary.config.customer + '/' + CoreLibrary.config.offering + '/widgets.css';
                  resolve();
               });
            });
         }

         // fetches the component HTML in parallel with the Kambi API setup request
         // decreasing load time
         return Promise.all([coreLibraryPromise, fetchHtmlPromise]).then(function () {
            if (typeof _this.rootElement === 'string') {
               _this.rootElement = document.querySelector(_this.rootElement);
            }

            for (var i = 0; i < _this.rootElement.attributes.length; ++i) {
               var at = _this.rootElement.attributes[i];
               if (at.name.indexOf('data-') === 0) {
                  var name = at.name.slice(5); // removes the 'data-' from the string
                  _this.scope[name] = at.value;
               }
            }

            if (typeof _this.htmlTemplate === 'string') {
               _this.rootElement.innerHTML = _this.htmlTemplate;
            }

            _this.view = rivets.bind(_this.rootElement, _this.scope);

            _this.init();
         });
      }
   });
})();
//# sourceMappingURL=Component.js.map

'use strict';

CoreLibrary.offeringModule = function () {
   'use strict';

   return {
      getGroupEvents: function getGroupEvents(groupId) {
         var requesPath = '/event/group/' + groupId + '.json';
         return this.doRequest(requesPath);
      },
      getEventsByFilter: function getEventsByFilter(filter, params) {
         // Todo: Update this method once documentation is available
         var requestPath = '/listView/' + filter;
         return this.doRequest(requestPath, params, 'v3');
      },
      getLiveEvents: function getLiveEvents() {
         var requestPath = '/event/live/open.json';
         return this.doRequest(requestPath);
      },
      getLiveEventsByFilter: function getLiveEventsByFilter(filter) {
         var _this = this;

         // Todo: implement a filter request when the offering API supports it
         filter = filter.replace(/\/$/, '');

         var filterTerms = filter.split('/');
         filterTerms = filterTerms.slice(0, 3);

         var requestPath = '/listView/all/all/all/all/in-play/';

         var liveEventsPromise = new Promise(function (resolve, reject) {
            _this.doRequest(requestPath, null, 'v3').then(function (response) {
               var result = {
                  events: []
               },
                   i = 0,
                   len = response.events.length;
               for (; i < len; ++i) {
                  var j = 0,
                      termLen = response.events[i].event.path.length,
                      addEvent = true;
                  if (termLen > filterTerms.length) {
                     termLen = filterTerms.length;
                  }
                  for (; j < termLen; ++j) {
                     if (filterTerms[j] !== 'all' && response.events[i].event.path[j].termKey !== filterTerms[j]) {
                        addEvent = false;
                     }
                  }
                  if (addEvent) {
                     result.events.push(response.events[i]);
                  }
               }
               resolve(result);
            });
         });

         return liveEventsPromise;
      },
      doRequest: function doRequest(requestPath, params, version) {
         if (CoreLibrary.config.offering == null) {
            void 0;
         } else {
            var apiUrl = CoreLibrary.config.apiBaseUrl.replace('{apiVersion}', version != null ? version : CoreLibrary.config.version);
            var requestUrl = apiUrl + CoreLibrary.config.offering + requestPath;
            var overrideParams = params || {};
            var requestParams = {
               lang: overrideParams.locale || CoreLibrary.config.locale,
               market: overrideParams.market || CoreLibrary.config.market,
               client_id: overrideParams.client_id || CoreLibrary.config.client_id,
               include: overrideParams.include || '',
               betOffers: overrideParams.betOffers || 'COMBINED',
               categoryGroup: overrideParams.categoryGroup || 'COMBINED',
               displayDefault: overrideParams.displayDefault || true
            };
            requestUrl += '?' + Object.keys(requestParams).map(function (k) {
               return encodeURIComponent(k) + '=' + encodeURIComponent(requestParams[k]);
            }).join('&');

            return CoreLibrary.getData(requestUrl);
         }
      }
   };
}();
//# sourceMappingURL=offeringModule.js.map

'use strict';

CoreLibrary.statisticsModule = function () {
   'use strict';

   return {
      config: {
         baseApiUrl: 'https://api.kambi.com/statistics/api/'
      },
      getStatistics: function getStatistics(type, filter) {
         // Remove url parameters from filter
         filter = filter.match(/[^?]*/)[0];

         // Remove trailing slash if present
         if (filter[filter.length - 1] === '/') {
            filter = filter.slice(0, -1);
         }

         void 0;
         return CoreLibrary.getData(this.config.baseApiUrl + CoreLibrary.config.offering + '/' + type + '/' + filter + '.json');
      }
   };
}();
//# sourceMappingURL=statisticsModule.js.map

'use strict';

window.CoreLibrary.translationModule = function () {
   'use strict';

   var translationModule = {
      i18nStrings: {},

      fetchTranslations: function fetchTranslations(locale) {
         if (locale == null) {
            locale = 'en_GB';
         }
         var self = this;
         var path = 'i18n/';
         if (CoreLibrary.development === true) {
            path = 'transpiled/i18n/';
         }
         return new Promise(function (resolve, reject) {
            window.CoreLibrary.getData(path + locale + '.json').then(function (response) {
               translationModule.i18nStrings = response;
               resolve();
            }).catch(function (error) {
               if (locale !== 'en_GB') {
                  void 0;
                  self.fetchTranslations('en_GB').then(resolve);
               } else {
                  void 0;
                  void 0;
                  resolve();
               }
            });
         });
      },
      getTranslation: function getTranslation(key) {
         if (this.i18nStrings[key] != null) {
            return this.i18nStrings[key];
         }
         return key;
      }
   };

   rivets.formatters.translate = function (value) {
      return translationModule.getTranslation(value);
   };

   return translationModule;
}();
//# sourceMappingURL=translationModule.js.map

'use strict';

window.CoreLibrary.utilModule = function () {
   'use strict';

   var utilModule = {
      diffArray: function diffArray(A, B) {
         var map = {},
             C = [];

         for (var i = B.length; i--;) {
            map[B[i]] = null;
         } // any other value would do

         for (var i = A.length; i--;) {
            if (!map.hasOwnProperty(A[i])) {
               C.push(A[i]);
            }
         }

         return C;
      },
      getOutcomeLabel: function getOutcomeLabel(outcome, event) {
         switch (outcome.type) {
            case 'OT_ONE':
               // Outcome has label 1. Applies to Threeway bet offers.
               return event.homeName;
            case 'OT_CROSS':
               // Outcome has label X. Applies to Threeway bet offers.
               // Todo: Translation
               return CoreLibrary.translationModule.getTranslation('draw');
            case 'OT_TWO':
               // Outcome has label 2. Applies to Threeway bet offers.
               return event.awayName;
            // Todo: Impelement these responses with translations

            // case 'OT_OVER': //The “Over” outcome in Over/Under bet offer.
            // break;
            // case 'OT_UNDER': //The “Under” outcome in Over/Under bet offer.
            // break;
            // case 'OT_ODD': //The “Odd” outcome in Odd/Even bet offer.
            // break;
            // case 'OT_EVEN': //The “Even” outcome in Odd/Even bet offer.
            // break;
            // case 'OT_ONE_ONE': //1-1 outcome in Halftime/fulltime bet offer.
            // break;
            // case 'OT_ONE_TWO': //1-2 outcome in Halftime/fulltime bet offer.
            // break;
            // case 'OT_ONE_CROSS': //1-X outcome in Halftime/fulltime bet offer.
            // break;
            // case 'OT_TWO_ONE': //2-1 outcome in Halftime/fulltime bet offer.
            // break;
            // case 'OT_TWO_TWO': //2-2 outcome in Halftime/fulltime bet offer.
            // break;
            // case 'OT_TWO_CROSS': //2-X outcome in Halftime/fulltime bet offer.
            // break;
            // case 'OT_CROSS_ONE': //X-1 outcome in Halftime/fulltime bet offer.
            // break;
            // case 'OT_CROSS_TWO': //X-2 outcome in Halftime/fulltime bet offer.
            // break;
            // case 'OT_CROSS_CROSS': //X-X outcome in Halftime/fulltime bet offer.
            // break;
            // case 'OT_ONE_OR_TWO': //1 or 2 outcome in Double Chance bet offer.
            // break;
            // case 'OT_ONE_OR_CROSS': //1 or X outcome in Double Chance bet offer.
            // break;
            // case 'OT_CROSS_OR_TWO': //X or 2 outcome in Double Chance bet offer.
            // break;
            // case 'OT_YES': //“Yes” outcome in Head To Head and Yes/No bet offer.
            // break;
            // case 'OT_NO': //“No” outcome in Head To Head and Yes/No bet offer.
            // break;
            // case 'OT_OTHER': //“Other results” outcome in Result bet offer.
            // break;
            // case 'OT_UNTYPED': //Outcome does not have type.
            // break;
            // case 'OT_WC_HOME': //Outcome has label Home Win. Applies to WinCast bet offers.
            // break;
            // case 'OT_WC_DRAW': //Outcome has label Draw. Applies to WinCast bet offers.
            // break;
            // case 'OT_WC_AWAY': //Outcome has label Away Win. Applies to WinCast bet offers.
            // break;

            default:
               void 0;
               return outcome.label;
         }
      }
   };

   return utilModule;
}();
//# sourceMappingURL=utilModule.js.map

'use strict';

CoreLibrary.widgetModule = function () {

   var Module = Stapes.subclass();

   return {
      api: { // placeholders for when not running inside iframe
         requestSetup: function requestSetup() {},
         request: function request() {},
         set: function set() {},
         remove: function remove() {},
         createUrl: function createUrl() {}
      },
      events: new Module(),
      betslipIds: [],
      handleResponse: function handleResponse(response) {
         switch (response.type) {
            case this.api.WIDGET_HEIGHT:
               // We've received a height response
               this.events.emit('WIDGET:HEIGHT', response.data);
               break;
            case this.api.BETSLIP_OUTCOMES:
               // We've received a response with the outcomes currently in the betslip

               var i = 0,
                   len = response.data.outcomes.length;
               var updateIds = [];
               // Gather all the ids in the betslip in one array
               for (; i < len; ++i) {
                  updateIds.push(response.data.outcomes[i].id);
               }
               // Diff against what the coreLibrary already has stored so we know what was added and what was removed
               var removedIds = CoreLibrary.utilModule.diffArray(this.betslipIds, updateIds);
               var addedIds = CoreLibrary.utilModule.diffArray(updateIds, this.betslipIds);
               // Save the updated ids
               this.betslipIds = updateIds;

               // Emit events for each removed id
               i = 0;
               len = removedIds.length;
               for (; i < len; ++i) {
                  this.events.emit('OUTCOME:REMOVED:' + removedIds[i]);
               }

               // Emit events for each added id
               i = 0;
               len = addedIds.length;
               for (; i < len; ++i) {
                  this.events.emit('OUTCOME:ADDED:' + addedIds[i]);
               }

               // Emit a generic update in case we want to use that
               this.events.emit('OUTCOMES:UPDATE', response.data);
               break;
            case this.api.WIDGET_ARGS:
               // We've received a response with the arguments set in the
               CoreLibrary.setArgs(response.data);
               this.events.emit('WIDGET:ARGS', response.data);
               break;
            case this.api.PAGE_INFO:
               // Received page info response
               CoreLibrary.setPageInfo(response.data);
               this.events.emit('PAGE:INFO', response.data);
               break;
            case this.api.CLIENT_ODDS_FORMAT:
               // Received odds format response
               CoreLibrary.setOddsFormat(response.data);
               this.events.emit('ODDS:FORMAT', response.data);
               break;
            case this.api.CLIENT_CONFIG:
               CoreLibrary.setConfig(response.data);
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

      createUrl: function createUrl(path, optionalRoot) {
         return this.api.createUrl(path, optionalRoot);
      },

      getPageType: function getPageType() {
         if (!CoreLibrary.pageInfo.pageType) {
            return '';
         }
         var pageType = CoreLibrary.pageInfo.pageType;
         switch (pageType) {
            case 'event':
               return '';
            case 'event-live':
               return 'live/';
            default:
               void 0;
               break;
         }
      },

      requestSetup: function requestSetup(callback) {
         this.api.requestSetup(callback);
      },

      requestWidgetHeight: function requestWidgetHeight() {
         this.api.request(this.api.WIDGET_HEIGHT);
      },

      setWidgetHeight: function setWidgetHeight(height) {
         this.api.set(this.api.WIDGET_HEIGHT, height);
      },

      enableWidgetTransition: function enableWidgetTransition(enableTransition) {
         if (enableTransition) {
            this.api.set(this.api.WIDGET_ENABLE_TRANSITION);
         } else {
            this.api.set(this.api.WIDGET_DISABLE_TRANSITION);
         }
      },

      removeWidget: function removeWidget() {
         this.api.remove();
      },

      navigateToLiveEvent: function navigateToLiveEvent(eventId) {
         this.navigateClient('event/live/' + eventId);
      },

      navigateToEvent: function navigateToEvent(eventId) {
         this.navigateClient('event/' + eventId);
      },

      navigateToFilter: function navigateToFilter(filterParams) {
         this.navigateClient(filterParams);
      },

      navigateToLiveEvents: function navigateToLiveEvents() {
         this.navigateClient(['in-play']);
      },

      addOutcomeToBetslip: function addOutcomeToBetslip(outcomes, stakes, updateMode, source) {
         var arrOutcomes = [];
         // Check if the outcomes parameter is an array and add it, otherwise add the the single value as an array
         if (Array.isArray(outcomes)) {
            arrOutcomes = outcomes;
         } else {
            arrOutcomes.push(outcomes);
         }

         // Setup the data object to be sent to the widget API
         var data = {
            outcomes: arrOutcomes
         };

         // Check if we got any stakes passed to use, add them to the data object if so
         if (stakes != null) {
            if (stakes.isArray()) {
               data.stakes = stakes;
            } else {
               data.stakes = [stakes];
            }
         }

         // Set the coupon type, defaults to TYPE_SINGLE
         data.couponType = arrOutcomes.length === 1 ? this.api.BETSLIP_OUTCOMES_ARGS.TYPE_SINGLE : this.api.BETSLIP_OUTCOMES_ARGS.TYPE_COMBINATION;

         // Set the update mode, defaults to UPDATE_APPEND
         data.updateMode = updateMode !== 'replace' ? this.api.BETSLIP_OUTCOMES_ARGS.UPDATE_APPEND : this.api.BETSLIP_OUTCOMES_ARGS.UPDATE_REPLACE;
         if (source != null) {
            data.source = source;
         }

         // Send the data to the widget this.api
         this.api.set(this.api.BETSLIP_OUTCOMES, data);
      },

      removeOutcomeFromBetslip: function removeOutcomeFromBetslip(outcomes) {
         var arrOutcomes = [];
         if (Array.isArray(outcomes)) {
            arrOutcomes = outcomes;
         } else {
            arrOutcomes.push(outcomes);
         }
         this.api.set(this.api.BETSLIP_OUTCOMES_REMOVE, { outcomes: arrOutcomes });
      },

      requestBetslipOutcomes: function requestBetslipOutcomes() {
         this.api.request(this.api.BETSLIP_OUTCOMES);
      },

      requestPageInfo: function requestPageInfo() {
         this.api.request(this.api.PAGE_INFO);
      },

      requestWidgetArgs: function requestWidgetArgs() {
         this.api.request(this.api.WIDGET_ARGS);
      },

      requestClientConfig: function requestClientConfig() {
         this.api.request(this.api.CLIENT_CONFIG);
      },

      requestOddsFormat: function requestOddsFormat() {
         this.api.request(this.api.CLIENT_ODDS_FORMAT);
      },

      requestOddsAsAmerican: function requestOddsAsAmerican(odds) {
         return new Promise(function (resolve, reject) {
            this.api.requestOddsAsAmerican(odds, function (americanOdds) {
               resolve(americanOdds);
            });
         }.bind(this));
      },

      requestOddsAsFractional: function requestOddsAsFractional(odds) {
         return new Promise(function (resolve, reject) {
            this.api.requestOddsAsFractional(odds, function (fractionalOdds) {
               resolve(fractionalOdds);
            });
         });
      },

      navigateClient: function navigateClient(destination) {
         if (typeof destination === 'string') {
            this.api.navigateClient('#' + CoreLibrary.config.routeRoot + destination);
         } else if (destination.isArray()) {
            var filter = this.api.createFilterUrl(destination, CoreLibrary.config.routeRoot);
            this.api.navigateClient(filter);
         }
      }
   };
}();
//# sourceMappingURL=widgetModule.js.map

'use strict';

(function () {

   var OutcomeViewController = function OutcomeViewController(attributes) {
      var _this = this;

      this.data = attributes;
      this.selected = false;
      this.label = '';
      this.coreLibraryConfig = CoreLibrary.config;

      if (this.data.outcomeAttr != null) {
         if (this.data.eventAttr != null) {
            this.label = CoreLibrary.utilModule.getOutcomeLabel(this.data.outcomeAttr, this.data.eventAttr);
         } else {
            this.label = this.data.outcomeAttr.label;
         }

         if (CoreLibrary.widgetModule.betslipIds.indexOf(this.data.outcomeAttr.id) !== -1) {
            this.selected = true;
         }

         CoreLibrary.widgetModule.events.on('OUTCOME:ADDED:' + this.data.outcomeAttr.id, function (data, event) {
            _this.selected = true;
         });

         CoreLibrary.widgetModule.events.on('OUTCOME:REMOVED:' + this.data.outcomeAttr.id, function (data, event) {
            _this.selected = false;
         });
      }

      this.toggleOutcome = function (event, scope) {
         if (scope.selected === false) {
            CoreLibrary.widgetModule.addOutcomeToBetslip(scope.data.outcomeAttr.id);
         } else {
            CoreLibrary.widgetModule.removeOutcomeFromBetslip(scope.data.outcomeAttr.id);
         }
      };

      this.getOddsFormat = function () {
         switch (this.coreLibraryConfig.oddsFormat) {
            case 'fractional':
               return this.data.outcomeAttr.oddsFractional;
            case 'american':
               return this.data.outcomeAttr.oddsAmerican;
            default:
               return this.data.outcomeAttr.odds / 1000;
         }
      };
   };

   rivets.components['outcome-component'] = {
      template: function template() {
         return '<button rv-on-click="toggleOutcome" type="button" role="button" class="KambiWidget-outcome kw-link l-flex-1 l-ml-6" ' + 'rv-custom-class="selected" rv-toggle-class="KambiWidget-outcome--selected" >' + '<div class="KambiWidget-outcome__flexwrap">' + '<div class="KambiWidget-outcome__label-wrapper">' + '<span class="KambiWidget-outcome__label">{label}</span>' + '<span class="KambiWidget-outcome__line"></span>' + '</div>' + '<div class="KambiWidget-outcome__odds-wrapper">' + '<span class="KambiWidget-outcome__odds" rv-text="getOddsFormat < data.outcomeAttr.odds coreLibraryConfig.oddsFormat"></span>' + '</div>' + '</div>' + '</button>';
      },

      initialize: function initialize(el, attributes) {
         el.classList.add('l-flexbox');
         el.classList.add('l-flex-1');
         return new OutcomeViewController(attributes);
      }
   };

   rivets.components['outcome-component-no-label'] = {
      template: function template() {
         return '<button rv-on-click="toggleOutcome" rv-disabled="betOffer.suspended | == true"' + 'rv-custom-class="selected" rv-toggle-class="KambiWidget-outcome--selected" ' + 'type="button" role="button" class="KambiWidget-outcome kw-link l-ml-6">' + '<div class="l-flexbox l-pack-center">' + '<div class="KambiWidget-outcome__odds-wrapper">' + '<span class="KambiWidget-outcome__odds" rv-text="getOddsFormat < data.outcomeAttr.odds coreLibraryConfig.oddsFormat" ></span>' + '</div>' + '</div>' + '</button>';
      },

      initialize: function initialize(el, attributes) {
         return new OutcomeViewController(attributes);
      }
   };
})();
//# sourceMappingURL=OutcomeComponent.js.map

'use strict';

(function () {
   'use strict';

   CoreLibrary.PaginationComponent = CoreLibrary.Component.subclass({
      htmlTemplate: '<div class="kw-pagination l-flexbox l-pack-center l-align-center">' + '<span rv-on-click="previousPage" rv-class-disabled="firstPage"' + 'class="kw-page-link kw-pagination-arrow">' + '<i class="icon-angle-left"></i>' + '</span>' + '<span rv-each-page="pages" rv-on-click="page.clickEvent" rv-class-kw-active-page="page.selected"' + 'class="kw-page-link l-pack-center l-align-center" >' + '{page.text}' + '</span>' + '<span rv-on-click="nextPage" rv-class-disabled="lastPage"' + 'class="kw-page-link kw-pagination-arrow">' + '<i class="icon-angle-right"></i>' + '</span>' + '</div>',

      constructor: function constructor(htmlElement, mainComponentScope, scopeKey, pageSize, maxVisiblePages) {
         CoreLibrary.Component.apply(this, [{
            rootElement: htmlElement
         }]);
         this.scopeKey = scopeKey;
         this.pageSize = pageSize ? pageSize : 3;
         this.maxVisiblePages = maxVisiblePages ? maxVisiblePages : 5;
         this.scope.currentPage = 0;
         this.scope.firstPage = true;
         this.scope.lastPage = false;

         /*
         creates a new array with name _scopeKey
         the component should use this array when it wants only the data
         of the currentPage
         */
         mainComponentScope['_' + scopeKey] = [];
         this.originalArray = mainComponentScope[scopeKey];
         this.currentPageArray = mainComponentScope['_' + scopeKey];

         // watching for changes in the original array
         sightglass(mainComponentScope, scopeKey, function () {
            this.originalArray = mainComponentScope[scopeKey];
            this.setCurrentPage(0);
            this.clearArray();
            this.adaptArray();
         }.bind(this));

         this.scope.nextPage = this.nextPage.bind(this);
         this.scope.previousPage = this.previousPage.bind(this);

         this.adaptArray();
      },

      clearArray: function clearArray() {
         this.currentPageArray.splice(0, this.currentPageArray.length);
      },

      getCurrentPage: function getCurrentPage() {
         return this.scope.currentPage;
      },

      setCurrentPage: function setCurrentPage(pageNumber) {
         if (pageNumber === this.getCurrentPage()) {
            return;
         }
         if (pageNumber < 0 || pageNumber >= this.getNumberOfPages()) {
            throw new Error('Invalid page number');
         }
         this.scope.currentPage = pageNumber;
         this.adaptArray();
      },

      getNumberOfPages: function getNumberOfPages() {
         return Math.ceil(this.originalArray.length / this.pageSize);
      },

      nextPage: function nextPage() {
         if (this.getCurrentPage() < this.getNumberOfPages() - 1) {
            this.setCurrentPage(this.getCurrentPage() + 1);
         }
         return this.getCurrentPage();
      },

      previousPage: function previousPage() {
         if (this.getCurrentPage() > 0) {
            this.setCurrentPage(this.getCurrentPage() - 1);
         }
         return this.getCurrentPage();
      },

      /**
       * Changes the _scopeKey array to match the current page elements
       */
      adaptArray: function adaptArray() {
         this.clearArray();
         var startItem = this.getCurrentPage() * this.pageSize;
         var endItem = startItem + this.pageSize;
         if (endItem >= this.originalArray.length) {
            endItem = this.originalArray.length;
         }
         for (var i = startItem; i < endItem; ++i) {
            this.currentPageArray.push(this.originalArray[i]);
         }

         this.scope.firstPage = this.getCurrentPage() === 0;
         this.scope.lastPage = this.getCurrentPage() === this.getNumberOfPages() - 1;

         this.render();
      },

      init: function init() {
         this.render();
      },

      /**
       * Updates the scope.pages value which is used to render the page numbers and arrows
       */
      render: function render(page) {
         this.scope.pages = [];
         var startPage = this.getCurrentPage() - 2;
         if (this.getCurrentPage() + 2 >= this.getNumberOfPages()) {
            var startPage = this.getNumberOfPages() - 5;
         }
         if (startPage < 0) {
            startPage = 0;
         }
         var i = startPage;
         var numberOfPagesVisible = 0;
         while (i < this.getNumberOfPages() && numberOfPagesVisible < 5) {
            this.scope.pages.push({
               text: i + 1 + '',
               number: i,
               selected: i === this.getCurrentPage(),
               clickEvent: this.setCurrentPage.bind(this, i) // calls setCurrentPage with i as a parameter
            });
            ++i;
            ++numberOfPagesVisible;
         }
      }
   });
})();
//# sourceMappingURL=PaginationComponent.js.map

'use strict';

(function () {
   'use strict';

   var TeamPerformance = CoreLibrary.Component.subclass({
      defaultArgs: {
         title: 'Form'
      },

      constructor: function constructor() {
         CoreLibrary.Component.apply(this, arguments);
      },
      init: function init() {
         var _this = this;

         CoreLibrary.widgetModule.enableWidgetTransition(true);

         // Setting the pageParam as a fallback
         var eventId;
         if (this.scope.args.eventId != null) {
            eventId = this.scope.args.eventId;
            void 0;
         } else {
            eventId = CoreLibrary.pageInfo.pageParam;
            void 0;
         }
         CoreLibrary.statisticsModule.getStatistics('tpi', 'event/' + eventId + '/').then(function (data) {
            _this.scope.teams = [];
            _this.scope.teams.push({
               name: data.homeParticipant.participantName,
               detailed: false,
               lastEvents: _this.parseLastEvents(data.homeParticipant.participantId, data.homeParticipant.lastEvents)
            });
            _this.scope.teams.push({
               name: data.awayParticipant.participantName,
               detailed: false,
               lastEvents: _this.parseLastEvents(data.awayParticipant.participantId, data.awayParticipant.lastEvents)
            });

            _this.scope.teams.forEach(function (team) {
               sightglass(team, 'detailed', _this.adjustHeight.bind(_this));
            });

            _this.adjustHeight();
            _this.scope.onLoad = 'block';
         }).catch(function (e) {
            // Error loading the statistics, remove the widget
            CoreLibrary.widgetModule.removeWidget();
         });

         this.view.binders['box-css-class'] = function (el, value) {
            el.classList.add('kw-match-' + value);
         };
      },


      // flattens lastEvents
      parseLastEvents: function parseLastEvents(teamId, lastEvents) {
         var events = [];
         lastEvents.forEach(function (event) {
            if (event.homeParticipant && event.awayParticipant && event.scores && event.scores.length > 0) {
               var result = 'win';
               if (event.scores[0].homeScore === event.scores[0].awayScore) {
                  result = 'draw';
               } else if (event.homeParticipant.participantId === teamId && event.scores[0].awayScore > event.scores[0].homeScore) {
                  result = 'lose';
               } else if (event.awayParticipant.participantId === teamId && event.scores[0].homeScore > event.scores[0].awayScore) {
                  result = 'lose';
               }
               events.push({
                  homeName: event.homeParticipant.participantName,
                  awayName: event.awayParticipant.participantName,
                  homeScore: event.scores[0].homeScore,
                  awayScore: event.scores[0].awayScore,
                  result: result
               });
            }
         });
         return events;
      },


      // sets the height of the widget, called when detailed view on teams is opened/closed
      adjustHeight: function adjustHeight() {
         var headerHeight = 56;
         var compactViewTeamInfoHeight = 74 + 6; // collapsed item plus half bottom border
         var tableLineHeight = 24 + 8; // line-height + margin bottom

         var contentHeight = headerHeight;

         this.scope.teams.forEach(function (team) {
            if (team.detailed === true) {
               contentHeight += compactViewTeamInfoHeight + team.lastEvents.length * tableLineHeight + 20;
            } else {
               contentHeight += compactViewTeamInfoHeight;
            }
         });

         CoreLibrary.widgetModule.setWidgetHeight(contentHeight + 1);
      }
   });

   var teamPerformance = new TeamPerformance({
      rootElement: 'html'
   });
})();
//# sourceMappingURL=app.js.map
