angular.module('pennaApp').controller('othersCtrl', function ($scope, $uibModal, $log, $state, $window, ctrlComm, request) {
	$scope.init = function () {
		$scope.purposeChange();
	};
	$scope.purposeChange = function (e) {
		$(document).on("click", ".question", function () {
			var currentAnswer = $(this).closest(".QuestionContainer").find(".answer");
			currentAnswer.slideToggle(500);
			$(".answer").not(currentAnswer).slideUp(500);
			e.stopPropagation();
			//completed
		});
	};
});
