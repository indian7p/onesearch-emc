import * as Discord from 'discord.js';
import * as config from'../config.json';
import { getPlayer } from '../functions/fetch';
import { errorMessage } from '../functions/statusMessage';
import { Player } from '../models/models';
import historyevent from './setpl/historyevent';
import status from './setpl/status';

export default {
	name: 'setpl',
	description: 'Sets player information',
	execute: async (message, args) => {
		let helpEmbed = new Discord.MessageEmbed()
			.setTitle('1!setpl')
			.setDescription('Using `null` as the value will clear that type')
			.setColor(0x003175)
			.addField('1!setpl historyevent', 'Added a history event')
			.addField('1!setpl status', 'Sets a players CASST status. Valid statuses: <:verified:726833035999182898> Verified, ⚠️ Scammer, ⛔ BANNED')
			.setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');

		if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

		if (!args[2]) return message.channel.send(errorMessage.setDescription('Missing username or UUID. Command usage: 1!setpl [type] [player] <- Missing [value]'));
		if (!args[3]) return message.channel.send(errorMessage.setDescription('Missing value, use null to delete. Command usage: 1!setpl [type] [player] [value] <- Missing'));

		const data = await getPlayer(args[2]);
		const player = await Player.findOne({ id: data.data.player.raw_id }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

		switch (args[1]) {
			case 'historyevent':
				historyevent(message, args, player, data);
				break;
			case 'status':
				status(message, args, player, data);
				break;
			default:
				message.channel.send(helpEmbed);
				break;
		}
	}
};