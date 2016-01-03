'use strict';

var r = require('rethinkdb');
var async = require('async');

r.connect({
	db: 'music'
}, function(err, conn) {
	async.series([
		function(next) {
			r.table('artists').count().run(conn, function(err, res) {
				console.log('demo count()', res);
				next();
			});
		},
		function(next) {
			r.table('artists').insert({
				name: "Another Tony",
				age: 24,
				motherLanguage: 'English'
			}).run(conn, function(err, res) {
				console.log('demo insert()', res);
				next();
			});
		},
		function(next) {
			r.table('artists').pluck(['name', 'age']).run(conn, function(err, res) {
				console.log('demo pluck()', res);
				next();
			});
		},
		function(next) {
			r.table('artists').filter({
				name: "Another Tony"
			}).run(conn, function(err, cursor) {
				cursor.toArray(function(err, result) {
					console.log('demo filter()', result);
					next();
				});
			});
		},
		function(next) {
			r.table('artists').filter(function(artist) {
				return artist('name').match('.*Tony');
			}).run(conn, function(err, cursor) {
				cursor.toArray(function(err, result) {
					console.log('demo filter() with regex', result);
					next();
				});
			});
		},
		function(next) {
			r.table('artists').filter({
				name: "Another Tony"
			}).delete().run(conn, function(err, res) {
				console.log('demo chaining filter() and delete()', res);
				next();
			});
		},
		function(next) {
			r.table('artists').insert({
				name: "Another Tony",
				title: "my title"
			}).run(conn, function(err, res) {
				console.log('inserting a demo object', res);
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

					r.table('artists').get(result[0].id).replace({
						id: result[0].id,
						name: 'replaced Tony',
						email: 'tonykung@tonykung.com'
					}).run(conn, function(err, res) {
						console.log('demo get() and replace()', res);
						console.log('update() could be used in the same way as replace()');
						next();
					});
				});
			});
		},
		function(next) {
			r.table('artists').delete().run(conn, function(err, res) {
				console.log('deleting all demo documents', res);
				next();
			});
		}
	], function() {
		conn.close();
	});

	//r.table('').concatMap();
});