'use strict';

angular.module('armAcceptantApp')
  .controller('Acceptant2Ctrl', function ($scope, $rootScope, $state, $log, Auth, myRest) {
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
        title: 'Способы оплаты',
        state: 'acceptant2.tariffs',
        icon: 'fa-credit-card'
      },
      {
        title: 'Оборудование',
        state: 'acceptant2.hardware',
        icon: 'fa-bus'
      },
      {
        title: 'Транзакции',
        state: 'acceptant2.transactions',
        icon: 'fa-table'
      },
      {
        title: 'Статистика',
        state: 'acceptant2.statistic',
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
