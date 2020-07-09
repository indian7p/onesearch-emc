const Discord = require('discord.js'),
	fetch = require('node-fetch'),
	moment = require('moment-timezone'),
	config = require('../config.json'),
	date = moment().tz('America/New_York').format('MMMM D YYYY h:mm A z');

module.exports = {
	name: 'setpl',
	description: 'Sets player information',
	execute: (message, args, Player) => {
		let successMessage = new Discord.MessageEmbed().setTitle(':white_check_mark: **Success!**').setColor(0x07bf63).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		let errorMessage = new Discord.MessageEmbed().setTitle(':x: **Error**').setColor(0xdc2e44).setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');
		let helpEmbed = new Discord.MessageEmbed()
			.setTitle('1!setpl')
			.setDescription('Using `null` as the value will clear that type')
			.setColor(0x003175)
			.addField('1!setpl historyevent', 'Added a history event')
			.addField('1!setpl status', 'Sets a players CASST status. Valid statuses: <:verified:726833035999182898> Verified, ⚠️ Scammer, ⛔ BANNED')
			.setFooter('OneSearch', 'https://cdn.bcow.tk/assets/logo-new.png');

		if (!config.BOT_ADMINS.includes(message.author.id)) return message.channel.send(errorMessage.setDescription('You do not have permission to use this command.'));

		if (!args[2]) return message.channel.send(errorMessage.setDescription('Missing username or UUID. Command usage: 1!setpl [type] [player] <- Missing [value]'));
		if (!args[3]) return message.channel.send(errorMessage.setDescription('Missing value, use null to delete. Command usage: 1!setpl [type] [player] [value] <- Missing'));

		fetch(`https://playerdb.co/api/player/minecraft/${args[2]}`)
			.then(res => {
				return res.json();
			})
			.then(data => {
				Player.findOne({ id: data.data.player.raw_id }, function (err, player) {
					if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));

					switch (args[1]) {
						case 'historyevent':
							if (args[3] == 'null') {
								if (player) {
									player.history = null;
									player.save();
								}

								message.channel.send(successMessage.setDescription(`Cleared the player's history.`));
								return;
							}

							if (player) {
								let old = player.history;
								let newElement = [`${date} - ${player.status} - ${message.content.slice(10 + args[1].length + args[2].length)}`];

								player.history = [...old, ...newElement];

								player.save(function (err) {
									if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
									message.channel.send(successMessage.setDescription(`Added a history event for ${data.data.player.username}.`));
								})
							}else{
								return message.channel.send(errorMessage.setDescription('Set a status before adding a history event.'))
							}
							break;
						case 'status':
							if (args[3] == 'null') {
								if (player) {
									player.history = null;
									player.save();
								}

								message.channel.send(successMessage.setDescription(`Cleared the player's status.`));
								return;
							}

							if (player) {
								player.status = message.content.slice(15 + args[2].length);
							}else{
								let newDoc = new Player({
									id: data.data.player.raw_id,
									status: message.content.slice(15 + args[2].length)
								})
								newDoc.save(function (err) {
									if (err) return message.channel.send(errorMessage.setDescription('An error occurred.'));
									message.channel.send(successMessage.setDescription(`Set ${args[2]}'s status to ${message.content.slice(15 + args[2].length)}.`));
								})
							}
							break;
						default:
							message.channel.send(helpEmbed);
							break;
					}
				})
			});
	}
};