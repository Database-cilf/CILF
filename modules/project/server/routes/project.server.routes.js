'use strict';

module.exports = function (app) {
    // User Routes
    var projects = require('../controllers/project.server.controller');

    app.route('/api/projects').
        post(projects.create).
        get(projects.list);

    app.route('/api/projects/:projectId').
        get(projects.get).
        put(projects.update).
        delete(projects.delete);
    
    // Finish by binding the user middleware
    app.param('projectId', projects.projectByID);
};
