'use strict';

var mod = angular.module('armAcceptantApp');

mod.controller('AccountingCtrl', function ($scope, $rootScope, $log, uibDatepickerPopupConfig, myRest) {
  /////////////////////////////////////////////////////////
  // Startup code

  $scope.$rootScope = $rootScope;

  // Auto-update
  //var stopAutoRefresh = $interval(function () {
  //  getData();
  //}, 5000);
  //$scope.$on('$destroy', function () {
  //  $interval.cancel(stopAutoRefresh);
  //});

  // Startup code
  /////////////////////////////////////////////////////////

  //*****************************************************************
  // Implementation

  $rootScope.dataUpdateCount = 0;
  $scope.onShowBtnClick = function () {
    //log("SHOW button clicked");

    // Update global dates
    $rootScope.dateStart = moment($scope.dtStart).startOf('day');
    $rootScope.dateFinish = moment($scope.dtFinish).endOf('day');

    // Emit events
    $rootScope.eventDateFilterChanged += 1;
    $rootScope.dataUpdateCount += 1;
  };

  $scope.onGetBtnClick = function () {
    log("GET button clicked");
  };

  $scope.onStatCommonBtnClick = function () {
    $rootScope.statType = 'common';
    $scope.switchAccountingState();
  };

  $scope.onStatPrivilBtnClick = function () {
    $rootScope.statType = 'privileges';
    $scope.switchAccountingState();
  };

  $scope.onStatCardBtnClick = function () {
    $rootScope.statType = 'cards';
    $scope.switchAccountingState();
  };

  $scope.onDataDispChanged = function () {
    $scope.switchAccountingState();
  };

  //===================================
  // Date filter

  $scope.dtStart = $rootScope.dateStart.toDate();
  $scope.dtFinish = $rootScope.dateFinish.toDate();

    $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    showWeeks: false
  };

  // TRANSLATION
  uibDatepickerPopupConfig.currentText = 'Сегодня';
  uibDatepickerPopupConfig.clearText = 'Очистить';
  uibDatepickerPopupConfig.closeText = 'Закрыть';

  uibDatepickerPopupConfig.appendToBody = true;

  $scope.format = 'dd.MM.yyyy';
  $scope.altInputFormats = ['d!.M!.yyyy'];

  $rootScope.eventDateFilterChanged = 0;
  //$scope.$watch('dtStart', function (newVal, oldVal, scope) {
  //  $rootScope.dateStart = moment(newVal).startOf('day');
  //  //$rootScope.eventDateFilterChanged += 1;
  //});
  //
  //$scope.$watch('dtFinish', function (newVal, oldVal, scope) {
  //  $rootScope.dateFinish = moment(newVal).endOf('day');
  //  //$rootScope.eventDateFilterChanged += 1;
  //});

  $scope.$watch('$rootScope.eventDateFilterChanged', function (newVal, oldVal, scope) {
    if (newVal > 2) {
      clearTotals();
    }
  });

  // Date filter
  //===================================

  //*******************************************************
  // Totals

  function clearTotals() {
    $scope.totalDays = undefined;
    $scope.totalPassFlow = undefined;
    $scope.totalTurnover = undefined;
    $scope.totalServed = undefined;
    $scope.totalFullyPaid = undefined;
    $scope.totalPrivileged = undefined;
    $scope.totalPriced = undefined;
  }
  clearTotals();

  function calcTotals() {
    $scope.totalDays = getDays($rootScope.dateStart, $rootScope.dateFinish).length;
    myRest.getStatTotalPassengers($rootScope.dateStart, $rootScope.dateFinish).then(
      n => $scope.totalPassFlow = isInt(n) ? n : undefined
    );
    myRest.getStatTotalPassKm($rootScope.dateStart, $rootScope.dateFinish).then(
        n => $scope.totalTurnover = isNumber(n) ?  n / 1000: undefined
    );
    myRest.getStatTotalServed($rootScope.dateStart, $rootScope.dateFinish).then(
        n => $scope.totalServed = isInt(n) ? n : undefined
    );
    myRest.getStatTotalPaidPrivileged($rootScope.dateStart, $rootScope.dateFinish).then(
      function (stat) {
        $scope.totalFullyPaid = isInt(stat.fullyPaid) ? stat.fullyPaid : undefined;
        $scope.totalPrivileged = isInt(stat.privileged) ? stat.privileged : undefined;
      }
    );
  }
  calcTotals();


  $scope.$watch('dataUpdateCount', function (newVal, oldVal, scope) {
    if (newVal > 0) {
      calcTotals();
    }
  });

  // Totals
  //*******************************************************

  function log(msg) {
    $log.debug(msg);
  }

});
