const Discord = require('discord.js');
const moment = require('moment-timezone');
const dialogflow = require('@google-cloud/dialogflow');
const config = require('../config.json');
const fn = require('../util/fn');
const { errorMessage, successMessage } = require('../functions/statusMessage');

module.exports = {
	name: 's',
	description: 'Searches OneSearch',
	execute: async (message, args, Nation, NationGroup, NationP, Result, Town, TownP, client) => {
		const query = message.content.slice(args[0].length + 3).toLowerCase();
		let embeds = [];

		if (config.DIALOGFLOW_ENABLED && query.match(/what|where|how|when|which|why|should|^can|^is/)) {
			message.channel.startTyping();
			const sessionClient = new dialogflow.SessionsClient();
			const sessionPath = sessionClient.projectAgentSessionPath(config.GCP_PROJ, '123456789');

			const request = {
				session: sessionPath,
				queryInput: {
					text: {
						text: query,
						languageCode: 'en-US',
					},
				},
			};

			const responses = await sessionClient.detectIntent(request);

			const result = responses[0].queryResult;
			if (result.intent) {
				let dEmbed = new Discord.MessageEmbed()
					.setTitle('<:dialogflow:737047780475797647> Questions')
					.setColor(0x003175)
					.addField('Question', result.intent.displayName)
					.addField('Answer', result.fulfillmentText)
					.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png');
				embeds.unshift(dEmbed);
			}
		}

		const nationQuery = query.replace(/ /g, '_');

		if (nationQuery == "no_nation") return message.channel.send(errorMessage.setDescription('Please use 1!nonation.'))

		if (!args[1]) {
			let embeds = [];
			Result.find({}, function (err, results) {
				if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

				let pageCount = 0;
				results.forEach((result) => {
					pageCount++;
					let resEmbed = new Discord.MessageEmbed()
						.setTitle(result.name)
						.setColor(0x003175)
						.setDescription(result.desc)
						.setURL(result.link)
						.setThumbnail(result.imgLink)
						.setFooter(`Page ${pageCount}/${results.length} | OneSearch`, 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png');

					embeds.push(resEmbed);
					if (pageCount == results.length) {
						message.channel.send(embeds[0]).then((m) => {
							fn.paginator(message.author.id, m, embeds, 0);
						});
					}
				});
			});
		} else {
			let NSFWcount = 0;

			const nation = await Nation.findOne({ nameLower: nationQuery }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
			const nationGroup = await NationGroup.findOne({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
			const town = await Town.findOne({ nameLower: nationQuery }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
			const results = await Result.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

			if (nation) {
				const nationp = await NationP.findOne({ name: nation.nameLower }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

				let status = !nationp ? ':grey_question: Unknown' : !nationp.status ? ':grey_question: Unknown' : nationp.status;
				let imgLink = !nationp ? 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png' : !nationp.imgLink ? 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png' : nationp.imgLink;
				let nationName = !nationp ? nation.name : status == '<:verified:726833035999182898> Verified' ? `<:verified:726833035999182898> ${nation.name.replace(/_/g, '\_')}` : nation.name.replace(/_/g, '\_');
				let nationLink = nationp ? nationp.link : null;
				let nationAMNT = nationp ? nationp.amenities : null;

				let townsList = nation.townsArr.toString().replace(/,/g, ', ');
				if (townsList.length > 1024) {
					let members1 = [];
					let members2 = [];

					for (var i = 0, len = nation.townsArr.length; i < len; i++) {
						const member = nation.townsArr[i];

						if (i + 1 <= 50) {
							members1.push(member);
						} else {
							members2.push(member);
						}
					};

					var members1STR = `'\`\`\`${members1.toString().replace(/,/g, ', ')}\`\`\``;
					var members2STR = `'\`\`\`${members2.toString().replace(/,/g, ', ')}\`\`\``;
				}

				let location = nation.location.split(',');

				const val = nation.residents;
				let nationBonus;
				switch (true) {
					case (val > 0 && val < 9):
						nationBonus = 10;
						break;
					case (val > 10 && val < 19):
						nationBonus = 20;
						break;
					case (val > 20 && val < 29):
						nationBonus = 40;
						break;
					case (val > 30 && val < 39):
						nationBonus = 60;
						break;
					case (val > 40 && val < 49):
						nationBonus = 100;
						break;
					case (val > 50):
						nationBonus = 140;
						break;
				}

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
					.addField('Report this nation', '[SearchSafe](https://searchsafe.bcow.tk/)', true);

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
			}

			if (nationGroup) {
				let ngEmbed = new Discord.MessageEmbed()
					.setTitle(nationGroup.name)
					.setURL(nationGroup.link)
					.setColor(0x003175)
					.setDescription(nationGroup.desc)
					.setThumbnail(nationGroup.imgLink)
					.addField('Leader', `\`\`\`${nationGroup.leader}\`\`\``, true)
					.addField('Size', nationGroup.size, true)
					.addField(`Members`, nationGroup.members, true)
					.addField(`Nations [${nationGroup.nations.length}]`, `\`\`\`${nationGroup.nations.toString().replace(/,/g, ', ')}\`\`\``)
					.setFooter(`OneSearch`, 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png');

				embeds.push(ngEmbed);
			}

			if (town) {
				const townp = await TownP.findOne({ name: town.name }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

				let description = !townp ? 'Information may be slightly out of date.' : townp.scrating == null ? 'Information may be slightly out of date.' : `**[Shootcity Rating: ${townp.scrating}]** Information may be slightly out of date.`;
				let imgLink = !townp ? 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png' : townp.imgLink == null ? 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png' : townp.imgLink;

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
					.setTitle(tName)
					.setDescription(description)
					.setColor(color)
					.setThumbnail(imgLink)
					.addField('Owner', `\`\`\`${town.mayor}\`\`\``, true)
					.addField('Location', `[${town.x}, ${town.z}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${town.x}&y=64&z=${town.z})`, true)
					.addField('Size', `${town.area}/${maxSize} [NationBonus: ${townNationBonus}]`, true)
					.setFooter(`OneSearch | Database last updated: ${timeUp}`, 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png');

				if (memberList.length > 1024) {
					let members1 = [];
					let members2 = [];
					for (var i = 0, len = town.membersArr.length; i < len; i++) {
						const member = town.membersArr[i];

						if (i + 1 <= 50) {
							members1.push(member);
						} else {
							members2.push(member);
						}
					};

					members1 = `\`\`\`${members1.toString().replace(/,/g, ', ')}\`\`\``;
					members2 = `\`\`\`${members2.toString().replace(/,/g, ', ')}\`\`\``;
					if (!link) {
						embeds.push(resEmbed.addField(`Members [1-50]`, members1).addField(`Members [51-${town.membersArr.length}]`, members2));
					} else {
						embeds.push(resEmbed.addField(`Members [1-50]`, members1).addField(`Members [51-${town.membersArr.length}]`, members2).setURL(link));
					}
				} else {
					if (!link) {
						embeds.push(resEmbed.addField(`Members [${town.membersArr.length}]`, memberList));
					} else {
						embeds.push(resEmbed.addField(`Members [${town.membersArr.length}]`, memberList).setURL(link));
					}
				}
			}

			for (var i = 0, len = results.length; i < len; i++) {
				const result = results[i];

				const themeColor = result.themeColor ? result.themeColor : 0x003175;

				const resEmbed = new Discord.MessageEmbed()
					.setTitle(result.name)
					.setURL(result.link)
					.setDescription(result.desc)
					.setThumbnail(result.imgLink)
					.setColor(themeColor)
					.setFooter(`Page ${i + 1}/${results.length} | OneSearch`, 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png');

				if (result.nsfw != undefined) {
					if (message.channel.type == 'dm') {
						embeds.push(resEmbed);
					} else {
						NSFWcount++;
						message.author.send(resEmbed);
					}
				} else {
					embeds.push(resEmbed);
				}
			};

			if (embeds.length == 0) {
				message.channel.stopTyping();
				message.channel.send(errorMessage.setDescription('No results found.'));
			} else {
				if (NSFWcount > 0) {
					message.channel.send(successMessage.setDescription(`${NSFWcount} NSFW result(s) sent to your DMs.`));
				}
				message.channel.stopTyping();
				message.channel.send(embeds[0]).then((m) => fn.paginator(message.author.id, m, embeds, 0));
			}
		}
	}
};
