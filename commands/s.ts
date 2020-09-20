import * as Discord from 'discord.js';
import dialogflow from '@google-cloud/dialogflow';
import * as config from '../config.json';
import { NationGroup, Result } from '../models/models';
import { paginator } from '../functions/paginator';
import { errorMessage, successMessage } from '../functions/statusMessage';
import nation from './n/default';
import town from './t/default';
import { getSearchResults } from '../functions/search';

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
			const results = await getSearchResults(query);

			const nationEmbed = await nation(message, args).catch(err => {});
			if (nationEmbed) embeds.push(nationEmbed);
			
			const townEmbed = await town(message, args).catch(err => {});
			if (townEmbed) embeds.push(townEmbed);

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

			for (var i = 0, len = results.hits.length; i < len; i++) {
				const result = results.hits[i];

				const resEmbed = new Discord.MessageEmbed()
					.setTitle(result.name)
					.setURL(result.link)
					.setDescription(result.desc)
					.setThumbnail(result.imgLink)
					.setFooter(`Page ${i + 1}/${results.nbHits} | OneSearch`, 'https://cdn.bcow.xyz/assets/onesearch.png');

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
