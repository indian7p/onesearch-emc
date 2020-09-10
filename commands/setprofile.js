const Discord = require('discord.js');
const { PlayerP } = require('../models/models');
const { errorMessage } = require('../functions/statusMessage');
const youtube = require('./setprofile/youtube');
const twitter = require('./setprofile/twitter');
const twitch = require('./setprofile/twitch');

module.exports = {
	name: 'setprofile',
	description: 'Sets profile information',
	execute: async (message, args) => {
		const helpEmbed = new Discord.MessageEmbed()
			.setTitle('1!setprofile')
			.setDescription('Using `null` as the value will clear that type')
			.setColor(0x003175)
			.addField('1!setpl historyevent', 'Added a history event')
			.addField('1!setpl status', 'Sets a players CASST status. Valid statuses: <:verified:726833035999182898> Verified, ⚠️ Scammer, ⛔ BANNED')
      .setFooter('OneSearch', 'https://cdn.bcow.xyz/assets/onesearch.png');
      
    const player = await PlayerP.findOne({ discord: message.author.id }).exec().catch(err => message.channel.send(errorMessage.setDescription('An error occurred.')));

    if (!player) return message.channel.send(errorMessage.setDescription('You have not linked your Minecraft account with Discord. Use 1!link to link.'));

    if (!args[1]) return message.channel.send(helpEmbed);
		if (!args[2]) return message.channel.send(errorMessage.setDescription('Missing value, use null to delete. Command usage: 1!setpl [type] [player] [value] <- Missing'));

		switch (args[1]) {
      case 'youtube':
        youtube(message, args, player);
        break;
      case 'twitter':
        twitter(message, args, player);
        break;
      case 'twitch':
        twitch(message, args, player);
        break;
      case 'desc':
        break;
      case 'unlink':
        break;
    }
	}
};