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
          $scope.acceptants = _.filter(providers, function (prov) {
            return prov.meta && prov.meta.isAcceptant;
          });
        }
      );
    }

  });
