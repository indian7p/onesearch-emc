const Discord = require('discord.js'),
	cache = require('quick.db'),
	fetch = require('node-fetch'),
  moment = require('moment-timezone'),
  config = require('../config.json')
	casst = new cache.table('casst'),
	players = new cache.table('players');

let date = moment().tz('America/New_York').format('MMMM D YYYY h:mm A z');

module.exports = {
	name: 'setpl',
	description: 'Sets player information',
	execute: (message, args, Town, Nation, client) => {
		let successMessage = new Discord.MessageEmbed().setTitle(':white_check_mark: **Success!**').setColor(0x07bf63).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		let helpEmbed = new Discord.MessageEmbed()
			.setTitle('1!setpl')
			.setDescription('Using `null` as the value will clear that type')
			.setColor(0x3fb4ff)
			.addField('1!setpl desc', 'Sets a players description')
			.addField('1!setpl discord', 'Sets a players discord')
			.addField('1!setpl historyevent', 'Added a history event')
			.addField('1!setpl status', 'Sets a players CASST status. Valid statuses: <:verified:696564425775251477> Verified, ⚠️ Scammer, ⛔ BANNED')
			.addField('1!setpl rank', 'Sets the players in-game rank. Valid ranks: Mod, Admin, Owner')
			.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
    
    if(!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription("You do not have permission to use this command."));

		if (!args[2]) return message.channel.send(errorMessage.setDescription('Missing username or UUID. Command usage: 1!setpl [type] [player] <- Missing [value]'));
		if (!args[3]) return message.channel.send(errorMessage.setDescription('Missing value, use null to delete. Command usage: 1!setpl [type] [player] [value] <- Missing'));
		fetch(`https://playerdb.co/api/player/minecraft/${args[2]}`)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				switch (args[1]) {
					case 'desc':
						if (args[3] == 'null') {
							players.delete(`${data.data.player.raw_id}.desc`);
							message.channel.send(successMessage.setDescription(`Cleared the player's description`));
							return;
						}
						players.set(`${data.data.player.raw_id}.desc`, message.content.slice(15 + args[2].length));
						message.channel.send(successMessage.setDescription(`Set ${args[2]}'s description to ${message.content.slice(15 + args[2].length)}`));
						break;
					case 'discord':
						if (args[3] == 'null') {
							players.delete(`${data.data.player.raw_id}.discord`);
							message.channel.send(successMessage.setDescription(`Cleared the player's discord`));
							return;
						}
						players.set(`${data.data.player.raw_id}.discord`, `<@${message.mentions.users.first().id}>`);
						message.channel.send(successMessage.setDescription(`Set ${args[2]}'s discord to <@${message.mentions.users.first().id}>`));
						break;
					case 'historyevent':
						if (args[3] == 'null') {
							players.delete(`${data.data.player.raw_id}.history`);
							message.channel.send(successMessage.setDescription(`Cleared the player's history`));
							return;
						}
						players.push(`${data.data.player.raw_id}.history`, `${date} - ${casst.get(`${data.data.player.raw_id}`)} - ${message.content.slice(10 + args[1].length + args[2].length)}`);
						message.channel.send(successMessage.setDescription(`Added a history event for ${args[2]}`));
						break;
					case 'status':
						if (args[3] == 'null') {
							casst.delete(`${data.data.player.raw_id}`);
							message.channel.send(successMessage.setDescription(`Cleared the player's status`));
							return;
						}
						casst.set(`${data.data.player.raw_id}`, message.content.slice(15 + args[2].length));
						if (args[3].includes('BANNED') || args[4].includes('BANNED')) {
							players.push(`${data.data.player.raw_id}.history`, `${date} - ⛔ BANNED - Banned`);
						}
						message.channel.send(successMessage.setDescription(`Set ${args[2]}'s status to ${message.content.slice(15 + args[2].length)}`));
						break;
					case 'rank':
						if (args[3] == 'null') {
							players.delete(`${data.data.player.raw_id}.rank`);
							message.channel.send(successMessage.setDescription(`Cleared the player's rank`));
							return;
						}
						players.set(`${data.data.player.raw_id}.rank`, args[3]);
						message.channel.send(successMessage.setDescription(`Set ${args[2]}'s rank to ${args[3]}`));
						break;
					default:
						message.channel.send(helpEmbed);
						break;
				}
			});
	}
};
