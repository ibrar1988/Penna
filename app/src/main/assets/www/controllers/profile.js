angular.module('pennaApp').controller('profileCtrl', function ($scope, $rootScope, $state, $location, request, ctrlComm, $uibModal, $compile, $log, $timeout, $filter, mobile) {


	var profile = function (makeBase64Images) {
		$scope.netWork(function (status) {
			if (status) {
				$scope.loader(true);
				$scope.getProfile(function (res) {
					$scope.loader(false);
					$scope.usersprofileList = res.companyDetails;
					$scope.usersprofile = res;
					if (makeBase64Images)
						$scope.makeBase64Images();
				})
			} else if ($scope.ifMobile) {
				featchFromLocal();
			}
		})
	}

	function getProDetails() {
		if (ctrlComm.get('cities') || !$scope.usersprofile) {
			profile();
		} else {
			setTimeout(function () {
				getProDetails();
			}, 10);
		}
	}

	getProDetails()

	function featchFromLocal() {
		function getOfflineProfileDetails(cb) {
			$scope.getOfflineDataFromLocal('profile', function (data) {
				$rootScope.safeApply(function () {
					if (cb) cb(data);
				})
			});
		}

		function getOfflineImages(cb) {
			$scope.getOfflineDataFromLocal('images', function (imgs) {
				$rootScope.safeApply(function () {
					if (cb) cb(imgs);
				})
			});
		}
		getOfflineProfileDetails(function (data) {
			getOfflineImages(function (imgs) {
				if (Object.keys(data).length) {
					for (var i in data.profile.companyDetails.billingAddress) {
						var bill = data.profile.companyDetails.billingAddress[i];
						if (bill.indicatorStatus) {
							data.profile.companyDetails.otherBillingIndicatorStatus = true;
						}
					}
					for (var i in data.profile.companyDetails.soldToAddress) {
						var sold = data.profile.companyDetails.soldToAddress[i];
						if (sold.indicatorStatus) {
							data.profile.companyDetails.otherSoldIndicatorStatus = true;
						}
					}

					angular.forEach(data.profile.companyDetails.getFamilymembers, function (val, key) {
						val.dateOfBirth = $filter('validDate')(val.dateOfBirth);
						if (val.anniversary) {
							val.anniversary = $filter('validDate')(val.anniversary);
						} else {
							val.anniversary = undefined;
						}
					});
				} else {
					data = {
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
						profile: {}
					}
				}

				if (Object.keys(imgs).length) {
					data.profile.userProfilePic = imgs.uploadProfilePhoto ? imgs.uploadProfilePhoto : 'img/profile-default.jpg';
					data.profile.userCoverPic = imgs.uploadCoverImage ? imgs.uploadCoverImage : 'img/default-portal-banner.png';
				} else {
					data.profile.userProfilePic = 'img/profile-default.jpg';
					data.profile.userCoverPic = 'img/default-portal-banner.png';
				}


				$scope.usersprofile = angular.copy(data.profile);
				$scope.usersprofileList = angular.copy(data.profile.companyDetails);

			});
		});
	}


	function getProPicBase64(cb) {
		mobile.getBase64('userProfilePic', function (base64) {
			if (base64.length < 10) {
				$timeout(function () {
					getProPicBase64();
				}, 0)
			} else {
				$scope.usersprofile.userProfilePicBase64 = base64;
				getCoverPicBase64(function () {
					if (cb) cb();
				});
			}
		});
	}

	function getCoverPicBase64(cb) {
		mobile.getBase64('userCoverPic', function (base64) {
			if (base64.length < 10) {
				$timeout(function () {
					getCoverPicBase64();
				}, 0)
			} else {
				$scope.usersprofile.userCoverPicBase64 = base64;
				if (cb) cb();
			}
		});
	}

	var editprofile = function (usersprofileList) {
		$state.go('profile.my-profile-edit');
	}

	$scope.saveTotalProfile = function (data) {
		$scope.askConfrimation({}, function () {
			confirmSaveTotalProfile();
		});
	};


	var billingModified = false;
	var soldModified = false;


	$scope.fileChanged = function (e) {
		var files = e.target.files;
		var fileReader = new FileReader();
		fileReader.readAsDataURL(files[0]);
		fileReader.onload = function (e) {
			$scope.imgSrc = this.result;
			$rootScope.safeApply();
		};
	}
	$scope.imgSrc = window.localStorage.getItem('imgresult');
	$scope.clear = function () {
		$scope.imageCropStep = 1;
		delete $scope.imgSrc;
		delete $scope.result;
		delete $scope.resultBlob;
	};

	$scope.cancelUpload = function () {
		$scope.showProfileCropper = false;
		$scope.showCoverCropper = false;
		$scope.clear();
	}

	$scope.uploadPic = function (key, img) {
		$scope.cancelUpload();
		var input = {
			userId: $scope.currUser.userId,
			accessToken: $scope.currUser.accessToken,
		}
		if (key == 'uploadProfilePhoto') {
			input.profileImage = img;
		} else {
			input.coverImage = img;
		}

		ctrlComm.put(key, true);

		// if($scope.ifMobile){
		//     $scope.getOfflineDataFromLocal('images',function(data){
		//         if(!data) data = {}
		//         data[key] = img;
		//         $scope.addOfflineDataInLocal('images',data);
		//     });
		// }
		$scope.netWork(function (status) {
			if (status) {
				$scope.loader(true);

				request.service(key, 'post', input, function (res) {
					$scope.loader(false);
					if (res.statusCode == 200) {
						$scope.notification(res.statusMessage);
						profile(true);

					} else if (res.dupLogin) {
						$scope.logout();
						$scope.notification(res.statusMessage);
					} else {
						$scope.notification(res.statusMessage);
					}
				});
			} else {
				$scope.getOfflineDataFromLocal('coverPro', function (data) {
					if (!data) data = {}
					data[key] = {
						key: key,
						type: 'post',
						input: [input],
					};
					$scope.addOfflineDataInLocal('coverPro', data, function () {
						$scope.getOfflineDataFromLocal('images', function (imgs) {
							if (input.profileImage)
								imgs.uploadProfilePhoto = input.profileImage;
							if (input.coverImage)
								imgs.uploadCoverImage = input.coverImage;
							$scope.addOfflineDataInLocal('images', imgs, function () {
								$rootScope.safeApply(function () {
									request.setItem('localDataSubmitted', 'false');
									profile();
								})
							});
						})
					});
				});
			}
		});
	}

	$scope.uploadProfilePic = function () {
		var ele = document.getElementById('addprofilepicAttachInput');
		var file = ele.files[0];
		var reader = new FileReader();
		reader.onload = function () {
			$scope.uploadPic('uploadProfilePhoto', reader.result)
		}
		reader.readAsDataURL(file);
	}


	$scope.uploadCoverPic = function () {
		var ele = document.getElementById('addcoverpicAttachInput');
		var file = ele.files[0];
		var reader = new FileReader();
		reader.onload = function () {
			$scope.uploadPic('uploadCoverImage', reader.result)
		}
		reader.readAsDataURL(file);
	}

	$scope.uploadNewPic = function (key, quality, targetHeight, targetWidth, id) {
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android|webOS|IEMobile|Opera Mini)/)) {
			mobile.chooseImage(function (base64img) {
					$scope.uploadPic(key, base64img);
				}, quality, targetHeight, targetWidth)
				// }else if(key=='uploadProfilePhoto'){
				//     $scope.showProfileCropper = true;
		} else {
			document.getElementById(id).click();
		}
	}


	$scope.soldToAddress = function (soldadd) {
		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: 'static',
			templateUrl: 'pages/profile/myProfile/soldToAddressForm.html',
			controller: 'soldToAddressCtrl',
			size: 'md',
			resolve: {
				items: function () {
					return {
						loader: $scope.loader,
						soldadd: soldadd,
						notification: $scope.notification,
						currUser: $scope.currUser,
						netWork: $scope.netWork,
						logout: $scope.logout,
						getFromLocal: $scope.getFromLocal,
						usersprofileList: $scope.usersprofileList,
					}
				}
			}
		});
		modalInstance.result.then(function (arr) {
			var res = arr[0]
			if (res.statusMessage) {
				if (arr[1].indicator) {
					$scope.notification('Sold to address Details updated successfully, Admin needs to approve');
				} else {
					$scope.notification('Sold to address Details updated successfully');
				}
				profile();
			} else {
				saveSoldToAddressInLocal(res, function () {
					if (res.indicator) {
						$scope.notification('Hey you are in offline mode! Will update sold to address details successfully once you are online! Admin needs to approve.');
					} else {
						$scope.notification("Hey you are in offline mode! Will update sold to address details successfully once you are online!");
					}
				});
			}
			$scope.dateOptions.dtpicker = {};
		}, function () {
			$scope.dateOptions.dtpicker = {};
		});
	};

	function saveSoldToAddressInLocal(res, cb) {
		$scope.getOfflineDataFromLocal('profile', function (data) {
			if (res.added) {
				delete res.added;
				data.soldToAddress.input.push(res)
				data.profile.companyDetails.soldIndicator = true;
			} else {
				if (data.soldToAddress.input.length) {
					var replaced = false;
					for (var i in data.soldToAddress.input) {
						if (data.soldToAddress.input[i].id == res.id) {
							data.soldToAddress.input[i] = res
							replaced = true;
						}
					}
					if (!replaced)
						data.soldToAddress.input.push(res)

				} else {
					data.soldToAddress.input.push(res)
				}

				for (var i in data.profile.companyDetails.soldToAddress) {
					if (res.id == data.profile.companyDetails.soldToAddress[i].id) {
						if (res.indicator) {
							data.profile.companyDetails.soldToAddress[i].email = res.email;
							data.profile.companyDetails.soldToAddress[i].mobileNumber = res.mobileNumber;
							data.profile.companyDetails.soldToAddress[i].alternateMobileNumber = res.alternateMobileNumber;
							data.profile.companyDetails.soldToAddress[i].indicatorStatus = true;
						} else {
							data.profile.companyDetails.soldToAddress[i] = res;
						}
					}
				}

			}

			$scope.addOfflineDataInLocal('profile', data, function () {
				$rootScope.safeApply(function () {
					request.setItem('localDataSubmitted', 'false');
					if (cb) cb();
					profile();
				})
			});
		});
	}

	$scope.billingAddress = function (billadd) {
		$scope.billadd22 = billadd;
		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: 'static',
			templateUrl: 'pages/profile/myProfile/billingForm.html',
			controller: 'billingAddressCtrl',
			size: 'md',
			resolve: {
				items: function () {
					return {
						loader: $scope.loader,
						billadd: billadd,
						notification: $scope.notification,
						currUser: $scope.currUser,
						netWork: $scope.netWork,
						logout: $scope.logout,
						getFromLocal: $scope.getFromLocal,
						usersprofileList: $scope.usersprofileList,
						countries: $scope.countries
					}
				}
			}
		});

		modalInstance.result.then(function (arr) {
			var res = arr[0]
			if (res.statusMessage) {
				if (arr[1].added) {
					$scope.notification('Billing address Details added successfully, Admin needs to approve');
				} else if (arr[1].indicator) {
					$scope.notification('Billing address Details updated successfully, Admin needs to approve');
				} else {
					$scope.notification('Billing address Details updated successfully');
				}
				profile();
			} else {
				saveBillingAddressInLocal(res, function () {
					if (res.added) {
						$scope.notification('Hey you are in offline mode! Will added billing to address details successfully once you are online! Admin needs to approve.');
					} else if (res.indicator) {
						$scope.notification('Hey you are in offline mode! Will update billing to address details successfully once you are online! Admin needs to approve.');
					} else {
						$scope.notification("Hey you are in offline mode! Will update billing to address details successfully once you are online!");
					}
				});
			}
			$scope.dateOptions.dtpicker = {};
		}, function () {
			$scope.dateOptions.dtpicker = {};
		});
	};

	function saveBillingAddressInLocal(res, cb) {
		$scope.getOfflineDataFromLocal('profile', function (data) {
			if (!data) data = {}
			if (!data.profile) data.profile = {};
			if (!data.profile.companyDetails) data.profile.companyDetails = {};
			if (!data.profile.companyDetails.billingAddress) data.profile.companyDetails.billingAddress = [];
			if (!data.billingAddress) data.billingAddress = {
				key: 'addOrUpdateBillingAddress',
				type: 'post',
				input: []
			};

			if (res.added) {
				data.billingAddress.input.push(res)
				data.profile.companyDetails.billingIndicator = true;
			} else {
				if (data.billingAddress.input.length) {
					var replaced = false;
					for (var i in data.billingAddress.input) {
						if (data.billingAddress.input[i].id == res.id) {
							data.billingAddress.input[i] = res;
							replaced = true;
						}
					}
					if (!replaced)
						data.billingAddress.input.push(res)

				} else {
					data.billingAddress.input.push(res)
				}

				for (var i in data.profile.companyDetails.billingAddress) {
					if (res.id == data.profile.companyDetails.billingAddress[i].id) {
						if (res.indicator) {
							data.profile.companyDetails.billingAddress[i].email = res.email;
							data.profile.companyDetails.billingAddress[i].mobileNumber = res.mobileNumber;
							data.profile.companyDetails.billingAddress[i].alternateMobileNumber = res.alternateMobileNumber;
							data.profile.companyDetails.billingAddress[i].indicatorStatus = true;
						} else {
							data.profile.companyDetails.billingAddress[i] = res;
						}
					}
				}
			}
			$scope.addOfflineDataInLocal('profile', data, function () {
				$rootScope.safeApply(function () {
					request.setItem('localDataSubmitted', 'false');
					if (cb) cb();
					profile();
				})
			});
		});
	}

	$scope.individualPartner = function (userpro) {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			animation: true,
			templateUrl: 'pages/profile/myProfile/individualPartnerForm.html',
			controller: 'individualPartnerCtrl',
			size: 'md',
			resolve: {
				items: function () {
					return {
						loader: $scope.loader,
						userpro: userpro,
						notification: $scope.notification,
						currUser: $scope.currUser,
						netWork: $scope.netWork,
						logout: $scope.logout
					}
				}
			}
		});

		modalInstance.result.then(function (res) {
			if (res.statusMessage) {
				$scope.notification(res.statusMessage);
				profile();
			} else {
				savePartnerInLocal(res, function () {
					if (res.update) {
						$scope.notification("Hey you are in offline mode! Will update partner details successfully once you are online!");
					} else {
						$scope.notification("Hey you are in offline mode! Will added partner details successfully once you are online!");
					}
				});

			}
			$scope.dateOptions.dtpicker = {};
		}, function () {
			$scope.dateOptions.dtpicker = {};
		});
	}

	function savePartnerInLocal(res, cb) {
		$scope.getOfflineDataFromLocal('profile', function (data) {
			if (!data) data = {}
			if (!data.profile) data.profile = {};
			if (!data.profile.companyDetails) data.profile.companyDetails = {};
			if (!data.profile.companyDetails.getPartners) data.profile.companyDetails.getPartners = [];

			if (res.added) {
				delete res.added;
				res.tId = 'id' + data.profile.companyDetails.getPartners.length;
				data.profile.companyDetails.getPartners.push(res)
			} else {
				var partner = data.profile.companyDetails.getPartners;
				for (var i in partner) {
					if (partner[i].id == res.id || (partner[i].tId == res.tId && res.tId)) {
						data.profile.companyDetails.getPartners[i] = res;
					}
				}
			}
			$scope.addOfflineDataInLocal('profile', data, function () {
				$rootScope.safeApply(function () {
					request.setItem('localDataSubmitted', 'false');
					if (cb) cb();
					profile();
				})
			});
		});
	}

	$scope.familyMember = function (userfam) {
		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: 'static',
			templateUrl: 'pages/profile/myProfile/familyMemberForm.html',
			controller: 'familyMemberCtrl',
			size: 'md',
			resolve: {
				items: function () {
					return {
						loader: $scope.loader,
						userfam: userfam,
						notification: $scope.notification,
						currUser: $scope.currUser,
						netWork: $scope.netWork,
						logout: $scope.logout
					}
				}
			}
		});

		modalInstance.result.then(function (res) {
			if (res.statusMessage) {
				$scope.notification(res.statusMessage);
				profile();
			} else {
				saveFamilyMemberInLocal(res, function () {
					if (res.id || res.tId) {
						$scope.notification("Hey you are in offline mode! Will update family member details successfully once you are online!");
					} else {
						$scope.notification("Hey you are in offline mode! Will added family member details successfully once you are online!");
					}
				});
			}
			$scope.dateOptions.dtpicker = {};
		}, function () {
			$scope.dateOptions.dtpicker = {};
		});
	};

	function saveFamilyMemberInLocal(res, cb) {
		$scope.getOfflineDataFromLocal('profile', function (data) {
			if (!data) data = {}
			if (!data.profile) data.profile = {};
			if (!data.profile.companyDetails) data.profile.companyDetails = {};
			if (!data.profile.companyDetails.getFamilymembers) data.profile.companyDetails.getFamilymembers = [];
			if (res.added) {
				delete res.added;
				res.tId = 'id' + data.profile.companyDetails.getFamilymembers.length;
				data.profile.companyDetails.getFamilymembers.push(res)
			} else {
				var family = data.profile.companyDetails.getFamilymembers;
				for (var i in family) {
					if (family[i].id == res.id || (family[i].tId == res.tId && res.tId)) {
						data.profile.companyDetails.getFamilymembers[i] = res;
					}
				}
			}
			$scope.addOfflineDataInLocal('profile', data, function () {
				$rootScope.safeApply(function () {
					request.setItem('localDataSubmitted', 'false');
					if (cb) cb();
					profile();
				})
			});
		});
	}

	$scope.userReferer = function (referrer) {
		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: 'static',
			templateUrl: 'pages/profile/myProfile/referenceForm.html',
			controller: 'referenceCtrl',
			size: 'md',
			resolve: {
				items: function () {
					return {
						loader: $scope.loader,
						referrer: referrer,
						notification: $scope.notification,
						currUser: $scope.currUser,
						netWork: $scope.netWork,
						logout: $scope.logout
					}
				}
			}
		});

		modalInstance.result.then(function (res) {
			if (res.statusMessage) {
				$scope.notification(res.statusMessage);
				profile();
			} else {
				saveRefererInLocal(res, function () {
					if (res.id || res.tempId) {
						$scope.notification("Hey you are in offline mode! Will update reference details successfully once you are online!");
					} else {
						$scope.notification("Hey you are in offline mode! Will added reference details successfully once you are online!");
					}
				});
			}
			$scope.dateOptions.dtpicker = {};
		}, function () {
			$scope.dateOptions.dtpicker = {};
		});
	};

	function saveRefererInLocal(res, cb) {
		$scope.getOfflineDataFromLocal('profile', function (data) {
			if (!data) data = {};
			if (!data.profile) data.profile = {};
			if (!data.profile.companyDetails) data.profile.companyDetails = {};
			if (!data.profile.companyDetails.getReferences) data.profile.companyDetails.getReferences = [];

			if (res.added) {
				delete res.added;
				res.tId = 'id' + data.profile.companyDetails.getReferences.length;
				data.profile.companyDetails.getReferences.push(res)
			} else {
				var references = data.profile.companyDetails.getReferences;
				for (var i in references) {
					if (references[i].id == res.id || (references[i].tId == res.tId && res.tId)) {
						data.profile.companyDetails.getReferences[i] = res;
					}
				}
			}
			$scope.addOfflineDataInLocal('profile', data, function () {
				$rootScope.safeApply(function () {
					request.setItem('localDataSubmitted', 'false');
					if (cb) cb();
					profile();
				})
			});
		});
	}


	$scope.user_deleteReferer = function (referrer, type) {


		$scope.referrer = referrer;
		$scope.type = type;

		var modalInstance = $uibModal.open({
			backdrop: 'static',
			templateUrl: 'user_deleteReferer.html',
			size: 'md',
			animation: true,
			keyboard: false,
			resolve: {
				items: function () {
					return {
						loader: $scope.loader,
						referrer: $scope.referrer,
						type: $scope.type,
						currUser: $scope.currUser,
						notification: $scope.notification,

					}
				}
			},
			controller: ['$scope', '$rootScope', 'request', 'items', '$uibModalInstance', function ($scope, $rootScope, request, items, $uibModalInstance) {
				$scope.type1 = items.type;
				$scope.referrer1 = items.referrer;
				$scope.currUser1 = items.currUser;
				$scope.loader = items.loader;
				$scope.notification = items.notification;


				$scope.yes_remove = function () {


					var userpro = {};
					userpro.userId = $scope.currUser1.userId;
					userpro.accessToken = $scope.currUser1.accessToken;
					userpro.objectId = $scope.referrer1.id;
					userpro.object = $scope.type1;

					$scope.loader(true);

					request.service('deleteProfileObject', 'post', userpro, function (res) {
						$scope.loader(false);
						if (res.statusCode == 200) {
							$scope.notification(res.statusMessage);
							profile(true);
							$uibModalInstance.close();

						} else if (res.dupLogin) {
							$scope.logout();
							$scope.notification(res.statusMessage);
							$uibModalInstance.close();
						} else {
							$scope.notification(res.statusMessage);
							$uibModalInstance.close();
						}
					});

				}

				$scope.no_remove = function () {
					$uibModalInstance.close();
				}




            }]
		});







		/*console.log(referrer); //id,"Reference",
		var userpro = {};
		userpro.userId = $scope.currUser.userId;
		userpro.accessToken = $scope.currUser.accessToken;
		userpro.objectId = referrer.id;
		userpro.object = type;

		$scope.loader(true);

		request.service('deleteProfileObject', 'post', userpro, function (res) {
			$scope.loader(false);
			if (res.statusCode == 200) {
				$scope.notification(res.statusMessage);
				profile(true);

			} else if (res.dupLogin) {
				$scope.logout();
				$scope.notification(res.statusMessage);
			} else {
				$scope.notification(res.statusMessage);
			}
		});*/


	}



	$scope.profile = profile;
	$scope.editprofile = editprofile;
})

/*pennaApp.controller('profileCtrl', ['$scope', '$rootScope', '$state', '$location', 'request', 'ctrlComm', '$uibModal', '$log', '$timeout', '$filter', 'mobile', profileCtrl]);*/
// pennaApp.directive('validFile', function () {
//     return {
//         require: 'ngModel',
//         link: function (scope, el, attrs, ngModel) {
//             el.bind('change', function () {
//                 scope.$apply(function () {
//                     ngModel.$setViewValue(el.val());
//                     ngModel.$render();
//                 });
//             });
//         }
//     }
// });
