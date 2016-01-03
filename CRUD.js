'use strict';

var r = require('rethinkdb');
var async = require('async');

r.connect({
	db: 'music'
}, function(err, conn) {
	async.series([
		function(next) {
			r.table('artists').count().run(conn, function(err, res) {
				console.log(res);
				next();
			});
		},
		function(next) {
			r.table('artists').insert({
				name: "Another Tony"
			}).run(conn, function(err, res) {
				console.log(res);
				next();
			});
		},
		function(next) {
			r.table('artists').filter({
				name: "Another Tony"
			}).run(conn, function(err, cursor) {
				cursor.toArray(function(err, result) {
					console.log(result);
					next();
				});
			});
		},
		function(next) {
			r.table('artists').filter(function(artist) {
				return artist('name').match('.*Tony');
			}).run(conn, function(err, cursor) {
				cursor.toArray(function(err, result) {
					console.log(result);
					next();
				});
			});
		},
		function(next) {
			r.table('artists').filter({
				name: "Another Tony"
			}).delete().run(conn, function(err, res) {
				console.log(res);
				next();
			});
		},
		function(next) {
			r.table('artists').insert({
				name: "Another Tony",
				title: "my title"
			}).run(conn, function(err, res) {
				console.log(res);
				next();
			});
		},
		function(next) {
			r.table('artists').filter({
				name: "Another Tony",
				title: "my title"
			}).run(conn, function(err, cursor) {
				cursor.toArray(function(err, result) {
					console.log(result);

					r.table('artists').get(result[0].id).update({
						name: 'replaced Tony',
						email: 'tonykung@tonykung.com'
					}).run(conn, function(err, res) {
						console.log(res);
						next();
					});
				});
			});
		},
		function(next) {
			r.table('artists').delete().run(conn, function(err, res) {
				console.log(res);
			});
		}
	], function() {
		conn.close();
	});

	//r.table('').concatMap();
});