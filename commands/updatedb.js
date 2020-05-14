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
                var color = areas[key].color;
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
                let name = townData[0].replace(/ *\([^)]*\) */g, "").replace(/(&amp;)(. *)/g, "");
                if(townData[0].replace(/ *\([^)]*\) */g, "").includes("&")){
                  let town = new RegExp(`/${name}/`, "g")
                  let color1 = townData[0].replace(/ *\([^)]*\) */g, "").slice(5).replace(town, "").replace(/(&amp;)(. *)/g, "");
                  console.log(color1)
                  switch(color1){
                    case '0'+name:
                      var color = "#111111"
                      break;
                    case '1'+name:
                      var color = "#0000AA"
                      break;
                    case '2':
                      var color = "#00AA00"
                      break;
                    case '3'+name:
                      var color = "#00AAAA"
                      break;
                    case '4'+name:
                      var color = "#AA0000"
                      break;
                    case '5'+name:
                      var color = "#AA00AA"
                      break;
                    case '6'+name:
                      var color = "#FFAA00"
                      break;
                    case '7'+name:
                      var color = "#AAAAAA"
                      break;
                    case '8'+name:
                      var color = "#555555"
                      break;
                    case '9'+name:
                      var color = "#5555FF"
                      break;
                    case 'a'+name:
                      var color = "#55FF55"
                      break;
                    case 'b'+name:
                      var color = "#55FFFF"
                      break;
                    case 'c'+name:
                      var color = "#FF5555"
                      break;
                    case 'd'+name:
                      var color = "#FF55FF"
                      break;
                    case 'e'+name:
                      var color = "#FFFF55"
                      break;
                    case 'f'+name:
                      var color = "#FEFEFE"
                      break;
                  }
                }
                let nation = townData[0].split(" (")[1].slice(0, -1) == "" ? "No Nation": townData[0].split(" (")[1].slice(0, -1).replace(/_/gi, " ").trim().replace(/ /, '_');
                let x = Math.round((Math.max(...areas[key].x) + Math.min(...areas[key].x)) / 2);
                let z = Math.round((Math.max(...areas[key].z) + Math.min(...areas[key].z)) / 2);
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
                  residents: townData[2].split(', ').length,
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
