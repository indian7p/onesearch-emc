import * as config from '../config.json';
import * as help from '../help/sett.json';
import { Town, TownP } from '../models/models';
import { errorMessage } from '../functions/statusMessage';
import img from './sett/img';
import link from './sett/link';

export default {
	name: 'sett',
	description: 'Sets town information',
	execute: async (message, args) => {
		if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

		if (!args[2]) return message.channel.send(errorMessage.setDescription('Missing town name. Command usage: 1!sett [type] [town] <- Missing [value]'));
		if (!args[3]) return message.channel.send(errorMessage.setDescription('Missing value, use `null` to delete. Command usage: 1!sett [type] [town] [value] <- Missing'));

		const query = args[2].toLowerCase();
		const town = await Town.findOne({ nameLower: query }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error message.')));

		if (!town) return message.channel.send(errorMessage.setDescription('Town not found.'));

		const townp = await TownP.findOne({ name: town.name }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error message.')));

		switch (args[1]) {
			case 'img':
				img(message, args, town, townp);
				break;
			case 'link':
				link(message, args, town, townp);
				break;
			default:
				message.channel.send(help)
				break;
		}
	}
};