const online = require('./t/online');
const activity = require('./t/activity');
const def = require('./t/default');
const list = require('./t/list');

module.exports = {
	name: 't',
	description: 'Searches for towns',
	execute: async (message, args) => {
		message.channel.startTyping();

		switch (args[1]) {
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
				const defMsg = await def(message, args);

				message.channel.send(defMsg);
				message.channel.stopTyping();
				break;
		}
	}
};

