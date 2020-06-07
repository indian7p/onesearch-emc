const Discord = require('discord.js'),
	fn = require('../util/fn'),
  db = require('quick.db'),
  fetch = require('node-fetch'),
	nationsP = new db.table('nationsP'),
	casst = new db.table('casst'),
	listcache = new db.table('listcache');

module.exports = {
	name: 'n',
	description: 'Searches for nations',
	execute: async (message, args, Town, Nation) => {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		let nHelp = new Discord.MessageEmbed()
			.setTitle('1!n - Help')
			.addField('1!n [nation]', 'Finds nations')
      .addField('1!n list', 'Lists all nations by residents')
      .addField('1!n online [nation]', 'Lists all online players in a specified nation.')
			.setColor(0x0071bc)
			.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		message.channel.startTyping();
		switch (args[1]) {
			case 'list':
				if (listcache.get('nations') == null) return message.channel.send(errorMessage.setDescription('Nation list not found. The database may be updating, try again in a minute.'));
				let embeds = [];
				let counter = 0;
				listcache.get('nations').forEach((nationsL) => {
					counter++;
					let embed = new Discord.MessageEmbed().setTitle('Nation List').setColor(0x0071bc).setDescription(nationsL).setFooter(`OneSearch | Page ${counter}/${listcache.get('nations').length}`, 'https://cdn.bcow.tk/assets/logo.png');
					embeds.push(embed);
				});
				message.channel.send(embeds[0]).then((m) => {
					fn.paginator(message.author.id, m, embeds, 0);
				});
				message.channel.stopTyping();
        break;
        case 'online':
          fetch('https://earthmc.net/map/up/world/earth/')
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              let query = args[0] == 'nation' ? message.content.slice(16).toLowerCase().replace(/ /g, '_'): message.content.slice(11).toLowerCase().replace(/ /g, '_');
              Nation.findOne({ nameLower: query }, function(err, nation) {
                if (err) return message.channel.send(errorMessage.setDescription("An error occurred."))
                if (nation == null) {
                  message.channel.stopTyping();
                  return message.channel.send(errorMessage.setDescription('Nation not found. The database may be updating, try again in a minute.'));
                }
                let counter = 0;
                let online = [];
                data.players.forEach((player) => {
                  Town.findOne({ membersArr: { $in: [ player.account ] } }, function(err, playerTown) {
                    if (playerTown != null) {
                      if (playerTown.nation == nation.name) {
                        online.push(player.account);
                      }
                    }
                  }).then((n) => {
                    counter++;
                    if (counter == data.players.length) {
                      if (online.length == 0) {
                        var onlineCount = 0;
                        online.push('No players online');
                      } else {
                        var onlineCount = online.length;
                      }
                      let embed = new Discord.MessageEmbed()
                        .setTitle(`Players Online - ${nation.name}`)
                        .setColor(0x0071bc)
                        .setDescription(`**Players [${onlineCount}]**\`\`\`\n${online.toString().replace(/,/g, ', ')}\`\`\``)
                        .setFooter(`OneSearch`, 'https://cdn.bcow.tk/assets/logo.png');
                      message.channel.send(embed);
                      message.channel.stopTyping();
                    }
                  });
                });
              });
            });
          break;
			default:
        let query = args[0] == 'nation' ? message.content.slice(9).toLowerCase().replace(/ /g, '_'): message.content.slice(4).toLowerCase().replace(/ /g, '_');
				if (query == 'no_nation') return message.channel.send(errorMessage.setDescription('Use 1!nonation'));
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
								let nationCASST = casst.get(`${nationByTown.nameLower}`);
								let nationDisc = nationsP.get(`${nationByTown.nameLower}.discord`);
								let nationAMNT = nationsP.get(`${nationByTown.nameLower}.amenities`);
                let nationName = nationCASST == '<:verified:696564425775251477> Verified' ? `<:verified:696564425775251477> ${nationByTown.name}`: nationByTown.name;
                let imgLink = nationsP.get(`${nationByTown.nameLower}.imgLink`) != null ? nationsP.get(`${nationByTown.nameLower}.imgLink`): 'https://cdn.bcow.tk/assets/logo.png'; 
                let townsList = nationByTown.townsArr.toString() != null ? nationByTown.townsArr.toString().replace(/,/g, ', '): '```Error getting towns```';
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
								let location = nationByTown.location.split(',');
								let resEmbedN = new Discord.MessageEmbed()
									.setTitle(nationName)
									.setDescription('TIP: You can now search for nations using 1!s. Nations, towns, discords, and more all in one command.')
									.setColor(nationByTown.color)
									.setThumbnail(imgLink)
									.addField('Owner', '```' + nationByTown.owner + '```', true)
									.addField('Capital', nationByTown.capital, true)
									.addField('CASST Status', nationCASST)
                  .addField('Residents', nationByTown.residents, true)
                  .addField('Area', nationByTown.area, true)
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
						let nationCASST = casst.get(`${nation.nameLower}`);
						let nationDisc = nationsP.get(`${nation.nameLower}.discord`);
						let nationAMNT = nationsP.get(`${nation.nameLower}.amenities`);
            let nationName = nationCASST == '<:verified:696564425775251477> Verified' ? `<:verified:696564425775251477> ${nation.name}`: nation.name;
            let townsList = nation.townsArr.toString() != null ? nation.townsArr.toString().replace(/,/g, ', '): '```Error getting towns```';
            let imgLink = nationsP.get(`${nation.nameLower}.imgLink`) != null ? nationsP.get(`${nation.nameLower}.imgLink`): 'https://cdn.bcow.tk/assets/logo.png';
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
						let location = nation.location.split(',');
						let resEmbedN = new Discord.MessageEmbed()
							.setTitle(nationName)
							.setDescription('TIP: You can now search for nations using 1!s. Nations, towns, discords, and more all in one command.')
							.setColor(nation.color)
							.setThumbnail(imgLink)
							.addField('Owner', '```' + nation.owner + '```', true)
							.addField('Capital', nation.capital, true)
							.addField('CASST Status', nationCASST)
              .addField('Residents', nation.residents, true)
              .addField('Area', nation.area, true)
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
				message.channel.stopTyping();
				break;
		}
	}
};
