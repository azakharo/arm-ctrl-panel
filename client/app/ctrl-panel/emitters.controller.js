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
          // TODO use real filtering here
          //$scope.emitters = _.filter(providers, function (prov) {
          //  return prov.meta[0] === "park 1";
          //});
          $scope.emitters = providers;
        }
      );
    }

  });
