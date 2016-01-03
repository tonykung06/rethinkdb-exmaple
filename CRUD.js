'use strict';

var r = require('rethinkdb');

r.connect({
	db: 'music'
}, function(err, conn) {
	r.table('artists').count().run(conn, function(err, res) {
		console.log(res);
	});

	r.table('artists').insert({
		name: "Another Tony"
	}).run(conn, function(err, res) {
		console.log(res);
	});

	r.table('artists').filter({
		name: "Another Tony"
	}).run(conn, function(err, res) {
		console.log(res);
	});

	r.table('artists').filter({
		name: "Another Tony"
	}).delete().run(conn, function(err, res) {
		console.log(res);
	});

	r.table('artists').insert({
		name: "Another Tony",
		title: "my title"
	}).run(conn, function(err, res) {
		console.log(res);
	});

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
				console.log(res);
			});
		});
	});

	// r.table('artists').delete().run(conn, function(err, res) {
	// 	console.log(res);
	// });

	conn.close();
});