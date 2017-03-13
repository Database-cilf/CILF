'use strict';

/**
 * Module dependencies.
 */

var path = require('path'),
    async = require('async'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	mysql = require('mysql');

var connection  = mysql.createPool({
	connectionLimit : 10,
	host: 'localhost',
	user: 'root',
	database: 'cilf'
});

/**
 * Show the current review
 */
exports.get= function (req, res) {
    res.json(req.review);
};

/**
 * Create a review
 */
exports.create = function (req, res) {
    // Init Variables
    var review = req.body;

    var sql = 'REPLACE INTO RATING (rate, proj_id, description, user_id) \
	VALUES ("' + review.rating + '", "' + review.proj_id + '", "' + review.description + '", "' + req.user._id + '");';
	
	console.log(sql);
	
    // Then save the player
    connection.query(sql, function (err, result) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
		
		connection.query('SELECT * FROM RATING WHERE id=' + result.insertId, (err, r)=>{
			var review = r[0];
			
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else if (!review) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage('Updated but failed to load Review ' + +result.insertId)
				});
			}
			
			res.json(review);
		});
    });
};

/**
 * Update a review
 */
exports.update = function (req, res) {
    var review = req.review;
    var newReview = req.body || {};
	var queryObj = {};
	
    //For security purposes only merge these parameters
	var sql='UPDATE RATING SET \
				rate = "' + (newReview.rate || review.rate) + '",\
				description = "' + (newReview.description || review.description) + '",\
			WHERE id=' + +review.id + ';'
		
    connection.query(sql, function (err, result) {
        if (err) {			
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
		
		connection.query('SELECT * FROM RATING WHERE id=' + +review.id, (err, r)=>{
			var review = r[0];
			
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else if (!review) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage('Updated but failed to load Review ' + +review.id)
				});
			}
			
			res.json(review);
		});
    });
};

/**
 * Delete a review
 */
exports.delete = function (req, res) {
    var review = req.review;
	
	connection.query('DELETE FROM RATING WHERE id=' + review.id, (err, r)=>{
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
		
		res.json(review);
	});
};

/**
 * List of Players
 */
exports.list = function (req, res) {
	var query = '\
		SELECT \
			* \
		FROM \
			RATING',
		id = (req.query || {}).projectId;
	
	if(id){
		query += ' \
			WHERE \
				proj_id = ' + id;
	}
	
	connection.query(query, (err, r)=>{
        res.json(r);
	});
};

/**
 * Player middleware
 */
exports.reviewByID = function (req, res, next, id) {
	var query = '\
		SELECT \
			* \
		FROM \
			RATING R \
		WHERE \
			R.id = ' + +id;
			
	connection.query(query, (err, r)=>{
		var review = r[0];
		
        if (err) {
            return next(err);
        } else if (!review) {
            return next(new Error('Failed to load Review ' + +id));
        }
		
        req.review = review;
        next();
	});
};
