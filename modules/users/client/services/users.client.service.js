'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
    function ($resource) {
        return $resource('api/users', {}, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

angular.module('users.admin').factory('Admin', ['$resource',

    function ($resource) {
        var service = {};

        service.updateUser = $resource('api/users/:userId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });

        return service;
    }
]);
