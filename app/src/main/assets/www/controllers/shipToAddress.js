angular.module('pennaApp').controller('shipaddressctrl', function ($scope, $state, $rootScope, $uibModal, $log, request, ctrlComm, mobile, $timeout, $window) {

	var getShippingAddresses = function () {
		$scope.netWork(function (status) {
			if (status) {
				$scope.loader(true);
				request.service('getShiptoAddress', 'post', $scope.currUser, function (res) {
					$scope.loader(false);
					if (res.companyAddress) {
						var iStatus = false;
						for (var i in res.companyAddress) {
							if (res.companyAddress[i].indicatorStatus) {
								iStatus = true;
							}
						}
						if (iStatus) {
							res.someOtherIndicator = true;
						}

						$scope.getshipadd = res;
						$scope.shipToAddresses = angular.copy(res);

						if (!$scope.getshipadd.companyAddress)
							$scope.noShipToAddrs = true;

						if ($scope.ifMobile) {
							$scope.addOfflineDataInLocal('shipToAddress', {
								added: {
									key: 'addShipToAddress',
									type: 'post',
									input: []
								},
								updated: {
									key: 'uploadShipToAddress',
									type: 'post',
									input: []
								},
								addrs: res
							});
						}
					} else if (res.dupLogin) {
						$scope.logout();
						$scope.notification(res.statusMessage);
					}
				});
			} else if ($scope.ifMobile) {
				$scope.getOfflineDataFromLocal('shipToAddress', function (data) {
					$rootScope.safeApply(function () {
						if (data && data.addrs) {
							if (!data.addrs.companyAddress) data.addrs.companyAddress = []
							if (data.addrs.companyAddress.length) {
								var iStatus = false;
								var count = 0;
								for (var i in data.addrs.companyAddress) {
									count++;
									if (data.addrs.companyAddress[i].indicatorStatus) {
										iStatus = true;
									}
									if (count == data.addrs.companyAddress.length) {
										if (iStatus) data.addrs.someOtherIndicator = true;
										$scope.getshipadd = data.addrs;
										$scope.shipToAddresses = angular.copy(data.addrs);
									}
								}
							} else {
								if (data.addrs.shippingAddressOuterIndicator) data.addrs.someOtherIndicator = true;
								$scope.getshipadd = data.addrs;
								$scope.shipToAddresses = angular.copy(data.addrs);
								$scope.noShipToAddrs = true;
							}
						}
					})
				});
			}
		});
	};

	getShippingAddresses();

	$scope.openmap = function (size) {
		checkLocationStatus(function () {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				backdrop: 'static',
				templateUrl: 'pages/profile/shipToAddress/myModalContent1.html',
				controller: 'ModalInstanceCtrl',
				scope: $scope,
				size: 'md',
				resolve: {

					codeAddress: function () {
						$timeout(function () {

						}, 1000)
					},
					items: function () {
						return {
							cities: $scope.cities,
							countries: $scope.countries,
							notification: $scope.notification,
							currUser: $scope.currUser,
							netWork: $scope.netWork,
							loader: $scope.loader,
							interNet: $scope.interNet
						}
					},
					initialize: function () {

					},
					initAutocomplete: function () {

					},
					addYourLocationButton: function () {}
				}
			});

			modalInstance.result.then(function (res) {
				if (res.statusMessage) {
					$scope.notification(res.statusMessage)
					getShippingAddresses();
				} else if ($scope.ifMobile) {
					saveAddedShippingAddrsInLocal(res);
				}
			}, function () {

			});
		})
	};

	function checkLocationStatus(cb) {
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android|webOS|IEMobile|Opera Mini)/)) {
			document.addEventListener("deviceready", onDeviceReady, false);

			function onDeviceReady() {
				backgroundGeolocation.isLocationEnabled(function (enabled) {
					if (enabled) {
						if (cb) cb();
						backgroundGeolocation.finish();
					} else {
						$scope.askConfrimation = function (data, cb) {
							var modalInstance = $uibModal.open({
								animation: true,
								backdrop: 'static',
								templateUrl: 'pages/accessLocationComfirmPop.html',
								controller: 'allowLocation',
								size: 'md',
								resolve: {
									data: function () {
										return data;
									}
								}
							});

							modalInstance.result.then(function (data) {
								if (cb) cb(data);
							}, function () {

							});
						}
						$scope.askConfrimation();
					}
				}, function (error) {
				});
				backgroundGeolocation.start();
			}
		} else {
			if (cb) cb();
		}
	}

	function saveAddedShippingAddrsInLocal(res) {
		$scope.getOfflineDataFromLocal('shipToAddress', function (data) {
			if (!data) data = {}
			if (!data.added) {
				data.added = {
					key: 'addShipToAddress',
					type: 'post',
					input: []
				}
			}
			if (!data.added) {
				data.updated = {
					key: 'uploadShipToAddress',
					type: 'post',
					input: []
				}
			}
			if (!data.addrs) data.addrs = {};
			$rootScope.safeApply(function () {
				data.added.input.push(res)
				data.addrs.shippingAddressOuterIndicator = true;
				$scope.addOfflineDataInLocal('shipToAddress', data, function () {
					request.setItem('localDataSubmitted', 'false');
					$scope.notification('Hey you are in offline mode! Will added ship to address details successfully once you are online! Admin needs to approve.');
					getShippingAddresses()
				});
			});
		});
	}


	$scope.updateShipToaddress = function (shipadd, key) {
		ctrlComm.put('shipadd1', shipadd);
		checkLocationStatus(function () {
			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'pages/profile/shipToAddress/updateShipToAddress.html',
				controller: 'updateShiptoAddresCtrl',
				size: 'md',
				resolve: {
					items: function () {
						return {
							cities: $scope.cities,
							countries: $scope.countries,
							notification: $scope.notification,
							currUser: $scope.currUser,
							netWork: $scope.netWork,
							loader: $scope.loader,
							shipadd: shipadd,
							key: key,
							getshipadd: $scope.getshipadd,
							shipToAddresses: $scope.shipToAddresses,
							interNet: $scope.interNet
						}
					},
					codeAddress: function () {
						$timeout(function () {}, 1000)
					},
					initialize: function () {},
					initAutocomplete: function () {},
					addYourLocationButton: function () {}
				}
			});
			modalInstance.result.then(function (res) {
				if (res.statusMessage) {
					$scope.notification(res.statusMessage)
					getShippingAddresses();
				} else if ($scope.ifMobile) {
					saveUpdatedShippingAddrsInLocal(res);
				}
			}, function () {

			});
		})
	}


	function saveUpdatedShippingAddrsInLocal(changedAddress) {
		$scope.getOfflineDataFromLocal('shipToAddress', function (data) {
			for (var i in data.addrs.companyAddress) {
				if (data.addrs.companyAddress[i].id == changedAddress.id) {
					$rootScope.safeApply(function () {
						data.addrs.companyAddress[i].mobile = changedAddress.mobile;
						data.addrs.companyAddress[i].alternate_Mobile = changedAddress.alternate_Mobile;
						data.addrs.companyAddress[i].email = changedAddress.email;
						data.addrs.companyAddress[i].consigneeCode = changedAddress.consigneeCode;

						if (changedAddress.indicator == 'T') {
							data.addrs.companyAddress[i].indicatorStatus = true;
							data.addrs.shippingAddressOuterIndicator = true;
						}

						if (data.updated.input.length) {
							var found = true;
							for (var j in data.updated.input) {
								if (data.updated.input[j].id == changedAddress.id) {
									data.updated.input[j] = changedAddress;
									found = false;
								}
							}
							if (found) {
								data.updated.input.push(changedAddress);
							}
						} else {
							data.updated.input.push(changedAddress);
						}
						$scope.addOfflineDataInLocal('shipToAddress', data, function () {
							request.setItem('localDataSubmitted', 'false');
							if (changedAddress.indicator == 'T') {
								$scope.notification('Hey you are in offline mode! Will update ship to address details successfully once you are online! Admin needs to approve.');
							} else {
								$scope.notification("Hey you are in offline mode! Will update ship to address details successfully once you are online!");
							}
							$scope.loader(false);
							getShippingAddresses();
						});
					});
				}
			}
		});
	}


}).controller('allowLocation', function ($scope, $uibModalInstance, data) {

	$scope.save = function () {
		backgroundGeolocation.showLocationSettings();
		$uibModalInstance.close(data);
	}
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

}).controller('updateShiptoAddresCtrl', function ($scope, $state, $rootScope, $uibModal, $log, request, ctrlComm, $timeout, items, $uibModalInstance, mobile, $window) {
	$scope.err = {};
	// $scope.cities = items.cities;
	// $scope.countries = items.countries;



	$scope.notification = items.notification;
	$scope.currUser = items.currUser;
	$scope.netWork = items.netWork;
	$scope.loader = items.loader;
	$scope.getshipadd = items.getshipadd;
	$scope.key = items.key;
	$scope.shipToAddresses = items.shipToAddresses;
	$scope.interNet = items.interNet;
	$scope.page = 'update';
	$scope.latitude = items.shipadd.latitude;
	$scope.longitude = items.shipadd.longitude;





	$uibModalInstance.opened.then(function () {
		var geocoder = new google.maps.Geocoder();
		var placeSearch, autocomplete;
		$scope.shipadd.street1 = ctrlComm.get('shipadd1').street1;


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


					function getAddressDetails(results, key) {

						$scope.indicatorS = key;

						var address;
						$scope.shipadd.street1 = ctrlComm.get('shipadd1').street1;
						//$scope.shipadd.street2 = "";
						//$scope.shipadd.street3 = "";
						// $scope.shipadd.pin = "";
						// $scope.shipadd.state = "";
						//$scope.shipadd.district = "";
						// $scope.shipadd.city = "";
						// $scope.shipadd.country = "";
						$scope.shipadd.longitude = results[0].geometry.location.lng();
						$scope.shipadd.latitude = results[0].geometry.location.lat();

						if (items.shipadd.indicatorStatus != true) {
							if ($scope.page != 'update') {


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

										$scope.indicatorS = items.shipadd.indicatorStatus;


										if (typeof $scope.name == "undefined" || $scope.name == " ") {

											$scope.shipadd.street1 = $scope.shipadd.s1 + ',' + $scope.shipadd.s2
										} else {
											$scope.comma = ',';
											//$scope.shipadd.street1 = $scope.name + $scope.comma + $scope.shipadd.s1 + ',' + $scope.shipadd.s2
											$scope.shipadd.street1 = ctrlComm.get('shipadd1').street1;
										}
										//+ ',' + $scope.shipadd.street3;

										$rootScope.safeApply();
									}
								}

							}


							if ($scope.indicatorS == true) {


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

										$scope.indicatorS = items.shipadd.indicatorStatus;


										if (typeof $scope.name == "undefined" || $scope.name == " ") {

											$scope.shipadd.street1 = $scope.shipadd.s1 + ',' + $scope.shipadd.s2
										} else {
											$scope.comma = ',';
											//$scope.shipadd.street1 = $scope.name + $scope.comma + $scope.shipadd.s1 + ',' + $scope.shipadd.s2
											$scope.shipadd.street1 = ctrlComm.get('shipadd1').street1;
										}
										//+ ',' + $scope.shipadd.street3;

										$rootScope.safeApply();
									}
								}

							} else {

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

										$scope.indicatorS = items.shipadd.indicatorStatus;


										if (typeof $scope.name == "undefined" || $scope.name == " ") {

											$scope.shipadd.street1 = $scope.shipadd.s1 + ',' + $scope.shipadd.s2
										} else {
											$scope.comma = ',';
											//$scope.shipadd.street1 = $scope.name + $scope.comma + $scope.shipadd.s1 + ',' + $scope.shipadd.s2
											$scope.shipadd.street1 = ctrlComm.get('shipadd1').street1;
										}
										//+ ',' + $scope.shipadd.street3;

										$rootScope.safeApply();
									}
								}


							}
						}
						///////////////////////////////
					}
					getAddressDetails(results);

					if (items.shipadd.indicatorStatus != true) {
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

									$scope.indicatorS = true;

									getAddressDetails(results, $scope.indicatorS);
								}
							});
						});
					}

					if ($scope.indicatorS != true) {
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
						//var latlng = new google.maps.LatLng(position.coords.longitude, position.coords.latitude);

						marker.visible = true;
						map.setCenter(latlng);
						clearInterval(animationInterval);
						secondChild.style['background-position'] = '-144px 0';
						var geocoder = new google.maps.Geocoder();
						var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						//var latlng = new google.maps.LatLng(position.coords.longitude, position.coords.latitude);
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
			$scope.shipadd.street1 = ctrlComm.get('shipadd1').street1;
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




				if ($scope.page != 'update') {
					var latlng = new google.maps.LatLng($scope.latitude, $scope.longitude);
				} else {
					$scope.latitude = ctrlComm.get('shipadd1').latitude;
					$scope.longitude = ctrlComm.get('shipadd1').longitude;

					var latlng = new google.maps.LatLng($scope.latitude, $scope.longitude);
				}



				// var latlng = new google.maps.LatLng($scope.longitude, $scope.latitude);
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
					marker = new MarkerWithLabel({
						map: map,
						position: place.geometry.location,
						labelAnchor: new google.maps.Point(-3, 30),
						labelClass: "markerLabels",
						draggable: true
					});

					marker.labelContent = place.name;
					getAddress(latlng);


				});
				map.fitBounds(bounds);
			});
		}
		$timeout(function () {
			initAutocomplete()
		}, 1000);

	})



	if (items.shipadd) {

		items.shipadd.pin = parseInt(items.shipadd.pin);
		items.shipadd.mobile = parseInt(items.shipadd.mobile);
		items.shipadd.alternate_Mobile = items.shipadd.alternate_Mobile ? parseInt(items.shipadd.alternate_Mobile) : undefined;

		$scope.shipadd = angular.copy(items.shipadd);
		$scope.countries = ctrlComm.get('countries');

		$scope.states = request.getCountryStates(items.shipadd.country);
		if (!$scope.states.length) $scope.states = ctrlComm.get('states');
		$scope.cities = request.getStateCities(items.shipadd.state);
		if (!$scope.cities.length) $scope.cities = ctrlComm.get('cities');
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

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};


	var shipaddrs = '';
	var idx = '';
	$scope.changeShipToAddrImg = function () {
		//if ($scope.err) delete $scope.err.image;
		var ele = document.getElementById('shipToAddAttachInput' + idx);
		var file = ele.files[0];
		var reader = new FileReader();
		reader.onload = function () {
			$scope.shipToImage = reader.result;
		}
		reader.readAsDataURL(file);
		$rootScope.safeApply(function () {
			//$scope.notification("image uploaded successfully");
			$scope.shipToImage = img;
		});
	}

	$scope.imguploadshipadd = function (shipadd) {
		shipaddrs = shipadd;
		mobile = mobile
		/*indicateShipToAddress(shipaddrs, function (changedAddress) {*/
		if (shipaddrs.indicator) {
			id = 'shipToAddAttachInput';
			document.getElementById(id).click();
			mobile.chooseImage(function (img) {
				$rootScope.safeApply(function () {
					//$scope.notification("image uploaded successfully");
					$scope.shipToImage = img;
				});

			});
		} else {
			//if ($scope.err) delete $scope.err.false;
			$scope.notification("No Changes in address");
		}
		/*});*/
	}


	$scope.saveConfirmation = function (shipadd) {


		if ($scope.shipToImage) shipadd.image = $scope.shipToImage
		validateShipAddressForm(shipadd, function () {
			if (shipadd.indicator == 'T') {
				// $scope.askConfrimation({}, function () {
				$scope.loader(true);
				$scope.ship2AddrsEdit = {};
				saveEditedShipngAddrs(shipadd);
				// });
			} else {
				function getActualAddress(cb) {
					for (var i in $scope.shipToAddresses.companyAddress) {
						actual = $scope.shipToAddresses.companyAddress[i];
						if (actual.id == shipadd.id) {
							if (cb) cb(actual)
							break;
						}
					}
				}
				getActualAddress(function (actual) {
					var nothingToSave = true;
					for (var i in shipadd) {
						if (shipadd[i] != actual[i]) {
							nothingToSave = false;
							// $scope.askConfrimation({}, function () {
							$scope.loader(true);
							$scope.ship2AddrsEdit = {};
							saveEditedShipngAddrs(shipadd);
							// });
							break;
						}
					}
					if (nothingToSave) {
						$scope.ship2AddrsEdit = {};
						$scope.cancel();
					}
				})
			}
		});
	};

	function indicateShipToAddress(changedAddress, cb) {
		if (!changedAddress.indicatorStatus) {
			// && !$scope.shipToAddresses.someOtherIndicator
			for (var i in $scope.shipToAddresses.companyAddress) {
				actual = $scope.shipToAddresses.companyAddress[i];
				if (actual.id == changedAddress.id) {
					if (actual.street1 != changedAddress.street1) changedAddress.indicator = 'T'
					if (actual.street2 != changedAddress.street2) changedAddress.indicator = 'T'
						//                    if (actual.street3 != changedAddress.street3) changedAddress.indicator = 'T'
					if (actual.taluk != changedAddress.taluk) changedAddress.indicator = 'T'
					if (actual.city != changedAddress.city) changedAddress.indicator = 'T'
					if (actual.district != changedAddress.district) changedAddress.indicator = 'T'
					if (actual.state != changedAddress.state) changedAddress.indicator = 'T'
					if (actual.country != changedAddress.country) changedAddress.indicator = 'T'
					if (actual.pin != changedAddress.pin) changedAddress.indicator = 'T'

					if (cb) cb(changedAddress);

				}
			}
		} else {
			if (cb) cb(changedAddress);
		}
	}

	function saveEditedShipngAddrs(Addrdata) {
		indicateShipToAddress(Addrdata, function (changedAddress) {
			var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
			changedAddress.userId = $scope.currUser.userId;
			changedAddress.accessToken = $scope.currUser.accessToken;
			changedAddress.type = "Shipping";

			changedAddress.version = $scope.currUser.version;
			changedAddress.device_id = $scope.currUser.device_id;

			changedAddress.version = $scope.currUser.version;
			changedAddress.device_id = $scope.currUser.device_id;
			changedAddress.device_type = $scope.currUser.device_type;
			if (deviceInfo.device_Platform != "WEB") {
				changedAddress.device_Model = deviceInfo.device_Model;
				changedAddress.device_Platform = deviceInfo.platform;
				changedAddress.device_ID = deviceInfo.uuid;
				changedAddress.device_Manufacturer = deviceInfo.device_Manufacturer;
				changedAddress.device_Serial = deviceInfo.device_Serial;
				changedAddress.device_IPAddress = deviceInfo.device_IPAddress;
				changedAddress.device_MacAddress = deviceInfo.device_MacAddress;
				changedAddress.location = "";
				changedAddress.osVersion = deviceInfo.osVersion;
				changedAddress.apVersion = localStorage.getItem('device_version');
			} else {
				if (JSON.parse(localStorage.getItem('browserInfo')).lat_long) {
					var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;
				} else {
					var local_browserInfo = "blocked"
				}

				changedAddress.device_Model = "";
				changedAddress.device_Platform = "WEB";
				changedAddress.device_ID = "";
				changedAddress.device_Manufacturer = "";
				changedAddress.device_Serial = "";
				changedAddress.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
				changedAddress.device_MacAddress = "";
				changedAddress.location = local_browserInfo;
				changedAddress.osVersion = "";
				changedAddress.apVersion = "";
			}




			$scope.netWork(function (status) {
				if (status) {
					request.service('uploadShipToAddress', 'post', changedAddress, function (res) {
						$scope.loader(false);
						if (res.statusCode == 200) {
							if (res.updateMandate == 'NO') {
								$scope.bank_check_appUpdate();
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
					$uibModalInstance.close(changedAddress);
				}
			});
		});
	}


	$scope.err = {};



	function validateShipAddressForm(changedAddress, cb) {

     if (!$scope.shipadd.Ship_to_Name) {
			$scope.err.Ship_to_Name= true;
		} else {
			delete $scope.err.Ship_to_Name;
		}

		if (!changedAddress.street1) {
			$scope.err.street1 = true;
		} else {
			delete $scope.err.street1;
		}
		/*if (!changedAddress.s1) {
		    $scope.err.s1 = true;
		} else {
		    delete $scope.err.s1;
		}*/
		//        if (!changedAddress.street2) {
		//            $scope.err.street2 = true;
		//        } else {
		//            delete $scope.err.street2;
		//        }
		//        if (!changedAddress.street3) {
		//            $scope.err.street3 = true;
		//        } else {
		//            delete $scope.err.street3;
		//        }


		/////////////////////////////////////////////////
		// if (changedAddress.indicatorStatus != true) {

		if (!$scope.shipadd.ContactName) {
   			$scope.err.ContactName= true;
  		} else {
   			delete $scope.err.ContactName;
  		
		}



		if (!changedAddress.city) {
			$scope.err.city = true;
		} else {
			delete $scope.err.city;
		}
		// if (!changedAddress.taluk) { $scope.err.taluk = true; } else { delete $scope.err.taluk; }
		if (!changedAddress.taluk) changedAddress.taluk = "";
		delete $scope.err.taluk;
		if (!changedAddress.district) {
			$scope.err.district = true;
		} else {
			delete $scope.err.district;
		}
		if (!changedAddress.state) {
			$scope.err.state = true;
		} else {
			delete $scope.err.state;
		}
		if (!changedAddress.country) {
			$scope.err.country = true;
		} else {
			delete $scope.err.country;
		}
		if (!changedAddress.pin) {
			$scope.err.pin = true;
		} else {
			delete $scope.err.pin;
		}
		if ($scope.shipadd.pin && $scope.shipadd.pin.toString().length != 6) {
			$scope.err.pinLength = true;
		} else {
			delete $scope.err.pinLength;
		}

		// }

		/////////////////////////////////////////////////

		if (!changedAddress.email) {
			$scope.err.email = true;
		} else {
			delete $scope.err.email;
		}
		if (!changedAddress.mobile) {
			$scope.err.mobile = true;
		} else {
			delete $scope.err.mobile;
		}
		if (changedAddress.mobile && changedAddress.mobile.toString().length != 10) {
			$scope.err.mobileNumberLength = true;
		} else {
			delete $scope.err.mobileNumberLength;
		}
		if (!changedAddress.alternate_Mobile) {
			changedAddress.alternate_Mobile = ""
		}
		delete $scope.err.alternate_Mobile;
		delete $scope.err.alternateMobileNumberLength;
		if (changedAddress.alternate_Mobile && changedAddress.alternate_Mobile.toString().length != 10) {
			$scope.err.alternateMobileNumberLength = true;
		}

		indicateShipToAddress(changedAddress, function (shipadd) {
			if (shipadd.indicator) {
				/*if (!changedAddress.image) {
	$scope.err.image = true;
} else {
	delete $scope.err.image;
}*/
			} else {
				//delete $scope.err.image;
			}
			if (Object.keys($scope.err).length == 0) {
				if (cb) cb();
			} else {
				$scope.loader(false);
				$scope.notification("Some fields are missing.");
			}
		})
	}


	// watch of validation here
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


	var street1 = '';
	$scope.$watch('shipadd.street1', function (val) {
		if (val == 0) {
			$scope.shipadd.street1 = '';
		}
		if (val && val.length) {
			// !val.match(/^[a-zA-Z\s]*$/) ||
			if (val.length > 50) {
				if (val.length != 1) {
					$scope.shipadd.street1 = street1;
				} else {
					$scope.shipadd.street1 = '';
				}
			} else {
				street1 = val;
			}
		}
	});

	var s1 = '';
	$scope.$watch('shipadd.s1', function (val) {
		if (val == 0) {
			$scope.shipadd.s1 = '';
		}
		if (val && val.length) {
			// !val.match(/^[a-zA-Z\s]*$/) ||
			if (val.length > 50) {
				if (val.length != 1) {
					$scope.shipadd.s1 = s1;
				} else {
					$scope.shipadd.s1 = '';
				}
			} else {
				s1 = val;
			}
		}
	});
	//    var street2 = '';
	//    $scope.$watch('shipadd.street2', function (val) {
	//        if (val == 0) {
	//            $scope.shipadd.street2 = '';
	//        }
	//        if (val && val.length) {
	//            // !val.match(/^[a-zA-Z\s]*$/) ||
	//            if (val.length > 30) {
	//                if (val.length != 1) {
	//                    $scope.shipadd.street2 = street2;
	//                } else {
	//                    $scope.shipadd.street2 = '';
	//                }
	//            } else {
	//                street2 = val;
	//            }
	//        }
	//    });

	//    var street3 = '';
	//    $scope.$watch('shipadd.street3', function (val) {
	//        if (val == 0) {
	//            $scope.shipadd.street3 = '';
	//        }
	//        if (val && val.length) {
	//            // !val.match(/^[a-zA-Z\s]*$/) ||
	//            if (val.length > 30) {
	//                if (val.length != 1) {
	//                    $scope.shipadd.street3 = street3;
	//                } else {
	//                    $scope.shipadd.street3 = '';
	//                }
	//            } else {
	//                street3 = val;
	//            }
	//        }
	//    });

	var taluk = '';
	$scope.$watch('shipadd.taluk', function (val) {
		if (val == 0) {
			$scope.shipadd.taluk = '';
		}
		if (val && val.length) {
			if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 20) {
				if (val.length != 1) {
					$scope.shipadd.taluk = taluk;
				} else {
					$scope.shipadd.taluk = '';
				}
			} else {
				taluk = val;
			}
		}
	});

	var district = '';
	$scope.$watch('shipadd.district', function (val) {
		if (val == 0) {
			$scope.shipadd.district = '';
		}
		if (val && val.length) {
			if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 20) {
				if (val.length != 1) {
					$scope.shipadd.district = district;
				} else {
					$scope.shipadd.district = '';
				}
			} else {
				district = val;
			}
		}
	});

	var city = '';
	$scope.$watch('shipadd.city', function (val) {
		if (val == 0) {
			$scope.shipadd.city = '';
		}
		if (val && val.length) {
			if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 30) {
				if (val.length != 1) {
					$scope.shipadd.city = city;
				} else {
					$scope.shipadd.city = '';
				}
			} else {
				city = val;
			}
		}
	});

	var state = '';
	$scope.$watch('shipadd.state', function (val) {
		if (val == 0) {
			$scope.shipadd.state = '';
		}
		if (val && val.length) {
			if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 30) {
				if (val.length != 1) {
					$scope.shipadd.state = state;
				} else {
					$scope.shipadd.state = '';
				}
			} else {
				state = val;
			}
		}
	});

	var pin = '';
	$scope.$watch('shipadd.pin', function (val) {
		if (val == 0) {
			$scope.shipadd.pin = '';
		}
		if (val) {
			if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 6) {
				if (val.toString().length != 1) {
					$scope.shipadd.pin = pin;
				} else {
					$scope.shipadd.pin = '';
				}
			} else {
				pin = val;
			}
		}
	});

	var email = '';
	$scope.$watch('shipadd.email', function (val) {
		if (val) {
			if (val.length > 40) {
				$scope.shipadd.email = email;
			} else {
				email = val;
			}
		};
	});

	var mobileNum = '';
	$scope.$watch('shipadd.mobile', function (val) {
		if (val == 0) {
			$scope.shipadd.mobile = '';
		}
		if (val) {
			if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
				if (val.toString().length != 1) {
					$scope.shipadd.mobile = mobileNum;
				} else {
					$scope.shipadd.mobile = '';
				}
			} else {
				mobileNum = val;
			}
		}
	});

var primaryContactname = '';
 $scope.$watch('shipadd.ContactName', function (val) {

  if (val == 0) {
   $scope.shipadd.ContactName = '';
  }
  if (val) {
   if (!val.toString().match(/^[^0-9]*$/)) {
    if (val.toString().length != 1) {
     $scope.shipadd.ContactName = primaryContactname;
    } else {
     $scope.shipadd.ContactName = '';
    }
   } else {
    primaryContactname = val;
   }
  }
 });

	var alternate_Mobile = '';
	$scope.$watch('shipadd.alternate_Mobile', function (val) {
		if (val == 0) {
			$scope.shipadd.alternate_Mobile = '';
		}
		if (val) {
			if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
				if (val.toString().length != 1) {
					$scope.shipadd.alternate_Mobile = alternate_Mobile;
				} else {
					$scope.shipadd.alternate_Mobile = '';
				}
			} else {
				alternate_Mobile = val;
			}
		}
	});

	$scope.bank_check_appUpdate = function () {

		//request.getItem('currentuser');
		if ($scope.ifMobile) {
			if (cordova.getAppVersion) {
				cordova.getAppVersion(function (version) {

					$scope.app_ver = version;

					request.service('MobileBuildVersionCheck', 'post', $scope.currUser, function (res) {

						if (request.getItem('app_cancledate') != undefined) {
							var past_acceptdate = request.getItem('app_cancledate');
							var past_acceptdate1 = Number(past_acceptdate);
							var verdate_date1 = new Date(past_acceptdate1);
							var verdate_date2 = new Date();
							$scope.diffDays_diff = parseInt((verdate_date2 - verdate_date1) / (1000 * 60 * 60 * 24));

						}

						if (($scope.app_ver != res.VersionControle.build_version) && (request.getItem('app_cancledate') == undefined)) {

							request.setItem('appversion', res.VersionControle.build_version);
							$scope.openversModal(res.VersionControle.updateMandate);

						} else if (($scope.app_ver != res.VersionControle.build_version) && (request.getItem('app_cancledate') != undefined) && ($scope.diffDays_diff >= 2)) { /*&& (diffDays >= 2)*/
							request.setItem('appversion', res.VersionControle.build_version);
							$scope.openversModal(res.VersionControle.updateMandate);

						}

					});

				});
			}
		}
	};




	$scope.openversModal = function (data) {
		var modalInstance = $uibModal.open({
			backdrop: 'static',
			templateUrl: 'pages/update_version.html',
			size: 'md',
			animation: true,
			keyboard: false,
			resolve: {
				items: function () {
					return {
						appupdate_status: data,
					}
				}
			},
			controller: ['$scope', '$uibModalInstance', 'items', function ($scope, $uibModalInstance, items) {
				$scope.items = items

				if ($scope.items.appupdate_status == 'YES') {
					$scope.cancel = function () {
						$uibModalInstance.close('cancel');
					};
				} else {
					$scope.cancel = function () {
						request.setItem('app_nocount', '1');


						var last_cancle = new Date();
						var last_cancle_ts = Date.parse(last_cancle);
						request.setItem('app_cancledate', last_cancle_ts.toString());


						var appcount = request.getItem('app_nocount');
						$uibModalInstance.close('no');
					};
				}



				$scope.update_ver = function () {
					if (device.platform == 'Android') {
						window.open('https://play.google.com/store/apps/details?id=com.ionicframework.penna', '_system', 'location=yes');
					} else {
						window.open("https://itunes.apple.com/us/app/penna-care/id1218665210?mt=8", '_system', 'location=yes');
					}
				};

                }]
		});

		modalInstance.result.then(function (res) {
			if (res == 'cancel') {
				$scope.logout();
			}
		}, function (err) {});
	};


});
