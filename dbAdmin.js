var r = require('rethinkdb');
var async = require('async');
var artists = require('./data/artists');

var dropDb = function(next) {
	r.connect(function(err, conn) {
		r.dbDrop('music').run(conn, function(err, res) {
			console.log(err, res);
			conn.close();
			next(err, res);
		});
	});
};

var createDb = function(next) {
	r.connect(function(err, conn) {
		r.dbCreate('music').run(conn, function(err, res) {
			console.log(err, res);
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
			console.log(err, res);
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
			console.log(err, res);
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
			console.log(err, res);
			conn.close();
			next(err, res);
		});
	});
};

var queryByIndex = function(next) {
	r.connect({
		db: 'music'
	}, function(err, conn) {
		r.table('artists').indexWait("name_index").run(conn, function(err, res) {
			r.table('artists').getAll('Tony', 'Wini', {
				index: 'name_index'
			}).run(conn, function(err, cursor) {
				conn.close();

				if (err) {
					console.log(err);
					next(err);
					return;
				}
				
				cursor.toArray(function(err, result) {
					console.log(result);
					next();
				});
			});
		})
	});
};

var sortByIndex = function(next) {
	r.connect({
		db: 'music'
	}, function(err, conn) {
		r.table('artists').indexWait("name_index").run(conn, function(err, res) {
			r.table('artists').orderBy({
				index: r.desc('name_index')
			}).run(conn, function(err, cursor) {
				conn.close();

				if (err) {
					console.log(err);
					next(err);
					return;
				}
				
				cursor.toArray(function(err, result) {
					console.log(result);
					next();
				});
			});
		})
	});
};

var dropIndex = function(next) {
	r.connect({
		db: 'music'
	}, function(err, conn) {
		r.table('artists').indexDrop('name_index').run(conn, function(err, res) {
			console.log(err, res);
			conn.close();
			next(err, res);
		});
	});
};

var addCompoundIndex = function(next) {
	r.connect({
		db: 'music'
	}, function(err, conn) {
		r.table('artists').indexCreate('my_compound_index', [r.row('name'), r.row('age')]).run(conn, function(err, res) {
			console.log(err, res);
			conn.close();
			next(err, res);
		});
	});
};

var queryByCompoundIndex = function(next) {
	r.connect({
		db: 'music'
	}, function(err, conn) {
		r.table('artists').indexWait("my_compound_index").run(conn, function(err, res) {
			r.table('artists').getAll(['Tony', 27], ['Wini', 23], {
				index: 'my_compound_index'
			}).run(conn, function(err, cursor) {
				conn.close();

				if (err) {
					console.log(err);
					next(err);
					return;
				}
				
				cursor.toArray(function(err, result) {
					console.log(result);
					next();
				});
			});
		})
	});
};

async.series([
	dropDb,
	createDb,
	createTables,
	insertData,
	addIndex,
	queryByIndex,
	sortByIndex,
	dropIndex,
	addCompoundIndex,
	queryByCompoundIndex
], function(err, res) {
	console.log('==================================\n', err, res);
});
