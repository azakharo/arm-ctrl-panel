'use strict';

let mod = angular.module('armAcceptantApp');

mod.controller('ArmAcceptantCtrl', function ($scope, $rootScope, $state, $log, $timeout, Auth, myRest) {
  $scope.Auth = Auth;

  $scope.onSettingsBtnClick = function() {
    log("settings clicked");
  };

  $scope.onLogOutBtnClick = function() {
    $state.go('login');
    Auth.logout();
  };

  // Navi menu
  $scope.naviMenuItems = [
    {
      url: myRest.getDashboardUrl(),
      name: 'Дашборд'
    },
    {
      url: myRest.getUptimeUrl(),
      name: 'Uptime'
    }
  ];

  //-------------------------------------
  // Resize nested view on windows resize

  var onWindowResize = debounce(function () {
    $scope.resizeDataView();
  }, 1000);

  $(window).resize(onWindowResize);

  // Resize nested view on windows resize
  //-------------------------------------

  $rootScope.statType = 'common';
  $rootScope.dataDisplay = 'table';

  $scope.go2accounting = function () {
    $scope.switchAccountingState();
  };

  $scope.switchAccountingState = function () {
    if ($rootScope.statType === 'common') {
      if ($rootScope.dataDisplay === 'table') {
        $state.go('arm-acceptant.accounting.statCommonTable');
      }
      else if ($rootScope.dataDisplay === 'chart') {
        $state.go('arm-acceptant.accounting.statCommonChart');
      }
    }
    else if ($rootScope.statType === 'privileges') {
      if ($rootScope.dataDisplay === 'table') {
        $state.go('arm-acceptant.accounting.statPrivilTable');
      }
      else if ($rootScope.dataDisplay === 'chart') {
        $state.go('arm-acceptant.accounting.statPrivilChart');
      }
    }
    else if ($rootScope.statType === 'cards') {
      if ($rootScope.dataDisplay === 'table') {
        $state.go('arm-acceptant.accounting.statCardsTable');
      }
      else if ($rootScope.dataDisplay === 'chart') {
        $state.go('arm-acceptant.accounting.statCardsChart');
      }
    }
  };

  $scope.go2tariffs = function () {
    $state.go('arm-acceptant.tariffs');
  };


  //++++++++++++++++++++++++++++++++++++++++
  // Nested view resizing

  const SEL_CONTAINER = '#data-display';
  const SEL_GRID = SEL_CONTAINER + ' .grid';
  const SEL_CHART = SEL_CONTAINER + ' .mychart';
  const SEL_TARIFF_TBL_CONTAINER = '#tariff-grid';

  $scope.resizeDataView = function () {
    $timeout(function () {
      let chartMustBeH = getChartHeight();
      //log("chartMustBeH = " + chartMustBeH);
      let chartMustBeW = getChartWidth();

      // Resize grid if it exists
      let mygrid = $(SEL_GRID);
      if (mygrid.length > 0) { // if table found
        resizeGrid(SEL_GRID, chartMustBeH, chartMustBeW);
      }
      // Resize chart if exists
      let mychart = $(SEL_CHART);
      if (mychart.length > 0) { // if chart found
        resizeChart(SEL_CHART, chartMustBeH, chartMustBeW);
      }

      // Resize tariff table if exists
      let tarTable = $(SEL_TARIFF_TBL_CONTAINER);
      if (tarTable.length > 0) { // if table found
        let tableH = getTariffTableHeight();
        resizeGrid(SEL_TARIFF_TBL_CONTAINER, tableH);
      }

    }, 100);
  };

  function getTariffTableHeight() {
    return Math.floor(window.innerHeight -
      $('#header').height() - $('#navi-tabset').height() - 20 - $('#tariffs-table-title').height() -
      $('#footer').height() - 22);
  }

  function getChartWidth() {
    if (window.innerWidth <= 800) {
      return Math.floor(window.innerWidth - 50);
    }
    else {
      return Math.floor(window.innerWidth - $('#accounting-left-part').width() - 62);
    }
  }

  function getChartHeight() {
    if (window.innerWidth <= 800) {
      return 400;
    }
    else {
      let rightPartH = $('#accounting-right-part').height();
      let statSwitchH = $('#stat-switch').height();
      let dispSwitchH = $('#data-display-switch').height();
      return rightPartH - statSwitchH - dispSwitchH - 22;
    }
  }

  function resizeChart(chartElemSelector, mustBeH, mustBeW) {
    var chartElem = $(chartElemSelector);
    var chartW = mustBeW ? mustBeW : chartElem.width();
    var chartH = mustBeH ? mustBeH : chartElem.height();
    var chart = chartElem.highcharts();
    if (chart) {
      if (chart.chartWidth !== chartW || chart.chartHeight !== chartH) {
        chart.setSize(chartW, chartH, false);
      }
    }
  }

  function resizeGrid(gridSelector, mustBeH, mustBeW) {
    var grid = $(gridSelector);
    if (grid) {
      if (mustBeW && grid.width() !== mustBeW) {
        grid.width(mustBeW);
      }
      if (mustBeH && grid.height() !== mustBeH) {
        grid.height(mustBeH);
      }
    }
  }

  // Nested view resizing
  //++++++++++++++++++++++++++++++++++++++++

  function log(msg) {
    $log.debug(msg);
  }
});
