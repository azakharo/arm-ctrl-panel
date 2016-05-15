'use strict';

let mod = angular.module('armAcceptantApp');
mod.config(function ($stateProvider) {
  $stateProvider
    .state('arm-acceptant', {
      abstract: true,
      url: '/arm',
      templateUrl: 'app/arm-acceptant/arm-acceptant.html',
      controller: 'ArmAcceptantCtrl'
    })
    .state('arm-acceptant.tariffs', {
      url: '/tariffs',
      templateUrl: 'app/arm-acceptant/tariffs.html',
      controller: 'TariffsCtrl'
    })
    .state('arm-acceptant.accounting', {
      abstract: true,
      url: '/accounting',
      templateUrl: 'app/arm-acceptant/accounting.html',
      controller: 'AccountingCtrl'
    })
    .state('arm-acceptant.accounting.statCommonTable', {
      url: '/stat-common-table',
      templateUrl: 'app/arm-acceptant/statCommonTable.html',
      controller: 'StatCommonTableCtrl'
    })
    .state('arm-acceptant.accounting.statCommonChart', {
      url: '/stat-common-chart',
      templateUrl: 'app/arm-acceptant/statCommonChart.html',
      controller: 'StatCommonChartCtrl'
    })
    .state('arm-acceptant.accounting.statPrivilTable', {
      url: '/stat-privil-table',
      templateUrl: 'app/arm-acceptant/statPrivilTable.html',
      controller: 'StatPrivilTableCtrl'
    })
    .state('arm-acceptant.accounting.statPrivilChart', {
      url: '/stat-privil-chart',
      templateUrl: 'app/arm-acceptant/statPrivilChart.html',
      controller: 'StatPrivilChartCtrl'
    })
    .state('arm-acceptant.accounting.statCardsTable', {
      url: '/stat-cards-table',
      templateUrl: 'app/arm-acceptant/statCardsTable.html',
      controller: 'StatCardsTableCtrl'
    })
    .state('arm-acceptant.accounting.statCardsChart', {
      url: '/stat-cards-chart',
      templateUrl: 'app/arm-acceptant/statCardsChart.html',
      controller: 'StatCardsChartCtrl'
    })
    .state('login', {
      url: '/login',
      template: '<login-dlg title="Контрольная панель акцептанта" success-route="arm-acceptant.accounting.statCommonTable" success-route-debug="acceptant2.statistic" />',
      controller: function() {}
    });
});
