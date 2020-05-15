const fetch = require("node-fetch");
const moment = require('moment-timezone')

const db = require('quick.db')
const listcache = new db.table('listcache')
const casst = new db.table('casst')

function compare(a, b) {
	const bandA = a.residents;
	const bandB = b.residents;

	let comparison = 0;
	if (bandA > bandB) {
		comparison = 1;
	} else if (bandA < bandB) {
		comparison = -1;
	}
	return comparison * -1;
}

module.exports = {
  name: "updatelistcache",
  description: "Updates the list cache",
  execute: async (Town, Nation) => {
    Town.find({}, async function(err, towns) {
        let lists = []
        towns.sort(compare).forEach(town => {
          lists.push(`${town.name} (${town.nation}) - Residents: ${town.residents}`)
        })
        var i,j,temparray,chunk = 10;
        let timeUp = moment(towns[1].time).tz('America/New_York').format('MMMM D, YYYY h:mm A z');
        let counter = 0
        await listcache.delete('towns')
        for (i=0,j=lists.length; i<j; i+=chunk) {
          temparray = lists.slice(i,i+chunk);
          counter++
          listcache.push('towns', '```'+temparray.toString().replace(/,/gm, '\n')+'```')
        }
	  });
    Nation.find({}, async function(err, nations) {
        let lists = []
        nations.sort(compare).forEach(nation => {
          lists.push(`${nation.name} - Residents: ${nation.residents} - Status: ${casst.get(nation.nameLower)}`)
        })
        var i,j,temparray,chunk = 10;
        let counter = 0
        await listcache.delete('nations')
        for (i=0,j=lists.length; i<j; i+=chunk) {
          temparray = lists.slice(i,i+chunk);
          counter++
          listcache.push('nations', '```'+temparray.toString().replace(/,/gm, '\n')+'```')
        }
	  });
  }
};
