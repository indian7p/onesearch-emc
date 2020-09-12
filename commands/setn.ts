import amenities from './setn/amenities';
import link from './setn/amenities';
import img from './sett/img';
import status from './setpl/status';
import * as config from '../config.json';
import { errorMessage } from '../functions/statusMessage';
import { Nation, NationP } from '../models/models';

export default {
	name: 'setn',
	description: 'Sets nation information',
	execute: async (message, args) => {
		if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

		if (!args[2]) return message.channel.send(errorMessage.setDescription('Missing username or UUID. Command usage: 1!setn [type] [nation] <- Missing [value]'));
		if (args[1] == 'delete') {
		} else {
			if (!args[3]) return message.channel.send(errorMessage.setDescription('Missing value, use null to delete. Command usage: 1!setn [type] [nation] [value] <- Missing'));
		}

		let query = args[2].toLowerCase();

		const nation = await Nation.findOne({ nameLower: query }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));
		if (!nation) return message.channel.send(errorMessage.setDescription('Nation not found'));

		const nationp = await NationP.findOne({ name: nation.nameLower }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

		switch (args[1]) {
			case 'amenities':
				amenities(message, args, nation, nationp);
				break;
			case 'link':
				link(message, args, nation, nationp);
				break;
			case 'img':
				img(message, args, nation, nationp);
				break;
			case 'status':
				status(message, args, nation, nationp);
				break;
		}
	}
};