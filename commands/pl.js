const Discord = require('discord.js'),
	fetch = require('node-fetch'),
	moment = require('moment-timezone'),
	cache = require('quick.db'),
	fn = require('../util/fn'),
	staffList = require('../staffList.json'),
	casst = new cache.table('casst'),
	players = new cache.table('players');

module.exports = {
	name: 'pl',
	description: 'Searches for players',
	execute: async (message, args, Town, client) => {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		let helpEmbed = new Discord.MessageEmbed()
			.setTitle('1!pl')
			.setColor(0x055e9a)
			.addField('1!pl [player]', 'Finds player info such as town and scammer status.')
			.addField('1!pl chistory [player]', 'Searches CASST player history, events before Apr 17, 2020 are missing.')
			.addField('1!pl nhistory [player]', 'Gets players name history')
			.addField('1!pl online [staff]', 'Shows online players. 1!pl online staff shows online staff.')
			.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		if (!args[1]) return message.channel.send(helpEmbed);
		if (!args[2]) {
			var URL = `https://playerdb.co/api/player/minecraft/${args[1]}`;
		} else {
			var URL = `https://playerdb.co/api/player/minecraft/${args[2]}`;
		}
		switch (args[1]) {
			case 'chistory':
				if (players.get(`${data.data.player.raw_id}.history`) == null) return message.channel.send(errorMessage.setDescription('History not found'));
				let resEmbedPl = new Discord.MessageEmbed()
					.setTitle(`Player History - ${data.data.player.username}`)
					.setDescription('⚠ Player event history started on 4/17/2020. Previous events are missing.')
					.setColor(0x009245)
					.addField('Current Status', casst.get(`${data.data.player.raw_id}`))
					.addField('Player History', '```' + players.get(`${data.data.player.raw_id}.history`).toString().replace(/,/g, '\n') + '```')
					.setFooter('CASST', 'https://cdn.bcow.tk/assets/casst.png');
				message.channel.send(resEmbedPl);
				break;
			case 'nhistory':
				let dates = [];
				let names = [];
				let namesD = [];
				let counter = 0;
				data.data.player.meta.name_history.forEach((name) => {
					dates.push(moment(name.changedToAt / 1000, 'X').tz('America/New_York').format('MM/DD/YYYY h:mm A z'));
					names.push(name.name);
				});
				names.forEach((name) => {
					if (counter == 0) {
						namesD.push(name);
					} else {
						let date = dates[counter];
						namesD.push(`${date} - ${name}`);
					}
					counter++;
				});
				let resEmbedN = new Discord.MessageEmbed()
					.setTitle(`Name History - ${data.data.player.username}`)
					.setColor(0x0071bc)
					.setThumbnail(`https://crafatar.com/renders/body/${data.data.player.raw_id}?overlay`)
					.setDescription('```' + `test\n` + namesD.toString().replace(/,/g, '\n') + '```')
					.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
				message.channel.send(resEmbedN);
				break;
			case 'online':
				fetch('https://earthmc.net/map/up/world/earth/')
					.then((res) => {
						try {
							return res.json();
						} catch (err) {
							message.channel.send('Unable to get map data.');
							return;
						}
					})
					.then((data) => {
						switch (args[2]) {
							case 'staff':
								let playersOnline = [];
								data.players.forEach((player) => {
									playersOnline.push(player.account);
								});
								let playerList = playersOnline.filter((player) => {
									return staffList.staffList.includes(player);
								});
								if (playerList.length == 0) {
									playerList.push('No staff found. Try again later.');
								}
								console.log(playerList);
								let embed = new Discord.MessageEmbed()
									.setTitle('Players Online - Staff')
									.setColor(0x0071bc)
									.setDescription(`**Players [${playerList.length}]**\`\`\`${playerList.toString().replace(/,/g, ', ')}\`\`\``)
									.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
								message.channel.send(embed);
								break;
							default:
								if (args[2] == null) {
									let playerList = [];
									data.players.forEach((player) => {
										playerList.push(player.account);
									});
									let embed = new Discord.MessageEmbed()
										.setTitle('Players Online')
										.setColor(0x0071bc)
										.setDescription(`**Players [${playerList.length}]**\`\`\`${playerList.toString().replace(/,/g, ', ')}\`\`\``)
										.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
									message.channel.send(embed);
								} else {
									let playerList = [];
									var playerName;
									data.players.forEach((player) => {
										playerList.push(player.account.toLowerCase());
										if (player.account.toLowerCase() == args[2].toLowerCase()) {
											var playerName = player.account;
										}
									});
									if (playerList.includes(args[2])) {
										let embed = new Discord.MessageEmbed().setTitle(playerName).setColor(0x0071bc).addField('Status', 'Online').setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
										message.channel.send(embed);
									} else {
										let embed = new Discord.MessageEmbed().setTitle(playerName).setColor(0x0071bc).addField('Status', 'Online').setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
										message.channel.send(embed);
									}
								}
								break;
						}
					});
				break;
			default:
				fetch(`httos://playerdb.co/api/player/minecraft/${args[3]}`)
					.then(res => {
						return res.json();
					})
					.then(data => {
						message.channel.startTyping();
						switch (players.get(`${data.data.player.raw_id}.rank`)) {
							case 'admin':
								var emColor = 0x00a8a8;
								break;
							case 'mod':
								var emColor = 0x00aa00;
								break;
							case 'owner':
								var emColor = 0xaa0000;
								break;
							default:
								var emColor = 0x0071bc;
								break;
						}
						if (casst.get(`${data.data.player.raw_id}`) == null) {
							var name = data.data.player.username;
						} else {
							if (casst.get(`${data.data.player.raw_id}`).includes('Verified')) {
								var name = '<:verified:696564425775251477> ' + data.data.player.username;
							} else {
								var name = data.data.player.username;
							}
						}
						let resEmbed = new Discord.MessageEmbed()
							.setTitle(name)
							.setURL(`https://namemc.com/profile/${data.data.player.id}`)
							.setThumbnail(`https://crafatar.com/renders/body/${data.data.player.raw_id}?overlay`)
							.setColor(emColor)
							.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
						let query = new RegExp(data.data.player.username, 'gi');
						async function flagged(msg) {
							msg.react('🏳️').then(async (hej) => {
								let reaction1 = await msg.awaitReactions((reaction, user) => user.id == message.author.id && ['🏳️'].includes(reaction.emoji.name), { max: 1, errors: ['time'] }).catch(() => { });
								if (!reaction1) return msg.clearReactions().catch(() => { });
								reaction1 = reaction1.first();
								if (reaction1.emoji.name == '🏳️') {
									let flagConfirm = new Discord.MessageEmbed()
										.setColor(0x019145)
										.setDescription(
											'**Report player?** By continuing, you agree that your discord username and report will be shared with the CASST. Please include evidence (attachments currently not supported, link to evidence) and the players name by sending a message after clicking :white_check_mark:'
										)
										.setFooter('CASST', 'https://cdn.bcow.tk/assets/casst.png');
									message.channel.send(flagConfirm).then((m) => {
										m
											.react('✅')
											.then((hey) => {
												m.react('❌');
											})
											.then(async (msg2) => {
												let reaction = await m.awaitReactions((reaction, user) => user.id == message.author.id && ['✅', '❌'].includes(reaction.emoji.name), { max: 1, errors: ['time'] }).catch(() => { });
												if (!reaction) return m.clearReactions().catch(() => { });
												reaction = reaction.first();
												if (reaction.emoji.name == '✅') {
													const collector = new Discord.MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: 10000 });
													collector.on('collect', (message) => {
														let successMessage = new Discord.MessageEmbed().setTitle(':white_check_mark: **Success!**').setColor(0x07bf63).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
														client.channels
															.get('704461817094734045')
															.send(
																new Discord.MessageEmbed()
																	.setTitle('Flag')
																	.setColor(0xdc2e44)
																	.setDescription('```' + message.content + '```')
																	.addField('Flagged by', `<@${message.author.id}> ${message.author.username}#${message.author.discriminator}`)
																	.addField('Player flagged', args[1])
															);
														message.channel.send(successMessage.setDescription('Report sent! Join our [discord](https://discord.gg/Z78gsUy)'));
													});
												}
												if (reaction.emoji.name == '❌') {
													message.channel.send(new Discord.MessageEmbed().setColor(0x019145).setDescription('Cancelled flagging.').setFooter('CASST', 'https://cdn.bcow.tk/assets/casst.png'));
												}
											});
									});
								}
							});
						}
						Town.findOne({ membersArr: { $in: [data.data.player.username] } }, async function (err, town) {
							message.channel.stopTyping();
							if (name.includes('<:verified:696564425775251477>')) {
								if (town == null) {
									if (casst.get(data.data.player.raw_id) == null) {
										message.channel.send(resEmbed.addField('CASST Status', 'This player is not on the list. Scammer? Report now on the [CASST discord](https://discord.gg/Z78gsUy).'));
									} else {
										message.channel.send(resEmbed.addField('CASST Status', casst.get(data.data.player.raw_id)));
									}
								} else {
									if (town.mayor == data.data.player.username) {
										if (town.capital == true) {
											if (casst.get(data.data.player.raw_id) == null) {
												message.channel
													.send(resEmbed.addField('Town', `${town.name} (${town.nation}) (Nation Leader)`).addField('CASST Status', 'This player is not on the list. Scammer? Report now on the [CASST discord](https://discord.gg/Z78gsUy).'))
													.then((msg) => {
														flagged(msg);
													});
											} else {
												message.channel.send(resEmbed.addField('Town', `${town.name} (${town.nation}) (Nation Leader)`).addField('CASST Status', casst.get(data.data.player.raw_id)));
											}
										} else {
											if (casst.get(data.data.player.raw_id) == null) {
												message.channel.send(resEmbed.addField('Town', `${town.name} (${town.nation}) (Mayor)`).addField('CASST Status', 'This player is not on the list. Scammer? Report now on the [CASST discord](https://discord.gg/Z78gsUy).'));
											} else {
												message.channel.send(resEmbed.addField('Town', `${town.name} (${town.nation}) (Mayor)`).addField('CASST Status', casst.get(data.data.player.raw_id)));
											}
										}
									} else {
										if (casst.get(data.data.player.raw_id) == null) {
											message.channel.send(resEmbed.addField('Town', `${town.name} (${town.nation})`).addField('CASST Status', 'This player is not on the list. Scammer? Report now on the [CASST discord](https://discord.gg/Z78gsUy).'));
										} else {
											message.channel.send(resEmbed.addField('Town', `${town.name} (${town.nation})`).addField('CASST Status', casst.get(data.data.player.raw_id)));
										}
									}
								}
							} else {
								if (town == null) {
									if (casst.get(data.data.player.raw_id) == null) {
										message.channel.send(resEmbed.addField('CASST Status', 'This player is not on the list. Scammer? Report now on the [CASST discord](https://discord.gg/Z78gsUy).'));
									} else {
										message.channel.send(resEmbed.addField('CASST Status', casst.get(data.data.player.raw_id)));
									}
								} else {
									if (town.mayor == data.data.player.username) {
										if (town.capital == true) {
											if (casst.get(data.data.player.raw_id) == null) {
												message.channel
													.send(resEmbed.addField('Town', `${town.name} (${town.nation}) (Nation Leader)`).addField('CASST Status', 'This player is not on the list. Scammer? Report now on the [CASST discord](https://discord.gg/Z78gsUy).'))
													.then((msg) => {
														flagged(msg);
													});
											} else {
												message.channel.send(resEmbed.addField('Town', `${town.name} (${town.nation}) (Nation Leader)`).addField('CASST Status', casst.get(data.data.player.raw_id))).then((msg) => {
													flagged(msg);
												});
											}
										} else {
											if (casst.get(data.data.player.raw_id) == null) {
												message.channel
													.send(resEmbed.addField('Town', `${town.name} (${town.nation}) (Mayor)`).addField('CASST Status', 'This player is not on the list. Scammer? Report now on the [CASST discord](https://discord.gg/Z78gsUy).'))
													.then((msg) => {
														flagged(msg);
													});
											} else {
												message.channel.send(resEmbed.addField('Town', `${town.name} (${town.nation}) (Mayor)`).addField('CASST Status', casst.get(data.data.player.raw_id))).then((msg) => {
													flagged(msg);
												});
											}
										}
									} else {
										if (casst.get(data.data.player.raw_id) == null) {
											message.channel.send(resEmbed.addField('Town', `${town.name} (${town.nation})`).addField('CASST Status', 'This player is not on the list. Scammer? Report now on the [CASST discord](https://discord.gg/Z78gsUy).')).then((msg) => {
												flagged(msg);
											});
										} else {
											message.channel.send(resEmbed.addField('Town', `${town.name} (${town.nation})`).addField('CASST Status', casst.get(data.data.player.raw_id))).then((msg) => {
												flagged(msg);
											});
										}
									}
								}
							}
						});
					})
				break;
			case 'location':
				fetch(`https://playerdb.co/api/player/minecraft/${args[3]}`)
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						fetch('https://earthmc.net/map/up/world/earth/')
							.then((res) => {
								return res.json();
							})
							.then((data2) => {
								let playerNames = [];
								data2.players.forEach((player) => {
									playerNames.push(player.account);
								});
								if (playerNames.includes(data.data.player.username)) {
									data2.players.forEach((player) => {
										if (player.account == data.data.player.username) {
											if (player.world == '-some-other-bogus-world-') {
												var resEmbed = new Discord.MessageEmbed()
													.setTitle(data.data.player.username)
													.addField('Location', 'Unable to get the players location. Make sure they are not under a block, invisible, or underwater.')
													.setColor(0x0071bc)
													.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
											} else {
												var location = `${player.x}, ${player.z}`;
												var resEmbed = new Discord.MessageEmbed()
													.setTitle(data.data.player.username)
													.addField('Location', `[${location}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${player.x}&y=64&z=${player.z})`)
													.setColor(0x0071bc)
													.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
											}
											message.channel.send(resEmbed);
										}
									});
								} else {
									message.channel.send(errorMessage.setDescription('Player is not online'));
								}
							});
					});
				break;
		}
	}
};
