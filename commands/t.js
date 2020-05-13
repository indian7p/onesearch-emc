const Discord = require('discord.js');
const moment = require('moment-timezone');
const cache = require('quick.db');
const townP = new cache.table('townP');
const listcache = new cache.table('listcache')
const fn = require('/app/util/fn')

module.exports = {
	name: 't',
	description: 'Searches for towns',
	execute: (message, args, Town) => {
		message.channel.startTyping();
		let errorMessage = new Discord.RichEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		switch (args[1]) {
      case 'list':
        if(listcache.get('towns')==null) return message.channel.send(errorMessage.setDescription('Town list not found. The database may be updating, try again in a minute.'))
        let embeds = []
        let counter = 0
        listcache.get('towns').forEach(townsL => {
          counter++
          let embed = new Discord.RichEmbed()
          .setTitle('Town List')
          .setColor(0x0071bc)
          .setDescription(townsL)
          .setFooter(`OneSearch | Page ${counter}/${listcache.get('towns').length}`, 'https://cdn.bcow.tk/assets/logo.png')
          embeds.push(embed)
        })
        message.channel.send(embeds[0]).then(m => {
          fn.paginator(message.author.id, m, embeds, 0)
        })
        message.channel.stopTyping();
        break;
			default:
				if (!args[1]) return message.channel.send(errorMessage.setDescription('No results for ""'));
				var query = message.content.slice(4).toLowerCase().replace(/ /g, '_');
				Town.findOne({ nameLower: query }, function(err, town) {
					if (err) return console.log(err);
					if (town == null) {
						message.channel.stopTyping();
						return message.channel.send(errorMessage.setDescription('Town not found. The database may be updating, try again in a minute.'));
					}
					switch (town.color) {
						case '#FFFFFF':
							var color = '#FEFEFE';
							break;
						case '#000000':
							var color = '#010101';
							break;
						default:
							if (town.nation == 'No Nation') {
								var color = 0x69a841;
							} else {
								var color = town.color;
							}
							break;
					}
					if (town.capital == true) {
						var tName = ':star: ' + town.name + ' (' + town.nation + ')';
					} else {
						var tName = town.name + ' (' + town.nation + ')';
					}
					if (townP.get(`${town.name}.scrating`) == null) {
						var description = 'Information may be slightly out of date.';
					} else {
						var description = `**[Shootcity Rating: ${townP.get(`${town.name}.scrating`)}]**` + ' Information may be slightly out of date.';
					}
					let timeUp = moment(town.time).tz('America/New_York').format('MMMM D, YYYY h:mm A z');
					let memberList = '```' + town.members + '```';
					let resEmbed = new Discord.RichEmbed()
						.setTitle(tName)
						.setDescription(description)
						.setColor(color)
						.setThumbnail(townP.get(`${town.name}.imgLink`))
						.addField('Coords', `[${town.x}, ${town.z}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${town.x}&y=64&z=${town.z})`)
						.addField('Mayor', '```' + town.mayor + '```')
						.setFooter(`OneSearch | Database last updated: ${timeUp}`, 'https://cdn.bcow.tk/assets/logo.png');
					if (memberList.length > 1024) {
						var counter = 0;
						let members1 = [];
						let members2 = [];
						town.membersArr.forEach((member) => {
							counter++;
							if (counter <= 50) {
								members1.push(member);
							} else {
								members2.push(member);
							}
						});
            if(townP.get(`${town.name}.link`) == null) {
              message.channel.send(resEmbed.addField(`Members [1-50]`, '```' + members1.toString().replace(/,/g, ', ') + '```').addField(`Members [51-${town.membersArr.length}]`, '```' + members2.toString().replace(/,/g, ', ') + '```'));
            }else{
              message.channel.send(resEmbed.addField(`Members [1-50]`, '```' + members1.toString().replace(/,/g, ', ') + '```').addField(`Members [51-${town.membersArr.length}]`, '```' + members2.toString().replace(/,/g, ', ') + '```').setURL(townP.get(`${town.name}.link`)));
            }
					} else {
            if(townP.get(`${town.name}.link`) == null) {
              message.channel.send(resEmbed.addField(`Members [${town.membersArr.length}]`, memberList));
            }else{
              message.channel.send(resEmbed.addField(`Members [${town.membersArr.length}]`, memberList).setURL(townP.get(`${town.name}.link`)));
            }
					}
					message.channel.stopTyping();
				});
				break;
		}
	}
};
