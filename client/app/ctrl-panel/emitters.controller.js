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
      myRest.getAllProviders().then(
        function (providers) {
          $scope.emitters = _.filter(providers, function (prov) {
            return prov.meta && prov.meta.isEmitter;
          });
        }
      );
    }

  });
