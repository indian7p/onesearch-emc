const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Shows commands and tips and tricks',
	execute(message) {
		const helpEmbed = new Discord.MessageEmbed()
			.setTitle('Help')
			.setThumbnail('https://cdn.bcow.tk/assets/logo-new.png')
			.setColor(0x003175)
			.addField('Join my discord!', 'https://discord.gg/mXrTXhB')
			.addField('Add Search Item (Google Forms)', 'https://l.bcow.tk/add-item/')
			.addField('1!info', 'Shows bot info')
			.addField('1!s [search term]', 'Search OneSearch for towns, nations, discords, and more.')
			.addField('1!n [nation]', 'Finds nation information')
			.addField('1!nonation', 'Gets towns without a nation')
			.addField('1!t [town]', 'Finds town information')
			.addField('1!notown', 'Gets towns without a nation')
			.addField('1!pl or player [username or UUID]', 'Gets player information')
			.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		message.channel.send(helpEmbed);
	}
};
