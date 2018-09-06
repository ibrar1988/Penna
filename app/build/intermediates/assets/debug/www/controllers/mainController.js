var pennaApp = angular.module('pennaApp');
pennaApp.config(function ($provide) {
	$provide.decorator('$uiViewScroll', function ($delegate) {
		return function (uiViewElement) {};
	});
});
pennaApp.controller('mainController', function ($scope, $rootScope, $timeout, request, $location, $state, ctrlComm, $filter, $uibModal, mobile, $uibModalStack, $window, $http) {

     $scope.mailLink = "mailto:caresupport@pennacement.com";

     $scope.hostName = request.setup.host;


		$scope.edit = false;
		$scope.productlistdetails = []; //create orders
		$scope.ordersconform = false; //create orders


    $scope.rounddata = function(value){

   if(value != undefined){
       if(parseInt(value) == value){

            return value;
    }
    else if(parseFloat(value) == value){
        x=value.toString()
        y=x.split('.')[1];
        z=y.toString().split('');


        if(z[0] == '0'){
           return x.split('.')[0]
        }else if(z[1] == '0' || z[1] == undefined){
             return x.split('.')[0] + '.' + z[0];
        }else{
             return value.toFixed(2);
        }



    }
    else{

        return 0;
    }
    }


    }

    $scope.pennavisits = function(){
        window.history.back();
    }

    $scope.invoice_pdfback = function(){
        window.history.back();
    }


		$scope.myprerf = function (val) {

			ctrlComm.put('myprofe', val);

			$state.go('profile.my-performance');


		}

        $scope.get_decimal = function(val){

            var val1 = val.toString().split(".");
            if(val1[1] != undefined){

                if(val1[1].toString().length != 2){
                      return val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                   }else{
                      return val;
                   }
               }else{
                    return val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
               }



        }


		$scope.myperformance = function () {

			var val = ctrlComm.get('myprofe');

			if (val == 'dash_per') {
				$state.go('dashboard', {}, {
					reload: true
				});
			} else if (val == 'profile_per') {
				$state.go('profile');
			}

		}


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
				//myTurvoLink

			$scope.myTurvoLink = function (url) {

				$scope.netWork(function (status) {
					if (status) {

						document.addEventListener("deviceready", onDeviceReady, false);

						function onDeviceReady() {
							//var url1 = 'http://rewards.pennacement.in/;

							cordova.InAppBrowser.open(url, '_blank', 'location=yes');

						}


					} else {
						$scope.notification("You are in Offline . Please try payment once you are Online.", 10000, 'info');
					}
				});


			}

			//rewards ---------------

			$scope.myrewars = function () {

				$scope.netWork(function (status) {
					if (status) {

						document.addEventListener("deviceready", onDeviceReady, false);

						function onDeviceReady() {
							//var url1 = 'http://rewards.pennacement.in/;

							$http.get('config/url.json')
								.then(function (res) {
									if (res.status == 200) {

										var url = res.data.rewards;
										cordova.InAppBrowser.open(url, '_blank', 'location=yes');
									}
								});
						}


					} else {
						$scope.notification("You are in Offline . Please try payment once you are Online.", 10000, 'info');
					}
				});


			}

			//myshipment-------------------------


			$scope.myshipment = function () {


				$scope.netWork(function (status) {
					if (status) {

						document.addEventListener("deviceready", onDeviceReady, false);

						function onDeviceReady() {
							//var url1 = 'http://rewards.pennacement.in/;

							$http.get('config/url.json')
								.then(function (res) {
									if (res.status == 200) {

										var url = res.data.myshipment;
										cordova.InAppBrowser.open(url, '_blank', 'location=yes');
									}
								});
						}


					} else {
						$scope.notification("You are in Offline . Please try payment once you are Online.", 10000, 'info');
					}
				});


			}



			$scope.openPennaSite = function () {
				$scope.netWork(function (status) {
					if (status) {
						document.addEventListener("deviceready", onDeviceReady, false);

						function onDeviceReady() {
							$http.get('config/url.json')
								.then(function (res) {
									if (res.status == 200) {

										var url = res.data.pennacement;
										cordova.InAppBrowser.open(url, '_blank', 'location=yes');
									}
								});
						}
					} else {
						$scope.notification("You are in Offline . Please try payment once you are Online.", 10000, 'info');
					}
				});
			};


			$scope.Term_cond = function () {
				$scope.netWork(function (status) {
					if (status) {
						document.addEventListener("deviceready", onDeviceReady, false);

						function onDeviceReady() {

							$http.get('config/url.json')
								.then(function (res) {
									if (res.status == 200) {

										var url =  'https://'+$scope.hostName+res.data.termsAndConditions_prod;
										cordova.InAppBrowser.open(url, '_blank', 'location=yes');
									}
								});
							/*cordova.InAppBrowser.open('https://customerportal.pennacement.com/data/termsandconditions/termsAndConditions.html', '_blank', 'location=yes');*/
						}
					} else {
						$scope.notification("You are in Offline . Please try payment once you are Online.", 10000, 'info');
					}
				});
			};



			$scope.openusermanul = function () {
				$scope.netWork(function (status) {
					if (status) {
						document.addEventListener("deviceready", onDeviceReady, false);

						function onDeviceReady() {

							$http.get('config/url.json')
								.then(function (res) {
									if (res.status == 200) {

										var url = 'https://'+$scope.hostName+res.data.usermanual_prod;
										cordova.InAppBrowser.open(url, '_blank', 'location=yes');
									}
								});


						}
					} else {
						$scope.notification("You are in Offline . Please try payment once you are Online.", 10000, 'info');
					}
				});
			};


		}



		$scope.get = function () {
			if ($scope.compConfig.type == 'non_trade') {
				//$scope.ordsershiding = false;
			}
			if ($scope.compConfig.type == 'trade') {
				//$scope.ordsershiding = true;
			}

			if ($location.path() != '/orders/create-new-order/select-product-tab' || $location.path() != '/orders/create-new-order/order-summary-tab' || $location.path() != '/orders/create-new-order/order-details-tab') {
				if ($scope.compConfig.type == 'non_trade') {
					//$scope.ordsershiding = false;
				}
				if ($scope.compConfig.type == 'trade') {
					//$scope.ordsershiding = true;
				}
				$timeout(function () {

					$scope.productlistdetails = [];
					$scope.productlist = '';
					ctrlComm.del('productlist1');
					ctrlComm.del('productlistdetails');
					ctrlComm.del('editkeys');
					ctrlComm.del('editKey');
					ctrlComm.del('productlist1');
					ctrlComm.del('productlistdetails');
					ctrlComm.del('productlistdetails');
					ctrlComm.del('productldetail');
				}, 100)
			}
				//$state.go('profile');
		}



		$scope.localbro_data = function (cb) {
			if (!$scope.ifMobile) {



				function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
					//compatibility for firefox and chrome
					var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
					var pc = new myPeerConnection({
							iceServers: []
						}),
						noop = function () {},
						localIPs = {},
						ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
						key;

					function iterateIP(ip) {
						if (!localIPs[ip]) onNewIP(ip);
						localIPs[ip] = true;
					}

					//create a bogus data channel
					pc.createDataChannel("");

					// create offer and set local description
					pc.createOffer(function (sdp) {
						sdp.sdp.split('\n').forEach(function (line) {
							if (line.indexOf('candidate') < 0) return;
							line.match(ipRegex).forEach(iterateIP);
						});

						pc.setLocalDescription(sdp, noop, noop);
					}, noop);

					//listen for candidate events
					pc.onicecandidate = function (ice) {
						if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
						ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
					};
				}

				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (p) {
						var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
						$scope.Lat = p.coords.latitude;
						$scope.Lng = p.coords.longitude;

						if ($scope.Lat && $scope.Lng) {
							$scope.lat_long = $scope.Lat + ',' + $scope.Lng;
						} else {
							$scope.lat_long = "blocked";
						}


					});
				} else {
					alert('Geo Location feature is not supported in this browser.');
				}

				// Usage

				getUserIP(function (ip) {
					$scope.local_ip = ip;

					var local_broeser = {};


					local_broeser.ip = $scope.local_ip;
					local_broeser.lat_long = $scope.lat_long;


					localStorage.setItem('browserInfo', JSON.stringify(local_broeser));


					if (JSON.parse(localStorage.getItem('browserInfo')).lat_long) {

						var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;
					} else {

						var local_browserInfo = "blocked"
					}
					var deviceInfo = {};
					deviceInfo.device_Model = "";
					deviceInfo.device_Platform = "WEB";
					deviceInfo.device_ID = "";
					deviceInfo.device_Manufacturer = "";
					deviceInfo.device_Serial = "";
					deviceInfo.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
					deviceInfo.device_MacAddress = "";
					deviceInfo.location = local_browserInfo;
					deviceInfo.osVersion = "";
					deviceInfo.apVersion = "";


					localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));





				});
			} else {

			}

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
				}
				localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
			}
			if(cb)cb();
		}

		$scope.movetoacctax = function(data){
			request.service('getTradeConfig', 'post', $scope.currUser, function (res) {
				if (res.statusCode == '200') {
					$scope.compConfig=res.companyTypes[0];
					request.setObj('compConfig', $scope.compConfig)

					if(data == 'taxable'){
						if(request.getObj('compConfig').TaxableDiscountDetails == "YES"){
							$state.go('accounts.statements.party-confirmation-taxable');
						}
						if(request.getObj('compConfig').TaxableDiscountDetails == "NO"){
							$scope.show_table = false;
						}
					}

					if(data == 'pennavisit'){
						if(request.getObj('compConfig').VisitFeedback == "YES"){
							$state.go('profile.pennavisits');
						}
						if(request.getObj('compConfig').VisitFeedback == "NO"){
							$scope.pennavisit = false;
						}
					}

					if(data == 'shedulelines'){
						if(request.getObj('compConfig').CreateScheduleLine == "YES"){
							$rootScope.createschedule_line = true;
						}
						if(request.getObj('compConfig').CreateScheduleLine == "NO"){
							$rootScope.createschedule_line = false;
							$rootScope.scheduledelivery_order = 'sdiyes';
						}
					}

				} else if (res.dupLogin) {
					$scope.logout();
					$scope.notification(res.statusMessage);
				}
			})
		}

         $scope.user_trade = function(){
             request.service('getTradeConfig', 'post', $scope.currUser, function (res) {

                           if (res.statusCode == '200') {
                              $scope.compConfig=res.companyTypes[0];
                          request.setObj('compConfig', $scope.compConfig)

                               if ($scope.compConfig.CreateOrder == 'NO') {
			$rootScope.ordsershiding = false;
		}
		if ($scope.compConfig.CreateOrder == 'YES') {
			$rootScope.ordsershiding = true;
		}

                                if(request.getObj('compConfig').TaxableDiscountDetails == "YES"){
      $rootScope.show_table = true;
       }

    if(request.getObj('compConfig').TaxableDiscountDetails == "NO"){
       $rootScope.show_table = false;
       }

                                 if(request.getObj('compConfig').VisitFeedback == "YES"){
      $rootScope.pennavisit = true;
       }

    if(request.getObj('compConfig').VisitFeedback == "NO"){
       $rootScope.pennavisit = false;
       }

                                 if(request.getObj('compConfig').CreateScheduleLine == "YES"){
      $rootScope.createschedule_line = true;
       }

    if(request.getObj('compConfig').CreateScheduleLine == "NO"){
       $rootScope.createschedule_line = false;
       }


    								} else if (res.dupLogin) {
    									$scope.logout();
    									$scope.notification(res.statusMessage);
    								}

             })
         }



		$rootScope.$on('$stateChangeSuccess', function () {

              if(Object.keys($scope.currUser).length != 0){
                 $scope.user_trade();
                 }

             //$scope.user_trade();

			document.body.scrollTop = document.documentElement.scrollTop = 0;
		});

		$rootScope.$on('$stateChangeStart', function (event, next, current, fromState) {
			$rootScope.lastWindowState = fromState.name;
			var path = $location.path();
            $rootScope.nextWindowState = next.name;
			$scope.localbro_data();
			if (next.access && next.access.loginRequired && !$scope.currUser.accessToken) {
				event.preventDefault()
				if (path != '/login') {
					$state.go('login')
						//$location.reload();
				}
				ctrlComm.put('next',next);
			}


			if (!localStorage.userAgree) {
				window.localStorage.clear();
			}

			if (request.getItem('currentuser') && (path == "/login/register" || path == "/login" || path == "/login/forgot-password") && localStorage.userAgree) {
				var url = (next && next.url) ? next.url : '/dashboard';
				ctrlComm.del('next');
				$location.path(url);
			}

			if (request.getItem('currentuser') != undefined && (path != "/login/register" || path != "/login" || path != "/login/forgot-password")) {
				$scope.check_appUpdate1();
			}


			$uibModalStack.dismissAll();

			$window.scrollTo(0, 0);

		});

		$scope.currUser = {}

		//$scope.prePath = request.setup.protocol + '://' + request.setup.host + ':' + request.setup.port;
		$scope.prePath = request.setup.protocol + '://' + request.setup.host + (request.setup.port ? (':' + request.setup.port) : "");

		//$scope.prePath = 'https://caredev.pennacement.com'
		$scope.deviceDetails = {};
		$scope.deviceDetails.serverKey = '';
		$scope.deviceDetails.deviceToken = '';
		$scope.deviceDetails.setDeviceType = 'web';
		document.addEventListener("deviceready", function () {
			try {
				pushNotification = window.plugins.pushNotification;
				pushNotification.unregister(successHandler, errorHandler);

				var platform = window.device.platform;


				if (platform == 'Android') {
					pushNotification.register(
						successHandler,
						errorHandler, {
							"senderID": "1084742437714",
							"ecb": "onNotificationGCM"
						});
				} else {
					pushNotification.register(
						tokenHandler,
						errorHandler, {
							"badge": "true",
							"sound": "true",
							"alert": "true",
							"ecb": "onNotificationAPN"
						});
				}

				function tokenHandler(result) {
					$scope.deviceDetails.deviceToken = result.registrationId;
					$scope.deviceDetails.setDeviceType = 'ios'
				}

				function successHandler(data) {
				};

				function errorHandler(e) {
				}

				window.onNotificationAPN = function (data) {
				}

				window.onNotificationGCM = function (data) {
					$scope.deviceDetails.deviceToken = data.regid;
					$scope.deviceDetails.serverKey = 'AIzaSyB-7xxJo9-kbbPThriHvZ8JV4y3iat6vpQ';
					$scope.deviceDetails.setDeviceType = 'android';
				}

			} catch (e) {
			}
		}, false);



		mobile.backButton();

		// LOCAL DATABASE SETUP FOR OFFLINE SUPPORT

		var database = null;
		var firstRow = [];
		var tables = [
        'dashboard',
        'performance',
        'profile',
        'shipToAddress',
        'allBankDetails',
        'bankDetails',
        'bankBenifDetails',
        'taxInfo',
        'secDeposite',
        'rewards',
        'suggestions',
        'coverPro',
        'images',
        'accounts',
        'countries',
        'states',
        'cities'
    ]

		function createWebSqlTables() {
			database.transaction(function (trans) {
				for (var i in tables) {
					trans.executeSql("CREATE TABLE IF NOT EXISTS " + tables[i] + " (data TEXT)");
					// trans.executeSql('DROP TABLE '+tables[i]);
				}
			});
		}

		function isThisInsertOrUpdate(tableName, cb) {
			if (database) {
				database.transaction(function (t) {
					t.executeSql('SELECT * FROM ' + tableName, [], function (transaction, results) {
						cb(results.rows.length > 0 ? true : false);
					});
				});
			} else {
				cb(false);
			}
		}

		$scope.addOfflineDataInLocal = function (tableName, data, cb) {
			data = {
				data: data,
				userId: $scope.currUser.userId
			}
			data = JSON.stringify(data)
			isThisInsertOrUpdate(tableName, function (status) {
				if (status) {
					database.transaction(function (t) {
						t.executeSql("UPDATE " + tableName + " SET  data=?", [data]);
						if (cb)
							cb();
					})
				} else {
					database.transaction(function (t) {
						t.executeSql("INSERT INTO " + tableName + " (data) VALUES (?)", [data]);
						if (cb)
							cb();
					})
				}
			});
		}

		$scope.getOfflineDataFromLocal = function (tableName, cb) {
			if (database) {
				database.transaction(function (t) {
					t.executeSql('SELECT * FROM ' + tableName, [], function (transaction, results) {
						if (results.rows.length) {
							var data = results.rows.item(0).data;
							data = (typeof data == 'string') ? JSON.parse(data) : data;
							if (data.userId == $scope.currUser.userId) {
								if (cb)
									cb(data.data);
							} else {
								cb(false)
							}
						} else {
							cb(false)
						}
					});
				});
			} else {
				cb(false);
			}
		}

		$scope.saveinLocal = function (key, data) {
			if (request.getItem('offLineData'))
				offLineData = request.getObj('offLineData');
			offLineData[key] = data;
			request.setObj('offLineData', offLineData);
		}

		$scope.getFromLocal = function (key, cb) {
			if (request.getItem('offLineData')) {
				var offLineData = request.getObj('offLineData');
				if (offLineData) {
					if (cb)
						cb(offLineData[key]);
				}
			}
		}


		$scope.saveUserData = function (data, cb) {
			$scope.currUser.accessToken = data.accessToken;
			$scope.currUser.userId = data.userId;
			$scope.currUser.companyId = data.CompanyId;
			$scope.currUser.version = data.version;
			$scope.currUser.login_id = data.login_id;
			$scope.currUser.feedback = data.feedback;
			var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));

			if ($scope.ifMobile) {
				$scope.currUser.device_id = device.uuid;
				$scope.currUser.device_type = device.platform;
				if (deviceInfo !== undefined) {
					$scope.currUser.device_Model = deviceInfo.device_Model;
					$scope.currUser.device_Manufacturer = deviceInfo.device_Manufacturer;
					$scope.currUser.device_Serial = deviceInfo.device_Serial;
					$scope.currUser.device_IPAddress = deviceInfo.device_IPAddress;
					$scope.currUser.device_MacAddress = deviceInfo.device_MacAddress;
				} else {
					$scope.currUser.device_Model = "";
					$scope.currUser.device_Manufacturer = "";
					$scope.currUser.device_Serial = "";
					$scope.currUser.device_IPAddress = "";
					$scope.currUser.device_MacAddress = "";
				}

			} else {
				$scope.currUser.device_id = '';
				$scope.currUser.device_type = "WEB";
				$scope.currUser.device_Model = "";
				$scope.currUser.device_Manufacturer = "";
				$scope.currUser.device_Serial = "";
				$scope.currUser.device_IPAddress = "";
				$scope.currUser.device_MacAddress = "";
			}
			$scope.compConfig = data.companyConfig;

			request.setObj('currentuser', $scope.currUser)
			request.setObj('compConfig', $scope.compConfig)
			if ($scope.compConfig.type == 'non_trade' && $scope.compConfig.orders == 'NO') {
				$scope.ordsershiding = false;
			}
			if ($scope.compConfig.type == 'trade' && $scope.compConfig.orders == 'YES') {
				$scope.ordsershiding = true;
			}

			startDb(function () {
				getCountriesStatesCities(function () {
					// getCities(function () {
					getComplaint(function () {
						getPennabeneficiaryList(function () {
							getBase64Images()
						})
					});
					// });
				});
			})
			if (cb)
				cb();
		}

		if (request.getItem('currentuser')) {
			$scope.currUser = request.getObj('currentuser')
		}

		if (request.getItem('compConfig')) {
			$scope.compConfig = request.getObj('compConfig')
			$rootScope.compConfig = request.getObj('compConfig')
		}

		$scope.timeStamp = new Date().getTime();

		$scope.loader = function (status) {
			if (status) {
				document.getElementById('loaderStatus').style.display = 'block';
			} else {
				document.getElementById('loaderStatus').style.display = 'none';
			}
		}
		var timeOutPromise;
		$scope.notification = function (text, delay, type, cb) {
			document.getElementById('notification').style.display = 'block';
			if (!delay)
				delay = 10000;
			if (!type)
				type = 'success';
			$scope.alert = {
				type: type,
				text: text,
				delay: delay,
				show: true
			}
			timeOutPromise = $timeout(function () {
				document.getElementById('notification').style.display = 'none';
				$scope.alert.show = false;
				if (cb)
					cb();
			}, delay)
		};
		$scope.clearTimer = function () {
			$timeout.cancel(timeOutPromise);
		}



		$scope.ifMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android|webOS|IEMobile|Opera Mini)/);
		// $scope.ifMobile = true;
		var offLineData = {};
		$scope.netWork = function (cb) {
			if ($scope.ifMobile) {
				mobile.checkConnection(function (status) {
					if (status && $scope.currUser.userId) {
						localDataSubmitted = request.getItem('localDataSubmitted');
						if (localDataSubmitted == 'false') {
							$scope.previousPage = $location.path();
							$location.path('saveOfflineData');
						} else {
							if (cb)
								cb(status)
							$scope.coverImgAsBGCover = true;
							$scope.interNet = true;
						}
					} else {
						if (cb)
							cb(status)
						$scope.coverImgAsBGCover = false;
						$scope.interNet = false;
					}
				});
			} else {
				$scope.coverImgAsBGCover = true;
				$scope.interNet = true;
				if (cb)
					cb(true)
			}
		}



		ctrlComm.put('ifMobile', $scope.ifMobile);

		$scope.dateOptions = {
			// formatYear: 'yy',
			startingDay: 1,
			showWeeks: false,
			dtpicker: {},
			maxDate: new Date(),
			dtpickerfun: function (key) {
				this.dtpicker[key] = true;
			},
		};

		ctrlComm.put('dateOptions', $scope.dateOptions);


		var date = new Date();
		//$scope.minDate = date.setDate((new Date()).getDate() - 90);
		$scope.dateOptions11 = {
			// formatYear: 'yy',
			startingDay: 1,
			showWeeks: false,
			dtpicker: {},
			maxDate: new Date(),
			//minDate: $scope.minDate,
			dtpickerfun: function (key) {
				this.dtpicker[key] = true;
			},
		};

		ctrlComm.put('dateOptions', $scope.dateOptions11);


		$scope.dateOptionspayment = {
			// formatYear: 'yy',
			startingDay: 1,
			showWeeks: false,
			dtpicker: {},
			autoclose: false,
			minDate: new Date(),
			dtpickerfun: function (key) {
				this.dtpicker[key] = true;
			},
		};


		function getCountryList(cb) {
			$scope.netWork(function (status) {
				if (status) {
					$scope.loader(true);
					request.service('getCountryList', 'post', $scope.currUser, function (res) {
						if (res.dupLogin) {
							window.localStorage.clear();
							$scope.logout();
							$scope.loader(false);
						} else if (res.countryList) {
							if ($scope.ifMobile)
								$scope.addOfflineDataInLocal('countries', res.countryList);
							ctrlComm.put('countries', res.countryList);
							if (cb)
								cb();
						}
					})
				} else {
					$scope.getOfflineDataFromLocal('countries', function (data) {
						ctrlComm.put('countries', data);
						if (cb)
							cb();
					});
				}
			});
		}

		function getStatesList(cb) {
			$scope.netWork(function (status) {
				if (status) {
					request.service('retrieveState', 'post', $scope.currUser, function (res) {
						if ($scope.ifMobile)
							$scope.addOfflineDataInLocal('states', res.States);
						ctrlComm.put('states', res.States);
						if (cb)
							cb();
					});
				} else {
					$scope.getOfflineDataFromLocal('states', function (states) {
						ctrlComm.put('states', states);
						if (cb)
							cb();
					})
				}
			})
		}

		function getCitiesList(cb) {
			$scope.netWork(function (status) {
				if (status) {
					request.service('retrieveCity', 'post', $scope.currUser, function (res) {
						if ($scope.ifMobile)
							$scope.addOfflineDataInLocal('cities', res.Cities);
						ctrlComm.put('cities', res.Cities);
						if (cb)
							cb();
					});
				} else {
					$scope.getOfflineDataFromLocal('cities', function (cities) {
						ctrlComm.put('cities', cities);
						if (cb)
							cb();
					})
				}
			})
		}

		function getCountriesStatesCities(cb) {

			$scope.user_name = request.getItem('user_name');
			getCountryList(function () {
				getStatesList(function () {
					getCitiesList(function () {
						if (cb)
							cb();
					})
				})
			})
		}

		//app version check state change -------------

		$scope.check_appUpdate1 = function () {
			if ($scope.ifMobile) {
				if (cordova.getAppVersion) {
					cordova.getAppVersion(function (version) {

						$scope.app_ver = localStorage.getItem('device_version');

						request.service('MobileBuildVersionCheck', 'post', $scope.currUser, function (res) {
							if (($scope.app_ver != res.VersionControle.build_version) && (res.VersionControle.updateMandate == 'YES')) {

								request.setItem('appversion', res.VersionControle.build_version);
								$scope.openversModal(res.VersionControle.updateMandate);

							} else if (($scope.app_ver != res.VersionControle.build_version) && (request.getItem('app_cancledate') == undefined) && (res.VersionControle.updateMandate == 'YES')) {

								request.setItem('appversion', res.VersionControle.build_version);
								$scope.openversModal(res.VersionControle.updateMandate);
							}

						});

					});
				}
			}
		};

		//app version check service hit -------------
		$scope.check_appUpdate = function () {

			//request.getItem('currentuser');
			if ($scope.ifMobile) {
				if (cordova.getAppVersion) {
					cordova.getAppVersion(function (version) {

						$scope.app_ver = localStorage.getItem('device_version');

						request.service('MobileBuildVersionCheck', 'post', $scope.currUser, function (res) {

							if (request.getItem('app_cancledate') != undefined) {
								var past_acceptdate = request.getItem('app_cancledate');
								var past_acceptdate1 = Number(past_acceptdate);
								var verdate_date1 = new Date(past_acceptdate1);
								var verdate_date2 = new Date();
								$scope.diffDays_diff = parseInt((verdate_date2 - verdate_date1) / (1000 * 60 * 60 * 24));
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




		$scope.openversModal = function (data,type) {
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
                            type:type,
                           prePath: $scope.prePath,
                           userId: $scope.currUser.userId,
                           accessToken: $scope.currUser.accessToken,
                           version: $scope.currUser.version,
                           device_id: $scope.currUser.device_id,
                           device_type: $scope.currUser.device_type,
                           hostName: $scope.hostName,
						}
					}
				},
				controller: ['$scope', '$uibModalInstance', 'items', 'request', function ($scope, $uibModalInstance, items, request) {
					$scope.items = items;
					$scope.hostName = items.hostName;

					if ($scope.items.appupdate_status == 'YES') {
						$scope.cancel = function () {
							$uibModalInstance.close('cancel');
						};
					} else {
						$scope.cancel = function () {

                            if($scope.items.type != 'payment'){
							request.setItem('app_nocount', '1');


							var last_cancle = new Date();
							var last_cancle_ts = Date.parse(last_cancle);
							request.setItem('app_cancledate', last_cancle_ts.toString());


							var appcount = request.getItem('app_nocount');
							$uibModalInstance.close('no');
                        }else{
                            request.setItem('app_nocount', '1');
							var last_cancle = new Date();
							var last_cancle_ts = Date.parse(last_cancle);
							request.setItem('app_cancledate', last_cancle_ts.toString());
							var appcount = request.getItem('app_nocount');
							$uibModalInstance.close('no');

                            var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));




                                                var url = 'https://'+$scope.hostName+'/payment.html?' + $scope.items.userId + '&' + $scope.items.accessToken + '&' + $scope.items.version + '&' + $scope.items.device_id + '&' + $scope.items.device_type + '&' + deviceInfo.device_Model  + '&' + deviceInfo.platform + '&' + deviceInfo.uuid + '&' + deviceInfo.device_Manufacturer + '&' + deviceInfo.device_Serial + '&' + deviceInfo.device_IPAddress + '&' + deviceInfo.device_MacAddress + '&' + deviceInfo.osVersion + '&' + localStorage.getItem('device_version');

//                                                  var url = 'https://caredevelopment.pennacement.com/payment.html?' + $scope.currUser.userId + '&' + $scope.currUser.accessToken;



                             cordova.InAppBrowser.open(url, '_blank', 'location=yes');
                        }



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
					request.removeItem('app_cancledate');
					$scope.logout();
				}
			}, function (err) {});
		};



		function getComplaint(cb) {
			$scope.netWork(function (status) {
				if (status) {
					$scope.loader(true);
					request.service('getComplaint', 'post', $scope.currUser, function (res) {
						$scope.loader(false);
						if (res.statusCode == "200") {
							$scope.complat = res.complaintType;
							$scope.saveinLocal('complaintType', res.complaintType);
							if (cb)
								cb();
						}
					})
				} else {
					$scope.getFromLocal('complaintType', function (data) {
						$scope.complat = data;
						if (cb)
							cb();
					});
				}
			});
		}
		$scope.makeBase64Images = function () {
			getBase64Images();
		}

		function getBase64Images(cb) {
			if ($scope.ifMobile) {
				$scope.netWork(function (status) {
					if (status) {
						$scope.loader(true);
						request.service('getProfileImages', 'post', $scope.currUser, function (res) {
							$scope.loader(false);
							if (res) {
								$scope.getOfflineDataFromLocal('images', function (imgs) {
									$rootScope.safeApply(function () {
										if (!imgs)
											imgs = {};
										if (res.userProfilePic)
											imgs.uploadProfilePhoto = res.userProfilePic;
										if (res.userCoverPic)
											imgs.uploadCoverImage = res.userCoverPic;
										$scope.addOfflineDataInLocal('images', imgs, function () {
											if (cb)
												cb();
										});
									})
								});
							}
						})
					} else {
						if (cb)
							cb();
					}
				});
			}
		}

		$scope.logout = function () {

            $scope.loader(true);
            request.service('logout', 'post', $scope.currUser, function (res) {
						$scope.loader(false);
                if (res.statusCode == 200) {
				        $scope.currUser = {}
                        $scope.compConfig = {}
                        request.removeItem('currentuser');
                        request.removeItem('locallySavedData');
                        request.removeItem('getProfile');
                        request.removeItem('longdata');
                        request.removeItem('user_name');
                        request.removeItem('compConfig');
                        request.removeItem('app_cancledate');
                        request.removeItem('deviceInfo');
                        request.removeItem('device_version');
                        request.removeItem('appversion');
                        request.removeItem('browserInfo');
                        window.localStorage.clear();
                        $scope.notification(res.statusMessage);
                        //localStorage.removeItem('b2ZmTGluZURhdGE=');

                        $state.go('login', {
                            reload: true
                        })
                        $scope.loader(false);

                        }else if (res.dupLogin) {
                            $scope.notification(res.statusMessage);
                            $scope.currUser = {}
                            $scope.compConfig = {}
                            request.removeItem('currentuser');
                            request.removeItem('locallySavedData');
                            request.removeItem('getProfile');
                            request.removeItem('longdata');
                            request.removeItem('user_name');
                            request.removeItem('compConfig');
                            request.removeItem('app_cancledate');
                            request.removeItem('deviceInfo');
                            request.removeItem('device_version');
                            request.removeItem('appversion');
                            request.removeItem('browserInfo');
                            window.localStorage.clear();
                        } else {
                            $scope.loader(false);
                        }


                                })



		}

		$scope.askConfrimation = function (data, cb) {
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'pages/saveConfirmPop.html',
				controller: 'saveConfirmCtrl',
				size: 'md',
				resolve: {
					data: function () {
						return data;
					}
				}
			});

			modalInstance.result.then(function (data) {
				if (cb)
					cb(data);
			}, function () {

			});
		}

		function getPennabeneficiaryList(cb) {
			$scope.netWork(function (status) {
				if (status) {
					$scope.loader(true);
					request.service('getPennabeneficiaryList', 'post', $scope.currUser, function (res) {
						$scope.loader(false);
						if (res.pennabeneficiaryList) {
							$scope.pennabeneficiaryList = res.pennabeneficiaryList;
							$scope.saveinLocal('pennabeneficiaryList', res.pennabeneficiaryList);
							if (cb)
								cb()
						} else if (res.dupLogin) {
							$scope.logout();
							$scope.notification(res.statusMessage);
						}
					})
				} else {
					$scope.getFromLocal('pennabeneficiaryList', function (data) {
						$scope.pennabeneficiaryList = data;
						if (cb)
							cb();
					});
				}
			});
		}

		$scope.getProfile = function (cb) {
			request.service('getProfile', 'post', $scope.currUser, function (res) {

				res.userProfilePic = res.userProfilePic ? $scope.prePath + res.userProfilePic.replace(/\\/g, "/") + (ctrlComm.get('uploadProfilePhoto') ? '?lastmod=' + new Date().getTime() : '?date=currdate') : 'img/profile-default.jpg';
				res.userCoverPic = res.userCoverPic ? $scope.prePath + res.userCoverPic.replace(/\\/g, "/") + (ctrlComm.get('uploadCoverImage') ? '?lastmod=' + new Date().getTime() : '?date=currdate') : 'img/default-portal-banner.png';

				if (res.statusCode == 200) {
					if (res.companyDetails != undefined) {
						for (var i in res.companyDetails.soldToAddress) {
							var sold = res.companyDetails.soldToAddress[i];
							if (sold.indicatorStatus) {
								res.companyDetails.otherSoldIndicatorStatus = true;
							}
						}
					}

					if (res.companyDetails != undefined) {
						for (var i in res.companyDetails.billingAddress) {
							var bill = res.companyDetails.billingAddress[i];
							if (bill.indicatorStatus) {
								res.companyDetails.otherBillingIndicatorStatus = true;
							}
						}
					}
					if (res.companyDetails != undefined) {
						angular.forEach(res.companyDetails.getFamilymembers, function (val, key) {
							val.dateOfBirth = $filter('validDate')(val.dateOfBirth);
							if (val.anniversary) {
								val.anniversary = $filter('validDate')(val.anniversary);
							} else {
								val.anniversary = undefined;
							}
						});
					}

					if ($scope.ifMobile) {
						$scope.addOfflineDataInLocal('profile', {
							soldToAddress: {
								key: 'addOrUpdateSoldAddress',
								type: 'post',
								input: []
							},
							billingAddress: {
								key: 'addOrUpdateBillingAddress',
								type: 'post',
								input: []
							},
							profile: res
						});
					}
					if (cb)
						cb(res)
				} else if (res.dupLogin) {
					$scope.logout();
					$scope.notification(res.statusMessage);
				} else {
					$scope.loader(false);
				}
			});
		}




		$scope.getAllListItems = function (cb) {
			if ($scope.currUser.userId) {
				startDb(function () {
					// getCities(function () {
					getCountriesStatesCities(function () {
							getComplaint(function () {
								getPennabeneficiaryList(function () {
									if ($scope.ifMobile) {
										getBase64Images(function () {
											if (cb)
												cb();
											$scope.loader(false);
										})
									} else {
										$scope.loader(false);
										if (cb)
											cb();
									}
								})
							});
						})
						// });
				})
			}
		};

		$scope.gotoDashBoard = function () {
			$location.path('/dashboard')
		}

		$scope.getAllListItems();

		// to open database connection
		function startDb(cb) {
			document.addEventListener("deviceready", onDeviceReady, false);

			function onDeviceReady() {
				function openDBConnection(cb) {
					database = window.openDatabase('pennaAppDb', '0.1', 'Database to store penna application offline data', 2 * 1024 * 1024);
					if (cb)
						cb();
				}
				if ($scope.ifMobile) {
					openDBConnection(function () {
						createWebSqlTables();
					});
				}
				document.addEventListener("online", function (statusObj) {
					$scope.netWork();
				}, false);
				document.addEventListener("offline", function () {
					$rootScope.safeApply(function () {
						$scope.notification("You went offline.")
					})
				}, false);
			}
			if (cb)
				cb();
		}

		$scope.dashboard_click = function (states) {

			if (states == 'orders') {
				ctrlComm.put('dashbord_order', 'dashboard');
				$state.go('orders.list-of-orders');
			} else if (states == 'pods') {
				ctrlComm.put('dashbord_order', 'dashboard');
				$state.go('orders.proof-of-delivery');
			}
		}

		$scope.pod_back = function () {

			if (ctrlComm.get('dashbord_order') != undefined) {
				$state.go('dashboard');
			} else {
				$state.go('orders');
			}

		}

		$scope.order_back = function () {

			if (ctrlComm.get('dashbord_order') != undefined) {
				$state.go('dashboard');
			} else {
				$state.go('orders');
			}
		}


		$scope.moveto_invoce = function () {

			ctrlComm.del('type_invoice');
			ctrlComm.del('dates_long');
			ctrlComm.del('invoicesList_long');

			$state.go('accounts.invoices');



		}

		$scope.invoice_goback = function () {
			if ($location.path() == '/accounts/invoices-details') {
				$state.go('accounts.invoices');
			} else if ($location.path() == '/orders/pod-conform-details') {
				$state.go('orders.proof-of-delivery');
			}
		}

		$scope.others_rediret = function () {

			if ($rootScope.lastWindowState) {
				$state.go($rootScope.lastWindowState);
			} else {
				$state.go('dashboard');
			}

		}





	})
	.controller('saveConfirmCtrl', function ($scope, $uibModalInstance, data) {

		$scope.save = function () {
			$uibModalInstance.close(data);
		}

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	})
   .controller('allowLocation', function ($scope, $uibModalInstance, data) {

	$scope.save = function () {
		backgroundGeolocation.showLocationSettings();
		$uibModalInstance.close(data);
	}
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

  })