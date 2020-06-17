const Discord = require('discord.js'),
	moment = require('moment-timezone'),
	cache = require('quick.db'),
	fetch = require('node-fetch'),
	fn = require('../util/fn'),
	townP = new cache.table('townP'),
	listcache = new cache.table('listcache');

module.exports = {
	name: 't',
	description: 'Searches for towns',
	execute: (message, args, Town) => {
		message.channel.startTyping();
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		let helpEmbed = new Discord.MessageEmbed()
			.setTitle('1!t - Help')
			.addField('1!t [town]', 'Gets town info')
			.addField('1!t list', 'Lists all towns by residents')
			.addField('1!t online [town]', 'Lists all online players in the specified town.')
			.setColor(0x0071bc)
			.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		if (!args[1]) return message.channel.send(helpEmbed).then((m) => message.channel.stopTyping());
		switch (args[1]) {
			case 'list':
				if (listcache.get('towns') == null) return message.channel.send(errorMessage.setDescription('Town list not found. The database may be updating, try again in a minute.'));
				let embeds = [];
				let counter = 0;
				listcache.get('towns').forEach((townsL) => {
					counter++;
					let embed = new Discord.MessageEmbed().setTitle('Town List').setColor(0x0071bc).setDescription(townsL).setFooter(`OneSearch | Page ${counter}/${listcache.get('towns').length}`, 'https://cdn.bcow.tk/assets/logo-new.png');
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
						let query = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');
						Town.findOne({ nameLower: query }, function(err, town) {
							if (town == null || err) {
								message.channel.stopTyping();
								return message.channel.send(errorMessage.setDescription('Town not found. The database may be updating, try again in a minute.'));
							}
							let counter = 0;
							let online = [];
							data.players.forEach((player) => {
								Town.findOne({ membersArr: { $in: [ player.account ] } }, function(err, playerTown) {
									if (playerTown != null) {
										if (playerTown.name == town.name) {
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
											.setTitle(`Players Online - ${town.name}`)
											.setColor(0x0071bc)
											.setDescription(`**Players [${onlineCount}]**\`\`\`\n${online.toString().replace(/,/g, ', ')}\`\`\``)
											.setFooter(`OneSearch`, 'https://cdn.bcow.tk/assets/logo-new.png');
										message.channel.send(embed);
										message.channel.stopTyping();
									}
								});
							});
						});
					});
				break;
			default:
				let query = args[0] == 'town' ? message.content.slice(7).toLowerCase().replace(/ /g, '_') : message.content.slice(4).toLowerCase().replace(/ /g, '_');
				Town.findOne({ nameLower: query }, function(err, town) {
					if (town == null || err) {
						message.channel.stopTyping();
						return message.channel.send(errorMessage.setDescription('Town not found. The database may be updating, try again in a minute.'));
					}
					let color = town.nation == 'No Nation' ? 0x69a841 : town.color == '#000000' ? 0x010101 : town.color == '#FFFFFF' ? 0xfefefe : town.color;
					let tName = town.capital == true ? `:star: ${town.name} (${town.nation})` : `${town.name} (${town.nation})`;
					let description = townP.get(`${town.name}.scrating`) == null ? 'Information may be slightly out of date.' : `**[Shootcity Rating: ${townP.get(`${town.name}.scrating`)}]** Information may be slightly out of date.`;
					let timeUp = moment(town.time).tz('America/New_York').format('MMMM D, YYYY h:mm A z');
					let memberList = `\`\`\`${town.members}\`\`\``;
					let resEmbed = new Discord.MessageEmbed()
						.setTitle(tName)
						.setDescription(description)
						.setColor(color)
						.setThumbnail(townP.get(`${town.name}.imgLink`))
						.addField('Mayor', '```' + town.mayor + '```', true)
						.addField('Location', `[${town.x}, ${town.z}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${town.x}&y=64&z=${town.z})`, true)
						.addField('Size', town.area, true)
						.setFooter(`OneSearch | Database last updated: ${timeUp}`, 'https://cdn.bcow.tk/assets/logo-new.png');
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
						if (townP.get(`${town.name}.link`) == null) {
							message.channel.send(resEmbed.addField(`Members [1-50]`, '```' + members1.toString().replace(/,/g, ', ') + '```').addField(`Members [51-${town.membersArr.length}]`, '```' + members2.toString().replace(/,/g, ', ') + '```'));
						} else {
							message.channel.send(
								resEmbed
									.addField(`Members [1-50]`, '```' + members1.toString().replace(/,/g, ', ') + '```')
									.addField(`Members [51-${town.membersArr.length}]`, '```' + members2.toString().replace(/,/g, ', ') + '```')
									.setURL(townP.get(`${town.name}.link`))
							);
						}
					} else {
						if (townP.get(`${town.name}.link`) == null) {
							message.channel.send(resEmbed.addField(`Members [${town.membersArr.length}]`, memberList));
						} else {
							message.channel.send(resEmbed.addField(`Members [${town.membersArr.length}]`, memberList).setURL(townP.get(`${town.name}.link`)));
						}
					}
					message.channel.stopTyping();
        })
				break;
		}
	}
};
