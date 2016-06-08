'use strict';

angular.module('armCtrlPanelApp')
  .controller('EsekReplenishCtrl', function ($scope) {

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

    $scope.$watch('datePicker.date', function () {
      log('time period changed');
    });

    

  }) // controller

  .filter('DatePickerFilter', function () {
    return function (picker) {
      const dateFrmt = 'DD.MM.YYYY';
      let dtStart = picker.startDate;
      let dtEnd = picker.endDate;
      if (dtStart.isSame(dtEnd, 'day')) {
        if (isToday(dtStart)) {
          return 'сегодня';
        }
        else {
          return dtStart.format(dateFrmt);
        }
      }
      else {
        return `период ${dtStart.format(dateFrmt)} - ${dtEnd.format(dateFrmt)}`;
      }
    };
  });
