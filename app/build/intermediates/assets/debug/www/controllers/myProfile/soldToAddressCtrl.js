(function () {
    var pennaApp = angular.module('pennaApp');
    pennaApp.controller('soldToAddressCtrl', function ($scope, $rootScope, request, $state, $timeout, $uibModalInstance, $compile, ctrlComm, mobile, items) {
        $scope.loader = items.loader;
        $scope.notification = items.notification;
        $scope.currUser = items.currUser;
        $scope.netWork = items.netWork;
        $scope.logout = items.logout;
        $scope.getFromLocal = items.getFromLocal;
        $scope.usersprofileList = items.usersprofileList
        $scope.countries = ctrlComm.get('countries');
        if (items.soldadd) {
            if (items.soldadd.pin && !isNaN(items.soldadd.pin))
                items.soldadd.pin = parseInt(items.soldadd.pin);
            if (items.soldadd.mobileNumber && !isNaN(items.soldadd.mobileNumber))
                items.soldadd.mobileNumber = parseInt(items.soldadd.mobileNumber);
            if (items.soldadd.alternateMobileNumber && !isNaN(items.soldadd.alternateMobileNumber))
                items.soldadd.alternateMobileNumber = parseInt(items.soldadd.alternateMobileNumber);
            $scope.soldToaddrs = angular.copy(items.soldadd);
            actualObj = angular.copy(items.soldadd);
            $scope.states = request.getCountryStates(items.soldadd.country);
            if (!$scope.states.length) $scope.states = ctrlComm.get('states');
            $scope.cities = request.getStateCities(items.soldadd.state);
            if (!$scope.cities.length) $scope.cities = ctrlComm.get('cities');
        } else {
            $scope.soldToaddrs = {};
            var actualObj = false;
            $scope.states = angular.copy(allStates)
            $scope.cities = angular.copy(allCities)
        }
        $scope.err = {};

        // $scope.cities = ctrlComm.get('cities');

        // if(!$scope.cities){
        // 	$scope.getFromLocal('retrieveCity',function(cities){
        // 		$scope.cities = cities;
        // 		ctrlComm.put('cities', $scope.cities);
        // 		if(cb)cb();
        // 	})
        // }

        $scope.countrySelected = function (country) {
            delete $scope.err.country;
            $scope.states = request.getCountryStates(country.value.split(':')[1])
            $scope.soldToaddrs.city = undefined;
        }

        $scope.stateSelected = function (state) {
            delete $scope.err.country;
            delete $scope.err.state;
            var sID = state.value.split(':')[1]
            $scope.cities = request.getStateCities(sID);
            $scope.soldToaddrs.country = request.getStateCountry(sID);
        }

        $scope.citySelected = function (city) {
            delete $scope.err.country;
            delete $scope.err.state;
            delete $scope.err.city;
            var cID = city.value.split(':')[1]
            $scope.soldToaddrs.state = request.getCitiesState(cID);
            $scope.soldToaddrs.country = request.getStateCountry($scope.soldToaddrs.state);
        }

        $scope.imageSelected = function () {
            var ele = document.getElementById('soldToAddrsImg');
            var file = ele.files[0];
            var reader = new FileReader();
            reader.onload = function () {
                $rootScope.safeApply(function () {
                    $scope.image = reader.result;
                });
            }
            reader.readAsDataURL(file);
        }

        $scope.mobileAttachUpload = function () {
            indicate(function (changeStatus) {
                if (changeStatus) {
                    $scope.err.image = false;
                    document.getElementById('soldToAddrsImg').click();
                    mobile.chooseImage(function (img) {
                        $rootScope.safeApply(function () {
                            $scope.image = img;
                        });
                    });
                } else {
                    if ($scope.err) delete $scope.err.false;
                    $scope.notification("No Changes in address");
                }
            });
        }

        $scope.save = function () {
            if ($scope.image) $scope.soldToaddrs.image = $scope.image;
            validate(function () {
                indicate(function () {
                    var changesMade = false;
                    for (var i in actualObj) {
                        if ($scope.soldToaddrs[i] != actualObj[i]) {
                            changesMade = true;
                            break;
                        }
                    }
                    if (changesMade) {
                        $scope.soldToaddrs.type = 'Sold';
                        $scope.netWork(function (status) {
                            if (status) {
                                submitSoldToAddress($scope.soldToaddrs);
                            } else {
                                $uibModalInstance.close([$scope.soldToaddrs]);
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
                if (actualObj.street1 != $scope.soldToaddrs.street1) $scope.soldToaddrs.indicator = 'T'
                if (actualObj.street2 != $scope.soldToaddrs.street2) $scope.soldToaddrs.indicator = 'T'
                if (actualObj.street3 != $scope.soldToaddrs.street3) $scope.soldToaddrs.indicator = 'T'
                if (actualObj.taluk != $scope.soldToaddrs.taluk) $scope.soldToaddrs.indicator = 'T'
                if (actualObj.city != $scope.soldToaddrs.city) $scope.soldToaddrs.indicator = 'T'
                if (actualObj.district != $scope.soldToaddrs.district) $scope.soldToaddrs.indicator = 'T'
                if (actualObj.state != $scope.soldToaddrs.state) $scope.soldToaddrs.indicator = 'T'
                if (actualObj.country != $scope.soldToaddrs.country) $scope.soldToaddrs.indicator = 'T'
                if (actualObj.pin != $scope.soldToaddrs.pin) $scope.soldToaddrs.indicator = 'T'
                if ($scope.soldToaddrs.indicator) {
                    if (cb) cb(true)
                } else {
                    if (cb) cb(false)
                }
            } else {
                $scope.soldToaddrs.indicator = 'T';
                $scope.soldToaddrs.added = true;
                if (cb) cb(true)
            }
        }

        function submitSoldToAddress() {
            $scope.soldToaddrs.userId = $scope.currUser.userId;
            $scope.soldToaddrs.accessToken = $scope.currUser.accessToken;
            $scope.soldToaddrs.companyId = $scope.currUser.companyId;
            $scope.loader(true);
            request.service('addOrUpdateSoldAddress', 'post', $scope.soldToaddrs, function (res) {
                $scope.loader(false);
                if (res.statusCode == 200) {
                    $uibModalInstance.close([res, $scope.soldToaddrs]);
                } else if (res.dupLogin) {
                    $scope.logout();
                    $scope.notification(res.statusMessage);
                }
            });
        }

        function validate(cb) {
            if (!$scope.soldToaddrs.street1) {
                $scope.err.street1 = true;
            } else {
                delete $scope.err.street1;
            }
            /*if(!$scope.soldToaddrs.street2) { $scope.err.street2 = true; } else { delete $scope.err.street2; }
            if(!$scope.soldToaddrs.street3) { $scope.err.street3 = true; } else { delete $scope.err.street3; }*/
            // if(!$scope.soldToaddrs.taluk) { $scope.err.taluk = true; } else { delete $scope.err.taluk; }
            delete $scope.err.taluk
            if (!$scope.soldToaddrs.taluk) $scope.soldToaddrs.taluk = "";
            if (!$scope.soldToaddrs.city) {
                $scope.err.city = true;
            } else {
                delete $scope.err.city;
            }
            if (!$scope.soldToaddrs.district) {
                $scope.err.district = true;
            } else {
                delete $scope.err.district;
            }
            if (!$scope.soldToaddrs.state) {
                $scope.err.state = true;
            } else {
                delete $scope.err.state;
            }
            if (!$scope.soldToaddrs.country) {
                $scope.err.country = true;
            } else {
                delete $scope.err.country;
            }
            if (!$scope.soldToaddrs.pin) {
                $scope.err.pin = true;
            } else {
                delete $scope.err.pin;
            }
            if (!$scope.soldToaddrs.email) {
                $scope.err.email = true;
            } else {
                delete $scope.err.email;
            }
            if (!$scope.soldToaddrs.mobileNumber) {
                $scope.err.mobileNumber = true;
            } else {
                delete $scope.err.mobileNumber;
            }
            if ($scope.soldToaddrs.mobileNumber && $scope.soldToaddrs.mobileNumber.toString().length != 10) {
                $scope.err.mobileNumberLength = true;
            } else {
                delete $scope.err.mobileNumberLength;
            }
            // if(!$scope.soldToaddrs.alternateMobileNumber) { $scope.err.alternateMobileNumber = true; } else { delete $scope.err.alternateMobileNumber; }
            delete $scope.err.alternateMobileNumber;
            delete $scope.err.alternateMobileNumberLength;
            if (!$scope.soldToaddrs.alternateMobileNumber) $scope.soldToaddrs.alternateMobileNumber = "";
            if ($scope.soldToaddrs.alternateMobileNumber && $scope.soldToaddrs.alternateMobileNumber.toString().length != 10) {
                $scope.err.alternateMobileNumberLength = true;
            } else {
                delete $scope.err.alternateMobileNumberLength;
            }

            indicate(function () {
                if ($scope.soldToaddrs.indicator) {
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
        $scope.$watch('soldToaddrs.street1', function (val) {
            if (val) {
                if (val.length > 150) {
                    $scope.soldToaddrs.street1 = street1;
                } else {
                    street1 = val;
                }
            };
        });
        var street2 = '';
        $scope.$watch('soldToaddrs.street2', function (val) {
            if (val) {
                if (val.length > 30) {
                    $scope.soldToaddrs.street2 = street2;
                } else {
                    street2 = val;
                }
            };
        });
        var street3 = '';
        $scope.$watch('soldToaddrs.street3', function (val) {
            if (val) {
                if (val.length > 30) {
                    $scope.soldToaddrs.street3 = street3;
                } else {
                    street3 = val;
                }
            };
        });

        var taluk = '';
        $scope.$watch('soldToaddrs.taluk', function (val) {
            if (val == 0) {
                $scope.soldToaddrs.taluk = '';
            }
            if (val && val.length) {
                if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 20) {
                    if (val.length != 1) {
                        $scope.soldToaddrs.taluk = taluk;
                    } else {
                        $scope.soldToaddrs.taluk = '';
                    }
                } else {
                    taluk = val;
                }
            }
        });

        var district = '';
        $scope.$watch('soldToaddrs.district', function (val) {
            if (val == 0) {
                $scope.soldToaddrs.district = '';
            }
            if (val && val.length) {
                if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 20) {
                    if (val.length != 1) {
                        $scope.soldToaddrs.district = district;
                    } else {
                        $scope.soldToaddrs.district = '';
                    }
                } else {
                    district = val;
                }
            }
        });

        var state = '';
        $scope.$watch('soldToaddrs.state', function (val) {
            if (val == 0) {
                $scope.soldToaddrs.state = '';
            }
            if (val && val.length) {
                if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 30) {
                    if (val.length != 1) {
                        $scope.soldToaddrs.state = state;
                    } else {
                        $scope.soldToaddrs.state = '';
                    }
                } else {
                    state = val;
                }
            }
        });

        var pin = '';
        $scope.$watch('soldToaddrs.pin', function (val) {
            if (val == 0) {
                $scope.soldToaddrs.pin = '';
            }
            if (val) {
                if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 6) {
                    if (val.length != 1) {
                        $scope.soldToaddrs.pin = pin;
                    } else {
                        $scope.soldToaddrs.pin = '';
                    }
                } else {
                    pin = val;
                }
            }
        });

        var email = '';
        $scope.$watch('soldToaddrs.email', function (val) {
            if (val) {
                if (val.length > 40) {
                    $scope.soldToaddrs.email = email;
                } else {
                    email = val;
                }
            };
        });

        var mobileNumber = '';
        $scope.$watch('soldToaddrs.mobileNumber', function (val) {
            if (val == 0) {
                $scope.soldToaddrs.mobileNumber = '';
            }
            if (val) {
                if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
                    if (val.toString().length != 1) {
                        $scope.soldToaddrs.mobileNumber = mobileNumber;
                    } else {
                        $scope.soldToaddrs.mobileNumber = '';
                    }
                } else {
                    mobileNumber = val;
                }
            }
        });

        var alternateMobileNumber = '';
        $scope.$watch('soldToaddrs.alternateMobileNumber', function (val) {
            if (val == 0) {
                $scope.soldToaddrs.alternateMobileNumber = '';
            }
            if (val) {
                if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
                    if (val.toString().length != 1) {
                        $scope.soldToaddrs.alternateMobileNumber = alternateMobileNumber;
                    } else {
                        $scope.soldToaddrs.alternateMobileNumber = '';
                    }
                } else {
                    alternateMobileNumber = val;
                }
            }
        });




    });
}());
