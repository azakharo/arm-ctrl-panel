'use strict';

angular.module('armCtrlPanelApp')
  .controller('EmittersCtrl', function ($scope, $rootScope, $timeout, uiGridConstants, myRest) {

    /////////////////////////////////////////////////////////
    // Initialization

    //-----------------------------------
    // ui-grid setup

    $scope.gridOptions = {};
    $scope.gridOptions.columnDefs = [
      {
        displayName: 'Приложение',
        field: 'app.title'
      },
      {
        displayName: 'Эмитент',
        field: 'title'
      },
      {
        displayName: 'Описание',
        field: 'description'
      }
    ];

    $scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    $scope.gridOptions.enableVerticalScrollbar = uiGridConstants.scrollbars.WHEN_NEEDED;
    $scope.gridOptions.enableColumnMenus = false;
    $scope.gridOptions.data = [];

    // ui-grid setup
    //-----------------------------------

    $scope.emitters = [];
    updateEmitters();

    // Initialization
    /////////////////////////////////////////////////////////

    function updateEmitters() {
      if (isRestDebug) {
        let data = [
          {
            app: {
              title: 'Транспортное'
            },
            title: 'ОАО "Пассажир" г.Саров',
            description: 'междугородние перевозки'
          },
          {
            app: {
              title: 'Транспортное'
            },
            title: 'ОАО "Попутчик" г.Саров',
            description: 'междугородние перевозки'
          },
          {
            app: {
              title: 'Транспортное'
            },
            title: 'МУП "ГорАвтоТранс" г.Саров',
            description: 'междугородние перевозки'
          }
        ];
        $scope.emitters = data;
        $scope.gridOptions.data = data;
        $timeout(resizeTable, 100);
      }
      else {
        $rootScope.isGettingData = true;
        myRest.getAllProviders().then(
          function (providers) {
            $scope.emitters = _.filter(providers, function (prov) {
              return prov.meta && prov.meta.roles && _.includes(prov.meta.roles, "emitent");
            });
            $scope.gridOptions.data = $scope.emitters;
            $rootScope.isGettingData = false;
            $timeout(resizeTable, 100);
          },
          function (reason) {
            $scope.gridOptions.data = [];
            $rootScope.isGettingData = false;
          }
        );
      }
    }

    ///////////////////////////////////////////////////////
    // Grid resizing

    function resizeTable() {
      const newW = Math.floor( window.innerWidth - $('#sidebar').width() - 40 );
      const newH = Math.floor( window.innerHeight - $('#header').height() - $('#footer').height() -
      $('#emitters-title').height() - 40 );
      $scope.resizeGrid('#emitters-table', newH, newW);
    }

    let onWindowResize = debounce(function () {
      resizeTable();
    }, 500);

    $(window).resize(onWindowResize);

    // Grid resizing
    ///////////////////////////////////////////////////////

  });
