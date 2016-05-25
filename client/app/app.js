'use strict';

var isMyDebug = true;

angular.module('armCtrlPanelApp', [
  'ngCookies',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ui.grid',
  'ui.grid.autoResize',
  'ui.grid.pagination',
  'ui.grid.moveColumns',
  'ui.grid.exporter',
  'ui.grid.grouping',
  'ui.grid.saveState',
  'smart-table',
  'ngPromiseExtras',
  'snap',
  'angularSpinner',
  'daterangepicker',
  'angularjs-dropdown-multiselect',
  'LocalStorageModule',
  'authService',
  'restService',
  'loginDlg'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    let defaultUrl = isMyDebug ? '/ctrl-panel/emitters' : '/ctrl-panel/emitters';
    $urlRouterProvider.otherwise(defaultUrl);

    $locationProvider.html5Mode(false);
    $httpProvider.interceptors.push('authInterceptor');

    $stateProvider.state('login', {
      url: '/login',
      template: '<login-dlg title="Контрольная панель оператора" success-route="ctrl-panel.emitters" success-route-debug="ctrl-panel.emitters" />',
      controller: function() {}
    });

  })

  // local storage app prefix
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('public-arm');
  }])

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location, $log) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers['Auth-Access-Token'] = $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401 || response.status === 403) {
          $log.debug('intercepted ' + response.status);
          $location.path('/login');
          $cookieStore.remove('token');
          $cookieStore.remove('username');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $state, Auth, $log) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      if (next.name !== 'login') {
        $rootScope.state2routeAfterLogin = next.name;
      }
      if (next.authenticate && !Auth.isLoggedIn()) {
        $log.debug('need auth, redirect to login');
        event.preventDefault();
        $state.go('login');
      }
    });
  })

  .run(function ($rootScope) {
    $rootScope.dateStart = moment().subtract(7, 'days').startOf('day');
    $rootScope.dateFinish = moment().endOf('day');
  })
  .run(function (i18nService, uibDatepickerPopupConfig, myRest) {
    // Cause 401 if necessary
    myRest.getApps();

    // moment js
    moment.locale('ru');

    // ui-grid
    i18nService.setCurrentLang('ru');

    ///////////////////////////////////////////////////
    // Date picker settings

    // TRANSLATION
    uibDatepickerPopupConfig.currentText = 'Сегодня';
    uibDatepickerPopupConfig.clearText = 'Очистить';
    uibDatepickerPopupConfig.closeText = 'Закрыть';

    uibDatepickerPopupConfig.appendToBody = true;

    // Date picker settings
    ///////////////////////////////////////////////////

    // Rus tests
    //runStatePeriodTests();
    //runBusWarnPerTests();
  });

// Global vars
var ddMultiSelectTranslationRU = {
  checkAll:	              'Выбрать все',
  uncheckAll:	            'Убрать все',
  selectionCount:	        'выбрано',    //  The suffix for "X/Y" that showed when using selection limit.
  selectionOf:	          'из',         //  The value between the selected values and the max values when using selection limit.
  searchPlaceholder:      'Найти...',   //	The placeholder for the search input.
  buttonDefaultText:      'Выбрать',    //	The default text that used for the button when no items selected.
  dynamicButtonTextSuffix:'выбрано'     //	The suffix for the button that used when using "dynamicText".
};
