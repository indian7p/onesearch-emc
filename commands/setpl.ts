import * as help from '../help/setpl.json';
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
		if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

		if (!args[2]) return message.channel.send(errorMessage.setDescription('Missing username or UUID. Command usage: 1!setpl [type] [player] <- Missing [value]'));
		if (!args[3]) return message.channel.send(errorMessage.setDescription('Missing value, use `null` to delete. Command usage: 1!setpl [type] [player] [value] <- Missing'));

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
				message.channel.send(help);
				break;
		}
	}
};