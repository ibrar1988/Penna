(function (angular) {
    'use strict';

    angular
            .module('pennaApp')
            .controller('forgetpass', forgotPasswordController);
    forgotPasswordController.$inject = [
        '$scope',
        '$state',
        'request',
        '$http'
    ];

    function forgotPasswordController(
            $scope,
            $state,
            request,
            $http) {



        $scope.sendmail = function (user) {
            request.service('forgotPassword', 'post', user, function (data) {
                if (data.statusCode == 200) {
                    $scope.notification(data.statusMessage, 10000, 'success');
                    $state.go('login');
                } else {
                    $scope.notification(data.statusMessage, 10000, 'danger');
                }
            });
        }
    }
})(window.angular);
