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
 * Show the current project
 */
exports.get= function (req, res) {
    res.json(req.project);
};

/**
 * Create a project
 */
exports.create = function (req, res) {
    // Init Variables
    var project = req.body;

    var sql = 'INSERT INTO PROJECT (name, description, projectUrl, owner_id) \
	VALUES ("' + project.name + '", "' + project.description + '", "' + project.projectUrl + '", "' + req.user._id + '");';
	
    // Then save the player
    connection.query(sql, function (err, result) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
		
		//Add tags
		if(project.tags){
			//Remove all spaces in a very ineffecent and unreadable manner because fuck it, why not
			project.tags = (project.tags+'').split('').filter((c)=>(c!==' ')).join('')
			
			var tagSql = 'REPLACE INTO TAGS (tag, proj_id) VALUES ';
					
			project.tags.split(',').forEach((tag)=>{
				tagSql += '("'+ tag +'", '+ result.insertId + '), ';
			});
			
			tagSql = tagSql.substr(0, tagSql.length-2)+';';
				
			connection.query(tagSql, function (err, result) {
				if (err) {
					console.error(err);
				}
			});
		}
		
		connection.query('SELECT * FROM PROJECT WHERE id=' + result.insertId, (err, r)=>{
			var project = r[0];
			
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else if (!project) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage('Updated but failed to load Project ' + +result.insertId)
				});
			}
			
			res.json(project);
		});
    });
};

/**
 * Update a project
 */
exports.update = function (req, res) {
    var project = req.project;
    var newProject = req.body || {};
	var queryObj = {};
		
		
	//can edit if your an admin or if you are the owner
	if (((req.user._id+'') !== (project.owner_id+'')) && ((req.user.roles.indexOf('admin') == -1))) {
		return res.status(400).send({
			message: 'You are not the owner of this project, update failed'
		});
	}
	
	//Add/remove tags
	if(newProject.tags){
		//Remove all spaces in a very ineffecent and unreadable manner because fuck it, why not
		newProject.tags = (newProject.tags+'').split('').filter((c)=>(c!==' ')).join('')
		
		var tagSql = 'REPLACE INTO TAGS (tag, proj_id) VALUES ';
				
		newProject.tags.split(',').forEach((tag)=>{
			tagSql += '("'+ tag +'", '+ project.id + '), ';
		});
		
		tagSql = tagSql.substr(0, tagSql.length-2)+';';
		
		connection.query('DELETE FROM TAGS WHERE proj_id=' + +project.id, (err, r)=>{
			if (err) {
				console.error(err);
			}
			
			connection.query(tagSql, function (err, result) {
				if (err) {
					console.error(err);
				}
			});
		});
	}
	
    //For security purposes only merge these parameters
	var sql='UPDATE PROJECT SET \
				name = "' + (newProject.name || project.name) + '",\
				description = "' + (newProject.description || project.description) + '",\
				projectUrl = "' + (newProject.projectUrl || project.projectUrl) + '",\
				owner_id = "' + (newProject.owner_id || project.owner_id) + '"\
			WHERE id=' + +project.id + ';'
	
	
    connection.query(sql, function (err, result) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
		
		connection.query('SELECT * FROM PROJECT WHERE id=' + +project.id, (err, r)=>{
			var project = r[0];
			
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else if (!project) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage('Updated but failed to load Project ' + +project.id)
				});
			}
			
			res.json(project);
		});
    });
};

/**
 * Delete a project
 */
exports.delete = function (req, res) {
    var project = req.project;
		
	//can edit if your an admin or if you are the owner
	if (((req.user._id+'') !== (project.owner_id+'')) && ((req.user.roles.indexOf('admin') == -1))) {
		return res.status(400).send({
			message: 'You are not the owner of this project, delete failed'
		});
	}
		
	connection.query('DELETE FROM TAGS WHERE proj_id=' + +project.id, (err, r)=>{
		if (err) {
			console.error(err);
		}
		
		connection.query('DELETE FROM PROJECT WHERE id=' + project.id, (err, r)=>{
			if (err) {
				console.error(err);
			
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			
			res.json(project);
		});
	});
};

/**
 * List of Players
 */
exports.list = function (req, res) {
	var query = '\
		SELECT \
			P.projectUrl as projectUrl, P.owner_id as owner_id, P.name as name, P.id as id, P.description as description, IFNULL(avgRating, 0) as rating, U.firstname as firstname, U.lastname as lastname, tags \
		FROM \
			PROJECT P \
			LEFT OUTER JOIN \
			(SELECT P1.name, (SUM(R1.rate)/COUNT(R1.rate)) as avgRating, P1.id as id FROM PROJECT P1, RATING R1 \
				WHERE P1.id = R1.proj_id \
				GROUP BY P1.id) PR on P.id=PR.id \
			LEFT OUTER JOIN \
			(SELECT P2.name, GROUP_CONCAT(T2.tag SEPARATOR ", ") as tags, T2.proj_id FROM PROJECT P2, TAGS T2 \
				WHERE P2.id = T2.proj_id \
				GROUP by T2.proj_id) TR on P.id=TR.proj_id, \
			USER U \
		WHERE \
			U.mongoId = P.owner_id';
				
	connection.query(query, (err, r)=>{
		if(err){
			console.error(err);
		}
		
		r = r.map((p)=>{ p.owner={firstName: p.firstname, lastName: p.lastname}; return p});
		
        res.json(r);
	});
};

/**
 * Player middleware
 */
exports.projectByID = function (req, res, next, id) {
	var query = '\
		SELECT \
			P.projectUrl as projectUrl, P.owner_id as owner_id, P.name as name, P.id as id, P.description as description, IFNULL(avgRating, 0) as rating, U.firstname as firstname, U.lastname as lastname, tags \
		FROM \
			PROJECT P \
			LEFT OUTER JOIN \
			(SELECT P1.name, (SUM(R1.rate)/COUNT(R1.rate)) as avgRating, P1.id as id FROM PROJECT P1, RATING R1 \
				WHERE P1.id = R1.proj_id \
				GROUP BY P1.id) PR on P.id=PR.id \
			LEFT OUTER JOIN \
			(SELECT P2.name, GROUP_CONCAT(T2.tag SEPARATOR ", ") as tags, T2.proj_id FROM PROJECT P2, TAGS T2 \
				WHERE P2.id = T2.proj_id \
				GROUP by T2.proj_id) TR on P.id=TR.proj_id, \
			USER U \
		WHERE \
			U.mongoId = P.owner_id AND P.id=' + +id;
			
	connection.query(query, (err, r)=>{
					
		var project = r[0];
		
        if (err) {
            return next(err);
        } else if (!project) {
            return next(new Error('Failed to load Project ' + +id));
        }
		
		project.owner={firstName: project.firstname, lastName: project.lastname};
        req.project = project;
        next();
	});
};
