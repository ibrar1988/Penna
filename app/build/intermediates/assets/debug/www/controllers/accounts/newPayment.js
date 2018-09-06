pennaApp.controller('newPaymentCtrl', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $location, $sce, $timeout) {

	// getBillingAddresses()
    $scope.isWaiting = false;
	$scope.ifMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android|webOS|IEMobile|Opera Mini)/);
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android|webOS|IEMobile|Opera Mini)/)) {
		$scope.gotoPaymentPage = function () {
			    if(cordova.getAppVersion) {
                    cordova.getAppVersion(function (version) {

                        $scope.app_ver = version;

                        request.service('MobileBuildVersionCheck', 'post', $scope.currUser, function (res) {
                            if ($scope.app_ver != res.VersionControle.build_version) {
                                request.setItem('appversion', res.VersionControle.build_version);
                                $scope.openversModal(res.VersionControle.updateMandate,'payment');
                            } else {


                                var json = {
                                    userId: $scope.currUser.userId,
                                    accessToken: $scope.currUser.accessToken,
                                }
                                var json = JSON.stringify(json);

                                $scope.netWork(function (status) {
                                    if (status) {

                                        document.addEventListener("deviceready", onDeviceReady, false);



                                        function onDeviceReady() {

                                               var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));


                                                var url = 'https://'+$scope.hostName+'/payment.html?' + $scope.currUser.userId + '&' + $scope.currUser.accessToken + '&' + $scope.currUser.version + '&' + $scope.currUser.device_id + '&' + $scope.currUser.device_type + '&' + deviceInfo.device_Model  + '&' + deviceInfo.platform + '&' + deviceInfo.uuid + '&' + deviceInfo.device_Manufacturer + '&' + deviceInfo.device_Serial + '&' + deviceInfo.device_IPAddress + '&' + deviceInfo.device_MacAddress + '&' + deviceInfo.osVersion + '&' + localStorage.getItem('device_version');

//
                                           cordova.InAppBrowser.open(url, '_blank', 'location=yes');
                                        }


                                    } else {
                                        $scope.notification("You are in Offline . Please try payment once you are Online.", 4000, 'info');
                                    }
                                });


                            }

                        });

                    });
			    }
			}
	}
	//else {
	////            window.location.href = 'https://caredevelopment.pennacement.com/payment.html?' + $scope.currUser.userId + '&' + $scope.currUser.accessToken
	//        }
	if ($location.path() == '/payment-confirmation') {
		if (request.getObj('signature') != undefined) {
			$scope.signature = request.getObj('signature');

			var params = {};
			params.signature = $scope.signature;
			params.userId = $scope.currUser.userId;
			params.accessToken = $scope.currUser.accessToken;
            params.build="new"

			request.service('getPaymentResponse', 'post', params, function (res) {
				$scope.loader(false)
					// if (res.statusCode == '200') {
				$scope.pay_status = res;
				request.removeItem('signature');
				//}
			});

		} else {
			$state.go('accounts.payments.new-payment');
		}
	}






	var payment;
	$scope.getMerchantDetails = function (payment) {
		//$scope.payment = payment.billAddress;

		$scope.netWork(function (status) {
			if (status) {
				$scope.loader(true)
				var params = {};
				params.amount = payment.amount;
				//params.pan_number = payment.pan_number;
				params.userId = $scope.currUser.userId;
				params.accessToken = $scope.currUser.accessToken;


                var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));

                params.version = $scope.currUser.version;
			params.device_id = $scope.currUser.device_id;
			params.device_type = $scope.currUser.device_type;
			if (deviceInfo.device_Platform != "WEB") {
				params.device_Model = deviceInfo.device_Model;
				params.device_Platform = deviceInfo.platform;
				params.device_ID = deviceInfo.uuid;
				params.device_Manufacturer = deviceInfo.device_Manufacturer;
				params.device_Serial = deviceInfo.device_Serial;
				params.device_IPAddress = deviceInfo.device_IPAddress;
				params.device_MacAddress = deviceInfo.device_MacAddress;
				params.location = "";
				params.osVersion = deviceInfo.osVersion;
				params.apVersion = localStorage.getItem('device_version');
                params.build="new"
			} else {
				if (JSON.parse(localStorage.getItem('browserInfo')).lat_long) {
					var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;
				} else {
					var local_browserInfo = "blocked"
				}

				params.device_Model = "";
				params.device_ID = "";
				params.device_Platform = "WEB";
				params.device_Manufacturer = "";
				params.device_Serial = "";
				params.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
				params.device_MacAddress = "";
				params.location = local_browserInfo;
				params.osVersion = "";
				params.apVersion = "";
				params.build="new"
			}



                $scope.isWaiting = true;
				request.service('getPaymentGatewaySignature', 'post', params, function (res) {
                    $scope.loader(false)
					if (res.statusCode == '200') {

						$scope.merchant = res.PaymentGateWay;
						//request.setObj('signature', $scope.merchant.signature);
						request.setObj('signature', $scope.merchant.marchantId);
						var html = '<form align="center" id="merchantForm" method="post" action="">' +
							'<input type="hidden" id="merchantTxnId" name="merchantTxnId" />' +
							'<input type="hidden" id="orderAmount" name="orderAmount"/>' +

							'<input type="hidden" id="firstName" name="firstName"/>' +
							'<input type="hidden" id="lastName" name="lastName"/>' +
							'<input type="hidden" id="email" name="email"/>' +

                            '<input type="hidden" name="customParams[1].name" value="SAPCustNumber"/>' +
                            '<input type="hidden" id="SAPCustNumber" name="customParams[1].value" value="123">' +

							/*'<input type="hidden" id="PANNumber" name="PANNumber"/>' +*/

							'<input type="hidden" name="customParams[0].name" value="PANNumber"/>' +
							'<input type="hidden" id="PANNumber"  name="customParams[0].value" value="123"/>' +

                            '<input type="hidden" name="customParams[2].name" value="CustomerName"/>' +
							'<input type="hidden" id="CustomerName"  name="customParams[2].value" value="123"/>' +

							'<input type="hidden" id="currency" name="currency" />' +
							'<input type="hidden" id="returnUrl" name="returnUrl"/>' +
							'<input type="hidden" id="notifyUrl" name="notifyUrl" />' +
							'<input type="hidden" id="secSignature" name="secSignature" />' +
							'<input type="hidden" id="addressStreet1" name="addressStreet1" />' +
							'<input type="hidden" id="addressStreet2" name="addressStreet2" />' +
							'<input type="hidden" id="addressCity" name="addressCity" />' +
							'<input type="hidden" id="addressZip" name="addressZip" />' +
							'<input type="hidden" id="addressState" name="addressState" />' +
							'<input type="hidden" id="phoneNumber" name="phoneNumber" />' +
							'<input type="Submit" value="Pay Now" style="display:none" id="payNowSubmitBtn"/>' +
							'</form>';

						$scope.trustedHtml = $sce.trustAsHtml(html);
						$timeout(function () {
							//                            document.getElementById('merchantForm').action = "https://sandbox.citruspay.com/sslperf/39xfpthu6e";


								document.getElementById('merchantForm').action =
                                    res.PaymentGateWay.merchantForm +"/"+ res.PaymentGateWay.vanityUrl;

							//							document.getElementById('merchantForm').action = "https://checkout.citruspay.com/ssl/checkout/3c3s5c9rik";

							document.getElementById('merchantTxnId').value = res.PaymentGateWay.marchantId;
							document.getElementById('orderAmount').value = payment.amount;
							document.getElementById('PANNumber').value = res.PaymentGateWay.panNumber;
							document.getElementById('SAPCustNumber').value = res.PaymentGateWay.SAPCustNumber;
							document.getElementById('firstName').value = res.PaymentGateWay.firstName;
							document.getElementById('lastName').value = res.PaymentGateWay.lastName;
							document.getElementById('email').value = res.PaymentGateWay.email;
							document.getElementById('CustomerName').value = res.PaymentGateWay.customerName;
							document.getElementById('phoneNumber').value = res.PaymentGateWay.phoneNumber;
							document.getElementById('currency').value = 'INR';



								document.getElementById('returnUrl').value = res.PaymentGateWay.returnUrl;
								document.getElementById('notifyUrl').value = res.PaymentGateWay.notifyUrl;







							//							document.getElementById('returnUrl').value = 'https://customerportal.pennacement.com/#/payment-confirmation';
							//
							//							document.getElementById('notifyUrl').value = 'https://customerportal.pennacement.com/penna/notify.jsp';
							document.getElementById('secSignature').value = res.PaymentGateWay.signature;

							document.getElementById('payNowSubmitBtn').click();
						}, 0)
					} else if (res.statusCode == "404") {
                        $scope.isWaiting = false;
						$scope.logout();
						$scope.notification(res.statusMessage);
					}else{
                        $scope.isWaiting = false;
                        $scope.notification(res.statusMessage);
                    }
				});
			}
		});
	}

	$('input#decimal').blur(function () {

		if ($(this).val() != undefined && $(this).val() != '' && $(this).val() != '.') {

			var num = parseFloat($(this).val());
			var cleanNum = num.toFixed(2);
			$(this).val(cleanNum);
			if (num / cleanNum < 1) {
				$('#error').text('Please enter only 2 decimal places, we have truncated extra points');
			}
		} else {

			$(this).val('');
		}

	});




	var payAcc = '';
	$scope.$watch('payment.amount', function (val) {
		if (val == 0) {
			$scope.payment.amount = '';
		}
		if (val) {
			if (!val.toString().match(/^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g) || val.toString().length > 20) {
				if (val.toString().length != 1) {
					$scope.payment.amount = payAcc;
				} else {
					$scope.payment.amount = '';
				}
			} else {
				payAcc = val;
			}
		}
	});

	var paypan = '';
	$scope.$watch('payment.pan_number', function (val) {

		if (val) {

			if (val.toString().length > 10) {
				if (val.toString().length != 1) {
					$scope.payment.pan_number = paypan;
				} else {
					$scope.payment.pan_number = '';
				}
			} else {
				paypan = val;
			}
		}
	});

});



/*
                       $scope.trustedHtml = $sce.trustAsHtml(html);
                       $timeout(function () {
                           document.getElementById('merchantForm').action = 'https://sandbox.citruspay.com/39xfpthu6e';
                           document.getElementById('merchantTxnId').value = res.PaymentGateWay.marchantId;
                           document.getElementById('orderAmount').value = payment.amount;
                           document.getElementById('currency').value = 'INR';
                           document.getElementById('returnUrl').value = 'https://115.112.122.99:2865/#/payment-confirmation';
                           document.getElementById('notifyUrl').value = 'https://115.112.122.99:2865/penna-dev/notify.jsp';
                           document.getElementById('secSignature').value = res.PaymentGateWay.signature;
                           document.getElementById('addressStreet1').value = $scope.payment.addressStreet1;
                           document.getElementById('addressStreet2').value = $scope.payment.addressStreet2;
                           document.getElementById('addressCity').value = $scope.payment.addressCity;
                           document.getElementById('addressZip').value = $scope.payment.addressZip;
                           document.getElementById('addressState').value = $scope.payment.addressState;
                           document.getElementById('phoneNumber').value = $scope.payment.phoneNumber;
                           document.getElementById('payNowSubmitBtn').click();
                       }, 0)*/
