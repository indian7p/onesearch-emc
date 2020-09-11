import * as Discord from 'discord.js';
import * as config from '../config.json';
import { Town, TownP, NationP } from '../models/models';
import { errorMessage, successMessage } from '../functions/statusMessage';
import img from './sett/img';
import rating from './sett/rating';
import link from './sett/link';

export default {
	name: 'sett',
	description: 'Sets town information',
	execute: async (message, args) => {
		let helpEmbed = new Discord.MessageEmbed()
			.setTitle('1!sett')
			.setDescription('Using `null` as the value will clear that type.')
			.setColor(0x003175)
			.addField('1!sett img', 'Sets a towns image')
			.addField('1!sett rating', 'Sets a towns Shootcity rating')
			.addField('1!sett link', 'Sets a towns link')
			.setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');

		if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

		if (!args[2]) return message.channel.send(helpEmbed);

		let query = args[2].toLowerCase();
		const town = await Town.findOne({ nameLower: query }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error message.')));

		if (!town) return message.channel.send(errorMessage.setDescription('Town not found.'));

		const townp = await TownP.findOne({ name: town.name }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error message.')));

		switch (args[1]) {
			case 'img':
				img(message, args, town, townp);
				break;
			case 'rating':
				rating(message, args, town, townp);
				break;
			case 'link':
				link(message, args, town, townp);
				break;
			default:
				message.channel.send(helpEmbed)
				break;
		}
	}
};