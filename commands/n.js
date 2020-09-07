const activity = require('./n/activity');
const list = require('./n/list');
const online = require('./n/online');
const def = require('./n/default');
const { errorMessage } = require('../functions/statusMessage');

module.exports = {
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
					return message.channel.send(errorMessage.setDescription('Nation not found or an error occurred.'));
				});

				message.channel.send(defMsg).catch(err => {});
				message.channel.stopTyping();
				break;
		}
	}
};
