pennaApp.controller('loginuser', function ($scope, request, $state, $timeout, $uibModal, $compile, $rootScope, $http,$sce, ctrlComm) {
	$scope.user = {};
	$scope.err = {};
	$scope.showOTPScreen = false;

   $scope.mailLink = "mailto:caresupport@pennacement.com?subject=From CareApp";

    $scope.terms_link = $sce.trustAsResourceUrl('https://'+$scope.hostName+'/data/termsandconditions/termsAndConditionsLogin.html');

	//Added device Info by surya on 17/08/2017
	document.addEventListener('deviceready', onDeviceReady, false);
	var ipAddress = '';
	var macAddress = '';

	function onDeviceReady() {
		var params = {};
		if (addressimpl) {
			addressimpl.request("getIPAddress", JSON.stringify(params), function (message) {

				ipAddress = message;
			}, function () {

			});

			addressimpl.request("getMACAddress", JSON.stringify(params), function (message) {

				macAddress = message;
			}, function () {

			});
		}


		if (cordova.getAppVersion) {
			cordova.getAppVersion(function (version) {
				$rootScope.version = version;
				localStorage.setItem('device_version', version);

			});
		}
	}


	$scope.login = function (user) {
		$scope.localbro_data(function(){
			var deviceInfo = {};
			if ($scope.ifMobile) {
				deviceInfo.device_Model = device.model;
				deviceInfo.device_Platform = device.platform;
				deviceInfo.device_ID = device.uuid;
				deviceInfo.device_Manufacturer = device.manufacturer;
				deviceInfo.device_Serial = device.serial;
				deviceInfo.device_IPAddress = ipAddress;
				deviceInfo.device_MacAddress = macAddress;
				deviceInfo.location = "";
				deviceInfo.osVersion = device.version;
				deviceInfo.apVersion = localStorage.getItem('device_version');
			} else {


				if (JSON.parse(localStorage.getItem('browserInfo')).lat_long) {

					var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;

				} else {

					var local_browserInfo = "blocked"
				}


				deviceInfo.device_Model = "";
				deviceInfo.device_Platform = "WEB";
				deviceInfo.device_ID = "";
				deviceInfo.device_Manufacturer = "";
				deviceInfo.device_Serial = "";
				deviceInfo.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
				deviceInfo.device_MacAddress = "";
				deviceInfo.location = local_browserInfo;
				deviceInfo.osVersion = "";
				deviceInfo.apVersion ="";
			}


			localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));

			if ($scope.ifMobile) {
				if (cordova.getAppVersion) {
					cordova.getAppVersion(function (version) {
						$rootScope.app_ver = version;
						request.service('MobileBuildVersionCheck', 'post', $scope.currUser, function (res) {


							if (($rootScope.app_ver != res.VersionControle.build_version) && (res.VersionControle.updateMandate == 'YES')) {

								request.setItem('appversion', res.VersionControle.build_version);

								$scope.openversModal(res.VersionControle.updateMandate);

							} else {

								$scope.do_login(user);

							}

						});
					});
				}
			} else {
				$scope.do_login(user);
			}
		});
	}

	$scope.do_login = function (user) {

		validate(function () {
			$scope.netWork(function (status) {
				if (status) {
					$scope.loader(true);
					user.email = user.email.toLowerCase();
					request.service('doLogin', 'post', user, function (data) {

						$scope.custName = data.custName;
						$scope.loader(false);
						if (data.statusCode == 200) {

							request.setItem('user_name', data.custName);


							$scope.email = user.email;
							request.setItem('email', user.email);
							$scope.user = {};
							var user_otp = data.statusMessage.split('==')[1];

							$scope.otp(user_otp);

						} else {
							$scope.notification(data.statusMessage, 10000, 'danger');
						}
					});
				} else {
					$scope.notification("Please check your internet connection.", 10000, 'danger');
				}

			});
		});
	}

	function validate(cb) {
		if (!$scope.user.email) {
			$scope.err.email = true;
		} else {
			delete $scope.err.email;
		}
		if (!$scope.user.password) {
			$scope.err.password = true;
		} else {
			delete $scope.err.password;
		}

		if (Object.keys($scope.err).length == 0) {
			if (cb) cb();
		}
	}

	$scope.showLoginFields = function () {
		$scope.showOTPScreen = false;
	}
	$scope.otp = function (userotp) {

			$scope.loader(true);
			$scope.email = $scope.email ? $scope.email : (request.getItem('email') ? request.getItem('email') : '');
			if ($scope.email) {

				var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));

				if ($scope.ifMobile) {
					var input = {
						email: $scope.email,
						otp: userotp,
						setServerKey: 'AIzaSyB-7xxJo9-kbbPThriHvZ8JV4y3iat6vpQ',
						setDeviceToken: device.uuid,
						setDeviceType: device.platform,
                        device_Model : deviceInfo.device_Model,
				        device_ID : device.uuid,
				        device_Manufacturer : deviceInfo.device_Manufacturer,
				        device_Serial : deviceInfo.device_Serial,
				        device_IPAddress : deviceInfo.device_IPAddress,
				        device_MacAddress : deviceInfo.device_MacAddress,
						location : "",
						osVersion : deviceInfo.osVersion,
						apVersion : localStorage.getItem('device_version'),
					}
				} else {
                    if (JSON.parse(localStorage.getItem('browserInfo')).lat_long) {
					      var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;
				       } else {
					      var local_browserInfo = "blocked"
				       }
					var input = {
						email: $scope.email,
						otp: userotp,
						setServerKey: $scope.deviceDetails.serverKey,
						setDeviceToken: $scope.deviceDetails.deviceToken,
						setDeviceType: $scope.deviceDetails.setDeviceType,
						device_Model : "",
						device_ID : "",
						device_Manufacturer : "",
						device_Serial : "",
						device_IPAddress : JSON.parse(localStorage.getItem('browserInfo')).ip,
						device_MacAddress : "",
						location : local_browserInfo,
						osVersion : "",
						apVersion : "",
					}
				}
				request.service('loginVerification', 'post', input, function (data) {
					$scope.loader(false);
					if (data.statusCode == 200) {
						//new code
						$rootScope.userId = data.userId;
						$rootScope.accessToken = data.accessToken;
						//end of new code
						// $scope.showOTPScreen = false;
						request.removeItem('email');
						$('#smily').css("display", "inline-block");
						// $scope.notification("Welcome  " + "  " + $scope.custName + "  " + " ! ", 8000);
						/*if ($scope.ifMobile) {
                            data.device_id= device.uuid;
                            data.device_type= device.platform;
                            cordova.getAppVersion(function (version) {
					          data.version = version;
				             });
                        }else{
                            data.device_id= '';
                            data.device_type= "WEB";
                            data.version = '';
                        }
						alert(JSON.stringify(data));*/

						if ($rootScope.app_ver) {
							data.version = $rootScope.app_ver;
						} else {
							data.version = '';
						}

						/*data.version=$rootScope.app_ver;*/


						$scope.saveUserData(data, function () {
							// $state.go('dashboard');
							//new code
							// $scope.openTermsModal();

							$scope.getTermsAndConditionURL();
						});
					} else {
						$scope.notification(data.statusMessage, 10000);
						$scope.user.otp = null;
					}
				});
			}
		}
		//new code
	$scope.getTermsAndConditionURL = function () {
		var GetTermsData = {
			userId: $rootScope.userId,
			accessToken: $rootScope.accessToken
		}

		request.service('getTermsAndConditionURL', 'post', GetTermsData, function (response) {
            $scope.loader(false);
			if (response.termsAndConditions == 'YES') {
				$scope.openTermsModal();
			} else {
				localStorage.userAgree = true;
				var next = ctrlComm.get('next');
				var url = (next && next.name) ? next.name :'dashboard';
				$state.go(url);
				$scope.check_appUpdate();
			}
		});
	}
	$scope.openTermsModal = function () {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			templateUrl: 'TermsModal.html',
			size: 'md',
			animation: true,
			keyboard: false,
			resolve: {
				input: function () {
					return {
						loader: $scope.loader,
						terms_link: $scope.terms_link,
					}
				}
			},
			controller: ['$scope', '$rootScope', 'request', 'input', function ($scope, $rootScope, request, input) {

				$scope.loader = input.loader;
				$scope.terms_link = input.terms_link;

				$scope.userAgreed = function () {

					var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
					var TermsConditionsData = {
						userId: $rootScope.userId,
						accessToken: $rootScope.accessToken,
						tcStatus: 'AGREED',
					}

					document.addEventListener("deviceready", onDeviceReady, false);



					function onDeviceReady() {
						$scope.ifMobile = device.platform;
					}

					if ($scope.ifMobile == 'Android' || $scope.ifMobile == 'iOS') {
						TermsConditionsData.version = localStorage.getItem('device_version');
						TermsConditionsData.device_type = device.platform;
						TermsConditionsData.osVersion = device.version;

					} else {
						TermsConditionsData.version = '';
						TermsConditionsData.device_type = "WEB";
						TermsConditionsData.osVersion = "";
					}



					if ($scope.ifMobile) {

						TermsConditionsData.device_Model = deviceInfo.device_Model;
						TermsConditionsData.device_Manufacturer = deviceInfo.device_Manufacturer;
						TermsConditionsData.device_Serial = deviceInfo.device_Serial;
						TermsConditionsData.device_IPAddress = deviceInfo.device_IPAddress;
						TermsConditionsData.device_MacAddress = deviceInfo.device_MacAddress;
						TermsConditionsData.device_id = deviceInfo.device_ID;
						TermsConditionsData.location = "";
						TermsConditionsData.apVersion = localStorage.getItem('device_version');
					} else {

						if (JSON.parse(localStorage.getItem('browserInfo')).lat_long) {

							var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;

						} else {

							var local_browserInfo = "blocked"
						}


						TermsConditionsData.device_Model = "";
						TermsConditionsData.device_ID = "";
						TermsConditionsData.device_Manufacturer = "";
						TermsConditionsData.device_Serial = "";
						TermsConditionsData.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
						TermsConditionsData.device_MacAddress = "";
						TermsConditionsData.location = local_browserInfo;
						TermsConditionsData.osVersion = "";
						TermsConditionsData.apVersion ="";
					}




					$scope.loader(true);

					request.service('saveTandCAgreement', 'post', TermsConditionsData, function (response) {
						$scope.loader(false);

						if (response.statusCode == 200) {
							localStorage.userAgree = true;
							$state.go('dashboard');

							if (response.updateMandate == 'YES') {

								$scope.logout();
							} else {
                                if ($scope.ifMobile){
								if (cordova.getAppVersion) {
									cordova.getAppVersion(function (version) {

										$scope.app_ver = localStorage.getItem('device_version');
										var currUser = {
											userId: $rootScope.userId,
											accessToken: $rootScope.accessToken,
										}


										request.service('MobileBuildVersionCheck', 'post', currUser, function (res) {
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
							}

						} else if (response.dupLogin || res.statusCode == 505) {
							window.location.reload();
						} else {
							$scope.notification(res.statusMessage, 10000);
						}

					});
				};
				$scope.userdisagreed = function () {

					var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
					var TermsConditionsData = {
						userId: $rootScope.userId,
						accessToken: $rootScope.accessToken,
						tcStatus: 'DISAGREED'
					}

					document.addEventListener("deviceready", onDeviceReady, false);

					function onDeviceReady() {
						$scope.ifMobile = device.platform;
					}

					if ($scope.ifMobile == 'Android' || $scope.ifMobile == 'iOS') {
						TermsConditionsData.version = localStorage.getItem('device_version');
						TermsConditionsData.device_type = device.platform;
						TermsConditionsData.osVersion = device.version;

					} else {
						TermsConditionsData.version = '';
						TermsConditionsData.device_type = "WEB";
						TermsConditionsData.osVersion = "";
					}



					if ($scope.ifMobile) {

						TermsConditionsData.device_Model = deviceInfo.device_Model;
						TermsConditionsData.device_Manufacturer = deviceInfo.device_Manufacturer;
						TermsConditionsData.device_Serial = deviceInfo.device_Serial;
						TermsConditionsData.device_IPAddress = deviceInfo.device_IPAddress;
						TermsConditionsData.device_MacAddress = deviceInfo.device_MacAddress;
						TermsConditionsData.device_id = deviceInfo.device_ID;
						TermsConditionsData.location = "";
						TermsConditionsData.apVersion = localStorage.getItem('device_version');
					} else {

						if (JSON.parse(localStorage.getItem('browserInfo')).lat_long) {
							var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;

						} else {
							var local_browserInfo = "blocked"
						}


						TermsConditionsData.device_Model = "";
						TermsConditionsData.device_ID = "";
						TermsConditionsData.device_Manufacturer = "";
						TermsConditionsData.device_Serial = "";
						TermsConditionsData.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
						TermsConditionsData.device_MacAddress = "";
						TermsConditionsData.location = local_browserInfo;
						TermsConditionsData.osVersion = "";
						TermsConditionsData.apVersion = "";
					}




					$scope.loader(true);
					request.service('saveTandCAgreement', 'post', TermsConditionsData, function (response) {
						debugger;
						$scope.loader(false);
						$scope.currUser = {};
						$scope.compConfig = {};
						request.removeItem('currentuser');
						request.removeItem('locallySavedData');
						request.removeItem('getProfile');
						request.removeItem('longdata');
						request.removeItem('user_name');
						request.removeItem('compConfig');
						window.localStorage.clear();
						window.location.reload();
					});

				};
            }]
		});
	};
	//end of new code
	//new code
	//end of new code
	$scope.animationsEnabled = true;
	$scope.open = function (size) {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			backdrop: 'static',
			templateUrl: 'productconf.html',
			controller: 'ModalProConfirm',
			size: size,
			resolve: {
				items: function () {
					return $scope.items;
				}
			}
		});
		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {});
	};
	$scope.toggleAnimation = function () {
		$scope.animationsEnabled = !$scope.animationsEnabled;
	};

	$scope.myInterval = 3000;
	$scope.noWrapSlides = false;
	$scope.active = 0;
	$scope.slides = [{
			id: 0,
			name: 'Penna Power - PPC Cement',
			mrp: 'MRP.150 per bag',
			desc: 'PPC is a special blended cement as per BIS specification, IS: 1489 and is produced by inter-gring Ordinary Portland Cement clinker with high',
			img: 'img/product1.png'
        },
		{
			id: 1,
			name: 'Penna Premium - Ordinary Portland cement(OPC)',
			mrp: 'MRP.150 per bag',
			desc: 'PPC is a special blended cement as per BIS specification, IS: 1489 and is produced by inter-gring',
			img: 'img/product2.png'
        },
		{
			id: 2,
			name: 'Penna Suraksha - PSC Cement',
			mrp: 'MRP.150 per bag',
			desc: 'PSC is a slag-based blended cement as per BIS specification, IS: 455, and is manufactured by blending Ordinary portland Cement clinker',
			img: 'img/product3.png'
        }
    ]



});

angular.module('pennaApp').controller('ModalProConfirm', function ($scope, $uibModalInstance, items, $http) {
	$scope.ok = function () {
		$uibModalInstance.close('ok');
	};
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}).directive('pennaslide', ['$compile', function ($compile) {
	function link(scope, element, attrs) {
		var childScope
		scope.$watch('slides', function (value) {
			var template = '<uib-carousel active="active" interval="myInterval" no-wrap="noWrapSlides" no-pause="false">' +
				'<uib-slide ng-repeat="slide in slides track by slide.id" index="slide.id">' +
				'<a href="" ng-click="open()">' +
				'<img ng-src="{{slide.img}}" class="grid_thumb" />' +
				'<div class="grid_product_desc">' +
				'<h4>{{slide.name}}</h4>' +
				'<p>{{slide.mrp}}</p>' +
				'<div class="grid_product_det">' +
				'<p><strong>Product details :</strong></p>' +
				'<p>{{slide.desc}} <a href="">Know More...</a></p>' +
				'</div>' +
				'</div>' +
				'</a>' +
				'</uib-slide>' +
				'</uib-carousel>;'
			element.empty();
			if (childScope)
				childScope.$destroy();
			childScope = scope.$new();
			element.html(template);
			$compile(element.contents())(childScope);
		});
	}
	return {
		link: link,
		restrict: 'E'
	};
}]);
