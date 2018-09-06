angular.module('pennaApp').controller('dashbordctrl', function ($scope, $rootScope, $uibModal, $log, $state, $window, ctrlComm, request, $timeout, $location, $filter, mobile, $sce) {


	ctrlComm.del('dashbord_order');

	//////////////////no.of pods //////////////

	request.service('getNoOfPendingPoDs', 'post', $scope.currUser, function (res) {
		$scope.pods_no = res.NoOfPoDs

	});
	var getFeedbackInfo = function(){
		request.service('pfeedstatus','post',$scope.currUser,function(res){
			$scope.feedback = res.feedback;
		});
	}
	getFeedbackInfo();
	//////////////////close  no.of pods //////////////


	$scope.user_name = request.getItem('user_name');

	$scope.orderpage1 = function (key) {

		if ($scope.compConfig.type == 'non_trade') {
			$scope.ordsershiding = false;
		}
		if ($scope.compConfig.type == 'trade') {
			$scope.ordsershiding = true;
			request.service('getNoOfPendingPoDs', 'post', $scope.currUser, function (res) {
				if (res.NoOfPoDs < 3) {
					ctrlComm.put('ordersKey', key);

					$scope.netWork(function (status) {
						if (status) {
							$state.go('orders.create-new-order.select-product-tab', {}, {
								reload: true
							});
							//location.reload();

						} else {
							$scope.notification("You are in Offline . Please try orders once you are Online.", 10000, 'info');
						}
					});

				} else {
					$scope.notification("Please confirm your pending POD'S to place further Orders !", 10000, 'info');

				}

			});

		}

	}





	$scope.ifMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android|webOS|IEMobile|Opera Mini)/);

	var doughnutOptions = {
		segmentShowStroke: true,
		segmentStrokeColor: "#fff",
		segmentStrokeWidth: 1,
		"paletteColors": "#feca08,#555555,#42cbfd,#c0c0c1",
		percentageInnerCutout: 85,
		animation: true,
		animationSteps: 100,
		animationEasing: "easeOutBounce",
		animateRotate: true,
		animateScale: true,
        showTooltips: true,
        	showAllTooltips: true,
		onAnimationComplete: function (label) {
             // this.showTootip(this.datasets[0].bars,true);
        },
          tooltipTemplate: function(label) {
                return label.label + ':' + label.value;
            }

	}





	function getBirthdayAniversaries(cb) {
		$scope.netWork(function (status) {
			if (status) {
				$scope.getProfile(function (data) {
					if (data.companyDetails != undefined) {
						createWishes(data.companyDetails.getFamilymembers)
					}
					if (cb) cb();
				})
			} else if ($scope.ifMobile) {
				$scope.getOfflineDataFromLocal('profile', function (data) {
					$rootScope.safeApply(function () {
						if (data && data.profile && data.profile.companyDetails) {
							createWishes(data.profile.companyDetails.getFamilymembers)
						}
						if (cb) cb()
					})
				});
			}
		})
	}
	$scope.bdnotification = [];
	$scope.anvsryNotification = [];

	function createWishes(data) {
		var tday = new Date().getDate();
		var tMnt = new Date().getMonth();
		for (i in data) {
			var bday = new Date(data[i].dateOfBirth).getDate();
			var bMnt = new Date(data[i].dateOfBirth).getMonth();
			var aday = new Date(data[i].anniversary).getDate();
			var aMnt = new Date(data[i].anniversary).getMonth();

			if (bday == tday && bMnt == tMnt) {
				$scope.bdnotification.push({
					name: data[i].familyName,
					wishes: 'Penna wishes you a Happy Birthday and a prosperous year ahead!!'
				});
			}

			if (aday == tday && aMnt == tMnt) {
				$scope.anvsryNotification.push({
					name: data[i].familyName,
					wishes: 'Penna wishes you a Happy Anniversary and a prosperous year ahead!!'
				});
			}
		}
	}

	var performance1 = function (cb) {

		$scope.netWork(function (status) {
			if (status) {
				request.service('myPerformance', 'post', $scope.currUser, function (res) {

					if (res.statusCode == 200) {
						if (res.Payments_Month) {
							assignPerformance(res, function () {
								if ($scope.ifMobile) {
									$scope.getOfflineDataFromLocal('performance', function (data) {
										if (!data) data = {}
										data.performance = res
										$scope.addOfflineDataInLocal('performance', data, function () {
											if (cb) cb();
										});
									});
								} else {
									if (cb) cb();
								}
							});
						}
					} else if (res.dupLogin) {
						$scope.logout();
					} else {
						$scope.loader(false)
						if (cb) cb();
					}

				});
			} else if ($scope.ifMobile) {
				$scope.getOfflineDataFromLocal('performance', function (data) {
					if (data) {
						$rootScope.safeApply(function () {
							if (data.performance && data.performance.Payments_Month) {
								assignPerformance(data.performance, function () {
									if (cb) cb();
								});
							} else {
								if (cb) cb();
							}
						});
					} else {
						if (cb) cb();
					}
				});
			}
		});
	}

	function assignPerformance(res, cb) {

		var months13 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		var date11 = new Date();
		var month11 = date11.getMonth();
		$scope.month22 = months13[month11];
		$scope.day11 = date11.getDate();
		$scope.year11 = date11.getFullYear();

		$scope.performance = res;

		//month sales---------------
		$scope.month = res.Sales_Month;
		if ($scope.month) {
			for (i = 0; i < $scope.month.length; i++) {
				$scope.present_month = $scope.month[0];
			}
		}

		//Payments pay ment
		$scope.Payments = res.Payments_Month;
		if ($scope.Payments) {
			for (j = 0; j < $scope.Payments.length; j++) {
				var keys = Object.keys($scope.Payments[0]);
				$scope.value_payment = $scope.Payments[0][keys];
			}
		}


		$scope.ProductMix_Month = res.ProductMix_Month;

		$scope.product = [];
		$scope.datas66 = [];

		var newColors = {
			OPC43: '#feca08',
			PSC: '#42cbfd',
			PPC: '#c0c0c1',
			OPC53: '#555555'
		}

		if ($scope.ProductMix_Month) {
			$scope.month_prolist = $scope.ProductMix_Month[0].Month;
			for (k = 0; k < $scope.month_prolist.length; k++) {
				var pro_name = $scope.month_prolist[k].ProdName;
				$scope.product.push(pro_name);

				var product_data = $scope.month_prolist[k][pro_name][0];
				var value_pp = Object.keys(product_data);
				var final_value = Number($scope.rounddata(product_data[value_pp]));

				$scope.datas66.push({
					label: pro_name,
					value: final_value,
					color: newColors[$scope.month_prolist[k].ProdName],
					//highlight: colors[r].highlight
				});
			}


			$scope.total_quanty = $scope.datas66[0].value + $scope.datas66[1].value + $scope.datas66[2].value + $scope.datas66[3].value;


		}


		if (document.getElementById("doughnutChart")) {
			var ctx = document.getElementById("doughnutChart").getContext("2d");
			var mydoughnutChart = new Chart(ctx).Doughnut($scope.datas66, doughnutOptions);


		}

		if (cb) cb();
	}

	var getCreditDetails = function (cb) {
		$scope.netWork(function (status) {
			if (status) {
				request.service('getCreditDetailsLive', 'post', $scope.currUser, function (res) {

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

			//			$scope.creditDetails.OsAmt = parseFloat($scope.creditDetails.OsAmt);
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
	var companyupdatea = function (cb) {
		$scope.netWork(function (status) {
			if (status) {
				request.service('companyUpdates', 'post', $scope.currUser, function (res) {

					if (res.statusCode == 200) {
						applyCompanyUpdates(res)
						if ($scope.ifMobile) {
							$scope.getOfflineDataFromLocal('dashboard', function (data) {
								if (!data) data = {}
								data.companyUpdates = res
								$scope.addOfflineDataInLocal('dashboard', data, function () {
									if (cb) cb();
								});
							});
						} else {
							if (cb) cb();
						}
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
						if (data && data.companyUpdates) applyCompanyUpdates(data.companyUpdates);
						if (cb) cb();
					})
				});
			}
		});
	}





	function applyCompanyUpdates(res) {
		$scope.companyupdates = [];

		for (k = 0; k < res.companyUpdatesList.length; k++) {
			if (res.companyUpdatesList[k].endDate && res.companyUpdatesList[k].startDate) {
				var rightnow = new Date().setHours(00, 00, 00, 00);
				var startdate = new Date(res.companyUpdatesList[k].startDate).setHours(00, 00, 00, 00);
				var enddate = new Date(res.companyUpdatesList[k].endDate).setHours(00, 00, 00, 00);

				if (startdate <= rightnow && rightnow <= enddate) {

						//$scope.companyupdates.push(k)
					$scope.companyupdates.push(res.companyUpdatesList[k]);

					$timeout(function () {
						for (var i = 0; i < $scope.companyupdates.length; i++) {

							var e = document.getElementById('updateText' + i);
							if (e) {
								e.innerHTML = $scope.companyupdates[i].Desc;
							}

						}
					}, 0)

				}
			}
		}
	}


    // penna visit service calling ---------------

    var getOfficerVisits = function (cb) {
		$scope.netWork(function (status) {
			if (status) {
				request.service('getOfficerVisits', 'post', $scope.currUser, function (res) {

                     if (res.statusCode == '200') {

                               $scope.visits = res.visits;

    								} else if (res.dupLogin) {
    									$scope.logout();
    									$scope.notification(res.statusMessage);
    								}

				});
			}
		});
	}


	$scope.pendingpods = function (cb) {
		if (!ctrlComm.get('invoicesList')) {
			pods();
		} else {
			pods();
			$scope.invoicesList = ctrlComm.get('invoicesList');
			if (cb) cb()
		}
	}

	$scope.getsinglepod = function (inv) {
		$scope.invoices = inv;
		ctrlComm.put('invoice', $scope.invoices)
		$state.go('dashboard.pending-pod-detail');
	}

	if (ctrlComm.get('invoice') != undefined) {
		$scope.inv = ctrlComm.get('invoice');
	}

	$scope.selectAll = function (invList) {

		$scope.select = true;
		angular.forEach(invList, function (obj) {

			obj.status = true;
		});

		$scope.podlist_button = invList;
	};

	var params = {};
	var podList = [];
	$scope.multiplepodsconform = function (inv) {
		if (inv.status) {
			podList.push({
				invoiceNumber: inv.invoiceNumber,
			});
		} else {
			for (var i = 0; podList.length > i; i++) {
				if (inv.invoiceNumber == podList[i].invoiceNumber)
					podList.splice(i, 1);
			}
		}

		$scope.podlist_button = podList;

	}
	$scope.conformpod = function (invlist) {

		for (var j = 0; invlist.length > j; j++) {
			if (invlist[j].status) {
				podList.push({
					invoiceNumber: invlist[j].invoiceNumber,
				});
			} else {
				for (var i = 0; podList.length > i; i++) {
					if (invlist[i].invoiceNumber == podList[i].invoiceNumber)
					//podList.splice(i, 1);
						console.log("podList", podList)
				}
			}
		}
		if (podList.length) {
			$scope.netWork(function (status) {
				if (status) {
					var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
					params.podList = podList;
					params.userId = $scope.currUser.userId;
					params.accessToken = $scope.currUser.accessToken;

					params.version = $scope.currUser.version;
					params.device_id = $scope.currUser.device_id;
					params.device_type = $scope.currUser.device_type;

					if (deviceInfo !== undefined) {
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
					} else {

						if (localStorage.getItem('browserInfo') != undefined) {
							var local_browserInfo = localStorage.getItem('browserInfo');

						} else {
							var local_browserInfo = "blocked"
						}

						params.device_Model = "";
						params.device_Platform = "WEB";
						params.device_ID = "";
						params.device_Manufacturer = "";
						params.device_Serial = "";
						params.device_IPAddress = "";
						params.device_MacAddress = "";
						params.location = local_browserInfo;
						params.osVersion = "";
						params.apVersion = "";
					}

					$scope.loader(true);
					request.service('confirmPoD', 'post', params, function (res) {
						$scope.loader(false);
						if (res.statusCode == 200) {


							$scope.notification(res.statusMessage.updateStatus);

							podList = [];
							$scope.podlist_button = [];
							$scope.pendingpods();

						} else if (res.dupLogin || res.statusCode == 505) {
							$scope.logout();
							$scope.notification(res.statusMessage);
						} else {
							$scope.notification(res.statusMessage);
						}
					})
				} else {
					$scope.getOfflineDataFromLocal('dashboard', function (data) {
						if (!data) data = {}
						if (!data.confirmPod) data.confirmPod = {
							key: 'confirmPoD',
							type: 'post',
							input: []
						}
						for (var i in podList) {
							data.confirmPod.input.push(podList[i]);
							for (var j in data.invoicesList) {
								if (podList[i].invoiceNumber == data.invoicesList[j].invoiceNumber) {
									data.invoicesList.splice(j, 1);
									break;
								}
							}
						}
						data.noPods.noOfPendingPoDs = data.invoicesList.length;
						request.setItem('localDataSubmitted', 'false');
						$scope.addOfflineDataInLocal('dashboard', data, function () {
							podList = [];
							$scope.notification('Hey you are offline ! Your POD will be confirmed when you go online next!');
							$scope.pendingpods();
						});
					});
				}
			})
		}
	}



	$scope.conform = function () {
		$scope.netWork(function (status) {
			if (status) {
				var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
				var params = {};
				params.userId = $scope.currUser.userId;
				params.accessToken = $scope.currUser.accessToken;
				params.invoiceNumber = $scope.inv.invoiceNumber;

				params.version = $scope.currUser.version;
				params.device_id = $scope.currUser.device_id;
				params.device_type = $scope.currUser.device_type;


				if (deviceInfo !== undefined) {
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

				} else {

					if (localStorage.getItem('browserInfo') != undefined) {
						var local_browserInfo = localStorage.getItem('browserInfo');

					} else {
						var local_browserInfo = "blocked"
					}

					params.device_Model = "";
					params.device_Platform = "WEB";
					params.device_ID = "";
					params.device_Manufacturer = "";
					params.device_Serial = "";
					params.device_IPAddress = "";
					params.device_MacAddress = "";
					params.location = local_browserInfo;
					params.osVersion = "";
					params.apVersion = "";
				}
				$scope.loader(true);
				request.service('confirmPoD', 'post', params, function (res) {
					$scope.loader(false);
					if (res.statusCode == 200) {
						$scope.notification(res.statusMessage.updateStatus);
						$state.go('dashboard.pending-pod', {}, {
							reload: true
						});
					} else if (res.dupLogin || res.statusCode == 505) {
						$scope.logout();
						$scope.notification(res.statusMessage);
					}
				})
			} else {
				$scope.getOfflineDataFromLocal('dashboard', function (data) {
					if (!data) data = {}
					if (!data.confirmPod) data.confirmPod = {
						key: 'confirmPoD',
						type: 'post',
						input: []
					}
					data.confirmPod.input.push($scope.inv);
					for (var j in data.invoicesList) {
						if ($scope.inv.invoiceNumber == data.invoicesList[j].invoiceNumber) {
							data.invoicesList.splice(j, 1);
							break;
						}
					}
					data.noPods.noOfPendingPoDs = data.invoicesList.length;
					request.setItem('localDataSubmitted', 'false');
					$scope.addOfflineDataInLocal('dashboard', data, function () {
						$scope.notification('PoD Confirmation success');
						$state.go('dashboard.pending-pod', {}, {
							reload: true
						});
					});
				});
			}
		})
	}


	$scope.updateinvoicedetails = function (invs) {
		var input = {};
		$scope.askConfrimation(invs, function () {
			$scope.netWork(function (status) {



				input.userId = $scope.currUser.userId;
				input.accessToken = $scope.currUser.accessToken;
				input.invoiceNumber = invs.invoiceNumber;
				input.receivedBy = invs.receivedBy;
				input.remarks = invs.remarks;


				if (status) {
					$scope.loader(true);
					request.service('updateInvoiceDetails', 'post', input, function (res) {
						$scope.loader(false);

						if (res.statusCode == 200) {
							$scope.notification(res.statusMessage);
							$state.go('dashboard.pending-pod', null, {
								reload: true
							});
						} else if (res.dupLogin) {
							$scope.logout();
						}
					})
				} else {
					$scope.getOfflineDataFromLocal('dashboard', function (data) {
						$rootScope.safeApply(function () {
							if (!data) data = {}
							if (!data.updateInvoiceDetails)
								data.updateInvoiceDetails = {
									key: 'updateInvoiceDetails',
									type: 'post',
									input: []
								};
							if (data.updateInvoiceDetails.input.length > 0) {
								var notReplaced = true;
								for (var j in data.updateInvoiceDetails.input) {
									if (data.updateInvoiceDetails.input[j].invoiceNumber == input.invoiceNumber) {
										data.updateInvoiceDetails.input[j] = input;
										notReplaced = false;
									}
								}
								if (notReplaced)
									data.updateInvoiceDetails.input.push(input);
							} else {
								data.updateInvoiceDetails.input.push(input);
							}
							for (var i in data.invoicesList) {
								if (data.invoicesList[i].invoiceNumber == input.invoiceNumber) {
									data.invoicesList[i] = input;
								}
							}
							request.setItem('localDataSubmitted', 'false');
							$scope.addOfflineDataInLocal('dashboard', data, function () {
								$scope.notification('Invoice details updated successfully');
								$state.go('dashboard.pending-pod');
							});
						});
					});
				}
			})
		})
	}

	$scope.productlist = [{
		"id": 1,
		"name": "ppc"
    }, {
		"id": 2,
		"name": "OPC43"
    }, {
		"id": 3,
		"name": "PSC"
    }, {
		"id": 4,
		"name": "OPC53"
    }]


	var pods = function (cb) {
		$scope.netWork(function (status) {
			if (status) {
				request.service('getListOfPendingPoDs', 'post', $scope.currUser, function (res) {

					if (res.statusCode == 200) {

						res.noOfPendingPoDs = $scope.pods_no

						$scope.noPods = res;
						$scope.invoicesList = [];
						for (var o in res.pendingPoDList) {
							if (res.pendingPoDList[o].orderNumber) {
								var oNum = res.pendingPoDList[o].orderNumber;
								var oDate = res.pendingPoDList[o].orderedPlacedDate;
								var sapOrderLineNumber = res.pendingPoDList[o].sapOrderLineNumber;
								for (var i in res.pendingPoDList[o].invoicesList) {
									var obj = res.pendingPoDList[o].invoicesList[i];
									obj.orderNumber = oNum;
									obj.orderedPlacedDate = oDate;
									obj.sapOrderLineNumber = sapOrderLineNumber;
									$scope.invoicesList.push(obj)

									ctrlComm.put('invoicesList', $scope.invoicesList);
								}
							}
							if (o == res.pendingPoDList.length - 1) {
								if (cb) cb();
							}
						}
						if ($scope.ifMobile) {
							$scope.getOfflineDataFromLocal('dashboard', function (data) {
								if (!data) data = {}
								data.noPods = res
								data.invoicesList = $scope.invoicesList;
								$scope.addOfflineDataInLocal('dashboard', data);
							});
						}
					} else if (res.dupLogin) {
						$scope.logout();
						$scope.notification(res.statusMessage);
					} else {
						if (cb) cb();
					}

				});
			} else {
				$scope.getOfflineDataFromLocal('dashboard', function (data) {
					$rootScope.safeApply(function () {
						if (data && data.noPods) {
							$scope.noPods = data.noPods;
							$scope.invoicesList = data.invoicesList;
							ctrlComm.put('invoicesList', data.invoicesList);
							if (data.noPods.NoOfPoDs) {
								$scope.pendingpods(function () {
									if (cb) cb();
								});
							} else {
								if (cb) cb();
							}
						} else {
							if (cb) cb();
						}
					})
				});
			}
		})
	}

	request.service('getShippingConfig', 'post', $scope.currUser, function (res) {
		$scope.details = res.OrderConfig;

	});


	var orders = function (cb) {

		$scope.loader(true);
		request.service('getOrdersList', 'post', $scope.currUser, function (res) {

			$scope.loader(false);
			if (res) {
				$scope.listoforders = 0;
				if (res.Orders && res.Orders.length > 0) {
					$scope.listoforders = res.Orders[0].OrderList;
				}

				$timeout(function () {
					$('#smily').css("display", "none");
				}, 9000);

				/*$scope.results = [];
				for (var i = 0; i < res.ordersList.length; i++) {
				    $scope.results.push(res.ordersList[i]);
				}
				$scope.result1 = [];
				for (var i = 0; i < $scope.results.length; i++) {
				    $scope.result1 = $scope.results[i].poLines;
				}
				$scope.result2 = [];
				for (var i = 0; i < $scope.result1.length; i++) {
				    $scope.result2 = $scope.result1[i].subOrders;
				}*/
			} else if (res.dupLogin) {
				$scope.logout();
				$scope.notification(res.statusMessage);
			}

		});
		if (cb) cb()
	}

	$scope.detailsorder = function (orderlist) {
		ctrlComm.put('orderlist1', orderlist)
			//$rootScope.singleorder = orderlist;
		$state.go('orders.list-of-orders-detail');
	}

	if ($location.path() == '/dashboard/list-of-orders-detail-dash') {
		if (ctrlComm.get('orderlist1') != undefined) {
			//$scope.singleorder = $rootScope.singleorder;
			$scope.singleorder = ctrlComm.get('orderlist1');

			if ($scope.singleorder.POLine.length) {


				$scope.poline = $scope.singleorder.POLine;

				$scope.pline = [];

				for (p = 0; p < $scope.poline.length; p++) {

					$scope.pline.push($scope.poline[p])

				}


				ctrlComm.put('plines10', $scope.pline)


			}
		} else {
			$state.go('dashboard.order-statuses');
			$scope.loader(true);
			orders(function () {
				$scope.loader(false);
			})
		}
	}

	$scope.detailspo = function (plines, index) {

		ctrlComm.put('plines1', plines)
		$state.go('dashboard.orders-details');

		ctrlComm.put('index', index)
	}

	if ($location.path() == '/dashboard/order-details') {

		if (ctrlComm.get('plines1') != undefined) {
			$scope.plines1 = ctrlComm.get('plines1');

			$scope.scheduleLine = $scope.plines1.ScheduleLine


			var index11 = ctrlComm.get('index')

			$scope.pline_inco = ctrlComm.get('plines10')[index11].IncoTermMessage;

			$scope.scheduleLines = [];

			for (s = 0; s < $scope.scheduleLine.length; s++) {

				$scope.scheduleLines.push($scope.scheduleLine[s])

			}



		} else {
			$state.go('dashboard.order-statuses');
			$scope.loader(true);
			orders(function () {
				$scope.loader(false);
			})
		}


	}
	function getPortalFeedback(cb){
		$scope.netWork(function (status) {
			if (status) {
				request.service('getPortalFeedback', 'post', $scope.currUser, function (res) {
					if (res.statusCode == '200') {
						if(cb)cb(res)
					} else if (res.dupLogin) {
						$scope.logout();
						$scope.notification(res.statusMessage);
					}
				});
			}
		});
	}

	$scope.portal_app_feedback = function(){
		getPortalFeedback(function(response){
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'pages/dashboard/portal_app_feedback.html',
				controller: 'portal_app_feedback_controller',
				size: 'md',
				resolve: {
					data: function () {
						return {
							response: response,
							currUser: $scope.currUser,
							feedback: $scope.feedback,
							notification: $scope.notification
						};
					}
				}
			});

			modalInstance.result.then(function (res) {
				if(res && res.statusCode == "200"){
					$scope.notification(res.statusMessage);
					getFeedbackInfo();
				}
			}, function () {

			});
		})
	}


	$scope.gotoDashBoard = function () {

		$state.go('dashboard', {}, {
			reload: true
		});

	}


	if ($location.path() == '/dashboard' || $location.path() == '/') {
		$scope.loader(true);

		orders(function () {
			$scope.loader(false);
		})

		companyupdatea(function () {
			$scope.loader(false);
			$rootScope.safeApply(function () {
				$scope.user_name = request.getItem('user_name');

			})
		})

       getOfficerVisits(function () {
			$scope.loader(false);
		})




		getBirthdayAniversaries(function () {
			performance1(function () {
				getCreditDetails(function () {
					pods(function () {
						orders(function () {
							companyupdatea(function () {
							getOfficerVisits(function () {

							})
							})
						});

						$scope.loader(false);


					})
				})
			})
		})
	} else if ($location.path() == '/dashboard/company-updates') {
		$scope.loader(true);
		companyupdatea(function () {
			$scope.loader(false);
		});
	} else if ($location.path() == '/dashboard/credit-details') {
		$scope.loader(true);
		getCreditDetails(function () {
			$scope.loader(false);
		});
	} else if ($location.path() == '/dashboard/order-statuses') {
		$scope.loader(true);
		orders(function () {
			$scope.loader(false);
		});
	}



});
