'use strict';

angular.module('project').service('projectService', ['Utility',
    function (Utility) {
        var service = {};

        service.getProjects = function (){
            return Utility.http.get('projects');
        };

        service.createProject = function(project){
            return Utility.http.post('projects', project);
        };

        service.getProject = function(id){
            id = (id || {})._id || id;
            return Utility.http.get('projects/' + id);
        };

        service.updateProject = function(id, project){
            id = (id || {}).id || id;
            return Utility.http.put('projects/' + id, project);
        };

        service.removeProject = function(id){
            id = (id || {})._id || id;
            return Utility.http.delete('projects/' + id);
        };

        return service;
    }
]);