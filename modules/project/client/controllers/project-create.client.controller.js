'use strict';

angular.module('project').controller('projectCreateController', ['$scope', '$stateParams', '$state', 'toastr', 'projectService',
    function ($scope, $stateParams, $state, toastr, projectService) {
        $scope.player = $scope.date = {};

        $scope.createProject = function(project){
            projectService.createProject(project).then(function(){
                $state.go('project.list');
            });
        };
    }
]);
