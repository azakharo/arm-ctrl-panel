'use strict';

angular.module('armCtrlPanelApp')
  .controller('ServicesCtrl', function ($scope, uiGridConstants, myRest) {
    /////////////////////////////////////////////////////////
    // Initialization

    $scope.apps = [];
    $scope.appSelected = null;
    $scope.tariffs = [];
    myRest.getApps().then(function (apps) {
      $scope.apps = apps;
      if (apps.length > 0) {
        $scope.appSelected = apps[0];
        updateTariffs();
      }
    });

    // Initialization
    /////////////////////////////////////////////////////////

    $scope.onSelectedAppChanged = function () {
      updateTariffs();
    };

    function updateTariffs() {
      myRest.getAppTariffs($scope.appSelected).then(
        function (tars) {
          $scope.gridOptions.data = tars;
          setGrouping();
        }
      );
    }

    //-----------------------------------
    // ui-grid setup

    $scope.gridOptions = {
      onRegisterApi: function(gridApi){
        $scope.gridApi = gridApi;
      }
    };
    $scope.gridOptions.columnDefs = [
      {
        displayName: 'Услуга',
        name: 'desc'
      },
      {
        displayName: 'Под-услуга',
        field: 'name'
      }
    ];

    $scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    $scope.gridOptions.enableVerticalScrollbar = uiGridConstants.scrollbars.WHEN_NEEDED;
    $scope.gridOptions.enableColumnMenus = false;
    $scope.gridOptions.data = [];

    function setGrouping() {
      $scope.gridApi.grouping.clearGrouping();
      $scope.gridApi.grouping.groupColumn('desc');
    }

    // ui-grid setup
    //-----------------------------------

  });
