var r = require('rethinkdb');

r.connect({
	db: 'music'
}, function(err, conn) {
	r.table('artists').count().run(conn, function(err, res) {
		console.log(res);
	});

});