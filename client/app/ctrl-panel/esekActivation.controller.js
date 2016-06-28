'use strict';

angular.module('armCtrlPanelApp')
  .controller('EsekActivationCtrl', function ($scope, $rootScope, $q, myRest) {

    $scope.data = {};

    //=======================================================
    // Date range picker

    $scope.datePicker = {};
    $scope.datePicker.date = {
      startDate: moment().startOf('day').subtract(1, 'months'), endDate: moment()
    };
    $scope.today = moment();

    $scope.dateRangePickerOpts = {
      eventHandlers: {
        'apply.daterangepicker': function () {
          //log("apply btn clicked");
        },
        'cancel.daterangepicker': function () {
          //log("cancel btn clicked");
        }
      },
      "locale": {
        "applyLabel": "ОК",
        "cancelLabel": "Отмена",
        "customRangeLabel": "Выбрать"
      },
      ranges: {
        'С начала недели': [moment().startOf('week'), moment()],
        'С начала месяца': [moment().startOf('month'), moment()],
        'За последние 30 дней': [moment().subtract(29, 'days').startOf('day'), moment()]
      }
    };

    // Date range picker
    //=======================================================

    function getData() {
      const deffered = $q.defer();

      $rootScope.isGettingData = true;
      myRest.getStatEsekActivat($scope.datePicker.date.startDate, $scope.datePicker.date.endDate).then(
        function (data) {
          $rootScope.isGettingData = false;
          $scope.data = data;
          //log(data);
          deffered.resolve(data);
        },
        function (reason) {
          $rootScope.isGettingData = false;
          $scope.data = {};
          deffered.reject(reason);
        }
      );

      return deffered.promise;
    }

    // Reaction on date range change
    $scope.$watch('datePicker.date', function () {
      getData().then(
        data => buildChart(),
        reason => buildChart()
      );
    });

    ///////////////////////////////////////////////////////////////////////////
    // Draw chart

    function getChartElem() {
      return $('#esek-activat-chart');
    }

    function buildChart() {
      const data = $scope.data;

      if (!data || isObjectEmpty(data)) {
        // drop the chart
        var chart = getChartElem().highcharts();
        if (chart) {
          chart.destroy();
        }
      }
      else {
        // Draw chart
        drawChart(data);
      }
    }

    function drawChart(data) {
      getChartElem().highcharts({
        chart: {
          type: 'pie',
          backgroundColor: null,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
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
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: false,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        series: [{
          name: 'активаций',
          colorByPoint: true,
          data: [
            {
              name: 'Льготных',
              y: data.exempted
            },
            {
              name: 'Нельготных',
              y: data.nonexempted
            }
          ]
        }]
      });
    }

    // Draw chart
    ///////////////////////////////////////////////////////////////////////////

  }); // controller
