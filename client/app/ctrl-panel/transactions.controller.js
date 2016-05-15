'use strict';

const DISP_STR_ESEK = "ЕСЭК";
const DISP_STR_TICKET = "электрон.билет";

angular.module('armCtrlPanelApp')
  .controller('TransactionsCtrl', function ($scope, $rootScope, $log, $filter, $q, uiGridConstants, localStorageService,
                                            myRest) {
    $rootScope.isGettingData = true;

    $scope.$on('$destroy', function () {
      saveGridState();
    });

    ///////////////////////////////////////////////////////
    // Grid state save / restore

    const gridStateStorageKey = 'transGridState';

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
      startDate: moment().startOf('day').subtract(2, 'months'), endDate: moment()
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


    /////////////////////////////////////////////////////////////////
    // Filter dropdowns

    const commonDdSettings = {
      externalIdProp: '', // necessary to select whole objects
      smartButtonMaxItems: 3,
      scrollable: true
    };
    $scope.ruTranslation = ddMultiSelectTranslationRU;

    //=========================
    // Get data for all filters

    $scope.busOptions = [];
    $scope.selectedBuses = [];
    $scope.paymentMethOptions = [];
    $scope.selectedPaymentMethods = [];
    $q.all([
      myRest.getTerminals(),
      myRest.getTariffs()
    ]).then(
      function (results) {
        const terms = results[0];
        const tars = results[1];

        // Buses
        const buses = _.map(terms, function(t) {
          return {name: t.number};
        });
        $scope.busOptions = buses;
        $scope.selectedBuses = angular.copy(buses);

        // Payment methods
        let payMeths = _.map(tars, function (t) {
          return {
            name: t.name,
            currency: t.currency
          };
        });
        $scope.selectedPaymentMethods = angular.copy(payMeths);
        $scope.paymentMethOptions = payMeths;

        $rootScope.isGettingData = false;
      },
      function (reason) {
        $rootScope.isGettingData = false;
      }
    );

    // Get data for all filters
    //=========================

    // Bus filter
    let busDdSettings = angular.copy(commonDdSettings);
    busDdSettings.displayProp = 'name';
    busDdSettings.idProp = 'name';
    busDdSettings.scrollable = false;
    $scope.busDdSettings = busDdSettings;

    // Payment methods
    let paymentMethSettings = angular.copy(commonDdSettings);
    paymentMethSettings.displayProp = 'name';
    paymentMethSettings.idProp = 'name';
    paymentMethSettings.scrollable = true;
    paymentMethSettings.smartButtonMaxItems = 1;
    $scope.paymentMethSettings = paymentMethSettings;

    // Card types
    const CARD_TYPE_ESEK = {
      name: DISP_STR_ESEK
    };
    const CARD_TYPE_TICKET = {
      name: DISP_STR_TICKET
    };
    let cardTypes = [CARD_TYPE_ESEK, CARD_TYPE_TICKET];
    $scope.selectedCardTypes = angular.copy(cardTypes);
    $scope.cardTypeOptions = cardTypes;
    let cardTypeSettings = angular.copy(commonDdSettings);
    cardTypeSettings.displayProp = 'name';
    cardTypeSettings.idProp = 'name';
    $scope.cardTypeSettings = cardTypeSettings;

    //// Card numbers
    //$scope.selectedCards = [];
    //$scope.cardOptions = [];
    //myRest.getAccounts().then(
    //  function (accounts) {
    //    let cards = _.map(accounts, function (acc) {
    //      return {
    //        num: acc.number,
    //        accountId: acc.id,
    //        isEsek: myRest.isEsek(acc)
    //      };
    //    });
    //    $scope.selectedCards = angular.copy(cards);
    //    $scope.cardOptions = cards;
    //  }
    //);
    //let cardSettings = angular.copy(commonDdSettings);
    //cardSettings.displayProp = 'num';
    //cardSettings.idProp = 'num';
    //cardSettings.scrollable = true;
    //cardSettings.enableSearch = true;
    //cardSettings.smartButtonMaxItems = 1;
    //$scope.cardSettings = cardSettings;

    // Filter dropdowns
    /////////////////////////////////////////////////////////////////


    // Disable the Load button if the filters have not been changed
    $scope.isFilterChanged = true;
    $scope.$watchCollection('selectedBuses', () => $scope.isFilterChanged = true);
    $scope.$watchCollection('selectedPaymentMethods', () => $scope.isFilterChanged = true);
    $scope.$watchCollection('selectedCardTypes', () => $scope.isFilterChanged = true);
    $scope.$watchCollection('selectedCards', () => $scope.isFilterChanged = true);
    $scope.$watch('datePicker.date', () => $scope.isFilterChanged = true);


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
        if (col.name === 'time') {
          return $filter('date')(input, 'dd.MM.yyyy HH:mm');
        }
        else if (col.name === 'cardType') {
          return input.isEsek ? DISP_STR_ESEK : DISP_STR_TICKET;
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
      }
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
        displayName: 'Время',
        name: 'time',
        field: 'timestamp',
        cellFilter: 'transTimeFilter',
        enableFiltering: false
      },
      {
        displayName: 'Борт',
        field: 'bus',
        enableFiltering: false
      },
      {
        displayName: 'Способ оплаты',
        field: 'tariff.name',
        enableFiltering: false
      },
      {
        displayName: 'Тип карты',
        name: 'cardType',
        field: 'card.isEsek',
        cellFilter: 'cardTypeFilter',
        enableFiltering: false
      },
      {
        displayName: '№ карты',
        field: 'card.num',
        cellClass: "text-right",
        headerCellClass: "text-right"
      }
    ];

    $scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    $scope.gridOptions.enableVerticalScrollbar = uiGridConstants.scrollbars.WHEN_NEEDED;
    $scope.gridOptions.enableColumnMenus = false;
    $scope.gridOptions.paginationPageSizes = [50, 100, 200, 250, 500];
    $scope.gridOptions.data = [];
    $scope.gridOptions.enableFiltering = true;
    $scope.gridOptions.enableGridMenu = true;
    $scope.gridOptions.exporterMenuPdf = false;

    // ui-grid setup
    //-----------------------------------


    $scope.noData = false;
    let isFirstLoad = true;
    $scope.onLoadBtnClick = function () {
      $scope.gridOptions.data = [];
      $rootScope.isGettingData = true;

      // Filtering by payment methods
      let currencyIds = null;
      const selPayMeths = $scope.selectedPaymentMethods;
      if (selPayMeths && selPayMeths.length > 0 && selPayMeths.length != $scope.paymentMethOptions.length) {
        currencyIds = _.map(selPayMeths, function (pm) {
          return pm.currency.srvID;
        });
      }

      // Filtering by bus names
      let busNames = null;
      const selBuses = $scope.selectedBuses;
      if (selBuses && selBuses.length > 0 && selBuses.length != $scope.busOptions.length) {
        busNames = _.map(selBuses, function (b) {
          return b.name;
        });
      }

      $q.all([
        myRest.getAccounts(),
        myRest.getPaymentsBy($scope.datePicker.date.startDate, $scope.datePicker.date.endDate, currencyIds, busNames)
      ]).then(
        function (results) {
          const accounts = _.map(results[0], function (acc) {
            return {
              num: acc.number,
              accountId: acc.id,
              isEsek: myRest.isEsek(acc)
            };
          });
          let payments = results[1];

          // Filter the transactions by card numbers, if specified
          const selCards = $scope.selectedCards;
          if (selCards && selCards.length > 0 && selCards.length != $scope.cardOptions.length) {
            // selected cards => accountIds
            const selectedAccountIds = _.map(selCards, 'accountId');
            payments = _.filter(payments, function (paymnt) {
              return _.includes(selectedAccountIds, paymnt.accountId);
            })
          }

          // Filter the transactions by card type, if necessary
          const selCardTypes = $scope.selectedCardTypes;
          if (selCardTypes && selCardTypes.length > 0 && selCardTypes.length != $scope.cardTypeOptions.length) {
            // it can be either ESEK or ticket
            // if ESEK
            if (_.find(selCardTypes, ['name', CARD_TYPE_ESEK.name])) {
              payments = _.filter(payments, function (paymnt) {
                // Get account
                const account = _.find(accounts, ['accountId', paymnt.accountId]);
                if (account) {
                  return account.isEsek;
                }
                else {
                  return false;
                }
              });
            }

            // if ticket
            if (_.find(selCardTypes, ['name', CARD_TYPE_TICKET.name])) {
              payments = _.filter(payments, function (paymnt) {
                // Get account
                const account = _.find(accounts, ['accountId', paymnt.accountId]);
                if (account) {
                  return !account.isEsek;
                }
                else {
                  return false;
                }
              });
            }
          }
          $scope.gridOptions.data = _.map(payments, function (paymnt) {
            const account = _.find(accounts, ['accountId', paymnt.accountId]);
            const tariff = _.find($scope.paymentMethOptions, function (tariff) {
              return paymnt.currencyId === tariff.currency.srvID;
            });
            return {
              timestamp: paymnt.timestamp,
              card: account,
              tariff: tariff,
              bus: paymnt.source.terminal
            };
          });

          $scope.noData = $scope.gridOptions.data.length === 0;

          $rootScope.isGettingData = false;
          $scope.isFilterChanged = false;

          if (isFirstLoad) {
            restoreGridState();
            isFirstLoad = false;
          }

          //log(payments);
          //log(payments.length);
        },
        function (reason) {
          $rootScope.isGettingData = false;
        });
    };

    function log(msg) {
      $log.debug(msg);
    }
  })

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
  })

  .filter('transTimeFilter', function () {
    return function (timestamp) {
      return moment.unix(timestamp).format('DD.MM.YYYY HH:mm');
    };
  })

  .filter('cardTypeFilter', function () {
    return function (isEsek) {
      return isEsek ? DISP_STR_ESEK : DISP_STR_TICKET;
    };
  });
