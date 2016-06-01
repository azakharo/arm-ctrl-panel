'use strict';

angular.module('armCtrlPanelApp')
  .controller('EmittersCtrl', function ($scope, myRest) {
    /////////////////////////////////////////////////////////
    // Initialization

    $scope.emitters = [];
    updateEmitters();

    // Initialization
    /////////////////////////////////////////////////////////

    function updateEmitters() {
      $scope.isGettingData = true;
      myRest.getAllProviders().then(
        function (providers) {
          $scope.emitters = _.filter(providers, function (prov) {
            return prov.meta && prov.meta.roles && _.includes(prov.meta.roles, "emitent");
          });
          $scope.isGettingData = false;
        },
        function (reason) {
          $scope.isGettingData = false;
        }
      );
    }

  });
