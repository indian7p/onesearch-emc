import * as Discord from 'discord.js';
import * as moment from 'moment-timezone';
import dialogflow from '@google-cloud/dialogflow';
import * as config from '../config.json';
import { Nation, NationGroup, NationP, Result, Town, TownP } from '../models/models';
import { paginator } from '../functions/paginator';
import { errorMessage, successMessage } from '../functions/statusMessage';
import def from './n/default';

export default {
	name: 's',
	description: 'Searches OneSearch',
	execute: async (message, args) => {
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
					.setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
				embeds.unshift(dEmbed);
			}
		}

		const nationQuery = query.replace(/ /g, '_');

		if (nationQuery == "no_nation") return message.channel.send(errorMessage.setDescription('Please use 1!nonation.'))

		if (!args[1]) {
			let embeds = [];
			const results = await Result.find({}).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

			for (var i = 0; i < results.length; i++) {
				const result = results[i];

				let resEmbed = new Discord.MessageEmbed()
					.setTitle(result.name)
					.setColor(0x003175)
					.setDescription(result.desc)
					.setURL(result.link)
					.setThumbnail(result.imgLink)
					.setFooter(`Page ${i + 1}/${results.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');

				embeds.push(resEmbed);
			}

			message.channel.send(embeds[0]).then((m) => {
				paginator(message.author.id, m, embeds, 0);
			});
		} else {
			let NSFWcount = 0;

			const nationGroup = await NationGroup.findOne({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
			const town = await Town.findOne({ nameLower: nationQuery }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
			const results = await Result.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

			const nationEmbed = await def(message, args).catch(err => {});
			if (nationEmbed) embeds.push(nationEmbed);

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
					.setFooter(`OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');

				embeds.push(ngEmbed);
			}

			if (town) {
				const townp = await TownP.findOne({ name: town.name }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

				let description = !townp ? 'Information may be slightly out of date.' : townp.scrating == null ? 'Information may be slightly out of date.' : `**[Shootcity Rating: ${townp.scrating}]** Information may be slightly out of date.`;
				let imgLink = !townp ? 'https://cdn.bcow.xyz/assets/onesearch.png' : townp.imgLink == null ? 'https://cdn.bcow.xyz/assets/onesearch.png' : townp.imgLink;

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
					.setFooter(`OneSearch | Database last updated: ${timeUp}`, 'https://cdn.bcow.xyz/assets/onesearch.png');

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

					let members1str = `\`\`\`${members1.toString().replace(/,/g, ', ')}\`\`\``;
					let members2str = `\`\`\`${members2.toString().replace(/,/g, ', ')}\`\`\``;
					if (!link) {
						embeds.push(resEmbed.addField(`Members [1-50]`, members1str).addField(`Members [51-${town.membersArr.length}]`, members2str));
					} else {
						embeds.push(resEmbed.addField(`Members [1-50]`, members1str).addField(`Members [51-${town.membersArr.length}]`, members2str).setURL(link));
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
					.setFooter(`Page ${i + 1}/${results.length} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');

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
				message.channel.send(embeds[0]).then((m) => paginator(message.author.id, m, embeds, 0));
			}
		}
	}
};
