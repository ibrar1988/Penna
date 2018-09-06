angular.module('pennaApp').controller('depositctrl', function ($scope, $rootScope, $uibModal, $log, request) {

    function getSecurityDeposit() {
        $scope.loader(true);
        request.service('getSecurityDeposit', 'post', $scope.currUser, function (res) {
            $scope.loader(false);
            if (res.statusCode == 200) {
                $scope.securitydep = res;
                if ($scope.ifMobile)
                    $scope.addOfflineDataInLocal('secDeposite', $scope.securitydep);
            } else if (res.dupLogin) {
                $scope.logout();
                $scope.notification(res.statusMessage);
            }
        });
    }

    $scope.netWork(function (status) {
        if (status) {
            getSecurityDeposit();
        } else if ($scope.ifMobile) {
            $scope.getOfflineDataFromLocal('secDeposite', function (data) {
                if (data) {
                    $rootScope.safeApply(function () {
                        $scope.securitydep = data;
                    });
                } else {
                    $scope.securitydep = {
                        depositAmt: 0
                    };
                }
            });
        } else {
            $scope.securitydep = {
                depositAmt: 0
            };
        }
    });
});
