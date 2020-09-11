import activity from './n/activity';
import list from './n/list';
import online from './n/online';
import def from './n/default';
import { errorMessage } from '../functions/statusMessage';

export default {
	name: 'n',
	description: 'Searches for nations',
	execute: async (message, args) => {
		message.channel.startTyping();
		switch (args[1]) {
			case 'activity':
				activity(message, args);
				break;
			case 'list':
				switch (args[2]) {
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
					message.channel.send(errorMessage.setDescription('Nation not found or an error occurred.'));
					message.channel.stopTyping();
				});

				message.channel.send(defMsg);
				message.channel.stopTyping();
				break;
		}
	}
};
