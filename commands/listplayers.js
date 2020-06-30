const Discord = require('discord.js'),
	fetch = require('node-fetch'),
	config = require('../config.json');

module.exports = {
	name: 'listplayers',
	description: 'Lists all players in the database.',
	execute: (message, Player) => {
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

		Player.find({}, function (err, players) {
			if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

			players.forEach(player => {
				fetch(`https://playerdb.co/api/player/minecraft/${player.id}`)
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						let embed = new Discord.MessageEmbed()
							.setTitle(data.data.player.username.replace(/_/g, '\_'))
							.setURL(`https://namemc.com/${player.id}`)
							.setThumbnail(`https://crafatar.com/avatars/${player.id}?overlay`)
							.setColor(0x003175)
							.setDescription(player.status)
							.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
						message.channel.send(embed);
					});
			})
		})
	}
};