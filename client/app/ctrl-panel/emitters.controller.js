'use strict';

angular.module('armCtrlPanelApp')
  .controller('EmittersCtrl', function ($scope, $rootScope, myRest) {
    /////////////////////////////////////////////////////////
    // Initialization

    $scope.emitters = [];
    updateEmitters();

    // Initialization
    /////////////////////////////////////////////////////////

    function updateEmitters() {
      $rootScope.isGettingData = true;
      myRest.getAllProviders().then(
        function (providers) {
          $scope.emitters = _.filter(providers, function (prov) {
            return prov.meta && prov.meta.roles && _.includes(prov.meta.roles, "emitent");
          });
          $rootScope.isGettingData = false;
        },
        function (reason) {
          $rootScope.isGettingData = false;
        }
      );
    }

  });
