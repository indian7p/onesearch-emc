const Discord = require('discord.js');
const fn = require('/app/util/fn');

const db = require('quick.db');
const nationsP = new db.table('nationsP');
const casst = new db.table('casst');
const listcache = new db.table('listcache');

module.exports = {
	name: 'n',
	description: 'Searches for nations',
	execute: async (message, args, Town, Nation) => {
		let errorMessage = new Discord.RichEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		let nHelp = new Discord.RichEmbed().setTitle('1!n - Help').addField('1!n [nation]', 'Finds nations').addField('1!n list', 'Lists all nations by residents').setColor(0x0071bc).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		message.channel.startTyping();
		switch (args[1]) {
			case 'list':
				if (listcache.get('nations') == null) return message.channel.send(errorMessage.setDescription('Nation list not found. The database may be updating, try again in a minute.'));
				let embeds = [];
				let counter = 0;
				listcache.get('nations').forEach((nationsL) => {
					counter++;
					let embed = new Discord.RichEmbed().setTitle('Nation List').setColor(0x0071bc).setDescription(nationsL).setFooter(`OneSearch | Page ${counter}/${listcache.get('nations').length}`, 'https://cdn.bcow.tk/assets/logo.png');
					embeds.push(embed);
				});
				message.channel.send(embeds[0]).then((m) => {
					fn.paginator(message.author.id, m, embeds, 0);
				});
				message.channel.stopTyping();
				break;
			default:
        var query = message.content.slice(4).toLowerCase().replace(/ /g, '_');
        if(query == 'no_nation') return message.channel.send(errorMessage.setDescription('Use 1!nonation'))
				Nation.findOne({ nameLower: query }, function(err, nation) {
					if (nation == null) {
						Town.findOne({ nameLower: query }, function(err, town) {
							if (town == null) {
								message.channel.stopTyping();
								message.channel.send(errorMessage.setDescription('Nation not found. The database may be updating, try again in a minute.'));
								return;
							}
							if (town.nation == 'No Nation') {
								message.channel.stopTyping();
								message.channel.send(errorMessage.setDescription('Town is not in a nation.'));
							}
							Nation.findOne({ name: town.nation }, function(err, nationByTown) {
								var townsList = '```Error getting towns```';
								var townsLength = '0';

								let nationCASST = casst.get(`${nationByTown.nameLower}`);
								let nationDisc = nationsP.get(`${nationByTown.nameLower}.discord`);
								let nationAMNT = nationsP.get(`${nationByTown.nameLower}.amenities`);
								var nationName = nationByTown.name;
								var imgLink = 'https://cdn.bcow.tk/assets/logo.png';

								if (nationByTown.townsArr.toString() != null) {
									var townsList = nationByTown.townsArr.toString().replace(/,/g, ', ');
									var townsLength = nationByTown.townsArr.length;
								}
								if (nationCASST == '<:verified:696564425775251477> Verified') var nationName = '<:verified:696564425775251477> ' + nationByTown.name;
                if (nationsP.get(`${nationByTown.nameLower}.imgLink`) != null) var imgLink = nationsP.get(`${nationByTown.nameLower}.imgLink`);
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
                let location = nationByTown.location.split(",")
								let resEmbedN = new Discord.RichEmbed()
									.setTitle(nationName)
                  .setDescription("TIP: You can now search for nations using 1!s. Nations, towns, discords, and more all in one command.")
									.setColor(nationByTown.color)
									.setThumbnail(imgLink)
									.addField('Owner', '```' + nationByTown.owner + '```', true)
									.addField('Capital', nationByTown.capital, true)
                  .addField('CASST Status', nationCASST)
									.addField('Residents', nationByTown.residents, true)
                  .addField('Location', `[${location[0]}, ${location[1]}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${location[0]}&y=64&z=${location[1]})`, true)
									.setFooter(`OneSearch`, 'https://cdn.bcow.tk/assets/logo.png');
								if (nationDisc == null) {
									if (nationAMNT == null) {
										if (members2STR == null) {
											message.channel.send(resEmbedN.addField(`Towns [${nationByTown.townsArr.length}]`, '```' + townsList + '```'));
										} else {
											message.channel.send(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nationByTown.townsArr.length}]`, '```' + members2STR + '```'));
										}
									} else {
										if (members2STR == null) {
											message.channel.send(resEmbedN.addField(`Towns [${nationByTown.townsArr.length}]`, '```' + townsList + '```').setDescription(nationAMNT));
										} else {
											message.channel.send(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nationByTown.townsArr.length}]`, '```' + members2STR + '```'));
										}
									}
								} else {
									if (nationAMNT == null) {
										if (members2STR == null) {
											message.channel.send(resEmbedN.addField(`Towns [${nationByTown.townsArr.length}]`, '```' + townsList + '```').setURL(nationDisc));
										} else {
											message.channel.send(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nationByTown.townsArr.length}]`, '```' + members2STR + '```').setURL(nationDisc));
										}
									} else {
										if (members2STR == null) {
											message.channel.send(resEmbedN.addField(`Towns [${nationByTown.townsArr.length}]`, '```' + townsList + '```').setDescription(nationAMNT).setURL(nationDisc));
										} else {
											message.channel.send(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nationByTown.townsArr.length}]`, '```' + members2STR + '```').setURL(nationDisc).setDescription(nationAMNT));
										}
									}
								}
							});
						});
					} else {
						var townsList = '```Error getting towns```';
						var townsLength = '0';

						let nationCASST = casst.get(`${nation.nameLower}`);
						let nationDisc = nationsP.get(`${nation.nameLower}.discord`);
						let nationAMNT = nationsP.get(`${nation.nameLower}.amenities`);
						var nationName = nation.name;
						var imgLink = 'https://cdn.bcow.tk/assets/logo.png';

						if (nation.townsArr.toString() != null) {
							var townsList = nation.townsArr.toString().replace(/,/g, ', ');
							var townsLength = nation.townsArr.length;
						}
						if (nationCASST == '<:verified:696564425775251477> Verified') var nationName = '<:verified:696564425775251477> ' + nation.name;
						if (nationsP.get(`${nation.nameLower}.imgLink`) != null) var imgLink = nationsP.get(`${nation.nameLower}.imgLink`);
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
            let location = nation.location.split(",")
						let resEmbedN = new Discord.RichEmbed()
							.setTitle(nationName)
              .setDescription("TIP: You can now search for nations using 1!s. Nations, towns, discords, and more all in one command.")
							.setColor(nation.color)
							.setThumbnail(imgLink)
							.addField('Owner', '```' + nation.owner + '```')
							.addField('Capital', nation.capital)
							.addField('Residents', nation.residents)
							.addField('Residents', nation.residents, true)
              .addField('Location', `[${location[0]}, ${location[1]}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${location[0]}&y=64&z=${location[1]})`, true)
							.setFooter(`OneSearch`, 'https://cdn.bcow.tk/assets/logo.png');
						if (nationDisc == null) {
							if (nationAMNT == null) {
								if (members2STR == null) {
									message.channel.send(resEmbedN.addField(`Towns [${nation.townsArr.length}]`, '```' + townsList + '```'));
								} else {
									message.channel.send(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nation.townsArr.length}]`, '```' + members2STR + '```'));
								}
							} else {
								if (members2STR == null) {
									message.channel.send(resEmbedN.addField(`Towns [${nation.townsArr.length}]`, '```' + townsList + '```').setDescription(nationAMNT));
								} else {
									message.channel.send(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nation.townsArr.length}]`, '```' + members2STR + '```'));
								}
							}
						} else {
							if (nationAMNT == null) {
								if (members2STR == null) {
									message.channel.send(resEmbedN.addField(`Towns [${nation.townsArr.length}]`, '```' + townsList + '```').setURL(nationDisc));
								} else {
									message.channel.send(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nation.townsArr.length}]`, '```' + members2STR + '```').setURL(nationDisc));
								}
							} else {
								if (members2STR == null) {
									message.channel.send(resEmbedN.addField(`Towns [${nation.townsArr.length}]`, '```' + townsList + '```').setDescription(nationAMNT).setURL(nationDisc));
								} else {
									message.channel.send(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nation.townsArr.length}]`, '```' + members2STR + '```').setURL(nationDisc).setDescription(nationAMNT));
								}
							}
						}
					}
				});
        message.channel.stopTyping()			
        break;
		}
	}
};
