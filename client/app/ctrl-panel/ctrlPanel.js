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
      .state('ctrl-panel.emitters', {
        url: '/emitters',
        templateUrl: 'app/ctrl-panel/emitters.html',
        controller: 'EmittersCtrl'
      })
      .state('ctrl-panel.acceptants', {
        url: '/acceptants',
        templateUrl: 'app/ctrl-panel/acceptants.html',
        controller: 'AcceptantsCtrl'
      })
      .state('ctrl-panel.statistic', {
        url: '/statistic',
        templateUrl: 'app/ctrl-panel/statistic.html',
        controller: 'StatisticCtrl'
      });
  });
