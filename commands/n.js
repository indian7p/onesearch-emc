const Discord = require('discord.js'),
	fn = require('../util/fn'),
	fetch = require('node-fetch');

module.exports = {
	name: 'n',
	description: 'Searches for nations',
	execute: async (message, args, Nation, NationP, Town) => {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		let helpEmbed = new Discord.MessageEmbed()
			.setTitle('1!n - Help')
			.addField('1!n [nation]', 'Gets nation info')
			.addField('1!n list [members/area]', 'Lists all nations by residents')
			.addField('1!n online [nation]', 'Lists all online players in a specified nation.')
			.setColor(0x003175)
			.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');

		if (!args[1]) return message.channel.send(helpEmbed);

		message.channel.startTyping();
		switch (args[1]) {
			case 'list':
				let sortingOpts;
				switch (args[2]) {
					default:
					case 'members':
						sortingOpts = { residents: 'desc' };
						break;
					case 'area':
						sortingOpts = { area: 'desc' };
						break;
				}
				Nation.find({}).sort(sortingOpts).exec(async function (err, nations) {
					if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
					if (!nations) return message.channel.send(errorMessage.setDescription('The database may be updating. Try again later.'));

					let nationList = [];
					nations.forEach(nation => {
						nationList.push(`${nation.name.replace(/_/g, '\_')} - Members: ${nation.residents} - Area: ${nation.area}`);
					})

					let pages = nationList.map(() => nationList.splice(0, 10)).filter(a => a);
					let embeds = [];

					let pageNum = 0;
					pages.forEach(page => {
						pageNum++
						let list = page.toString().replace(/,/g, '\n');
						let embed = new Discord.MessageEmbed()
							.setTitle('Nation List')
							.setDescription(`\`\`\`${list}\`\`\``)
							.setColor(0x003175)
							.setFooter(`Page ${pageNum}/${pages.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo-new.png');
						embeds.push(embed);
					})

					message.channel.send(embeds[0]).then((m) => {
						fn.paginator(message.author.id, m, embeds, 0);
					});
					message.channel.stopTyping();
				})
				break;
			case 'online':
				var query = args[0] == 'n' ? message.content.slice(11).toLowerCase().replace(/ /g, '_') : message.content.slice(16).toLowerCase().replace(/ /g, '_');
				fetch('https://earthmc.net/map/up/world/earth/')
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						Nation.findOne({ nameLower: query }, function (err, nation) {
							if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'))
							if (nation == null) {
								message.channel.stopTyping();
								return message.channel.send(errorMessage.setDescription('Nation not found. The database may be updating, try again in a minute.'));
							}
							let counter = 0;
							let online = [];
							data.players.forEach((player) => {
								Town.findOne({ membersArr: { $in: [player.account] } }, function (err, playerTown) {
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
											.setTitle(`Players Online - ${nation.name.replace(/_/g, '\_')}`)
											.setColor(0x003175)
											.setDescription(`**Players [${onlineCount}]**\`\`\`\n${online.toString().replace(/,/g, ', ').replace(/_/g, '\_')}\`\`\``)
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
				var query = args[0] == 'n' ? message.content.slice(4).toLowerCase().replace(/ /g, '_') : message.content.slice(9).toLowerCase().replace(/ /g, '_');

				if (query == 'no_nation') return message.channel.send(errorMessage.setDescription('Use 1!nonation'));
				Nation.findOne({ nameLower: query }, function (err, nation) {
					if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
					if (nation != null) {
						NationP.findOne({ name: nation.nameLower }, function (err, nationp) {
							let status;
							let imgLink;
							let nationName;
							let nationLink;
							let nationAMNT;
							if (!nationp) {
								status = ':grey_question: Unknown';
								imgLink = 'https://cdn.bcow.tk/assets/logo-new.png';
								nationName = nation.name;
							} else {
								status = !nationp.status ? ':grey_question: Unknown' : nationp.status;
								imgLink = !nationp.imgLink ? 'https://cdn.bcow.tk/assets/logo-new.png' : nationp.imgLink;
								nationName = status == '<:verified:726833035999182898> Verified' ? `<:verified:726833035999182898> ${nation.name.replace(/_/g, '\_')}` : nation.name.replace(/_/g, '\_');
								nationLink = nationp.link;
								nationAMNT = nationp.amenities;
							}
							if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
							let townsList = nation.townsArr.toString().replace(/,/g, ', ');

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
								.setColor(nation.color)
								.setThumbnail(imgLink)
								.addField('Owner', `\`\`\`${nation.owner}\`\`\``, true)
								.addField('Capital', nation.capital, true)
								.addField('Status', status)
								.addField('Residents', nation.residents, true)
								.addField('Area', nation.area, true)
								.addField('Location', `[${location[0]}, ${location[1]}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${location[0]}&y=64&z=${location[1]})`, true)
								.addField('Report this nation', '[SearchSafe](https://searchsafe.bcow.tk/)');

							if (nationLink == null) {
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
										message.channel.send(resEmbedN.addField(`Towns [${nation.townsArr.length}]`, '```' + townsList + '```').setURL(nationLink));
									} else {
										message.channel.send(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nation.townsArr.length}]`, '```' + members2STR + '```').setURL(nationLink));
									}
								} else {
									if (members2STR == null) {
										message.channel.send(resEmbedN.addField(`Towns [${nation.townsArr.length}]`, '```' + townsList + '```').setDescription(nationAMNT).setURL(nationLink));
									} else {
										message.channel.send(resEmbedN.addField(`Towns [1-50]`, '```' + members1STR + '```').addField(`Towns [51-${nation.townsArr.length}]`, '```' + members2STR + '```').setURL(nationLink).setDescription(nationAMNT));
									}
								}
							}
							message.channel.stopTyping()
						})
					} else {
						message.channel.stopTyping()
						message.channel.send(errorMessage.setDescription('Nation not found. The database may be updating, try again later.'))
					}
				})
				break;
		}
	}
};
