angular.module('auction').directive('tooLowBidValidate', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, mCtrl) {
      function toLowBidValidation(value) {
        let $rootScope = scope.$root;
        let ratio = value / $rootScope.calculated_max_bid_amount;
        let force_low_bid_match = $rootScope.force_post_low_bid === value;
        if ($rootScope.calculated_max_bid_amount == null || value == null || ratio > 0.3 || force_low_bid_match) {
          mCtrl.$setValidity('tooLowBid', true);
        } else {
          mCtrl.$setValidity('tooLowBid', false);
        }
        // clear force_post_low_bid if the value is changed
        if (! force_low_bid_match){
            $rootScope.set_force_post_low_bid(null);
        }
        return value;
      }
      mCtrl.$parsers.push(toLowBidValidation);
    }
  };
});