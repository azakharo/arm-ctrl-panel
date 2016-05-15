'use strict';

angular.module('armCtrlPanelApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ctrl-panel', {
        abstract: true,
        url: '/ctrl-panel',
        templateUrl: 'app/ctrl-panel/ctrlPanel.html',
        controller: 'CtrlPanelCtrl'
      })
      .state('ctrl-panel.hardware', {
        url: '/hardware',
        templateUrl: 'app/ctrl-panel/hardware.html',
        controller: 'HardwareCtrl'
      })
      .state('ctrl-panel.transactions', {
        url: '/transactions',
        templateUrl: 'app/ctrl-panel/transactions.html',
        controller: 'TransactionsCtrl'
      })
      .state('ctrl-panel.statistic', {
        url: '/statistic',
        templateUrl: 'app/ctrl-panel/statistic.html',
        controller: 'StatisticCtrl'
      });
  });
