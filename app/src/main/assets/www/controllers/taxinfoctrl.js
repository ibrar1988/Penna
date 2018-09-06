/*tax info-- -- -- -- -- -- --controller*/
angular.module('pennaApp').controller('taxinfoctrl', function ($scope, $rootScope, $uibModal, $log, $state, ctrlComm, request, mobile) {

	$scope.taxinfo = {};
	$scope.err = {};

	getTaxinfoDetails();

	function getTaxinfoDetails() {
		$scope.cstno = false;
		$scope.pan = false;
		$scope.tin = false;
		$scope.serviceno = false;
		$scope.payment = false;
		$scope.netWork(function (status) {
			if (status) {
				getTaxInfo();
			} else if ($scope.ifMobile) {
				$scope.getOfflineDataFromLocal('taxInfo', function (data) {
					if (data) {
						$rootScope.safeApply(function () {
							$scope.taxinfo = data.taxInfo;
							if (!data.base64Imgs) data.base64Imgs = {};
							if ($scope.taxinfo) {
								$scope.taxinfo.CSTorGSTNumber_image = data.base64Imgs.CSTorGSTNumber_image;
								$scope.taxinfo.pan_image = data.base64Imgs.pan_image;
								$scope.taxinfo.tin_image = data.base64Imgs.tin_image;
								$scope.taxinfo.service_number_image = data.base64Imgs.service_number_image;
							}
						});
					} else if ($scope.ifMobile) {
						$scope.addOfflineDataInLocal('taxInfo', {
							key: 'uploadTaxDocuments',
							type: 'post',
							input: [],
							taxInfo: {}
						});
					}
				});
			}
		});
	}

	function getTaxInfo() {
		$scope.loader(true);
		request.service('getTaxInfo', 'post', $scope.currUser, function (res) {
			$scope.res_tin = res.getTaxinfo[0].tin;
			$scope.loader(false);

			if (res.getTaxinfo[0]) {
				showLatestImages(res.getTaxinfo[0], function (data) {
					$scope.taxinfo = data;
					$scope.taxinfo = {
						CSTorGSTNumber: $scope.taxinfo.CSTorGSTNumber,
						CSTorGSTNumber_image: $scope.taxinfo.CSTorGSTNumber_image,
						CSTorGSTNumber_image_Indicator: $scope.taxinfo.CSTorGSTNumber_image_Indicator,
						id: $scope.taxinfo.id,
						imgs: $scope.taxinfo.imgs,
						pan: $scope.taxinfo.pan,
						pan_image: $scope.taxinfo.pan_image,
						pan_image_Indicator: $scope.taxinfo.pan_image_Indicator,
						payment_Terms: $scope.taxinfo.payment_Terms,
						payment_Terms_Indicator: $scope.taxinfo.payment_Terms_Indicator,
						service_Number: $scope.taxinfo.service_Number,
						service_number_image: $scope.taxinfo.service_number_image,
						service_number_image_Indicator: $scope.taxinfo.service_number_image_Indicator,
						sfSyncStatus: $scope.taxinfo.sfSyncStatus,
						sfSyncStatusDescription: $scope.taxinfo.sfSyncStatusDescription,
						tin: $scope.res_tin,
						tin_data: $scope.res_tin,
						tin_image: $scope.taxinfo.tin_image,
						tin_image_Indicator: $scope.taxinfo.tin_image_Indicator,
					}



					/*if ($scope.taxinfo.CSTorGSTNumber == '') {
	$scope.taxinfo.CSTorGSTNumber_image = '';

}

if ($scope.taxinfo.pan == '') {
	$scope.taxinfo.pan_image = ''
}

if ($scope.taxinfo.tin == '') {
	$scope.taxinfo.tin_image = ''
}

if ($scope.taxinfo.service_Number == '') {
	$scope.taxinfo.service_number_image = ''
}*/


					ctrlComm.put('taxinfo', $scope.taxinfo);

				})
				if ($scope.ifMobile) {
					$scope.getOfflineDataFromLocal('taxInfo', function (data) {
						if (!data) data = {
							key: 'uploadTaxDocuments',
							type: 'post',
							input: [],
							taxInfo: $scope.taxinfo,
							base64Imgs: {}
						}
						data.taxInfo = $scope.taxinfo;
						if (!data.base64Imgs) data.base64Imgs = {};
						if (data.base64Imgs.imgs != data.taxInfo.imgs) {
							getBase64TaxDetailsImgs(function (imgData) {
								imgData.imgs = $scope.taxinfo.imgs;
								data.base64Imgs = imgData;
								$scope.addOfflineDataInLocal('taxInfo', data);
							})
						} else {
							$scope.addOfflineDataInLocal('taxInfo', data);
						}

					});
				}

			} else if (res.dupLogin) {
				$scope.logout();
				$scope.notification(res.statusMessage);
			}
		});
	}

	$('#exampleInputName2').keyup(function () {
		var $field = $(this);
		$("#upload").css("display", "none");
	})

	$('#exampleInputName3').keyup(function () {
		var $field = $(this);
		$("#upload1").css("display", "none");
	})

	$('#exampleInputName4').keyup(function () {
		var $field = $(this);
		$("#upload2").css("display", "none");
	})

	$('#exampleInputName5').keyup(function () {
		var $field = $(this);
		$("#upload3").css("display", "none");
	})

	$('#exampleInputName6').keyup(function () {
		var $field = $(this);
		$("#upload4").css("display", "none");
	})

	function getBase64TaxDetailsImgs(cb) {
		$scope.loader(true);
		request.service('getTaxInfoImages', 'post', $scope.currUser, function (res) {
			$scope.loader(false);
			if (res.getTaxinfoImages) {
				if (cb) cb(res.getTaxinfoImages[0])
			} else if (res.dupLogin) {
				$scope.logout();
			}
		});
	}

	function showLatestImages(res, cb) {
		res.imgs = 0;
		if (res.CSTorGSTNumber_image) {
			res.CSTorGSTNumber_image = res.CSTorGSTNumber_image.replace(/\\/g, "/") + '?lastmod=' + new Date().getTime();
			res.imgs++;
		}
		if (res.pan_image) {
			res.pan_image = res.pan_image.replace(/\\/g, "/") + '?lastmod=' + new Date().getTime();
			res.imgs++;
		}
		if (res.service_number_image) {
			res.service_number_image = res.service_number_image.replace(/\\/g, "/") + '?lastmod=' + new Date().getTime();
			res.imgs++;
		}
		if (res.tin_image) {
			res.tin_image = res.tin_image.replace(/\\/g, "/") + '?lastmod=' + new Date().getTime();
			res.imgs++;
		}
		cb(res)
	}

	$scope.taxImages = {};
	$scope.uploadMobileImage = function (taxType, number) {
		mobile.chooseImage(function (img) {
			$rootScope.safeApply(function () {
				$scope.taxImages[taxType] = img;
				if (!$scope.cstno && !$scope.pan && !$scope.tin && !$scope.serviceno && !$scope.payment) {
					saveTaxDocuments(taxType, img);
				}
			});
		});
	}
	$scope.imageSelected = function (taxType, number) {
		delete $scope.err.image;
		var ele = document.getElementById(taxType);
		var file = ele.files[0];
		var reader = new FileReader();
		reader.onload = function () {
			$rootScope.safeApply(function () {
				$scope.taxImages[taxType] = reader.result;
				if (!$scope.cstno && !$scope.pan && !$scope.tin && !$scope.serviceno && !$scope.payment) {
					saveTaxDocuments(taxType, reader.result);
				}
			});
		}
		reader.readAsDataURL(file);
	}


	var tinNum = '';
	$scope.$watch('taxinfo.tin', function (val) {
		/*if (val == 0) {
		    $scope.shipadd.pin = '';
		}*/
		if (val) {
			if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 15) {
				if (val.toString().length != 1) {
					$scope.taxinfo.tin = tinNum;
				} else {
					$scope.taxinfo.tin = '';
				}
			} else {
				tinNum = val;
			}
		}
	});



	function saveTaxDocuments(st, img) {


		$scope.taxinfo = ctrlComm.get('taxinfo');
		var input = {};
		input.userId = $scope.currUser.userId;
		input.accessToken = $scope.currUser.accessToken;
		if ($scope.taxinfo)
			input.taxId = $scope.taxinfo.id;
		input.indicator = 'T';
		input.taxImage = img;

		if (st == 'CSTorGSTNumber') {
			input.type = 'cstorgst';
			input.CSTorGSTNumber = $scope.taxinfo.CSTorGSTNumber;
		} else if (st == 'pan') {
			input.type = 'pan';
			input.pan = $scope.taxinfo.pan;
		} else if (st == 'tin') {
			input.type = 'tin';
			input.tin = $scope.taxinfo.tin_data;
		} else if (st == 'service_Number') {
			input.type = 'serviceNumber';
			input.service_Number = $scope.taxinfo.service_Number;
		}


		$scope.netWork(function (status) {
			if (status) {
				$scope.loader(true);
				request.service('uploadTaxDocuments', 'post', input, function (res) {
					$scope.loader(false);
					if (res.statusCode == "200") {
						$scope.notification(res.statusMessage);
						getTaxInfo();
					} else if (res.dupLogin) {
						$scope.logout();
						$scope.notification(res.statusMessage);
					}
				});
			} else if ($scope.ifMobile) {
				$scope.getTaxDetails($scope.currUser.companyId, function (data) {
					$rootScope.safeApply(function () {
						if (input.type == 'cstorgst') {
							$scope.taxinfo.CSTorGSTNumber_image_Indicator = true;
						} else if (input.type == 'pan') {
							$scope.taxinfo.pan_image_Indicator = true;
						} else if (input.type == 'tin') {
							$scope.taxinfo.tin_image_Indicator = true;
						} else if (input.type == 'serviceNumber') {
							$scope.taxinfo.service_number_image_Indicator = true;
						} else {
							$scope.taxinfo.payment_Terms = value;
						}
						data.input.push(input)
						data.taxInfo = $scope.taxinfo;
						request.setItem('localDataSubmitted', 'false')
						$scope.addTaxDetails($scope.currUser.companyId, JSON.stringify(data), function () {
							$scope.notification("Tax information saved successfully");
							getTaxInfo();
						});
					});
				});
			}
		});
	}





	$scope.imgmodel = function (obj) {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			backdrop: 'static',
			templateUrl: 'pages/profile/Taxinfo/showTaxinfoImg.html',
			controller: 'imagemodelctrl',
			size: 'md',
			resolve: {
				items: function () {
					return {
						imgObj: obj,
						prePath: $scope.prePath,

					}
				}
			}


		});
		//return $scope.prePath;
		modalInstance.result.then(function (responce) {
			$scope.notification(responce.statusMessage);
		}, function () {

		});
	}



	$scope.editfiled = function (click) {
		if (click == 'cstno') {
			$scope.cstno = true;
		} else if (click == 'pan') {
			$scope.pan = true;
		} else if (click == 'tin') {
			$scope.tin = true;
		} else if (click == 'serviceno') {
			$scope.serviceno = true;
		} else if (click == 'payment') {
			$scope.payment = true;
		}
	}



	$scope.update = function (change) {
		if (change == 'cstno1') {
			$scope.cstno1 = true;
		} else if (change == 'pan1') {
			$scope.pan1 = true;
		} else if (change == 'tin1') {
			$scope.tin1 = true;
		} else if (change == 'serviceno1') {
			$scope.serviceno1 = true;
		} else if (change == 'payment1') {
			$scope.payment1 = true;
		}

	}

	function validateTaxinfo(type, num, cb) {
		if (type == 'payment') {
			if (!num) {
				$scope.notification("Please Select Number");
			} else {
				if (cb) cb("");
			}
		} else if (!$scope.taxImages[type] && !num) {
			$scope.notification("Please Select Image and Number");
		} else if (!$scope.taxImages[type]) {
			$scope.notification("Please Select Image");
		} else if (!num) {
			$scope.notification("Please Select Number");
		} else {
			if (cb) cb($scope.taxImages[type])
		}
	}
	$scope.savetaxinfo = function (saveinfo, value) {
		var value = value;
		validateTaxinfo(saveinfo, value, function (img) {
			var input = {};
			input.userId = $scope.currUser.userId;
			input.accessToken = $scope.currUser.accessToken;
			input.taxId = $scope.taxinfo.id;
			input.indicator = 'T';
			input.taxImage = img;
			if (saveinfo == 'CSTorGSTNumber') {
				input.CSTorGSTNumber = value;
				input.type = 'cstorgst';
			} else if (saveinfo == 'pan') {
				input.pan = value;
				input.type = 'pan';
			} else if (saveinfo == 'tin') {
				input.tin = value;
				input.type = 'tin';
			} else if (saveinfo == 'service_Number') {
				input.service_Number = value;
				input.type = 'serviceNumber';
				$scope.servicenos = value;
			} else if (saveinfo == 'payment') {
				input.payment_Terms = value;
				input.type = 'payment_Terms';
				input.taxImage = "";
			}

			$scope.netWork(function (status) {
				if (status) {
					$scope.loader(true);
					request.service('uploadTaxDocuments', 'post', input, function (res) {
						$scope.loader(false);
						if (res.statusCode == "200") {
							$scope.notification(res.statusMessage);
							getTaxinfoDetails();
							$scope.taxImages = {};
						} else if (res.dupLogin) {
							$scope.logout();
							$scope.notification(res.statusMessage);
						} else {
							$scope.cstno1 = false;
							$scope.pan1 = false;
							$scope.tin1 = false;
							$scope.serviceno1 = false;
							$scope.payment1 = false;
							$scope.notification(res.statusMessage);
						}
					});
				} else if ($scope.ifMobile) {
					$scope.getOfflineDataFromLocal('taxInfo', function (data) {
						if (input.type == 'cstorgst') {
							$scope.taxinfo.CSTorGSTNumber_image_Indicator = true;
							$scope.taxinfo.CSTorGSTNumber = value;
						} else if (input.type == 'pan') {
							$scope.taxinfo.pan_image_Indicator = true;
							$scope.taxinfo.pan = value;
						} else if (input.type == 'tin') {
							$scope.taxinfo.tin_image_Indicator = true;
							$scope.taxinfo.tin = value;
						} else if (input.type == 'serviceNumber') {
							$scope.taxinfo.service_number_image_Indicator = true;
							$scope.taxinfo.service_Number = value;
						} else {
							$scope.taxinfo.payment_Terms = value;
						}
						if (!data || !data.input || !data.key) data = {
							key: 'uploadTaxDocuments',
							type: 'post',
							input: []
						};
						data.input.push(input)
						data.taxInfo = angular.copy($scope.taxinfo);
						request.setItem('localDataSubmitted', 'false')
						$scope.addOfflineDataInLocal('taxInfo', data, function () {
							$rootScope.safeApply(function () {
								$scope.taxImages = {};
								$scope.notification("Hey you are in offline mode! Will added tax information successfully once you are online!");
								getTaxinfoDetails();
							});
						});
					});
				}
			})
		})
	}


}).controller('imagemodelctrl', function ($scope, $uibModalInstance, $log, $state, request, items) {




	//$scope.modelimg = imgObj;
	$scope.modelimg = items.imgObj;
	$scope.prePath = items.prePath;

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};



});
