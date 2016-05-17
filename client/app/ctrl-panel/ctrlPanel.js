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
      .state('ctrl-panel.services', {
        url: '/services',
        templateUrl: 'app/ctrl-panel/services.html',
        controller: 'ServicesCtrl'
      })
      .state('ctrl-panel.esek-activation', {
        url: '/esek-activation',
        templateUrl: 'app/ctrl-panel/esekActivation.html',
        controller: 'EsekActivationCtrl'
      });
  });
