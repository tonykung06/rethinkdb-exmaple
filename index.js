var r = require('rethinkdb');

r.connect(function(err, conn) {
	if (err) {
		console.log('connection error', err);
		return;
	}

	r.dbCreate('music').run(conn, function(err, res) {
		if (err) {
			console.log('failed to create music db', res);
			return;
		}

		console.log('response', res);
	});
});