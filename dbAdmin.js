var r = require('rethinkdb');
var async = require('async');
var artists = require('./data/artists');

var dropDb = function(next) {
	r.connect(function(err, conn) {
		r.dbDrop('music').run(conn, function(err, res) {
			conn.close();
			next(err, res);
		});
	});
};

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

var insertData = function(next) {
	r.connect({
		db: 'music'
	}, function(err, conn) {
		r.table('artists').insert(artists).run(conn, function(err, res) {
			conn.close();
			next();
		});
	});
};

var addIndex = function() {
	r.connect({
		db: 'music'
	}, function(err, conn) {
		r.table('artists').indexCreate('name_index', r.row('name')).run(conn, function(err, res) {
			conn.close();
			next();
		});
	});
};

async.series({
	dropped: dropDb,
	created: createDb,
	tables: createTables,
	data: insertData,
	index: addIndex
}, function(err, res) {
	console.log(res);
});