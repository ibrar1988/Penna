(function () {
	var pennaApp = angular.module('pennaApp');
	var request = function ($http, secure, ctrlComm) {
		var setup = {
			'protocol': 'https',
			// 'host': 'customerportal.pennacement.com',
			'host': 'caredevelopment.pennacement.com',
			//			'host': 'careqas.pennacement.com',
			'port': '443',
			'prefix': 'penna', //			'prefix': 'penna-qa',
			'paths': {
				//login  services -------
				userSignUp: '/profile/userSignUp',
				doLogin: '/profile/doLogin',
				forgotPassword: '/profile/forgotPassword',
				loginVerification: '/profile/loginVerification',
				changePassword: '/profile/changePassword',
				getSalesRepInfo: '/dashboard/getSalesOfficerDetail',
				logout: '/dashboard/logout',
				//profile  services -------
				getProfile: '/profile/getProfile',
				getProfileImages: '/profile/getProfileImages',
				updateProfile: '/profile/updateProfile',
				getSecurityDeposit: '/profile/getSecurityDeposit',
				getTaxInfo: '/profile/getTaxInfo',
				// addTaxInfo: '/profile/addTaxInfo',
				getShiptoAddress: '/profile/getShiptoAddress',
				addShipToAddress: '/profile/addShipToAddress',
				uploadShipToAddress: '/profile/uploadShipToAddress',
				getBankDetails: '/profile/getBankDetails',
				addBankDetails: '/profile/addBankDetails',
				addPennaBenificiaryDetails: '/profile/addPennaBenificiaryDetails',
				getPennabeneficiaryList: '/profile/getPennabeneficiaryList',
				addPbDetailsFromDropDown: '/profile/addPbDetailsFromDropDown',
				getRequestNumber: '/profile/getRequestNumber',
				addSuggestions: '/profile/addSuggestions',
				getSuggestions: '/profile/getSuggestions',
				getSuggestionImages: '/profile/getSuggestionImages',
				uploadTaxDocuments: '/profile/uploadTaxDocuments',
				getTaxInfoImages: '/profile/getTaxInfoImages',
				uploadBillingAddress: '/profile/uploadBillingAddress',
				uploadSoldtoAddress: '/profile/uploadSoldtoAddress',
				uploadCoverImage: '/profile/uploadCoverImage',
				uploadProfilePhoto: '/profile/uploadProfilePhoto',
				getComplaint: '/profile/getComplaint',
				addOrUpdateSoldAddress: '/profile/addOrUpdateSoldAddress',
				addOrUpdateBillingAddress: '/profile/addOrUpdateBillingAddress',
				addOrUpdatePartner: '/profile/addOrUpdatePartner',
				addOrUpdateFamily: '/profile/addOrUpdateFamily',
				addOrUpdateRefernces: '/profile/addOrUpdateRefernces',
				getCountryList: '/profile/getCountryList',
				retrieveState: '/profile/retrieveState',
				retrieveCity: '/profile/retrieveCity',
				getTermsAndConditionURL: '/profile/getTermsAndConditionURL',
				saveTandCAgreement: '/profile/saveTandCAgreement',
				deleteProfileObject: '/profile/deleteProfileObject',
				//dashboard  services -------
				myPerformances: '/dashboard/myPerformance',
				myPerformance: '/dashboard/myPerformanceTest',
				updateInvoice: '/dashboard/updateInvoice',
				creditDetails: '/dashboard/creditDetails',
				companyUpdates: '/dashboard/companyUpdates',
				getOrderService: '/dashboard/getOrderService',
				getNoOfPendingPoDs: '/dashboard/getNoOfPendingPoDs',
				getListOfPendingPoDs: '/dashboard/getListOfPendingPoDs',
				getCreditDetailsLive: '/dashboard/getCreditDetailsLive',
				confirmPoD: '/dashboard/confirmPoD',
				getODOS: '/dashboard/getODOS',
				updateInvoiceDetails: '/dashboard/updateInvoiceDetails',
				getWishesh: '/dashboard/getWishesh',
				MobileBuildVersionCheck: '/dashboard/MobileBuildVersionCheck',
				getQuestions: '/dashboard/getQuestions',
				getOfficerVisits: '/dashboard/getOfficerVisits',
				syncVisitorFeedback: '/dashboard/syncVisitorFeedback',
				syncPortalFeedback: '/dashboard/syncPortalFeedback',
				getPortalFeedback: '/dashboard/getPortalFeedback',
				// Accounts
				getPartyConfirmation: '/payment/getPartyConfirmation',
				getTaxPartyConfirmation: '/payment/getTaxPartyConfirmation',
				getLongPartyConfirmation: '/payment/getLongPartyConfirmation',
				getTaxLongPartyConfirmation: '/payment/getTaxLongPartyConfirmation',
				getPaymentGatewaySignature: '/payment/getPaymentGatewaySignature',
				getInvoicesInAccounts: '/dashboard/getInvoicesInAccounts',
				getPaymentList: '/payment/getPaymentList',
				getPaymentResponse: '/sfIntigration/getPaymentResponse',
				getMonthlyPartyConfirmation: '/payment/getMonthlyPartyConfirmation',
				setMonthlyPartyConfirmation: '/payment/setMonthlyPartyConfirmation',
				getLongInvoicesInAccounts: '/dashboard/getLongInvoicesInAccounts',
				pfeedstatus: '/dashboard/pfeedstatus',
				paymentgetPdf: '/payment/getPdf',

				//orders --------

				getOrdersList: '/orders/getOrdersList',
				createOrder: '/orders/createOrder',
				getProductList: '/orders/getProductList',
				getShippingAddresses: '/orders/ShippingAddresses',
				getShippingConfig: '/orders/getShippingConfig',
				getConfirmedPODs: '/dashboard/getConfirmedPODs',
                 getInvoicePDFLive: '/orders/getInvoicePDFLive',
                 syncScheduleLines: '/orders/syncScheduleLines',
                //pdf files
                   getPdfFileUrl: '/payment/getPdfFileUrl',
                   getExcelFileUrl: '/payment/getExcelFileUrl',
                   getTaxPdfFileUrl: '/payment/getTaxPdfFileUrl',
                   getTaxExcelFileUrl: '/payment/getTaxExcelFileUrl',


                   getTradeConfig: '/dashboard/getTradeConfig',


			},

			'url': function (key) {
				if (setup.paths.hasOwnProperty(key)) {
					return setup.protocol + '://' + setup.host + ':' + setup.port + '/' + setup.prefix + setup.paths[key]
				} else {
					return 'invalid service'
				}
			}

		}

		var serviceCall = function (key, type, input, cb) {

			var satus = window.localStorage.getItem(secure.encode('currentuser'))

			if (satus || key == 'doLogin' || key == 'userSignUp' || key == 'forgotPassword' || key == 'loginVerification' || key == 'MobileBuildVersionCheck') {

				$http[type](setup.url(key), input, {})
					.success(function (data) {
						if (data.statusMessage == "Please send a valid token!!") {
							cb({
								dupLogin: true,
								statusMessage: 'Authorisation failed, Please login again.'
							});
						} else if (data) {
							cb(data);
						}
					})
					.error(function (err) {
						if (err) {
							console.log("ERROR ======= :: ", err);
							if (err.statusMessage) {
								cb(err);
							} else {
								cb({
									statusMessage: 'Server is down. Please try after some time.'
								});
							}
						} else {
							cb({
								statusMessage: 'Server is down. Please try after some time.'
							});
						}
					});
			} else {
				location.reload();
			}
		}






		var setObj = function (key, data, cb) {
			window.localStorage.setItem(secure.encode(key), secure.encode(JSON.stringify(data)));
			if (cb) cb();
		}
		var getObj = function (key) {
			var obj = window.localStorage.getItem(secure.encode(key));
			if (obj) {
				var obj = secure.decode(obj);
				try {
					return JSON.parse(obj);
				} catch (e) {
					return {
						distrub: true
					}
				}
			} else {
				return null;
			}
		}
		var setItem = function (key, data, cb) {
			window.localStorage.setItem(secure.encode(key), secure.encode(data));
			if (cb) cb();
		}
		var getItem = function (key) {
			var item = window.localStorage.getItem(secure.encode(key));
			if (item) {
				return secure.decode(item);
			} else {
				return null;
			}
		}
		var removeItem = function (key) {
			window.localStorage.removeItem(secure.encode(key));
		}

		var sortNumber = function (a, b) {
			return a - b;
		}
		var getBase64 = function (file) {
			try {
				if (file) {
					var reader = new FileReader();
					reader.onloadend = function () {
						return reader.result;
					}
					reader.readAsDataURL(file);
				}
			} catch (e) {
				var msg = "Error occurred in Utilities --- > getBase64 -- > message -->" + e.message;
			}
		};

		var base64toBlob = function (dataURI, callback) {
			try {
				// convert base64/URLEncoded data component to raw binary data held in a string
				var byteString;
				if (dataURI.split(',')[0].indexOf('base64') >= 0)
					byteString = atob(dataURI.split(',')[1]);
				else
					byteString = unescape(dataURI.split(',')[1]);

				// separate out the mime component
				var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

				// write the bytes of the string to a typed array
				var ia = new Uint8Array(byteString.length);
				for (var i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}

				var bb = new Blob([ia], {
					type: mimeString
				});
				callback(bb);
				//return bb;
			} catch (e) {
				var msg = "Error occurred in Utilities --- > base64toBlob -- > message -->" + e.message;
				this.sendErrorLogsToServer(msg);

			}
		};
		var getContries = function () {
			return ctrlComm.get('countries');
		}
		var getStates = function () {
			return ctrlComm.get('states');
		}
		var getCities = function () {
			return ctrlComm.get('cities');
		}
		var getCountryID = function (countryName) {
			var countries = getContries();
			for (var i in countries) {
				if (countryName == countries[i].name) {
					return countries[i].countryid
					break;
				}
			}
		}
		var getStateID = function (stateName) {
			var states = getStates();
			for (var i in states) {
				if (stateName == states[i].name) {
					return states[i].stateId
					break;
				}
			}
		}
		var getStateNameByID = function (stateId) {
			var states = getStates();
			for (var i in states) {
				if (stateId == states[i].stateId) {
					return states[i].name
					break;
				}
			}
		}
		var getCountryNameByID = function (countryId) {
			var countries = getContries();
			for (var i in countries) {
				if (countryId == countries[i].countryid) {
					return countries[i].name
					break;
				}
			}
		}
		var getCityID = function (cityName) {
			var cities = getCities();
			for (var i in cities) {
				if (cityName == cities[i].name) {
					return cities[i].cityId
					break;
				}
			}
		}
		var getCountryStates = function (countryName) {
			var countryID = getCountryID(countryName);
			var allStates = getStates();
			var states = []
			for (var i in allStates) {
				if (countryID == allStates[i].countryId) {
					states.push(allStates[i]);
				}
			}
			return states;
		}
		var getStateCities = function (stateName) {
			var stateID = getStateID(stateName);
			var allCities = getCities();
			var cities = [];
			for (var i in allCities) {
				if (stateID == allCities[i].stateId) {
					cities.push(allCities[i]);
				}
			}
			return cities;
		}
		var getStateCountry = function (stateName) {
			// var stateID = getStateID(stateName);
			var allStates = getStates();
			for (var i in allStates) {
				if (allStates[i].name == stateName) {
					return getCountryNameByID(allStates[i].countryId);
					break;
				}
			}
		}
		var getCitiesState = function (cityName) {
			// var cityID = getCityID(cityName);
			var allCities = getCities();
			for (var i in allCities) {
				if (cityName == allCities[i].name) {
					return getStateNameByID(allCities[i].stateId);
					break;
				}
			}
		}
		var print = function (data) {
			var mywindow = window.open('', '_blank', 'width=700,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
			mywindow.document.write('<html><head><title></title>');
			mywindow.document.write('</head><body>');
			mywindow.document.write(data);
			mywindow.document.write('</body></html>');
			mywindow.document.close();
			mywindow.focus();
			mywindow.print();
			// mywindow.close();
			return true;
		}
		return {
			'service': serviceCall,
			'setObj': setObj,
			'getObj': getObj,
			'setItem': setItem,
			'getItem': getItem,
			'removeItem': removeItem,
			'setup': setup,
			'sort': sortNumber,
			'getBase64': getBase64,
			'base64toBlob': base64toBlob,
			'getContries': getContries,
			'getStates': getStates,
			'getCities': getCities,
			'getCountryStates': getCountryStates,
			'getStateCities': getStateCities,
			'getStateCountry': getStateCountry,
			'getCitiesState': getCitiesState,
			'print': print
		}
	}
	pennaApp.factory('request', ['$http', 'secure', 'ctrlComm', request]);

	pennaApp.service('ctrlComm', function () {
		var ctrlPocket = {};
		var put = function (key, value) {
			ctrlPocket[key] = value;
		};
		var get = function (key) {
			return ctrlPocket[key];
		};
		var del = function (key) {
			delete ctrlPocket[key];
		};
		return {
			put: put,
			get: get,
			del: del
		};
	});
	pennaApp.directive('myTextlen', function () {
		return {
			restrict: 'A',
			link: function (scope, elm, attr, ctrl) {
				var maxlength = -1;
				attr.$observe('myTextlen', function (value) {
					maxlength = value;
				});
				elm.bind('keypress', function (event) {
						if (event.charCode) {
							if (elm[0].value.length > maxlength - 1) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}),
					elm.bind('paste', function (event) {
						event.preventDefault();
						event.stopPropagation();
					});
			}
		};
	})
	pennaApp.directive('noSpecials', function () {
		return {
			restrict: 'A',
			link: function (scope, elm, attr, ctrl) {
				var maxlength = -1;
				attr.$observe('noSpecials', function (value) {
					maxlength = value;
				});
				elm.bind('keypress', function (event) {
						if (event.charCode) {
							if (elm[0].value.length > maxlength - 1) {
								event.preventDefault();
								event.stopPropagation();
							}
							if ((event.charCode >= 48 && event.charCode <= 57) ||
								(event.charCode >= 65 && event.charCode <= 90) ||
								(event.charCode >= 97 && event.charCode <= 122)) {} else {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}),
					elm.bind('paste', function (event) {
						event.preventDefault();
						event.stopPropagation();
					});
			}
		};
	})
	pennaApp.directive('onlySpace', function () {
		return {
			restrict: 'A',
			link: function (scope, elm, attr, ctrl) {
				var maxlength = -1;
				attr.$observe('onlySpace', function (value) {
					maxlength = value;
				});
				elm.bind('keypress', function (event) {
						if (maxlength) {
							if (event.charCode) {
								if (elm[0].value.length > maxlength - 1) {
									event.preventDefault();
									event.stopPropagation();
								}
							}
						}
						if (event.charCode) {
							if ((event.charCode >= 48 && event.charCode <= 57) ||
								(event.charCode >= 65 && event.charCode <= 90) ||
								(event.charCode >= 97 && event.charCode <= 122) ||
								event.charCode == 32) {} else {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}),
					elm.bind('paste', function (event) {
						event.preventDefault();
						event.stopPropagation();
					});
			}
		};
	})
	pennaApp.directive('onlytextAndspace', function () {
		return {
			restrict: 'A',
			link: function (scope, elm, attr, ctrl) {
				var maxlength = -1;
				attr.$observe('onlytextAndspace', function (value) {
					maxlength = value;
				});
				elm.bind('keypress', function (event) {
						if (maxlength) {
							if (event.charCode) {
								if (elm[0].value.length > maxlength - 1) {
									event.preventDefault();
									event.stopPropagation();
								}
							}
						}
						if (event.charCode) {
							if (
								(event.charCode >= 65 && event.charCode <= 90) ||
								(event.charCode >= 97 && event.charCode <= 122) ||
								event.charCode == 32) {} else {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}),
					elm.bind('paste', function (event) {
						event.preventDefault();
						event.stopPropagation();
					});
			}
		};
	})
	pennaApp.directive('allowTwodecimals', function () {
		return {
			restrict: 'A',
			link: function (scope, elm, attr, ctrl) {
				elm.bind('keypress', function (event) {
					if (event.charCode) {
						var allow = [46,48,49,50,51,52,53,54,55,56,57]
						if((allow.indexOf(event.charCode)===-1) ||
							(event.charCode===46 && elm[0].value.indexOf('.')!==-1) ||
							elm[0].value.length>20){
							event.preventDefault();
							event.stopPropagation();
						}
						
					}
					if (event.keyCode === 32) {
								event.target.value = 	'';
							}
				}),
				
				elm.bind('keydown', function (event) {
							if (event.keyCode === 32) {
								event.target.value = 	'';
							}
				}),
				elm.bind('keyup',function(event){
					
					var value = event.target.value;
						if(value.indexOf('.')!==-1){
							var arr = value.split('.');
							var decimals = arr[1]
							if(decimals.length>=2){
								arr[1] = decimals.substr(0,2);
								event.target.value = arr.join('.');
							}
						}else{
							if(event.target.value){
																					
								if(!(isNaN(event.target.value))){
								event.target.value = parseInt(event.target.value);
								}else{
								event.target.value = 	'';
								}
							}
						}
				}),
				elm.bind('blur',function(event){
					if(event.target.value){
						event.target.value = parseFloat(event.target.value).toFixed(2)
					}
				}),
				elm.bind('paste', function (event) {
					event.preventDefault();
					event.stopPropagation();
				});
			}
		};
	});
	pennaApp.directive('myLength', function () {
		return {
			restrict: 'A',
			link: function (scope, elm, attr, ctrl) {
				var maxlength = -1;
				attr.$observe('myLength', function (value) {
					maxlength = value;
				});
				elm.bind('keypress', function (event) {
						if (event.charCode) {
							if (event.charCode < 48 || event.charCode > 57) {
								event.preventDefault();
								event.stopPropagation();
							}
							if (elm[0].value.length > maxlength - 1) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}),
					elm.bind('paste', function (event) {
						event.preventDefault();
						event.stopPropagation();
					});
			}
		};
	});
	pennaApp.directive('starRating', function () {
	    return {
	        restrict: 'A',
	        template: '<ul class="rating">' +
	            '<li ng-repeat="star in stars"  ng-class="star" ng-click="toggle($index)">' +
	            '\u2605' +
	            '</li>' +
	            '</ul>',
	        scope: {
				readonly: '@',
	            ratingValue: '=',
	            max: '=',
	            onRatingSelected: '&'
	        },
	        link: function (scope, elem, attrs) {
	            var updateStars = function () {
	                scope.stars = [];
	                for (var i = 0; i < scope.max; i++) {
	                    scope.stars.push({
	                        filled: i < scope.ratingValue
	                    });

	                }
	            };

				scope.toggle = function (index) {
					var status = (scope.readonly && scope.readonly.toString()==='true') ? false : true;
					if(status){
						scope.ratingValue = index + 1;
						scope.onRatingSelected({
							rating: index + 1
						});
					}
				};
				scope.$watch('ratingValue', function (oldVal, newVal) {
					if (newVal) {
						updateStars();
					}else{
						updateStars();
					}
				});

	            updateStars();
	        }
	    }
	});

	pennaApp.filter('showorderstatus', function (request) {
		return function (text) {
			var order_status = " | "+text;
			var statusArr = ["Completely Fulfilled","Closed","Cancelled"];
			for (var i in statusArr) {
				if (statusArr[i] === text) {
					order_status = '';
					break;
				};
			};
			return order_status;
		};
	});

	pennaApp.filter('showCityName', function (request) {
		return function (cID) {
			cID = parseInt(cID);
			var cities = request.getCities();
			for (var i in cities) {
				if (cities[i].cityId == cID) {
					return cities[i].name;
					break;
				}
			}
		}
	});
	pennaApp.filter('showStateName', function (request) {
		return function (sID) {
			sID = parseInt(sID);
			var states = request.getStates();
			for (var i in states) {
				if (states[i].stateId == sID) {
					return states[i].name;
					break;
				}
			}
		}
	});
	pennaApp.filter('showCountryName', function (request) {
		return function (cID) {
			cID = parseInt(cID);
			var countries = request.getContries();
			for (var i in countries) {
				if (countries[i].countryid == cID) {
					return countries[i].name;
					break;
				}
			}
		}
	});
	pennaApp.filter('dateFormatFilter', function () {
		return function (input) {
			var dt = new Date(input);
			var dd = (dt.getDate() > 9) ? dt.getDate() : '0' + dt.getDate();
			var mm = (dt.getMonth() > 9) ? (dt.getMonth() + 1) : '0' + (dt.getMonth() + 1);
			var yy = dt.getFullYear();

			if (mm == '010') {
				var mm = 10;
				return dd + "-" + mm + "-" + yy
			} else {
				return dd + "-" + mm + "-" + yy
			}

			/*
			 return dd + "-" + mm + "-" + yy*/
		}
	});
	pennaApp.filter('validDate', function () {
		return function (dt) {
			if (dt) {
				if (typeof dt == 'string') {
					var arr = dt.split(' ')
					if (arr[0]) {
						return new Date(arr[0]).setHours(0, 0, 0, 0);
					}
				} else {
					return dt;
				}
			} else {
				return undefined;
			}
		}
	});
	pennaApp.filter("rounded", function () {
		return function (val) {

			if (val != undefined) {
				return val.toFixed(0);
			}

		}
	});
})();