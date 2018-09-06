pennaApp.controller('createuser', function ($scope, request, $state) {

    $scope.err = {};
    $scope.register = {};

    function validateRegistration(cb){
        if(!$scope.register.userName){ $scope.err.userName = true; }else{ delete $scope.err.userName; }
        if(!$scope.register.email){ $scope.err.email = true; }else{ delete $scope.err.email; }
        if(!$scope.register.mobileNumber){ $scope.err.mobileNumber = true; }else{ delete $scope.err.mobileNumber; }
        if($scope.register.mobileNumber && $scope.register.mobileNumber.toString().length!=10) { $scope.err.mobileNumberLength = true; } else { delete $scope.err.mobileNumberLength; }
        if(!$scope.register.password){ $scope.err.password = true; }else{ delete $scope.err.password; }
        if(!$scope.register.conformPass){ $scope.err.conformPass = true; }else{ delete $scope.err.conformPass; }

        if(Object.keys($scope.err).length == 0){
            if(cb)cb();
        }
    }        

    $scope.reguser = function (register) {
        validateRegistration(function(){
            if (angular.equals(register.password, register.conformPass)) {
                request.service('userSignUp', 'post', register, function (res) {
                    if (res.statusCode == "200") {
                        $scope.notification(res.statusMessage);
                        $state.go('login', null, {
                            reload: true
                        });
                    } else {
                        $scope.notification(res.statusMessage,4000,'danger');
                    }
                });
            }
        })
    }

});