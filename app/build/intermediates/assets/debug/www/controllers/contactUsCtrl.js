angular.module('pennaApp').controller('contactUsCtrl', function ($scope, $rootScope, $uibModal, $log, $state, $window, ctrlComm, request) {

	if (localStorage.getItem('device_version') != undefined || localStorage.getItem('device_version') != null || localStorage.getItem('device_version') != '' || !localStorage.getItem('device_version')) {
		$rootScope.version = localStorage.getItem('device_version');
	}

	$scope.contactus = function () {


		var selRepInfo = {
			accessToken: $scope.currUser.accessToken,
			companyId: $scope.currUser.companyId,
			userId: $scope.currUser.userId
		};
		request.service('getSalesRepInfo', 'post', selRepInfo, function (data) {
			if (data.statusCode == 200) {

				$scope.salesRepName = data.salesRepName;
				$scope.salesRepEmail = data.salesRepEmail;
				$scope.salesRepNumber = data.salesRepNumber;

				$scope.mailLink = "mailto:caresupport@pennacement.com" + "?subject=From CareApp" + '-' + data.state + '-' + data.cnumber + '-' + data.cname.replace('&',' and ') + '&cc=' + data.salesRepEmail.replace('&',' and ');
			} else {
				$scope.notification(data.statusMessage, 10000, 'danger');
			}
		});

	}

	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {
		$scope.ifMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android|webOS|IEMobile|Opera Mini)/);
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android|webOS|IEMobile|Opera Mini)/)) {
			$scope.email_send = function (data) {
				alert($scope.salesRepEmail)

				cordova.plugins.email.open({
					to: 'max@mustermann.de',
					cc: 'erika@mustermann.de',
					bcc: ['john@doe.com', 'jane@doe.com'],
					subject: 'Greetings',
					body: 'How are you? Nice greetings from Leipzig'
				});


			}
		}
	}





	$scope.contactus();


});
