'use strict';

angular.module('armCtrlPanelApp')
  .controller('StatisticCtrl', function ($scope, $rootScope, $log, $filter, $q,
                                         uiGridConstants, uiGridGroupingConstants,
                                         localStorageService, myRest) {
    $rootScope.isGettingData = false;

    $scope.$on('$destroy', function () {
      saveGridState();
    });

    ///////////////////////////////////////////////////////
    // Grid state save / restore

    const gridStateStorageKey = 'statGridState';

    function saveGridState() {
      const gridState = $scope.gridApi.saveState.save();
      localStorageService.set(gridStateStorageKey, gridState);
      //log("grid state saved");
    }

    function restoreGridState() {
      let gridState = localStorageService.get(gridStateStorageKey);
      if (gridState) {
        $scope.gridApi.saveState.restore($scope, gridState);
        //log("grid state restored");
      }
    }

    // Grid state save / restore
    ///////////////////////////////////////////////////////


    //=======================================================
    // Date range picker

    $scope.datePicker = {};
    $scope.datePicker.date = {
      startDate: moment().startOf('day').subtract(1, 'weeks'), endDate: moment()
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


    // Disable the Load button if the filters have not been changed
    $scope.isFilterChanged = true;
    $scope.$watch('datePicker.date', () => $scope.isFilterChanged = true);

    // Disable the Load button if the grouping has not been changed
    const statGroupTypeStorageKey = "statGroupType";
    const groupType = localStorageService.get(statGroupTypeStorageKey);
    $scope.groupBy = groupType ? groupType : 'day';
    $scope.$watch('groupBy', function () {
      setGrouping();
      localStorageService.set(statGroupTypeStorageKey, $scope.groupBy);
    });


    //-----------------------------------
    // ui-grid setup

    /////////////////////////////////
    // Exporting

    $scope.exportFormat = 'csv';

    $scope.gridOptions = {
      exporterPdfDefaultStyle: {fontSize: 9},
      exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
      exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
      exporterPdfOrientation: 'landscape',
      exporterPdfPageSize: 'LETTER',
      exporterPdfMaxGridWidth: 500,
      exporterHeaderFilter: function( displayName ) {
        // Can customize headers
        return displayName;
      },
      exporterFieldCallback: function( grid, row, col, input ) {
        // Can decode or transform field values
        if (col.name === 'day') {
          return $filter('date')(input, 'dd.MM.yyyy');
        }
        else {
          return input;
        }
      },

      onRegisterApi: function(gridApi){
        $scope.gridApi = gridApi;

        // Save grid state on column position changed
        gridApi.colMovable.on.columnPositionChanged($scope, function(colDef, originalPosition, newPosition) {
          saveGridState();
        });

        // Save grid state on column visibility changed
        gridApi.core.on.columnVisibilityChanged($scope, function (column) {
          saveGridState();
        });
      },

      // State save/restore options
      saveGrouping: false,
      saveGroupingExpandedStates: false
    };

    $scope.onExportBtnClick = function() {
      if ($scope.exportFormat == 'csv') {
        $scope.gridApi.exporter.csvExport('all', 'all');
      } else if ($scope.exportFormat == 'pdf') {
        $scope.gridApi.exporter.pdfExport('all', 'all');
      }
    };

    // Exporting
    /////////////////////////////////

    $scope.gridOptions.columnDefs = [
      {
        displayName: 'Дата',
        name: 'day',
        field: 'day.toDate()',
        type: 'date',
        cellFilter: 'date: "dd.MM.yyyy"',
        sort: {
          direction: 'desc'
        }
      },
      {
        displayName: 'Борт',
        field: 'bus',
        customTreeAggregationFinalizerFn: function (aggregation) {
          if (aggregation.type === 'count') {
            if (aggregation.label) {
              aggregation.rendered = "всего бортов: " + aggregation.value;
            }
            else if (aggregation.groupVal) {
              aggregation.rendered = aggregation.groupVal;
            }
            else {
              aggregation.rendered = aggregation.value;
            }
          }
          else {
            aggregation.rendered = aggregation.value;
          }
        }
      },
      {
        displayName: 'Пассажиропоток',
        field: 'passengers',
        cellClass: "text-right",
        headerCellClass: "text-right",
        headerTooltip: 'кол-во перевезённых пассажиров'
      },
      {
        displayName: 'Пассажирооборот',
        name: 'passKm',
        field: 'passKm',
        cellClass: "text-right",
        headerCellClass: "text-right",
        headerTooltip: 'пассажиро-километры'
      }
    ];

    $scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    $scope.gridOptions.enableVerticalScrollbar = uiGridConstants.scrollbars.WHEN_NEEDED;
    $scope.gridOptions.enableColumnMenus = false;
    $scope.gridOptions.data = [];
    $scope.gridOptions.enableGridMenu = true;
    $scope.gridOptions.exporterMenuPdf = false;

    // ui-grid setup
    //-----------------------------------


    $scope.noData = false;
    let isFirstLoad = true;
    $scope.onLoadBtnClick = function () {
      $scope.gridOptions.data = [];
      $rootScope.isGettingData = true;

      $q.allSettled([
        myRest.getStatPassengersPerDayPerBus($scope.datePicker.date.startDate, $scope.datePicker.date.endDate),
        myRest.getStatPassKmPerDayPerBus($scope.datePicker.date.startDate, $scope.datePicker.date.endDate)
      ]).then(
        function (results) {
          clearFlags();

          results = _.map(results, function(res){
            return res.state === 'fulfilled' ? res.value : [];
          });

          // Combine obtained results in one data bunch
          let data = results[0];
          const passKmData = results[1];
          _.forEach(data, function (dataItem) {
            const passKmDataItem = _.find(passKmData, function (item) {
              return item.day.isSame(dataItem.day) && item.bus === dataItem.bus;
            });
            if (passKmDataItem) {
              dataItem.passKm = passKmDataItem.passKm;
            }
          });

          $scope.gridOptions.data = _.reverse(data);
          $scope.noData = $scope.gridOptions.data.length === 0;

          if (isFirstLoad) {
            restoreGridState();
            isFirstLoad = false;
          }

          setGrouping();
        },
        function (reason) {
          clearFlags();
        });
    };

    function setGrouping() {
      $scope.gridApi.grouping.clearGrouping();
      $scope.gridApi.grouping.groupColumn($scope.groupBy);
      $scope.gridApi.grouping.aggregateColumn('passengers', uiGridGroupingConstants.aggregation.SUM);
      $scope.gridApi.grouping.aggregateColumn('passKm', uiGridGroupingConstants.aggregation.SUM);
      if ($scope.groupBy === 'day') {
        $scope.gridApi.grouping.aggregateColumn('bus', uiGridGroupingConstants.aggregation.COUNT);
      }
    }

    function clearFlags() {
      $scope.noData = false;
      $rootScope.isGettingData = false;
      $scope.isFilterChanged = false;
    }

    function log(msg) {
      $log.debug(msg);
    }
  });
