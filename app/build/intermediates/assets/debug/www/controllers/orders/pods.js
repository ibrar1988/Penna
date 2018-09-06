angular.module('pennaApp').controller('orderspodsctrl', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $timeout, $location, $filter, mobile, $sce, $rootScope) {

	//getConfirmedPODs

	$scope.podlist_button = [];

    if($rootScope.lastWindowState == 'orders' || $rootScope.lastWindowState == 'dashboard' || $rootScope.lastWindowState == 'profile' || $rootScope.lastWindowState == 'others' || $rootScope.lastWindowState == 'accounts'){
           ctrlComm.del('invoicesList_data')
       }

	$scope.getConfirmedPODs = function () {
		request.service('getConfirmedPODs', 'post', $scope.currUser, function (res) {
			if (res.statusCode == 200) {
				$scope.invoicesList_con1 = res.pendingPoDList
				$scope.invoicesList_con = [];
				for (var o in res.pendingPoDList) {
					if (res.pendingPoDList[o].orderNumber) {
						var oNum = res.pendingPoDList[o].orderNumber;
						var oDate = res.pendingPoDList[o].orderedPlacedDate;
						var sapOrderLineNumber = res.pendingPoDList[o].sapOrderLineNumber;
						var totalQuantity = res.pendingPoDList[o].totalQuantity;
						for (var i in res.pendingPoDList[o].invoicesList) {

							if (res.pendingPoDList[o].invoicesList[i].invoiceType != "S1" && res.pendingPoDList[o].invoicesList[i].cancelledInvNo == "") {
								var obj = res.pendingPoDList[o].invoicesList[i];
								obj.orderNumber = oNum;
								obj.orderedPlacedDate = oDate;
								obj.sapOrderLineNumber = sapOrderLineNumber;
								obj.totalQuantity = totalQuantity;
								obj.status_obj = "completed";
								$scope.invoicesList_con.push(obj)
									//ctrlComm.put('invoicesList', $scope.invoicesList);
							}
						}
					}
					if (o == res.pendingPoDList.length - 1) {
						//if (cb) cb();
					}
				}

			}
		});
	}

	$scope.getConfirmedPODs();

	var pods = function (cb) {
		$scope.netWork(function (status) {
			if (status) {
				request.service('getListOfPendingPoDs', 'post', $scope.currUser, function (res) {;
					$scope.loader(false);
					if (res.statusCode == 200) {
						$scope.noPods = res;
						$scope.invoicesList = [];
						for (var o in res.pendingPoDList) {
							if (res.pendingPoDList[o].orderNumber) {
								var oNum = res.pendingPoDList[o].orderNumber;
								var oDate = res.pendingPoDList[o].orderedPlacedDate;
								var sapOrderLineNumber = res.pendingPoDList[o].sapOrderLineNumber;
								var totalQuantity = res.pendingPoDList[o].totalQuantity;

								for (var i in res.pendingPoDList[o].invoicesList) {

									if (res.pendingPoDList[o].invoicesList[i].invoiceType != "S1") {
										if (res.pendingPoDList[o].invoicesList[i].cancelledInvNo == "") {
											var obj = res.pendingPoDList[o].invoicesList[i];

											obj.orderNumber = oNum;
											obj.orderedPlacedDate = oDate;
											obj.sapOrderLineNumber = sapOrderLineNumber;
											obj.totalQuantity = totalQuantity;
                                            obj.status_obj = "Pending";
											$scope.invoicesList.push(obj)
											ctrlComm.put('invoicesList', $scope.invoicesList);
										}
									}


								}
							}
							if (o == res.pendingPoDList.length - 1) {
								if (cb)
									cb();
							}
						}
						if ($scope.ifMobile) {
							$scope.getOfflineDataFromLocal('dashboard', function (data) {
								if (!data)
									data = {}
								data.noPods = res
								data.invoicesList = $scope.invoicesList;
								$scope.addOfflineDataInLocal('dashboard', data);
							});
						}
					} else if (res.dupLogin) {
						$scope.logout();
						$scope.notification(res.statusMessage);
					} else {
						if (cb)
							cb();
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
									if (cb)
										cb();
								});
							} else {
								if (cb)
									cb();
							}
						} else {
							if (cb)
								cb();
						}
					})
				});
			}
		})
	}




	$scope.pendingpods = function (cb) {
		if (!ctrlComm.get('invoicesList')) {
			pods();
		} else {
			pods();
			$scope.invoicesList = ctrlComm.get('invoicesList');
			if (cb)
				cb()
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

     $scope.invoicpdf = function(data){
            console.log('data',data);
          var input ={};
			input.userId = $scope.currUser.userId;
			input.accessToken = $scope.currUser.accessToken;
			input.path = data.image;
            input.odnNumber = data.ODNNumber;

			$scope.loader(true);
			request.service('getInvoicePDFLive', 'post', input, function (res) {
				$scope.loader(false);
				if (res.statusCode == '200') {
					var pdfURL = $scope.prePath + res.link;
					if (!$scope.ifMobile) {
						ctrlComm.put('pdfurl', pdfURL);
						$state.go('orders.pdfinvoices');
					}else{
						$scope.showInvoice(pdfURL);
					}
				} else if (res.dupLogin) {
					$scope.logout();
					$scope.notification(res.statusMessage);
				}
			});
        }


     $scope.showInvoice = function (data) {
    		document.addEventListener("deviceready", onDeviceReady, false);

    		function onDeviceReady() {
    			var platform = device.platform;

                   $scope.pdfURL = data;


    			if (platform == 'Android') {


    				var targetPath = "";
    				window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, onFileSystemSuccess, fail);

    				function onFileSystemSuccess(fileSystem) {
    					var folderName = 'Penna';
    					var fileName;
    					var pdfrrr = $scope.pdfURL.split('/');
    					var filename = pdfrrr[pdfrrr.length - 1];

    					var targetPath = cordova.file.externalDataDirectory + filename;
    					var fileTransfer = new FileTransfer();
    					var uri = encodeURI($scope.pdfURL);
    					var trustHosts = true;
    					var options = new FileUploadOptions();
    					options.chunkedMode = false;

    					var permissions = cordova.plugins.permissions;
    					console.log("filename2", permissions);
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





	var params = {};
	var podList = [];
	$scope.multiplepodsconform = function (inv,type) {
    if(type != 'edit_pod'){
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
    }else{
        for (var i = 0; inv.length > i; i++) {
            if (inv[i].status) {
			podList.push({
				invoiceNumber: inv[i].invoiceNumber,
			});
		}
        }

    }



		$scope.podlist_button = podList;
	}
	$scope.book = false;
	$scope.closeSelectAll = function () {
		$scope.book = true;
	}

	$scope.showSelectAll = function () {
		$scope.book = false;
	}

	$scope.selectAll = function (invList) {
		$scope.select = true;
		podList = [];
		angular.forEach(invList, function (obj) {
			if (podList.indexOf(obj.invoiceNumber) == -1) {
				obj.status = true;
				podList.push({
					invoiceNumber: obj.invoiceNumber,
				});
			}

		});


		$scope.podlist_button = podList;
	};

	$scope.conformpod = function (invlist) {
		for (var j = 0; invlist.length > j; j++) {
			if (invlist[j].status) {
				podList.push({
					invoiceNumber: invlist[j].invoiceNumber,
					shortages: invlist[j].shortages,
					comments: invlist[j].comments,
				});
			} else {
				for (var i = 0; podList.length > i; i++) {
                    if(invlist[i] != undefined){
					if (invlist[i].invoiceNumber == podList[i].invoiceNumber){
					//podList.splice(i, 1);
                    }
                    }
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
						params.apVersion = deviceInfo.apVersion;
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
					}

					$scope.loader(true);
					request.service('confirmPoD', 'post', params, function (res) {
						$scope.loader(false);
						if (res.statusCode == 200) {
							pods();
							$scope.getConfirmedPODs();
							/* $state.go('dashboard.pending-pod', {}, {
							 reload: true
							 });*/
							$scope.notification(res.statusMessage.updateStatus);
							$scope.podlist_button = [];
							podList = [];
							$scope.pendingpods();


							if (res.updateMandate == 'NO') {
								$scope.check_appUpdate();
							}

						} else if (res.dupLogin || res.statusCode == 505) {

							if (res.updateMandate == 'YES') {
								$scope.logout();
							} else {
								podList = [];
								$scope.check_appUpdate();
							}


							if (res.dupLogin) {
								$scope.notification(res.statusMessage);
								$scope.logout();
							}

						} else {
							$scope.notification(res.statusMessage);
						}
					})
				} else {
					$scope.getOfflineDataFromLocal('dashboard', function (data) {
						if (!data)
							data = {}
						if (!data.confirmPod)
							data.confirmPod = {
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
							$scope.notification('List of PoDs confirmed successfully');
							$scope.pendingpods();
							$scope.getConfirmedPODs
						});
					});
				}
			})
		}
	}

	$scope.getsinglepod = function (inv,invoicesList_data) {
		$scope.invoices = inv;
		ctrlComm.put('invoice', $scope.invoices)
		ctrlComm.put('invoicesList_data', invoicesList_data)
		$state.go('orders.pod-conform-details');
	}

	if (ctrlComm.get('invoice') != undefined) {
		$scope.inv = ctrlComm.get('invoice');
	} else {
		$state.go('orders.proof-of-delivery');
	}

	if ($location.path() == '/orders/proof-of-delivery') {
		$scope.loader(true);
        if(ctrlComm.get('invoicesList_data') == undefined){
		pods(function () {
			$scope.loader(false);
		});
    }else{
        $scope.loader(false);
        $scope.invoicesList = ctrlComm.get('invoicesList_data');
        $scope.multiplepodsconform($scope.invoicesList,'edit_pod')
    }
	}


    function readURL(e) {
	    if (this.files && this.files[0]) {
	        var reader = new FileReader();
	        $(reader).load(function (e) {
	            $('#previewImg').attr('src', e.target.result).css('display', 'block');
	        });
	        reader.readAsDataURL(this.files[0]);
	    } else {
	        $('#previewImg').css('display', 'none');
	    }
	};

    $scope.err ={};

	$scope.imageSelected = function () {
	    addpodInput
	    delete $scope.err.podImage;
	    var ele = document.getElementById('addpodInput');
	    var file = ele.files[0];
	    var reader = new FileReader();
	    reader.onload = function () {
	        $scope.inv.podImage = reader.result;

	    }
	    reader.readAsDataURL(file);
	    $rootScope.safeApply(function () {
	        $scope.notification("image uploaded successfully");
	    });
	}

	$scope.mobileUploadAttachment = function () {
	    document.getElementById('addpodInput').click();
	    mobile.chooseImage(function (img) {
	        $scope.inv.podImage = img;
	        $rootScope.safeApply(function () {
	            $scope.notification("image uploaded successfully");
	        });
	    });
	}


    $scope.updateinvoicedetail = function (invs) {

		var input = {};
		$scope.askConfrimation(invs, function () {
			$scope.netWork(function (status) {


				input.userId = $scope.currUser.userId;
				input.accessToken = $scope.currUser.accessToken;
				input.invoiceNumber = invs.invoiceNumber;
				input.receivedBy = invs.receivedBy;
				input.remarks = invs.remarks;





				 if (invs.damage == 'yes') {
				     input.damagedproduct = invs.damagedproduct;
				     input.damagedquantity = invs.damagedquantity;
				     input.typequantity = invs.damagedquantity_type;
				 } else {
				     input.damagedproduct = ' ';
				     input.damagedquantity = ' ';
				     input.typequantity = ' ';
				 }


				 input.podimg = $scope.inv.podImage;



				if (status) {
					$scope.loader(true);
					request.service('updateInvoiceDetails', 'post', input, function (res) {
						$scope.loader(false);
						if (res.statusCode == 200) {
							$scope.notification(res.statusMessage);
							$state.go('orders.proof-of-delivery', null, {
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
								$state.go('orders.proof-of-delivery');
							});
						});
					});
				}
			})
		})
	}


//    var pinNum = '';
//
//    $scope.shortage_val = function(val,index){
//
//        if (val) {
//
//			if (val.toString().length > 3) {
//					$scope.invoicesList[index].shortages = '';
//			} else {
//
//				$scope.invoicesList[index].shortages = val;
//			}
//		}
//    }

    var squnum = ''
    $scope.shortage_val = function (val, index,$event) {

		if (val == 0) {
			$event.preventDefault();
		}
		if (val) {
			if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 3) {
				if (val.toString().length) {
					$scope.invoicesList[index].shortages = squnum.split(val.toString()).join(" ");
				}
				else {
                   $event.preventDefault();
                  }
			} else {
                if(val.toString().length > 0){
				squnum = val;
                }else{
                    squnum ='';
                }
			}
		}else{
            squnum ='';
        }

	}



}).controller('orderspdfctrl', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $location, $timeout) {

    	$timeout(function () {
    		$window.scrollTo(0, 0);
    	}, 100)

    	if (ctrlComm.get('pdfurl') != undefined) {
            $scope.loader(true);
    		$scope.pdfURL = ctrlComm.get('pdfurl');
            console.log('$scope.pdfURL ',$scope.pdfURL );
    		$scope.pdfURL = $scope.pdfURL.replace(/\\/g, "/");
            $scope.loader(false);
    	} else {
    		$location.path('/orders/pod-conform-details');
    	}

    });
