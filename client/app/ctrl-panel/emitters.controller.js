'use strict';

angular.module('armCtrlPanelApp')
  .controller('EmittersCtrl', function ($scope, myRest) {
    /////////////////////////////////////////////////////////
    // Initialization

    $scope.apps = [];
    $scope.appSelected = null;
    $scope.emitters = [];

    myRest.getApps().then(function (apps) {
      $scope.apps = apps;
      if (apps.length > 0) {
        $scope.appSelected = apps[0];
        updateEmitters();
      }
    });

    // Initialization
    /////////////////////////////////////////////////////////


    $scope.onSelectedAppChanged = function () {
      updateEmitters();
    };

    function updateEmitters() {
      myRest.getAppProviders($scope.appSelected.id).then(
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
