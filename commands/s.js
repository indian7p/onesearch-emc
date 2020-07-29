const Discord = require('discord.js'),
	moment = require('moment-timezone'),
	dialogflow = require('@google-cloud/dialogflow'),
	config = require('../config.json'),
	fetch = require('node-fetch'),
	fn = require('../util/fn');

module.exports = {
	name: 's',
	description: 'Searches OneSearch',
	execute(message, args, Nation, NationP, Result, Town, TownP, SResult) {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');

		let query = message.content.slice(4).toLowerCase();
		let timeoutTime;
		if (config.DIALOGFLOW_ENABLED && query.match(/what|where|how|when|which|why|should/)) {
			timeoutTime = 2000;
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

			sessionClient.detectIntent(request).then(responses => {
				const result = responses[0].queryResult;
				if (result.intent) {
					let dEmbed = new Discord.MessageEmbed()
						.setTitle('<:dialogflow:737047780475797647> Questions')
						.setColor(0x003175)
						.addField('Question', result.intent.displayName)
						.addField('Answer', result.fulfillmentText)
						.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
					embeds.unshift(dEmbed);
				}
			});
		} else {
			timeoutTime = 0;
		}
		
		let embeds = [];

		let nationQuery = query.replace(/ /g, '_');

		if (!args[1]) {
			let embeds = [];
			Result.find({}, function (err, results) {
				if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'))
				let pageCount = 0;
				results.forEach((result) => {
					pageCount++;
					let resEmbed = new Discord.MessageEmbed()
						.setTitle(result.name)
						.setColor(0x003175)
						.setDescription(result.desc)
						.setURL(result.link)
						.setThumbnail(result.imgLink)
						.setFooter(`Page ${pageCount}/${results.length} | OneSearch`, 'https://cdn.bcow.tk/assets/logo-new.png');

					embeds.push(resEmbed);
					if (pageCount == results.length) {
						message.channel.send(embeds[0]).then((m) => {
							fn.paginator(message.author.id, m, embeds, 0);
						});
					}
				});
			});
		}

		let pageNum = 0;
		let NSFWcount = 0;

		SResult.findOne({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then(async (data) => {
			if (!data) {
			} else {
				if (data.desc == null) {
					console.log(data.name + ' Missing desc.');
				} else {
					pageNum++;
					let themeColor = data.themeColor != null ? data.themeColor : 0x003175;
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

			Town.findOne({ nameLower: nationQuery }, function (err, town) {
				if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
				if (town != null) {
					TownP.findOne({ name: town.name }, function (err, townp) {
						if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
						let description;
						let imgLink;
						if (!townp) {
							description = 'Information may be slightly out of date.';
							imgLink = 'https://cdn.bcow.tk/assets/logo-new.png';
						} else {
							imgLink = townp.imgLink == null ? 'https://cdn.bcow.tk/assets/logo-new.png' : townp.imgLink;
							description = townp.scrating == null ? 'Information may be slightly out of date.' : `**[Shootcity Rating: ${townp.scrating}]** Information may be slightly out of date.`;
						}
	
						let link;
						try {
							link = townp.link;
						} catch {
							link = null
						}
	
						let tName = town.capital == true ? `:star: ${town.name} (${town.nation})` : `${town.name} (${town.nation})`;
						let color = town.nation == 'No Nation' ? 0x69a841 : town.color == '#000000' ? 0x010101 : town.color == '#FFFFFF' ? 0xfefefe : town.color;
						let timeUp = moment(town.time).tz('America/New_York').format('MMMM D, YYYY h:mm A z');
						let memberList = `\`\`\`${town.members}\`\`\``;
						let resEmbed = new Discord.MessageEmbed()
							.setTitle(tName.replace(/_/g, '\_'))
							.setDescription(description)
							.setColor(color)
							.setThumbnail(imgLink)
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
						message.channel.stopTyping()
					})
				}
			});
	
			Nation.findOne({ nameLower: nationQuery }, function (err, nation) {
				if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
				if (nation != null) {
					NationP.findOne({ name: nation.nameLower }, function (err, nationp) {
						if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
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
							.setTitle(nationName.replace(/_/g, '\_'))
							.setURL(nationLink)
							.setColor(nation.color)
							.setThumbnail(imgLink)
							.addField('Owner', `\`\`\`${nation.owner}\`\`\``, true)
							.addField('Capital', nation.capital, true)
							.addField('Status', status)
							.addField('Residents', nation.residents, true)
							.addField('Area', nation.area, true)
							.addField('Location', `[${location[0]}, ${location[1]}](https://earthmc.net/map/?worldname=earth&mapname=flat&zoom=6&x=${location[0]}&y=64&z=${location[1]})`, true)
							.addField('Report this nation', '[Google Form](https://l.bcow.tk/report-nation)');
	
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
					})
				}
	
				Result.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).then(results => {
					results.forEach((data) => {
						if (data.desc == null) {
							console.log(data.name + ' Missing desc.');
						} else {
							pageNum++;
							var themeColor = 0x003175;
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
						message.channel.stopTyping();
						message.channel.send(errorMessage.setDescription('No results found.'));
					} else {
						if (NSFWcount > 0) {
							message.channel.send(NSFWcount + ' NSFW result(s) sent to your DMs.');
						}
						setTimeout(function() {
							message.channel.stopTyping();
							message.channel.send(embeds[0]).then((m) => fn.paginator(message.author.id, m, embeds, 0));
						}, timeoutTime)
					}
				});
			});
		});
	}
};
