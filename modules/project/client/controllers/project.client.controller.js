'use strict';

angular.module('project').controller('projectController', ['$scope', '$stateParams', '$state', '$location', 'Authentication',
    function ($scope, $stateParams, $state, $location, Authentication) {
        $scope.authentication = Authentication;
        if ($scope.authentication.user) $location.path('/');
    }
]);
