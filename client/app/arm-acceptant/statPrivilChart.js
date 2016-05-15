'use strict';

var mod = angular.module('armAcceptantApp');

mod.controller('StatPrivilChartCtrl', function ($scope, $rootScope, $log, myRest) {
  /////////////////////////////////////////////////////////
  // Startup code

  $scope.data = [];
  buildChart();

  // Auto-update
  //var stopAutoRefresh = $interval(function () {
  //  buildChart();
  //}, 5000);
  //$scope.$on('$destroy', function () {
  //  $interval.cancel(stopAutoRefresh);
  //});

  // Startup code
  /////////////////////////////////////////////////////////

  //*****************************************************************
  // Implementation

  function getChartElem() {
    return $('#stat-privil-chart');
  }

  let prevData = undefined;

  function buildChart() {
    let dateStart = $rootScope.dateStart;
    let dateFinish = $rootScope.dateFinish;
    myRest.getStatPaidPrivileges(dateStart, dateFinish).then(
      function (data) {
        // optimization
        if (angular.equals(data, prevData)) {
          return; // just do nothing
        }
        prevData = angular.copy(data);

        // Update scope
        $scope.data = data;

        if (data.length === 0) {
          // drop the chart
          var chart = getChartElem().highcharts();
          if (chart) {
            chart.destroy();
          }
        }
        else {
          // Draw chart
          drawChart(data);
          $scope.resizeDataView();
        }
      },
      function () {
        $scope.data = [];
        prevData = undefined;
      }
    );
  }


  const SERIES_PAID = 'Нельготных поездок';
  const SERIES_PRIVILEGED = 'Льготных поездок';

  function drawChart(data) {
    // Prepare data for the chart
    let xValues = _.map(data, function (item) {
      return item.day.format('DD.MM');
    });
    //log(xValues);
    let yFullyPaid = _.map(data, function (item) {
      return item.fullyPaid;
    });
    let yPrivileged = _.map(data, function (item) {
      return item.privileged;
    });

    // Draw chart
    getChartElem().highcharts({
      chart: {
        zoomType: 'xy',
        backgroundColor: null
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      exporting: {
        enabled: false
      },
      xAxis: [{
        categories: xValues,
        crosshair: true
      }],
      yAxis: [{
        crosshair: true,
        labels: {
          format: '{value}',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        title: {
          text: 'Выполнено поездок, шт',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        allowDecimals: false,
        floor: 0,
        min: 0
      }],
      tooltip: {
        shared: true
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 55,
        floating: true,
        backgroundColor: null
      },
      series: [{
        name: SERIES_PAID,
        type: 'column',
        yAxis: 0,
        data: yFullyPaid,
        tooltip: {
          valueSuffix: ' шт'
        }
      }, {
        name: SERIES_PRIVILEGED,
        type: 'column',
        yAxis: 0,
        data: yPrivileged,
        tooltip: {
          valueSuffix: ' шт'
        }
      }]
    });
  }

  $scope.$watch('dataUpdateCount', function (newVal, oldVal, scope) {
    if (newVal > 0) {
      buildChart();
    }
  });

  $scope.$watch('$rootScope.eventDateFilterChanged', function (newVal, oldVal, scope) {
    if (newVal > 2) {
      prevData = undefined;
      $scope.data = [];
    }
  });

  // Implementation
  //*****************************************************************

  function log(msg) {
    $log.debug(msg);
  }

});
