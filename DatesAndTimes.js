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
				return item('invoice_date').gt('2012-01-01');
			}).run(conn, function(err, res) {
				console.log('demo date comparison()', res);
				next();
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