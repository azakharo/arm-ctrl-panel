'use strict';

var mod = angular.module('armAcceptantApp');

mod.controller('StatCommonChartCtrl', function ($scope, $rootScope, $log, $q, myRest) {
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
    return $('#stat-common-chart');
  }

  var prevData = undefined;
  function buildChart() {
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
        let data = passengerStat.map(function (elem, ind) {
          let newStatItem = elem;
          newStatItem.buses = busStat[ind].buses;
          newStatItem.passKm = passKmStat[ind].passKm;
          return newStatItem;
        });

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
      }
    );
  }

  function drawChart(data) {
    // Prepare data for the chart
    let xValues = _.map(data, function(item){
      return item.day.format('DD.MM');
    });
    //log(xValues);
    let yBuses = _.map(data, function(item){
      return item.buses;
    });
    let yPassengers = _.map(data, function(item){
      return item.passengers;
    });
    let yPassKms = _.map(data, function(item){
      return item.passKm;
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
      yAxis: [{ // Primary yAxis
        labels: {
          format: '{value}',
          style: {
            color: Highcharts.getOptions().colors[2]
          }
        },
        title: {
          text: 'Пассажиропоток, чел',
          style: {
            color: Highcharts.getOptions().colors[2]
          }
        },
        opposite: true,
        allowDecimals: false,
        floor: 0
      }, { // Secondary yAxis
        gridLineWidth: 0,
        title: {
          text: 'Транспорт.средства, шт',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        labels: {
          format: '{value}',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        allowDecimals: false,
        floor: 0
      }, { // Tertiary yAxis
        gridLineWidth: 0,
        title: {
          text: 'Пассажирооборот, пасс*км',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        labels: {
          format: '{value}',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        opposite: true
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
        name: 'Транспорт.средства',
        type: 'column',
        yAxis: 1,
        data: yBuses,
        tooltip: {
          valueSuffix: ' шт'
        }
      }, {
        name: 'Пассажирооборот',
        type: 'column',
        yAxis: 2,
        data: yPassKms,
        //marker: {
        //  enabled: false
        //},
        //dashStyle: 'shortdot',
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.1f}  пасс*км</b><br/>'
        }
      }, {
        name: 'Пассажиропоток',
        type: 'column',
        data: yPassengers,
        tooltip: {
          valueSuffix: ' чел'
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
