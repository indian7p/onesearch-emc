const Discord = require('discord.js');
const moment = require('moment-timezone');
const fetch = require('node-fetch');
const { errorMessage } = require('../functions/statusMessage');
const { paginateArray } = require('../functions/list');
const { getPlayer } = require('../functions/fetch');
const fn = require('../util/fn');

module.exports = {
	name: 't',
	description: 'Searches for towns',
	execute: (message, args, Town, Nation, TownP, PlayerP, client) => {
		message.channel.startTyping();
		const helpEmbed = new Discord.MessageEmbed().setThumbnail(client.user.avatarURL()).setColor(0x003175).setFooter('OneSearch', client.user.avatarURL())
			.setTitle('1!t - Help')
			.addField('1!t [town]', 'Gets town info')
			.addField('1!t list', 'Lists all towns by residents')
			.addField('1!t online [town]', 'Lists all online players in the specified town.')
		if (!args[1]) return message.channel.send(helpEmbed).then((m) => message.channel.stopTyping());
		switch (args[1]) {
			case 'activity':
				const actQuery = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_')
				Town.findOne({ nameLower: actQuery }, async function (err, town) {
					if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

					if (!town) return message.channel.send(errorMessage.setDescription('Town not found.'));

					let list = [];
					for (var i = 0; i < town.membersArr.length; i++) {
						const member = town.membersArr[i];

						const data = await getPlayer(member);
						if (data.success != false) {
							PlayerP.findOne({ uuid: data.data.player.raw_id }, function (err, player) {
								if (err) throw err;

								list.push(player == null ? `${member} - Last On: No data` : `${member} - Last On: ${player.lastOnline}`);
							})
						} else {
							list.push(`${member} - Last On: No data`);
						}
					}

					const pages = await paginateArray(list);

					let embeds = [];

					let pageNum = 0;
					pages.forEach(page => {
						pageNum++
						const list = page.toString().replace(/,/g, '\n');
						const emb = new Discord.MessageEmbed()
							.setTitle(`Player Activity - ${town.name}`)
							.setDescription(`\`\`\`${list}\`\`\``)
							.setColor(0x003175)
							.setFooter(`Page ${pageNum}/${pages.length} | OneSearch`, client.user.avatarURL());
						embeds.push(emb);
					})

					message.channel.send(embeds[0]).then((m) => {
						fn.paginator(message.author.id, m, embeds, 0);
					});
					message.channel.stopTyping();
				})
				break;
			case 'list':
				Town.find({}).sort({ residents: 'desc' }).exec(async function (err, towns) {
					if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

					let townList = [];
					towns.forEach(town => {
						townList.push(`${town.name} - Members: ${town.residents} - Area: ${town.area}`);
					})

					let pages = townList.map(() => townList.splice(0, 10)).filter(a => a);
					let embeds = [];

					let pageNum = 0;
					pages.forEach(page => {
						pageNum++
						let list = page.toString().replace(/,/g, '\n');
						let embed = new Discord.MessageEmbed()
							.setTitle('Town List')
							.setDescription(`\`\`\`${list}\`\`\``)
							.setColor(0x003175)
							.setFooter(`Page ${pageNum}/${pages.length} | OneSearch`, client.user.avatarURL());
						embeds.push(embed);
					})

					message.channel.send(embeds[0]).then((m) => {
						fn.paginator(message.author.id, m, embeds, 0);
					});
					message.channel.stopTyping();
				})
				break;
			case 'online':
				fetch('https://earthmc.net/map/up/world/earth/')
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						let query = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');
						Town.findOne({ nameLower: query }, function (err, town) {
							if (town == null || err) {
								message.channel.stopTyping();
								return message.channel.send(errorMessage.setDescription('Town not found. The database may be updating, try again in a minute.'));
							}
							let counter = 0;
							let online = [];
							data.players.forEach((player) => {
								Town.findOne({ membersArr: { $in: [player.account] } }, function (err, playerTown) {
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
											.setColor(0x003175)
											.setDescription(`**Players [${onlineCount}]**\`\`\`\n${online.toString().replace(/,/g, ', ')}\`\`\``)
											.setFooter(`OneSearch`, client.user.avatarURL());
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
				Town.findOne({ nameLower: query }, function (err, town) {
					if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
					if (town != null) {
						TownP.findOne({ name: town.name }, async function (err, townp) {
							if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
							let description;
							let imgLink;
							if (!townp) {
								description = 'Information may be slightly out of date.';
								imgLink = client.user.avatarURL();
							} else {
								imgLink = townp.imgLink == null ? client.user.avatarURL() : townp.imgLink;
								description = townp.scrating == null ? 'Information may be slightly out of date.' : `**[Shootcity Rating: ${townp.scrating}]** Information may be slightly out of date.`;
							}

							let link;
							try {
								link = townp.link;
							} catch {
								link = null
							}

							const townNation = await Nation.findOne({ name: town.nation }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

							let townNationBonus;
							if (townNation) {
								const val = townNation.residents;
								switch (true) {
									case (val > 0 && val < 9):
										townNationBonus = 10;
										break;
									case (val > 10 && val < 19):
										townNationBonus = 20;
										break;
									case (val > 20 && val < 29):
										townNationBonus = 40;
										break;
									case (val > 30 && val < 39):
										townNationBonus = 60;
										break;
									case (val > 40 && val < 49):
										townNationBonus = 100;
										break;
									case (val > 50):
										townNationBonus = 140;
										break;
								}
							} else {
								townNationBonus = 0;
							}

							let tName = town.capital == true ? `:star: ${town.name} (${town.nation})` : `${town.name} (${town.nation})`;
							let color = town.nation == 'No Nation' ? 0x69a841 : town.color == '#000000' ? 0x010101 : town.color == '#FFFFFF' ? 0xfefefe : town.color;
							let timeUp = moment(town.time).tz('America/New_York').format('MMMM D, YYYY h:mm A z');
							let memberList = `\`\`\`${town.members}\`\`\``;
							let maxSize = town.membersArr.length * 8 > 800 ? 800 + townNationBonus : town.membersArr.length * 8 + townNationBonus;
							let resEmbed = new Discord.MessageEmbed()
								.setTitle(tName.replace(/_/g, '\_'))
								.setDescription(description)
								.setColor(color)
								.setThumbnail(imgLink)
								.addField('Owner', '```' + town.mayor + '```', true)
								.addField('Location', `[${town.x}, ${town.z}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${town.x}&y=64&z=${town.z})`, true)
								.addField('Size', `${town.area}/${maxSize} [NationBonus: ${townNationBonus}]`, true)
								.setFooter(`OneSearch | Database last updated: ${timeUp}`, client.user.avatarURL());

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
								members1 = `\`\`\`${members1.toString().replace(/,/g, ', ')}\`\`\``;
								members2 = `\`\`\`${members2.toString().replace(/,/g, ', ')}\`\`\``;
								if (!link) {
									message.channel.send(resEmbed.addField(`Members [1-50]`, members1).addField(`Members [51-${town.membersArr.length}]`, members2));
								} else {
									message.channel.send(resEmbed.addField(`Members [1-50]`, members1).addField(`Members [51-${town.membersArr.length}]`, members2).setURL(link));
								}
							} else {
								if (!link) {
									message.channel.send(resEmbed.addField(`Members [${town.membersArr.length}]`, memberList));
								} else {
									message.channel.send(resEmbed.addField(`Members [${town.membersArr.length}]`, memberList).setURL(link));
								}
							}
							message.channel.stopTyping()
						})
					}
				});
				break;
		}
	}
};
