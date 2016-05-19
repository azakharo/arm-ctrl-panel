'use strict';

angular.module('armCtrlPanelApp')
  .controller('AcceptantsCtrl', function ($scope, myRest) {
    /////////////////////////////////////////////////////////
    // Initialization

    $scope.acceptants = [];
    updateAcceptants();

    // Initialization
    /////////////////////////////////////////////////////////

    function updateAcceptants() {
      myRest.getAllProviders().then(
        function (providers) {
          // TODO use real filtering here
          //$scope.emitters = _.filter(providers, function (prov) {
          //  return prov.meta[0] === "park 1";
          //});
          $scope.acceptants = providers;
        }
      );
    }

  });
