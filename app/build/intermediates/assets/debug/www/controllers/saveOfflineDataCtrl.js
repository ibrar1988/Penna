(function(){
	angular.module('pennaApp').controller('saveOfflineDataCtrl',
		function ($scope, $location, $state, request, secure, mobile, $filter,$timeout) {
        dynamicServiceCount = 0;
        dynamicServiceResponce = 0;

        if($scope.previousPage){
            $scope.loader(true);
            submitLocallySavedData(function (saved) {
                if (dynamicServiceCount == dynamicServiceResponce) {
                    clearAllLocallystoredData(function(){
                        $scope.loader(false);
                        $location.path($scope.previousPage);
                    });
                }
            })
        }else{
            $location.path('/');
        }

        function submitLocallySavedData(cb) {
            getAllLocallystoredData(function (localObj) {
                var l = 0;
                var len = Object.keys(localObj).length;
                if (len) {
                    for (var i in localObj) {
                        l++;
                        var key = localObj[i].key;
                        var type = localObj[i].type;
                        var input = localObj[i].input;
                        if (input) {
                            for (var a in input) {
                                    input[a].accessToken = $scope.currUser.accessToken;
                                    input[a].userId = $scope.currUser.userId;
                                    input[a].companyId = $scope.currUser.companyId;
                                    dynamicServiceCount++;
                                    request.service(key, type, input[a], function (res) {
                                        dynamicServiceResponce++;
                                        if (res.dupLogin) {
                                            $scope.logout();
                                            $scope.notification(res.statusMessage);
                                        }else if (res.statusCode != '200') {
                                            $scope.notification(res.statusMessage);
                                        }
                                        if (l == len) {
                                            if (cb) cb(true);
                                        }
                                    })
                                    // $timeout(function(){ console.log(" OK ---------------------------")},100)
                            }
                        } else {
                            if (l == len)
                            if (cb) cb(true);
                        }
                    }
                } else {
                    if (cb) cb();
                }
            })
        };

        function getAllLocallystoredData(cb) {
            var localObj = {};
            var id = $scope.currUser.companyId;
            $scope.getOfflineDataFromLocal('bankDetails', function (data) {
                if (data && data.input &&data.input.length) localObj.addBankDetails = data;
                $scope.getOfflineDataFromLocal('bankBenifDetails', function (data) {
                    if (data) localObj.addPbDetailsFromDropDown  = data;
                    $scope.getOfflineDataFromLocal('coverPro',function(imgs){
                        if(imgs){
                            for(var i in imgs){
                                localObj[i] = imgs[i];
                            }
                        }
                        $scope.getOfflineDataFromLocal('dashboard', function (data) {
                            if(data && data.confirmPod){
                                localObj.confirmPod = {key: 'confirmPoD',type:'post', input: [{podList: data.confirmPod.input}]}
                                if(data.updateInvoiceDetails) 
                                localObj.updateInvoiceDetails = data.updateInvoiceDetails
                            }
                            $scope.getOfflineDataFromLocal('profile', function (data) {
                                if(!data) data={};

                                if(!data.profile) data.profile = {}

                                if(!data.soldToAddress) data.soldToAddress = {};
                                if(!data.soldToAddress.input) data.soldToAddress.input = [];

                                if(!data.billingAddress) data.billingAddress = {};
                                if(!data.billingAddress.input) data.billingAddress.input = [];

                                if(data.soldToAddress.input.length>0) localObj.addOrUpdateSoldAddress = data.soldToAddress;
                                if(data.billingAddress.input.length>0) localObj.addOrUpdateBillingAddress = data.billingAddress;
                                if(data.profile.companyDetails){
                                    var familys = data.profile.companyDetails.getFamilymembers;
                                    if(familys && familys.length>0){
                                        for(var i in familys){
                                            if(familys[i].indicator){
                                                familys[i].dateOfBirth = $filter('dateFormatFilter')(familys[i].dateOfBirth);
                                                if (familys[i].anniversary) {
                                                    familys[i].anniversary = $filter('dateFormatFilter')(familys[i].anniversary);
                                                }else{
                                                    familys[i].anniversary = "";
                                                }
                                                if(!localObj.addOrUpdateFamily) localObj.addOrUpdateFamily = { key: 'addOrUpdateFamily', type: 'post', input : [] };
                                                localObj.addOrUpdateFamily.input.push(familys[i])
                                            }
                                        }
                                    }
                                    var partners = data.profile.companyDetails.getPartners;
                                    if(partners && partners.length>0){
                                        for(var i in partners){
                                            if(partners[i].indicator){
                                                if(!localObj.addOrUpdatePartner) localObj.addOrUpdatePartner = { key: 'addOrUpdatePartner', type: 'post', input : [] };
                                                localObj.addOrUpdatePartner.input.push(partners[i])
                                            }
                                        }
                                    }

                                    var references = data.profile.companyDetails.getReferences;
                                    if(references && references.length>0){
                                        for(var i in references){
                                            if(references[i].indicator){
                                                if(!localObj.addOrUpdateRefernces) localObj.addOrUpdateRefernces = { key: 'addOrUpdateRefernces', type: 'post', input : [] };
                                                localObj.addOrUpdateRefernces.input.push(references[i])
                                            }
                                        }
                                    }
                                }

                                $scope.getOfflineDataFromLocal('shipToAddress', function (data) {
                                    if (data) {
                                        if(!data.added) data.added = {}
                                        if(!data.added.input) data.added.input = [];
                                        if(!data.updated) data.updated = {}
                                        if(!data.updated.input) data.updated.input = [];
                                        if (data.added.input.length) localObj.addShipToAddress = data.added;
                                        if (data.updated.input.length) localObj.uploadShipToAddress = data.updated;
                                    }
                                    $scope.getOfflineDataFromLocal('taxInfo', function (data) {
                                        if (data){
                                            if(typeof data == "object" && Object.keys(data).length) localObj.uploadTaxDocuments = data;
                                        }
                                        $scope.getOfflineDataFromLocal('suggestions',function(data){
                                            if(data && data.input && data.input.length){
                                                getRequestNumbers(data.input.length,function(){
                                                    for(var i=0 ;data.input.length>i; i++){
                                                        data.input[i].requestNumber = $scope.requestNumbers[i];
                                                        if(i == (data.input.length-1)){
                                                            localObj.addSuggestions = data;
                                                            cb(localObj)
                                                        }
                                                    }
                                                })
                                            }else{
                                                cb(localObj)
                                            }
                                        })
                                    })
                                })
                            });
                        });
                    })
                })
            });

        }
        $scope.requestNumbers = [];
        function getRequestNumbers(n,cb){
            for(i=0;n>i;i++){
                request.service('getRequestNumber', 'post', $scope.currUser,function(res){
                    $scope.requestNumbers.push(res.RequestNumber);
                    if(n==$scope.requestNumbers.length)
                    cb();
                });
            }
        }
        function clearAllLocallystoredData(cb){
            var id = $scope.currUser.companyId;
            $scope.addOfflineDataInLocal('coverPro',{});
            $scope.getOfflineDataFromLocal('profile', function (data) {
                if(data && data.profile && data.profile.companyDetails){
                    var familys = data.profile.companyDetails.getFamilymembers;
                    var partners = data.profile.companyDetails.getPartners;
                    var references = data.profile.companyDetails.getReferences;
                    if(familys && familys.length>0){ for(var i in familys){ delete familys[i].indicator } }
                    if(partners && partners.length>0){ for(var i in partners){ delete partners[i].indicator } }
                    if(references && references.length>0){ for(var i in references){ delete references[i].indicator } }
                }
                data.soldToAddress = { key:'addOrUpdateSoldAddress', type: 'post', input: [] };
                data.billingAddress = { key:'addOrUpdateBillingAddress', type: 'post', input: [] };
                $scope.addOfflineDataInLocal('profile',data);
            });
            $scope.getOfflineDataFromLocal('shipToAddress', function (data) {
                if(!data) data = {};
                data.added = { key: 'addShipToAddress', type: 'post', input: [] }
                data.updated = { key: 'uploadShipToAddress', type: 'post', input: [] }
                if(!data.addrs) data.addrs = {};
                $scope.addOfflineDataInLocal('shipToAddress',data);
            });
            $scope.addOfflineDataInLocal('bankDetails',{ key: 'addBankDetails', type: 'post', input: [] });
            $scope.addOfflineDataInLocal('bankBenifDetails',{ key: 'addPbDetailsFromDropDown', type: 'post', input: [] });
            $scope.getOfflineDataFromLocal('taxInfo', function (data) {
                if(!data) data = {};
                if(data) data.input = [];
                $scope.addOfflineDataInLocal('taxInfo',data);
            });
            $scope.getOfflineDataFromLocal('suggestions',function(data){
                data.input = []
                $scope.addOfflineDataInLocal('suggestions',data);
            });
            $scope.getOfflineDataFromLocal('dashboard', function (data) {
                if(!data) data = {}
                if(data.confirmPod) data.confirmPod.input = [];
                if(data.updateInvoiceDetails) data.updateInvoiceDetails.input = [];
                if(data.wishes) data.wishes = {};
                if(data.creditDetails) data.creditDetails = {};
                $scope.addOfflineDataInLocal('dashboard',data);
            });
            request.setItem('localDataSubmitted','true');
            if(cb)cb();
        }

	});

}())
