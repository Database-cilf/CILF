'use strict';

angular.module('project').controller('projectViewController', ['$scope', '$stateParams', '$state', 'toastr', 'projectService',
    function ($scope, $stateParams, $state, toastr, projectService) {
        $scope.project = {};

        $scope.init = function () {
            projectService.getProject($stateParams.projectId).then(function(project){
                $scope.project = project;
				return projectService.getReviews($stateParams.projectId);
            }).then(function(reviews){
				$scope.reviews = reviews;
			});
        };
		
		$scope.rating = 5;
		
        $scope.updateProject = function(project){
            projectService.updateProject(project, project).then(function(){
                $state.go('project.list');
            });
        };
    }
]);
