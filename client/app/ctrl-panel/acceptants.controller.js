'use strict';

angular.module('armCtrlPanelApp')
  .controller('AcceptantsCtrl', function ($scope, $rootScope, uiGridConstants, myRest) {
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
        displayName: 'Акцептант',
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

    $scope.acceptants = [];
    updateAcceptants();

    // Initialization
    /////////////////////////////////////////////////////////

    function updateAcceptants() {
      $rootScope.isGettingData = true;
      myRest.getAllProviders().then(
        function (providers) {
          $scope.acceptants = _.filter(providers, function (prov) {
            return prov.meta && prov.meta.roles && _.includes(prov.meta.roles, "acceptant");
          });
          $scope.gridOptions.data = $scope.acceptants;
          $rootScope.isGettingData = false;
        },
        function (reason) {
          $scope.gridOptions.data = [];
          $rootScope.isGettingData = false;
        }
      );
    }

    ///////////////////////////////////////////////////////
    // Grid resizing

    function resizeTable() {
      const newW = Math.floor( window.innerWidth - $('#sidebar').width() - 40 );
      const newH = Math.floor( window.innerHeight - $('#header').height() - $('#footer').height() -
      $('#acceptants-title').height() - 60 );
      $scope.resizeGrid('#acceptants-table', newH, newW);
    }

    let onWindowResize = debounce(function () {
      resizeTable();
    }, 500);

    $(window).resize(onWindowResize);

    // Grid resizing
    ///////////////////////////////////////////////////////

  });
