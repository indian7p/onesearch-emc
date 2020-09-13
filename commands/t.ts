import * as help from '../help/t.json';
import online from './t/online';
import activity from './t/activity';
import def from './t/default';
import list from './t/list';
import { errorMessage } from '../functions/statusMessage';

export default {
	name: 't',
	description: 'Searches for towns',
	execute: async (message, args) => {
		message.channel.startTyping();

		switch (args[1]) {
			case undefined:
				message.channel.send(help);
				message.channel.stopTyping();
				break;
			case 'activity':
				activity(message, args);
				break;
			case 'list':
				switch(args[2]) {
					default:
					case 'members':
						list(message, { residents: 'desc' });
						break;
					case 'area':
						list(message, { area: 'desc' });
						break;
				}
				break;
			case 'online':
				online(message, args);
				break;
			default:
				const defMsg = await def(message, args).catch(err => {
					message.channel.send(errorMessage.setDescription('Town not found.'));
					message.channel.stopTyping();
				});

				message.channel.send(defMsg);
				message.channel.stopTyping();
				break;
		}
	}
};