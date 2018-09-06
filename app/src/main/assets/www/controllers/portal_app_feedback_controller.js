(function(){
	angular.module('pennaApp').controller('portal_app_feedback_controller', function ($scope, $uibModalInstance, data, request) {

		$scope.rating = 0;
		$scope.ratings = [ {
			current: 0,
			max: 5
		}];

		var response = data.response;
		var event_type = data.feedback.type;
		$scope.feedback_form_readonly = event_type === 'GIVE' ? false : true;
		$scope.questions = [];

		if($scope.feedback_form_readonly){
			$scope.questions = response.answers.map(function(answer,key){
				var obj = answer.quest;
				obj.answer = !!answer.feedback ? answer.feedback : '';
				if(obj.questionType == 'Rating'){
					obj.current = obj.answer;
				}
				if(obj.questionType == 'Checkbox'){
					obj.answer = answer.feedback ? JSON.parse(answer.feedback) : {};
				}
				if(obj.options){
					obj.options = createOptions(obj.options);
				}
				return obj;
			});
		}else{
			$scope.questions = response.questions.map((obj,key)=>{
				if(obj.options){
					obj.options = createOptions(obj.options);
				}
				return obj;
			});
		}
		function createOptions(options){
			options = options.split(';').filter(function(e){
				if(typeof e==='string'){ e = e.trim(); }
				if(e) return { e }
			});
			return options;
		}
		function getAnswerObj(id){
			return response.answers && response.answers.find(answer=>answer.quest.id===id)
		}

		$scope.getSelectedRating = function (rating,data,index) {
			if($scope.feedback_form_readonly===false){
				for(var i = 0;i < $scope.questions.length;i++){
					if($scope.questions[i].questionType == "Rating" && $scope.questions[i].id == data.id){
						$scope.questions[i].answer = String(rating);
					}
				}
			}
		}

		$scope.save = function () {
			var input = {
				login_id: data.currUser.login_id,
				accessToken: data.currUser.accessToken,
				userId: data.currUser.userId,
				questions: []
			};
			var totalAnswers = 0
			for(obj of $scope.questions){
				input.questions.push({
					qid: obj.id,
					qcat: obj.category,
					sequenceNo: obj.sequenceNo,
					feedback: typeof obj.answer === 'object' ? JSON.stringify(obj.answer) : obj.answer
				})
				if(typeof obj.answer === "object"){
					if(JSON.stringify(obj.answer).indexOf('true')!==-1){
						totalAnswers++;
					}
				}else if(obj.answer!== undefined){
					totalAnswers++;
				}
			}
			if(totalAnswers===0){
				data.notification('Please answer at least one question to save');
			}else{
				request.service('syncPortalFeedback', 'post',input, function (res) {
					if (res.statusCode == '200') {
						$uibModalInstance.close(res);
					}
				},function(error){
					console.log("error ::: ",error);
				});
			}
		}

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	})
}());