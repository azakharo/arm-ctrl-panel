'use strict';

angular.module('armCtrlPanelApp')
  .controller('EsekReplenishCtrl', function ($scope, $rootScope, $timeout, $q, myRest) {

    $rootScope.isGettingData = true;
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
      $rootScope.isGettingData = true;
      $q.all([
          myRest.getTariffs(),
          myRest.getStatReplenishment($scope.datePicker.date.startDate, $scope.datePicker.date.endDate)
      ]).then(
        function (data) {
          //log(data[0]);
          $scope.tariffs = data[0];
          $scope.data = data[1];
          $rootScope.isGettingData = false;
          fixTableHeaders();
          //log(data);
        },
        function (reason) {
          $scope.data = {};
          $rootScope.isGettingData = false;
        }
      );
    }

    // Animations
    //$scope.showTimePeriod = false;
    //$scope.showContent = false;
    //bounceUp('#esek-replenish-title', false);
    //$timeout(() => $scope.showTimePeriod = true, 3500);
    //$timeout(() => $scope.showContent = true, 4500);
    $scope.showTimePeriod = true;
    $scope.showContent = true;


    /////////////////////////////////////////////////////////////////
    // Fix table headers

    $(window).resize(function () {
      fixTableHeaders();
    });

    function fixTableHeaders() {
      $('#esek-replenish-total-tbl').stickyTableHeaders({scrollableArea: $('#esek-replenish-total-tbl-wrapper')});
      $('#esek-replenish-detail-tbl').stickyTableHeaders({scrollableArea: $('#esek-replenish-detail-tbl-wrapper')});
    }

    // Fix table headers
    /////////////////////////////////////////////////////////////////


    $scope.$watch('datePicker.date', function () {
      getData();
    });

  }) // controller

  .filter('currencyCode2Name', function() {
    return function (curCode, tariffs) {
      const tar = _.find(tariffs, (t) => t.currency.code === curCode);
      return tar ? tar.name : curCode;
    };
  });
