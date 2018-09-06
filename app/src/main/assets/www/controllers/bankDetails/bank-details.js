//MODAL FOR ADDING BANK ACCOUNT and getting 
angular.module('pennaApp').controller('bankAccountctrl', function ($scope, $rootScope, $uibModal, request, $log, mobile, ctrlComm) {

	getBankDetails();

	function getBankDetails(cb) {
		$scope.netWork(function (status) {
			if (status) {
				$scope.loader(true);
				request.service('getBankDetails', 'post', $scope.currUser, function (res) {
					$scope.loader(false);
					if (res.BankDetails) {
						showLatestImages(res, function (res) {
							$scope.getbankdet = res;
							if ($scope.ifMobile) {
								$scope.addOfflineDataInLocal('allBankDetails', res);
							}
							if (cb) cb();
						});
					} else if (res.dupLogin) {
						$scope.logout();
						$scope.notification(res.statusMessage);
					}
				});
			} else {
				$scope.getOfflineDataFromLocal('allBankDetails', function (data) {
					$rootScope.safeApply(function () {
						$scope.getbankdet = data;
						if (cb) cb();
					})
				});
			}
		});
	}

	function showLatestImages(res, cb) {
		for (var i in res.BankDetails) {
			if (res.BankDetails[i].image) {
				res.BankDetails[i].image = res.BankDetails[i].image + '?lastmod=' + new Date().getTime();
			}
		}
		cb(res)
	}



	$scope.imageSelected = function (bankdata, index) {
		var ele = document.getElementById('addBankAttachInput' + index);
		var file = ele.files[0];
		var reader = new FileReader();
		reader.onload = function () {
			$scope.notification("image uploaded successfully");
			uploadBankImage(bankdata, reader.result);
		}
		reader.readAsDataURL(file);
	}

	$scope.mobileBankAtachment = function (bankdata, index) {
		id = 'addBankAttachInput' + index;
		document.getElementById(id).click();
		mobile.chooseImage(function (img) {
			$scope.notification("image uploaded successfully");
			uploadBankImage(bankdata, img);
		});
	}

	var input;

	function uploadBankImage(list, img) {
		input = {};
		input.bankImageBlob = img;
		input.indicator = 'T';
		input.userId = $scope.currUser.userId;
		input.accessToken = $scope.currUser.accessToken;
		input.bankName = list.bankName;
		input.accntName = list.accntName;
		input.accountNumber = list.accountNumber;
		input.ifsccode = list.ifsccode;
		input.bankAddress = list.bankAddress;
		input.micr = list.micr;
		input.id = list.id;

		input.version = $scope.currUser.version;
		input.device_id = $scope.currUser.device_id;
		input.device_type = $scope.currUser.device_type;
		$scope.netWork(function (status) {
			if (status) {
				request.service('addBankDetails', 'post', input, function (res) {
					getBankDetails();
					$scope.loader(false);
					if (res.statusCode == "200") {
						$scope.notification(res.statusMessage);
					} else if (res.dupLogin) {
						$scope.logout();
						$scope.notification(res.statusMessage);
					}
				})
			} else {
				saveBankDetailsinLocal(input);
			}
		})
	}

	$scope.addBankDetails = function () {
		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: 'static',
			templateUrl: 'pages/profile/bankDetails/addBankDetails.html',
			controller: 'addBankDetailsCtrl',
			size: 'md',
			resolve: {
				input: function () {
					return {
						netWork: $scope.netWork,
						currUser: $scope.currUser,
						notification: $scope.notification,
						chooseImage: $scope.chooseImage,
						loader: $scope.loader,
						logout: $scope.logout
					}
				}
			}
		});

		modalInstance.result.then(function (oData) {
			if (oData.statusMessage) {
				$scope.notification(oData.statusMessage);
				getBankDetails();
			} else if ($scope.ifMobile) {
				saveBankDetailsinLocal(oData);
			}
		}, function () {

		});
	};

	function saveBankDetailsinLocal(oData) {
		$scope.getOfflineDataFromLocal('bankDetails', function (data) {
			$rootScope.safeApply(function () {
				if (!data || !data.input) {
					data = {
						key: 'addBankDetails',
						type: 'post',
						input: []
					};
				}
				data.input.push(oData);
				$scope.addOfflineDataInLocal('bankDetails', data);
				$scope.getOfflineDataFromLocal('allBankDetails', function (allData) {
					oData.image = oData.bankImageBlob;
					if (!allData) allData = {}
					if (!allData.BankDetails) allData.BankDetails = [];
					allData.BankDetails.push(oData);
					$scope.addOfflineDataInLocal('allBankDetails', allData, function () {
						request.setItem('localDataSubmitted', 'false')
						$scope.notification("Hey you are in offline mode! Will update bank details successfully once you are online!");
						getBankDetails()
					})
				});
			});
		});
	}


	$scope.addBankBenficiary = function (size) {
		if (!$scope.pennabeneficiaryList) {
			$scope.getAllListItems(function () {
				addBenficiary();
			});
		} else {
			addBenficiary();
		}

		function addBenficiary() {
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'pages/profile/bankDetails/addBankBenficiary.html',
				controller: 'addBankBenficiaryCtrl',
				size: size,
				resolve: {
					input: function () {
						return {
							netWork: $scope.netWork,
							currUser: $scope.currUser,
							notification: $scope.notification,
							logout: $scope.logout,
							pennabeneficiaryList: $scope.pennabeneficiaryList,
							loader: $scope.loader,
							getOfflineDataFromLocal: $scope.getOfflineDataFromLocal,
							getbankdet: $scope.getbankdet
						}
					}
				}
			});

			modalInstance.result.then(function (oData) {
				if (oData.statusMessage) {
					$scope.notification(oData.statusMessage);
					getBankDetails();
				} else if ($scope.ifMobile) {
					$scope.getOfflineDataFromLocal('bankBenifDetails', function (data) {
						$rootScope.safeApply(function () {
							if (!data || !data.input)
								data = {
									key: 'addPbDetailsFromDropDown',
									type: 'post',
									input: []
								};

							data.input.push(oData);
							$scope.addOfflineDataInLocal('bankBenifDetails', JSON.stringify(data));
							$scope.getOfflineDataFromLocal('allBankDetails', function (alldata) {
								for (var i in $scope.pennabeneficiaryList) {
									if (oData.id == $scope.pennabeneficiaryList[i].id) {
										$scope.pennabeneficiaryList[i].PennaBenificiaryDetails[0].id = oData.id;
										var obj = $scope.pennabeneficiaryList[i].PennaBenificiaryDetails[0];
										break;
									}
								}
								if (!alldata) alldata = {};
								if (!alldata.PennaBenificiaryDetails) alldata.PennaBenificiaryDetails = [];
								alldata.PennaBenificiaryDetails.push(obj);
								$scope.addOfflineDataInLocal('allBankDetails', alldata, function () {
									request.setItem('localDataSubmitted', 'false')
									$scope.notification("Hey you are in offline mode! Will update bank benficiary details successfully once you are online!");
									getBankDetails()
								})
							});
						})
					});
				}
			}, function () {

			});
		}
	};


	$scope.toggleAnimation = function () {
		$scope.animationsEnabled = !$scope.animationsEnabled;
	};



});
