'use strict';

var mod = angular.module('armAcceptantApp');

mod.controller('StatCommonTableCtrl', function ($scope, $rootScope, $log, $q, uiGridConstants, myRest) {
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
    $q.allSettled([
      myRest.getStatPassengersPerDay(dateStart, dateFinish),
      myRest.getStatBusesPerDay(dateStart, dateFinish),
      myRest.getStatPassKmPerDay(dateStart, dateFinish)
    ]).then(
      function (results) {
        results = _.map(results, function(res){
          return res.state === 'fulfilled' ? res.value : [];
        });
        let passengerStat = results[0];
        let busStat = results[1];
        let passKmStat = results[2];
        //log(passKmStat);
        let completeStat = passengerStat.map(function (elem, ind) {
          let newStatItem = elem;
          newStatItem.buses = busStat[ind].buses;
          newStatItem.passKm = passKmStat[ind].passKm;
          return newStatItem;
        });

        completeStat = _.filter(completeStat, remZeroStat);

        $scope.gridOptions.data = completeStat;
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
    return dayStat.buses !== 0 || dayStat.passengers !== 0 || dayStat.passKm > 0;
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
      displayName: 'Транспортных средств, шт',
      field: 'buses',
      type: 'number',
      cellClass: "text-right",
      headerCellClass: "text-right"
    },
    {
      displayName: 'Пассажиропоток, чел',
      field: 'passengers',
      type: 'number',
      cellClass: "text-right",
      headerCellClass: "text-right"
    },
    {
      displayName: 'Пассажирооборот, пасс*км',
      field: 'passKm',
      type: 'number',
      cellFilter: 'number:1',
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
