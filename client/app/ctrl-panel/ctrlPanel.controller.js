'use strict';

angular.module('armCtrlPanelApp')
  .controller('CtrlPanelCtrl', function ($scope, $rootScope, $state, $log, Auth, myRest) {
    $scope.Auth = Auth;
    $rootScope.isGettingData = false;

    $scope.onSettingsBtnClick = function() {
      log("settings clicked");
    };

    $scope.onLogOutBtnClick = function() {
      $state.go('login');
      Auth.logout();
    };

    // Navi menu
    $scope.naviMenuItems = [
      {
        url: myRest.getDashboardUrl(),
        name: 'Дашборд'
      }
    ];

    /////////////////////////////////////////////////////////////////
    // Sidebar

    $scope.menuItems = [
      {
        title: 'Оборудование',
        state: 'ctrl-panel.hardware',
        icon: 'fa-bus'
      },
      {
        title: 'Транзакции',
        state: 'ctrl-panel.transactions',
        icon: 'fa-table'
      },
      {
        title: 'Статистика',
        state: 'ctrl-panel.statistic',
        icon: 'fa-line-chart'
      }
    ];

    $scope.onMenuItemClick = function (newState) {
      $state.go(newState);
    };

    $scope.isCurrentState = function (newState) {
      return newState === $state.$current.name;
    };

    // Sidebar
    /////////////////////////////////////////////////////////////////

    // handling of window resizing
    $scope.resizeDataView = function () {
    };

    function log(msg) {
      $log.debug(msg);
    }
  });
