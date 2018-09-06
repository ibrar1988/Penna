(function (angular) {
    'use strict';
    
    angular
            .module('pennaApp')
            .controller('ChangePasswordController', changePasswordController);
    changePasswordController.$inject = [
        '$scope',
        'request',
        '$state',
        '$rootScope'
    ];

    function changePasswordController(
            $scope,
            request,
            $state,
            $rootScope) {
        $scope.user = {
            oldPassword: '',
            newPassword: '',
            rePassword: ''
        };
        $scope.$watch("user.rePassword", function (newValue, oldValue) {
            if (newValue == $scope.user.newPassword) {
                $scope.isMatch = false;
            } else {
                $scope.isMatch = true;
            }
        });
        $scope.changePassword = function () {
            var data = {
                accessToken: $scope.currUser.accessToken,
                companyId: $scope.currUser.companyId,
                userId: $scope.currUser.userId,
                oldPassword: $scope.user.oldPassword,
                newPassword: $scope.user.newPassword,
                changePassword: $scope.user.rePassword
            };

            if ($rootScope.online) {
                if ($scope.user.newPassword == $scope.user.rePassword) {
                    if ($scope.user.newPassword !== $scope.user.oldPassword) {
                        request.service('changePassword', 'post', data, function (res) {
                            if (res.statusCode == 200) {
                                $scope.notification(res.statusMessage, 4000, 'success');
                                $state.go('dashboard');
                            }
                            if (res.statusCode == 501) {
                                $scope.notification(res.statusMessage, 4000, 'danger');
                            }
                        });
                    } else {
                        $scope.notification('Old password & New password can\'t be same!', 4000, 'danger');
                    }
                } else {
                    $scope.notification('New password & Confirm password do not match!', 4000, 'danger');
                }
            } else {
                $scope.notification('Hey you are in offline mode.please connect to network to change password', 4000, 'info');
            }
        };


    }
})(window.angular);
