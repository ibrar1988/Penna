angular.module('pennaApp').controller('listorderctrl', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $timeout, $location, $filter, mobile, $sce, $rootScope) {


	$scope.getCurrentPage = function (number) {
		//$scope.invoiceCurrpage = number;
		ctrlComm.put('invoiceCurrpage', number)

	}

	if (ctrlComm.get('invoiceCurrpage') == undefined) {

		$scope.invoiceCurrpage = 1;
	}
	$scope.itemsPerPage = 10;
	$scope.maxSize = 5;

	$scope.invoiceCurrpage1 = 1;
	$scope.itemsPerPage1 = 10;
	$scope.maxSize1 = 5;

	$scope.orderByField = function () {
		$scope.temp = [];
		for (i = 0, j = $scope.orderslist.length - 1; i < $scope.orderslist.length; i++, j--) {
			$scope.temp[j] = $scope.orderslist[i];
		}

		ctrlComm.put('orderlist113', $scope.temp)
		$scope.orderslist = $scope.temp;
	}


	$scope.orderByFieldsec = function () {
		$scope.temp1 = [];
		for (i = 0, j = $scope.orderslist_pre.length - 1; i < $scope.orderslist_pre.length; i++, j--) {
			$scope.temp1[j] = $scope.orderslist_pre[i];
		}

		ctrlComm.put('orderlist112', $scope.temp1)

		$scope.orderslist_pre = $scope.temp1;

	}


	request.service('getShippingConfig', 'post', $scope.currUser, function (res) {
		$scope.details = res.OrderConfig;

	});



	var listoforders = function (cb) {




		$scope.netWork(function (status) {

			if (status) {
				$scope.loader(true);
				request.service('getOrdersList', 'post', $scope.currUser, function (res) {
					$scope.loader(false);

					if (res.Orders) {
						applylistorder(res)
						if ($scope.ifMobile) {
							$scope.getOfflineDataFromLocal('accounts', function (data) {
								if (!data) data = {}
								data.listoforder = res
								$scope.addOfflineDataInLocal('accounts', data, function () {
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
			} else if ($scope.ifMobile) {
				$scope.getOfflineDataFromLocal('accounts', function (data) {
					$scope.loader(false);
					if (data) {

						$rootScope.safeApply(function () {
							if (data) {
									//applylistorder(data);
								applylistorder(data, function () {
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


	function applylistorder(res) {



		if (ctrlComm.get('orderlist113') == undefined) {
			if (res.listoforder) {
				$scope.orderslist = res.listoforder.Orders[0].OrderList;
				$scope.orderslist_pre = res.listoforder.Orders[1].OrderList;
			} else {
				$scope.orderslist = res.Orders[0].OrderList;
				$scope.orderslist_pre = res.Orders[1].OrderList;
			}
		} else {
			$scope.orderslist = ctrlComm.get('orderlist113');
			$scope.orderslist_pre = ctrlComm.get('orderlist112');
		}



		var name = res.Orders[1].key;
		var re = /\s*-\s*/;
		var nameList = name.split(re);
		var filetypes = nameList[0].split('(');
		var filetypess = filetypes[1].split(')');
		$scope.date1 = filetypess[0];

		var filetype = nameList[1].split('(');
		var filetyp = filetype[1].split(')');
		$scope.date2 = filetyp[0];






	}

	/*---------------------------------*/
	var orderBy = $filter('orderBy');

	$scope.order = function (predicate, reverse) {
		$scope.orderslist = orderBy($scope.orderslist, predicate, reverse);
	};

	/*---------------------------------*/
	/*---------------------------------*/




	$scope.detailsorder = function (orderlist) {
		ctrlComm.put('orderlist1', orderlist)
			//$rootScope.singleorder = orderlist;
		$state.go('orders.list-of-orders-detail');
	}



	if ($location.path() == '/orders/list-of-orders-detail') {

		if (ctrlComm.get('orderlist1') != undefined) {
			//$scope.singleorder = $rootScope.singleorder;

                   $scope.addscheduleline = function(sheduleqyl){



                        request.service('getTradeConfig', 'post', $scope.currUser, function (res) {

                           if (res.statusCode == '200') {
                              $scope.compConfig=res.companyTypes[0];
                              request.setObj('compConfig', $scope.compConfig)


                                 if(request.getObj('compConfig').CreateScheduleLine == "YES"){
                                      $rootScope.createschedule_line = true;

                                      var total_shedule =0;

                               var poline_qyl = sheduleqyl.POLine[0];

                            for (var x = 0; x < poline_qyl.ScheduleLine.length; x++) {

							total_shedule += Number(poline_qyl.ScheduleLine[x].Quantity)
						}



                        var shedule_qly =Number(sheduleqyl.totalqty);

                       if(total_shedule < shedule_qly && total_shedule != 0){
                             $scope.addscheduleline_model(sheduleqyl);
                          }else if(total_shedule < shedule_qly && total_shedule == 0){
                                    $scope.addscheduleline_model(sheduleqyl);
                          }else{
                          $scope.notification("You don’t have unscheduled quantity to create schedule lines for this order.");
                          }


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
            //shedule line model
               $scope.addscheduleline_model = function(polinedata){

                    $window.scrollTo(0, 0);
$scope.animationsEnabled = true;
        setTimeout(function(){
         var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'orderstat-modal.html',
			size: 'md',
            backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
                         currUser:$scope.currUser,
                         notification: $scope.notification,
                         logout: $scope.logout,
                         loader:$scope.loader,
                         polinedata:polinedata,
                         addschedulelines_data:$scope.addschedulelines_data,
						}
					}
				},

             controller: ['$scope', '$uibModalInstance', 'items', 'request','$filter', function ($scope, $uibModalInstance, items, request,$filter) {

                    $scope.dateOptionspayment = {
                          minDate: new Date()
                      };

                          $scope.notification = items.notification;
                          $scope.polinedata = items.polinedata;
                          $scope.polines =  $scope.polinedata.POLine[0];
                          $scope.currUser =  items.currUser;
                          $scope.logout =  items.logout;
                          $scope.loader =  items.loader;
                          $scope.addschedulelines_data =  items.addschedulelines_data;

                           $scope.total_shedule =0;


                            for (var x = 0; x < $scope.polines.ScheduleLine.length; x++) {

							$scope.total_shedule += Number($scope.polines.ScheduleLine[x].Quantity)
						}


                         $scope.save = function(scheduleline){



                             validatequestion(function () {

                                 if(Number($scope.polinedata.totalqty) < $scope.total_shedule + Number(scheduleline.quantity)){
                                      //$scope.notification("ScheduleLine Quantity exceeds Order Quantity");
                                     $scope.schedulequnty = true;
                                    }else{

                                        var data = {};
                                        var ScheduleLines = [];

            var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
			data.version = $scope.currUser.version;
			data.device_id = $scope.currUser.device_id;
			data.device_type = $scope.currUser.device_type;

			if (deviceInfo.device_Platform != "WEB") {
				data.device_Model = deviceInfo.device_Model;
				data.device_Platform = deviceInfo.platform;
				data.device_ID = deviceInfo.uuid;
				data.device_Manufacturer = deviceInfo.device_Manufacturer;
				data.device_Serial = deviceInfo.device_Serial;
				data.device_IPAddress = deviceInfo.device_IPAddress;
				data.device_MacAddress = deviceInfo.device_MacAddress;
				data.location = "";
				data.osVersion = deviceInfo.osVersion;
				data.apVersion = localStorage.getItem('device_version');
			} else {
				if (JSON.parse(localStorage.getItem('browserInfo')).lat_long) {
					var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;
				} else {
					var local_browserInfo = "blocked"
				}

				data.device_Model = "";
				data.device_ID = "";
				data.device_Manufacturer = "";
				data.device_Serial = "";
				data.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
				data.device_MacAddress = "";
				data.location = local_browserInfo;
				data.osVersion = "";
				data.apVersion = "";
			}


                                        data.userId = $scope.currUser.userId;
					                    data.accessToken = $scope.currUser.accessToken;
					                    data.login_id = $scope.currUser.login_id;
					                    data.poId = $scope.polinedata.PoId;
					                    data.poLIneId = $scope.polines.PoLineId;


                                        ScheduleLines.push($scope.scheduleline);
                                        data.ScheduleLines =ScheduleLines;


                                        $scope.loader(true);
                                        request.service('syncScheduleLines', 'post',
			data,
			function (res) {
            $scope.loader(false);

            if(res.statusCode == "200"){

                 $scope.notification(res.statusMessage);
                 $uibModalInstance.close('ok');
                $scope.addschedulelines_data(res.latestOrder[0]);
            }else if(res.statusCode == "406"){
                $scope.loader(false);
                $scope.notification(res.statusMessage, "danger");
                $scope.logout();
            }else{
                $scope.loader(false);
                $scope.notification(res.statusMessage, "danger");
            }


        })




                                    }
                             })


                         }

$scope.err={};
$scope.scheduleline={};

function validatequestion(cb) {
    console.log('data',$scope.scheduleline);


    if (!$scope.scheduleline.quantity || $scope.scheduleline.quantity <= 0) {
			$scope.err.quantity = true;
		} else {
			delete $scope.err.quantity;
		}

     if (!$scope.scheduleline.scheduledate) {
			$scope.err.scheduledate = true;
		} else {
			delete $scope.err.scheduledate;
		}

    if (Object.keys($scope.err).length == 0) {
				if (cb) cb();
			}

}

                    $scope.cancel = function(){
                      $uibModalInstance.dismiss('cancel');
                      }


                }]
		});

		modalInstance.result.then(function (selectedItem) {

		}, function (err) {});

     },0);
               }


               $scope.addschedulelines_data = function(data){
                   if(data != undefined){
                    $scope.singleorder = data;
                      }else{
			          $scope.singleorder = ctrlComm.get('orderlist1');
               }

			if ($scope.singleorder.POLine.length) {


				$scope.poline = $scope.singleorder.POLine;

				$scope.pline = [];

				for (p = 0; p < $scope.poline.length; p++) {

					$scope.pline.push($scope.poline[p]);



				}
				$rootScope.pline = $scope.pline;


			}



               }

              $scope.addschedulelines_data();

		} else {
			$state.go('orders.list-of-orders');
			$scope.loader(true);
			listoforders(function () {
				$scope.loader(false);
			})
		}
	}

	$scope.detailspo = function (plines, index) {
		ctrlComm.put('plines1', plines);
		ctrlComm.put('index', index)
		$state.go('orders.orders-details');
	}


	if ($location.path() == '/orders/orders-details') {

		if (ctrlComm.get('plines1') != undefined) {
			$scope.plines1 = ctrlComm.get('plines1');
			var index11 = ctrlComm.get('index')
			$scope.pline_inco = $scope.pline[index11].IncoTermMessage;
			$scope.scheduleLine = $scope.plines1.ScheduleLine

			$scope.scheduleLines = [];

			for (s = 0; s < $scope.scheduleLine.length; s++) {
				$scope.scheduleLines.push($scope.scheduleLine[s])

			}



		} else {
			$state.go('orders.list-of-orders');
			$scope.loader(true);
			listoforders(function () {
				$scope.loader(false);
			})
		}


	}


	$scope.detailsinvo = function (invo, index) {

		ctrlComm.put('invo1', invo);
		ctrlComm.put('index1', index);
		$state.go('orders.invoice');
	}

	$scope.invoicpdf = function (res) {
        console.log('res',res)

        var input ={};
			input.userId = $scope.currUser.userId;
			input.accessToken = $scope.currUser.accessToken;
			input.path = res.invoiceImage;
            input.odnNumber = res.odnNumber;

			$scope.loader(true);
			request.service('getInvoicePDFLive', 'post', input, function (res) {
				$scope.loader(false);
				if (res.statusCode == '200') {
                    console.log('res',res);
					var pdfURL = res.link;
                    console.log('pdfURL',pdfURL);
					if (!$scope.ifMobile) {
						ctrlComm.put('pdfurl', pdfURL);
		                $state.go('orders.pdf-invoices');
					}else{
						$scope.showInvoice(pdfURL);
					}
				} else if (res.dupLogin) {
					$scope.logout();
					$scope.notification(res.statusMessage);
				}
			});

	}


	if ($location.path() == '/orders/invoice') {
		if (ctrlComm.get('invo1') != undefined) {
			$scope.singleorder = ctrlComm.get('orderlist1');
			$scope.invo1 = ctrlComm.get('invo1').invoices;
			$scope.index1 = ctrlComm.get('index1');

            for(var i=0;i<$scope.invo1.length;i++){

                if($scope.invo1[i].materialCode.charAt($scope.invo1[i].materialCode.length - 1) == 'L' || $scope.invo1[i].materialCode.indexOf('BLK') !== -1){
                   $scope.invo1[i].shorttype = 'KGs';
                   }else{
                      $scope.invo1[i].shorttype = 'Bags';

                   }


            }


		} else {
			$state.go('orders.list-of-orders');
			$scope.loader(true);
			listoforders(function () {
				$scope.loader(false);
			})
		}
	}


	$scope.deleteschedule = function (scheduleLine) {

		var input = {};
		input.ScLineId = scheduleLine.ScLineId,
			input.ScheduleLineNumber = scheduleLine.ScheduleLineNumber;


	}




	if ($location.path() == '/orders/list-of-orders' || $location.path() == '/') {

		$scope.loader(true);
		listoforders(function () {
			$scope.loader(false);
		})


		if (ctrlComm.get('invoiceCurrpage') != undefined) {


			$scope.invoiceCurrpage = ctrlComm.get('invoiceCurrpage');



		}
	}


	$scope.showInvoice = function (res1) {

		$scope.pdfURL = $scope.prePath + res1;

		document.addEventListener("deviceready", onDeviceReady, false);

		function onDeviceReady() {
			var platform = device.platform;




			if (platform == 'Android') {


				var targetPath = "";
				window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, onFileSystemSuccess, fail);

				function onFileSystemSuccess(fileSystem) {

					var pdfrrr = $scope.pdfURL.split('/');
					var filename = pdfrrr[pdfrrr.length - 1];

					var targetPath = cordova.file.externalDataDirectory + filename;
					var fileTransfer = new FileTransfer();
					var uri = encodeURI($scope.pdfURL);
					var trustHosts = true;
					var options = new FileUploadOptions();
					options.chunkedMode = false;

					var permissions = cordova.plugins.permissions;
					fileTransfer.download(
						uri,
						targetPath,
						function (entry) {
							cordova.plugins.fileOpener2.open(decodeURI(entry.toURL()), 'application/pdf',
								function (success) {
									console.log("SUCCESSS :: " + JSON.stringify(success));
								},
								function (error) {
									console.log("ERROR ::::" + JSON.stringify(error));
								})
							permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);

							function checkPermissionCallback(status) {
								if (!status.hasPermission) {
									var errorCallback = function () {
										console.log('Storage permission is not turned on');
									}
									permissions.requestPermission(
										permissions.READ_EXTERNAL_STORAGE,
										function (status) {
											if (!status.hasPermission) {
												errorCallback();
											} else {
												//alert("opening");
												cordova.plugins.fileOpener2.open(decodeURI(entry.toURL()), 'application/pdf',
													function (success) {
														//alert("success");
														console.log("SUCCESSS :: " + JSON.stringify(success));
													},
													function (error) {
														//alert("error"+error);
														console.log("ERROR ::::" + JSON.stringify(error));
													})
											}
										}, errorCallback);

								}
							}
						},
						function (error) {
							console.log("download error source " + error.source);
							console.log("download error target " + error.target);
							console.log("download error code" + error.code);
						},
						trustHosts,
						options
					);
				}

				function fail(error) {
					console.log(error.code);
				}


			} else {


				var folderName = 'Penna';
				var fileName;
				$scope.pdfURL = $scope.pdfURL.replace(/\\/g, "/")
				downloadFile($scope.pdfURL);

				function downloadFile(URL) {
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

					function fileSystemSuccess(fileSystem) {
						var download_link = encodeURI(URL);
						fileName = download_link.substr(download_link.lastIndexOf('/') + 1);
						var filePath = fileSystem.root.toNativeURL() + folderName + "/" + fileName;
						fileSystem.root.getDirectory(folderName, {
								create: false
							},
							function (status) {
								console.log("FOLDER CHECKED ........................");
								fileSystem.root.getFile(folderName + "/" + fileName, {
									create: false
								}, function (found) {
									console.log("FILE OPEN DIRECTLY ........................" + JSON.stringify(found));
									//window.open(found.fullPath, '_system');
									openPDF(found.nativeURL);
									$scope.loader(false);
								}, function (error) {
									console.log("FILE NOT FOUND ::: " + JSON.stringify(error))
									downloadContinue(fileSystem)
								});
							},
							function (error) {
								console.log("FOLDER NOT FOUND ::: " + JSON.stringify(error))
								downloadContinue(fileSystem)
							});

						function downloadContinue(fileSystem) {
							fileSystem.root.getDirectory(folderName, {
								create: true,
								exclusive: false
							}, function () {
								console.log("FOLDER CREATED ........................")
								filetransfer(download_link, filePath);
							}, onDirectoryFail);
						}
					}

					function onDirectoryFail(error) {
						console.log("ERROR create new directory:  ::: " + JSON.stringify(error));
						alert("Unable to create new directory: " + error.code);
						$scope.loader(false);
					}

					function fileSystemFail(evt) {
						alert(evt.target.error.code);
						$scope.loader(false);
					}
				}

				function filetransfer(download_link, fp) {
					var download_link = download_link;
					var fp = fp;
					$scope.netWork(function (status) {
						console.log("CHECKING INTERNET CONNECTION ::: " + status)
						if (status) {
							var fileTransfer = new FileTransfer();
							fileTransfer.download(download_link, fp,
								function (entry) {
									console.log("FILE DOWN LOAD AND OPEN  ........................");
									// window.open(decodeURI(fp), '_system');
									openPDF(fp);
									// $scope.loader(false);
								},
								function (error) {
									console.log("ERROR ::: " + JSON.stringify(error));
									alert("download error source " + error.source);
									$scope.loader(false);
								},
								true, {
									headers: {
										"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
									}
								}
							);
						} else {
							$rootScope.safeApply(function () {
								$scope.notification("Please check your internet connection.", 4000, 'danger');
								$scope.loader(false);
							})
						}
					});
				}

				function openPDF(fp) {
					$scope.loader(false);
					cordova.plugins.fileOpener2.open(decodeURI(fp), 'application/pdf',
						function (success) {
							console.log("SUCCESSS :: " + JSON.stringify(success));
						},
						function (error) {
							console.log("ERROR ::::" + JSON.stringify(error));
						})
				}

			}
		}
	}


}).controller('orderinvoicepdfctrl', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $location, $timeout) {

	$timeout(function () {
		$window.scrollTo(0, 0);
	}, 100)

	if (ctrlComm.get('pdfurl') != undefined) {
		$scope.pdfURL = ctrlComm.get('pdfurl');
		//$scope.pdfURL = $scope.pdfURL.replace(/\\/g, "/");

		$scope.pdfURL = $scope.prePath + $scope.pdfURL;
	} else {
		$state.go('orders.list-of-orders');

	}

	$scope.showInvoice = function (res1) {

		$scope.pdfURL = $scope.prePath + res1;

		document.addEventListener("deviceready", onDeviceReady, false);

		function onDeviceReady() {
			var platform = device.platform;




			if (platform == 'Android') {

				var folderName = 'Penna';
				var fileName;
				var targetPath = "";
				window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, onFileSystemSuccess, fail);

				function onFileSystemSuccess(fileSystem) {

					var pdfrrr = $scope.pdfURL.split('/');
					var filename = pdfrrr[pdfrrr.length - 1];

					var targetPath = cordova.file.externalDataDirectory + filename;
					var fileTransfer = new FileTransfer();
					var uri = encodeURI($scope.pdfURL);
					var trustHosts = true;
					var options = new FileUploadOptions();
					options.chunkedMode = false;

					var permissions = cordova.plugins.permissions;
					fileTransfer.download(
						uri,
						targetPath,
						function (entry) {
							console.log("download complete: " + entry.toURL());
							cordova.plugins.fileOpener2.open(decodeURI(entry.toURL()), 'application/pdf',
								function (success) {
									console.log("SUCCESSS :: " + JSON.stringify(success));
								},
								function (error) {
									console.log("ERROR ::::" + JSON.stringify(error));
								})
							permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);

							function checkPermissionCallback(status) {
								if (!status.hasPermission) {
									var errorCallback = function () {
										console.log('Storage permission is not turned on');
									}
									permissions.requestPermission(
										permissions.READ_EXTERNAL_STORAGE,
										function (status) {
											if (!status.hasPermission) {
												errorCallback();
											} else {
												//alert("opening");
												cordova.plugins.fileOpener2.open(decodeURI(entry.toURL()), 'application/pdf',
													function (success) {
														//alert("success");
														console.log("SUCCESSS :: " + JSON.stringify(success));
													},
													function (error) {
														//alert("error"+error);
														console.log("ERROR ::::" + JSON.stringify(error));
													})
											}
										}, errorCallback);

								}
							}
						},
						function (error) {
							console.log("download error source " + error.source);
							console.log("download error target " + error.target);
							console.log("download error code" + error.code);
						},
						trustHosts,
						options
					);
				}

				function fail(error) {
					console.log(error.code);
				}


			} else {


				var folderName = 'Penna';
				var fileName;
				$scope.pdfURL = $scope.pdfURL.replace(/\\/g, "/")
				downloadFile($scope.pdfURL);

				function downloadFile(URL) {
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

					function fileSystemSuccess(fileSystem) {
						var download_link = encodeURI(URL);
						fileName = download_link.substr(download_link.lastIndexOf('/') + 1);
						var filePath = fileSystem.root.toNativeURL() + folderName + "/" + fileName;
						console.log("FILE PATH :: " + filePath)
						fileSystem.root.getDirectory(folderName, {
								create: false
							},
							function (status) {
								console.log("FOLDER CHECKED ........................");
								fileSystem.root.getFile(folderName + "/" + fileName, {
									create: false
								}, function (found) {
									console.log("FILE OPEN DIRECTLY ........................" + JSON.stringify(found));
									//window.open(found.fullPath, '_system');
									openPDF(found.nativeURL);
									$scope.loader(false);
								}, function (error) {
									console.log("FILE NOT FOUND ::: " + JSON.stringify(error))
									downloadContinue(fileSystem)
								});
							},
							function (error) {
								console.log("FOLDER NOT FOUND ::: " + JSON.stringify(error))
								downloadContinue(fileSystem)
							});

						function downloadContinue(fileSystem) {
							fileSystem.root.getDirectory(folderName, {
								create: true,
								exclusive: false
							}, function () {
								console.log("FOLDER CREATED ........................")
								filetransfer(download_link, filePath);
							}, onDirectoryFail);
						}
					}

					function onDirectoryFail(error) {
						console.log("ERROR create new directory:  ::: " + JSON.stringify(error));
						alert("Unable to create new directory: " + error.code);
						$scope.loader(false);
					}

					function fileSystemFail(evt) {
						alert(evt.target.error.code);
						$scope.loader(false);
					}
				}

				function filetransfer(download_link, fp) {
					var download_link = download_link;
					var fp = fp;
					$scope.netWork(function (status) {
						console.log("CHECKING INTERNET CONNECTION ::: " + status)
						if (status) {
							var fileTransfer = new FileTransfer();
							fileTransfer.download(download_link, fp,
								function (entry) {
									console.log("FILE DOWN LOAD AND OPEN  ........................");
									// window.open(decodeURI(fp), '_system');
									openPDF(fp);
									// $scope.loader(false);
								},
								function (error) {
									console.log("ERROR ::: " + JSON.stringify(error));
									alert("download error source " + error.source);
									$scope.loader(false);
								},
								true, {
									headers: {
										"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
									}
								}
							);
						} else {
							$rootScope.safeApply(function () {
								$scope.notification("Please check your internet connection.", 4000, 'danger');
								$scope.loader(false);
							})
						}
					});
				}

				function openPDF(fp) {
					$scope.loader(false);
					cordova.plugins.fileOpener2.open(decodeURI(fp), 'application/pdf',
						function (success) {
							console.log("SUCCESSS :: " + JSON.stringify(success));
						},
						function (error) {
							console.log("ERROR ::::" + JSON.stringify(error));
						})
				}

			}
		}
	}

});
