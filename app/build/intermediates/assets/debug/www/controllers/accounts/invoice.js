    pennaApp.controller('invoicectrl', function ($scope, $rootScope, $uibModal, $log, $state, $window, ctrlComm, request, $location, $timeout, $filter) {

    	$scope.button_execute = true;

    	$scope.invoicesList_long = [];

    	if (ctrlComm.get('type_invoice') == 'short') {
    		$scope.layout = 'short';
    		ctrlComm.del('invoicesList_long');

    	} else if (ctrlComm.get('type_invoice') == 'long') {
    		$scope.layout = 'long';

    		if (ctrlComm.get("invoicesList_long") != undefined) {
    			$scope.invoicesList_long = ctrlComm.get("invoicesList_long");
    		} else {
    			ctrlComm.del('invoicesList_long')
    		}


    	} else {
    		$scope.layout = 'short';
    		ctrlComm.del('invoicesList_long');
    	}


    	$scope.validate = function (type_invoice) {
    		ctrlComm.put('type_invoice', type_invoice);
    	}

    	$scope.open1 = function () {
    		$scope.popup1.opened = true;
    	};
    	$scope.popup1 = {
    		opened: false
    	};
    	$scope.open2 = function () {
    		$scope.popup2.opened = true;
    	};
    	$scope.popup2 = {
    		opened: false
    	};
    	$scope.open3 = function () {
    		$scope.popup3.opened = true;
    	};
    	$scope.popup3 = {
    		opened: false
    	};

    	$scope.changedate_90 = function (data) {

    		var date1 = new Date(data.date1);
    		var date2 = new Date(data.date2);
    		var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24));

    		if (diffDays > 90) {
    			$scope.notification("Date Range should not exceed 90 days..", 10000, 'danger');
    			$scope.button_execute = false;
    		} else {
    			$scope.button_execute = true;
    		}

    	}




    	//var dateold = new Date(new Date().setDate(new Date().getDate() - 30));
    	var date = new Date();
    	$scope.date1 = date.setDate((new Date()).getDate() - 90);

    	var date45 = new Date();
    	$scope.date2 = date45.setDate((new Date()).getDate());


    	if (ctrlComm.get("dates_long") == undefined) {
    		$scope.com = {
                invId:'',
    			date1: $scope.date1,
    			date2: $scope.date2
    		}
    	} else {

    		var myDate1 = ctrlComm.get("dates_long").From;
    		myDate1 = myDate1.split("-");
    		var newDate1 = myDate1[0] + "/" + myDate1[1] + "/" + myDate1[2];
    		var alert1_date = new Date(newDate1).getTime();


    		var myDate2 = ctrlComm.get("dates_long").To;
    		myDate2 = myDate2.split("-");
    		var newDate2 = myDate2[0] + "/" + myDate2[1] + "/" + myDate2[2];
    		var alert2_date = new Date(newDate2).getTime();



    		$scope.com = {
                 invId:ctrlComm.get("dates_long").invId,
    			date1: $scope.date1,
    			date2: $scope.date2
    		}

    	}



    	$scope.dateOptions_11 = {
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



    	$scope.err = {};
    	$scope.generate = function (dates1) {
$scope.invoicesList_long=[];

    		var date1 = dates1.date1;
    		var date2 = dates1.date2;
    		$scope.netWork(function (status) {
    			if (status) {

    				validateDate(function () {

    					if (!date1) {
    						$scope.err.date1 = true;
    					} else {
    						delete $scope.err.date1;
    					}
    					if (!date2) {
    						$scope.err.date2 = true;
    					} else {
    						delete $scope.err.date2;
    					}
    					/*if (Object.keys($scope.err).length == 0) {
    					if (cb) cb();
    					}*/
    					if (date1 && date2) {


    						if (date1 <= date2) {

    							var date11 = $filter('date')(new Date(date1), "MM-dd-yyyy");
    							var date22 = $filter('date')(new Date(date2), "MM-dd-yyyy");
    							date11_ts = new Date(date11).getTime();
    							date22_ts = new Date(date22).getTime();
    							var input = {};

    							input.userId = $scope.currUser.userId;
    							input.accessToken = $scope.currUser.accessToken;

                                input.From = date11;
    							input.To = date22;
    							input.invId = dates1.invId;

                                if(dates1.invId == ""){
                                       input.From = date11;
    							input.To = date22;
    							input.invId = '';
                                   }else{
                                input.From = '';
    							input.To = '';
    							input.invId = dates1.invId;
                                   }

    							ctrlComm.put("dates_long", input);
    							$scope.loader(true);
    							request.service('getLongInvoicesInAccounts', 'post', input, function (res) {
    								$scope.checkCurrPage = 1;
    								$scope.invoiceCurrpage = 1;
    								$scope.maxSize = 5;
    								$scope.loader(false);
    								if (res.statusCode == '200') {


    									if (res.pendingPoDList) {
    										for (var o in res.pendingPoDList) {

    											var ino_list = res.pendingPoDList[o].invoicesList
    											for (var y in ino_list) {
    												if (ino_list[y].invoiceType != "S1") {
                                                        ino_list[y].status_obj = "completed";
    													$scope.invoicesList_long.push(ino_list[y]);
    													ctrlComm.put("invoicesList_long", $scope.invoicesList_long);
    												}

    											}

    										}
    									} else {
    										$scope.invoicesList_long = [];
    									}

    								} else if (res.dupLogin) {
    									$scope.logout();
    									$scope.notification(res.statusMessage);
    								}
    							});
    						} else {

    							$scope.notification("From Date should be greater than To Date");
    						}

    					}
    				});

    			} else {
    				$scope.notification("Hey you are in offline mode. Please connect to network to see this.", 4000, 'info');
    			}
    		});
    	}



    	function validateDate(cb) {
    		if (!$scope.date1) {
    			$scope.err.date1 = true;
    		} else {
    			delete $scope.err.date1;
    		}
    		if (!$scope.date2) {
    			$scope.err.date2 = true;
    		} else {
    			delete $scope.err.date2;
    		}
    		if (Object.keys($scope.err).length == 0) {
    			if (cb) cb();
    		}
    	}



        var ppn = '';
	 $scope.$watch('com.invId', function (val) {
	     if (val == 0) {
	         $scope.com.invId = '';
	     }
	     if (val) {
	         if (val.toString().length > 12) {
	             if (val.toString().length != 1) {
	                 $scope.com.invId = ppn;
	             } else {
	                 $scope.com.invId = '';
	             }
	         } else {
	             ppn = val;
	         }
	     }
	 });




    	$scope.invoicesList = [];
    	$scope.invoicesLists = [];
    	var partyConfTemps = [];
    	var invicelist = function () {
    		$scope.netWork(function (status) {
    			if (status) {
    				$scope.loader(true);
    				request.service('getInvoicesInAccounts', 'post', $scope.currUser, function (res) {
                        $scope.loader(false);
    					if (res.statusCode == 200) {
    						applyInvoiceList(res, function () {
    							if ($scope.ifMobile) {
    								$scope.getOfflineDataFromLocal('accounts', function (data) {
    									if (!data) data = {}
    									data.invicelist = res;
    									$scope.addOfflineDataInLocal('accounts', data, function () {
    										$scope.loader(false);
    									})
    								})
    							} else {
    								$scope.loader(false);
    							}
    						})
    					} else if (res.dupLogin) {
    						$scope.logout();
    						$scope.notification(res.statusMessage);
    					}
    				});
    			} else {
    				featchInvicelistFromLocal();
    			}
    		});
    	}

    	function featchInvicelistFromLocal() {
    		$scope.getOfflineDataFromLocal('accounts', function (data) {
    			$rootScope.safeApply(function () {
    				if (data) {
    					applyInvoiceList(data.invicelist, function () {
    						$scope.loader(false);
    					})
    				}
    			})
    		})
    	}

    	$scope.partyconfPage = 1;
    	$scope.itemsPerPage = 20;
    	$scope.maxSize = 5;

    	$scope.getCurrentPage = function () {
    		partyConfTemps.invoiceCurrpage = $scope.invoiceCurrpage;
    	}


    	$scope.singleinvo = function (data) {
    		var nopage = $scope.invoiceCurrpage;
    		ctrlComm.put("pageNO", nopage)
    		ctrlComm.put('invoice', data);
    		$state.go('accounts.invoices-details');
    	}


    	function applyInvoiceList(res, cb) {
    		for (var o in res.pendingPoDList) {


    			var ino_list = res.pendingPoDList[o].invoicesList

    			for (var y in ino_list) {
    				if (ino_list[y].invoiceType != "S1") {
                         ino_list[y].status_obj = "completed";
    					$scope.invoicesList.push(ino_list[y]);;
    				}

    			}


    			if (ctrlComm.get('pageNO') != undefined) {

    				$scope.invoiceCurrpage = ctrlComm.get('pageNO');

    				ctrlComm.del('pageNO');
    			}
    			partyConfTemps = {

    				invoices: $scope.invoicesList,
    				invoiceCurrpage: $scope.invoiceCurrpage
    			}

    			ctrlComm.put('partyconfirms', partyConfTemps)







    			/*if (res.pendingPoDList[o].orderNumber) {

    			    var sonum = res.pendingPoDList[o].sapOrderLineNumber;
    			    var oNum = res.pendingPoDList[o].orderNumber;
    			    var oDate = res.pendingPoDList[o].orderedPlacedDate;
    			    var polineAmount = res.pendingPoDList[o].polineAmount;
    			    var totalQuantity = res.pendingPoDList[o].totalQuantity;
    			    for (var i in res.pendingPoDList[o].invoicesList) {
    			        var obj = res.pendingPoDList[o].invoicesList[i];
    			        //$rootScope.safeApply(functin(){})
    			        obj.sapOrderLineNumber = angular.copy(sonum)

    			        obj.sapOrderLineNumber = sonum;

    			        obj.orderNumber = oNum;
    			        obj.orderedPlacedDate = oDate;
    			        obj.polineAmount = polineAmount;
    			        obj.totalQuantity = totalQuantity;
    			        $scope.invoicesList.push(obj)
    			        if (ctrlComm.get('pageNO') != undefined) {

    			            $scope.invoiceCurrpage = ctrlComm.get('pageNO');

    			            ctrlComm.del('pageNO');
    			        }
    			        partyConfTemps = {

    			            invoices: $scope.invoicesList,
    			            invoiceCurrpage: $scope.invoiceCurrpage
    			        }

    			        ctrlComm.put('partyconfirms', partyConfTemps)

    			    }
    			}*/
    		}
    		if (cb) cb();
    	}

    	$scope.nopdf = function () {
    		$scope.notification("There is no invoice PDF available");
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



    	if ($location.path() == '/accounts/invoices-details' && ctrlComm.get('invoice')) {

    		$scope.move_inovice = function () {

    			if (ctrlComm.get('type_invoice') == 'long') {
    				$location.path('/accounts/invoices');
    				$scope.layout = 'long';
    			} else {
    				$location.path('/accounts/invoices');
    				$scope.layout = 'short';
    			}
    		}

    		if (ctrlComm.get('invoice') != undefined) {
    			$scope.inv = ctrlComm.get('invoice');
    			$scope.invoice = partyConfTemps.invoices;
    			$scope.invoiceCurrpage = partyConfTemps.invoiceCurrpage;
    			$scope.pdfURL = $scope.inv.image;
    			// ctrlComm.del('invoice');
    		} else {
    			$location.path('/accounts/invoices');
    		}
    	} else {
    		$scope.invoiceCurrpage = 1;
    		if ($location.path() != '/accounts/invoices') {
    			$location.path('/accounts/invoices');
    		} else {
    			invicelist();
    		}
    	}


    	$scope.invoicpdf = function (res1) {
			var input ={};
			input.userId = $scope.currUser.userId;
			input.accessToken = $scope.currUser.accessToken;
			input.path = res1.image;
            input.odnNumber = res1.ODNNumber;

			$scope.loader(true);
			request.service('getInvoicePDFLive', 'post', input, function (res) {
				$scope.loader(false);
				if (res.statusCode == '200') {
					var pdfURL = $scope.prePath + res.link;
					if (!$scope.ifMobile) {
						ctrlComm.put('pdfurl', pdfURL);
						$state.go('accounts.pdfinvoices');
					}else{
						$scope.showInvoice(pdfURL);
					}
				} else if (res.dupLogin) {
					$scope.logout();
					$scope.notification(res.statusMessage);
				}
			});
    	}

        $scope.myTurvoLink_web = function (res1) {

                var input ={};
                                input.userId = $scope.currUser.userId;
    							input.accessToken = $scope.currUser.accessToken;
    							input.path = res1;

    							$scope.loader(true);
    							request.service('getInvoicePDFLive', 'post', input, function (res) {

    								$scope.loader(false);
    								if (res.statusCode == '200') {

                                         var pdfURL = $scope.prePath + res.link;

                                        if (!$scope.ifMobile) {
                                        ctrlComm.put('pdfurl', pdfURL);
    		                             $state.go('accounts.pdfinvoices');
                                        }else{
                                            $scope.turobo_pdffun(pdfURL);
                                        }


    								} else if (res.dupLogin) {
    									$scope.logout();
    									$scope.notification(res.statusMessage);
    								}
    							});



    	}

        $scope.turobo_pdffun = function (showpdf) {
		$scope.pdfURL = showpdf;
		$scope.pdfURL = $scope.pdfURL.replace(/\\/g, "/");

		document.addEventListener("deviceready", onDeviceReady, false);

		function onDeviceReady() {
			var platform = device.platform;




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
					fileTransfer.download(
						uri,
						targetPath,
						function (entry) {
							console.log("download complete: " + entry.toURL());
                            try{
							cordova.plugins.fileOpener2.open(decodeURI(entry.toURL()), 'application/pdf',
								function (success) {
									console.log("SUCCESSS :: " + JSON.stringify(success));
								},
								function (error) {
									console.log("ERROR ::::" + JSON.stringify(error));
								})
                            }catch(err){
                                console.log("file open error",err.toString());
                            }
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

								}else{
                                    try{
                                    cordova.plugins.fileOpener2.open(decodeURI(entry.toURL()), 'application/pdf',
                                    function (success) {
                                        console.log("SUCCESSS :: " + JSON.stringify(success));
                                    },
                                    function (error) {
                                        console.log("ERROR ::::" + JSON.stringify(error));
                                    })
                                    }catch(err){
                                        console.log("file open error",err.toString());
                                    }
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


    	if ($location.path() == '/accounts') {
    		ctrlComm.del('invoice');
    	}


    	$timeout(function () {
    		$window.scrollTo(0, 0);
    	}, 100)

        //myTurvoLink_web

    }).controller('invoicepdfctrl', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $location, $timeout) {

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
    		$location.path('/accounts/invoices');
    	}

    });
