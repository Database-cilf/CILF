'use strict';

angular.module('project').controller('projectUpdateController', ['$scope', '$stateParams', '$state', 'toastr', 'projectService',
    function ($scope, $stateParams, $state, toastr, projectService) {
        $scope.project = {};

        $scope.init = function () {
            projectService.getProject($stateParams.projectId).then(function(project){
                $scope.project = project;
				return projectService.getUsers();
            }).then(function(users){
				$scope.users = users
			});
        };

        $scope.updateProject = function(project){
            projectService.updateProject(project, project).then(function(){
                $state.go('project.list');
            });
        };
    }
]);
