'use strict';

module.exports = function (app) {
    // User Routes
    var reviews = require('../controllers/review.server.controller');

    app.route('/api/reviews').
        post(reviews.create).
        get(reviews.list);

    app.route('/api/reviews/:reviewId').
        get(reviews.get).
        put(reviews.update).
        delete(reviews.delete);
    
    // Finish by binding the user middleware
    app.param('reviewId', reviews.reviewByID);
};