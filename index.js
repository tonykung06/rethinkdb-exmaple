var r = require('rethinkdb');

r.connect(function(err, conn) {
	if (err) {
		console.log(err);
		return;
	}
	
	r.dbCreate('music').run(conn, function(err, res) {
		console.log(res);
	});
});