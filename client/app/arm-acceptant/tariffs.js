'use strict';

var mod = angular.module('armAcceptantApp');

mod.controller('TariffsCtrl', function ($scope, $rootScope, $log, $q, uiGridConstants, myRest) {
  /////////////////////////////////////////////////////////
  // Startup code

  buildTable();

  // Auto-update
  //var stopAutoRefresh = $interval(function () {
  //  buildTable();
  //}, 5000);
  //$scope.$on('$destroy', function () {
  //  $interval.cancel(stopAutoRefresh);
  //});

  // Startup code
  /////////////////////////////////////////////////////////

  //*****************************************************************
  // Implementation

  function getData() {
    let deffered = $q.defer();
    myRest.getTariffs().then(
      function (data) {
        $scope.gridOptions.data = data;
        deffered.resolve();
      },
      function (reason) {
        $scope.gridOptions.data = [];
        deffered.resolve();
      }
    );
    return deffered.promise;
  }

  function buildTable() {
    $rootScope.isGettingData = true;
    getData().then(
      function () {
        $scope.resizeDataView();
        $rootScope.isGettingData = false;
      },
      function (reason) {
        $rootScope.isGettingData = false;
      }
    );
  }

  function log(msg) {
    $log.debug(msg);
  }

  //-----------------------------------
  // ui-grid setup

  $scope.gridOptions = {};

  $scope.gridOptions.columnDefs = [
    {
      displayName: 'Способ оплаты',
      field: 'name'
    },
    {
      displayName: 'Услуга',
      field: 'desc'
    },
    {
      displayName: 'Тип',
      field: 'type',
      cellClass: "text-right",
      headerCellClass: "text-right"
    },
    {
      displayName: 'Тариф',
      field: 'currency',
      cellFilter: 'tariffFilter:this',
      cellClass: "text-right",
      headerCellClass: "text-right"
    }
  ];

  $scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
  $scope.gridOptions.enableVerticalScrollbar = uiGridConstants.scrollbars.WHEN_NEEDED;
  $scope.gridOptions.enableColumnMenus = false;

  // ui-grid setup
  //-----------------------------------
});

mod.filter('tariffFilter', function() {
  return function (currency, scope) {
    const unavailSign = "---";
    if (currency.isAbonnement) {
      return unavailSign;
    }
    else {
      let price = null;

      switch (currency.code) {
        case 'C-PFTT':
        case 'B-PFTT':
        case 'T-PFTT':
          price = unavailSign;
          break;
        default:
          price = scope.row.entity.price;
      }

      return price;
    }
  };
});
