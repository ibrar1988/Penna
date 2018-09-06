(function () {
    var pennaApp = angular.module('pennaApp');
    pennaApp.controller('individualPartnerCtrl', function ($scope, request, $state, $timeout, $uibModalInstance, $compile, ctrlComm, mobile, items) {

        $scope.typeOfPartners = [
            {
                val: 'Partner',
                name: 'Partner'
            },
            {
                val: 'Individual',
                name: 'Individual'
            },
           /* {
                val: 'sales',
                name: 'Sales'
            },
            {
                val: 'operations',
                name: 'Operations'
            }*/
        ]

        if (items.userpro) {
            items.userpro.update = true;
            items.userpro.mobileNumber = parseInt(items.userpro.mobileNumber);
            items.userpro.alternateNumber = parseInt(items.userpro.alternateNumber);
            $scope.userpro = angular.copy(items.userpro);
            actualObj = angular.copy(items.userpro);
        } else {
            $scope.userpro = {};
            var actualObj = false;
        }

        $scope.loader = items.loader;
        $scope.notification = items.notification;
        $scope.currUser = items.currUser;
        $scope.netWork = items.netWork;
        $scope.logout = items.logout;
        $scope.err = {};

        $scope.save = function () {
            validate(function () {
                indicate(function () {
                    if ($scope.userpro.indicator) {
                        $scope.netWork(function (status) {
                            if (status) {
                                submitPartner($scope.userpro);
                            } else {
                                $uibModalInstance.close($scope.userpro);
                            }
                        })
                    } else {
                        $uibModalInstance.dismiss('cancel');
                    }
                })
            })
        };

        function indicate(cb) {
            if (actualObj) {
                var t = 0;
                for (var i in actualObj) {
                    t++;
                    if (actualObj[i] != $scope.userpro[i]) {
                        $scope.userpro.indicator = 'T';
                    }
                    if (Object.keys(actualObj).length == t) {
                        if (cb) cb()
                    }
                }
            } else {
                $scope.userpro.indicator = 'T';
                $scope.userpro.added = true;
                if (cb) cb()
            }
        }

        function submitPartner() {
            $scope.loader(true);
            $scope.userpro.userId = $scope.currUser.userId;
            $scope.userpro.accessToken = $scope.currUser.accessToken;
            $scope.userpro.companyId = $scope.currUser.companyId;
            request.service('addOrUpdatePartner', 'post', $scope.userpro, function (res) {
                $scope.loader(false);
                if (res.statusCode == 200) {
                    $uibModalInstance.close(res);
                } else if (res.dupLogin) {
                    $scope.logout();
                    $scope.notification(res.statusMessage);
                }
            });
        }

        function validate(cb) {

            if (!$scope.userpro.name) {
                $scope.err.name = true;
            } else {
                delete $scope.err.name;
            }
            if (!$scope.userpro.mobileNumber) {
                $scope.err.mobileNumber = true;
            } else {
                delete $scope.err.mobileNumber;
            }
            if ($scope.userpro.mobileNumber && $scope.userpro.mobileNumber.toString().length != 10) {
                $scope.err.mobileNumberLength = true;
            } else {
                delete $scope.err.mobileNumberLength;
            }
            if (!$scope.userpro.alternateNumber) {
                $scope.err.alternateNumber = true;
            } else {
                delete $scope.err.alternateNumber;
            }
            if ($scope.userpro.alternateNumber && $scope.userpro.alternateNumber.toString().length != 10) {
                $scope.err.alternateMobileNumberLength = true;
            } else {
                delete $scope.err.alternateMobileNumberLength;
            }
            if (!$scope.userpro.email) {
                $scope.err.email = true;
            } else {
                delete $scope.err.email;
            }
            if (!$scope.userpro.userRole) {
                $scope.err.userRole = true;
            } else {
                delete $scope.err.userRole;
            }
            if (!$scope.userpro.address) {
                $scope.err.address = true;
            } else {
                delete $scope.err.address;
            }


            if (Object.keys($scope.err).length == 0) {
                if (cb) cb();
            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        var name = '';
        $scope.$watch('userpro.name', function (val) {
            if (val == 0) {
                $scope.userpro.name = '';
            }
            if (val && val.length) {
                if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 30) {
                    if (val.length != 1) {
                        $scope.userpro.name = name;
                    } else {
                        $scope.userpro.name = '';
                    }
                } else {
                    name = val;
                }
            }
        });

        var mobileNumber = '';
        $scope.$watch('userpro.mobileNumber', function (val) {
            if (val == 0) {
                $scope.userpro.mobileNumber = '';
            }
            if (val) {
                if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
                    if (val.toString().length != 1) {
                        $scope.userpro.mobileNumber = mobileNumber;
                    } else {
                        $scope.userpro.mobileNumber = '';
                    }
                } else {
                    mobileNumber = val;
                }
            }
        });

        var alternateNumber = '';
        $scope.$watch('userpro.alternateNumber', function (val) {
            if (val == 0) {
                $scope.userpro.alternateNumber = '';
            }
            if (val) {
                if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
                    if (val.toString().length != 1) {
                        $scope.userpro.alternateNumber = alternateNumber;
                    } else {
                        $scope.userpro.alternateNumber = '';
                    }
                } else {
                    alternateNumber = val;
                }
            }
        });

        var email = '';
        $scope.$watch('userpro.email', function (val) {
            if (val) {
                if (val.length > 40) {
                    $scope.userpro.email = email;
                } else {
                    email = val;
                }
            };
        });


        var address = '';
        $scope.$watch('userpro.address', function (val) {
            if (val) {
                if (val.length > 100) {
                    $scope.userpro.address = address;
                } else {
                    address = val;
                }
            };
        });


    });
}());
