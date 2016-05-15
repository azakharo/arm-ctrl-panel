'use strict';

describe('Controller: ArmAcceptantCtrl', function () {

  // load the controller's module
  beforeEach(module('armAcceptantApp'));

  var ArmAcceptantCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArmAcceptantCtrl = $controller('ArmAcceptantCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
