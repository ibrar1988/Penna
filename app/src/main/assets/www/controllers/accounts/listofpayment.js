angular.module('pennaApp').controller('PaymenthistoryCtrl', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request, $timeout, $location, $filter, mobile, $sce, $rootScope) {
    $scope.ifMobile = ctrlComm.get('ifMobile', $scope.ifMobile);




    $scope.getpayhistory = function (cb) {
        $scope.loader(true)
        $scope.getCurrentPage = function (pageno, val) {
            ctrlComm.put('pno', pageno);
            ctrlComm.put('value', val);
            //ctrlComm.put('pno', ctrlComm.get('pno'));

        }



        // $scope.ifMobile = true;
        $scope.netWork(function (status) {
            if (status) {

                $scope.loader(true);
                request.service('getPaymentList', 'post', $scope.currUser, function (res) {
                    $scope.loader(false);
                    if (res.payments) {
                        applylistorder(res)
                        if ($scope.ifMobile) {
                            $scope.getOfflineDataFromLocal('accounts', function (data) {
                                if (!data) data = {}
                                data.paymenthistory = res
                                $scope.addOfflineDataInLocal('accounts', data, function () {
                                    if (cb) cb();
                                });
                            });
                        } else {
                            if (cb) cb();
                        }
                    } else if (res.dupLogin) {
                        $scope.logout();
                        $scope.notification(res.statusMessage);
                    } else {
                        $scope.loader(false);
                        if (cb) cb();
                    }
                });
            } else if ($scope.ifMobile) {

                $scope.getOfflineDataFromLocal('accounts', function (data) {
                    if (data) {
                        $scope.loader(false);
                        $rootScope.safeApply(function () {
                            if (data.paymenthistory) {
                                applylistorder(data.paymenthistory, function () {
                                    if (cb) cb();
                                });
                            } else {
                                if (cb) cb();
                            }
                        });
                    } else {
                        if (cb) cb();
                    }
                });
            }


        });


        function applylistorder(res, cb) {
            if (res) {

                $scope.paymenthistory = res.payments;
            }
            if (cb) cb();


        }


        $scope.invoiceCurrpage = 1;
        $scope.itemsPerPage = 20;
        $scope.maxSize = 5;


        if ($location.path() == '/accounts/payments/payment-history' && ctrlComm.get('value') == 'true') {
            if (ctrlComm.get(pno)) {
                $scope.invoiceCurrpage = ctrlComm.get(pno);
            }
        }


    }







    $scope.singlepaymenthistory = function (payhistory) {
        $state.go('accounts.payments.payment-history.payment-history-details');
        $scope.payhistory = payhistory;
    }

    if ($location.path() == '/accounts/payments/payment-history/payment-history-details') {

        if ($scope.payhistory == undefined) {
            $state.go('accounts.payments.payment-history');
        }


    }




});
