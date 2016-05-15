'use strict';

var mod = angular.module('armAcceptantApp');

mod.controller('StatPrivilTableCtrl', function ($scope, $rootScope, $log, $q, uiGridConstants, myRest) {
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
    let dateStart = $rootScope.dateStart;
    let dateFinish = $rootScope.dateFinish;
    myRest.getStatPaidPrivileges(dateStart, dateFinish).then(
      function (data) {
        data = _.filter(data, remZeroStat);
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
    getData().then(
      () => $scope.resizeDataView()
    );
  }

  $scope.$watch('dataUpdateCount', function (newVal, oldVal, scope) {
    if (newVal > 0) {
      buildTable();
    }
  });

  $scope.$watch('$rootScope.eventDateFilterChanged', function (newVal, oldVal, scope) {
    if (newVal > 2) {
      $scope.gridOptions.data = [];
    }
  });

  function remZeroStat (dayStat) {
    return dayStat.fullyPaid !== 0 || dayStat.privileged !== 0;
  }

  function log(msg) {
    $log.debug(msg);
  }

  //-----------------------------------
  // ui-grid setup

  $scope.gridOptions = {};

  $scope.gridOptions.columnDefs = [
    {
      displayName: 'Дата',
      field: 'day.toDate()',
      type: 'date',
      cellFilter: 'date: "dd.MM.yyyy"'
    },
    {
      displayName: 'Нельготных поездок, шт',
      field: 'fullyPaid',
      type: 'number',
      cellClass: "text-right",
      headerCellClass: "text-right"
    },
    {
      displayName: 'Льготных поездок, шт',
      field: 'privileged',
      type: 'number',
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
