const Discord = require('discord.js');
const cache = require('quick.db');
const casst = new cache.table('casst');

module.exports = {
	name: 'listaudit',
	description: 'Finds nations without CASST statuses',
	execute: (message, args, Nation) => {
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
