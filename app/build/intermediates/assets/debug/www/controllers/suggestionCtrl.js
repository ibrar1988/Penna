/*get suggctrl info-- -- -- -- -- -- --controller*/

angular.module('pennaApp').controller('suggestionCtrl', function ($scope, $rootScope, $uibModal, $log, request, $location) {
    $scope.netWork(function (status) {
        if ($location.path() == '/profile/service-list') {
            if (status) {
                getSuggestions();
            } else if ($scope.ifMobile) {
                $scope.getOfflineDataFromLocal('suggestions', function (data) {
                    if (data) {
                        if (!data.base64Imgs) data.base64Imgs = {};
                        for (var i in data.base64Imgs) {
                            for (var j in data.presuggests) {
                                if (data.base64Imgs[i].id == data.presuggests[j].id) {
                                    data.presuggests[j].attachment = data.base64Imgs[i].attachment;
                                    break;
                                }
                            }
                        }
                        $rootScope.safeApply(function () {
                            $scope.presuggests = data.presuggests;
                        });
                    }
                });
            }
        }
    });

    function getSuggestions() {
        $scope.loader(true);
        request.service('getSuggestions', 'post', $scope.currUser, function (res) {
            $scope.loader(false);

            $scope.ListofServices = res.ListofServices;

            if (res.statusCode == "200") {
                var count = 0;
                for (var i in res.ListofServices) {
                    count++;

                    res.ListofServices[i].attachments = $scope.prePath + res.ListofServices[i].attachment.replace(/\\/g, "/");
                    if (count == res.ListofServices.length) {
                        $scope.presuggests = res.ListofServices;

                        if (!$scope.netWork) {
                            $scope.mode = 'offline';

                        } else {
                            $scope.mode = 'online';
                        }



                        if ($scope.ifMobile) {

                            $scope.addOfflineDataInLocal('suggestions', {
                                key: 'addSuggestions',
                                type: 'post',
                                input: [],
                                presuggests: $scope.presuggests,
                                base64Imgs: {}
                            });
                        }
                    }
                }
            } else if (res.dupLogin) {
                $scope.logout();
            }
        });
    }

    function getBase64SuggestionImgs(cb) {
        $scope.loader(true);
        request.service('getSuggestionImages', 'post', $scope.currUser, function (res) {
            $scope.loader(false);
            if (res.statusCode == "200") {
                if (cb) cb(res.ListofServices)
            } else if (res.dupLogin) {
                $scope.logout();
            }
        });
    }

    $scope.animationsEnabled = true;

    $scope.addSuggetion = function (size) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop: 'static',
            templateUrl: 'pages/profile/suggestions/suggestionsForm.html',
            controller: 'addSuggestionctrl',
            size: size,
            resolve: {
                items: function () {
                    return {
                        currUser: $scope.currUser,
                        notification: $scope.notification,
                        loader: $scope.loader,
                        netWork: $scope.netWork,
                        saveinLocal: $scope.saveinLocal,
                        getFromLocal: $scope.getFromLocal,
                        complat: $scope.complat
                    }
                }
            }
        });

        modalInstance.result.then(function (res) {
            if (res.statusMessage) {
                $scope.notification(res.statusMessage)
            } else if ($scope.ifMobile) {
                $scope.getOfflineDataFromLocal('suggestions', function (data) {
                    $rootScope.safeApply(function () {
                        if (!data || !data.key) data = {
                            key: 'addSuggestions',
                            type: 'post',
                            input: []
                        };
                        data.input.push(res);
                        $scope.addOfflineDataInLocal('suggestions', data);
                        request.setItem('localDataSubmitted', 'false');
                        $scope.notification('Hey you are offline ! Your Request will be sent when you go online next !');
                    })
                });
            }
        }, function () {

        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };


});
