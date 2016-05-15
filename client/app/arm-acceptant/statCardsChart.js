'use strict';

var mod = angular.module('armAcceptantApp');

mod.controller('StatCardsChartCtrl', function ($scope, $rootScope, $log, myRest) {
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
    return $('#stat-cards-chart');
  }

  var prevData = undefined;

  function buildChart() {
    let dateStart = $rootScope.dateStart;
    let dateFinish = $rootScope.dateFinish;
    myRest.getStatPaidByCardType(dateStart, dateFinish).then(
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


  const SERIES_ESEK = 'Оплачено ЕСЭК';
  const SERIES_TICKET = 'Оплачено билетами';

  function drawChart(data) {
    // Prepare data for the chart
    let xValues = _.map(data, function (item) {
      return item.day.format('DD.MM');
    });
    //log(xValues);
    let yPaidByEsek = _.map(data, function (item) {
      return item.totalPaidByEsek;
    });
    let yPaidByTicket = _.map(data, function (item) {
      return item.totalPaidByTicket;
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
      //subtitle: {
      //  text: 'Source: WorldClimate.com'
      //},
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
          text: 'Оплачено поездок, шт',
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
        name: SERIES_ESEK,
        type: 'column',
        yAxis: 0,
        data: yPaidByEsek,
        tooltip: {
          valueSuffix: ' шт'
        }
      }, {
        name: SERIES_TICKET,
        type: 'column',
        yAxis: 0,
        data: yPaidByTicket,
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
