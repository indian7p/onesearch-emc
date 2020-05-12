const Discord = require('discord.js');
const fn = require('/app/util/fn');

const db = require('quick.db');
const nationsP = new db.table('nationsP');
const casst = new db.table('casst');
const CACHE = new db.table('CACHE');

module.exports = {
	name: 's',
	description: 'Searches OneSearch',
	execute(message, args, client, Nation, Result) {
		let errorMessage = new Discord.RichEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		if (!args[1]) return message.channel.send(errorMessage.setDescription('No search query'));
		let query = message.content.slice(4).toLowerCase();

		let embeds = [];

		let nationQuery = query.replace(/ /g, '_');
		Nation.findOne({ nameLower: nationQuery }, function(err, nation) {
			if (nation != null) {
				let townsList = nation.townsArr.toString().replace(/,/g, ', ');
				let CASSTstatus = casst.get(`${nation.nameLower}`);
				var imgLink = nationsP.get(`${nation.nameLower}.imgLink`);
				var nationName = nation.name;
				let nationDisc = nationsP.get(`${nation.nameLower}.discord`);
				let nationAMNT = nationsP.get(`${nation.nameLower}.amenities`);

				if (CASSTstatus == '<:verified:696564425775251477> Verified') var nationName = `<:verified:696564425775251477> ${nation.name}`;
				if (imgLink == null) var imgLink = 'https://cdn.bcow.tk/assets/logo.png';

				if (townsList.length > 1024) {
					var counter = 0;
					let members1 = [];
					let members2 = [];
					nation.townsArr.forEach((member) => {
						counter++;
						if (counter <= 50) {
							members1.push(member);
						} else {
							members2.push(member);
						}
					});
					var members1STR = '```' + members1.toString().replace(/,/g, ', ') + '```';
					var members2STR = '```' + members2.toString().replace(/,/g, ', ') + '```';
				}

				let resEmbedN = new Discord.RichEmbed()
					.setTitle(nationName)
					.setColor(nation.color)
					.setThumbnail(imgLink)
					.addField('Owner', '```' + nation.owner + '```')
					.addField('Capital', nation.capital)
					.addField('Residents', nation.residents)
					.addField('CASST Status', CASSTstatus)
					.setFooter(`OneSearch`, 'https://cdn.bcow.tk/assets/logo.png');

				if (nationDisc == null) {
					if (nationAMNT == null) {
						if (members2STR == null) {
							embeds.push(resEmbedN.addField(`Towns [${nation.townsArr.length}]`, '```' + townsList + '```'));
						} else {
							embeds.push(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nation.townsArr.length}]`, '```' + members2STR + '```'));
						}
					} else {
						if (members2STR == null) {
							embeds.push(resEmbedN.addField(`Towns [${nation.townsArr.length}]`, '```' + townsList + '```').setDescription(nationAMNT));
						} else {
							embeds.push(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nation.townsArr.length}]`, '```' + members2STR + '```'));
						}
					}
				} else {
					if (nationAMNT == null) {
						if (members2STR == null) {
							embeds.push(resEmbedN.addField(`Towns [${nation.townsArr.length}]`, '```' + townsList + '```').setURL(nationDisc));
						} else {
							embeds.push(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nation.townsArr.length}]`, '```' + members2STR + '```').setURL(nationDisc));
						}
					} else {
						if (members2STR == null) {
							embeds.push(resEmbedN.addField(`Towns [${nation.townsArr.length}]`, '```' + townsList + '```').setDescription(nationAMNT).setURL(nationDisc));
						} else {
							embeds.push(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nation.townsArr.length}]`, '```' + members2STR + '```').setURL(nationDisc).setDescription(nationAMNT));
						}
					}
				}
			}
      
      Result.find({"$text": {"$search": query}}, async function(err, results){
        let pageNum = 0
        await results.forEach(data => {
          if(data.desc == null){
           console.log(data.name+" Missing desc.")
          }else{
            console.log(data.name)
            var themeColor = 0x0071bc;
				    if (data.themeColor != undefined) var themeColor = data.themeColor;
				    let resEmbed = new Discord.RichEmbed()
					  .setTitle(data.name)
					  .setURL(data.link)
					  .setDescription(data.desc)
            .setThumbnail(data.imgLink)
					  .setColor(themeColor)
					  .setFooter(`Page ${pageNum+1}/${results.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo.png');
            embeds.push(resEmbed)
            pageNum++
          }
        })
        if (embeds.length == 0) {
	        message.channel.send(errorMessage.setDescription('No results found.'));
		    } else {
		      message.channel.send(embeds[0]).then((m) => fn.paginator(message.author.id, m, embeds, 0));
		    }
      })
		})
	}
};
