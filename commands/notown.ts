import * as Discord from 'discord.js';
import { getMapData } from '../functions/fetch';
import { errorMessage } from '../functions/statusMessage';
import { Town } from '../models/models';

export default {
	name: 'notown',
	description: 'Finds players with no town',
	execute: async (message) => {
		message.channel.startTyping();

		const data = await getMapData().catch(err => {
			message.channel.send(errorMessage.setDescription('An error occurred while getting map data.'));
			message.channel.stopTyping();
		});

		let townless = [];
		for (var i = 0; i < data.players.length; i++) {
			const player = data.players[i];

			const town = await Town.findOne({ membersArr: { $in: [player.account] } }).exec().catch(err => {
				message.channel.send(errorMessage.setDescription('An error occurred.'));
				message.channel.stopTyping();
			});

			if (!town) {
				townless.push(player.account);
			}
		}

		let resEmbed = new Discord.MessageEmbed()
			.setTitle('Townless Players')
			.setColor(0x003175)
			.setDescription(`**Players [${townless.length}]**\n\`\`\`${townless.toString().replace(/,/g, ', ')}\`\`\``)
			.setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');

		message.channel.send(resEmbed);
		message.channel.stopTyping();
	}
};
