const Discord = require('discord.js'),
	moment = require('moment-timezone'),
	fn = require('../util/fn'),
	db = require('quick.db'),
	nationsP = new db.table('nationsP'),
	townP = new db.table('townP'),
	casst = new db.table('casst');

module.exports = {
	name: 's',
	description: 'Searches OneSearch',
	execute(message, args, Nation, Result, Town, SResult) {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo.png');
		if (!args[1]) return message.channel.send(errorMessage.setDescription('No search query'));
		let query = message.content.slice(4).toLowerCase();

		let embeds = [];

		let nationQuery = query.replace(/ /g, '_');

		SResult.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then(async (results) => {
			let pageNum = 0;
			let NSFWcount = 0;
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
						.setFooter(`Page ${pageNum}/${results.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo.png');
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
		});
		Nation.findOne({ nameLower: nationQuery }, function(err, nation) {
			if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
			if (nation != null) {
				let townsList = nation.townsArr.toString().replace(/,/g, ', ');
				let CASSTstatus = casst.get(`${nation.nameLower}`);
				let imgLink = nationsP.get(`${nation.nameLower}.imgLink`) != null ? nationsP.get(`${nation.nameLower}.imgLink`) : 'https://cdn.bcow.tk/assets/logo.png';
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
      
			Town.find({ $text: { $search: nationQuery } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then(async (results) => {
				let pageNum = 0;
				let NSFWcount = 0;
				await results.forEach((town) => {
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
						.setFooter(`OneSearch | Database last updated: ${timeUp}`, 'https://cdn.bcow.tk/assets/logo.png');
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
				});
			});

			Result.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then(async (results) => {
				let pageNum = 0;
				let NSFWcount = 0;
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
							.setFooter(`Page ${pageNum}/${results.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo.png');
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
	}
};
