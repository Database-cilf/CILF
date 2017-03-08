'use strict';

/**
 * Module dependencies.
 */

var path = require('path'),
    async = require('async'),
	moment = require('moment'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	mysql = require('mysql');

var connection  = mysql.createPool({
	connectionLimit : 10,
	host: 'localhost',
	user: 'root',
	database: 'cilf'
});

/* Working code that updates based on an object, not used, but exists
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'cilf'
});
  
var createSql = (queryObj, table, id)=>{
	var sql = Object.keys(queryObj).reduce((last, current)=>{
		last += current + '="' + queryObj[current]+'",';
		return last;
	}, 'UPDATE ' + table + 'SET');
	
	sql = sql.substring(0, sql.length-1);
	sql += ' WHERE id=' + +id + ';';
	return sql;
}
*/



/**
 * Show the current user
 */
exports.get= function (req, res) {
    res.json(req.user);
};

/**
 * Create a user
 */
exports.create = function (req, res) {
    // Init Variables
    var user = req.body;
	var queryObj = {};

    var sql = 'INSERT INTO User (firstName, lastName, dob) \
	VALUES ("' + user.firstName + '", "' + user.lastName + '", \'' + moment((newUser.dob || user.dob)).format('YYYY-MM-DD') + '\');';

    // Then save the player
    connection.query(sql, function (err, result) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
		
		connection.query('SELECT * FROM USER WHERE id=' + result.insertId, (err, r)=>{
			var user = r[0];
			
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else if (!user) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage('Updated but failed to load User ' + +result.insertId)
				});
			}
			
			res.json(user);
		});
    });
};

/**
 * Update a user
 */
exports.update = function (req, res) {
    var user = req.user;
    var newUser = req.body || {};
	var queryObj = {};

    //For security purposes only merge these parameters
	var sql='UPDATE USER SET \
				firstName = "' + (newUser.firstName || user.firstName) + '",\
				lastName = "' + (newUser.lastName || user.lastName) + '",\
				dob = "' + moment((newUser.dob || user.dob)).format('YYYY-MM-DD') + '"\
			WHERE id=' + +user.id + ';'
	
    connection.query(sql, function (err, result) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
		
		connection.query('SELECT * FROM USER WHERE id=' + +user.id, (err, r)=>{
			var user = r[0];
			
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else if (!user) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage('Updated but failed to load User ' + +user.id)
				});
			}
			
			res.json(user);
		});
    });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
    var user = req.user;
	
	connection.query('DELETE FROM USER WHERE id=' + user.id, (err, r)=>{
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
		
		res.json(user);
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
			USER;';
				
	connection.query(query, (err, r)=>{
        res.json(r);
	});
};

/**
 * Player middleware
 */
exports.userByID = function (req, res, next, id) {
	var query = '\
		SELECT \
			* \
		FROM \
			USER U \
		WHERE \
			U.id = ' + +id;
			
	connection.query(query, (err, r)=>{
		var user = (r || {})[0];
		
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new Error('Failed to load User ' + +id));
        }
		
        req.user = user;
        next();
	});
};
