'use strict';

angular.module('armCtrlPanelApp')
  .controller('ServicesCtrl', function ($scope, $rootScope, uiGridConstants, myRest) {
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
      $rootScope.isGettingData = true;
      myRest.getAppTariffs($scope.appSelected).then(
        function (tars) {
          $scope.gridOptions.data = tars;
          setGrouping();
          $rootScope.isGettingData = false;
        },
        function (reason) {
          $rootScope.isGettingData = false;
        }
      );
    }

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

    ///////////////////////////////////////////////////////
    // Grid resizing

    function resizeTable() {
      const newW = Math.floor( window.innerWidth - $('#sidebar').width() - 40 );
      //const newH = Math.floor( window.innerHeight - $('#header').height() - $('#footer').height() -
      //$('#services-title').height() - 60 );
      $scope.resizeGrid('#services-tariffs-table', undefined, newW);
    }

    let onWindowResize = debounce(function () {
      resizeTable();
    }, 500);

    $(window).resize(onWindowResize);

    // Grid resizing
    ///////////////////////////////////////////////////////

  });
