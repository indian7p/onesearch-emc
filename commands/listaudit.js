const db = require('quick.db'),
config = require('../config.json')
casst = new db.table('casst');

module.exports = {
	name: 'listaudit',
	description: 'Finds nations without CASST statuses',
	execute: (message, Nation) => {
    let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    if(!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription("You do not have permission to use this command."));

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
