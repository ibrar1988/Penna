(function () {
	var pennaApp = angular.module('pennaApp');
	pennaApp.controller('referenceCtrl', function ($scope, request, $state, $timeout, $uibModalInstance, $compile, ctrlComm, mobile, items) {


		$scope.loader = items.loader;
		$scope.notification = items.notification;
		$scope.currUser = items.currUser;
		$scope.netWork = items.netWork;
		$scope.logout = items.logout;
		$scope.err = {};

		$scope.countries = ctrlComm.get('countries');
		var allStates = ctrlComm.get('states');
		var allCities = ctrlComm.get('cities');
		items.referrer = angular.copy(items.referrer);
		if (items.referrer) {

			items.referrer.mobileNumber = parseInt(items.referrer.mobileNumber);
			items.referrer.alternateMobileNumber = parseInt(items.referrer.alternateMobileNumber);
			items.referrer.pin = parseInt(items.referrer.pin);

			$scope.referrer = angular.copy(items.referrer);
			actualObj = angular.copy(items.referrer);

			$scope.states = angular.copy(allStates)
				// $scope.states = request.getCountryStates(items.referrer.country);
			$scope.cities = request.getStateCities(items.referrer.state);
			if (!$scope.cities.length) {
				$scope.cities = angular.copy(allCities)
			}
		} else {
			$scope.referrer = {};
			var actualObj = false;
			$scope.states = angular.copy(allStates)
			$scope.cities = angular.copy(allCities)
		}

		$scope.countrySelected = function (country) {
			delete $scope.err.country;
			$scope.states = request.getCountryStates(country.value.split(':')[1])
			$scope.referrer.city = undefined;
		}

		$scope.stateSelected = function (state) {
			delete $scope.err.country;
			delete $scope.err.state;
			var sID = state.value.split(':')[1]
			$scope.cities = request.getStateCities(sID);
			$scope.referrer.country = request.getStateCountry(sID);
		}

		$scope.citySelected = function (city) {
			delete $scope.err.country;
			delete $scope.err.state;
			delete $scope.err.city;
			var cID = city.value.split(':')[1]
			$scope.referrer.state = request.getCitiesState(cID);
			$scope.referrer.country = request.getStateCountry($scope.referrer.state);
			$scope.cities = request.getStateCities($scope.referrer.state);
		}

		$scope.profession = [
			{
				"id": "vice president",
				"name": "Vice-president"
    }, {
				"id": "director",
				"name": "Director"
    }, {
				"id": "manager",
				"name": "Manager"
    },
			{
				"id": "CEO",
				"name": "CEO(Chief executive officer)"
    },
			{
				"id": "company executive officer",
				"name": "Company executive officer"
    }, {
				"id": "deputy director",
				"name": "Deputy director"
    }, {
				"id": "managing director",
				"name": "Managing director"
    }, {
				"id": "marketing director",
				"name": "Marketing director"
    }, {
				"id": "general manager",
				"name": "General manager"
    }, {
				"id": "assistant manager",
				"name": "Assistant manager"
    }, {
				"id": "manager",
				"name": "Manager"
    }, {
				"id": "production manager",
				"name": "Production manager"
    }, {
				"id": "personnel manager",
				"name": "Personnel manager"
    }, {
				"id": "marketing manager",
				"name": "Marketing manager"
    }, {
				"id": "project manager",
				"name": "Project manager"
    }, {
				"id": "supervisor",
				"name": "Supervisor"
    }, {
				"id": "inspector",
				"name": "Inspector"
    }, {
				"id": "controller",
				"name": "Controller"
    }, {
				"id": "office clerk",
				"name": "Office clerk"
    }, {
				"id": "filing clerk",
				"name": "Filing clerk"
    }, {
				"id": "Others",
				"name": "others"
    }]


		$scope.save = function () {
			validate(function () {
				indicate(function () {
					if ($scope.referrer.indicator) {
						$scope.netWork(function (status) {
							if (status) {
								submitReferrer($scope.referrer);
							} else {
								$uibModalInstance.close($scope.referrer);
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
					if (actualObj[i] != $scope.referrer[i]) {
						$scope.referrer.indicator = 'T';
					}
					if (Object.keys(actualObj).length == t) {
						if (cb) cb()
					}
				}
			} else {
				$scope.referrer.indicator = 'T';
				$scope.referrer.added = true;
				if (cb) cb()
			}
		}

		function submitReferrer() {
			$scope.loader(true);
			$scope.referrer.userId = $scope.currUser.userId;
			$scope.referrer.accessToken = $scope.currUser.accessToken;
			$scope.referrer.companyId = $scope.currUser.companyId;
			request.service('addOrUpdateRefernces', 'post', $scope.referrer, function (res) {
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

			if (!$scope.referrer.name) {
				$scope.err.name = true;
			} else {
				delete $scope.err.name;
			}
			if (!$scope.referrer.mobileNumber) {
				$scope.err.mobileNumber = true;
			} else {
				delete $scope.err.mobileNumber;
			}
			if ($scope.referrer.mobileNumber && $scope.referrer.mobileNumber.toString().length != 10) {
				$scope.err.mobileNumberLength = true;
			} else {
				delete $scope.err.mobileNumberLength;
			}
			// if(!$scope.referrer.alternateMobileNumber) { $scope.err.alternateMobileNumber = true; } else { delete $scope.err.alternateMobileNumber; }
			delete $scope.err.alternateMobileNumber;
			delete $scope.err.alternateMobileNumberLength;
			if (!$scope.referrer.alternateMobileNumber) $scope.referrer.alternateMobileNumber = "";
			if ($scope.referrer.alternateMobileNumber && $scope.referrer.alternateMobileNumber.toString().length != 10) {
				$scope.err.alternateMobileNumberLength = true;
			} else {
				delete $scope.err.alternateMobileNumberLength;
			}
			if (!$scope.referrer.email) {
				$scope.err.email = true;
			} else {
				delete $scope.err.email;
			}
			if (!$scope.referrer.profession) {
				$scope.err.profession = true;
			} else {
				delete $scope.err.profession;
			}
			if (!$scope.referrer.street1) {
				$scope.err.street1 = true;
			} else {
				delete $scope.err.street1;
			}
			//            if (!$scope.referrer.street2) {
			//                $scope.err.street2 = true;
			//            } else {
			//                delete $scope.err.street2;
			//            }
			//            if (!$scope.referrer.street3) {
			//                $scope.err.street3 = true;
			//            } else {
			//                delete $scope.err.street3;
			//            }
			// if(!$scope.referrer.taluk) { $scope.err.taluk = true; } else { delete $scope.err.taluk; }
			delete $scope.err.taluk;
			if (!$scope.referrer.taluk) $scope.referrer.taluk = "";
			if (!$scope.referrer.city) {
				$scope.err.city = true;
			} else {
				delete $scope.err.city;
			}
			if (!$scope.referrer.district) {
				$scope.err.district = true;
			} else {
				delete $scope.err.district;
			}
			if (!$scope.referrer.state) {
				$scope.err.state = true;
			} else {
				delete $scope.err.state;
			}
			if (!$scope.referrer.pin) {
				$scope.err.pin = true;
			} else {
				delete $scope.err.pin;
			}


			if (Object.keys($scope.err).length == 0) {
				if (cb) cb();
			}
		}

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		var name = '';
		$scope.$watch('referrer.name', function (val) {
			if (val == 0) {
				$scope.referrer.name = '';
			}
			if (val && val.length) {
				if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 30) {
					if (val.length != 1) {
						$scope.referrer.name = name;
					} else {
						$scope.referrer.name = '';
					}
				} else {
					name = val;
				}
			}
		});

		var mobileNumber = '';
		$scope.$watch('referrer.mobileNumber', function (val) {
			if (val == 0) {
				$scope.referrer.mobileNumber = '';
			}
			if (val) {
				if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
					if (val.toString().length != 1) {
						$scope.referrer.mobileNumber = mobileNumber;
					} else {
						$scope.referrer.mobileNumber = '';
					}
				} else {
					mobileNumber = val;
				}
			}
		});

		var alternateMobileNumber = '';
		$scope.$watch('referrer.alternateMobileNumber', function (val) {
			if (val == 0) {
				$scope.referrer.alternateMobileNumber = '';
			}
			if (val) {
				if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
					if (val.toString().length != 1) {
						$scope.referrer.alternateMobileNumber = alternateMobileNumber;
					} else {
						$scope.referrer.alternateMobileNumber = '';
					}
				} else {
					alternateMobileNumber = val;
				}
			}
		});

		var email = '';
		$scope.$watch('referrer.email', function (val) {
			if (val) {
				if (val.length > 200) {
					$scope.referrer.email = email;
				} else {
					email = val;
				}
			};
		});

		var profession = '';
		$scope.$watch('referrer.profession', function (val) {
			if (val == 0) {
				$scope.referrer.profession = '';
			}
			if (val && val.length) {
				if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 30) {
					if (val.length != 1) {
						$scope.referrer.profession = profession;
					} else {
						$scope.referrer.profession = '';
					}
				} else {
					profession = val;
				}
			}
		});

		// if(!val.match(/^[a-zA-Z\s]*$/) || val.length>30){

		var street1 = '';
		$scope.$watch('referrer.street1', function (val) {
			if (val == 0) {
				$scope.referrer.street1 = '';
			}
			if (val && val.length) {
				if (val.length > 30) {
					if (val.length != 1) {
						$scope.referrer.street1 = street1;
					} else {
						$scope.referrer.street1 = '';
					}
				} else {
					street1 = val;
				}
			}
		});

		var street2 = '';
		$scope.$watch('referrer.street2', function (val) {
			if (val == 0) {
				$scope.referrer.street2 = '';
			}
			if (val && val.length) {
				if (val.length > 30) {
					if (val.length != 1) {
						$scope.referrer.street2 = street2;
					} else {
						$scope.referrer.street2 = '';
					}
				} else {
					street2 = val;
				}
			}
		});

		var street3 = '';
		$scope.$watch('referrer.street3', function (val) {
			if (val == 0) {
				$scope.referrer.street3 = '';
			}
			if (val && val.length) {
				if (val.length > 30) {
					if (val.length != 1) {
						$scope.referrer.street3 = street3;
					} else {
						$scope.referrer.street3 = '';
					}
				} else {
					street3 = val;
				}
			}
		});

		var taluk = '';
		$scope.$watch('referrer.taluk', function (val) {
			if (val == 0) {
				$scope.referrer.taluk = '';
			}
			if (val && val.length) {
				if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 20) {
					if (val.length != 1) {
						$scope.referrer.taluk = taluk;
					} else {
						$scope.referrer.taluk = '';
					}
				} else {
					taluk = val;
				}
			}
		});

		var district = '';
		$scope.$watch('referrer.district', function (val) {
			if (val == 0) {
				$scope.referrer.district = '';
			}
			if (val && val.length) {
				if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 20) {
					if (val.length != 1) {
						$scope.referrer.district = district;
					} else {
						$scope.referrer.district = '';
					}
				} else {
					district = val;
				}
			}
		});

		var state = '';
		$scope.$watch('referrer.state', function (val) {
			if (val == 0) {
				$scope.referrer.state = '';
			}
			if (val && val.length) {
				if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 30) {
					if (val.length != 1) {
						$scope.referrer.state = state;
					} else {
						$scope.referrer.state = '';
					}
				} else {
					state = val;
				}
			}
		});

		var pin = '';
		$scope.$watch('referrer.pin', function (val) {
			if (val == 0) {
				$scope.referrer.pin = '';
			}
			if (val) {
				if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 6) {
					if (val.toString().length != 1) {
						$scope.referrer.pin = pin;
					} else {
						$scope.referrer.pin = '';
					}
				} else {
					pin = val;
				}
			}
		});


	});
}());
