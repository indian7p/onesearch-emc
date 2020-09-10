const activity = require('./pl/activity');
const chistory = require('./pl/chistory');
const location = require('./pl/location');
const def = require('./pl/default');
const nhistory = require('./pl/nhistory');
const online = require('./pl/online');
const staff = require('./pl/staff');
const uuid = require('./pl/uuid');

module.exports = {
	name: 'pl',
	description: 'Searches for players',
	execute: async (message, args, client) => {
		switch (args[1]) {
			case 'chistory':
				chistory(message, args);
				break;
			case 'nhistory':
				nhistory(message, args);
				break;
			case 'uuid':
				uuid(message, args);
				break;
			case 'online':
				online(message, args);
				break;
			case 'activity':
				activity(message, args);
				break;
			case 'location':
				location(message, args);
				break;
			case 'staff':
				staff(message);
				break;
			default:
				def(message, args, client);
				break;
		}
	}
};
