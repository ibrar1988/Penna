var pennaApp = angular.module('pennaApp');
pennaApp.controller('pennavisitsCtrl', function ($scope, $rootScope, $uibModal, $log, $state, $window, ctrlComm, request, $filter, $sce, $location, $http, $interval, $timeout, mobile) {



    $scope.getOfficerVisits = function(){
     $scope.loader(true);
         request.service('getOfficerVisits', 'post', $scope.currUser, function (res) {
 $scope.loader(false);
                           if (res.statusCode == '200') {

                               $scope.visits = res.visits;
    								} else if (res.dupLogin) {
    									$scope.logout();
    									$scope.notification(res.statusMessage);
    								}

             })

    }


    $scope.getOfficerVisits();


    $scope.viewfeedback = function(type,data){


        $scope.animationsEnabled = true;

         var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'addoredit.html',
			size: 'md',
            backdrop: 'static',

				keyboard: false,
				resolve: {
					items: function () {
						return {
                         currUser:$scope.currUser,
                         type:type,
                         data:data,
                         notification: $scope.notification,
                         logout: $scope.logout,
                         loader:$scope.loader,
                         getOfficerVisits:$scope.getOfficerVisits,
						}
					}
				},

            controller: ['$scope', '$uibModalInstance', 'items', 'request','$filter', function ($scope, $uibModalInstance, items, request,$filter) {

                $scope.type = items.type;
                $scope.data = items.data;
                $scope.currUser = items.currUser;
                $scope.notification = items.notification;
                $scope.logout = items.logout;
                $scope.loader = items.loader;
                $scope.getOfficerVisits = items.getOfficerVisits;


                 $scope.title = 'Feed back on Visit:' + data.visitNo;

                $scope.rating = 0;
    $scope.ratings = [ {
        current: 0,
        max: 5
    }];

    var rating_arry = [];

    $scope.getSelectedRating = function (rating,data,index) {
        rating_arry = [];
        for(var i = 0;i < $scope.questionss.length;i++){
            if($scope.questionss[i].questionType == "Rating"){
            if($scope.questionss[i].id == data.id){
            rating_arry.push({
                 "qid":$scope.questionss[i].id,
                 "qcat":$scope.questionss[i].category,
                 "sequenceNo":String($scope.questionss[i].sequenceNo),
                 "feedback":String(rating),
            });
        }else{
            if($scope.questionss[i].current){
              rating_arry.push({
                 "qid":$scope.questionss[i].id,
                 "qcat":$scope.questionss[i].category,
                 "sequenceNo":String($scope.questionss[i].sequenceNo),
                 "feedback":String($scope.questionss[i].current),
            });
            }else{
                 rating_arry.push({
                 "qid":$scope.questionss[i].id,
                 "qcat":$scope.questionss[i].category,
                 "sequenceNo":String($scope.questionss[i].sequenceNo),
                 "feedback":""
            });
            }

        }
        }
        }

    }

    $scope.questionss = [];

    if($scope.data.feedbackStatus == 'pending'){
         $scope.questionss = [];
         $scope.check_boxdata = [];
         $scope.loader(true);
     request.service('getQuestions', 'post', $scope.currUser, function (res) {
                $scope.loader(false);
                           if (res.statusCode == '200') {

                               $scope.questions = res.questions;

                                  $scope.questions.sort(function(a, b) {
                                             return (a.sequenceNo - b.sequenceNo);
                                            });

                               for(var i = 0;i < $scope.questions.length;i++){

                                   if($scope.questions[i].questionType == 'Text'){
                                       $scope.questionss.push({
                                          'questionType':$scope.questions[i].questionType,
                                          'question':$scope.questions[i].question,
                                          'questionNo':$scope.questions[i].questionNo,
                                          'sequenceNo':$scope.questions[i].sequenceNo,
                                          'options':$scope.questions[i].options,
                                          'category':$scope.questions[i].category,
                                          'id':$scope.questions[i].id,
                                       });
                                      }

                                   if($scope.questions[i].questionType == 'Radio'){
                                      $scope.questionss.push({
                                          'questionType':$scope.questions[i].questionType,
                                          'question':$scope.questions[i].question,
                                          'questionNo':$scope.questions[i].questionNo,
                                          'sequenceNo':$scope.questions[i].sequenceNo,
                                          'category':$scope.questions[i].category,
                                          'id':$scope.questions[i].id,
                                          'options':$scope.questions[i].options.split(';'),
                                       });
                                      }

                                   if($scope.questions[i].questionType == 'Rating'){
                                      $scope.questionss.push({
                                          'questionType':$scope.questions[i].questionType,
                                          'question':$scope.questions[i].question,
                                          'questionNo':$scope.questions[i].questionNo,
                                          'sequenceNo':$scope.questions[i].sequenceNo,
                                          'category':$scope.questions[i].category,
                                          'options':$scope.questions[i].options,
                                          'id':$scope.questions[i].id,
                                          'current':0,
                                       });
                                      }

                                   if($scope.questions[i].questionType == 'Checkbox'){
                                      $scope.questionss.push({
                                          'questionType':$scope.questions[i].questionType,
                                          'question':$scope.questions[i].question,
                                          'questionNo':$scope.questions[i].questionNo,
                                          'sequenceNo':$scope.questions[i].sequenceNo,
                                          'category':$scope.questions[i].category,
                                          'id':$scope.questions[i].id,
                                          'options':$scope.questions[i].options.split(';'),
                                       });
                                       $scope.check_boxdata.push({
                                          'questionType':$scope.questions[i].questionType,
                                          'question':$scope.questions[i].question,
                                          'questionNo':$scope.questions[i].questionNo,
                                          'sequenceNo':$scope.questions[i].sequenceNo,
                                          'category':$scope.questions[i].category,
                                          'id':$scope.questions[i].id,
                                          'options':$scope.questions[i].options.split(';'),
                                       });
                                      }



                               }


    								} else if (res.statusCode == "201") {
    									$scope.logout();
    									$scope.notification(res.statusMessage);
    								}

             })
            }else{


        }

    var rating_arry1 = [];

    $scope.save = function(data){
     rating_arry1 = []
     check_boxval = []

 validatequestion(data,function () {

            var  final_requst = {
                 'accessToken' : $scope.currUser.accessToken,
              'userId' : $scope.currUser.userId,
              'email' : $scope.currUser.email,
              'role' : $scope.currUser.role,
                'vid':$scope.data.vid,
                "questions":[],
            }


             var deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
			if (deviceInfo.device_Platform != "WEB") {
				final_requst.device_Model = deviceInfo.device_Model;
				final_requst.device_Platform = deviceInfo.platform;
				final_requst.device_ID = deviceInfo.uuid;
				final_requst.device_Manufacturer = deviceInfo.device_Manufacturer;
				final_requst.device_Serial = deviceInfo.device_Serial;
				final_requst.device_IPAddress = deviceInfo.device_IPAddress;
				final_requst.device_MacAddress = deviceInfo.device_MacAddress;
				final_requst.location = "";
				final_requst.osVersion = deviceInfo.osVersion;
				final_requst.apVersion = localStorage.getItem('device_version');
			} else {
				if (JSON.parse(localStorage.getItem('browserInfo')).lat_long != undefined) {

					var local_browserInfo = JSON.parse(localStorage.getItem('browserInfo')).lat_long;
				} else {

					var local_browserInfo = "blocked"
				}
				final_requst.device_Model = "";
				final_requst.device_Platform = "WEB";
				final_requst.device_ID = "";
				final_requst.device_Manufacturer = "";
				final_requst.device_Serial = "";
				final_requst.device_IPAddress = JSON.parse(localStorage.getItem('browserInfo')).ip;
				final_requst.device_MacAddress = "";
				final_requst.location = local_browserInfo;
				final_requst.osVersion = "";
				final_requst.apVersion = "";
			}


             for(var i = 0;i < $scope.questionss.length;i++){
                   if($scope.questionss[i].questionType == 'Text'){
                        if($scope.questionss[i].answer){
                       rating_arry1.push({
                 "qid":$scope.questionss[i].id,
                 "qcat":$scope.questionss[i].category,
                 "sequenceNo":String($scope.questionss[i].sequenceNo),
                 "feedback":$scope.questionss[i].answer
             })

                   }else{
                        rating_arry1.push({
                 "qid":$scope.questionss[i].id,
                 "qcat":$scope.questionss[i].category,
                 "sequenceNo":String($scope.questionss[i].sequenceNo),
                 "feedback":""
             })
                   }
                   }

                 if($scope.questionss[i].questionType == 'Radio'){
                        if($scope.questionss[i].answer){
                       rating_arry1.push({
                 "qid":$scope.questionss[i].id,
                 "qcat":$scope.questionss[i].category,
                 "sequenceNo":String($scope.questionss[i].sequenceNo),
                 "feedback":$scope.questionss[i].answer
             })

                   }else{
                        rating_arry1.push({
                 "qid":$scope.questionss[i].id,
                 "qcat":$scope.questionss[i].category,
                 "sequenceNo":String($scope.questionss[i].sequenceNo),
                 "feedback":""
             })
                   }
                   }

                 if($scope.questionss[i].questionType == 'Rating' ){
                        if($scope.questionss[i].answer == undefined && rating_arry.length == 0 ){
                       rating_arry1.push({
                 "qid":$scope.questionss[i].id,
                 "qcat":$scope.questionss[i].category,
                 "sequenceNo":String($scope.questionss[i].sequenceNo),
                 "feedback":''
             })

                   }
                   }

                 if($scope.questionss[i].questionType == 'Checkbox'){
                     check_boxval = [];
                     check_boxval1 = [];
                        if($scope.questionss[i].answer){
                            for (var key in $scope.questionss[i].answer) {
                                 if($scope.questionss[i].answer[key] == true){
                                     check_boxval.push(key);
                                     }
                                   }


                            angular.forEach($scope.check_boxdata,function(obj){
                                var temp;
                                check_boxval1=[];
                                if(obj.id == $scope.questionss[i].id){
                                    //angular.forEach(obj.options, function(obj1){
                                        angular.forEach(check_boxval, function(obj2){
                                            check_boxval1.push(obj.options[obj2]);
                                        })
                                    //})
                                      rating_arry1.push({
                 "qid":$scope.questionss[i].id,
                 "qcat":$scope.questionss[i].category,
                 "sequenceNo":String($scope.questionss[i].sequenceNo),
                 "feedback":check_boxval1.join().replace(/,/g, ';'),
             })
                                }
                            })





                   }else{
                        rating_arry1.push({
                 "qid":$scope.questionss[i].id,
                 "qcat":$scope.questionss[i].category,
                 "sequenceNo":String($scope.questionss[i].sequenceNo),
                 "feedback":""
             })
                   }
                   }


             }




                          if(rating_arry){
                              final_requst.questions = rating_arry1.concat(rating_arry)
                          }else{
                              final_requst.questions = rating_arry1
                          }



        request.service('syncVisitorFeedback', 'post',
			final_requst,
			function (res) {
            $scope.loader(false);

            if(res.statusCode == "200"){

                 $scope.notification(res.statusMessage);
                 $uibModalInstance.close('ok');
                 $scope.getOfficerVisits();

            }else if(res.statusCode == "406"){
                $scope.loader(false);
                $scope.notification(res.statusMessage, "danger");
                $scope.logout();
            }else{
                $scope.loader(false);
                $scope.notification(res.statusMessage, "danger");
            }


        })





                     // $uibModalInstance.dismiss('cancel');
 })
                  }


     $scope.err={};

function validatequestion(data, cb) {

    var err_count = 0;

		for (var i in data) {

            if(data[i].questionType == "Checkbox" && data[i].answer){

                var answ1 = data[i].answer;


                var answ1_length = Object.keys(answ1).length;

                for (var j in answ1) {
                    if(answ1[j] == false){
                        answ1_length--;
                       }

                }


                if(answ1_length == 0){
                   delete data[i].answer;
                   }

               }


			if (!data[i].answer) {
				    err_count++;

			}



		}
		if (data.length != err_count || rating_arry.length > 0) {
			if (cb)
				cb();
		}else{
            $scope.notification('Please answer at least one question to save');
        }


}


                  $scope.cancel = function(){
                      $uibModalInstance.dismiss('cancel');
                      }


                }]
		});

		modalInstance.result.then(function (selectedItem) {

		}, function (err) {});

    }

    $scope.viewfeedback_details = function(type,data){
     $window.scrollTo(0, 0);
$scope.animationsEnabled = true;
        setTimeout(function(){
         var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'pages/profile/pennavisits/view_feedback.html',
			size: 'md',
            backdrop: 'static',
				keyboard: false,
				resolve: {
					items: function () {
						return {
                         currUser:$scope.currUser,
                         type:type,
                         data:data,
                         notification: $scope.notification,
                         logout: $scope.logout,
                         loader:$scope.loader,
                         getOfficerVisits:$scope.getOfficerVisits,
						}
					}
				},

            controller: ['$scope', '$uibModalInstance', 'items', 'request','$filter', function ($scope, $uibModalInstance, items, request,$filter) {

                $scope.type = items.type;
                $scope.data = items.data;
                $scope.currUser = items.currUser;
                $scope.notification = items.notification;
                $scope.logout = items.logout;
                $scope.loader = items.loader;
                $scope.getOfficerVisits = items.getOfficerVisits;

                 $scope.title = 'Feed back on Visit:' + $scope.data.visitNo;

                       $scope.rating = 0;
    $scope.ratings = [ {
        current: 0,
        max: 5
    }];


                $scope.questionss = [];

    if($scope.data.feedbackStatus != 'pending'){


         $scope.questionss = [];
         $scope.check_boxdata = [];

                                    $scope.answers = $scope.data.questions;


                                             $scope.answers.sort(function(a, b) {
                                             return (a.sequenceNo - b.sequenceNo);
                                            });


                                   for(var i = 0;i < $scope.answers.length;i++){


                                         if($scope.answers[i].questionType == 'Text'){

                                             $scope.questionss.push({
                                          'questionType':$scope.answers[i].questionType,
                                          'question':$scope.answers[i].question,
                                          'questionNo':$scope.answers[i].questionNo,
                                          'sequenceNo':$scope.answers[i].sequenceNo,
                                          'options':$scope.answers[i].options,
                                          'category':$scope.answers[i].category,
                                          'id':$scope.answers[i].id,
                                          'sequenceNo':$scope.answers[i].sequenceNo,
                                           'answer':$scope.answers[i].feedback,
                                       });
                                         }

                                        if($scope.answers[i].questionType == 'Radio'){

                                            $scope.questionss.push({
                                          'questionType':$scope.answers[i].questionType,
                                          'question':$scope.answers[i].question,
                                          'questionNo':$scope.answers[i].questionNo,
                                          'sequenceNo':$scope.answers[i].sequenceNo,
                                          'category':$scope.answers[i].category,
                                          'id':$scope.answers[i].id,
                                          'options':$scope.answers[i].options.split(';'),
                                           'answer':$scope.answers[i].feedback,
                                           'sequenceNo':$scope.answers[i].sequenceNo,
                                       });

                                        }

                                        if($scope.answers[i].questionType == 'Rating'){

                                             $scope.questionss.push({
                                          'questionType':$scope.answers[i].questionType,
                                          'question':$scope.answers[i].question,
                                          'questionNo':$scope.answers[i].questionNo,
                                          'sequenceNo':$scope.answers[i].sequenceNo,
                                          'category':$scope.answers[i].category,
                                          'options':$scope.answers[i].options,
                                          'id':$scope.answers[i].id,
                                          'current':$scope.answers[i].feedback,
                                          'sequenceNo':$scope.answers[i].sequenceNo,
                                       });

                                        }

                                        if($scope.answers[i].questionType == 'Checkbox'){


                                            if($scope.answers[i].feedback != undefined){
                                            var feedbacks= $scope.answers[i].feedback.split(';');

                                              var feedbacks_qus= $scope.answers[i].options.split(';');

                                              var check_answer = [];

                                                 for(var k=0; k < feedbacks_qus.length;k++){
                                                     check_answer.push(false);
                                                 }

                                                 for ( var m = 0; m < feedbacks.length; m++ ) {
                                                 for ( var e = 0; e < feedbacks_qus.length; e++ ) {
                                                 if ( feedbacks[m] === feedbacks_qus[e] ) {
                                                     check_answer[e] = true;
                                                 }

                                             }
                                              }
                                              }



                                              $scope.questionss.push({
                                          'questionType':$scope.answers[i].questionType,
                                          'question':$scope.answers[i].question,
                                          'questionNo':$scope.answers[i].questionNo,
                                          'sequenceNo':$scope.answers[i].sequenceNo,
                                          'category':$scope.answers[i].category,
                                          'id':$scope.answers[i].id,
                                          'options':$scope.answers[i].options.split(';'),
                                          'answer':check_answer,
                                          'sequenceNo':$scope.answers[i].sequenceNo,
                                       });


                                        }

                                   }




            }





                  $scope.cancel = function(){
                      $uibModalInstance.dismiss('cancel');
                      }


                }]
		});

		modalInstance.result.then(function (selectedItem) {

		}, function (err) {});

     },0);
    }


});
