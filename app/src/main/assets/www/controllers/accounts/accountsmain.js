var pennaApp = angular.module('pennaApp');
pennaApp.controller('accountsmainCtrl', function ($scope, $rootScope, $uibModal, $log, $state, $window, ctrlComm, request, $filter, $sce, $location, $http, $interval, $timeout, mobile) {


    $scope.movetoacctax = function(){


        request.service('getTradeConfig', 'post', $scope.currUser, function (res) {

                           if (res.statusCode == '200') {
                              $scope.compConfig=res.companyTypes[0];
                          request.setObj('compConfig', $scope.compConfig)


                                if(request.getObj('compConfig').taxableDiscountDetails == "YES"){
       $state.go('accounts.statements.party-confirmation-taxable');
       }

    if(request.getObj('compConfig').taxableDiscountDetails == "NO"){
       $scope.show_table = false;
       }


    								} else if (res.dupLogin) {
    									$scope.logout();
    									$scope.notification(res.statusMessage);
    								}

             })


    }

    if(request.getObj('compConfig').taxableDiscountDetails == "YES"){
      $scope.show_table = true;
       }

    if(request.getObj('compConfig').taxableDiscountDetails == "NO"){
       $scope.show_table = false;
       }


})
