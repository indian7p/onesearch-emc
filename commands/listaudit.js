const Discord = require('discord.js'),
	config = require('../config.json');

module.exports = {
	name: 'listaudit',
	description: 'Finds nations without statuses',
	execute(message, Nation, NationP) {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

		Nation.find({}, function (err, nations) {
			if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

			let counter = 0;
			nations.forEach(nation => {
				NationP.findOne({ name: nation.nameLower }, function (err, nationp) {
					if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

					if (!nationp) {
						message.channel.send(nation.name.replace(/_/g, '\_'));
						counter++;
					}else if(!nationp.status || nationp.status == ':grey_question: Unknown') {
						message.channel.send(nation.name.replace(/_/g, '\_'));
						counter++;
					}
				})

				if (counter == nations.length) {
					message.channel.send(`Found ${counter} nations`);
				}
			})
		});
	}
};