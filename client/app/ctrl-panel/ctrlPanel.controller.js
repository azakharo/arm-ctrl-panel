'use strict';

angular.module('armCtrlPanelApp')
  .controller('CtrlPanelCtrl', function ($scope, $rootScope, $state, $log, Auth, myRest) {
    $scope.Auth = Auth;
    $rootScope.isGettingData = false;

    $scope.isObjectEmpty = isObjectEmpty;
    $scope.getObjectPropNames = getObjectPropNames;

    //$('.anim-text-flow').html(function(i, html) {
    //  var chars = $.trim(html).split("");
    //
    //  return '<span>' + chars.join('</span><span>') + '</span>';
    //});

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
      },
      //{
      //  url: myRest.getAcceptant1Url(),
      //  name: 'Акцептант 1'
      //},
      {
        url: myRest.getAcceptant2Url(),
        name: 'Акцептант'
      },
      {
        url: myRest.getUptimeUrl(),
        name: 'Uptime'
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
        title: 'Пополнение баланса',
        state: 'ctrl-panel.esek-replenish',
        icon: 'fa-bus'
      },
      {
        title: 'Оплата услуг',
        state: 'ctrl-panel.esek-payment',
        icon: 'fa-line-chart'
      }
    ];


    $scope.onMenuItemClick = function (newState) {
      if (newState) {
        $state.go(newState);
      }
    };

    $scope.isCurrentState = function (newState) {
      return newState === $state.$current.name;
    };

    // Sidebar
    /////////////////////////////////////////////////////////////////


    //---------------------------------------------------------------
    // ui-grid resizing

    $scope.resizeGrid = function(gridDivID, newH, newW) {
      var grid = $(gridDivID);
      if (grid) {
        if (newW && grid.width() !== newW) {
          //log(`grid ${gridDivID}: change W, old ${grid.width()}, new ${newW}`);
          grid.width(newW);
        }
        if (newH && grid.height() !== newH) {
          //log(`grid ${gridDivID}: change H, old ${grid.height()}, new ${newH}`);
          grid.height(newH);
        }
      }
    };

    // ui-grid resizing
    //---------------------------------------------------------------


    function log(msg) {
      $log.debug(msg);
    }
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
