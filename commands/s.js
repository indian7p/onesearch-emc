const Discord = require('discord.js');
const fn = require('/app/util/fn');

const db = require('quick.db');
const nationsP = new db.table('nationsP');
const casst = new db.table('casst');
const CACHE = new db.table('CACHE');

module.exports = {
	name: 's',
	description: 'Searches OneSearch',
	execute: async (message, args, client, Nation) => {
		let errorMessage = new Discord.RichEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		if (!args[1]) return message.channel.send(errorMessage.setDescription('No search query'));
		let query = message.content.slice(4).toLowerCase();

		let embeds = [];

		let nationQuery = query.replace(/ /g, '_');
		Nation.findOne({ nameLower: nationQuery }, async function(err, nation) {
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

			let keys = CACHE.all().map((x) => x.ID);
			var pageNum = 0;

			for (const key of keys) {
				let data = CACHE.get(key);

				var themeColor = 0x0071bc;
				if (data.themeColor != undefined) var themeColor = data.themeColor;
				let resEmbed = new Discord.RichEmbed()
					.setTitle(data.name)
					.setURL(data.link)
					.setDescription(data.description)
					.setThumbnail(data.imageLink)
					.setColor(themeColor)
					.setFooter(`Page ${keys.indexOf(key) + 1}/${keys.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo.png');

				let name = data.name.toLowerCase() + '';
        if(data.description == null){
          continue;
        }
				let desc = data.description.toLowerCase() + '';
				let link = data.link.toLowerCase() + '';
				let id = data.id.toLowerCase() + '';

				if (id.indexOf(query) > -1) {
					var pageNum = pageNum + 1;
					embeds.push(resEmbed.setFooter(`Page ${pageNum} | OneSearch`, 'https://cdn.bcow.tk/assets/logo.png'));
				} else {
					if (name.indexOf(query) > -1) {
						var pageNum = pageNum + 1;
						embeds.push(resEmbed.setFooter(`Page ${pageNum} | OneSearch`, 'https://cdn.bcow.tk/assets/logo.png'));
					} else {
						if (desc.indexOf(query) > -1) {
							var pageNum = pageNum + 1;
							embeds.push(resEmbed.setFooter(`Page ${pageNum} | OneSearch`, 'https://cdn.bcow.tk/assets/logo.png'));
						}
					}
				}
			}
			if (embeds.length == 0) {
				message.channel.send(errorMessage.setDescription('No results found.'));
			} else {
				await message.channel.send(embeds[0]).then((m) => fn.paginator(message.author.id, m, embeds, 0));
			}
		});
	}
};
