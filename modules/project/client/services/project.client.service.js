'use strict';

angular.module('project').service('projectService', ['Utility',
    function (Utility) {
        var service = {};

        service.getProjects = function (){
            return Utility.http.get('projects');
        };

        service.getUsers = function (){
            return Utility.http.get('project/users');
        };

        service.createProject = function(project){
            return Utility.http.post('projects', project);
        };

        service.getProject = function(id){
            var id = (id || {})._id || id;
            return Utility.http.get('projects/' + id);
        };

        service.updateProject = function(id, project){
            var id = (id || {}).id || id;
            return Utility.http.put('projects/' + id, project);
        };

        service.removeProject = function(id){
            var id = (id || {})._id || id;
            return Utility.http.delete('projects/' + id);
        };

        service.createReview = function(review){
            var id = (id || {})._id || id;
            return Utility.http.post('reviews', review);
        };

        service.updateReview = function(id, review){
            var id = (id || {}).id || id;
            return Utility.http.put('reviews/' + id, review);
        };

        service.removeReview = function(id){
            var id = (id || {})._id || id;
            return Utility.http.delete('reviews/' + id);
        };

        service.getReviews = function(id){
            var id = (id || {})._id || id;
            return Utility.http.get('reviews', {projectId:id});
        };

        return service;
    }
]);