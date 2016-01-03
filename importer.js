var r = require('rethinkdb');

r.connect({
	db: 'music'
}, function(err, conn) {
	var artists = require('./data/artists');

	r.table('artists').insert(artists).run(conn, {
		durability: 'soft',
		noreply: true
	}, function(err, res) {
		console.log(artists.length);
	});

	conn.close();
});