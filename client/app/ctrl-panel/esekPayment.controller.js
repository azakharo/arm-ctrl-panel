'use strict';

angular.module('armCtrlPanelApp')
  .controller('EsekPaymentCtrl', function ($scope, $timeout, myRest) {

    $scope.data = [];

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
      myRest.getStatPayment($scope.datePicker.date.startDate, $scope.datePicker.date.endDate).then(
        function (data) {
          $scope.isGettingData = false;
          let data2disp = [];
          const providerNames = getObjectPropNames(data);
          providerNames.forEach(function (provName) {
            const provServices = data[provName];
            const serviceNames = getObjectPropNames(provServices);
            serviceNames.forEach(function (serviceName) {
              data2disp.push({
                provider: provName,
                service: serviceName,
                amount: provServices[serviceName]
              });
            });
          });
          $scope.data = data2disp;
          //log($scope.data);
        },
        function (reason) {
          $scope.isGettingData = false;
          $scope.data = [];
        }
      );
    }

    // Animations
    $scope.showTimePeriod = false;
    $scope.showContent = false;
    bounceUp('#esek-payment-title', false);
    $timeout(() => $scope.showTimePeriod = true, 3500);
    $timeout(function () {
      $scope.showContent = true;
      fixTableHeader();
    }, 4500);

    $(window).resize(function () {
      fixTableHeader();
    });

    function fixTableHeader() {
      $('.tbl-hdr-fixed').stickyTableHeaders({scrollableArea: $('#esek-payment-stat-table')});
    }

    $scope.$watch('datePicker.date', function () {
      getData();
    });

  });
