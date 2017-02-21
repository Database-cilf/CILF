'use strict';

angular.module('project').controller('projectListController', ['$scope', '$stateParams', '$state', 'projectService', '$filter',
    function ($scope, $stateParams, $state, projectService, $filter) {
        $scope.init = function () {
            projectService.getProjects().then(function(projects){
                $scope.projects = projects;
                $scope.refreshTable($scope.tableSort, $scope.projects);
            });
        };

        $scope.removeProject = function(project){
            projectService.removeProject(project.id || project).then(function(){
                return projectService.getProjects();
            }).then(function(projects){
                $scope.projects = projects;
                $scope.refreshTable($scope.tableSort, $scope.projects);
            });
        };

        $scope.updateProject = function(project){
            $state.go('project.update', {projectId: project._id});
        };

        $scope.createProject = function(){
            $state.go('project.create');
        };

        $scope.tableRowCount = [
            5,
            10,
            25,
            50,
            100
        ];

        $scope.tableSort = {
            maxPageNumbers: 5, //The maximum pages it allows you to select from before giving the '...' in the options
            currentPage: 1,
            pagedItems: $scope.projects,
            itemsPerPage: $scope.tableRowCount[0],
            reversOrd: false,
            sortBy: 'timestamp',
            search: '',
            end: 0,
            begin: 0,
            total: 0
        };

        $scope.refreshTable = function (config, tableContent) {
            var filteredItems = $filter('filter')(tableContent, {
                $: config.search
            });

            config.total = filteredItems.length;
            config.begin = (config.currentPage - 1) * config.itemsPerPage;
            config.end = config.begin + +config.itemsPerPage;
            config.pagedItems = filteredItems;
        };
    }
]);
