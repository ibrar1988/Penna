//adding by bank and benfi model here -----------------
angular.module('pennaApp').controller('addBankDetailsCtrl', function ($scope, $rootScope, $uibModalInstance, input, $state, request, secure, mobile, $location, $uibModal) {
	$scope.bankdata = {};
	$scope.err = {};
	$scope.currUser = input.currUser;
	$scope.netWork = input.netWork;
	$scope.notification = input.notification;
	$scope.chooseImage = input.chooseImage;
	$scope.loader = input.loader;
	$scope.logout = input.logout;


	$scope.addbankdelt = function () {
		validateAddBankAccForm(function () {
			var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
			var input = {}
			input.bankImageBlob = $scope.addBankDetailsImg;
			input.userId = $scope.currUser.userId;
			input.accessToken = $scope.currUser.accessToken;
			input.bankName = $scope.bankdata.bankName;
			input.accntName = $scope.bankdata.accntName;
			input.accountNumber = $scope.bankdata.accountNumber;
			input.ifsccode = $scope.bankdata.ifsccode;
			input.bankAddress = $scope.bankdata.bankAddress;
			input.micr = $scope.bankdata.micr;
			input.indicator = 'T';


			input.version = $scope.currUser.version;
			input.device_id = $scope.currUser.device_id;
			input.device_type = $scope.currUser.device_type;
			if (deviceInfo.device_Platform != "WEB") {
				input.device_Model = deviceInfo.device_Model;
				input.device_Platform = deviceInfo.platform;
				input.device_ID = deviceInfo.uuid;
				input.device_Manufacturer = deviceInfo.device_Manufacturer;
				input.device_Serial = deviceInfo.device_Serial;
				input.device_IPAddress = deviceInfo.device_IPAddress;
				input.device_MacAddress = deviceInfo.device_MacAddress;
				input.location = "";
				input.osVersion = deviceInfo.osVersion;
				input.apVersion = localStorage.getItem('device_version');
			} else {

				if (JSON.parse(localStorage.getItem('browserInfo')).lat_long) {
					var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;
				} else {
					var local_browserInfo = "blocked"
				}

				input.device_Model = "";
				input.device_ID = "";
				input.device_Platform = "WEB";
				input.device_Manufacturer = "";
				input.device_Serial = "";
				input.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
				input.device_MacAddress = "";
				input.location = local_browserInfo;
				input.osVersion = "";
				input.apVersion = "";
			}


			$scope.netWork(function (status) {
				if (status) {
					$scope.loader(true);
					request.service('addBankDetails', 'post', input, function (res) {
						$scope.loader(false);
						if (res.statusCode == "200") {
							if (res.updateMandate == 'NO') {
								$scope.bank_check_appUpdate();
							}
							$uibModalInstance.close(res);
						} else if (res.dupLogin || res.statusCode == 505) {

							if (res.updateMandate == 'YES') {

								$scope.logout();
							} else {
								if (cordova.getAppVersion) {
									cordova.getAppVersion(function (version) {

										$scope.app_ver = version;

										request.service('MobileBuildVersionCheck', 'post', $scope.currUser, function (res) {
											if (($scope.app_ver != res.VersionControle.build_version)) {
												request.setItem('appversion', res.VersionControle.build_version);
												var modalInstance = $uibModal.open({
													backdrop: 'static',
													templateUrl: 'pages/update_version.html',
													size: 'md',
													animation: true,
													keyboard: false,
													resolve: {
														items: function () {
															return {
																appupdate_status: res.VersionControle.updateMandate,
															}
														}
													},
													controller: ['$scope', '$uibModalInstance', 'items', function ($scope, $uibModalInstance, items) {
														$scope.items = items

														if ($scope.items.appupdate_status == 'YES') {
															$scope.cancel = function () {
																$uibModalInstance.close('cancel');
															};
														} else {
															$scope.cancel = function () {
																$uibModalInstance.close('no');
															};
														}



														$scope.update_ver = function () {
															if (device.platform == 'Android') {
																window.open('https://play.google.com/store/apps/details?id=com.ionicframework.penna', '_system', 'location=yes');
															} else {
																window.open("https://itunes.apple.com/us/app/penna-care/id1218665210?mt=8", '_system', 'location=yes');
															}
														};

                }]
												});

												modalInstance.result.then(function (res) {
													if (res == 'cancel') {
														$scope.logout();
													}
												}, function (err) {});
											}

										});

									});
								}
							}

							/*if (res.updateMandate == 'NO' && $scope.ifMobile) {
	$scope.check_appUpdate();
}*/


							if (res.dupLogin) {
								$scope.notification(res.statusMessage, 10000);
								$scope.logout();
							}

						} else {
							$scope.notification(res.statusMessage, 10000);
						}
					})
				} else {
					$uibModalInstance.close(input)
				}
			})
		});
	};

	$scope.imageSelected = function () {
		$scope.err.image = false;
		var ele = document.getElementById('addBankAttachInput');
		var file = ele.files[0];
		var reader = new FileReader();
		reader.onload = function () {
			$rootScope.safeApply(function () {
				$scope.addBankDetailsImg = reader.result;
			});
		}
		reader.readAsDataURL(file);
	}


	$scope.mobileBankAtachment = function () {
		document.getElementById('addBankAttachInput').click()
		mobile.chooseImage(function (img) {
			$rootScope.safeApply(function () {
				$scope.err.image = false;
				$scope.addBankDetailsImg = img;
			});
		});
	}

	function validateAddBankAccForm(cb) {
		if (!$scope.bankdata.bankName) {
			$scope.err.bankName = true;
		} else {
			delete $scope.err.bankName;
		}
		if (!$scope.bankdata.accntName) {
			$scope.err.accntName = true;
		} else {
			delete $scope.err.accntName;
		}
		if (!$scope.bankdata.accountNumber) {
			$scope.err.accountNumber = true;
		} else {
			delete $scope.err.accountNumber;
		}
		if (!$scope.bankdata.ifsccode) {
			$scope.err.ifsccode = true;
		} else {
			delete $scope.err.ifsccode;
		}
		if (!$scope.bankdata.bankAddress) {
			$scope.err.bankAddress = true;
		} else {
			delete $scope.err.bankAddress;
		}
		if (!$scope.bankdata.micr) {
			$scope.err.micr = true;
		} else {
			delete $scope.err.micr;
		}
		if (!$scope.addBankDetailsImg) {
			$scope.err.image = true;
		} else {
			delete $scope.err.image;
		}
		if (Object.keys($scope.err).length == 0) {
			if (cb) cb();
		}
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	var bName = '';
	$scope.$watch('bankdata.bankName', function (val) {
		if (val == 0) {
			$scope.bankdata.bankName = '';
		}
		if (val && val.length) {
			if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 30) {
				if (val.length != 1) {
					$scope.bankdata.bankName = bName;
				} else {
					$scope.bankdata.bankName = '';
				}
			} else {
				bName = val;
			}
		}
	});
	var aName = '';
	$scope.$watch('bankdata.accntName', function (val) {
		if (val == 0) {
			$scope.bankdata.accntName = '';
		}
		if (val && val.length) {
			if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 30) {
				/*if (!val.match(/^[0-9a-zA-Z]*$/) || val.length > 30) {*/
				if (val.length != 1) {
					$scope.bankdata.accntName = aName;
				} else {
					$scope.bankdata.accntName = '';
				}
			} else {
				aName = val;
			}
		}
	});
	var bAcc = '';
	$scope.$watch('bankdata.accountNumber', function (val) {
		if (val == 0) {
			$scope.bankdata.accountNumber = '';
		}
		if (val) {
			if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 18) {
				if (val.toString().length != 1) {
					$scope.bankdata.accountNumber = bAcc;
				} else {
					$scope.bankdata.accountNumber = '';
				}
			} else {
				bAcc = val;
			}
		}
	});
	var bIfsc = '';
	$scope.$watch('bankdata.ifsccode', function (val) {
		if (val == 0) {
			$scope.bankdata.ifsccode = '';
		}
		if (val && val.length) {
			$scope.bankdata.ifsccode = val.toUpperCase();
			if (!val.match(/^[0-9a-zA-Z]*$/) || val.length > 30) {
				if (val.length != 1) {
					$scope.bankdata.ifsccode = bIfsc;
				} else {
					$scope.bankdata.ifsccode = '';
				}
			} else {
				bIfsc = val;
			}
		}
	});
	var bMicr = '';
	$scope.$watch('bankdata.micr', function (val) {
		if (val == 0) {
			$scope.bankdata.micr = '';
		}
		if (val && val.length) {
			if (!val.match(/^[0-9]*$/) || val.length > 11) {
				if (val.length != 1) {
					$scope.bankdata.micr = bMicr;
				} else {
					$scope.bankdata.micr = '';
				}
			} else {
				bMicr = val;
			}
		}
	});

	$scope.bank_check_appUpdate = function () {

		//request.getItem('currentuser');
		if ($scope.ifMobile) {
			if (cordova.getAppVersion) {
				cordova.getAppVersion(function (version) {

					$scope.app_ver = version;

					request.service('MobileBuildVersionCheck', 'post', $scope.currUser, function (res) {

						if (request.getItem('app_cancledate') != undefined) {
							var past_acceptdate = request.getItem('app_cancledate');
							var past_acceptdate1 = Number(past_acceptdate);
							var verdate_date1 = new Date(past_acceptdate1);
							var verdate_date2 = new Date();
							$scope.diffDays_diff = parseInt((verdate_date2 - verdate_date1) / (1000 * 60 * 60 * 24));
							//alert(diffDays);
						}

						if (($scope.app_ver != res.VersionControle.build_version) && (request.getItem('app_cancledate') == undefined)) {

							request.setItem('appversion', res.VersionControle.build_version);
							$scope.openversModal(res.VersionControle.updateMandate);

						} else if (($scope.app_ver != res.VersionControle.build_version) && (request.getItem('app_cancledate') != undefined) && ($scope.diffDays_diff >= 2)) { /*&& (diffDays >= 2)*/
							request.setItem('appversion', res.VersionControle.build_version);
							$scope.openversModal(res.VersionControle.updateMandate);

						}

					});

				});
			}
		}
	};




	$scope.openversModal = function (data) {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			templateUrl: 'pages/update_version.html',
			size: 'md',
			animation: true,
			keyboard: false,
			resolve: {
				items: function () {
					return {
						appupdate_status: data,
					}
				}
			},
			controller: ['$scope', '$uibModalInstance', 'items', function ($scope, $uibModalInstance, items) {
				$scope.items = items

				if ($scope.items.appupdate_status == 'YES') {
					$scope.cancel = function () {
						$uibModalInstance.close('cancel');
					};
				} else {
					$scope.cancel = function () {
						request.setItem('app_nocount', '1');


						var last_cancle = new Date();
						var last_cancle_ts = Date.parse(last_cancle);
						request.setItem('app_cancledate', last_cancle_ts.toString());


						var appcount = request.getItem('app_nocount');
						$uibModalInstance.close('no');
					};
				}



				$scope.update_ver = function () {
					if (device.platform == 'Android') {
						window.open('https://play.google.com/store/apps/details?id=com.ionicframework.penna', '_system', 'location=yes');
					} else {
						window.open("https://itunes.apple.com/us/app/penna-care/id1218665210?mt=8", '_system', 'location=yes');
					}
				};

                }]
		});

		modalInstance.result.then(function (res) {
			if (res == 'cancel') {
				$scope.logout();
			}
		}, function (err) {});
	};


});
