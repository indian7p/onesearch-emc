import activity from './pl/activity';
import chistory from './pl/chistory';
import location from './pl/location';
import def from './pl/default';
import nhistory from './pl/nhistory';
import online from './pl/online';
import staff from './pl/staff';
import uuid from './pl/uuid';

export default {
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
