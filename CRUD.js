'use strict';

var r = require('rethinkdb');
var async = require('async');
var artists = require('./data/artists');

r.connect({
	db: 'music'
}, function(err, conn) {
	async.series([
		function(next) {
			r.table('artists').delete().run(conn, function(err, res) {
				console.log('deleting all demo documents', res);
				next();
			});
		},
		function(next) {
			r.table('artists').count().run(conn, function(err, res) {
				console.log('demo count()', res);
				next();
			});
		},
		function(next) {
			r.table('artists').typeOf().run(conn, function(err, res) {
				console.log('demo typeOf()', res);
				next();
			});
		},
		function(next) {
			r.table('artists').insert(artists).run(conn, function(err, res) {
				console.log('demo insert()', res);
				next();
			});
		},
		function(next) {
			r.table('invoices')('customer').merge(function(customer) {
				return {
					invoices: r.table('invoices').filter(function(invoice) {
						return invoice('customer_id').eq(customer('customer_id'));
					}).coerceTo('array')
				};
			}).run(conn, function(err, res) {
				if (err) {
					console.log(err);
					next(err);
					return;
				}
				
				console.log(res);
				next();
			});
		},
		function(next) {
			r.table('artists').pluck(['name', 'age']).orderBy('age').skip(1).limit(3).skip(1).run(conn, function(err, cursor) {
				cursor.toArray(function(err, result) {
					console.log('demo pluck(), orderBy(), limit(), skip()', result);
					next();
				});
			});
		},
		function(next) {
			r.table('artists').pluck(['name', 'age']).map(function(item) {
				return item('age');
			}).run(conn, function(err, cursor) {
				cursor.toArray(function(err, result) {
					console.log('demo map()', result);
					next();
				});
			});
		},
		function(next) {
			r.table('artists').hasFields('languages').pluck(['name', 'languages']).concatMap(function(item) {
				return item('languages').filter(function(lang) {
					return lang.eq('Chinese');
				});
			}).run(conn, function(err, cursor) {
				cursor.toArray(function(err, result) {
					console.log('demo hasFields(), concatMap()', result);
					next();
				});
			});
		},
		function(next) {
			//the same as hasFields() + pluck()
			r.table('artists').withFields('languages').run(conn, function(err, cursor) {
				cursor.toArray(function(err, result) {
					console.log('demo withFields()', result);
					next();
				});
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
});