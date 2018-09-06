angular.module('pennaApp').controller('addBankBenficiaryCtrl', function ($scope, $rootScope, $uibModalInstance, $state, input, request, mobile) {

	$scope.currUser = input.currUser;
	$scope.netWork = input.netWork;
	$scope.notification = input.notification;
	$scope.logout = input.logout;
	$scope.pennabeneficiaryList = input.pennabeneficiaryList;
	$scope.loader = input.loader;
	$scope.getbankdet = input.getbankdet;
	$scope.getOfflineDataFromLocal = input.getOfflineDataFromLocal;
	$scope.err = {};


	$scope.addpennabenf = function () {
		if ($scope.billingAddrs) {
			var input = {};
			input.userId = $scope.currUser.userId;
			input.accessToken = $scope.currUser.accessToken;
			input.id = $scope.billingAddrs.id;

			input.version = $scope.currUser.version;
input.device_id = $scope.currUser.device_id;
input.device_type = $scope.currUser.device_type;
			$scope.netWork(function (status) {
				if (status) {
					$scope.loader(true);
					request.service('addPbDetailsFromDropDown', 'post', input, function (res) {
						$scope.loader(false);
						if (res.statusCode == "200") {
							$uibModalInstance.close(res);
						} else {
							if (res.dupLogin)
								$scope.logout();
							$scope.notification(res.statusMessage);
						}
					})
				} else {
					var notAdded = true;
					for (var j in $scope.getbankdet.PennaBenificiaryDetails) {
						if (input.id == $scope.getbankdet.PennaBenificiaryDetails[j].id) {
							notAdded = false;
							$scope.notification("Already penna Benificiary existed with these details, you cannot add same details again");
						}
					}
					if (notAdded) {
						$scope.getOfflineDataFromLocal('bankBenifDetails', function (data) {
							$rootScope.safeApply(function () {
								var newOne = true;
								if (data && data.input) {
									for (var i in data.input) {
										if (input.id == data.input[i].id) {
											newOne = false;
											$scope.notification("Already penna Benificiary existed with these details, you cannot add same details again");
										}
									}
								}
								if (newOne)
									$uibModalInstance.close(input)
							});
						});
					}
				}
			});
		} else {
			$scope.notification("Please Select Beneficiary Account", 3000, 'info');
		}
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};


});
