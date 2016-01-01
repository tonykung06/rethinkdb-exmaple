var r = require('rethinkdb');
var async = require('async');

var createDb = function(next) {
	r.connect(function(err, conn) {
		r.dbCreate('music').run(conn, function(err, res) {
			conn.close();
			next(err, res);
		});
	});
};

var createTable = function(name, next) {
	r.connect({
		db: 'music'
	}, function(err, conn) {
		r.tableCreate(name).run(conn, function(err, res) {
			conn.close();
			next(err, res);
		});
	});
};

var createTables = function(next) {
	async.map(['artists', 'invoices'], createTable, next);
};

async.series({
	created: createDb,
	tables: createTables
}, function(err, res) {
	console.log(res);
});