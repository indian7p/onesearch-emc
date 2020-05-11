const cache = require("quick.db");
const tmp = new cache.table('tmp')

module.exports = {
  name: "updatenations",
  description: "Updates the nations database",
  execute: async (Town, Nation) => { 
      Town.find({}, function(err, towns){
      let nationsListwD = []
      towns.forEach(elems => {
        nationsListwD.push(elems.nation)
        console.log(elems.nation)
      })
      let uniqueNations = nationsListwD.filter((c, index) => {
        return nationsListwD.indexOf(c) === index;
      });
      uniqueNations.forEach(async (nation) => {
        await tmp.delete(`${nation}`)
        let nQuery = nation.replace(/ /,  '_').toLowerCase()
        await Nation.findOneAndDelete({'nameLower': nQuery}, function(){})
        let query = new RegExp(`^${nation}$`, 'gmiu')
        Town.find({'nation': query}, function(err, towns2){
          towns2.forEach(town => {
            tmp.set(`${nation}.color`, town.color) 
            tmp.push(`${nation}.towns`, town.name)
            tmp.add(`${nation}.resAmt`, town.membersArr.length)
            if(town.capital == true){
              tmp.set(`${nation}.owner`, town.mayor) 
              tmp.set(`${nation}.capital`, town.name) 
            }
          })
          let uniqueTowns = tmp.get(`${nation}.towns`).filter((c, index) => {
            return tmp.get(`${nation}.towns`).indexOf(c) === index;
          });
          var newNation = new Nation({
            name: nation.replace(/ /, '_'),
            nameLower: nation.replace(/ /, '_').toLowerCase(),
            color: tmp.get(`${nation}.color`),
            townsArr: uniqueTowns,
            residents: tmp.get(`${nation}.resAmt`),
            owner: tmp.get(`${nation}.owner`),
            capital: tmp.get(`${nation}.capital`),
          })
          newNation.save(function(err) {
            if (err) throw err;
          }); 
          console.log(`Saving ${nation}`)
        })
        })
      })
  }
};