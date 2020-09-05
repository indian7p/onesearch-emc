const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Shows bot commands',
	execute(message) {
		const helpEmbed = new Discord.MessageEmbed().setThumbnail('https://cdn.bcow.tk/assets/neu-os-logo-circle.png').setColor(0x003175).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/neu-os-logo-circle.png')
			.setTitle('Help')
			.setDescription('Join my [discord](https://discord.gg/mXrTXhB)!')
			.addField('1!info', 'Shows bot info')
			.addField('1!queue', 'Shows current queue info.')
			.addField('1!s [search term]', 'Search OneSearch for towns, nations, discords, and more.')
			.addField('1!n [nation]', 'Finds nation information')
			.addField('1!nonation', 'Gets towns without a nation')
			.addField('1!t [town]', 'Finds town information')
			.addField('1!notown', 'Gets towns without a nation')
			.addField('1!pl [username or UUID]', 'Gets player information')
		message.channel.send(helpEmbed);
	}
};
