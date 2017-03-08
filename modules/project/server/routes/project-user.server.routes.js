'use strict';

module.exports = function (app) {
    // User Routes
    var users = require('../controllers/project.user.server.controller');

    app.route('/api/project/users').
//        post(users.create).
        get(users.list);

	/*
    app.route('/api/users/:projectUserId').
        get(users.get).
        put(users.update).
        delete(users.delete);
	*/ 
	
    // Finish by binding the user middleware
    app.param('projectUserId', users.userByID);
};
