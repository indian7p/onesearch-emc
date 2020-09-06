const Discord = require('discord.js');
const fn = require('../util/fn');
const fetch = require('node-fetch');
const { errorMessage } = require('../functions/statusMessage');
const { paginateArray } = require('../functions/list');
const { getPlayer } = require('../functions/fetch');

module.exports = {
	name: 'n',
	description: 'Searches for nations',
	execute: async (message, args, Nation, NationP, Town, PlayerP, client) => {
		let helpEmbed = new Discord.MessageEmbed()
			.setTitle('1!n - Help')
			.addField('1!n [nation]', 'Gets nation info')
			.addField('1!n list [members/area]', 'Lists all nations by residents')
			.addField('1!n online [nation]', 'Lists all online players in a specified nation.')
			.setColor(0x003175)
			.setFooter('OneSearch', client.user.avatarURL());

		if (!args[1]) return message.channel.send(helpEmbed);

		let query = message.content.slice(args[0].length + 3).toLowerCase().replace(/ /g, '_');

		message.channel.startTyping();
		switch (args[1]) {
			case 'activity':
				const actQuery = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');

				Nation.findOne({ nameLower: actQuery }, function (err, nation) {
					if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

					if (!nation) return message.channel.send(errorMessage.setDescription('Nation not found.'))

					Town.find({ nation: nation.name }, async function (err, towns) {
						if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

						if (!towns) return message.channel.send(errorMessage.setDescription('Towns not found.'))

						let playerList = [];
						towns.forEach(town => {
							town.membersArr.map(member => playerList.push(member))
						})

						let list = [];
						for (var i = 0; i < playerList.length; i++) {
							let member = playerList[i];

							let data = await getPlayer(member);

							if (data.success != false) {
								PlayerP.findOne({ uuid: data.data.player.raw_id }, function (err, player) {
									if (err) throw err;

									list.push(player == null ? `${member} - Last On: No data` : `${member} - Last On: ${player.lastOnline}`);
								})
							} else {
								list.push(`${member} - Last On: No data`);
							}
						}

						paginateArray(list).then(pages => {
							let embeds = [];

							for (var i = 0; i < pages.length; i++) {
								let page = pages[i];

								const list = page.toString().replace(/,/g, '\n');
								const emb = new Discord.MessageEmbed()
									.setTitle(`Player Activity - ${nation.name}`)
									.setDescription(`\`\`\`${list}\`\`\``)
									.setColor(0x003175)
									.setFooter(`Page ${i + 1}/${pages.length} | OneSearch`, client.user.avatarURL());
								embeds.push(emb);
							}

							message.channel.send(embeds[0]).then((m) => {
								fn.paginator(message.author.id, m, embeds, 0);
							});
							message.channel.stopTyping();
						})
					})
				})
				break;
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
				const onQuery = message.content.slice(args[0].length + args[1].length + 4).toLowerCase().replace(/ /g, '_');

				fetch('https://earthmc.net/map/up/world/earth/')
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						Nation.findOne({ nameLower: onQuery }, function (err, nation) {
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
				if (query == 'no_nation') return message.channel.send(errorMessage.setDescription('Use 1!nonation'));

				Nation.findOne({ nameLower: query }, function (err, nation) {
					if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

					if (!nation) {
						message.channel.send(errorMessage.setDescription('Nation not found.'));
						message.channel.stopTyping();
						return;
					}

					if (nation != null) {
						NationP.findOne({ name: nation.nameLower }, function (err, nationp) {
							let status = !nationp ? ':grey_question: Unknown' : !nationp.status ? ':grey_question: Unknown' : nationp.status;
							let imgLink = !nationp ? 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png' : !nationp.imgLink ? 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png' : nationp.imgLink;
							let nationName = !nationp ? nation.name : status == '<:verified:726833035999182898> Verified' ? `<:verified:726833035999182898> ${nation.name.replace(/_/g, '\_')}` : nation.name.replace(/_/g, '\_');
							let nationLink = nationp ? nationp.link : null;
							let nationAMNT = nationp ? nationp.amenities : null;

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
								var members1STR = `\`\`\`${members1.toString().replace(/,/g, ', ')}\`\`\``;
								var members2STR = `\`\`\`${members2.toString().replace(/,/g, ', ')}\`\`\``;
							}

							const val = nation.residents;
							let nationBonus;
							switch (true) {
								case (val >= 0 && val <= 9):
									nationBonus = 10;
									break;
								case (val >= 10 && val <= 19):
									nationBonus = 20;
									break;
								case (val >= 20 && val <= 29):
									nationBonus = 40;
									break;
								case (val >= 30 && val <= 39):
									nationBonus = 60;
									break;
								case (val >= 40 && val <= 49):
									nationBonus = 100;
									break;
								case (val >= 50):
									nationBonus = 140;
									break;
							}

							let location = nation.location.split(',');
							let resEmbedN = new Discord.MessageEmbed()
								.setTitle(nationName.replace(/_/g, '\_'))
								.setURL(nationLink)
								.setColor(nation.color)
								.setThumbnail(imgLink)
								.addField('Owner', `\`\`\`${nation.owner}\`\`\``, true)
								.addField('Capital', nation.capital, true)
								.addField('Status', status, true)
								.addField('Residents', nation.residents, true)
								.addField('Area', nation.area, true)
								.addField('Nation Bonus', nationBonus, true)
								.addField('Location', `[${location[0]}, ${location[1]}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${location[0]}&y=64&z=${location[1]})`, true)
								.addField('Report this nation', '[SearchSafe](https://searchsafe.bcow.tk/)', true)
								.setFooter('OneSearch', client.user.avatarURL());

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
							message.channel.stopTyping()
						})
					}
				})
				break;
		}
	}
};
