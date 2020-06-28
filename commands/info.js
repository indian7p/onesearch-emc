const Discord = require('discord.js');

module.exports = {
	name: 'info',
	description: 'Shows bot information',
	execute(message) {
		const helpEmbed = new Discord.MessageEmbed()
			.setTitle('Info')
			.setDescription('Find towns, nations, and discords with OneSearch for EarthMC. Issues? Open an issue on [GitHub](https://github.com/imabritishcow/onesearch-emc).')
			.setThumbnail('https://cdn.bcow.tk/assets/logo-new.png')
			.setColor(0x003175)
			.addField('Add Search Item (Google Forms)', 'https://l.bcow.tk/add-item/')
			.addField('Statuspage', 'https://bcow.statuspage.io')
      .addField('GitHub', 'https://github.com/imabritishcow/onesearch-emc')
      .addField('Bot Invite', 'https://l.bcow.tk/osbot/')
			.addField('Trello', 'https://trello.com/b/LVy0jGYg/onesearch')
			.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		message.channel.send(helpEmbed);
	}
};
