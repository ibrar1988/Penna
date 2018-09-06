pennaApp.controller('orderstab', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $timeout, $location, $filter, mobile, $sce, $rootScope, $interval) {


	/*request.service('getNoOfPendingPoDs', 'post', $scope.currUser, function (res) {
	$scope.pods_no = res.NoOfPoDs

});*/


	if ($location.path() == '/orders') {
        $timeout(function () {
		if (request.getObj('compConfig').CreateOrder == 'NO') {
			$scope.ordsershiding = false;
		}
		if (request.getObj('compConfig').CreateOrder == 'YES') {
			$scope.ordsershiding = true;
		}
        }, 1000)

		$timeout(function () {
			$scope.productlistdetails = "";
			$scope.productlist = '';
			ctrlComm.del('productlist1');
			ctrlComm.del('productlistdetails');
			ctrlComm.del('editkeys');
			ctrlComm.del('editKey');
		}, 100)

		//////////////////no.of pods //////////////

		request.service('getNoOfPendingPoDs', 'post', $scope.currUser, function (res) {
			$scope.pods_no = res.NoOfPoDs

		});
		//////////////////close  no.of pods //////////////

		//location.reload();


	}




	$scope.gobackorder = function () {
		// location.reload();
		/* $timeout(function () {
		     $scope.productlistdetails = "";
		     $scope.productlist = '';
		     ctrlComm.del('productlist1');
		     ctrlComm.del('productlistdetails');
		     ctrlComm.del('editkeys');
		     ctrlComm.del('editKey');
		     ctrlComm.del('productlist1');
		     ctrlComm.del('productlistdetails');
		     ctrlComm.del('productlistdetails');
		     ctrlComm.del('productldetail');
		 }, 100)*/

		$state.go('orders', null, {
			reload: true
		});


		$timeout(function () {
			// location.reload();
			$scope.productlistdetails = "";
			$scope.productlistdetails = [];
			$scope.productlist = '';
			ctrlComm.del('productlist1');
			ctrlComm.del('productlistdetails');
			ctrlComm.del('editkeys');
			ctrlComm.del('editKey');
			ctrlComm.del('productlist1');
			ctrlComm.del('productlistdetails');
			ctrlComm.del('productlistdetails');
			ctrlComm.del('productldetail');
		}, 100)




	}




	$scope.orderpage = function (key) {


          request.service('getTradeConfig', 'post', $scope.currUser, function (res) {

                           if (res.statusCode == '200') {
                                     $scope.compConfig=res.companyTypes[0];
                          request.setObj('compConfig', $scope.compConfig)

        if ($scope.compConfig.CreateOrder == 'YES') {

		request.service('getNoOfPendingPoDs', 'post', $scope.currUser, function (res) {

             if (res.statusCode == '200') {
			if (res.NoOfPoDs <= res.podLimit) {


				ctrlComm.put('ordersKey', key);

				$scope.netWork(function (status) {
					if (status) {
						$state.go('orders.create-new-order.select-product-tab', {}, {
							reload: true
						});
						//location.reload();

					} else {
						$scope.notification("You are in Offline . Please try orders once you are Online.", 4000, 'info');
					}
				});

			} else {
				$scope.notification("Please confirm your pending POD'S to place further Orders !", 4000, 'info');

			}
			}else if(res.statusCode == "404"){
                $scope.loader(false);
                $scope.notification(res.statusMessage, 4000, "danger");
               $scope.logout();
            }else{
                $scope.loader(false);
                $scope.notification(res.statusMessage, 4000, "danger");
            }




		});



	}else{
        $scope.ordsershiding = false;
    }

                                 }
          })



	}


});


pennaApp.controller('OrderDetails', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $timeout, $location, $filter, mobile, $sce, $rootScope, $interval) {

	$scope.location = $location.path();
	$scope.shipToAddress = 'address1';
	$scope.layout = 'list';

	$scope.uiRouterState = $state;

	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	};




	$scope.selectpro = function () {
		$state.go("orders.create-new-order.select-product-tab");
	}


	$scope.getcreateorder = function (productlist) {
		ctrlComm.put('productlist1', productlist)
		$state.go('orders.create-new-order.order-details-tab')
	};



	$scope.openPo = function () {
		$scope.openPo.opened = true;
	};

	$scope.openDd = function () {
		$scope.openDd.opened = true;
	};

	///////////  create orders here start --------------------


	$scope.myInterval = 3000;
	$scope.noWrapSlides = false;
	$scope.active = 0;
	$scope.slides = [];
	$scope.productnames = [];

	$scope.getproducts = function () {
		$scope.loader(true);
		request.service('getProductList', 'post', $scope.currUser, function (res) {
			$scope.loader(false);
			if (res.products) {
				$scope.product_lists = res.products;
				if ($scope.product_lists) {
					for (var k = 0; k < $scope.product_lists.length; k++) {
						$scope.slides.push({
							productName: $scope.product_lists[k].productName,
							price: $scope.product_lists[k].price,
							productDescription: $scope.product_lists[k].productDescription,
							image: $scope.product_lists[k].image
						});
                        $scope.productnames.push({
							productName: $scope.product_lists[k].productName,
						});

                        ctrlComm.put('productnames',  $scope.productnames);

					}
				}
			}

			if (res.dupLogin) {
				$scope.logout();
				$scope.notification(res.statusMessage, 4000);
			}



		});
	}



	// conform order here ---------------------




	if ($location.path() == '/orders/create-new-order/select-product-tab') {
		if (ctrlComm.get('success')) {
			//location.reload();
		}

		//ctrlComm.del('editKey');

		$('#a').addClass('active');
		$('#b').removeClass('active');
		$('#c').removeClass('active');
		$('#d').removeClass('active');

		$scope.productlist = '';
		$scope.productlist = {};
		ctrlComm.del('success')
	}

	//here sumary page contain data then user came to select product then page reload.

	if ($location.path() == '/orders/create-new-order/select-product-tab' && ctrlComm.get('productlistdetails') != undefined) {

		/* if (ctrlComm.get('editKeyss') != 'true') {
     location.reload();
 }*/


	}

});


pennaApp.controller('addformorder', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $timeout, $location, $filter, mobile, $sce, $rootScope, $interval) {
	$scope.uiRouterState = $state;
	$scope.location = $location.path();
	if ($location.path() == '/orders/create-new-order/order-details-tab') {
		$('#b').addClass('active');
		$('#a').removeClass('active');
		$('#c').removeClass('active');
		$('#d').removeClass('active');
	}

    console.log('productnames',ctrlComm.get('productnames'));

    $scope.productnames = ctrlComm.get('productnames')

	$scope.popup1 = function () {
	};


    if(request.getObj('compConfig').CreateScheduleLine == "NO"){
            $scope.scheduledelivery_order = 'sdiyes';
     }



	$scope.orderdetails = function () {

		$state.go("orders.create-new-order.order-details-tab");

	}

	$scope.productlist = ctrlComm.get('productlist1');



	shiptoadress_list(function () {});


	function shiptoadress_list() {


		request.service('getShippingAddresses', 'post', $scope.currUser, function (res) {
			if (res) {
				$scope.shipadrr = res.companyAddress;


				if ($scope.shipadrr) {
					for (i = 0; i < $scope.shipadrr.length; i++) {

						$scope.shipadrr[i].addrsship = $scope.shipadrr[i].custName;
					}
				}
			} else if (res.dupLogin) {
				$scope.logout();
				$scope.notification(res.statusMessage, 4000);
			}

		});


	}




	$scope.mobileno = function (e) {
		$scope.productlist.phonenumber = parseInt(e.mobile);

	}

	$scope.productlistdetailsss = ctrlComm.get('productlistdetails');

    $scope.scheduledateyes = new Date();


	$scope.err = {};

	function validateorders(cb) {
           console.log('$scope.err',$scope.err);
		if (!$scope.productlist.quantity || $scope.productlist.quantity <= 0.0) {
			$scope.err.quantity = true;
		} else {
			delete $scope.err.quantity;
		}
		/*if ($scope.productlistdetailsss == undefined) {
    if ($scope.details[0].Phone == 'YES') {
        if (!$scope.productlistdetails[0]) {
            if (!$scope.productlist.phonenumber) {
                $scope.err.phonenumber = true;
            } else {
                delete $scope.err.phonenumber;
            }
        }
    }
}*/

		if ($scope.productlistdetailsss == undefined) {
			if ($scope.details[0].ShippingAddress == 'YES') {
				if (!$scope.productlistdetails[0]) {

					if (!$scope.productlist.shipToAddress) {
						$scope.err.shipToAddress = true;
					} else {
						delete $scope.err.shipToAddress;
					}
				}
			}
		}

		if ($scope.details[0].PlantorDepo == 'YES') {
			if (!$scope.productlist.plant) {
				$scope.err.plant = true;
			} else {
				delete $scope.err.plant;
			}
		}

		if ($scope.productlist.driverMobileNumber && $scope.productlist.driverMobileNumber.toString().length != 10) {
			$scope.err.driverMobileNumber = true;
		} else {
			delete $scope.err.driverMobileNumber;
		}

		if ($scope.details[0].Packaging == 'YES') {
			if (!$scope.productlist.packaging) {
				$scope.err.packaging = true;
			} else {
				delete $scope.err.packaging;
			}
		}

		if ($scope.details[0].packagingTypes == 'YES') {
			if (!$scope.productlist.packagingType) {
				$scope.err.packagingType = true;
			} else {
				delete $scope.err.packagingType;
			}
		}

		if ($scope.details[0].Transport == 'YES') {
			if (!$scope.productlist.transport) {
				$scope.err.transport = true;
			} else {
				delete $scope.err.transport;
			}
		}

		if ($scope.details[0].Sourceofdelivary == 'YES') {
			if (!$scope.productlist.transporter) {
				$scope.err.transporter = true;
			} else {
				delete $scope.err.transporter;
			}
		}

		if ($scope.details[0].IncoTerms == 'YES') {
			if (!$scope.productlist.incoterms) {
				$scope.err.incoterms = true;
			} else {
				delete $scope.err.incoterms;
			}
		}

		if ($scope.details[0].CFormNumber == 'YES') {
			if (!$scope.productlist.cform) {
				$scope.err.cform = true;
			} else {
				delete $scope.err.cform;
			}
		}

        console.log('$scope.details[0].PaymentTerms',$scope.details[0].PaymentTerms);
		if ($scope.details[0].PaymentTerms == 'YES') {
			if (!$scope.productlist.paymenttype) {
				$scope.err.paymenttype = true;
			} else {
				delete $scope.err.paymenttype;
			}
		}else{
            delete $scope.err.paymenttype;
        }

		if ($scope.details[0].POOrderNumber == 'YES') {
			if (!$scope.productlist.poordernumber) {
				$scope.err.poordernumber = true;
			} else {
				delete $scope.err.poordernumber;
			}
		}

		if ($scope.details[0].POdate == 'YES') {
			if (!$scope.productlist.podate) {
				$scope.err.podate = true;
			} else {
				delete $scope.err.podate;
			}
		}
		/*if (!$scope.productlist.image) {
    $scope.err.image = true;
} else {
    delete $scope.err.image;
}*/
		if ($scope.details[0].Notes == 'YES') {
			if (!$scope.productlist.notes) {
				$scope.err.notes = true;
			} else {
				delete $scope.err.notes;
			}
		}


		if (!$scope.productlist.scheduledelivery) {
			$scope.err.scheduledelivery = true;
		} else {
			delete $scope.err.scheduledelivery;
		}


		if ($scope.productlist.scheduledelivery == 'sdino') {
			var schedule = false;
			for (i in $scope.schedulelines) {

                if ($scope.schedulelines[i].schedulequantity && $scope.schedulelines[i].scheduledate) {
                     delete $scope.schedulelines[i].quantityErr;
                     delete $scope.schedulelines[i].dateErr;
                }else if(!$scope.schedulelines[i].schedulequantity && $scope.schedulelines[i].scheduledate){
                          $scope.schedulelines[i].quantityErr = true;
					       schedule = true;
                 }else if($scope.schedulelines[i].schedulequantity && !$scope.schedulelines[i].scheduledate){
                          $scope.schedulelines[i].dateErr = true;
					      schedule = true;
                }else{
                     delete $scope.schedulelines[i].quantityErr;
                     delete $scope.schedulelines[i].dateErr;
                }

				/*if ($scope.schedulelines[i].schedulequantity) {
					delete $scope.schedulelines[i].quantityErr;
				} else {
					$scope.schedulelines[i].quantityErr = true;
					schedule = true;
				}*/
				/*if ($scope.schedulelines[i].scheduledate) {
					delete $scope.schedulelines[i].dateErr;
				} else {
					$scope.schedulelines[i].dateErr = true;
					schedule = true;
				}*/
			}
		}

         console.log('Object.keys($scope.err).length ',Object.keys($scope.err).length );
         console.log('$scope.err ',$scope.err );
         console.log('schedule ',schedule );

		if ($scope.productlist.scheduledelivery == 'sdino') {
			if (Object.keys($scope.err).length == 0 && schedule == false) {
				if (cb) cb();
			}
		} else if ($scope.productlist.scheduledelivery == 'sdiyes') {
			if (Object.keys($scope.err).length == 0) {
				if (cb) cb();
			}
		}else{
            if (Object.keys($scope.err).length == 0) {
				if (cb) cb();
			}
        }


	}

	request.service('getShippingConfig', 'post', $scope.currUser, function (res) {
		$scope.details = res.OrderConfig;

	});


	//save here for

	$scope.schedulelines = [{
		schedulequantity: undefined,
		scheduledate: undefined
    }];

	$scope.addschedulelines = function (index) {

		$scope.schedulelines.push({
			id: index,
			schedulequantity: undefined,
			scheduledate: undefined
		});


	}


	$scope.demo = function (val, i) {
 		var squnum = ''
 		if (val == 0) {
 			$scope.schedulelines[i].schedulequantity = '';
 		}
 		if (val) {
			if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 18) {
				if (val.toString().length != 1) {
					$scope.schedulelines[i].schedulequantity = squnum;
				}
				/*else {
    $scope.schedulelines[i].schedulequantity = '';
}*/
 			} else {
				squnum = val;
			}
		}
	}


	$scope.removeschedulelines = function (index) {
		$scope.schedulelines.splice(index, 1);
	}


	if (ctrlComm.get('editKey') == undefined && ctrlComm.get('editKeys') == undefined) {
        console.log('data');
		$scope.open = function (data) {

			var data = data;


			var pro_len = $scope.productlistdetails.length;
			validateorders(function () {
				$scope.askConfrimation("", function () {

					var input = {};

					input.userId = $scope.currUser.userId;
					input.accessToken = $scope.currUser.accessToken;
					input.OrderLines = [];

					var params = {};
					params.productName = $scope.productlist.productName;
					params.cform = data.cform;
					//params.img = " ";
					params.incoterms = data.incoterms;

					if (data.incoterms != 'EXWorksGoDown') {
						//$scope.authenticationLetter = "";


						params.truckNumber = "";
						params.driverName = "";
						params.driverMobileNumber = "";
						params.img_authenticationLetter = "";


					} else {
						params.img_authenticationLetter = $scope.productlist.authenticationLetter;
						params.truckNumber = data.truckNumber;
						params.driverName = data.driverName;
						params.driverMobileNumber = data.driverMobileNumber;


					}




					params.pro_id = pro_len + 1;
					params.name = data.name;
					params.notes = data.notes;
					params.packaging = data.packaging;
					params.packagingType = data.packagingType;
					params.paymenttype = data.paymenttype;
					params.phonenumber = data.phonenumber;
					params.scheduledelivery = data.scheduledelivery;
					params.plant = data.plant;
					params.podate = data.podate;
					params.poordernumber = data.poordernumber;
					params.quantity = data.quantity;


					if (!$scope.productlistdetails[0]) {
						params.shipToAddress = data.shipToAddress;
						params.phonenumber = data.phonenumber;
					} else {
						params.shipToAddress = $scope.productlistdetails[0].OrderLines[0].shipToAddress;
						params.phonenumber = $scope.productlistdetails[0].OrderLines[0].phonenumber;;
					}

					params.transport = data.transport;
					params.transporter = data.transporter;
					params.ScheduleLines = [];
					var params1 = {};
					var sum = 0;

					for (var i = 0; i < $scope.schedulelines.length; i++) {
                        console.log('schedulequantity',$scope.schedulelines[i].schedulequantity);

                          if($scope.schedulelines[i].schedulequantity == undefined){
                               $scope.schedulelines[i].schedulequantity = 0;
                             }

						var sum = Number($scope.schedulelines[i].schedulequantity) + sum;
					}

					if (data.scheduledelivery == 'sdino') {
                        console.log('sdino',sum,data.quantity);

                        if(sum != 0){

                            for (var i = 0; i < $scope.schedulelines.length; i++) {
                                 console.log('$scope.schedulelines[i]',$scope.schedulelines[i])

                                if($scope.schedulelines[i].schedulequantity == 0){
                                    $scope.schedulelines.splice(i,1);
                                   }

                            }

						if (sum <= data.quantity) {
                                 console.log('$scope.schedulelines',$scope.schedulelines);
							var params1 = $scope.schedulelines;
							params.ScheduleLines = params1;
							input.OrderLines.push(params);
							ctrlComm.put('productlistdetails', input)
							$state.go("orders.create-new-order.order-summary-tab");
						} else {
							$scope.notification("Dear Customer, Total Scheduled Quantity Exceeded, Please make sure Total Scheduled Quantity should not be more than " + data.quantity + " MT", 4000, 'danger');
						}

                    }else{
                        params.ScheduleLines = []; //= params1;
						input.OrderLines.push(params);
                        console.log('input',input);
						ctrlComm.put('productlistdetails', input)
						$state.go("orders.create-new-order.order-summary-tab");

                    }



					} else if((data.scheduledelivery == 'sdiyes')) {
						params1.scheduledate = new Date();;
						params1.schedulequantity = data.quantity;
						params.ScheduleLines.push(params1); //= params1;
						input.OrderLines.push(params);
						ctrlComm.put('productlistdetails', input)
						$state.go("orders.create-new-order.order-summary-tab");
					}else{


						params.ScheduleLines = []; //= params1;
						input.OrderLines.push(params);
                        console.log('input',input);
						ctrlComm.put('productlistdetails', input)
						$state.go("orders.create-new-order.order-summary-tab");

                    }


					if ($scope.productlistdetails.length > 0 && ctrlComm.get('editKey') == undefined) {
						//alert("comming push");
						for (j = 0; j < $scope.productlistdetails.length; j++) {


							var params = $scope.productlistdetails[j].OrderLines[0];

							input.OrderLines.push(params);


						}

					}


				})
			})


		};


		//add multiple products to the user
		function readURL(e) {
			if (this.files && this.files[0]) {
				var reader = new FileReader();
				$(reader).load(function (e) {
					$('#previewImg').attr('src', e.target.result).css('display', 'block');
				});
				reader.readAsDataURL(this.files[0]);
			} else {
				$('#previewImg').css('display', 'none');
			}
		};

		$scope.mobileUploadAttachment1 = function () {
			document.getElementById('addAunticationLetter').click();
			mobile.chooseImage(function (img) {
				$rootScope.safeApply(function () {
					$scope.productlist.authenticationLetter = img;
				});
			});
		}

		/*$scope.imguploadsugg = function (shipadd) {
			$scope.currShipAddrs = shipadd;
		}*/
		$scope.changeFile = function (element) {
			var params = {}
			params.userId = $scope.currUser.userId;
			params.accessToken = $scope.currUser.accessToken;
			//params.accessToken = $scope.currUser.accessToken;

			var oData = new FormData(document.getElementById("csvForm"));
			oData.append("jsondata", JSON.stringify(params));
			$.ajax({
				url: request.setup.url('uploadShipToAddress'),
				data: oData,
				processData: false,
				contentType: false,
				type: 'POST',
				success: function (res) {
					$rootScope.safeApply();
					if (res.statusCode == "200") {
						// $state.go('profile.ship-address', null, {
						//     reload: true
						// });
					} else if (res.dupLogin) {
						$scope.logout();
						$scope.notification(res.statusMessage, 4000);
					} else {
						$scope.notification(res.statusMessage, 4000);
					}
				},
				error: function (err) {
				}
			});
		}




		$scope.imageSelected1 = function () {
			delete $scope.err.authenticationLetter;
			var ele = document.getElementById('addAunticationLetter');
			var file = ele.files[0];
			var size_img = file.size / 1048576;
			var size_img1 = size_img.toFixed(0);

			if (size_img1 <= 1) {
				var reader = new FileReader();
				reader.onload = function () {
					$rootScope.safeApply(function () {
						$scope.productlist.authenticationLetter = reader.result;
					});
				}
				reader.readAsDataURL(file);
			} else {
				$scope.notification("File size must be less than 1 MB", 4000);
			}

		}





		$scope.addmoreproduct = function (productlist, keys) {
			//  alert("sdfsdf")
			var pro_len = $scope.productlistdetails.length;
			$scope.productlist = productlist;
			ctrlComm.put('editkeyss', keys)
			validateorders(function () {

				$scope.askConfrimation("", function () {

					var input = {};

					input.userId = $scope.currUser.userId;
					input.accessToken = $scope.currUser.accessToken;
					input.OrderLines = [];
					var params = {};
					params.productName = $scope.productlist.productName;
					params.cform = $scope.productlist.cform;
					//params.img = " ";
					params.incoterms = $scope.productlist.incoterms;


					if (params.incoterms != 'EXWorksGoDown') {
						//$scope.authenticationLetter = "";

						params.truckNumber = "";
						params.driverName = "";
						params.driverMobileNumber = "";
						params.img_authenticationLetter = "";

					} else {
						params.truckNumber = data.truckNumber;
						params.driverName = data.driverName;
						params.driverMobileNumber = data.driverMobileNumber;
						params.img_authenticationLetter = $scope.productlist.authenticationLetter;

					}

					/*params.truckNumber = data.truckNumber;
					params.driverName = data.driverName;
					params.driverMobileNumber = data.driverMobileNumber;
					params.img = $scope.productlist.authenticationLetter;*/


					params.name = $scope.productlist.name;
					params.notes = $scope.productlist.notes;
					params.pro_id = pro_len + 1;
					params.packaging = $scope.productlist.packaging;
					params.packagingType = $scope.productlist.packagingType;
					params.paymenttype = $scope.productlist.paymenttype;
					params.phonenumber = $scope.productlist.phonenumber;
					params.plant = $scope.productlist.plant;
					params.podate = $scope.productlist.podate;
					params.poordernumber = $scope.productlist.poordernumber;
					params.scheduledelivery = $scope.productlist.scheduledelivery;
					params.quantity = $scope.productlist.quantity;
					params.shipToAddress = $scope.productlist.shipToAddress;
					params.transport = $scope.productlist.transport;
					params.transporter = $scope.productlist.transporter;
					params.ScheduleLines = [];
					var params1 = {};
					var total = 0;

					for (var i = 0; i < $scope.schedulelines.length; i++) {
                        console.log('total',$scope.schedulelines[i].schedulequantity);
						total += Number($scope.schedulelines[i].schedulequantity);


					}
					if ($scope.productlist.scheduledelivery == 'sdino') {
						if (total <= $scope.productlist.quantity) {
							var params1 = $scope.schedulelines;
							params.ScheduleLines = params1;
							input.OrderLines.push(params);
							$scope.productlistdetails.push(input);
							ctrlComm.put('productlistdetails', $scope.productlistdetails)
							$state.go('orders.create-new-order.select-product-tab')
						} else {
							$scope.notification("Dear Customer, Total Scheduled Quantity Exceeded, Please make sure Total Scheduled Quantity should not be more than" + $scope.productlist.quantity+" MT", 4000, 'danger');
						}
					} else {
						params1.scheduledate = new Date();
						params1.schedulequantity = $scope.productlist.quantity;
						params.ScheduleLines.push(params1);
						input.OrderLines.push(params);
						$scope.productlistdetails.push(input);
						ctrlComm.put('productlistdetails', $scope.productlistdetails)
						$state.go('orders.create-new-order.select-product-tab')
					}


				})

			});
		}
	}


	if (ctrlComm.get('editkeys') == 'true' && ctrlComm.get('editKey') == 'true') {

       console.log('check two')
		$scope.productlistdetails = ctrlComm.get('productlistdetails');
		$scope.editKeys = ctrlComm.get('editkeys');

		var Pro_len = $scope.productlistdetails.OrderLines.length;

		$timeout(function () {
			$scope.productlistdetails = $scope.productlistdetails.OrderLines[0];
		}, 100)


		$scope.open = function (data) {

			var data = data;


			validateorders(function () {
				$scope.askConfrimation("", function () {
					/*validateorders(function () {*/
					var input = {};

					input.userId = $scope.currUser.userId;
					input.accessToken = $scope.currUser.accessToken;
					input.OrderLines = [];

					var params = {};
					params.productName = $scope.productlist.productName;
					params.cform = data.cform;
					//params.img = " ";
					params.incoterms = data.incoterms;

					if ($data.incoterms != 'EXWorksGoDown') {
						//$scope.authenticationLetter = "";
						params.truckNumber = "";
						params.driverName = "";
						params.driverMobileNumber = "";
						params.img_authenticationLetter = "";

					} else {

						params.img_authenticationLetter = $scope.productlist.authenticationLetter;
						params.truckNumber = data.truckNumber;
						params.driverName = data.driverName;
						params.driverMobileNumber = data.driverMobileNumber;

					}
					params.name = data.name;
					params.notes = data.notes;
					params.pro_id = Pro_len + 1;
					params.packaging = data.packaging;
					params.packagingType = data.packagingType;
					params.paymenttype = data.paymenttype;
					params.phonenumber = data.phonenumber;
					params.scheduledelivery = data.scheduledelivery;
					params.plant = data.plant;
					params.podate = data.podate;
					params.poordernumber = data.poordernumber;
					params.quantity = data.quantity;
					params.shipToAddress = $scope.productlistdetails.shipToAddress;


					params.transport = data.transport;
					params.transporter = data.transporter;
					params.ScheduleLines = [];
					var params1 = {};
					var sum = 0;

					for (var i = 0; i < $scope.schedulelines.length; i++) {
                          console.log('edit33',$scope.schedulelines[i].schedulequantity);
						var sum = Number($scope.schedulelines[i].schedulequantity) + sum;
					}

					if (data.scheduledelivery == 'sdino') {
                          console.log('sum',sum,data.quantity);
						if (sum <= data.quantity) {

							var params1 = $scope.schedulelines;
							params.ScheduleLines = params1;
							input.OrderLines.push(params);
							$scope.productlistdetails = ctrlComm.get('productlistdetails');
							$scope.productlistdetails.OrderLines.push(input.OrderLines[0])
							$state.go("orders.create-new-order.order-summary-tab");
						} else {
							$scope.notification("Dear Customer, Total Scheduled Quantity Exceeded, Please make sure Total Scheduled Quantity should not be more than " + data.quantity +" MT", 4000, 'danger');
						}


					} else {
						params1.scheduledate = new Date();;
						params1.schedulequantity = data.quantity;
						params.ScheduleLines.push(params1); //= params1;
						input.OrderLines.push(params); //
							//ctrlComm.put('productlistdetails', input)
						$scope.productlistdetails = ctrlComm.get('productlistdetails');
						$scope.productlistdetails.OrderLines.push(input.OrderLines[0])

						$state.go("orders.create-new-order.order-summary-tab");
					}




				})
			});
			/*  })*/


		};


		$scope.addmoreproduct = function (productlist, keys) {

			/* validateorders(function () {*/
			validateorders(function () {
				$scope.askConfrimation("", function () {
						var input = {};
						input.userId = $scope.currUser.userId;
						input.accessToken = $scope.currUser.accessToken;
						input.OrderLines = [];
						var params = {};
						params.productName = productlist.productName;
						params.cform = productlist.cform;
						//params.img = " ";
						params.incoterms = productlist.incoterms;

						if (data.incoterms != 'EXWorksGoDown') {
							//$scope.authenticationLetter = "";
							params.truckNumber = "";
							params.driverName = "";
							params.driverMobileNumber = "";
							params.img_authenticationLetter = "";
						} else {
							params.img_authenticationLetter = $scope.productlist.authenticationLetter;
							params.truckNumber = data.truckNumber;
							params.driverName = data.driverName;
							params.driverMobileNumber = data.driverMobileNumber;


						}



						params.pro_id = Pro_len + 1;
						///params.img = productlist.image;
						params.name = productlist.name;
						params.notes = productlist.notes;
						params.packaging = productlist.packaging;
						params.packagingType = productlist.packagingType;
						params.paymenttype = productlist.paymenttype;
						params.phonenumber = productlist.phonenumber;
						params.scheduledelivery = productlist.scheduledelivery;
						params.plant = productlist.plant;
						params.podate = productlist.podate;
						params.poordernumber = productlist.poordernumber;
						params.quantity = productlist.quantity;
						params.transport = productlist.transport;
						params.transporter = productlist.transporter;
						params.shipToAddress = $scope.productlistdetails.shipToAddress;
						params.ScheduleLines = [];
						var params1 = {};


						var sum = 0;

						for (var i = 0; i < $scope.schedulelines.length; i++) {

							var sum = Number($scope.schedulelines[i].schedulequantity) + sum;
						}




						if (productlist.scheduledelivery == 'sdino') {
							if (sum <= productlist.quantity) {

								var params1 = $scope.schedulelines;
								params.ScheduleLines = params1;
								input.OrderLines.push(params);
								$scope.productlistdetails = ctrlComm.get('productlistdetails');
								$scope.productlistdetails.OrderLines.push(input.OrderLines[0]);
								$state.go("orders.create-new-order.select-product-tab");
							} else {
								$scope.notification("Dear Customer, Total Scheduled Quantity Exceeded, Please make sure Total Scheduled Quantity should not be more than " + data.quantity +" MT", 4000,'danger');
							}
						} else {
							params1.scheduledate = new Date();;
							params1.schedulequantity = productlist.quantity;
							params.ScheduleLines.push(params1);
							input.OrderLines.push(params); //
							$scope.productlistdetails = ctrlComm.get('productlistdetails');
							$scope.productlistdetails.OrderLines.push(input.OrderLines[0])
							$state.go("orders.create-new-order.select-product-tab");
						}



					})
					/* })*/

			});

		}


	}


	$scope.editKey = ctrlComm.get('editKey');




	if ($location.path() == '/orders/create-new-order/order-details-tab' && ctrlComm.get('editKey') == 'true' && ctrlComm.get('editkeys') != 'true') {

         console.log('check one')

		$scope.editKey = ctrlComm.get('editKey');
		//$scope.editKey == 'true'

          $scope.edit_pro = true;

		$scope.productlistdetails = ctrlComm.get('productlistdetails');

		var productldetail1 = ctrlComm.get('productldetail');
		var scheduleline1 = productldetail1.ScheduleLines;
          console.log('scheduleline1',scheduleline1,productldetail1);






		$timeout(function () {
			$scope.productlist = productldetail1;

			//it is for schedulelines data.......................
			if ($scope.productlist.scheduledelivery != 'sdiyes') {

                if(scheduleline1.length == 0){
                      $scope.schedulelines =  [{
                        schedulequantity: undefined,
                        scheduledate: undefined
                     }];
           }else{
                $scope.schedulelines = scheduleline1;
           }

			}

		}, 100)

		$scope.open = function (data) {

			if (data.incoterms != 'EXWorksGoDown') {
				//$scope.authenticationLetter = "";

				data.truckNumber = "";
				data.driverName = "";
				data.driverMobileNumber = "";
				data.img_authenticationLetter = "";

			}
			var schedulelines = $scope.schedulelines;
			validateorders(function () {
				$scope.askConfrimation("", function () {
                      console.log('$scope.productlistdetails',$scope.productlistdetails);
					if (data.scheduledelivery == 'sdiyes') {

						for (i = 0; i < $scope.productlistdetails.OrderLines.length; i++) {
							if ($scope.productlistdetails.OrderLines[i].pro_id == productldetail1.pro_id) {
								var params = {};
								var params1 = {};
								params.ScheduleLines = [];
								params1.scheduledate = new Date();
								params1.schedulequantity = data.quantity;
								productldetail1.ScheduleLines = [];
								productldetail1.ScheduleLines.push(params1)
								$state.go("orders.create-new-order.order-summary-tab");
							}

						}


					} else {


						$scope.scheduleline = schedulelines;
						var total = 0;

						for (var i = 0; i < $scope.schedulelines.length; i++) {
                            console.log('edit444',$scope.schedulelines[i].schedulequantity);
                            if($scope.schedulelines[i].schedulequantity == undefined){
                               $scope.schedulelines[i].schedulequantity = 0;
                             }
							total += Number($scope.schedulelines[i].schedulequantity)


						}



						for (i = 0; i < $scope.productlistdetails.OrderLines.length; i++) {
							if ($scope.productlistdetails.OrderLines[i].pro_id == productldetail1.pro_id) {

                             if(total != 0){
                                    for (var i = 0; i < $scope.schedulelines.length; i++) {
                                          if($scope.schedulelines[i].schedulequantity == 0){
                                                $scope.schedulelines.splice(i,1);
                                           }
                                     }
								if (total <= Number(data.quantity)) {

									var ScheduleLines = [];
                                      console.log('$scope.schedulelines',$scope.schedulelines);
									ScheduleLines = $scope.schedulelines;

									data['ScheduleLines'] = ScheduleLines;
                                     console.log('$scope.productlistdetails',$scope.productlistdetails);
                                     console.log('data',data);

									$scope.productlistdetails = $scope.productlistdetails;
									$state.go("orders.create-new-order.order-summary-tab");
							} else {
									$scope.notification("Dear Customer, Total Scheduled Quantity Exceeded, Please make sure Total Scheduled Quantity should not be more than " + productldetail1.quantity + " MT", 4000, 'danger');
								}

                            }else{
                                var ScheduleLines = [];

									//ScheduleLines = $scope.schedulelines;

									data['ScheduleLines'] = ScheduleLines;


									$scope.productlistdetails.OrderLines[i] = data;
									$state.go("orders.create-new-order.order-summary-tab");
                            }


							}

						}

					}


				})
			});

		}



		$scope.addmoreproduct = function (productlist, keys) {
			ctrlComm.put('editkeys', keys)
			$scope.productlist = productlist;
			validateorders(function () {
				$scope.askConfrimation("", function () {
					if ($scope.productlist.scheduledelivery == 'sdiyes') {
						for (i = 0; i < $scope.productlistdetails.OrderLines.length; i++) {
							if ($scope.productlistdetails.OrderLines[i].pro_id == productldetail1.pro_id) {
								var params = {};
								var params1 = {};
								params.ScheduleLines = [];
								params1.scheduledate = new Date();
								params1.schedulequantity = $scope.productlist.quantity;
								productldetail1.ScheduleLines = [];
								productldetail1.ScheduleLines.push(params1)
								$state.go("orders.create-new-order.select-product-tab");
							}

						}



					} else {


						$scope.schedulelines = $scope.schedulelines;
						/*$scope.productlist
            $scope.schedulelines*/

						var total = 0;

						for (var i = 0; i < $scope.schedulelines.length; i++) {
							total += $scope.schedulelines[i].schedulequantity


						}


						for (i = 0; i < $scope.productlistdetails.OrderLines.length; i++) {
							if ($scope.productlistdetails.OrderLines[i].pro_id == productldetail1.pro_id) {

								if (total <= productldetail1.quantity) {
									var ScheduleLines = [];
									//var pro_details = $scope.productlist;
									ScheduleLines = $scope.schedulelines;
									//pro_details.push(ScheduleLines);
									$scope.productlist['ScheduleLines'] = ScheduleLines;

									$scope.productlistdetails.OrderLines[i] = $scope.productlist;
									$state.go("orders.create-new-order.select-product-tab");
								} else {
									$scope.notification("Dear Customer, Total Scheduled Quantity Exceeded, Please make sure Total Scheduled Quantity should not be more than " + productldetail1.quantity+" MT", 4000, 'danger');
								}


							}

						}

					}


				});
			})
		}


	}



	if (ctrlComm.get('productlist1') == undefined) {
		$state.go('orders.create-new-order.select-product-tab');
		$scope.notification("Please Select Product.", 4000);

	}



	 $('input#decimal').blur(function () {

	 	if ($(this).val() != undefined && $(this).val() != '' && $(this).val() != '.') {

	 		var num = parseFloat($(this).val());
	 		var cleanNum = num.toFixed(2);
			$(this).val(cleanNum);
			if (num / cleanNum < 1) {
				$('#error').text('Please enter only 2 decimal places, we have truncated extra points');
	 		}
	 	} else {

	 		$(this).val('');
	 	}

	 });



var pqu = '';
	$scope.$watch('scheduleline.schedulequantity', function (val) {

		if (val == '.') {
			$scope.scheduleline.schedulequantity = '';
		}
		if (val) {

			if (val.indexOf('.') != -1) {
				if (val.split('.')[1].length >= 2) {
					$scope.scheduleline.schedulequantity = val.split('.')[0] + '.' + val.split('.')[1].slice(0, 2);
				}

			}
			if (!val.toString().match(/[0-9]|\./) || val.toString().length > 18) {
				if (val.toString().length != 1) {
					$scope.scheduleline.schedulequantity = pqu;
				} else {
					$scope.scheduleline.schedulequantity = '';
				}
			} else {
				pqu = val;
			}

			if ($(this).val() != undefined && $(this).val() != '' && $(this).val() != '.') {

				var num = parseFloat($(this).val());
				var cleanNum = num.toFixed(2);
				$(this).val(cleanNum);
				$scope.scheduleline.schedulequantity = cleanNum;
				if (num / cleanNum < 1) {
					$('#error').text('Please enter only 2 decimal places, we have truncated extra points');
				}
			} else {

				$(this).val('');
			}



		}

		if (val) {
			if (!val.toString().match(/^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g) || val.toString().length > 20) {
				if (val.toString().length != 1) {
					$scope.scheduleline.schedulequantity = pqu;
				} else {
					$scope.scheduleline.schedulequantity = '';
				}
			} else {
				pqu = val;
			}
		}
	});

var pqu = '';
	$scope.$watch('scheduleLine.Quantity', function (val) {

		if (val == '.') {
			$scope.scheduleLine.Quantity = '';
		}
		if (val) {

			if (val.indexOf('.') != -1) {
				if (val.split('.')[1].length >= 2) {
					$scope.scheduleLine.Quantity = val.split('.')[0] + '.' + val.split('.')[1].slice(0, 2);
				}

			}
			if (!val.toString().match(/[0-9]|\./) || val.toString().length > 18) {
				if (val.toString().length != 1) {
					$scope.scheduleLine.Quantity = pqu;
				} else {
					$scope.scheduleLine.Quantity = '';
				}
			} else {
				pqu = val;
			}

			if ($(this).val() != undefined && $(this).val() != '' && $(this).val() != '.') {

				var num = parseFloat($(this).val());
				var cleanNum = num.toFixed(2);
				$(this).val(cleanNum);
				$scope.scheduleLine.Quantity = cleanNum;
				if (num / cleanNum < 1) {
					$('#error').text('Please enter only 2 decimal places, we have truncated extra points');
				}
			} else {

				$(this).val('');
			}



		}

		if (val) {
			if (!val.toString().match(/^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g) || val.toString().length > 20) {
				if (val.toString().length != 1) {
					$scope.scheduleLine.Quantity = pqu;
				} else {
					$scope.scheduleLine.Quantity = '';
				}
			} else {
				pqu = val;
			}
		}
	});

var pqu = '';
	$scope.$watch('ScheduleLines.schedulequantity', function (val) {

		if (val == '.') {
			$scope.ScheduleLines.schedulequantity = '';
		}
		if (val) {

			if (val.indexOf('.') != -1) {
				if (val.split('.')[1].length >= 2) {
					$scope.ScheduleLines.schedulequantity = val.split('.')[0] + '.' + val.split('.')[1].slice(0, 2);
				}

			}
			if (!val.toString().match(/[0-9]|\./) || val.toString().length > 18) {
				if (val.toString().length != 1) {
					$scope.ScheduleLines.schedulequantity = pqu;
				} else {
					$scope.ScheduleLines.schedulequantity = '';
				}
			} else {
				pqu = val;
			}

			if ($(this).val() != undefined && $(this).val() != '' && $(this).val() != '.') {

				var num = parseFloat($(this).val());
				var cleanNum = num.toFixed(2);
				$(this).val(cleanNum);
				$scope.ScheduleLines.schedulequantity = cleanNum;
				if (num / cleanNum < 1) {
					$('#error').text('Please enter only 2 decimal places, we have truncated extra points');
				}
			} else {

				$(this).val('');
			}



		}

		if (val) {
			if (!val.toString().match(/^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g) || val.toString().length > 20) {
				if (val.toString().length != 1) {
					$scope.ScheduleLines.schedulequantity = pqu;
				} else {
					$scope.ScheduleLines.schedulequantity = '';
				}
			} else {
				pqu = val;
			}
		}
	});


	 var pqu = '';
	 $scope.$watch('productlist.quantity', function (val) {

	 	if (val == '.') {
	 		$scope.productlist.quantity = '';
	 	}
	 	if (val) {

	 		if (val.indexOf('.') != -1) {
	 			if (val.split('.')[1].length >= 2) {
	 				$scope.productlist.quantity = val.split('.')[0] + '.' + val.split('.')[1].slice(0, 2);
	 			}

	 		}
	 		if (!val.toString().match(/[0-9]|\./) || val.toString().length > 18) {
	 			if (val.toString().length != 1) {
	 				$scope.productlist.quantity = pqu;
	 			} else {
	 				$scope.productlist.quantity = '';
	 			}
			} else {
				pqu = val;
	 		}

	 		if ($(this).val() != undefined && $(this).val() != '' && $(this).val() != '.') {

	 			var num = parseFloat($(this).val());
	 			var cleanNum = num.toFixed(2);
	 			$(this).val(cleanNum);
				$scope.productlist.quantity = cleanNum;
				if (num / cleanNum < 1) {
	 				$('#error').text('Please enter only 2 decimal places, we have truncated extra points');
	 			}
	 		} else {

	 			$(this).val('');
	 		}



	 	}

	 	if (val) {
	 		if (!val.toString().match(/^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g) || val.toString().length > 20) {
	 			if (val.toString().length != 1) {
	 				$scope.productlist.quantity = pqu;
	 			} else {
	 				$scope.productlist.quantity = '';
	 			}
	 		} else {
	 			pqu = val;
	 		}
	 	}
	 });


	/* var ppn = '';
	 $scope.$watch('productlist.phonenumber', function (val) {
	     if (val == 0) {
	         $scope.productlist.phonenumber = '';
	     }
	     if (val) {
	         if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 10) {
	             if (val.toString().length != 1) {
	                 $scope.productlist.phonenumber = ppn;
	             } else {
	                 $scope.productlist.phonenumber = '';
	             }
	         } else {
	             ppn = val;
	         }
	     }
	 });*/

	var pplist = '';
	$scope.$watch('productlist.plant', function (val) {
		if (val == 0) {
			$scope.productlist.plant = '';
		}
		if (val && val.length) {
			if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 20) {
				if (val.length != 1) {
					$scope.productlist.plant = pplist;
				} else {
					$scope.productlist.plant = '';
				}
			} else {
				pplist = val;
			}
		}
	});


	var pplisttype = '';
	$scope.$watch('productlist.packagingType', function (val) {
		if (val == 0) {
			$scope.productlist.packagingType = '';
		}
		if (val && val.length) {
			if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 20) {
				if (val.length != 1) {
					$scope.productlist.packagingType = pplisttype;
				} else {
					$scope.productlist.packagingType = '';
				}
			} else {
				pplisttype = val;
			}
		}
	});

	var pplistinco = '';
	$scope.$watch('productlist.incoterms', function (val) {
		return;
		if (val == 0) {
			$scope.productlist.incoterms = '';
		}
		if (val && val.length) {
			if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 20) {
				if (val.length != 1) {
					$scope.productlist.incoterms = pplistinco;
				} else {
					$scope.productlist.incoterms = '';
				}
			} else {
				pplistinco = val;
			}
		}
	});

	var pplistpaytype = '';
	$scope.$watch('productlist.paymenttype', function (val) {
		if (val == 0) {
			$scope.productlist.paymenttype = '';
		}
		if (val && val.length) {
			if (!val.match(/^[a-zA-Z\s]*$/) || val.length > 20) {
				if (val.length != 1) {
					$scope.productlist.paymenttype = pplistpaytype;
				} else {
					$scope.productlist.paymenttype = '';
				}
			} else {
				pplistpaytype = val;
			}
		}
	});


	var pponum = '';
	$scope.$watch('productlist.poordernumber', function (val) {
		if (val == 0) {
			$scope.productlist.poordernumber = '';
		}
		if (val) {
			if (!val.toString().match(/^[0-9]*$/) || val.toString().length > 18) {
				if (val.toString().length != 1) {
					$scope.productlist.poordernumber = pponum;
				} else {
					$scope.productlist.poordernumber = '';
				}
			} else {
				pponum = val;
			}
		}
	});


	/* $scope.demo = function (val, index) {
	     if (val.split('')[0] == '0' || val != '/^[0-9]*$/') {
	         //$scope.scheduleline[index].schedulequantity = '';

	     }

	 }*/




});


angular.module('pennaApp').controller('conformctrl', function ($scope, ctrlComm, $location, $state, $timeout, request) {

	$scope.location = $location.path();
	ctrlComm.del('editkeys');
	ctrlComm.del('editKey');

	$scope.ordersumm = function () {

		$state.go("orders.create-new-order.order-summary-tab");

	}


	$scope.productlistdetails = ctrlComm.get('productlistdetails');


	if ($location.path() == '/orders/create-new-order/order-summary-tab') {

		$('#c').addClass('active');
		$('#b').removeClass('active');
		$('#a').removeClass('active');
		$('#d').removeClass('active');

		$scope.confirmorder = function () {

			$scope.localbro_data();

			var prodetails_order = ctrlComm.get('productlistdetails').OrderLines;




			for (i = 0; i < prodetails_order.length; i++) {

				var prosetailships = prodetails_order[0].shipToAddress;


				var productlistdetails = [];

				if (prodetails_order[i].shipToAddress == undefined) {
					prodetails_order[i].shipToAddress = prosetailships
				}

			}



			ctrlComm.get('productlistdetails').OrderLines = [];

			ctrlComm.get('productlistdetails').OrderLines = prodetails_order;


			//$scope.productlistdetails = prodetails_order;

			$scope.productlistdetails = ctrlComm.get('productlistdetails');

			//var input = $scope.productlistdetails;




			//$scope.productlistdetails = ctrlComm.get('productlistdetails');

			//var input = $scope.productlistdetails;


			var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
			$scope.productlistdetails.version = $scope.currUser.version;
			$scope.productlistdetails.device_id = $scope.currUser.device_id;
			$scope.productlistdetails.device_type = $scope.currUser.device_type;
			$scope.productlistdetails.login_id = $scope.currUser.login_id;

			if (deviceInfo.device_Platform != "WEB") {
				$scope.productlistdetails.device_Model = deviceInfo.device_Model;
				$scope.productlistdetails.device_Platform = deviceInfo.platform;
				$scope.productlistdetails.device_ID = deviceInfo.uuid;
				$scope.productlistdetails.device_Manufacturer = deviceInfo.device_Manufacturer;
				$scope.productlistdetails.device_Serial = deviceInfo.device_Serial;
				$scope.productlistdetails.device_IPAddress = deviceInfo.device_IPAddress;
				$scope.productlistdetails.device_MacAddress = deviceInfo.device_MacAddress;
				$scope.productlistdetails.location = "";
				$scope.productlistdetails.osVersion = deviceInfo.osVersion;
				$scope.productlistdetails.apVersion = localStorage.getItem('device_version');
			} else {
				if (JSON.parse(localStorage.getItem('browserInfo')).lat_long) {
					var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;
				} else {
					var local_browserInfo = "blocked"
				}

				$scope.productlistdetails.device_Model = "";
				$scope.productlistdetails.device_ID = "";
				$scope.productlistdetails.device_Manufacturer = "";
				$scope.productlistdetails.device_Serial = "";
				$scope.productlistdetails.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
				$scope.productlistdetails.device_MacAddress = "";
				$scope.productlistdetails.location = local_browserInfo;
				$scope.productlistdetails.osVersion = "";
				$scope.productlistdetails.apVersion = "";
			}


			$scope.netWork(function (status) {
				if (status) {
					$scope.loader(true);
					request.service('createOrder', 'post', $scope.productlistdetails, function (res) {
						$scope.loader(false);
						if (res.statusCode == 200) {
							$scope.ordersconform = true;
							$scope.success = res.statusMessage;
							ctrlComm.put('success', res)



							$timeout(function () {
								$scope.productlist = '';
								$scope.schedulelines = '';
								ctrlComm.del('productldetail');
								$scope.editKey = '';
								ctrlComm.del('editKey');


							}, 100)
							$state.go('orders.create-new-order.order-confirmation-tab');

							if (res.updateMandate == 'NO') {
								$scope.check_appUpdate();
							}

							// ctrlComm.del('productlistdetails');
						}
						if (res.statusCode == 404) {
							$scope.notification(res.statusMessage, 4000);

						} else if (res.dupLogin || res.statusCode == 505) {

							if (res.updateMandate == 'YES') {
								$scope.logout();
							} else {
								$scope.check_appUpdate();
							}


							if (res.dupLogin) {
								$scope.notification(res.statusMessage, 4000);
								$scope.logout();
							}

						} else {
							$scope.notification(res.statusMessage, 4000);
						}


					});
				} else if ($scope.ifMobile) {

					$scope.getOfflineDataFromLocal('createorderoff', function (data) {

						if (!data || !data.input || !data.key) data = {
							key: 'createOrder',
							type: 'post',
							input: []
						};
						data.input.push(input)
						data.createorderoff = angular.copy($scope.productlistdetails);
						request.setItem('localDataSubmitted', 'false')
						$scope.addOfflineDataInLocal('createorderoff', data, function () {
							$rootScope.safeApply(function () {
								$scope.notification("Tax information saved successfully", 4000);

							});
						});



					});



				}

			})
		}


	}

	$scope.updateorder = function (productlistdetail, key) {
		ctrlComm.put('editKey', key);
           var productlistdetail = productlistdetail[0];
          console.log('productlistdetail',JSON.stringify(productlistdetail));
		if (!productlistdetail.shipToAddress) {
			var firstproship = ctrlComm.get('productlistdetails').OrderLines[0].shipToAddress;
			productlistdetail['shipToAddress'] = firstproship;
			ctrlComm.put('productldetail', productlistdetail);
			$scope.productlist = {};
			$scope.edit = true;
			$state.go("orders.create-new-order.order-details-tab");
		} else {
			ctrlComm.put('productldetail', productlistdetail);
			$scope.productlist = {};
			$scope.edit = true;
			$state.go("orders.create-new-order.order-details-tab");
		}

	}

	if ($location.path() == '/orders/create-new-order/order-confirmation-tab') {
		$('#d').addClass('active');
		$('#b').removeClass('active');
		$('#a').removeClass('active');
		$('#c').removeClass('active');
		$scope.productlist = '';
		$scope.success = ctrlComm.get('success')
	}


	if ($location.path() == '/orders/create-new-order/order-summary-tab') {
		if (ctrlComm.get('productlist1') == undefined) {
			$state.go('orders.create-new-order.select-product-tab');
			$scope.notification("Please Select Product.", 4000);
		} else if (ctrlComm.get('productlistdetails') == undefined) {
			$state.go('orders.create-new-order.order-details-tab');
			$scope.notification("Please Fill Product Details in Order Details.", 4000);
		}

	}

	if ($location.path() == '/orders/create-new-order/order-confirmation-tab' && ctrlComm.get('success') != undefined) {

		$timeout(function () {
			ctrlComm.del('productlist1');
			ctrlComm.del('productlistdetails');
			ctrlComm.del('editkeys');
			ctrlComm.del('editKey');
			$scope.productlist = '';
		}, 100)



	} else {

		if (ctrlComm.get('productlist1') == undefined) {
			$state.go('orders.create-new-order.select-product-tab');
			$scope.notification("Please Select Product.", 4000);
		} else if (ctrlComm.get('productlistdetails') == undefined) {
			$state.go('orders.create-new-order.order-details-tab');
			$scope.notification("Please Fill Product Details in Order Details.", 4000);
		}

	}




});


angular.module('pennaApp').controller('modalSaveOrdersCtrl', function ($scope, $uibModalInstance, items) {

	$scope.ok = function () {
		$uibModalInstance.close('ok');
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});
