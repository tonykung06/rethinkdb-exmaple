var r = require('rethinkdb');

r.connect({
	db: 'music'
}, function(err, conn) {
	var artists = require('./data/artists');
	var counter = 1;

	artists.forEach(function(artist) {
		r.table('artists').insert(artist).run(conn, {
			durability: 'soft',
			noreply: true
		}, function(err, res) {
			console.log(counter);
			counter++;
		});
	});

	conn.close();
});