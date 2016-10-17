'use strict';

angular.module('armCtrlPanelApp')
  .controller('ServicesCtrl', function ($scope, $rootScope, $timeout, uiGridConstants, myRest) {
    /////////////////////////////////////////////////////////
    // Initialization

    $rootScope.isGettingData = true;
    $scope.apps = [];
    $scope.appSelected = null;
    $scope.tariffs = [];

    //-----------------------------------
    // ui-grid setup

    $scope.gridOptions = {
      onRegisterApi: function(gridApi){
        $scope.gridApi = gridApi;

        // Expand all rows when loading the grid
        $scope.gridApi.grid.registerDataChangeCallback(function() {
          $scope.gridApi.treeBase.expandAllRows();
        });
      }
    };
    $scope.gridOptions.columnDefs = [
      {
        displayName: 'Услуга',
        name: 'desc'
      },
      {
        displayName: 'Детали',
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


    if (isRestDebug) {
      $rootScope.isGettingData = false;
      $scope.apps = [{
        title: 'Транспортное'
      }];

      $scope.appSelected = $scope.apps[0];
      updateTariffs();
    }
    else {
      myRest.getApps().then(function (apps) {
        $scope.apps = apps;
        if (apps.length > 0) {
          $scope.appSelected = apps[0];
          updateTariffs();
        }
      });
    }

    // Initialization
    /////////////////////////////////////////////////////////

    $scope.onSelectedAppChanged = function () {
      updateTariffs();
    };

    function updateTariffs() {
      if (isRestDebug) {
        myRest.getTariffs().then(
          function (tars) {
            $scope.gridOptions.data = tars;
            $timeout(resizeTable, 100);
          }
        );
      }
      else {
        $rootScope.isGettingData = true;
        myRest.getAppTariffs($scope.appSelected).then(
          function (tars) {
            $scope.gridOptions.data = tars;
            setGrouping();
            $rootScope.isGettingData = false;
            $timeout(resizeTable, 100);
          },
          function (reason) {
            $rootScope.isGettingData = false;
          }
        );
      }
    }

    ///////////////////////////////////////////////////////
    // Grid resizing

    function resizeTable() {
      const newW = Math.floor( window.innerWidth - $('#sidebar').width() - 40 );
      const newH = Math.floor( window.innerHeight - $('#header').height() - $('#footer').height() -
      $('#services-app-selector').height() - $('#services-title').height() - 60 );
      $scope.resizeGrid('#services-table', newH, newW);
    }

    let onWindowResize = debounce(function () {
      resizeTable();
    }, 500);

    $(window).resize(onWindowResize);

    // Grid resizing
    ///////////////////////////////////////////////////////

  });
