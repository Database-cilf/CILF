'use strict';

// Setting up route
angular.module('project').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider.
        state('project', {
            abstract: true,
            url: '/project',
            bcName: 'Project',
            bcInclude: false,
            templateUrl: 'modules/project/client/views/project.client.view.html',
            controller: 'projectController'
        }).
        state('project.list', {
            url: '/list',
            bcName: 'Project List',
            bcInclude: true,
            views: {
                '@project': {
                    templateUrl: 'modules/project/client/views/project-list.client.view.html',
                    controller: 'projectListController'
                },
                'headerView@project': {
                    controller: function($scope) {
                        $scope.header = {
                            label: 'Project List',
                            desc: 'All projects currently in the system',
                            faIcon: 'fa-users fa-fw'
                        };
                    }
                }
            }
        }).
        state('project.create', {
            url: '/add',
            bcName: 'Add Project',
            bcInclude: true,
            views: {
                '@project': {
                    templateUrl: 'modules/project/client/views/project-create.client.view.html',
                    controller: 'projectCreateController'
                },
                'headerView@project': {
                    controller: function($scope) {
                        $scope.header = {
                            label: 'Add Project',
                            desc: 'Add a new project to the system',
                            faIcon: 'fa-cog fa-fw'
                        };
                    }
                }
            }
        }).
        state('project.update', {
            url: '/:projectId',
            bcName: 'Update Project',
            bcInclude: true,
            views: {
                '@project': {
                    templateUrl: 'modules/project/client/views/project-update.client.view.html',
                    controller: 'projectUpdateController'
                },
                'headerView@project': {
                    controller: function($scope) {
                        $scope.header = {
                            label: 'Update Project',
                            desc: 'Update a new project to the system',
                            faIcon: 'fa-cog fa-fw'
                        };
                    }
                }
            }
        }).
        state('project.update.view', {
            url: '/view',
            bcName: 'Project',
            bcInclude: true,
            views: {
                '@project': {
                    templateUrl: 'modules/project/client/views/project-view.client.view.html',
                    controller: 'projectViewController'
                },
                'headerView@project': {
                    controller: function($scope) {
                        $scope.header = {
                            label: 'Project',
                            desc: '',
                            faIcon: 'fa-users fa-fw'
                        };
                    }
                }
            }
        });
    }
]);
