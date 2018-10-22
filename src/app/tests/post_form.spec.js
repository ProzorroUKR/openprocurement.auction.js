describe('Post Bid Form Tests', function () {
  var controller, scope, rootScope, $timeout;

  beforeEach(module('auction'));
  beforeEach(inject(function($injector, _$controller_, _$rootScope_, AuctionUtils){
    $timeout = $injector.get('$timeout');
    scope = _$rootScope_.$new();
    rootScope = _$rootScope_;
    controller = _$controller_('AuctionController', {$scope: scope, AuctionUtils: AuctionUtils, $rootScope: rootScope});
  }));

  beforeEach(inject(function($compile, $rootScope) {
    var element = angular.element(
      '<form id="BidsForm" name="form.BidsForm" role="form">' +
      '<input name="bid" ng-model="$root.form.bid" too-low-bid-validate format>' +
      '</form>'
    );
    rootScope.form = {bid: null }
    rootScope.calculated_max_bid_amount = 1000;
    $compile(element)(rootScope);
  }));

  it('should raise validation error if bid is 30% of max allowed', function () {
      scope.form.BidsForm.bid.$setViewValue('300');
      scope.$digest();
      expect(scope.form.bid).toEqual(300);
      expect(scope.form.BidsForm.bid.$valid).toBe(false);
      expect(scope.form.BidsForm.bid.$error.tooLowBid).toBe(true);
  });

  it('should not raise validation error if bid field is empty', function () {
      scope.$digest();
      expect(scope.form.bid).toEqual(null);
      expect(scope.form.BidsForm.bid.$valid).toBe(true);
      expect(scope.form.BidsForm.bid.$error.tooLowBid).toBe(undefined);
  });

  it('should raise validation error if bid is zero', function () {
      scope.form.BidsForm.bid.$setViewValue("0");
      scope.$digest();

      expect(scope.form.bid).toEqual(0);
      expect(scope.form.BidsForm.bid.$valid).toBe(false);
      expect(scope.form.BidsForm.bid.$error.tooLowBid).toBe(true);
  });

  it('should not raise exception if bid is greater than 30% of max allowed', function () {
      scope.form.BidsForm.bid.$setViewValue('300.01');
      scope.$digest();
      expect(scope.form.bid).toEqual(300.01);
      expect(scope.form.BidsForm.bid.$valid).toBe(true);
      expect(scope.form.BidsForm.bid.$error.tooLowBid).toBe(undefined);
  });

  it('should disable validation once post_bid is called', function () {
      scope.form.BidsForm.bid.$setViewValue('300');
      scope.$digest();
      expect(scope.form.bid).toEqual(300);

      scope.post_bid();
      $timeout.flush();

      expect(scope.form.BidsForm.bid.$valid).toBe(true);
      expect(scope.form.BidsForm.bid.$error.tooLowBid).toBe(undefined);
  });

});