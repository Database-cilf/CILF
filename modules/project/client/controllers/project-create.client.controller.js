'use strict';

angular.module('project').controller('projectCreateController', ['$scope', '$stateParams', '$state', 'toastr', 'projectService',
    function ($scope, $stateParams, $state, toastr, projectService) {
        $scope.player = $scope.date = {};

        $scope.createProject = function(player){
            var dob = new Date();
            dob.setYear($scope.date.year);
            dob.setMonth($scope.date.month - 1);
            dob.setDate($scope.date.day);

            if(dob < (new Date('1/1/1900'))){
                toastr.error('I very much doubt that we have a player that is over 100 years old');
                return;
            }

            player.dob = dob;

            pokemonPlayerService.createPlayer(player).then(function(){
                $state.go('pokemon.players.list');
            });
        };
    }
]);
