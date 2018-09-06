var pennaApp = angular.module('pennaApp');
pennaApp.controller('PartyConfirmationtax', function ($scope, $rootScope, $uibModal, $log, $state, $window, ctrlComm, request, $filter, $sce, $location, $http, $interval, $timeout, mobile) {
	$scope.button_execute = true;

	$scope.layout = 'short';

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




    $scope.getExcel = function (pdfOrExcel,date1,date2) {


        if((date1 != '' && date2 != '')){

            $scope.excelUrl='';

         var urls='';
        var param='?userId='+$scope.currUser.userId+'&companyId='+$scope.currUser.companyId+'&accessToken='+$scope.currUser.accessToken;
            if(pdfOrExcel=='excel'){

                 urls = $scope.prePath + '/penna/payment/getTaxFileAsExcel';
            }else
            if(pdfOrExcel=='pdf'){

                 urls = $scope.prePath + '/penna/payment/getTaxFileAsPdf';
            }


            if($scope.layout=='short'){
                urls=urls+param+'&dateType=short';
                $scope.excelUrl=urls;


            }else{
              validateDate(function () {

                        if (date1 <= date2) {
                        var date11 = $filter('date')(new Date(date1), "dd-MM-yyyy");
						var date22 = $filter('date')(new Date(date2), "dd-MM-yyyy");
						date11_ts = new Date(date11).getTime();
						date22_ts = new Date(date22).getTime();
						var input = {};
						input.From = date11;
						input.To = date22;
						input.userId = $scope.currUser.userId;
						input.accessToken = $scope.currUser.accessToken;
                        param=param+'&From='+date11+'&To='+date22;
                        urls=urls+param+'&dateType=long';
                        $scope.excelUrl=urls;
					} else {
						$scope.notification("From Date should be greater than To Date");
					}
            });

     }


    }else{
         $scope.excelUrl='';
        if($scope.layout=='short'){
       var param='?userId='+$scope.currUser.userId+'&companyId='+$scope.currUser.companyId+'&accessToken='+$scope.currUser.accessToken;
         if(pdfOrExcel=='excel'){

                 urls = $scope.prePath + '/penna/payment/getTaxFileAsExcel';
            }else
            if(pdfOrExcel=='pdf'){

                 urls = $scope.prePath + '/penna/payment/getTaxFileAsPdf';
            }

                urls=urls+param+'&dateType=short';
                $scope.excelUrl=urls;
            }else{
              validateDate(function () {
             $scope.notification("From Date should be greater than To Date");
             })
            }
    }




}

    $scope.getExcel1 = function (pdfOrExcel,date1,date2,typefile) {
        var input={};
       input.userId = $scope.currUser.userId;
       input.accessToken = $scope.currUser.accessToken;
       input.compid = $scope.currUser.companyId;
       input.typefile =typefile;

         if($scope.layout=='short'){
             input.dateType = 'short';
             $scope.excute123(input);
         }else{
             input.dateType ='long';
             if (date1 <= date2) {
                var date11 = $filter('date')(new Date(date1), "dd-MM-yyyy");
                var date22 = $filter('date')(new Date(date2), "dd-MM-yyyy");
				date11_ts = new Date(date11).getTime();
				date22_ts = new Date(date22).getTime();
				input.From = date11;
				input.To = date22;

                  validateDate(function () {
                   $scope.excute123(input);
                  })

				} else {
				$scope.notification("From Date should be greater than To Date");
				}
         }



    }

    $scope.excute123 = function(data){
         $scope.loader(true);
           if(data.typefile == 'pdf'){
				request.service('getTaxPdfFileUrl', 'post', data, function (res) {
					$scope.loader(false);
                    if(res.statusCode == "200"){
                        ctrlComm.put('file_system', res);
                       // $state.go('accounts.statements.party-confirmationfileshow');
                         $scope.pdfURL = $scope.prePath + ctrlComm.get('file_system').PdfUrl;
                         $scope.excute1234($scope.pdfURL);
                    }else{
                        $scope.notification(res.statusMessage);
                    }

                });
              }else{

                  request.service('getTaxExcelFileUrl', 'post', data, function (res) {
					$scope.loader(false);
                    if(res.statusCode == "200"){
                        ctrlComm.put('file_system', res);
                         //$state.go('accounts.statements.party-confirmationfileshow');
                        $scope.pdfURL = $scope.prePath + ctrlComm.get('file_system').ExcelUrl;

                        $scope.excute1234($scope.pdfURL);

                    }else{
                        $scope.notification(res.statusMessage);
                    }

                });

               }


 $scope.excute1234 = function(data){
        document.addEventListener("deviceready", onDeviceReady, false);
     $scope.pdfURL = data;
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
    							cordova.plugins.fileOpener2.open(decodeURI(entry.toURL()), 'application/*',
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
    												cordova.plugins.fileOpener2.open(decodeURI(entry.toURL()), 'application/*',
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
    					cordova.plugins.fileOpener2.open(decodeURI(fp), 'application/*',
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




    }


	$scope.validate = function (res3) {
		ctrlComm.put('res2', res3)
		if ($location.path() == '/accounts/statements/party-confirmationtaxable') {
			if (ctrlComm.get('res2') == 'short') {
				ctrlComm.del('partyconfirm');
				$scope.payment_long = undefined;
				$scope.date1 = '';
				$scope.date2 = '';
                 $scope.excelUrl='';
                $scope.err.date1 = ''
                $scope.err.date2 = ''
                if($scope.date1 == '' && $scope.date2 == ''){
                     if ($("#pdf1").length) {
                       $("#pdf1").removeAttr("href").css("cursor","pointer")
                                            }
                   }
			}
		}
	}


	$scope.changedate_90 = function (date11, date22) {

		var date1 = new Date(date11);
		var date2 = new Date(date22);
		var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24));

		if (diffDays > 90) {
			$scope.notification("Date Range should not exceed 90 days..", 10000, 'danger');
			$scope.button_execute = false;
		} else {
			$scope.button_execute = true;
		}

	}






	$timeout(function () {
		$scope.partyconfPageinv = 1;
		$scope.partyconfPageshort = 1;

		$window.scrollTo(0, 0);
		if (ctrlComm.get('model') != undefined) {
			$scope.partyconfPageinv = ctrlComm.get('model');
		}
	}, 100)

	//print ---------------------

	$scope.openmodelshort = function (res) {
		var shortPrint = '<h2 style="text-align:center">Taxable Discount Details</h2>';
		var invoice = "";
		var payment = "";
		var taxable = "";

         if ($scope.payment_short.length > 0) {
			taxable =
				'<table style="width: 100%;max-width: 100%;">' +
				'<thead style="display: table-header-group; vertical-align: middle; border-color: inherit;">' +
				'<tr>' +
				'<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Financial Document No</th>' +
				'<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Sales Invoice No</th>' +
				'<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Invoice Date</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Invoice Qty</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Invoice Value</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Taxable Credit Note No</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Taxable Credit Note Date</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Taxable Value</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >CGST</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >SGST</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >IGST</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Gross Discounts</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Business Place</th>' +
				'</tr>' +
				'</thead>' +
				'<tbody style="display: table-row-group; vertical-align: middle; border-color: inherit;">';
			for (var i in $scope.payment_short) {

                if (!$scope.payment_short[i].amount_check11) {
                     $scope.payment_short[i].amount_check11 = '666';

                if ($scope.payment_short[i].amount == 0) {
					$scope.payment_short[i].amount = 0;
				} else {
					$scope.payment_short[i].amount = $scope.payment_short[i].amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				}

                if ($scope.payment_short[i].taxableValue == 0) {
					$scope.payment_short[i].taxableValue = 0;
				} else {
					$scope.payment_short[i].taxableValue = $scope.payment_short[i].taxableValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				}

                    if ($scope.payment_short[i].ggst == 0) {
					$scope.payment_short[i].ggst = 0;
				} else {
					$scope.payment_short[i].ggst = $scope.payment_short[i].ggst.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				}

                    if ($scope.payment_short[i].sgst == 0) {
					$scope.payment_short[i].sgst = 0;
				} else {
					$scope.payment_short[i].sgst = $scope.payment_short[i].sgst.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				}

                    if ($scope.payment_short[i].igst == 0) {
					$scope.payment_short[i].igst = 0;
				} else {
					$scope.payment_short[i].igst = $scope.payment_short[i].igst.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				}

                      if ($scope.payment_short[i].grossDiscount == 0) {
					$scope.payment_short[i].grossDiscount = 0;
				} else {
					$scope.payment_short[i].grossDiscount = $scope.payment_short[i].grossDiscount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				}

				}

				taxable = taxable +
					"<tr>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_short[i].invoiceNo + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_short[i].chkPmtDscr + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>"  + $filter('date')($scope.payment_short[i].invoiceDate, "dd/MM/yyyy") + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_short[i].invoiceQty + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_short[i].amount + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_short[i].chkReceiptNo + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $filter('date')($scope.payment_short[i].chkReceiptDate, "dd/MM/yyyy") + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_short[i].taxableValue + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_short[i].ggst + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_short[i].sgst + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_short[i].igst + "</td>" +
                      "<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_short[i].grossDiscount + "</td>" +
                    "<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_short[i].bisunessPlace + "</td>" +
					"</tr>";
			}
			taxable = taxable + "</tbody></table></br></br>"
		}


       	shortPrint = shortPrint + taxable;

		if ($scope.ifMobile) {
			mobile.print(shortPrint)
		} else {
			request.print(shortPrint)
		}
	}


	$scope.openmodellong = function () {

		var longPrint = '<h2 style="text-align:center">Taxable Discount Details</h2>';
		var invoice = "";
		var payment = "";
        var taxable = "";


         if ($scope.payment_long.length > 0) {
			taxable =
				'<table style="width: 100%;max-width: 100%;">' +
				'<thead style="display: table-header-group; vertical-align: middle; border-color: inherit;">' +
				'<tr>' +
				'<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Financial Document No</th>' +
				'<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Sales Invoice No</th>' +
				'<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Invoice Date</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Invoice Qty</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Invoice Value</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Taxable Credit Note No</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Taxable Credit Note Date</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Taxable Value</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >CGST</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >SGST</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >IGST</th>' +
                 '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Gross Discounts</th>' +
                '<th style="text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;" >Business Place</th>' +

				'</tr>' +
				'</thead>' +
				'<tbody style="display: table-row-group; vertical-align: middle; border-color: inherit;">';

			for (var i in $scope.payment_long) {

                 if (!$scope.payment_long[i].amount_check11) {
                     $scope.payment_long[i].amount_check11 = '666';

                if ($scope.payment_long[i].amount == 0) {
					$scope.payment_long[i].amount = 0;
				} else {
					$scope.payment_long[i].amount = $scope.payment_long[i].amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				}

                if ($scope.payment_long[i].taxableValue == 0) {
					$scope.payment_long[i].taxableValue = 0;
				} else {
					$scope.payment_long[i].taxableValue = $scope.payment_long[i].taxableValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				}

                    if ($scope.payment_long[i].ggst == 0) {
					$scope.payment_long[i].ggst = 0;
				} else {
					$scope.payment_long[i].ggst = $scope.payment_long[i].ggst.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				}

                    if ($scope.payment_long[i].sgst == 0) {
					$scope.payment_long[i].sgst = 0;
				} else {
					$scope.payment_long[i].sgst = $scope.payment_long[i].sgst.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				}

                    if ($scope.payment_long[i].igst == 0) {
					$scope.payment_long[i].igst = 0;
				} else {
					$scope.payment_long[i].igst = $scope.payment_long[i].igst.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				}

                      if ($scope.payment_long[i].grossDiscount == 0) {
					$scope.payment_long[i].grossDiscount = 0;
				} else {
					$scope.payment_long[i].grossDiscount = $scope.payment_long[i].grossDiscount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
				}

				}

				taxable = taxable +
					"<tr>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_long[i].invoiceNo + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_long[i].chkPmtDscr + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>"  + $filter('date')($scope.payment_long[i].invoiceDate, "dd/MM/yyyy") + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_long[i].invoiceQty + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_long[i].amount   + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_long[i].chkReceiptNo + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $filter('date')($scope.payment_long[i].chkReceiptDate, "dd/MM/yyyy") + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_long[i].taxableValue + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_long[i].ggst + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_long[i].sgst + "</td>" +
					"<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_long[i].igst + "</td>" +
                     "<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_long[i].grossDiscount + "</td>" +
                    "<td style='text-align:center;border: 1px solid #000;line-height: 1.42857143;vertical-align: top;margin:0px;'>" + $scope.payment_long[i].bisunessPlace + "</td>" +

					"</tr>";
			}
			taxable = taxable + "</tbody></table></br></br>"
		}

		longPrint = longPrint + taxable;


		if ($scope.ifMobile) {
			mobile.print(longPrint)
		} else {
			request.print(longPrint)
		}
	}


	$scope.getpartyconform = function () {
		$scope.netWork(function (status) {
			if (status) {
				$scope.loader(true);
				request.service('getTaxPartyConfirmation', 'post', $scope.currUser, function (res) {
					$scope.loader(false);
					if (res.statusCode == 200 && res.PartyConfirmations) {
						$scope.partyconf = res.PartyConfirmations;
						$scope.partyconfItems = $scope.partyconf.length;


						$scope.shortcheck = [];
						$scope.shortinvoice = [];
						$scope.payment_short = [];
						$scope.payment_short1 = [];

						if ($scope.partyconf) {
							for (i = 0; i < $scope.partyconf.length; i++) {
								if ($scope.partyconf[i].ind == 'B' || $scope.partyconf[i].ind == 'C') {

									if ($scope.partyconf[i].chkPmtType == 'CC') {
										$scope.partyconf[i].chkPmtType = "Cheque";
									} else if ($scope.partyconf[i].chkPmtType == 'DD') {
										$scope.partyconf[i].chkPmtType = "Demand";
									} else if ($scope.partyconf[i].chkPmtType == 'DT') {
										$scope.partyconf[i].chkPmtType = "RTGS";
									} else if ($scope.partyconf[i].ind == 'C') {
										$scope.partyconf[i].chkPmtType = "Return Cheque";
									}


									if ($scope.partyconf[i].chkReceiptNo != '') {
										$scope.partyconf[i].checknor = $scope.partyconf[i].chkReceiptNo;
									} else if ($scope.partyconf[i].retChkReceiptNo != "") {
										$scope.partyconf[i].checknor = $scope.partyconf[i].retChkReceiptNo;
									}

									$scope.shortcheck.push($scope.partyconf[i])
								} else if($scope.partyconf[i].ind == 'D') {
											$scope.payment_short.push($scope.partyconf[i])
											$scope.payment_short1.push($scope.partyconf[i])
										} else {
									$scope.shortinvoice.push($scope.partyconf[i])
								}
							}
						}


						if ($scope.ifMobile) {
							$scope.getOfflineDataFromLocal('accounts', function (data) {
								$rootScope.safeApply(function () {
									if (!data) var data = {}
									data.partyconfirm1 = {
										shortcheck: $scope.shortcheck,
										shortinvoice: $scope.shortinvoice,
										payment_short: $scope.payment_short
									}
									$scope.addOfflineDataInLocal('accounts', data);
								})
							})
						}
					} else if (res.dupLogin) {
						$scope.logout();
						$scope.notification(res.statusMessage);
					} else {
						$scope.shortcheck = [];
						$scope.shortinvoice = [];
						$scope.payment_short = [];
						$scope.payment_short1 = [];
						//$scope.notification(res.statusMessage);
					}
				});
			} else if ($scope.ifMobile) {
				$scope.getOfflineDataFromLocal('accounts', function (data) {
					$rootScope.safeApply(function () {
						if (data) {
							$scope.partyconf1 = data.partyconfirm1;
							$scope.shortcheck = $scope.partyconf1.shortcheck;
							$scope.shortinvoice = $scope.partyconf1.shortinvoice;
							$scope.payment_short = $scope.partyconf1.payment_short;
							$scope.payment_short1 = $scope.partyconf1.payment_short;
						} else {
							$scope.shortcheck = [];
							$scope.shortinvoice = [];
							$scope.payment_short = [];
							$scope.payment_short1 = [];
						}
					})
				})
			}
		})
	}

	$scope.storeModel = function (model) {
		ctrlComm.put('model', model);
	}

	/* if ($location.path() == '/accounts/statements/party-confirmation' && ctrlComm.get('model') != undefined) {
     if (ctrlComm.get('partyTab') == 'short') {
         $scope.partyconfPageinv = ctrlComm.get('model');

     }
 }*/


	$scope.singleparty = function (data, tab) {
		ctrlComm.put('partyTab', tab);
		if (tab == 'long') {
			ctrlComm.put('partyconfirm', partyConfTemp);
		}
		$scope.loader(true);
		ctrlComm.put('party', data);
		$scope.loader(false);
		if (data.ind == 'B' || data.ind == 'C') {
			$state.go('accounts.statements.party-confirmation.instrument-detail');
		} else {
			if ($scope.ifMobile) {
				$scope.singparty = ctrlComm.get('party');
				if (data.image) {
					$scope.loader(true);
					$scope.pdfURL = $scope.prePath + data.image;
					$scope.pdfURL = $scope.pdfURL.replace(/\\/g, "/")
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
								console.log("pdfrrr", pdfrrr[pdfrrr.length - 1]);
								var filename = pdfrrr[pdfrrr.length - 1];
								console.log("filename", filename);

								var targetPath = cordova.file.externalDataDirectory + filename;
								var fileTransfer = new FileTransfer();
								var uri = encodeURI($scope.pdfURL);
								console.log("filename2", $scope.pdfURL, uri);
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
				} else {
					$scope.notification('There is no invoice PDF available.');
				}
			} else {
				$state.go('accounts.statements.party-confirmation.accounts-invoice');
			}
		}
	}

	if (ctrlComm.get('party') != undefined) {
		$scope.singparty = ctrlComm.get('party');
		if ($scope.singparty.image) {
			$scope.pdfURL = $scope.prePath + $scope.singparty.image;
			$scope.pdfURL = $scope.pdfURL.replace(/\\/g, "/")
		}
	} else {
		$state.go('accounts.statements.party-confirmation-taxable');
	}



	//var dateold = new Date(new Date().setDate(new Date().getDate() - 30));
	var date = new Date();
	$scope.date1 = date.setDate((new Date()).getDate() - 90);

	var date45 = new Date();
	$scope.date2 = date45.setDate((new Date()).getDate());


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

	ctrlComm.put('dateOptions', $scope.dateOptions11);



	var partyConfTemp = {};
	$scope.err = {};
	$scope.generate = function (date1, date2) {

		$scope.netWork(function (status) {
			if (status) {

				validateDate(function () {
					if (date1 <= date2) {

						var date11 = $filter('date')(new Date(date1), "dd-MM-yyyy");
						var date22 = $filter('date')(new Date(date2), "dd-MM-yyyy");
						date11_ts = new Date(date11).getTime();
						date22_ts = new Date(date22).getTime();
						var input = {};
						input.From = date11;
						input.To = date22;
						input.userId = $scope.currUser.userId;
						input.accessToken = $scope.currUser.accessToken;
						$scope.loader(true);
						request.service('getTaxLongPartyConfirmation', 'post', input, function (res) {
							$scope.checkCurrPage = 1;
							$scope.invoiceCurrpage = 1;
							$scope.maxSize = 5;
							$scope.loader(false);
							if (res.statusCode == '200') {
								$scope.long_party = res.PartyConfirmations;
								$scope.check = [];
								$scope.invoice = [];
								$scope.payment_long = [];
								if ($scope.long_party) {
									for (i = 0; i < $scope.long_party.length; i++) {
										if ($scope.long_party[i].ind == 'B' || $scope.long_party[i].ind == 'C') {
											if ($scope.long_party[i].chkPmtType == 'CC') {
												$scope.long_party[i].chkPmtType = "Cheque";
											} else if ($scope.long_party[i].chkPmtType == 'DD') {
												$scope.long_party[i].chkPmtType = "Demand";
											} else if ($scope.long_party[i].chkPmtType == 'DT') {
												$scope.long_party[i].chkPmtType = "RTGS";
											} else {
												$scope.long_party[i].chkPmtType = "Return Cheque";
											}


											if ($scope.long_party[i].chkReceiptNo != '') {
												$scope.long_party[i].checknors = $scope.long_party[i].chkReceiptNo;


											} else if ($scope.partyconf[i].retChkReceiptNo != "") {
												$scope.long_party[i].checknors = $scope.long_party[i].retChkReceiptNo;
											}

											$scope.check.push($scope.long_party[i])
										} else if($scope.long_party[i].ind == 'D') {
											$scope.payment_long.push($scope.long_party[i])
										} else {
											$scope.invoice.push($scope.long_party[i])
										}
									}
									partyConfTemp = {
										date1: date1,
										date2: date2,
										check: $scope.check,
										invoices: $scope.invoice,
										checkCurrPage: $scope.checkCurrPage,
										invoiceCurrpage: $scope.invoiceCurrpage
									}

								}
							} else if (res.dupLogin) {
								$scope.logout();
								$scope.notification(res.statusMessage);
							}
						});
					} else {
						$scope.check = [];
						$scope.invoice = [];
                        $scope.payment_long=[];

						$scope.notification("From Date should be greater than To Date");
					}
				});

			} else {
				$scope.notification("Hey you are in offline mode. Please connect to network to see this.", 4000, 'info');
			}
		});
	}

	if ($location.path() == '/accounts/statements/party-confirmation-taxable' && ctrlComm.get('partyconfirm')) {
		if (ctrlComm.get('partyTab') == 'long') {
			$scope.layout = 'long'
			var partyConfTemp = ctrlComm.get('partyconfirm');
			if (partyConfTemp) {
				$scope.date1 = new Date(partyConfTemp.date1);
				$scope.date2 = new Date(partyConfTemp.date2);
				$scope.check = partyConfTemp.check;
				$scope.invoice = partyConfTemp.invoices;
				$scope.checkCurrPage = partyConfTemp.checkCurrPage;
				$scope.invoiceCurrpage = partyConfTemp.invoiceCurrpage;
				ctrlComm.del('partyconfirm');
			} else {
				$scope.date1 = undefined;
				$scope.date2 = undefined;
				$scope.check = undefined;
				$scope.invoice = undefined;
				$scope.checkCurrPage = undefined;
				$scope.invoiceCurrpage = undefined;
			}
		} else {
			request.removeItem('longdata');

		}
	} else {
		$scope.checkCurrPage = 1;
		$scope.invoiceCurrpage = 1;
		$scope.maxSize = 5;
	}

	if ($location.path() == '/accounts') {
		ctrlComm.del('partyconfirm');
	}

	$scope.partyconfPage = 1;
	$scope.itemsPerPage = 20;
	$scope.shortPage = 2;
	$scope.maxSize = 5;

	$scope.getCurrentPage = function () {
		partyConfTemp.checkCurrPage = $scope.checkCurrPage;
		partyConfTemp.invoiceCurrpage = $scope.invoiceCurrpage;
	}

	function updateMaxSize() {
		if (window.innerWidth > 600) {
			$scope.maxSize = 10;
		} else if (window.innerWidth > 500) {
			$scope.maxSize = 8;
		} else if (window.innerWidth > 400) {
			$scope.maxSize = 6;
		} else if (window.innerWidth > 300) {
			$scope.maxSize = 5;
		}
	}
	updateMaxSize();
	window.addEventListener("resize", function () {
		$rootScope.safeApply(function () {
			updateMaxSize();
		})
	});

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

}).controller('shotpartymodelctrl', function ($scope, $uibModalInstance, $log, $state, $window, request, items, $timeout) {

	$scope.partyconf = items['shortparty'];
	$scope.shortcheck = [];
	$scope.shortinvoice = [];

	$scope.shorthide = items.shortresult;

	if ($scope.partyconf) {
		for (i = 0; i < $scope.partyconf.length; i++) {
			if ($scope.partyconf[i].ind == 'B' || $scope.partyconf[i].ind == 'C') {
				$scope.shortcheck.push($scope.partyconf[i])
			} else {
				$scope.shortinvoice.push($scope.partyconf[i])
			}
		}
	}

	$scope.printContent = function (el) {
		var printContents = document.getElementById(el).innerHTML;
		var popupWin = window.open('', '_blank', 'width=700,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
		popupWin.document.open();
		popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="/css/styles.css" /></head><body onload="window.print()"> <table style="border:1px solid black;"><thead style="border:1px solid black;"><tr style="border:1px solid black;"></tr></thead><tbody style="border:1px solid black;"><tr style="border:1px solid black;"><td style="border:1px solid black;">' + printContents + '</td></tr></tbody></table></body></html>');
		popupWin.document.close();
	}


	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};



});

pennaApp.controller('statementsctrl', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $filter, $sce, $location, $http, $interval, $timeout) {

	$scope.layout = 'short';
	if ($location.path() == '/accounts/statements') {
		request.removeItem('longdata');
	}

});

pennaApp.controller('statementspagectrl', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $filter, $sce, $location, $http, $interval, $timeout) {


    if(ctrlComm.get('file_system') != undefined){

    if(ctrlComm.get('file_system') == "excel"){
       $scope.pdfURL = $scope.prePath + ctrlComm.get('file_system').ExcelUrl;
       $scope.pdfURL = $scope.pdfURL.replace(/\\/g, "/")
    }else{
         $scope.pdfURL = $scope.prePath + ctrlComm.get('file_system').PdfUrl;

    }

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
    					console.log("pdfrrr", pdfrrr[pdfrrr.length - 1]);
    					var filename = pdfrrr[pdfrrr.length - 1];
    					console.log("filename", filename);

    					var targetPath = cordova.file.externalDataDirectory + filename;
    					var fileTransfer = new FileTransfer();
    					var uri = encodeURI($scope.pdfURL);
    					console.log("filename2", $scope.pdfURL, uri);
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

    }else{
           $state.go('accounts.statements.party-confirmation-taxable');
       }

});



pennaApp.controller('longpartymodelctrl', function ($scope, $uibModalInstance, $log, $state, $window, request, items, ctrlComm, $timeout) {

	$scope.long_party = request.getObj('longdata');

	/*var long_party = items['longparty'];

	ctrlComm.put('longparty', long_party);
	$scope.long_party = ctrlComm.get('longparty');*/


	$scope.check = [];
	$scope.invoice = [];
    $scope.payment_long=[];
	if ($scope.long_party) {
		for (i = 0; i < $scope.long_party.length; i++) {
			if ($scope.long_party[i].ind == 'B' || $scope.long_party[i].ind == 'C') {
				$scope.check.push($scope.long_party[i])
			} else {
				$scope.invoice.push($scope.long_party[i])
			}
		}

	}




	$scope.printContent1 = function (el) {

		var printContents = document.getElementById(el).innerHTML;
		var popupWin = window.open('', '_blank', 'width=700,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
		popupWin.document.open();
		popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="/css/styles.css" /></head><body onload="window.print()"> <table style="border:1px solid black;"><thead style="border:1px solid black;"><tr style="border:1px solid black;"></tr></thead><tbody style="border:1px solid black;"><tr style="border:1px solid black;"><td style="border:1px solid black;">' + printContents + '</td></tr></tbody></table></body></html>');
		popupWin.document.close();


	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};



});
pennaApp.directive('pdf', function () {
	return {
		restrict: 'E',
		link: function (scope, element, attrs) {
			var url = scope.$eval(attrs.src);
			element.replaceWith('<object type="application/pdf" data="' + url + '" style="width:100%;height:1000px;"></object>');
		}
	};
});
