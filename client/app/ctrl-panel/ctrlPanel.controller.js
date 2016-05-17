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
        title: 'Эмитенты',
        state: 'ctrl-panel.emitters',
        icon: 'fa-files-o'
      },
      {
        title: 'Акцептанты',
        state: 'ctrl-panel.acceptants',
        icon: 'fa-check-circle-o '
      },
      {
        title: 'Оказываемые услуги',
        state: 'ctrl-panel.services',
        icon: 'fa-list'
      },
      {
        title: 'ЕСЭК:',
        state: 'ctrl-panel.esek-activation',
        icon: 'fa-credit-card '
      }
    ];

    $scope.esekMenuSubItems = [
      {
        title: 'Активация',
        state: 'ctrl-panel.esek-activation',
        icon: 'fa-plus'
      },
      {
        title: 'Блокировка',
        state: 'ctrl-panel.esek-blocking',
        icon: 'fa-lock'
      },
      {
        title: 'Оплата трансп.ресурса',
        state: 'ctrl-panel.esek-replenishment',
        icon: 'fa-bus'
      },
      {
        title: 'Статистика',
        state: 'ctrl-panel.esek-service-stat',
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
