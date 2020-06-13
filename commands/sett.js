const Discord = require('discord.js'),
	cache = require('quick.db'),
	townP = new cache.table('townP');

module.exports = {
	name: 'sett',
	description: 'Sets town information',
	execute: (message, args, Town) => {
		let successMessage = new Discord.MessageEmbed().setTitle(':white_check_mark: **Success!**').setColor(0x07bf63).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		if (message.author.id != '456965312886079533') {
			if (message.author.id != '345720683076124673') {
				message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));
			}
		}
		let query = args[2].toLowerCase();
		Town.findOne({ nameLower: query }, function(err, town) {
			switch (args[1]) {
				case 'img':
					townP.set(`${town.name}.imgLink`, message.content.slice(9 + args[1].length + args[2].length).replace(/^(http|https):\/\//, 'https://cdn.statically.io/img/'));
					message.channel.send(successMessage.setDescription(`Successfully set the town's image`));
					break;
				case 'rating':
					townP.set(`${town.name}.scrating`, message.content.slice(9 + args[2].length + args[1].length));
					message.channel.send(successMessage.setDescription(`Successfully set the town's rating`));
					break;
				case 'link':
					townP.set(`${town.name}.link`, message.content.slice(9 + args[2].length + args[1].length));
					message.channel.send(successMessage.setDescription(`Successfully set the town's link`));
					break;
			}
		});
	}
};
