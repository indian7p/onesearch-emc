const Discord = require('discord.js'),
	moment = require('moment-timezone'),
	fn = require('../util/fn'),
	db = require('quick.db'),
	config = require('../config.json');
(nationsP = new db.table('nationsP')), (townP = new db.table('townP')), (search = require('youtube-search')), (casst = new db.table('casst'));

module.exports = {
	name: 's',
	description: 'Searches OneSearch',
	execute(message, args, Nation, Result, Town, SResult) {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		if (!args[1]) return message.channel.send(errorMessage.setDescription('No search query'));
		let query = message.content.slice(4).toLowerCase();

		let embeds = [];

		let nationQuery = query.replace(/ /g, '_');

		if (query.includes('--no-music') || args[1] != 'play') {
			let pageNum = 0;
			let NSFWcount = 0;

			SResult.findOne({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then(async (data) => {
				if (!data) {
				} else {
					if (data.desc == null) {
						console.log(data.name + ' Missing desc.');
					} else {
						pageNum++;
						let themeColor = data.themeColor != null ? data.themeColor : 0x0071bc;
						let resEmbed = new Discord.MessageEmbed()
							.setTitle(data.name)
							.setURL(data.link)
							.setDescription(data.desc)
							.setThumbnail(data.imgLink)
							.setColor(themeColor)
							.setFooter(`Page ${pageNum} | OneSearch`, 'https://cdn.bcow.tk/assets/logo-new.png');
						if (data.nsfw != undefined) {
							if (message.channel.type == 'dm') {
								if (data.sImgLink != null) {
									embeds.push(resEmbed.setImage(data.sImgLink));
								} else {
									embeds.push(resEmbed);
								}
							} else {
								NSFWcount++;
								if (data.sImgLink != null) {
									embeds.push(resEmbed.setImage(data.sImgLink));
								} else {
									embeds.push(resEmbed);
								}
							}
						} else {
							if (data.sImgLink != null) {
								embeds.push(resEmbed.setImage(data.sImgLink));
							} else {
								embeds.push(resEmbed);
							}
						}
					}
				}
			});

			Town.findOne({ nameLower: nationQuery }, function(err, town) {
				if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
				if (town != null) {
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
						.addField('Owner', '```' + town.mayor + '```', true)
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
							embeds.push(resEmbed.addField(`Members [1-50]`, '```' + members1.toString().replace(/,/g, ', ') + '```').addField(`Members [51-${town.membersArr.length}]`, '```' + members2.toString().replace(/,/g, ', ') + '```'));
						} else {
							embeds.push(
								resEmbed
									.addField(`Members [1-50]`, '```' + members1.toString().replace(/,/g, ', ') + '```')
									.addField(`Members [51-${town.membersArr.length}]`, '```' + members2.toString().replace(/,/g, ', ') + '```')
									.setURL(townP.get(`${town.name}.link`))
							);
						}
					} else {
						if (townP.get(`${town.name}.link`) == null) {
							embeds.push(resEmbed.addField(`Members [${town.membersArr.length}]`, memberList));
						} else {
							embeds.push(resEmbed.addField(`Members [${town.membersArr.length}]`, memberList).setURL(townP.get(`${town.name}.link`)));
						}
					}
				}
			});

			Nation.findOne({ nameLower: nationQuery }, function(err, nation) {
				if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
				if (nation != null) {
					let townsList = nation.townsArr.toString().replace(/,/g, ', ');
					let CASSTstatus = casst.get(`${nation.nameLower}`);
					let imgLink = nationsP.get(`${nation.nameLower}.imgLink`) != null ? nationsP.get(`${nation.nameLower}.imgLink`) : 'https://cdn.bcow.tk/assets/logo-new.png';
					let nationName = CASSTstatus == '<:verified:696564425775251477> Verified' ? `<:verified:696564425775251477> ${nation.name}` : nation.name;
					let nationDisc = nationsP.get(`${nation.nameLower}.discord`);
					let nationAMNT = nationsP.get(`${nation.nameLower}.amenities`);

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
						.addField('CASST Status', CASSTstatus)
						.addField('Residents', nation.residents, true)
						.addField('Area', nation.area, true)
						.addField('Location', `[${location[0]}, ${location[1]}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${location[0]}&y=64&z=${location[1]})`, true);

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

				Result.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then(async (results) => {
					await results.forEach((data) => {
						if (data.desc == null) {
							console.log(data.name + ' Missing desc.');
						} else {
							pageNum++;
							var themeColor = 0x0071bc;
							if (data.themeColor != undefined) var themeColor = data.themeColor;
							let resEmbed = new Discord.MessageEmbed()
								.setTitle(data.name)
								.setURL(data.link)
								.setDescription(data.desc)
								.setThumbnail(data.imgLink)
								.setColor(themeColor)
								.setFooter(`Page ${pageNum}/${results.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo-new.png');
							if (data.nsfw != undefined) {
								if (message.channel.type == 'dm') {
									embeds.push(resEmbed);
								} else {
									NSFWcount++;
									message.author.send(resEmbed);
								}
							} else {
								embeds.push(resEmbed);
							}
						}
					});
					if (embeds.length == 0) {
						message.channel.send(errorMessage.setDescription('No results found.'));
					} else {
						if (NSFWcount > 0) {
							message.channel.send(NSFWcount + ' NSFW result(s) sent to your DMs.');
						}
						message.channel.send(embeds[0]).then((m) => fn.paginator(message.author.id, m, embeds, 0));
					}
				});
			});
		} else {
			if (config.ENABLE_MUSIC) {
				const ytdl = require('ytdl-core');
				let msQuery = message.content.slice(4).replace('play ', '');
				const voiceChannel = message.member.voice.channel;

				if (!voiceChannel) {
					return message.channel.send(errorMessage.setDescription('Music player requires you to be in a voice channel. Meant to search? Add --no-music to your search.'));
				}

				search(msQuery, { maxResults: 1, key: config.YT_API_KEY }, function(err, result) {
					if (err) return console.log(err);

					voiceChannel.join().then((connection) => {
						let playerEmbed = new Discord.MessageEmbed()
							.setTitle(`Now playing ${result[0].title.replace(/&(?:[a-z\d]+|#\d+|#x[a-f\d]+);/gim, '')}`)
							.setColor(0x003175)
							.setDescription('Meant to search? Add --no-music to your search. React with ⏹️ or use 1!leavechannel to stop playing and have the bot leave the channel.')
							.setURL(`https://www.youtube.com/watch?v=${result[0].id}`)
							.setImage(result[0].thumbnails.high.url)
							.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
						message.channel.send(playerEmbed).then(async (m) => {
							const stream = await ytdl(`https://www.youtube.com/watch?v=${result[0].id}`, { filter: (format) => format.codecs === 'opus' });
							await connection.play(stream);
							stream.on('end', () => {
								voiceChannel.leave();
								m.reactions.removeAll().catch(() => {});
							});

							await m.react('⏹️');
							let reaction = await m.awaitReactions((reaction, user) => user.bot == false && reaction.emoji.name == '⏹️', { time: 240 * 1000, max: 1, errors: [ 'time' ] }).catch(() => {});
							if (!reaction) return m.reactions.removeAll().catch(() => {});
							reaction = reaction.first();
							if (reaction) {
								voiceChannel.leave();
							}
						});
					});
				});
			}
			return;
		}
	}
};
