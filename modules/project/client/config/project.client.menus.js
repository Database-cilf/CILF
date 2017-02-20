'use strict';

angular.module('project').run(['Menus',
    function (Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Project',
            state: 'project',
            type: 'dropdown',
            roles: ['user', 'admin']
        });

        Menus.addSubMenuItem('topbar', 'project', {
            title: 'Project List',
            state: 'project.list',
            roles: ['user', 'admin']
        });

        Menus.addSubMenuItem('topbar', 'project', {
            title: 'Add Project',
            state: 'project.create',
            roles: ['user', 'admin']
        });
    }
]);

