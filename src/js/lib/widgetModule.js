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
               console.debug('WIDGET:HEIGHT', response.data);
               break;
            case this.api.BETSLIP_OUTCOMES:
               // We've received a response with the outcomes currently in the betslip
               console.debug('OUTCOMES:UPDATE', response.data);
               break;
            case this.api.WIDGET_ARGS:
               // We've received a response with the arguments set in the
               console.debug('WIDGET:ARGS', response.data);
               break;
            case this.api.PAGE_INFO:
               // Received page info response
               console.debug('PAGE:INFO', response.data);
               break;
            case this.api.CLIENT_ODDS_FORMAT:
               // Received odds format response
               console.debug('ODDS:FORMAT', response.data);
               break;
            case this.api.CLIENT_CONFIG:
               console.debug('CLIENT:CONFIG', response.data);
               break;
            case this.api.USER_LOGGED_IN:
               console.debug('User logged in', response.data);
               console.debug('USER:LOGGED_IN', response.data);
               break;
            case 'Setup':
               console.debug('Setup response', response.data);
               break;
            default:
               // Unhandled response
               console.info('Unhandled response type: ' + response.type);
               console.debug(this.api);
               console.info(response);
               break;
         }
      },
      requestSetup: function ( callback ) {
         this.api.requestSetup(callback);
      }
   };
})();