// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('pennaApp').controller('addProfileDataCtrl', function ($scope, $state, request, ctrlComm, $uibModalInstance, items, $filter) {

    $scope.dateOptions = ctrlComm.get('dateOptions');
    $scope.marital = [{name:'Married'},{name:'Unmarried'}];
    $scope.cities = ctrlComm.get('cities');

    $scope.userfam = {};
    $scope.userpro = {};
    $scope.billadd = {};
    $scope.err = {};

    $scope.savefamily = function () {
        validatefamily(function () {
            $scope.userfam.indicator = 'T'
            ctrlComm.put('addedfamilyMember',$scope.userfam);
            $uibModalInstance.close();
        });
    }

    function validatefamily(cb) {
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


    $scope.savepartner = function () {
        validatepatner(function () {
            $scope.userpro.indicator = 'T'
            ctrlComm.put('addedPartner',$scope.userpro);
            $uibModalInstance.close();
        });
    }
    function validatepatner(cb) {
        if (!$scope.userpro.name) { $scope.err.name = true; } else { delete $scope.err.name; }
        if (!$scope.userpro.mobileNumber) { $scope.err.mobileNumber = true; } else { delete $scope.err.mobileNumber; }
        if (!$scope.userpro.alternateNumber) { $scope.err.alternateNumber = true; } else { delete $scope.err.alternateNumber; }
        if (!$scope.userpro.email) { $scope.err.email = true; } else { delete $scope.err.email; }
        if (Object.keys($scope.err).length == 0) {
            if (cb) cb();
        }
    }


    $scope.addbill = function () {
        validatebilling(function () {
            $scope.billadd.email = null,
            $scope.billadd.mobileNumber = null,
            $scope.billadd.district = null,
            $scope.billadd.image = null,
            $scope.billadd.alternateMobileNumber = null,
            $scope.billadd.indicator = 'T'
            $scope.billadd.type = 'Billing';
            ctrlComm.put('addedBillAddrs',$scope.billadd);
            $uibModalInstance.close();
        });
    }


    function validatebilling(cb) {
        if (!$scope.billadd.street1) { $scope.err.street1 = true; } else { delete $scope.err.street1; }
        if (!$scope.billadd.street2) { $scope.err.street2 = true; } else { delete $scope.err.street2; }
        if (!$scope.billadd.street3) { $scope.err.street3 = true; } else { delete $scope.err.street3; }
        if (!$scope.billadd.city) { $scope.err.city = true; } else { delete $scope.err.city; }
        if (!$scope.billadd.state) { $scope.err.state = true; } else { delete $scope.err.state; }

        if (Object.keys($scope.err).length == 0) {
            if (cb) cb();
        }
    }

    $scope.cancel1 = function () {
        $uibModalInstance.dismiss('cancel1');
    };

});
