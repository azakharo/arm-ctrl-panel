'use strict';

angular.module('armCtrlPanelApp')
  .controller('EsekReplenishCtrl', function ($scope, $rootScope, $timeout, myRest) {

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
      myRest.getStatReplenishment($scope.datePicker.date.startDate, $scope.datePicker.date.endDate).then(
        function (data) {
          $rootScope.isGettingData = false;
          $scope.data = data;
          //log(data);
        },
        function (reason) {
          $rootScope.isGettingData = false;
          $scope.data = {};
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


    $scope.$watch('datePicker.date', function () {
      getData();
    });

  }); // controller
