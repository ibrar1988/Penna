angular.module('pennaApp').controller('ModalInstanceCtrl', function ($scope, $rootScope, $uibModalInstance, $uibModal, codeAddress, $timeout, items, request, ctrlComm, $window, initialize, initAutocomplete, addYourLocationButton, mobile) {
	$scope.codeAddress = codeAddress;
	$scope.initialize = initialize;
	$scope.shipadd = {};
	$scope.err = {};
	var geocoder;
	var map;
	// $scope.cities = items.cities;
	// $scope.countries = items.countries;
	$scope.notification = items.notification;
	$scope.currUser = items.currUser;
	$scope.netWork = items.netWork;
	$scope.loader = items.loader;
	$scope.interNet = items.interNet;

	$scope.page = 'add'

	if (!$scope.interNet) {
		var allStates = ctrlComm.get('states');
		var allCities = ctrlComm.get('cities');
		$scope.states = angular.copy(allStates)
		$scope.cities = angular.copy(allCities)
		$scope.countries = ctrlComm.get('countries');
	}

	$scope.countrySelected = function (country) {
		delete $scope.err.country;
		$scope.states = request.getCountryStates(country.value.split(':')[1])
		$scope.shipadd.city = undefined;
	}

	$scope.stateSelected = function (state) {
		delete $scope.err.country;
		delete $scope.err.state;
		var sID = state.value.split(':')[1]
		$scope.cities = request.getStateCities(sID);
		$scope.shipadd.country = request.getStateCountry(sID);
	}

	$scope.citySelected = function (city) {
		delete $scope.err.country;
		delete $scope.err.state;
		delete $scope.err.city;
		var cID = city.value.split(':')[1]
		$scope.shipadd.state = request.getCitiesState(cID);
		$scope.shipadd.country = request.getStateCountry($scope.shipadd.state);
		$scope.cities = request.getStateCities($scope.shipadd.state);
	}





	$uibModalInstance.opened.then(function () {
		var geocoder = new google.maps.Geocoder();
		var placeSearch, autocomplete;





		function getAddress(latLng) {

			geocoder.geocode({
				'latLng': latLng
			}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {

					map = new google.maps.Map(document.getElementById('mapCanvas'), {
						zoom: 16,
						streetViewControl: false,
						mapTypeControlOptions: {
							style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
							mapTypeIds: [google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP]
						},
						center: results[0].geometry.location,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					});
					map.setCenter(results[0].geometry.location);

					marker = new MarkerWithLabel({
						map: map,
						position: results[0].geometry.location,
						labelAnchor: new google.maps.Point(-3, 30),
						labelClass: "markerLabels",
						draggable: true
					});


					addYourLocationButton(map, marker);


					function getAddressDetails(results) {
						var address;
						$scope.shipadd.street1 = "";
						$scope.shipadd.street2 = "";
						$scope.shipadd.street3 = "";
						$scope.shipadd.pin = "";
						$scope.shipadd.state = "";
						$scope.shipadd.district = "";
						$scope.shipadd.city = "";
						$scope.shipadd.country = "";
						$scope.shipadd.longitude = results[0].geometry.location.lng();
						$scope.shipadd.latitude = results[0].geometry.location.lat();

						if (results[0]) {
							for (var i = 0; i < results[0].address_components.length; i++) {
								var addr = results[0].address_components[i];
								// check if this entry in address_components has a type of country

								if (addr.types[0] == 'country')
									$scope.shipadd.country = addr.long_name;
								else if (addr.types[0] == 'postal_code') // Zip
									$scope.shipadd.pin = parseInt(addr.short_name);
								else if (addr.types[0] == ['administrative_area_level_1']) // State
									$scope.shipadd.state = addr.long_name;
								else if (addr.types[0] == ['administrative_area_level_2']) //district
									$scope.shipadd.district = addr.long_name;
								else if (addr.types[0] == ['locality']) // City
									$scope.shipadd.city = addr.long_name;
								$rootScope.safeApply();
							}


							if (results[0].formatted_address != null) {
								formattedAddress = results[0].formatted_address;

								var splits = formattedAddress.split(",");
								$scope.shipadd.s1 = splits[0];
								$scope.shipadd.street2 = "";
								$scope.shipadd.s2 = splits[1];
								//                                $scope.s2 = splits[2];
								//                                $scope.s3 = splits[3];
								if (typeof $scope.shipadd.s2 == "undefined") {
									$scope.shipadd.s2 = '';
								}
								if (typeof $scope.s3 == "undefined") {
									$scope.s3 = '';
								}
								$scope.shipadd.street3 = "";

								if ($scope.shipadd.street3 == "undefined") {
									$scope.shipadd.street3 = '';
								}
								//+ ',' + $scope.shipadd.street3;

								if (typeof $scope.name == "undefined" || $scope.name == " ") {
									$scope.shipadd.street1 = $scope.shipadd.s1 + ',' + $scope.shipadd.s2
								} else {
									$scope.comma = ',';
									$scope.shipadd.street1 = $scope.name + $scope.comma + $scope.shipadd.s1 + ',' + $scope.shipadd.s2
								}
								//+ ',' + $scope.shipadd.street3;

								$rootScope.safeApply();
							}
						}
					}
					getAddressDetails(results);
					google.maps.event.addListener(marker, 'drag', function (e) {
						$scope.name = " ";



						$scope.placename = " ";
						marker.set('labelContent', '');
						marker.label.setContent();
						marker.getPosition();
						marker.setPosition(e.latLng);
						var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
						geocoder = new google.maps.Geocoder();
						geocoder.geocode({
							'latLng': latlng
						}, function (results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								getAddressDetails(results);
							}
						});
					});
					google.maps.event.addListener(map, 'click', function (e) {
						$scope.name = " ";


						marker.set('labelContent', '');
						marker.label.setContent();
						marker.getPosition();
						marker.setPosition(e.latLng);
						var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
						geocoder = new google.maps.Geocoder();
						geocoder.geocode({
							'latLng': latlng
						}, function (results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								getAddressDetails(results);
							}
						});
					});
				}
			})
		}


		function addYourLocationButton(map, marker) {
			var controlDiv = document.createElement('div');

			var firstChild = document.createElement('button');
			firstChild.style.backgroundColor = '#fff';
			firstChild.style.border = 'none';
			firstChild.style.outline = 'none';
			firstChild.style.width = '28px';
			firstChild.style.height = '28px';
			firstChild.style.borderRadius = '2px';
			firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
			firstChild.style.cursor = 'pointer';
			firstChild.style.marginRight = '10px';
			firstChild.style.padding = '0';
			firstChild.title = 'Your Location';
			controlDiv.appendChild(firstChild);

			var secondChild = document.createElement('div');
			secondChild.style.margin = '5px';
			secondChild.style.width = '18px';
			secondChild.style.height = '18px';
			secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
			secondChild.style.backgroundSize = '180px 18px';
			secondChild.style.backgroundPosition = '0 0';
			secondChild.style.backgroundRepeat = 'no-repeat';
			firstChild.appendChild(secondChild);

			google.maps.event.addListener(map, 'center_changed', function () {
				secondChild.style['background-position'] = '0 0';
			});

			firstChild.addEventListener('click', function () {
				var imgX = '0',
					animationInterval = setInterval(function () {
						imgX = imgX === '-18' ? '0' : '-18';
						secondChild.style['background-position'] = imgX + 'px 0';
					}, 500);

				if ($window.navigator.geolocation) {
					$window.navigator.geolocation.getCurrentPosition(function (position) {
						var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

						marker.visible = true;
						map.setCenter(latlng);
						clearInterval(animationInterval);
						secondChild.style['background-position'] = '-144px 0';
						var geocoder = new google.maps.Geocoder();
						var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						getAddress(latlng);


					});

				} else {
					clearInterval(animationInterval);
					secondChild.style['background-position'] = '0 0';
				}
				marker.set('labelContent', '');
				marker.label.setContent();
			});

			controlDiv.index = 1;
			map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
		}

		function initAutocomplete() {
			var infowindow,
				placemarkers = [];
			//var location = new google.maps.LatLng(-33.8665433, 151.1956316),
			map = new google.maps.Map(document.getElementById('mapCanvas'), {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				zoom: 16
			});

			function createMarker(latlng, map, icon, content, center, action) {
				var marker = new google.maps.Marker({
					map: map,
					position: latlng,
					content: content
				});
				if (icon) {
					marker.setIcon(icon);
				}
				if (center) {
					map.setCenter(latlng);
				}
				google.maps.event.addListener(marker, 'click', function () {
					infowindow.setContent(this.content);
					infowindow.open(map, this);
				});
			}
			infowindow = new google.maps.InfoWindow();
			$window.navigator.geolocation.getCurrentPosition(function (place) {
				var geocoder = new google.maps.Geocoder();
				var latlng = new google.maps.LatLng(place.coords.latitude, place.coords.longitude);
				geocoder.geocode({
					'latLng': latlng
				}, function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						map = new google.maps.Map(document.getElementById('mapCanvas'), {
							zoom: 16,
							streetViewControl: false,
							mapTypeControlOptions: {
								style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
								mapTypeIds: [google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP]
							},
							center: results[0].geometry.location,
							mapTypeId: google.maps.MapTypeId.ROADMAP
						});
						map.setCenter(results[0].geometry.location);
						marker = new google.maps.Marker({
							map: map,
							position: results[0].geometry.location,
							draggable: true
						});
						addYourLocationButton(map, marker);
						getAddress(latlng);


						google.maps.event.addListener(marker, 'drag', function (e) {
							marker.getPosition();
							marker.setPosition(e.latLng);
							var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
							geocoder = new google.maps.Geocoder();
							geocoder.geocode({
								'latLng': latlng
							}, function (results, status) {
								if (status == google.maps.GeocoderStatus.OK) {
									getAddress(latlng);


								}
							});
						});
						google.maps.event.addListener(map, 'click', function (e) {
							marker.getPosition();
							marker.setPosition(e.latLng);
							var latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
							geocoder = new google.maps.Geocoder();
							geocoder.geocode({
								'latLng': latlng
							}, function (results, status) {
								if (status == google.maps.GeocoderStatus.OK) {
									getAddress(latlng);


								}
							});
						});
					}
				})
				createMarker(
					new google.maps.LatLng(place.coords.latitude,
						place.coords.longitude),
					map,
					null,
					'your current position',
					true, {}
				);
			});
			// Create the search box and link it to the UI element.
			var input = document.getElementById('city_country');
			var searchBox = new google.maps.places.SearchBox(input);
			// Bias the SearchBox results towards current map's viewport.
			map.addListener('bounds_changed', function () {
				searchBox.setBounds(map.getBounds());
			});

			// Listen for the event fired when the user selects a prediction and retrieve
			// more details for that place.
			searchBox.addListener('places_changed', function () {

				var places = searchBox.getPlaces();
				if (places.length == 0) {
					return;
				}


				// For each place, get the icon, name and location.
				var bounds = new google.maps.LatLngBounds();
				places.forEach(function (place) {
					$scope.place = place;
					var icon = {
						url: place.icon,
						size: new google.maps.Size(71, 71),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(17, 34),
						scaledSize: new google.maps.Size(35, 35)
					};
					if (place.geometry.viewport) {
						// Only geocodes have viewport.
						bounds.union(place.geometry.viewport);
					} else {
						bounds.extend(place.geometry.location);
					}
					var geocoder = new google.maps.Geocoder();
					var latlng = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
					//									   marker = new MarkerWithLabel({
					//                                            map: map,
					//                                            position: place.geometry.location,
					//                                            labelAnchor: new google.maps.Point(-3, 30),
					//                                            labelClass: "markerLabels",
					//                                            draggable: true
					//                                        });





					// marker.labelContent = place.name;
					getAddress(latlng);


				});
				map.fitBounds(bounds);
			});
		}
		$timeout(function () {
			initAutocomplete()
		}, 1000);




	})




	$scope.animationsEnabled = true;
	$scope.toggleAnimation = function () {
		$scope.animationsEnabled = !$scope.animationsEnabled;
	};
	$scope.changeShipToAddrImg = function () {
		//if ($scope.err) delete $scope.err.image;
		var ele = document.getElementById('shipToAddAttachInput');
		var file = ele.files[0];
		var reader = new FileReader();
		reader.onload = function () {
			$rootScope.safeApply(function () {
				$scope.shipadd.image = reader.result;
			});
		}
		reader.readAsDataURL(file);

	}
	$scope.imguploadshipadd = function () {
		//$scope.err.image = false;
		document.getElementById('shipToAddAttachInput').click();
		mobile.chooseImage(function (img) {
			$scope.shipadd.image = img;
			$rootScope.safeApply(function () {
				$scope.shipadd.image = img;
			});
		});
	}

	function validateShipAddressForm(cb) {

		if (!$scope.shipadd.Ship_to_Name) {
			$scope.err.Ship_to_Name = true;
		} else {
			delete $scope.err.Ship_to_Name;
		}


		if (!$scope.shipadd.ContactName) {
		   $scope.err.ContactName = true;
		  } else {
		   delete $scope.err.ContactName;
		  }



		if (!$scope.shipadd.street1) {
			$scope.err.street1 = true;
		} else {
			delete $scope.err.street1;
		}
		if (!$scope.shipadd.s1) {
			$scope.err.s1 = true;
		} else {
			delete $scope.err.s1;
		}

		//        if (!$scope.shipadd.street2) {
		//            $scope.err.street2 = true;
		//        } else {
		//            delete $scope.err.street2;
		//        }
		//        if (!$scope.shipadd.street3) {
		//            $scope.err.street3 = true;
		//        } else {
		//            delete $scope.err.street3;
		//        }
		if (!$scope.shipadd.city) {
			$scope.err.city = true;
		} else {
			delete $scope.err.city;
		}
		// if (!$scope.shipadd.taluk) { $scope.err.taluk = true; } else { delete $scope.err.taluk; }
		if (!$scope.shipadd.taluk) $scope.shipadd.taluk = "";
		delete $scope.err.taluk;
		if (!$scope.shipadd.district) {
			$scope.err.district = true;
		} else {
			delete $scope.err.district;
		}
		if (!$scope.shipadd.state) {
			$scope.err.state = true;
		} else {
			delete $scope.err.state;
		}
		if (!$scope.shipadd.country) {
			$scope.err.country = true;
		} else {
			delete $scope.err.country;
		}
		if (!$scope.shipadd.pin) {
			$scope.err.pin = true;
		} else {
			delete $scope.err.pin;
		}
		if ($scope.shipadd.pin && $scope.shipadd.pin.toString().length != 6) {
			$scope.err.pinLength = true;
		} else {
			delete $scope.err.pinLength;
		}
		if (!$scope.shipadd.email) {
			$scope.err.email = true;
		} else {
			delete $scope.err.email;
		}
		if (!$scope.shipadd.mobile) {
			$scope.err.mobile = true;
		} else {
			delete $scope.err.mobile;
		}
		if ($scope.shipadd.mobile && $scope.shipadd.mobile.toString().length != 10) {
			$scope.err.mobileNumberLength = true;
		} else {
			delete $scope.err.mobileNumberLength;
		}
		// if ($scope.shipadd.alternate_Mobile) { $scope.err.alternate_Mobile = true; } else { delete $scope.err.alternate_Mobile; }
		if (!$scope.shipadd.alternate_Mobile) {
			$scope.shipadd.alternate_Mobile = ""
		}
		delete $scope.err.alternate_Mobile;
		delete $scope.err.alternateMobileNumberLength;
		if ($scope.shipadd.alternate_Mobile && $scope.shipadd.alternate_Mobile.toString().length != 10) {
			$scope.err.alternateMobileNumberLength = true;
		} else {
			//$scope.shipadd.alternate_Mobile = "";
			delete $scope.err.alternateMobileNumberLength;
		}

		/*if (!$scope.shipadd.image) {
	$scope.err.image = true;
} else {
	delete $scope.err.image;
}*/

		// if (!$scope.shipadd.longitude) {
		//     $scope.err.longitude = true;
		// }else{
		//     delete $scope.err.longitude;
		// }
		// if(!$scope.shipadd.latitude) {
		//     $scope.err.latitude = true;
		// }else{
		//     delete $scope.err.latitude;
		// }

		if (Object.keys($scope.err).length == 0) {
			if (cb) cb();
		}
	}

	var pinNum = '';
	$scope.$watch('shipadd.pin', function (val) {
		if (val == 0) {
			$scope.shipadd.pin = '';
		}
		if (val) {
			if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 6) {
				if (val.toString().length != 1) {
					$scope.shipadd.pin = pinNum;
				} else {
					$scope.shipadd.pin = '';
				}
			} else {
				pinNum = val;
			}
		}
	});

	var mobileNumber = '';
	$scope.$watch('shipadd.mobile', function (val) {
		if (val == 0) {
			$scope.shipadd.mobile = '';
		}
		if (val) {
			if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
				if (val.toString().length != 1) {
					$scope.shipadd.mobile = mobileNumber;
				} else {
					$scope.shipadd.mobile = '';
				}
			} else {
				mobileNumber = val;
			}
		}
	});

		var primaryContactName = '';
		 $scope.$watch('shipadd.ContactName', function (val) {

		  if (val == 0) {
		   $scope.shipadd.ContactName = '';
		  }
		  if (val) {
		   if (!val.toString().match(/^[^0-9]*$/)) {
			if (val.toString().length != 1) {
			 $scope.shipadd.ContactName = primaryContactName;
			} else {
			 $scope.shipadd.ContactName = '';
			}
		   } else {
			primaryContactName = val;
		   }
		  }
		 });


	var shipName = '';
	$scope.$watch('shipadd.Ship_to_Name', function (val) {

		if (val == 0) {
			$scope.shipadd.Ship_to_Name = '';
		}
		if (val) {
			if (!val.toString().match(/^[^0-9]*$/)) {
				if (val.toString().length != 1) {
					$scope.shipadd.Ship_to_Name = shipName;
				} else {
					$scope.shipadd.Ship_to_Name = '';
				}
			} else {
				shipName = val;
			}
		}
	});








	var alternateMobileNumber = '';
	$scope.$watch('shipadd.alternate_Mobile', function (val) {
		if (val == 0) {
			$scope.shipadd.alternate_Mobile = '';
		}
		if (val) {
			if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
				if (val.toString().length != 1) {
					$scope.shipadd.alternate_Mobile = alternateMobileNumber;
				} else {
					$scope.shipadd.alternate_Mobile = '';
				}
			} else {
				alternateMobileNumber = val;
			}
		}
	});

	$scope.addshipdelt = function () {
		validateShipAddressForm(function () {
			$scope.shipadd.userId = $scope.currUser.userId;
			$scope.shipadd.accessToken = $scope.currUser.accessToken;
			$scope.shipadd.indicator = 'T';
			$scope.shipadd.type = "Shipping";

			var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
			$scope.shipadd.version = $scope.currUser.version;
			$scope.shipadd.device_id = $scope.currUser.device_id;
			$scope.shipadd.device_type = $scope.currUser.device_type;
			if (deviceInfo.device_Platform != "WEB") {
				$scope.shipadd.device_Model = deviceInfo.device_Model;
				$scope.shipadd.device_Platform = deviceInfo.platform;
				$scope.shipadd.device_ID = deviceInfo.uuid;
				$scope.shipadd.device_Manufacturer = deviceInfo.device_Manufacturer;
				$scope.shipadd.device_Serial = deviceInfo.device_Serial;
				$scope.shipadd.device_IPAddress = deviceInfo.device_IPAddress;
				$scope.shipadd.device_MacAddress = deviceInfo.device_MacAddress;
				$scope.shipadd.location = "";
				$scope.shipadd.osVersion = deviceInfo.osVersion;
				$scope.shipadd.apVersion = localStorage.getItem('device_version');
			} else {
				if (JSON.parse(localStorage.getItem('browserInfo')).lat_long) {
					var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;
				} else {
					var local_browserInfo = "blocked"
				}
				$scope.shipadd.device_Model = "";
				$scope.shipadd.device_Platform = "WEB";
				$scope.shipadd.device_ID = "";
				$scope.shipadd.device_Manufacturer = "";
				$scope.shipadd.device_Serial = "";
				$scope.shipadd.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
				$scope.shipadd.device_MacAddress = "";
				$scope.shipadd.location = local_browserInfo;
				$scope.shipadd.osVersion = "";
				$scope.shipadd.apVersion = "";
			}





			$scope.netWork(function (status) {
				if (status) {
					$scope.loader(true);
					request.service('addShipToAddress', 'post', $scope.shipadd, function (res) {
						$scope.loader(false);
						if (res.statusCode == 200) {
							if (res.updateMandate == 'NO') {
								$scope.check_appUpdate();
							}
							$uibModalInstance.close(res);
						} else if (res.dupLogin || res.statusCode == 505) {

							if (res.updateMandate == 'YES') {
								$scope.logout();
							} else {
								$scope.check_appUpdate();
							}


							if (res.dupLogin) {
								$scope.notification(res.statusMessage);
								$scope.logout();
							}

						} else {
							$scope.notification(res.statusMessage);
						}
					});
				} else {
					$uibModalInstance.close($scope.shipadd);
				}
			});
		});

	};
	$scope.ok = function () {

		$scope.shipadd.userId = $scope.currUser.userId;
		$scope.shipadd.accessToken = $scope.currUser.accessToken;
		$scope.shipadd.indicator = 'T'
		$scope.shipadd.type = "Shipping";

		var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
		$scope.shipadd.version = $scope.currUser.version;
		$scope.shipadd.device_id = $scope.currUser.device_id;
		$scope.shipadd.device_type = $scope.currUser.device_type;
		if (deviceInfo.device_Platform != "WEB") {
			$scope.shipadd.device_Model = deviceInfo.device_Model;
			$scope.shipadd.device_Platform = deviceInfo.platform;
			$scope.shipadd.device_ID = deviceInfo.uuid;
			$scope.shipadd.device_Manufacturer = deviceInfo.device_Manufacturer;
			$scope.shipadd.device_Serial = deviceInfo.device_Serial;
			$scope.shipadd.device_IPAddress = deviceInfo.device_IPAddress;
			$scope.shipadd.device_MacAddress = deviceInfo.device_MacAddress;
			$scope.shipadd.location = "";
			$scope.shipadd.osVersion = deviceInfo.osVersion;
			$scope.shipadd.apVersion = localStorage.getItem('device_version');
		} else {
			if (JSON.parse(localStorage.getItem('browserInfo')).lat_long) {
				var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;
			} else {
				var local_browserInfo = "blocked"
			}
			$scope.shipadd.device_Model = "";
			$scope.shipadd.device_Platform = "WEB";
			$scope.shipadd.device_ID = "";
			$scope.shipadd.device_Manufacturer = "";
			$scope.shipadd.device_Serial = "";
			$scope.shipadd.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
			$scope.shipadd.device_MacAddress = "";
			$scope.shipadd.location = local_browserInfo;
			$scope.shipadd.osVersion = "";
			$scope.shipadd.apVersion = localStorage.getItem('device_version');
		}

		validateShipAddressForm(function () {
			$scope.netWork(function (status) {
				if (status) {
					if (geocoder) {
						var address = document.getElementById('street1').value + ',' + document.getElementById('street2').value + ',' + document.getElementById('street3').value + ',' + document.getElementById('city').value + document.getElementById('district').value + document.getElementById('pincode').value;
						geocoder.geocode({
							'address': address
						}, function (results, status) {
							if (status == google.maps.GeocoderStatus.OK) {
								$scope.loader(true);
								request.service('addShipToAddress', 'post', $scope.shipadd, function (res) {
									$scope.loader(false);
									if (res.statusCode == 200) {
										$uibModalInstance.close(res);
									} else if (res.dupLogin) {
										$scope.logout();
										$scope.notification(res.statusMessage);
									} else {
										$scope.notification(res.statusMessage);
									}
								});
							} else {
								// alert('Geocode was not successful for the following reason: ' + status);
							}
						});
					}
				} else {
					$uibModalInstance.close($scope.shipadd);
				}
			});
		});

	};
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
})
