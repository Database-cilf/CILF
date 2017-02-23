'use strict';

angular.module('project').controller('projectCreateController', ['$scope', '$stateParams', '$state', 'toastr', 'projectService',
    function ($scope, $stateParams, $state, toastr, projectService) {
        $scope.player = $scope.date = {};
		
		projectService.getUsers().then(function(users){
			$scope.users = users
		});

        $scope.createProject = function(project){
            projectService.createProject(project).then(function(){
                $state.go('project.list');
            });
        };
    }
]);
