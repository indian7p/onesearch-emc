const {embed} = require('../functions/statusMessage')

module.exports = {
	name: 'info',
	description: 'Shows bot information',
	execute(message) {
		const helpEmbed = embed
			.setTitle('Info')
			.setDescription('Find towns, nations, and discords with OneSearch for EarthMC. Issues? Open an issue on [GitHub](https://github.com/imabritishcow/onesearch-emc).')
			.addField('Discord', 'https://discord.gg/mXrTXhB')
			.addField('Statuspage', 'https://bcow.statuspage.io')
      .addField('GitHub', 'https://github.com/imabritishcow/onesearch-emc')
      .addField('Bot Invite', 'https://l.bcow.tk/osbot/')
			.addField('Trello', 'https://trello.com/b/LVy0jGYg/onesearch')
			.addField('Report result', 'https://searchsafe.bcow.tk/')
		message.channel.send(helpEmbed);
	}
};
