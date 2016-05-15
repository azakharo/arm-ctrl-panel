'use strict';

angular.module('armAcceptantApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('acceptant2', {
        abstract: true,
        url: '/acceptant2',
        templateUrl: 'app/acceptant2/acceptant2.html',
        controller: 'Acceptant2Ctrl'
      })
      .state('acceptant2.tariffs', {
        url: '/tariffs',
        templateUrl: 'app/arm-acceptant/tariffs.html',
        controller: 'TariffsCtrl'
      })
      .state('acceptant2.hardware', {
        url: '/hardware',
        templateUrl: 'app/acceptant2/hardware.html',
        controller: 'HardwareCtrl'
      })
      .state('acceptant2.transactions', {
        url: '/transactions',
        templateUrl: 'app/acceptant2/transactions.html',
        controller: 'TransactionsCtrl'
      })
      .state('acceptant2.statistic', {
        url: '/statistic',
        templateUrl: 'app/acceptant2/statistic.html',
        controller: 'StatisticCtrl'
      });
  });
