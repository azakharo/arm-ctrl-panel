'use strict';

angular.module('armCtrlPanelApp')
  .controller('AcceptantsCtrl', function ($scope, $rootScope, myRest) {
    /////////////////////////////////////////////////////////
    // Initialization

    $scope.acceptants = [];
    updateAcceptants();

    // Initialization
    /////////////////////////////////////////////////////////

    function updateAcceptants() {
      $rootScope.isGettingData = true;
      myRest.getAllProviders().then(
        function (providers) {
          $scope.acceptants = _.filter(providers, function (prov) {
            return prov.meta && prov.meta.roles && _.includes(prov.meta.roles, "acceptant");
          });
          $rootScope.isGettingData = false;
        },
        function (reason) {
          $rootScope.isGettingData = false;
        }
      );
    }

  });
