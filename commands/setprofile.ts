import * as help from '../help/setprofile.json';
import { PlayerP } from '../models/models';
import { errorMessage } from '../functions/statusMessage';
import youtube from './setprofile/youtube';
import twitter from './setprofile/twitter';
import twitch from './setprofile/twitch';
import desc from './setprofile/desc';
import unlink from './setprofile/unlink';

export default {
	name: 'setprofile',
	description: 'Sets profile information',
	execute: async (message, args) => {      
    const player = await PlayerP.findOne({ discord: message.author.id }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

    if (!player) return message.channel.send(errorMessage.setDescription('You have not linked your Minecraft account with Discord. Use 1!link to link.'));

		if (!args[2] && args[1] != 'unlink') return message.channel.send(errorMessage.setDescription('Missing value, use `null` to delete. Command usage: 1!setprofile [type] [player] [value] <- Missing'));

		switch (args[1]) {
      case 'youtube':
        youtube(message, args, player);
        break;
      case 'twitter':
        twitter(message, args, player);
        break;
      case 'twitch':
        twitch(message, args, player);
        break;
      case 'desc':
        desc(message, args, player);
        break;
      case 'unlink':
        unlink(message, player);
        break;
      default:
        message.channel.send(help);
        break;
    }
	}
};