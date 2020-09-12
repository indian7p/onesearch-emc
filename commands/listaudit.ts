import * as config from '../config.json';
import { errorMessage } from '../functions/statusMessage';
import { NationP, Nation } from '../models/models';

export default {
	name: 'listaudit',
	description: 'Finds nations without statuses',
	execute: async (message) => {
		if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

		const nations = await Nation.find({}).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

		for (var i = 0; i < nations.length; i++) {
			const nation = nations[i];

			const nationp = await NationP.findOne({ name: nation.nameLower }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

			if (!nationp) {
				message.channel.send(nation.name.replace(/_/g, '\_'));
			} else if (!nationp.status || nationp.status == ':grey_question: Unknown') {
				message.channel.send(nation.name.replace(/_/g, '\_'));
			}

			if (i == nations.length - 1) {
				message.channel.send(`Found ${i + 1} nations.`);
			}
		}
	}
};