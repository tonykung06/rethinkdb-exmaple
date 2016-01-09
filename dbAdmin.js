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
			next(err, res);
		});
	});
};

var addIndex = function(next) {
	r.connect({
		db: 'music'
	}, function(err, conn) {
		r.table('artists').indexCreate('name_index', r.row('name')).run(conn, function(err, res) {
			console.log(res);
			conn.close();
			next(err, res);
		});
	});
};

var queryByIndex = function(next) {
	r.connect({
		db: 'music'
	}, function(err, conn) {
		r.table('artists').indexWait("name_index").getAll('Tony', {
			index: 'name_index'
		}).run(conn, function(err, res) {
			console.log(res);
			conn.close();
			next(err, res);
		});
	});
};

async.series({
	dropped: dropDb,
	created: createDb,
	tables: createTables,
	data: insertData,
	index: addIndex,
	query: queryByIndex
}, function(err, res) {
	console.log(res);
});
