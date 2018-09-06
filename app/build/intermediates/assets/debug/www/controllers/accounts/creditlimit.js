pennaApp.controller('creditctrl', function ($scope, $rootScope, $uibModal, $log, $state, $window, ctrlComm, request, $location, $sce, $timeout) {



	$scope.credit = function (cb) {
		//var getCreditDetails = function (cb) {
		$scope.netWork(function (status) {
			if (status) {
				$scope.loader(true);
				request.service('getCreditDetailsLive', 'post', $scope.currUser, function (res) {
					$scope.loader(false);
					if (res.credit_limt_list) {
						applyCreditDetails(res, function () {
							creditLimit(res, function () {
								if ($scope.ifMobile) {
									$scope.getOfflineDataFromLocal('dashboard', function (data) {
										if (!data) data = {}
										data.creditDetails = res
										$scope.addOfflineDataInLocal('dashboard', data, function () {
											if (cb) cb();
										});
									});
								} else {
									if (cb) cb();
								}
							});
						});

					} else if (res.dupLogin) {
						$scope.logout();
						$scope.notification(res.statusMessage);
					} else {
						$scope.loader(false);
						if (cb) cb();
					}

				});
			} else {
				$scope.getOfflineDataFromLocal('dashboard', function (data) {
					$rootScope.safeApply(function () {
						if (data && data.creditDetails) {
							applyCreditDetails(data.creditDetails, function () {
								creditLimit(data.creditDetails, function () {
									if (cb) cb();
								});
							});
						} else {
							if (cb) cb();
						}
					})
				});
			}
		});
	}



	function creditLimit(res, cb) {
		if (res.credit_limt_list) {
			$scope.creditDetails = res.credit_limt_list[0];
			$scope.creditDetails.CrdtLimit = parseFloat($scope.creditDetails.CrdtLimit);
			$scope.creditDetails.AvailableCl = parseFloat($scope.creditDetails.AvailableCl);

			if ($scope.creditDetails.OsAmt !== '') {

				$scope.creditDetails.OsAmt = parseFloat($scope.creditDetails.OsAmt);
			} else {

				$scope.creditDetails.OsAmt = '';
			}

			if ($scope.creditDetails.OsOdAmt !== '') {

				$scope.creditDetails.OsOdAmt = parseFloat($scope.creditDetails.OsOdAmt);
			} else {

				$scope.creditDetails.OsOdAmt = '';
			}
			// $scope.creditDetails.OsAmt = parseFloat($scope.creditDetails.OsAmt);
			//$scope.creditDetails.OsOdAmt = parseFloat($scope.creditDetails.OsOdAmt);
			$scope.limit = $scope.creditDetails.CrdtLimit - $scope.creditDetails.AvailableCl;
			if ($scope.limit >= $scope.creditDetails.CrdtLimit) {
				$scope.limit = 100;
			} else {
				$scope.limit = ($scope.creditDetails.CrdtLimit - $scope.creditDetails.AvailableCl) / $scope.creditDetails.CrdtLimit * 100;
			}
		}
		if (cb) cb();
	}


	function applyCreditDetails(res, cb) {
		if (res.credit_limt_list) {
			$scope.creditDetails = res.credit_limt_list[0];
			var splitdate = $scope.creditDetails.PostingDate;
			var myarray12 = splitdate.split('.');
			for (var i = 0; i < myarray12.length; i++) {
				$scope.date_split = myarray12[0];
				$scope.month_split = myarray12[1];
				$scope.year_split = myarray12[2];
			}
			var months13 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			var date11 = new Date();
			var month11 = date11.getMonth();
			$scope.month2 = months13[month11];
		}
		if (cb) cb();
	}


});
