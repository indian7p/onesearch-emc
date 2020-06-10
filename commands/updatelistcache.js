const fn = require('../util/fn'),
	db = require('quick.db'),
	listcache = new db.table('listcache'),
	casst = new db.table('casst');

module.exports = {
	name: 'updatelistcache',
	description: 'Updates the list cache',
	execute: async (Town, Nation) => {
		Town.find({}, async function(err, towns) {
			let lists = [];
			towns.sort(fn.compare).forEach((town) => {
				lists.push(`${town.name} (${town.nation}) - Residents: ${town.residents} - Area: ${town.area}`);
			});
			var i,
				j,
				temparray,
				chunk = 10;
			let counter = 0;
			await listcache.delete('towns');
			for (i = 0, j = lists.length; i < j; i += chunk) {
				temparray = lists.slice(i, i + chunk);
				counter++;
				listcache.push('towns', '```' + temparray.toString().replace(/,/gm, '\n') + '```');
			}
		});
		Nation.find({}, async function(err, nations) {
			let lists = [];
			nations.sort(fn.compare).forEach((nation) => {
				lists.push(`${nation.name} - Residents: ${nation.residents} - Area: ${nation.area} - Status: ${casst.get(nation.nameLower)}`);
			});
			var i,
				j,
				temparray,
				chunk = 10;
			let counter = 0;
			await listcache.delete('nations');
			for (i = 0, j = lists.length; i < j; i += chunk) {
				temparray = lists.slice(i, i + chunk);
				counter++;
				listcache.push('nations', '```' + temparray.toString().replace(/,/gm, '\n') + '```');
			}
		});
	}
};
