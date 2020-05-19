const db = require('quick.db'),
casst = new db.table('casst');

module.exports = {
	name: 'listaudit',
	description: 'Finds nations without CASST statuses',
	execute: (message, Nation) => {
		if (message.author.id != '456965312886079533') return message.channel.send('You do not have permission to use this command.');
		Nation.find({}, async function(err, nations) {
			let counter = 0;
			await nations.forEach((nation) => {
				if (casst.get(`${nation.nameLower}`) == null || casst.get(`${nation.nameLower}`) == undefined || casst.get(`${nation.nameLower}`) == '❔ Unknown') {
					message.channel.send(nation.name);
					counter++;
				}
			});
			message.channel.send(`Found ${counter} nations`);
		});
	}
};
