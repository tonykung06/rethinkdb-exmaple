'use strict';

var r = require('rethinkdb');
var async = require('async');
var invoices = require('./data/invoices');

r.connect({
	db: 'music'
}, function(err, conn) {
	async.series([
		function(next) {
			r.table('invoices').delete().run(conn, function(err, res) {
				console.log('deleting all demo documents', res);
				next();
			});
		},
		function(next) {
			r.table('invoices').insert(invoices).run(conn, function(err, res) {
				console.log('importing data...', res);
				next();
			});
		},
		function(next) {
			r.table('invoices').filter(function(item) {
				return r.ISO8601(item('invoice_date')).gt('2012-01-01').and(item('invoice_date').lt('2012-12-31'));
			}).pluck('invoice_date').run(conn, function(err, cursor) {
				cursor.toArray(function(err, result) {
					console.log('demo date comparison()', result);
					next();
				});
			});
		},
		function(next) {
			r.table('invoices').filter(function(item) {
				return r.ISO8601(item('invoice_date')).year().eq(2012);
			}).pluck('invoice_date').run(conn, function(err, cursor) {
				cursor.toArray(function(err, result) {
					console.log('demo date comparison()', result);
					next();
				});
			});
		},
		function(next) {
			r.table('invoices').delete().run(conn, function(err, res) {
				console.log('deleting all demo documents', res);
				next();
			});
		}
	], function() {
		conn.close();
	});
});