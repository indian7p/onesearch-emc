const cache = require('quick.db');
const tmp = new cache.table('tmp');

module.exports = {
	name: 'updatenations',
	description: 'Updates the nations database',
	execute: async (Town, Nation) => {
		Town.find({}, function(err, towns) {
			let nationsListwD = [];
			towns.forEach((elems) => {
				nationsListwD.push(elems.nation);
				//console.log(elems.nation);
			});
			let uniqueNations = nationsListwD.filter((c, index) => {
				return nationsListwD.indexOf(c) === index;
			});
			uniqueNations.forEach(async (nation) => {
				await tmp.delete(`${nation}`);
				let nQuery = nation.replace(/ /, '_').toLowerCase();
				await Nation.findOneAndDelete({ nameLower: nQuery }, function() {});
				let query = new RegExp(`^${nation}$`, 'gmiu');
				Town.find({ nation: query }, function(err, towns2) {
					let townsArr = [];
					let counter = 0;
					towns2.forEach((town) => {
						tmp.set(`${nation}.color`, town.color);
						townsArr.push(town.name);
						tmp.add(`${nation}.resAmt`, town.membersArr.length);
						if (town.capital == true) {
							tmp.set(`${nation}.owner`, town.mayor);
							tmp.set(`${nation}.capital`, town.name);
						}
						counter++;
						if (counter == towns2.length) {
							let uniqueTowns = townsArr.filter((c, index) => {
								return townsArr.indexOf(c) === index;
							});
              let name = nation.replace(/ /g, '_').replace(/ *\([^)]*\) */g, '').replace(/(&amp;)(. *)/g, '');
							let color1 = nation.replace(/ *\([^)]*\) */g, '').replace(name, "").slice(5);
              var color = tmp.get(`${nation}.color`);
              console.log(color1)
							switch (color1) {
								case '0':
									var color = '#111111';
									break;
								case '1':
									var color = '#0000AA';
									break;
								case '2':
									var color = '#00AA00';
									break;
								case '3':
									var color = '#00AAAA';
									break;
								case '4':
									var color = '#AA0000';
									break;
								case '5':
									var color = '#AA00AA';
									break;
								case '6':
									var color = '#FFAA00';
									break;
								case '7':
									var color = '#AAAAAA';
									break;
								case '8':
									var color = '#555555';
									break;
								case '9':
									var color = '#5555FF';
									break;
								case 'a':
									var color = '#55FF55';
									break;
								case 'b':
									var color = '#55FFFF';
									break;
								case 'c':
									var color = '#FF5555';
									break;
								case 'd':
									var color = '#FF55FF';
									break;
								case 'e':
									var color = '#FFFF55';
									break;
								case 'f':
									var color = '#FEFEFE';
									break;
							}
							var newNation = new Nation({
								name: name,
								nameLower: name.toLowerCase(),
								color: color,
								townsArr: uniqueTowns,
								residents: tmp.get(`${nation}.resAmt`),
								owner: tmp.get(`${nation}.owner`),
								capital: tmp.get(`${nation}.capital`)
							});
							newNation.save(function(err) {
								if (err) throw err;
							});
							//console.log(`Saving ${nation}`);
						}
					});
				});
			});
		});
	}
};
