(function () {
    var pennaApp = angular.module('pennaApp');
    pennaApp.controller('billingAddressCtrl', function ($scope, $rootScope, request, $state, $timeout, $uibModalInstance, $compile, ctrlComm, mobile, items) {
        $scope.loader = items.loader;
        $scope.notification = items.notification;
        $scope.currUser = items.currUser;
        $scope.netWork = items.netWork;
        $scope.logout = items.logout;
        $scope.getFromLocal = items.getFromLocal;
        $scope.usersprofileList = items.usersprofileList

        $scope.countries = ctrlComm.get('countries');
        var allStates = ctrlComm.get('states');
        var allCities = ctrlComm.get('cities');
        $scope.err = {};
        if (items.billadd) {

            if(items.billadd.mobileNumber && !isNaN(items.billadd.mobileNumber))
            items.billadd.mobileNumber = parseInt(items.billadd.mobileNumber);
            if(items.billadd.alternateMobileNumber && !isNaN(items.billadd.alternateMobileNumber))
            items.billadd.alternateMobileNumber = parseInt(items.billadd.alternateMobileNumber);
            $scope.billingAddrs = angular.copy(items.billadd);
            actualObj = angular.copy(items.billadd);

            $scope.states = request.getCountryStates(items.billadd.country);
            $scope.cities =  request.getStateCities(items.billadd.state);
        } else {
            $scope.billingAddrs = {};
            var actualObj = false;
            $scope.states = angular.copy(allStates)
            $scope.cities = angular.copy(allCities)
        }

        $scope.countrySelected = function(country){
            delete $scope.err.country;
            $scope.states = request.getCountryStates(country.value.split(':')[1])
            $scope.billingAddrs.city = undefined;
        }

        $scope.stateSelected = function(state){
            delete $scope.err.country;
            delete $scope.err.state;
            var sID = state.value.split(':')[1]
            $scope.cities = request.getStateCities(sID);
            $scope.billingAddrs.country = request.getStateCountry(sID);
        }

        $scope.citySelected = function(city){
            delete $scope.err.country;
            delete $scope.err.state;
            delete $scope.err.city;
            var cID = city.value.split(':')[1]
            $scope.billingAddrs.state = request.getCitiesState(cID);
            $scope.billingAddrs.country = request.getStateCountry($scope.billingAddrs.state);
            $scope.cities = request.getStateCities($scope.billingAddrs.state);
        }

        $scope.imageSelected = function () {
            var ele = document.getElementById('billingImg');
            var file = ele.files[0];
            var reader = new FileReader();
            reader.onload = function () {
            $rootScope.safeApply(function(){
                $scope.image = reader.result;
            });
            }
            reader.readAsDataURL(file);
        }

        $scope.mobileAttachUpload = function () {
            indicate(function (changeStatus) {
                if (changeStatus) {
                    $scope.err.image = false;
                    document.getElementById('billingImg').click();
                    mobile.chooseImage(function (img) {
                        $rootScope.safeApply(function(){
                            $scope.image = img;
                        });
                    });
                } else {
                    if($scope.err) delete $scope.err.false;
                    $scope.notification("No Changes in address");
                }
            });
        }

        $scope.save = function () {
            if ($scope.image) $scope.billingAddrs.image = $scope.image;
            validate(function () {
                indicate(function () {
                    if($scope.billingAddrs.added){
                        $scope.billingAddrs.type = 'Billing';
                        $scope.netWork(function (status) {
                            if (status) {
                                submitBillingAddress($scope.billingAddrs);
                            } else {
                                $uibModalInstance.close([$scope.billingAddrs]);
                            }
                        })
                    }else{
                        var changesMade = false;
                        for (var i in actualObj) {
                            if ($scope.billingAddrs[i] != actualObj[i]) {
                                changesMade = true;
                                break;
                            }
                        }
                        if (changesMade) {
                            $scope.billingAddrs.type = 'Billing';
                            $scope.netWork(function (status) {
                                if (status) {
                                    submitBillingAddress($scope.billingAddrs);
                                } else {
                                    $uibModalInstance.close([$scope.billingAddrs]);
                                }
                            })
                        } else {
                            $uibModalInstance.dismiss('cancel');
                        }
                    }
                })
            })
        };

        function indicate(cb) {
            if (actualObj) {
                if (actualObj.street1 != $scope.billingAddrs.street1) $scope.billingAddrs.indicator = 'T'
                if (actualObj.street2 != $scope.billingAddrs.street2) $scope.billingAddrs.indicator = 'T'
                if (actualObj.street3 != $scope.billingAddrs.street3) $scope.billingAddrs.indicator = 'T'
                if (actualObj.city != $scope.billingAddrs.city) $scope.billingAddrs.indicator = 'T'
                if (actualObj.state != $scope.billingAddrs.state) $scope.billingAddrs.indicator = 'T'
                if (actualObj.country != $scope.billingAddrs.country) $scope.billingAddrs.indicator = 'T'
                if (actualObj.pin != $scope.billingAddrs.pin) $scope.billingAddrs.indicator = 'T'
                if ($scope.billingAddrs.indicator) {
                    if (cb) cb(true)
                } else {
                    if (cb) cb(false)
                }
            } else {
                $scope.billingAddrs.indicator = 'T';
                $scope.billingAddrs.added = true;
                if (cb) cb(true)
            }
        }

        function submitBillingAddress(input) {
            $scope.billingAddrs.userId = $scope.currUser.userId;
            $scope.billingAddrs.accessToken = $scope.currUser.accessToken;
            $scope.billingAddrs.companyId = $scope.currUser.companyId;
            $scope.loader(true);
            request.service('addOrUpdateBillingAddress', 'post', input, function (res) {
                $scope.loader(false);
                if (res.statusCode == 200) {
                    $uibModalInstance.close([res, $scope.billingAddrs]);
                } else if (res.dupLogin) {
                    $scope.logout();
                    $scope.notification(res.statusMessage);
                }
            });
        }

        function validate(cb) {
            if (!$scope.billingAddrs.street1) { $scope.err.street1 = true; } else { delete $scope.err.street1; }
            if (!$scope.billingAddrs.street2) { $scope.err.street2 = true; } else { delete $scope.err.street2; }
            if (!$scope.billingAddrs.street3) { $scope.err.street3 = true; } else { delete $scope.err.street3; }
            if (!$scope.billingAddrs.city) { $scope.err.city = true; } else { delete $scope.err.city; }
            if (!$scope.billingAddrs.state) { $scope.err.state = true; } else { delete $scope.err.state; }
            if (!$scope.billingAddrs.country) { $scope.err.country = true; } else { delete $scope.err.country; }
            if (!$scope.billingAddrs.email) { $scope.err.email = true; } else { delete $scope.err.email; }
            if (!$scope.billingAddrs.mobileNumber) { $scope.err.mobileNumber = true; } else { delete $scope.err.mobileNumber; }
            if ($scope.billingAddrs.mobileNumber && $scope.billingAddrs.mobileNumber.toString().length != 10) { $scope.err.mobileNumberLength = true; } else { delete $scope.err.mobileNumberLength; }
            // if (!$scope.billingAddrs.alternateMobileNumber) { $scope.err.alternateMobileNumber = true; } else { delete $scope.err.alternateMobileNumber; }
            delete $scope.err.alternateMobileNumber;
            delete $scope.err.alternateMobileNumberLength;
            if (!$scope.billingAddrs.alternateMobileNumber) $scope.billingAddrs.alternateMobileNumber = "";
            if ($scope.billingAddrs.alternateMobileNumber && $scope.billingAddrs.alternateMobileNumber.toString().length != 10) { $scope.err.alternateMobileNumberLength = true; } else { delete $scope.err.alternateMobileNumberLength; }

            indicate(function () {
                if ($scope.billingAddrs.indicator) {
                    if (!$scope.image) {
                        $scope.err.image = true;
                    } else {
                        delete $scope.err.image;
                    }
                } else {
                    delete $scope.err.image;
                }
            })

            if (Object.keys($scope.err).length == 0) {
                if (cb) cb();
            } else {
                $scope.notification("Some fields are missing.")
            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        var street1 = '';
        $scope.$watch('billingAddrs.street1', function (val) {
            if (val) {
                if (val.length > 30) {
                    $scope.billingAddrs.street1 = street1;
                } else {
                    street1 = val;
                }
            };
        });
        var street2 = '';
        $scope.$watch('billingAddrs.street2', function (val) {
            if (val) {
                if (val.length > 30) {
                    $scope.billingAddrs.street2 = street2;
                } else {
                    street2 = val;
                }
            };
        });
        var street3 = '';
        $scope.$watch('billingAddrs.street3', function (val) {
            if (val) {
                if (val.length > 30) {
                    $scope.billingAddrs.street3 = street3;
                } else {
                    street3 = val;
                }
            };
        });

        var state = '';
        $scope.$watch('billingAddrs.state', function (val) {
            if (val == 0) {
                $scope.billingAddrs.state = '';
            }
            if (val && val.length) {
                if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 30) {
                    if (val.length != 1) {
                        $scope.billingAddrs.state = state;
                    } else {
                        $scope.billingAddrs.state = '';
                    }
                } else {
                    state = val;
                }
            }
        });

        var email = '';
        $scope.$watch('billingAddrs.email', function (val) {
            if (val) {
                if (val.length > 40) {
                    $scope.billingAddrs.email = email;
                } else {
                    email = val;
                }
            };
        });

        var bMobile = '';
        $scope.$watch('billingAddrs.mobileNumber', function (val) {
            if (val == 0) {
                $scope.billingAddrs.mobileNumber = '';
            }
            if (val) {
                if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
                    if (val.toString().length != 1) {
                        $scope.billingAddrs.mobileNumber = bMobile;
                    } else {
                        $scope.billingAddrs.mobileNumber = '';
                    }
                } else {
                    bMobile = val;
                }
            }
        });

        var bAltrMobile = '';
        $scope.$watch('billingAddrs.alternateMobileNumber', function (val) {
            if (val == 0) {
                $scope.billingAddrs.alternateMobileNumber = '';
            }
            if (val) {
                if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
                    if (val.toString().length != 1) {
                        $scope.billingAddrs.alternateMobileNumber = bAltrMobile;
                    } else {
                        $scope.billingAddrs.alternateMobileNumber = '';
                    }
                } else {
                    bAltrMobile = val;
                }
            }
        });

    });
}());
