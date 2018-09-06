(function () {


    var pay = angular.module('pennaPay', []);
	pay.controller('pennaPayCtrl', function ($scope, $http, $sce, $timeout, $location) {

              // $scope.hostUrl = 'https://caredevelopment.pennacement.com';
			   $scope.hostUrl = 'https://customerportal.pennacement.com';


        $scope.loader = function (status) {
			if (status) {
				document.getElementById('loaderStatus').style.display = 'block';
			} else {
				document.getElementById('loaderStatus').style.display = 'none';
			}
		}


        var payment;
        $scope.links =  window.location.href.toString();
        $scope.links =  decodeURIComponent($scope.links);
        $scope.isWaiting = false;
		var link = window.location.href.toString();

		var uIdNToken = link.split('?')[1];
		var userId = uIdNToken.split('&')[0];
		var accessToken = uIdNToken.split('&')[1];


        if(uIdNToken.split('&')[2] != undefined){
                  var version = uIdNToken.split('&')[2];
               }else{
                    var version = '';
                   }

               if(uIdNToken.split('&')[3] != undefined){
			      var device_id = uIdNToken.split('&')[3];
                    }else{
                    var device_id = '';
                   }

          if(uIdNToken.split('&')[4] != undefined){
			     var device_type = uIdNToken.split('&')[4];
               }else{
                    var device_type = '';
                   }

               if(uIdNToken.split('&')[5] != undefined){
                var device_Model = uIdNToken.split('&')[5];
                    }else{
                    var device_Model = '';
                   }

                    if(uIdNToken.split('&')[6] != undefined){
				var device_Platform = uIdNToken.split('&')[6];
                         }else{
                    var device_Platform = '';
                   }

                         if(uIdNToken.split('&')[7] != undefined){
				var device_ID = uIdNToken.split('&')[7];
                              }else{
                    var device_ID = '';
                   }

                              if(uIdNToken.split('&')[8] != undefined){
				var device_Manufacturer = uIdNToken.split('&')[8];
                                   }else{
                    var device_Manufacturer = '';
                   }

                                   if(uIdNToken.split('&')[9] != undefined){
				var device_Serial = uIdNToken.split('&')[9];
                                        }else{
                    var device_Serial = '';
                   }

                                        if(uIdNToken.split('&')[10] != undefined){
				var device_IPAddress = uIdNToken.split('&')[10];
                                             }else{
                    var device_IPAddress = '';
                   }

                                             if(uIdNToken.split('&')[11] != undefined){
				var device_MacAddress = uIdNToken.split('&')[11];
                                                  }else{
                    var device_MacAddress = '';
                   }


				var location = "";


                                                  if(uIdNToken.split('&')[12] != undefined){
				var osVersion = uIdNToken.split('&')[12];
                                                       }else{
                    var osVersion = '';
                   }

                                                       if(uIdNToken.split('&')[13] != undefined){
				var apVersion = uIdNToken.split('&')[13];
                                                            }else{
                    var apVersion = '';
                   }


		console.log("link", link);
		console.log('accessToken:::  ', accessToken);
		console.log('userId', userId);



		var json = {
			userId: userId,
			accessToken: accessToken
		}
		var json = JSON.stringify(json);

		if (window.location.pathname == '/payment-confirmation.html') {
			$scope.loader(true);
			console.log("/paymentNotify")
			if (window.localStorage['signature'] != undefined) {
				$scope.signature = window.localStorage['signature'];
				console.log(" $scope.singparty", $scope.signature);
				var params = {
					signature: $scope.signature,
					userId: userId,
					accessToken: accessToken,
                    build:"new"
				}

                var urls;


                 urls = $scope.hostUrl+':443/penna/sfIntigration/getPaymentResponse';

				 //urls = 'https://customerportal.pennacement.com:443/penna/sfIntigration/getPaymentResponse';

				//urls = 'https://careqas.pennacement.com:443/penna-qa/sfIntigration/getPaymentResponse';




				console.log("params", params)

				$http({
					method: 'POST',
					//					url: 'https://customerportal.pennacement.com:443/penna/sfIntigration/getPaymentResponse',
					url: urls,
					data: params,
					headers: {
						'Content-Type': 'application/json;'
					}
				}).then(function successCallback(res) {
					$scope.loader(false);
					console.log("res==========", res)
					if (res.status == '200') {
						$scope.pay_status = res.data;
						console.log("getPaymentResponse =========== :: ", $scope.pay_status);
						window.localStorage.removeItem('signature');
					}
				}, function errorCallback(res) {});

			} else {
				window.location.href = '/payment.html';
			}
		}





		var url1;


		url1 = $scope.hostUrl+':443/penna/payment/getPaymentGatewaySignature';

		//url1 = 'https://customerportal.pennacement.com:443/penna/payment/getPaymentGatewaySignature';

		//url1 = 'https://careqas.pennacement.com:443/penna-qa/payment/getPaymentGatewaySignature';


        	$scope.getMerchantDetails = function (payment) {
			$scope.loader(true);
			console.log('hiiiiiiiiiiiii')
				// $scope.payment = payment.billAddress;
			var params = {
				amount: payment.amount,
				userId: userId,
				accessToken: accessToken,
                version : version,
			    device_id :device_id,
			    device_type : device_type,
                device_Model : device_Model,
				device_Platform : device_Platform,
				device_ID : device_ID,
				device_Manufacturer : device_Manufacturer,
				device_Serial : device_Serial,
				device_IPAddress : device_IPAddress,
				device_MacAddress : device_MacAddress,
				location : "",
				osVersion : osVersion,
				apVersion : apVersion,
                build:"new",
			};

			console.log("params", params);

                $http({
				method: 'POST',
				url: url1,
				data: params,
				headers: {
					'Content-Type': 'application/json;'
				}
			}).then(function successCallback(res) {

				console.log('response', res)
                $scope.loader(false);
                $scope.isWaiting = true;

                    if (res.status == '200') {

                           $scope.merchant = res.data.PaymentGateWay;
					console.log($scope.merchant)
						//request.setObj('signature', $scope.merchant.signature);
						//request.setObj('signature', $scope.merchant.marchantId);
					window.localStorage['signature'] = $scope.merchant.marchantId;
					//var accessData = window.localStorage['storageName'];
					console.log("$scope.merchant", $scope.merchant)
						// console.log("", request.getObj('signature'))
						/* console.log("params.userId", res.PaymentGateWay.marchantId + " " + params.userId)*/
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

					console.log("res.PaymentGateWay.signature", res.data.PaymentGateWay.signature)
					$scope.trustedHtml = $sce.trustAsHtml(html);
					console.log('accessToken:::  ', params.accessToken);
					console.log('userId::: ', params.userId);


                        $timeout(function () {
                            document.getElementById('merchantForm').action =
                            $scope.merchant.merchantForm +"/"+ $scope.merchant.vanityUrl;

                             document.getElementById('merchantTxnId').value = res.data.PaymentGateWay.marchantId;
							document.getElementById('orderAmount').value = payment.amount;
							document.getElementById('PANNumber').value = res.data.PaymentGateWay.panNumber;
							document.getElementById('SAPCustNumber').value = res.data.PaymentGateWay.SAPCustNumber;
							document.getElementById('firstName').value = res.data.PaymentGateWay.firstName;
							document.getElementById('lastName').value = res.data.PaymentGateWay.lastName;
							document.getElementById('email').value = res.data.PaymentGateWay.email;
							document.getElementById('CustomerName').value = res.data.PaymentGateWay.customerName;
							document.getElementById('phoneNumber').value = res.data.PaymentGateWay.phoneNumber;
							document.getElementById('currency').value = 'INR';
                            //document.getElementById('returnUrl').value = 'https://customerportal.pennacement.com/payment-confirmation.html?' + userId + '&' + accessToken;

                            document.getElementById('returnUrl').value = $scope.hostUrl+'/payment-confirmation.html?' + userId + '&' + accessToken;

                        document.getElementById('notifyUrl').value = $scope.merchant.notifyUrl;


						document.getElementById('secSignature').value = res.data.PaymentGateWay.signature;

						document.getElementById('payNowSubmitBtn').click();

                        },0)




                    }else{
                         $scope.isWaiting = false;
                    }


                }, function errorCallback(res) {})

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

				if (!val.toString().match(/^[0-9.]*$/) || val.toString().length > 20) {
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

    })

}())




// $http.post("https://caredevelopment.pennacement.com:443/penna-dev/payment/getPaymentGatewaySignature").success( function(response) {
//       console.log('response',response)
// });
// function makeHttpObject() {
//   try {return new XMLHttpRequest();}
//   catch (error) {}
//   try {return new ActiveXObject("Msxml2.XMLHTTP");}
//   catch (error) {}
//   try {return new ActiveXObject("Microsoft.XMLHTTP");}
//   catch (error) {}

//   throw new Error("Could not create HTTP request object.");
// }

// //show(typeof(makeHttpObject()));
//  var request = makeHttpObject();


// request.service('getPaymentResponse', 'post', params, function (res) {
//     $scope.loader(false)
//     console.log("res", res)
//     if (res.statusCode == '200') {
//         $scope.pay_status = res;
//         console.log("getPaymentResponse =========== :: ", $scope.pay_status);
//         window.localStorage.removeItem('signature');
//     }
// });
