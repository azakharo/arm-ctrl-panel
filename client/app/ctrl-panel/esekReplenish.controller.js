'use strict';

angular.module('armCtrlPanelApp')
  .controller('EsekReplenishCtrl', function ($scope, myRest) {

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
      $scope.isGettingData = true;
      myRest.getStatReplenishment($scope.datePicker.date.startDate, $scope.datePicker.date.endDate).then(
        function (data) {
          $scope.isGettingData = false;
          $scope.data = data;
          //log(data);
        },
        function (reason) {
          $scope.isGettingData = false;
          $scope.data = {};
        }
      );
    }

    $scope.isObjectEmpty = isObjectEmpty;
    $scope.getObjectPropNames = getObjectPropNames;

    $scope.$watch('datePicker.date', function () {
      getData();
    });

  }); // controller
