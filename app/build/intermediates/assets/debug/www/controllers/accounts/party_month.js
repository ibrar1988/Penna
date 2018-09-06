angular.module('pennaApp').controller('party_monthCtrl', function ($scope, $rootScope, $state, request, ctrlComm, $http) {



	$scope.patymonth_pendings = [];
	$scope.patymonth_pendings1 = [];
	$scope.patymonth_pendings2 = [];


	//getMonthlyPartyConfirmation

	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	$scope.MonthlyPartyConfirmation = function () {
		$scope.loader(true);


		var input = {
			"userId": $scope.currUser.userId,
			"accessToken": $scope.currUser.accessToken,
			"company": $scope.currUser.companyId,

		}



		request.service('getMonthlyPartyConfirmation', 'post', input, function (data) {
			$scope.loader(false);
			if (data.statusCode == 200) {

				var patymonth_pen = data.monthlyPartyConfirmations;

				for (var k in patymonth_pen) {

					if (patymonth_pen[k].month != '') {
						patymonth_pen[k].month = months[patymonth_pen[k].month - 1];
					}


					if (patymonth_pen[k].confirmation == null) {
						$scope.patymonth_pendings.push(patymonth_pen[k]);
					}

					if (patymonth_pen[k].confirmation == "no") {
						$scope.patymonth_pendings2.push(patymonth_pen[k]);
					}

					if (patymonth_pen[k].confirmation == "yes") {
						$scope.patymonth_pendings1.push(patymonth_pen[k]);
					}
				}

			} else {
				$scope.notification(data.statusMessage);

			}
		});

	}

	$scope.MonthlyPartyConfirmation();

	$scope.localbro_data();

	$scope.submit_month = function (party_con) {


		validate_MonthlyPartyConfirmation($scope.patymonth_pendings, function () {


			var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
			var option = {};

			option.userId = $scope.currUser.userId,
				option.accessToken = $scope.currUser.accessToken,

				option.version = $scope.currUser.version;
			option.device_id = $scope.currUser.device_id;
			option.device_type = $scope.currUser.device_type;

			if (deviceInfo.device_Platform != "WEB") {
				option.device_Model = deviceInfo.device_Model;
				option.device_Platform = deviceInfo.platform;
				option.device_ID = deviceInfo.uuid;
				option.device_Manufacturer = deviceInfo.device_Manufacturer;
				option.device_Serial = deviceInfo.device_Serial;
				option.device_IPAddress = deviceInfo.device_IPAddress;
				option.device_MacAddress = deviceInfo.device_MacAddress;
				option.location = "";
				option.osVersion = deviceInfo.osVersion;
				option.apVersion = localStorage.getItem('device_version');
			} else {
				if (JSON.parse(localStorage.getItem('browserInfo')).lat_long != undefined) {

					var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;
				} else {

					var local_browserInfo = "blocked"
				}
				option.device_Model = "";
				option.device_Platform = "WEB";
				option.device_ID = "";
				option.device_Manufacturer = "";
				option.device_Serial = "";
				option.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
				option.device_MacAddress = "";
				option.location = local_browserInfo;
				option.osVersion = "";
				option.apVersion = "";
			}


			option.monthlyPartyConfirmations = [];

			for (var l in $scope.patymonth_pendings) {
				if ($scope.patymonth_pendings[l].status == 'yes' || $scope.patymonth_pendings[l].status == 'no') {


					var obj_par = {

						"id": $scope.patymonth_pendings[l].id,
						"year": $scope.patymonth_pendings[l].year,
						"statementDate": $scope.patymonth_pendings[l].statementDate,
						"confirmation": $scope.patymonth_pendings[l].status,
						"submit": "",
						"comments": $scope.patymonth_pendings[l].notes

					}

					if ($scope.patymonth_pendings[l].notes != undefined) {
						obj_par.comments = $scope.patymonth_pendings[l].notes
					} else {
						obj_par.comments = ''
					}


					var inde = months.indexOf($scope.patymonth_pendings[l].month);

					obj_par.month = inde + 1;




					option.monthlyPartyConfirmations.push(obj_par)
				}
			}

			$scope.loader(true);
			request.service('setMonthlyPartyConfirmation', 'post', option, function (data) {
				$scope.loader(false);
				if (data.statusCode == 200) {

					$scope.notification(data.statusMessage); //statusMessage
					$state.reload();
					if (data.verObj.updateMandate == 'NO') {
						$scope.check_appUpdate();
					}

				} else if (data.dupLogin || data.statusCode == 505) {

					if (data.updateMandate == 'YES') {
						$scope.logout();
					} else {
						$scope.check_appUpdate();
					}


					if (data.dupLogin) {
						$scope.notification(res.statusMessage);
						$scope.logout();
					}

				} else if (data.statusCode == 404) {

					$scope.logout();

				} else {
					$scope.notification(res.statusMessage);
				}



			});
		});

	}



	function validate_MonthlyPartyConfirmation(data, cb) {

		var err_count = 0;

		for (var i in data) {

			if (data[i].status == "no") {
				if (data[i].notes) {
				} else {
					err_count++;
					$scope.patymonth_pendings[i].notes_status = true;
				}

			} else {
				if (data[i].notes) {
				}
			}



		}
		if (err_count == 0) {
			if (cb)
				cb();
		}
	}



	$scope.isFocused = function (index) {
		$scope.index34 = index;
		$scope.patymonth_pendings[index].notes_status = false;

	}

	$scope.yes_conform = function (index) {
		$scope.textfocus(index);
		$scope.patymonth_pendings[index].notes_status = false;
		//$('#reviewProduct' + index).val('');
	}


	$scope.textfocus = function (index) {
		$("#reviewProduct" + index).focus();
		$scope.patymonth_pendings[index].notes_status = false;
		//$('#reviewProduct' + index).val('');

	}



	$scope.mont_pdf = function (pdf) {

		var urls = $scope.prePath + '/penna/payment/PDF?type=' + 'mpc' + '&company=' + $scope.currUser.companyId + '&id=' + pdf.id + '&accessToken=' + $scope.currUser.accessToken + '&userId=' + $scope.currUser.userId;

		/*var params = {
			"userId": $scope.currUser.userId,
			"accessToken": $scope.currUser.accessToken,
			"company": $scope.currUser.companyId,
			"id": pdf.id

		}*/









		/*	$http({
				method: "GET",
				url: urls,
				data: params,
			}).then(function mySuccess(response) {
				ctrlComm.put('pdfurl_month', response.data);
				$state.go('accounts.monthpartypdf');

			}, function myError(response) {
			});*/


		/*console.log("$scope.prePath", $scope.prePath)
		var pdf11 = $scope.prePath + pdf
		console.log(pdf11);*/

		ctrlComm.put('pdfurl_month', urls);
		$state.go('accounts.monthpartypdf');

	}



	$scope.showInvoice = function (showpdf) {
		$scope.pdfURL = $scope.prePath + showpdf;
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


	$('#reviewProduct' + $scope.index34).unbind('keyup change input paste').bind('keyup change input paste', function (e) {
		var $this = $(this);
		var val = $this.val();
		var valLength = val.length;
		var maxCount = $this.attr('maxlength');
		if (valLength > maxCount) {
			$this.val($this.val().substring(0, maxCount));
		}
	});




}).controller('montpartypdfctrl', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $location, $timeout) {

	$timeout(function () {
		$window.scrollTo(0, 0);
	}, 100)

	if (ctrlComm.get('pdfurl_month') != undefined) {
		$scope.pdfURL = ctrlComm.get('pdfurl_month');
		//$scope.pdfURL = $scope.pdfURL.replace(/\\/g, "/");
	} else {
		$location.path('/accounts/monthparty-conformation');
	}

});
