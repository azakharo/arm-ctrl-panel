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
      $scope.isGettingData = true;
      myRest.getAllProviders().then(
        function (providers) {
          $scope.acceptants = _.filter(providers, function (prov) {
            return prov.meta && prov.meta.roles && _.includes(prov.meta.roles, "acceptant");
          });
          $scope.isGettingData = false;
        },
        function (reason) {
          $scope.isGettingData = false;
        }
      );
    }

  });
