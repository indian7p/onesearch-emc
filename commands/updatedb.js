const fetch = require("node-fetch");

module.exports = {
  name: "updatedb",
  description: "Updates the town database",
  execute: async (Town, Nation) => {
    let mapRes = await fetch(
      "https://earthmc.net/map/tiles/_markers_/marker_earth.json"
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        let areas = data.sets["townyPlugin.markerset"].areas;
        Town.remove({}, function(err) { 
          console.log('Collection removed') 
        })
          .then(divd => {
            for(var key in areas) {
              if(key.indexOf('__0') < 0 || key.indexOf('_Shop') > 0) {
                
              }else{
                let withHTML = areas[key].desc;
              let color = areas[key].color;
              let clean1 = withHTML.replace(/<[^>]*>?/gm, '');
              let clean2 = clean1.replace(`(Shop)`, '')
              let clean3 = clean2.replace(/Flags.*$/gmiu, '')
              let flags = clean2.split('Flags')
              if(flags[1].includes('capital: true')){
                var capital = true
              }else{
                var capital = false
              }
              let townData = clean3.split(/ Mayor | Members /)
              let nation = townData[0].split(" (")[1].slice(0, -1) == "" ? "No Nation": townData[0].split(" (")[1].slice(0, -1).replace(/_/gi, " ").trim().replace(/ /, '_');
              let x = Math.round((Math.max(...areas[key].x) + Math.min(...areas[key].x)) / 2);
              let z = Math.round((Math.max(...areas[key].z) + Math.min(...areas[key].z)) / 2);
              let name = townData[0].replace(/ *\([^)]*\) */g, "")
              let nameLower = name.toLowerCase()
              let xArray = areas[key].x;
              let zArray = areas[key].z;
              var newTown = new Town({
                name: name,
                nameLower: nameLower,
                nation: nation,
                color: color,
                mayor: townData[1],
                members: townData[2],
                membersArr: townData[2].split(', '),
                x: x,
                z: z,
                capital: capital,
              })
              newTown.save(function(err) {
                if (err) throw err;
              });
              }         
            }
          })
        })
    console.log('Update complete')
  }
};
