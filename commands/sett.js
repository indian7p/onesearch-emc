const Discord = require('discord.js'),
  config = require('../config.json'),
	cache = require('quick.db'),
	townP = new cache.table('townP');

module.exports = {
	name: 'sett',
	description: 'Sets town information',
	execute: (message, args, Town) => {
		let successMessage = new Discord.MessageEmbed().setTitle(':white_check_mark: **Success!**').setColor(0x07bf63).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    let helpEmbed = new Discord.MessageEmbed()
			.setTitle('1!sett')
			.setDescription('Using `null` as the value will clear that type (coming soon!)')
			.setColor(0x003175)
			.addField('1!setpl img', 'Sets a towns image')
			.addField('1!setpl rating', 'Sets a towns Shootcity rating')
			.addField('1!setpl link', 'Sets a towns link')
			.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    
		if(!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription("You do not have permission to use this command."));
    
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
        case 'null':
          townP.delete(`${town.name}`);
          message.channel.send(successMessage.setDescription(`Successfully cleared the town's information`));
          break;
        default:
          message.channel.send(helpEmbed)
          break;
			}
		});
	}
};
