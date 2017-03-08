'use strict';

angular.module('project').controller('projectReviewController', ['$scope', '$stateParams', '$state', 'toastr', 'projectService',
    function ($scope, $stateParams, $state, toastr, projectService) {
		$scope.review = {rating:0, proj_id:$stateParams.projectId};
		
        $scope.createReview = function(review){
            projectService.createReview(review).then(function(){
                $state.go('project.list');
            });
        };
    }
]);
