var fs = require("fs");
var faker = require('faker');

// var randomName = faker.name.findName(); // Rowan Nikolaus
// var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
// var randomCard = faker.helpers.createCard(); // random contact card containing many propertie

var countOfItems = 100;
var i;
var items = [];

for (i = 0; i < countOfItems; i++) {
	items.push({
		name: faker.name.findName()
	});
}

fs.writeFile('data/testing.json', JSON.stringify(items), "utf8", function() {
	console.dir(require("./data/testing.json"));
});

// console.log(faker.fake('{{name.lastName}}, {{name.firstName}} {{name.suffix}}'));