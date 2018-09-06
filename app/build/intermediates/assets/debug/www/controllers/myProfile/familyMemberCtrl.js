(function(){
	var pennaApp = angular.module('pennaApp');
	pennaApp.controller('familyMemberCtrl', function ($scope, request, $state, $timeout, $uibModalInstance , $compile, ctrlComm, mobile , items, $filter) {


		if(items.userfam){
			$scope.userfam = angular.copy(items.userfam);
			actualObj = angular.copy(items.userfam);
		}else{
			$scope.userfam = {};
			var actualObj = false;
		}

		$scope.loader = items.loader;
		$scope.notification = items.notification;
		$scope.currUser = items.currUser;
		$scope.netWork = items.netWork;
		$scope.logout = items.logout;
		$scope.err = {};
		$scope.cities = ctrlComm.get('cities');

    	$scope.dateOptions = ctrlComm.get('dateOptions');

        $scope.marital = [{
            name: 'Married'
        }, {
            name: 'Unmarried'
        }];

		$scope.mobileAttachUpload = function(){
			mobile.chooseImage(function(img){
				$scope.image = img;
			});
		}

		$scope.save = function(){
			validate(function(){
				indicate(function(){
					if($scope.userfam.indicator){
						$scope.netWork(function (status) {
							if (status) {
								submitFamilyMember($scope.userfam);
							}else{
								if($scope.userfam.dateOfBirth) $scope.userfam.dateOfBirth = new Date($scope.userfam.dateOfBirth).getTime();
								if($scope.userfam.anniversary) $scope.userfam.anniversary = new Date($scope.userfam.anniversary).getTime();
								$uibModalInstance.close($scope.userfam);
							}
						})
					}else{
						$uibModalInstance.dismiss('cancel');
					}
				})
			})
		};

		function indicate(cb){
			if(actualObj){
				var t = 0;
				for(var i in actualObj){
					t++;
					if(actualObj[i]!=$scope.userfam[i]){
						$scope.userfam.indicator = 'T';
					}
					if(Object.keys(actualObj).length == t){
						if(cb)cb()
					}
				}
			}else{
				$scope.userfam.indicator = 'T';
				$scope.userfam.added = true;
				if(cb)cb()
			}
		}
		function submitFamilyMember(userfam){
			input = angular.copy(userfam)
			$scope.loader(true);
			input.userId = $scope.currUser.userId;
			input.accessToken = $scope.currUser.accessToken;
			input.companyId = $scope.currUser.companyId;
            input.dateOfBirth = $filter('dateFormatFilter')(input.dateOfBirth);
            if (input.anniversary) {
                input.anniversary = $filter('dateFormatFilter')(input.anniversary);
            }else{
                input.anniversary = "";
            }

			request.service('addOrUpdateFamily', 'post', input, function (res) {
				$scope.loader(false);
				if (res.statusCode == 200) {
					$uibModalInstance.close(res);
				} else if (res.dupLogin) {
					$scope.logout();
					$scope.notification(res.statusMessage);
				}
			});
		}

		function validate(cb){
			if (!$scope.userfam.maritalStatus) { $scope.err.maritalStatus = true; } else { delete $scope.err.maritalStatus; }
			if($scope.userfam.maritalStatus == 'Married' ){
				if (!$scope.userfam.anniversary) { $scope.err.anniversary = true; } else { delete $scope.err.anniversary; }
			}else{
				$scope.userfam.anniversary = "";
				delete $scope.err.anniversary;
			}
			if (!$scope.userfam.familyName) { $scope.err.familyName = true; } else { delete $scope.err.familyName; }
			if (!$scope.userfam.relation) { $scope.err.relation = true; } else { delete $scope.err.relation; }
			if (!$scope.userfam.dateOfBirth) { $scope.err.dateOfBirth = true; } else { delete $scope.err.dateOfBirth; }
			if (Object.keys($scope.err).length == 0) {
				if (cb) cb();
			}
		}

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		var familyName = '';
		$scope.$watch('userfam.familyName',function(val){
			if(val == 0){ $scope.userfam.familyName = ''; }
			if(val && val.length){
				if(!val.match(/^[a-zA-Z\s]*$/) || val.length>30){
					if(val.length != 1){ $scope.userfam.familyName = familyName;
					}else{ $scope.userfam.familyName = '';
					}
				}else{
					familyName = val;
				}
			}
		});


		var relation = '';
		$scope.$watch('userfam.relation',function(val){
			if(val == 0){ $scope.userfam.relation = ''; }
			if(val && val.length){
				if(!val.match(/^[a-zA-Z\s]*$/) || val.length>20){
					if(val.length != 1){ $scope.userfam.relation = relation;
					}else{ $scope.userfam.relation = '';
					}
				}else{
					relation = val;
				}
			}
		});




	});
}());

