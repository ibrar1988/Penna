angular.module('pennaApp').controller('addSuggestionctrl', function ($scope, $rootScope, $uibModalInstance, $state, items, request, mobile) {
	$scope.currUser = items.currUser;
	$scope.notification = items.notification;
	$scope.loader = items.loader;
	$scope.netWork = items.netWork;
	$scope.saveinLocal = items.saveinLocal;
	$scope.getFromLocal = items.getFromLocal;
	$scope.complat = items.complat;
	$scope.suggests = {};
	$scope.netWork(function (status) {
		if (status) {
			getRequestNumber();
		}
	});
	if (!$scope.referrer) $scope.referrer = {};

	function getRequestNumber() {
		$scope.loader(true);
		request.service('getRequestNumber', 'post', $scope.currUser, function (res) {
			$scope.loader(false);
			if (res.statusCode == "200") {
				$scope.suggests.requestNumber = res.RequestNumber;
			}
		});
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

	$scope.imageSelected = function () {
		delete $scope.err.suggestionImage;
		var ele = document.getElementById('addsuggAttachInput');
		var file = ele.files[0];
		var size_img = file.size / 1048576;
		var size_img1 = size_img.toFixed(0)
        if(size_img1 <= 1){
            var reader = new FileReader();
		reader.onload = function () {
			$rootScope.safeApply(function () {
				$scope.suggests.suggestionImage = reader.result;
			});
		}
		reader.readAsDataURL(file);
        }else{
        	$scope.notification("File size must be less than 1 MB", 10000);
        }





	}

	$scope.mobileUploadAttachment = function () {
		document.getElementById('addsuggAttachInput').click();
		mobile.chooseImage(function (img) {
			$rootScope.safeApply(function () {
				$scope.suggests.suggestionImage = img;
			});
		});
	}

	$scope.addsuggmodel = function (params) {
		validatesuggestion(function (params) {
			$scope.suggests.userId = $scope.currUser.userId;
			$scope.suggests.accessToken = $scope.currUser.accessToken;
			$scope.netWork(function (status) {
				if (status) {
					$scope.loader(true);
					request.service('addSuggestions', 'post', $scope.suggests, function (res) {
						$scope.loader(false);
						if (res.statusCode == "200") {
							$scope.notification(res.statusMessage, 10000);
							$state.go('profile.suggestions', null, {
								reload: true
							});
							$uibModalInstance.close(res);
						} else {
							$scope.notification(res.statusMessage);
						}
					});
				} else {
					$uibModalInstance.close($scope.suggests);
				}
			});
		});
	}

	$scope.err = {};

	function validatesuggestion(cb) {
		if (!$scope.suggests.complaint_type) {
			$scope.err.complaint_type = true;
		} else {
			delete $scope.err.complaint_type;
		}
		if (!$scope.suggests.complaintText) {
			$scope.err.complaintText = true;
		} else {
			delete $scope.err.complaintText;
		}
		/*     if (!$scope.suggests.suggestionImage) {
	$scope.err.suggestionImage = true;
} else {
	delete $scope.err.suggestionImage;
}*/
		if (Object.keys($scope.err).length == 0) {
			if (cb) cb();
		}
	}

	$scope.imguploadsugg = function (shipadd) {
		$scope.currShipAddrs = shipadd;
	}
	$scope.changeFile = function (element) {
		var params = {}
		params.userId = $scope.currUser.userId;
		params.accessToken = $scope.currUser.accessToken;
		//params.accessToken = $scope.currUser.accessToken;

		var oData = new FormData(document.getElementById("csvForm"));
		oData.append("jsondata", JSON.stringify(params));
		$.ajax({
			url: request.setup.url('uploadShipToAddress'),
			data: oData,
			processData: false,
			contentType: false,
			type: 'POST',
			success: function (res) {
				$rootScope.safeApply();
				if (res.statusCode == "200") {
					// $state.go('profile.ship-address', null, {
					//     reload: true
					// });
				} else if (res.dupLogin) {
					$scope.logout();
					$scope.notification(res.statusMessage);
				} else {
					$scope.notification(res.statusMessage);
				}
			},
			error: function (err) {
			}
		});
	}


	var complaintText = '';
	$scope.$watch('suggests.complaintText', function (val) {
		if (val == 0) {
			$scope.suggests.complaintText = '';
		}
		if (val && val.length) {
			if (val.length > 250) {
				if (val.length != 1) {
					$scope.suggests.complaintText = complaintText;
				} else {
					$scope.suggests.complaintText = '';
				}
			} else {
				complaintText = val;
			}
		}
	});

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel1');
	};

});
