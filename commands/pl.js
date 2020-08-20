const Discord = require('discord.js');
const	fetch = require('node-fetch');
const	moment = require('moment-timezone');
const	staffList = require('../staffList.json');
const {errorMessage} = require('../functions/statusMessage');

module.exports = {
	name: 'pl',
	description: 'Searches for players',
	execute: async (message, args, Town, Player, PlayerP) => {
		let helpEmbed = new Discord.MessageEmbed()
			.setTitle('1!pl')
			.setColor(0x003175)
			.addField('1!pl [player]', 'Finds player info such as town and scammer status.')
			.addField('1!pl chistory [player]', 'Searches CASST player history, events before Apr 17, 2020 are missing.')
			.addField('1!pl nhistory [player]', 'Gets players name history')
			.addField('1!pl uuid [player]', 'Gets a players UUID')
			.addField('1!pl online [staff/player name/UUID]', 'Shows online players. 1!pl online staff shows online staff and 1!pl online [player] checks if that user is online.')
			.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		if (!args[1]) return message.channel.send(helpEmbed);

		switch (args[1]) {
			case 'chistory':
				fetch(`https://playerdb.co/api/player/minecraft/${args[2]}`)
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						if (data.success == false) return message.channel.send(errorMessage.setDescription('Invalid username or UUID'));

						Player.findOne({ id: data.data.player.raw_id }, function (err, player) {
							if (!player || !player.history || player.history.length == 0) return message.channel.send(errorMessage.setDescription('History not found'));

							let resEmbedPl = new Discord.MessageEmbed()
								.setTitle(`Player History - ${data.data.player.username}`)
								.setDescription('⚠ Player event history started on 4/17/2020. Previous events are missing.')
								.setColor(0x003175)
								.addField('Current Status', player.status)
								.addField('Player History', '```' + player.history.toString().replace(/,/g, '\n') + '```')
								.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
							message.channel.send(resEmbedPl);
						})
					});
				break;
			case 'nhistory':
				fetch(`https://playerdb.co/api/player/minecraft/${args[2]}`)
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						if (data.success == false) return message.channel.send(errorMessage.setDescription('Invalid username or UUID'))
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
							.setColor(0x003175)
							.setThumbnail(`https://crafatar.com/renders/body/${data.data.player.raw_id}?overlay`)
							.setDescription('```' + `test\n` + namesD.toString().replace(/,/g, '\n') + '```')
							.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
						message.channel.send(resEmbedN);
					});
				break;
			case 'uuid':
				fetch(`https://playerdb.co/api/player/minecraft/${args[2]}`)
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						if (data.success == false) return message.channel.send(errorMessage.setDescription('Invalid username or UUID'));
						let resEmbedU = new Discord.MessageEmbed()
							.setTitle(`UUID - ${data.data.player.username}`)
							.setColor(0x003175)
							.setThumbnail(`https://crafatar.com/renders/body/${data.data.player.raw_id}?overlay`)
							.addField('UUID', data.data.player.raw_id)
							.addField('Formatted', data.data.player.id)
							.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
						message.channel.send(resEmbedU);
					})
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
					.then(data => {
						switch (args[2]) {
							case 'staff':
								let playersOnline = [];
								data.players.forEach((player) => {
									playersOnline.push(player.account);
								});
								let playerList = playersOnline.filter((player) => {
									return staffList.staffList.includes(player);
								});
								let listLength = playerList.length;
								if (playerList.length == 0) {
									playerList.push('No staff found. Try again later.');
									listLength = 0;
								}
								let embed = new Discord.MessageEmbed()
									.setTitle('Players Online - Staff')
									.setColor(0x003175)
									.setDescription(`**Players [${listLength}]**\`\`\`${playerList.toString().replace(/,/g, ', ')}\`\`\``)
									.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
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
										.setColor(0x003175)
										.setDescription(`**Players [${playerList.length}]**\`\`\`${playerList.toString().replace(/,/g, ', ')}\`\`\``)
										.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
									message.channel.send(embed);
								} else {
									fetch(`https://playerdb.co/api/player/minecraft/${args[2]}`)
										.then(res => {
											return res.json();
										})
										.then(playerData => {
											if (playerData.success == false) return message.channel.send(errorMessage.setDescription('Invalid username/UUID.'));

											let playerList = [];

											data.players.forEach(player => {
												playerList.push(player.account);
											});

											let status = 'Offline';
											if (playerList.includes(playerData.data.player.username)) {
												status = 'Online';
											}

											let embed = new Discord.MessageEmbed()
												.setTitle(playerData.data.player.username).setColor(0x003175)
												.addField('Status', status)
												.setThumbnail(`https://crafatar.com/avatars/${playerData.data.player.raw_id}?overlay`)
												.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
											message.channel.send(embed);
										})
								}
								break;
						}
					});
				break;
			case 'activity':
				fetch(`https://playerdb.co/api/player/minecraft/${args[2]}`)
				.then(res => res.json())
				.then(data => {
					if (data.success == false) return message.channel.send(errorMessage.setDescription('Invalid username/UUID.'));

					PlayerP.findOne({ uuid: data.data.player.raw_id }, function(err, player) {
						if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

						if (!player) return message.channel.send(errorMessage.setDescription('No player activity data.'));

						let location = player.lastLocation.replace(/ /, '').split(',');

						let locationString = location == "none" ? `Last location could not be found.` : `[${player.lastLocation}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${location[0]}&y=64&z=${location[1]})`

						let resEmbed = new Discord.MessageEmbed()
						.setTitle(`${data.data.player.username} - Player Activity`)
						.setColor(0x003175)
						.setThumbnail(data.data.player.avatar)
						.addField('Last Online', player.lastOnline)
						.addField('Last Location', locationString)
						.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');

						message.channel.send(resEmbed);
					})
				})
				break;
			case 'location':
				fetch('https://earthmc.net/map/up/world/earth/')
					.then((res) => {
						try {
							return res.json();
						} catch (err) {
							message.channel.send('Unable to get map data.');
							return;
						}
					})
					.then(data => {
						fetch(`https://playerdb.co/api/player/minecraft/${args[2]}`)
							.then(res => {
								return res.json();
							})
							.then(playerData => {
								if (playerData.success == false) return message.channel.send(errorMessage.setDescription('Invalid username/UUID.'));

								let playerList = [];

								let location = 'Unable to get the players location. Make sure they are not under a block, invisible, or underwater.';
								data.players.forEach(player => {
									playerList.push(player.account);

									if (player.account == playerData.data.player.username) {
										if (player.world != 'earth') return;
										location = `[${player.x}, ${player.z}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${player.x}&y=64&z=${player.z})`;
									}
								});

								if (!playerList.includes(playerData.data.player.username)) return message.channel.send(errorMessage.setDescription('Player is not online.'))

								let embed = new Discord.MessageEmbed()
									.setTitle(playerData.data.player.username)
									.setThumbnail(`https://crafatar.com/avatars/${playerData.data.player.raw_id}?overlay`)
									.addField('Location', location)
									.setColor(0x003175)
									.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');

								message.channel.send(embed);
							})
					})
				break;
			case 'staff':
				let staffArray = staffList.staffList;
				let embed = new Discord.MessageEmbed()
					.setTitle('Players - Staff')
					.setColor(0x003175)
					.setDescription('List inaccurate? Open a pull request or issue on [GitHub](https://github.com/imabritishcow/onesearch-emc).')
					.addField(`Staff [${staffArray.length}]`, `\`\`\`${staffArray.toString().replace(/,/g, ', ')}\`\`\``)
					.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
				message.channel.send(embed);
				break;
			default:
				fetch(`https://playerdb.co/api/player/minecraft/${args[1]}`)
					.then(res => {
						return res.json();
					})
					.then(data => {
						if (data.success == false) return message.channel.send(errorMessage.setDescription('Invalid username or UUID'))
						message.channel.startTyping();

						let emColor = 0x003175;
						if (staffList.staffList.includes(data.data.player.username)) {
							emColor = 0x00aa00;
						}

						Player.findOne({ id: data.data.player.raw_id }, function (err, player) {
							if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

							let name = data.data.player.username;
							let status = 'This player is not on the list. Scammer? Report now at [EarthMC Scams](https://discord.gg/8V6kTxW).';
							if (player) {
								if (player.status.includes('Verified')) {
									name = '<:verified:726833035999182898> ' + data.data.player.username;
								}
								status = player.status;
							}

							let resEmbed = new Discord.MessageEmbed()
								.setTitle(name)
								.setURL(`https://namemc.com/profile/${data.data.player.id}`)
								.setThumbnail(`https://crafatar.com/renders/body/${data.data.player.raw_id}?overlay`)
								.setColor(emColor)
								.addField('Status', status)
								.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');

							Town.findOne({ membersArr: { $in: [data.data.player.username] } }, async function (err, town) {
								if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

								if (!town) {
									message.channel.send(resEmbed);
								} else {
									if (town.mayor == data.data.player.username) {
										if (town.capital == true) {
											message.channel.send(resEmbed.addField('Town', `${town.name} (${town.nation}) (Nation Leader)`));
										} else {
											message.channel.send(resEmbed.addField('Town', `${town.name} (${town.nation}) (Mayor)`));
										}
									} else {
										message.channel.send(resEmbed.addField('Town', `${town.name} (${town.nation})`));
									}
								}
								message.channel.stopTyping();
							});
						})
					})
				break;
		}
	}
};
